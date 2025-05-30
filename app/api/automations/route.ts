import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Verify the request is from a trusted source (optional)
    // const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET;

    // if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    console.log(
      `[CRON] Starting automation job at ${new Date().toISOString()}`
    );

    // Process all automations
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/automations/process`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Automation processing failed: ${response.statusText}`);
    }

    const result = await response.json();

    console.log(`[CRON] Automation job completed:`, result);

    return NextResponse.json({
      success: true,
      message: "Automation cron job executed successfully",
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (error) {
    console.error("[CRON] Error in automation cron job:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Cron job failed",
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
// For manual triggering via POST (admin use)
export async function POST(req: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;

    // if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    console.log(
      `[CRON] Starting automation job at ${new Date().toISOString()}`
    );

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/automations/process`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Automation processing failed: ${response.statusText}`);
    }

    const result = await response.json();

    console.log(`[CRON] Automation job completed:`, result);

    return NextResponse.json({
      success: true,
      message: "Automation cron job executed successfully",
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (error) {
    console.error("[CRON] Error in automation cron job:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Cron job failed",
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
