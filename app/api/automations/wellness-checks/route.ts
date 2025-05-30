import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { calculateNextReminderTime } from "../medication-reminders/route";

// Background service to process wellness checks
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    const now = new Date();

    // Find all active wellness checks that are due
    const { data: dueChecks, error: fetchError } = await supabase
      .from("wellness_checks")
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
      .lte("next_check_at", now.toISOString());

    if (fetchError) {
      console.error("Error fetching due wellness checks:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch wellness checks" },
        { status: 500 }
      );
    }

    if (!dueChecks || dueChecks.length === 0) {
      return NextResponse.json({
        message: "No wellness checks due",
        processed: 0,
      });
    }

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    // Process each due wellness check
    for (const check of dueChecks) {
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
              userId: check.user_id,
              phoneNumber: check.users.phone,
              callType: "wellness_check",
              message: `Hello ${
                check.users.name || "there"
              }, this is Alafia. I'm calling to check how you're feeling today.`,
            }),
          }
        );

        if (!callResponse.ok) {
          throw new Error(
            `Failed to initiate call: ${callResponse.statusText}`
          );
        }

        const callData = await callResponse.json();

        // Calculate next check time based on frequency
        const nextCheckAt = new Date(now);
        nextCheckAt.setHours(nextCheckAt.getHours() + check.frequency_hours);

        const next_check_at_iso = calculateNextReminderTime(
          check.schedule_time,
          check.frequency,
          check.next_check_at
        );

        // Update the wellness check status
        const { error: updateError } = await supabase
          .from("wellness_checks")
          .update({
            next_check_at: next_check_at_iso,
            last_check_at: now.toISOString(),
            status: "completed",
          })
          .eq("id", check.id);

        if (updateError) {
          throw new Error(
            `Failed to update wellness check: ${updateError.message}`
          );
        }

        // Log the automation activity
        await supabase.from("automation_logs").insert({
          type: "wellness_check",
          entity_id: check.id,
          user_id: check.user_id,
          status: "success",
          details: `Wellness check call initiated successfully. Call ID: ${callData.call_id}`,
          executed_at: now.toISOString(),
        });

        results.push({
          checkId: check.id,
          userId: check.user_id,
          status: "success",
          callId: callData.call_id,
          nextCheckAt: nextCheckAt.toISOString(),
        });

        successCount++;
      } catch (error: any) {
        console.error(`Error processing wellness check ${check.id}:`, error);

        // Log the error
        await supabase.from("automation_logs").insert({
          type: "wellness_check",
          entity_id: check.id,
          user_id: check.user_id,
          status: "error",
          details: `Error: ${error.message}`,
          executed_at: now.toISOString(),
        });

        results.push({
          checkId: check.id,
          userId: check.user_id,
          status: "error",
          error: error.message,
        });

        errorCount++;
      }
    }

    return NextResponse.json({
      message: `Processed ${dueChecks.length} wellness checks`,
      processed: dueChecks.length,
      successful: successCount,
      errors: errorCount,
      results,
    });
  } catch (error) {
    console.error("Error in wellness check automation:", error);
    return NextResponse.json(
      { error: "Internal server error in automation service" },
      { status: 500 }
    );
  }
}
