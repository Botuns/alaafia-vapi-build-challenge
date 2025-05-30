// app/api/vapi/webhook/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    console.log("Vapi webhook received:", JSON.stringify(body, null, 2));

    // Handle different message types
    switch (message.type) {
      case "function-call":
        return await handleFunctionCall(message);

      case "transcript":
        return await handleTranscript(message);

      case "call-end":
        return await handleCallEnd(message);

      case "call-start":
        return await handleCallStart(message);

      default:
        console.log("Unhandled message type:", message.type);
        return NextResponse.json({ received: true });
    }
  } catch (error) {
    console.error("Error processing Vapi webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleFunctionCall(message: any) {
  const { functionCall, call } = message;
  const supabase = getSupabaseServerClient();

  try {
    switch (functionCall.name) {
      case "logWellnessCheck":
        const wellnessData = JSON.parse(functionCall.parameters);

        // Store wellness check data
        await supabase.from("wellness_checks").insert({
          call_id: call.id,
          user_mood: wellnessData.mood,
          concerns: wellnessData.concerns,
          notes: wellnessData.notes,
          created_at: new Date().toISOString(),
        });

        return NextResponse.json({
          result:
            "Wellness check logged successfully. Thank you for sharing how you're feeling.",
        });

      case "logMedicationReminder":
        const medicationData = JSON.parse(functionCall.parameters);

        // Store medication reminder data
        await supabase.from("medication_logs").insert({
          call_id: call.id,
          medication_taken: medicationData.taken,
          will_take: medicationData.willTake,
          concerns: medicationData.concerns,
          created_at: new Date().toISOString(),
        });

        const responseMessage = medicationData.taken
          ? "Great! I've noted that you've taken your medication today."
          : medicationData.willTake
          ? "Thank you for promising to take your medication. I've made a note of our conversation."
          : "I understand. Please remember that taking your medication as prescribed is important for your health.";

        return NextResponse.json({
          result: responseMessage,
        });

      default:
        console.log("Unknown function call:", functionCall.name);
        return NextResponse.json({
          result: "Function executed successfully.",
        });
    }
  } catch (error) {
    console.error("Error handling function call:", error);
    return NextResponse.json({
      result:
        "I encountered an issue processing that information, but let's continue our conversation.",
    });
  }
}

async function handleTranscript(message: any) {
  const { transcript, call } = message;
  const supabase = getSupabaseServerClient();

  // Store transcript in database
  try {
    await supabase.from("call_transcripts").insert({
      call_id: call.id,
      transcript: transcript.text,
      speaker: transcript.user ? "user" : "assistant",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error storing transcript:", error);
  }

  return NextResponse.json({ received: true });
}

async function handleCallEnd(message: any) {
  const { call } = message;
  const supabase = getSupabaseServerClient();

  try {
    // Update call status in database
    await supabase
      .from("calls")
      .update({
        status: "completed",
        ended_at: new Date().toISOString(),
        duration: call.duration,
      })
      .eq("vapi_call_id", call.id);

    console.log("Call ended:", call.id);
  } catch (error) {
    console.error("Error updating call end status:", error);
  }

  return NextResponse.json({ received: true });
}

async function handleCallStart(message: any) {
  const { call } = message;
  const supabase = getSupabaseServerClient();

  try {
    // Update call status in database
    await supabase
      .from("calls")
      .update({
        status: "in_progress",
        started_at: new Date().toISOString(),
      })
      .eq("vapi_call_id", call.id);

    console.log("Call started:", call.id);
  } catch (error) {
    console.error("Error updating call start status:", error);
  }

  return NextResponse.json({ received: true });
}
