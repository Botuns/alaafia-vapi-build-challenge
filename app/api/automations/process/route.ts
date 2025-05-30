import { type NextRequest, NextResponse } from "next/server";

// Main automation processor - can be called by cron job or scheduled task
export async function POST(req: NextRequest) {
  try {
    const results = {
      wellnessChecks: null,
      medicationReminders: null,
      errors: [] as string[],
    };

    // Process wellness checks
    try {
      const wellnessResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/automations/wellness-checks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (wellnessResponse.ok) {
        results.wellnessChecks = await wellnessResponse.json();
      } else {
        results.errors.push(
          `Wellness checks failed: ${wellnessResponse.statusText}`
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        results.errors.push(
          `Wellness checks error: ${
            error instanceof Error ? error.message : "An unknown error occurred"
          }`
        );
      }
    }

    // Process medication reminders
    try {
      const medicationResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/automations/medication-reminders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (medicationResponse.ok) {
        results.medicationReminders = await medicationResponse.json();
      } else {
        results.errors.push(
          `Medication reminders failed: ${medicationResponse.statusText}`
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        results.errors.push(`Medication reminders error: ${error.message}`);
      } else {
        results.errors.push(
          "Medication reminders error: An unknown error occurred"
        );
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error) {
    console.error("Error in main automation processor:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error in automation processor",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// GET to check automation status
export async function GET() {
  return NextResponse.json({
    status: "active",
    message: "Automation service is running",
    timestamp: new Date().toISOString(),
    endpoints: [
      "/api/automations/wellness-checks",
      "/api/automations/medication-reminders",
      "/api/automations/process",
    ],
  });
}
