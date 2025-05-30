import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import {
  makeOutboundCall,
  createWellnessCheckAssistant,
  createMedicationReminderAssistant,
  createEntertainmentAssistant,
  listAssistants,
} from "@/lib/vapi";

const VAPI_PHONE_NUMBER_ID = process.env.VAPI_PHONE_NUMBER_ID;

// POST to create a new call
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, phoneNumber, callType, message, assistantId } = body;
    const supabase = getSupabaseServerClient();

    // Validate required fields
    if (!userId || !phoneNumber) {
      return NextResponse.json(
        {
          error: "Missing required fields: userId and phoneNumber are required",
        },
        { status: 400 }
      );
    }

    if (!VAPI_PHONE_NUMBER_ID) {
      return NextResponse.json(
        {
          error:
            "Phone number not configured. Please set VAPI_PHONE_NUMBER_ID environment variable.",
        },
        { status: 500 }
      );
    }

    // Get user details
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Error fetching user:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let finalAssistantId = assistantId;

    // If no assistant ID provided, create one based on call type
    if (!finalAssistantId) {
      let assistantResponse;

      try {
        switch (callType) {
          case "wellness_check":
            assistantResponse = await createWellnessCheckAssistant(
              userData.name || "there"
            );
            break;
          case "medication_reminder":
            assistantResponse = await createMedicationReminderAssistant(
              userData.name || "there"
            );
            break;
          case "entertainment":
            assistantResponse = await createEntertainmentAssistant(
              userData.name || "there"
            );
            break;
          default:
            assistantResponse = await createWellnessCheckAssistant(
              userData.name || "there"
            );
        }

        finalAssistantId = assistantResponse.id;
      } catch (assistantError) {
        console.error("Error creating assistant:", assistantError);
        return NextResponse.json(
          { error: "Failed to create assistant for call" },
          { status: 500 }
        );
      }
    }

    // Make the call using Vapi
    const callResponse = await makeOutboundCall({
      assistantId: finalAssistantId,
      customer: {
        number: phoneNumber,
      },
      phoneNumberId: VAPI_PHONE_NUMBER_ID,
    });

    // Store the call in the database
    const { data: callData, error: callError } = await supabase
      .from("calls")
      .insert({
        user_id: userId,
        vapi_call_id: callResponse.id,
        vapi_assistant_id: finalAssistantId,
        call_type: callType || "general",
        status: "initiated",
        phone_number: phoneNumber,
      })
      .select()
      .single();

    if (callError) {
      console.error("Error storing call:", callError);
      return NextResponse.json(
        { error: "Failed to store call record" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Call initiated to ${phoneNumber}`,
      call_id: callData.id,
      vapi_call_id: callResponse.id,
      assistant_id: finalAssistantId,
      status: "initiated",
    });
  } catch (error) {
    console.error("Error initiating call:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

// GET call history
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const supabase = getSupabaseServerClient();

    let query = supabase
      .from("calls")
      .select("*")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: calls, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ calls });
  } catch (error) {
    console.error("Error fetching call history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET assistants list
export async function PATCH(req: NextRequest) {
  try {
    const assistants = await listAssistants();
    return NextResponse.json({ assistants });
  } catch (error) {
    console.error("Error fetching assistants:", error);
    return NextResponse.json(
      { error: "Failed to fetch assistants" },
      { status: 500 }
    );
  }
}
