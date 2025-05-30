import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

// Define interfaces for the request body
interface EmergencyContact {
  name: string;
  phone: string;
  relationship?: string;
}

interface Medication {
  name: string;
  time: string;
  frequency?: string;
}

interface UserPreferences {
  stories?: string[];
  music?: string[];
  callTimes?: string[];
}

interface CreateUserRequest {
  name: string;
  age: number;
  phone: string;
  email: string;
  password: string;
  location?: string;
  emergencyContacts?: EmergencyContact[];
  medications?: Medication[];
  preferences?: UserPreferences;
}

// Type guard to check if a field exists in CreateUserRequest
function isValidUserField(field: string): field is keyof CreateUserRequest {
  return (
    field in
    {
      name: true,
      age: true,
      phone: true,
      email: true,
      password: true,
      location: true,
      emergencyContacts: true,
      medications: true,
      preferences: true,
    }
  );
}

// GET all users
export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    const { data: users, error } = await supabase
      .from("users")
      .select(
        `
        *,
        emergency_contacts(*),
        medications(*),
        preferences(*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST to create a new user
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateUserRequest;
    const supabase = getSupabaseServerClient();

    // Validate required fields
    const requiredFields = [
      "name",
      "age",
      "phone",
      "email",
      "password",
    ] as const;
    for (const field of requiredFields) {
      if (!isValidUserField(field) || !body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // 1. Create the user in Supabase Auth with email confirmation disabled
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
      options: {
        data: {
          name: body.name,
          age: body.age,
          phone: body.phone,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      },
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error("Failed to create user account");
    }

    // 2. Update the user's email confirmation status
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      authData.user.id,
      { email_confirm: true }
    );

    if (updateError) {
      // If we can't confirm the email, clean up the user
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error("Failed to confirm user email");
    }

    const userId = authData.user.id;

    // 2. Insert the user profile
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        id: userId, // Use the auth user's ID
        name: body.name,
        age: body.age,
        phone: body.phone,
        location: body.location || "",
        email: body.email,
      })
      .select()
      .single();

    if (userError) {
      // If profile creation fails, we should clean up the auth user
      await supabase.auth.admin.deleteUser(userId);
      throw userError;
    }

    // 3. Insert emergency contacts if provided
    if (body.emergencyContacts && body.emergencyContacts.length > 0) {
      const contactsToInsert = body.emergencyContacts
        .filter((contact: EmergencyContact) => contact.name && contact.phone)
        .map((contact: EmergencyContact) => ({
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

    // 4. Insert medications if provided
    if (body.medications && body.medications.length > 0) {
      const medicationsToInsert = body.medications
        .filter((med: Medication) => med.name && med.time)
        .map((med: Medication) => ({
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

    // 5. Insert preferences
    const { error: prefsError } = await supabase.from("preferences").insert({
      user_id: userId,
      stories: body.preferences?.stories || [],
      music: body.preferences?.music || [],
      call_times: body.preferences?.callTimes || ["9:00 AM", "7:00 PM"],
    });

    if (prefsError) {
      throw prefsError;
    }

    // Fetch the complete user data with relationships
    const { data: completeUser, error: fetchError } = await supabase
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
      message: "User created successfully",
      user: completeUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
