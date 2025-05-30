import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

// GET a specific wellness check
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const wellnessCheckId = (await params).id;
    const supabase = getSupabaseServerClient();

    const { data: wellnessCheck, error } = await supabase
      .from("wellness_checks")
      .select(
        `
        *,
        wellness_responses(*)
      `
      )
      .eq("id", wellnessCheckId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Wellness check not found" },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ wellnessCheck });
  } catch (error) {
    console.error("Error fetching wellness check:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT to update a wellness check
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const wellnessCheckId = (await params).id;
    const body = await req.json();
    const { scheduleTime, frequency, active } = body;
    const supabase = getSupabaseServerClient();

    // Calculate next check time if schedule changed
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (scheduleTime && frequency) {
      updateData.schedule_time = scheduleTime;
      updateData.frequency = frequency;
      updateData.next_check_at = calculateNextCheckTime(
        scheduleTime,
        frequency
      );
    } else if (scheduleTime) {
      // Get current frequency
      const { data: currentCheck } = await supabase
        .from("wellness_checks")
        .select("frequency")
        .eq("id", wellnessCheckId)
        .single();
      if (!currentCheck) {
        throw new Error("Wellness check not found");
      }

      updateData.schedule_time = scheduleTime;
      updateData.next_check_at = calculateNextCheckTime(
        scheduleTime,
        currentCheck.frequency
      );
    } else if (frequency) {
      // Get current schedule time
      const { data: currentCheck } = await supabase
        .from("wellness_checks")
        .select("schedule_time")
        .eq("id", wellnessCheckId)
        .single();
      if (!currentCheck) {
        throw new Error("Wellness check not found");
      }

      updateData.frequency = frequency;
      updateData.next_check_at = calculateNextCheckTime(
        currentCheck.schedule_time,
        frequency
      );
    }

    if (active !== undefined) {
      updateData.active = active;
    }

    const { data, error } = await supabase
      .from("wellness_checks")
      .update(updateData)
      .eq("id", wellnessCheckId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Wellness check updated successfully",
      wellnessCheck: data,
    });
  } catch (error) {
    console.error("Error updating wellness check:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE a wellness check
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const wellnessCheckId = (await params).id;
    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from("wellness_checks")
      .delete()
      .eq("id", wellnessCheckId);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Wellness check deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting wellness check:", error);
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
