import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

// Background service to process medication reminders
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    const now = new Date();

    // Find all active medication reminders that are due
    const { data: dueReminders, error: fetchError } = await supabase
      .from("medication_reminders")
      .select(
        `
        *,
        users (
          id,
          name,
          phone
        )
      `
      )
      .eq("active", true)
      .lte("next_reminder_at", now.toISOString());

    if (fetchError) {
      console.error("Error fetching due medication reminders:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch medication reminders" },
        { status: 500 }
      );
    }

    if (!dueReminders || dueReminders.length === 0) {
      return NextResponse.json({
        message: "No medication reminders due",
        processed: 0,
      });
    }

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    // Process each due medication reminder
    for (const reminder of dueReminders) {
      try {
        // Make the call
        const callResponse = await fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
          }/api/calls`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: reminder.user_id,
              phoneNumber: reminder.users.phone,
              callType: "medication_reminder",
              message: `Hello ${
                reminder.users.name || "there"
              }, this is Alafia. I'm calling to remind you about your ${
                reminder.medication_name
              } medication.`,
            }),
          }
        );

        if (!callResponse.ok) {
          throw new Error(
            `Failed to initiate call: ${callResponse.statusText}`
          );
        }

        const callData = await callResponse.json();

        // Update the medication reminder status and calculate next reminder time
        const nextReminderAt = calculateNextReminderTime(
          reminder.reminder_times,
          reminder.frequency,
          reminder.next_reminder_at
        );

        const { error: updateError } = await supabase
          .from("medication_reminders")
          .update({
            next_reminder_at: nextReminderAt,
            last_check_at: now.toISOString(),
            status: "completed",
          })
          .eq("id", reminder.id);

        if (updateError) {
          throw new Error(
            `Failed to update medication reminder: ${updateError.message}`
          );
        }

        // Log the automation activity
        await supabase.from("automation_logs").insert({
          type: "medication_reminder",
          entity_id: reminder.id,
          user_id: reminder.user_id,
          status: "success",
          details: `Medication reminder call initiated successfully. Call ID: ${callData.vapi_call_id}`,
          executed_at: now.toISOString(),
        });

        results.push({
          reminderId: reminder.id,
          userId: reminder.user_id,
          medicationName: reminder.medication_name,
          status: "success",
          callId: callData.call_id,
          nextReminderAt,
        });

        successCount++;
      } catch (error: any) {
        console.error(
          `Error processing medication reminder ${reminder.id}:`,
          error
        );

        // Log the error
        await supabase.from("automation_logs").insert({
          type: "medication_reminder",
          entity_id: reminder.id,
          user_id: reminder.user_id,
          status: "error",
          details: `Error: ${error.message}`,
          executed_at: now.toISOString(),
        });

        results.push({
          reminderId: reminder.id,
          userId: reminder.user_id,
          medicationName: reminder.medication_name,
          status: "error",
          error: error.message,
        });

        errorCount++;
      }
    }

    return NextResponse.json({
      message: `Processed ${dueReminders.length} medication reminders`,
      processed: dueReminders.length,
      successful: successCount,
      errors: errorCount,
      results,
    });
  } catch (error) {
    console.error("Error in medication reminder automation:", error);
    return NextResponse.json(
      { error: "Internal server error in automation service" },
      { status: 500 }
    );
  }
}

// Helper function to calculate the next reminder time
export function calculateNextReminderTime(
  reminderTimes: string[],
  frequency: string,
  currentDueTimeISO: string
): string {
  const now = new Date();
  const currentDueTime = new Date(currentDueTimeISO);

  // If multiple reminder times per day, find the next one
  if (reminderTimes && reminderTimes.length > 0) {
    const sortedTimes = [...reminderTimes].sort();

    // First, try to find a later time slot on the same day
    for (const timeStr of sortedTimes) {
      const [hourStr, minuteStr, period] =
        timeStr.match(/(\d+):(\d+)\s*([AP]M)/i)?.slice(1) || [];

      if (hourStr && minuteStr && period) {
        let hour = Number.parseInt(hourStr, 10);
        const minute = Number.parseInt(minuteStr, 10);

        if (period.toUpperCase() === "PM" && hour < 12) {
          hour += 12;
        } else if (period.toUpperCase() === "AM" && hour === 12) {
          hour = 0;
        }

        const reminderTime = new Date(currentDueTime);
        reminderTime.setHours(hour, minute, 0, 0);

        if (reminderTime > now) {
          return reminderTime.toISOString();
        }
      }
    }
  }

  // If no valid time found for today, calculate next day based on frequency
  const nextDate = new Date(currentDueTime);

  switch (frequency.toLowerCase()) {
    case "daily":
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case "weekly":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    default:
      // Default to daily if frequency is not recognized
      nextDate.setDate(nextDate.getDate() + 1);
  }

  // Set the time to the first reminder time of the day
  if (reminderTimes && reminderTimes.length > 0) {
    const firstTime = reminderTimes[0];
    const [hourStr, minuteStr, period] =
      firstTime.match(/(\d+):(\d+)\s*([AP]M)/i)?.slice(1) || [];

    if (hourStr && minuteStr && period) {
      let hour = Number.parseInt(hourStr, 10);
      const minute = Number.parseInt(minuteStr, 10);

      if (period.toUpperCase() === "PM" && hour < 12) {
        hour += 12;
      } else if (period.toUpperCase() === "AM" && hour === 12) {
        hour = 0;
      }

      nextDate.setHours(hour, minute, 0, 0);
    }
  }

  return nextDate.toISOString();
}
