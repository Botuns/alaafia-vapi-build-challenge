import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get("limit")) || 50
    const type = searchParams.get("type") // 'wellness_check' or 'medication_reminder'
    
    const supabase = getSupabaseServerClient()

    // Fetch recent logs
    let logsQuery = supabase
      .from("automation_logs")
      .select(`
        *,
        users (
          name,
          phone
        )
      `)
      .order("executed_at", { ascending: false })
      .limit(limit)

    if (type) {
      logsQuery = logsQuery.eq("type", type)
    }

    const { data: logs, error: logsError } = await logsQuery

    if (logsError) {
      throw logsError
    }

    // Get today's stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { data: todayStats, error: statsError } = await supabase
      .from("automation_logs")
      .select("type, status")
      .gte("executed_at", today.toISOString())
      .lt("executed_at", tomorrow.toISOString())

    if (statsError) {
      console.error("Error fetching stats:", statsError)
    }

    // Calculate stats
    const stats = {
      todayWellnessChecks: todayStats?.filter(s => s.type === 'wellness_check').length || 0,
      todayMedicationReminders: todayStats?.filter(s => s.type === 'medication_reminder').length || 0,
      totalSuccessful: todayStats?.filter(s => s.status === 'success').length || 0,
      totalErrors: todayStats?.filter(s => s.status === 'error').length || 0
    }

    return NextResponse.json({
      logs: logs || [],
      stats,
      total: logs?.length || 0
    })

  } catch (error) {
    console.error("Error fetching automation logs:", error)
    return NextResponse.json(
      { error: "Failed to fetch automation logs" },
      { status: 500 }
    )
  }
}