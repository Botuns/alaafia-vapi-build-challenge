import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

// GET a specific user by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = (await params).id;
    const supabase = getSupabaseServerClient();

    const { data: user, error } = await supabase
      .from("users")
      .select(
        `
        *,
        emergency_contacts(*),
        medications(*),
        preferences(*)
      `
      )
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT to update a user
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = (await params).id;
    const body = await req.json();
    const supabase = getSupabaseServerClient();

    // Validate required fields
    const requiredFields = ["name", "age", "phone"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // 1. Update the user
    const { error: userError } = await supabase
      .from("users")
      .update({
        name: body.name,
        age: body.age,
        phone: body.phone,
        location: body.location || "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (userError) {
      throw userError;
    }

    // 2. Handle emergency contacts
    if (body.emergencyContacts) {
      // Delete existing contacts
      const { error: deleteError } = await supabase
        .from("emergency_contacts")
        .delete()
        .eq("user_id", userId);

      if (deleteError) {
        throw deleteError;
      }

      // Insert new contacts
      const contactsToInsert = body.emergencyContacts
        .filter(
          (contact: { name: any; phone: any }) => contact.name && contact.phone
        )
        .map((contact: { name: any; phone: any; relationship: any }) => ({
          user_id: userId,
          name: contact.name,
          phone: contact.phone,
          relationship: contact.relationship || "",
        }));

      if (contactsToInsert.length > 0) {
        const { error: contactsError } = await supabase
          .from("emergency_contacts")
          .insert(contactsToInsert);

        if (contactsError) {
          throw contactsError;
        }
      }
    }

    // 3. Handle medications
    if (body.medications) {
      // Delete existing medications
      const { error: deleteError } = await supabase
        .from("medications")
        .delete()
        .eq("user_id", userId);

      if (deleteError) {
        throw deleteError;
      }

      // Insert new medications
      const medicationsToInsert = body.medications
        .filter((med: { name: any; time: any }) => med.name && med.time)
        .map((med: { name: any; time: any; frequency: any }) => ({
          user_id: userId,
          name: med.name,
          time: med.time,
          frequency: med.frequency || "daily",
        }));

      if (medicationsToInsert.length > 0) {
        const { error: medsError } = await supabase
          .from("medications")
          .insert(medicationsToInsert);

        if (medsError) {
          throw medsError;
        }
      }
    }

    // 4. Update preferences
    if (body.preferences) {
      const { error: prefsError } = await supabase
        .from("preferences")
        .update({
          stories: body.preferences.stories || [],
          music: body.preferences.music || [],
          call_times: body.preferences.callTimes || ["9:00 AM", "7:00 PM"],
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (prefsError) {
        throw prefsError;
      }
    }

    // Fetch the updated user data
    const { data: updatedUser, error: fetchError } = await supabase
      .from("users")
      .select(
        `
        *,
        emergency_contacts(*),
        medications(*),
        preferences(*)
      `
      )
      .eq("id", userId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE a user
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = (await params).id;
    const supabase = getSupabaseServerClient();

    // Delete the user (cascade will handle related records)
    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
