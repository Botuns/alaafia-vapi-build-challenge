import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

// GET wellness checks
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const supabase = getSupabaseServerClient();

    let query = supabase.from("wellness_checks").select("*");

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: wellnessChecks, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ wellnessChecks });
  } catch (error) {
    console.error("Error fetching wellness checks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST to create a new wellness check
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, scheduleTime, frequency } = body;
    const supabase = getSupabaseServerClient();

    // Validate required fields
    if (!userId || !scheduleTime || !frequency) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: userId, scheduleTime, and frequency are required",
        },
        { status: 400 }
      );
    }

    // Calculate next check time
    const nextCheckAt = calculateNextCheckTime(scheduleTime, frequency);

    // Insert the wellness check
    const { data, error } = await supabase
      .from("wellness_checks")
      .insert({
        user_id: userId,
        schedule_time: scheduleTime,
        frequency: frequency,
        next_check_at: nextCheckAt,
        status: "scheduled",
        active: true,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Wellness check scheduled successfully",
      wellnessCheck: data,
    });
  } catch (error) {
    console.error("Error creating wellness check:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to calculate the next check time
function calculateNextCheckTime(
  scheduleTime: string,
  frequency: string
): string {
  const now = new Date();
  const [hourStr, minuteStr, period] =
    scheduleTime.match(/(\d+):(\d+)\s*([AP]M)/i)?.slice(1) || [];

  if (!hourStr || !minuteStr || !period) {
    // If the time format is invalid, default to tomorrow at the same time
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString();
  }

  let hour = Number.parseInt(hourStr, 10);
  const minute = Number.parseInt(minuteStr, 10);

  // Convert to 24-hour format
  if (period.toUpperCase() === "PM" && hour < 12) {
    hour += 12;
  } else if (period.toUpperCase() === "AM" && hour === 12) {
    hour = 0;
  }

  // Set the time for today
  const checkTime = new Date(now);
  checkTime.setHours(hour, minute, 0, 0);

  // If the time has already passed today, move to the next occurrence based on frequency
  if (checkTime <= now) {
    switch (frequency.toLowerCase()) {
      case "daily":
        checkTime.setDate(checkTime.getDate() + 1);
        break;
      case "weekly":
        checkTime.setDate(checkTime.getDate() + 7);
        break;
      case "monthly":
        checkTime.setMonth(checkTime.getMonth() + 1);
        break;
      default:
        checkTime.setDate(checkTime.getDate() + 1); // Default to daily
    }
  }

  return checkTime.toISOString();
}
