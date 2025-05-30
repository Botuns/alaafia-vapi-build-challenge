import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

// GET all emergency notifications
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const alertId = searchParams.get("alertId")
    const status = searchParams.get("status")
    const supabase = getSupabaseServerClient()

    let query = supabase.from("emergency_notifications").select("*")

    if (alertId) {
      query = query.eq("alert_id", alertId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data: notifications, error } = await query.order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("Error fetching emergency notifications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT to update notification status
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, deliveredAt } = body
    const supabase = getSupabaseServerClient()

    // Validate required fields
    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields: id and status are required" }, { status: 400 })
    }

    // Validate status
    if (!["pending", "sent", "delivered", "failed"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status: must be 'pending', 'sent', 'delivered', or 'failed'" },
        { status: 400 },
      )
    }

    // Prepare update data
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === "sent" && !body.sentAt) {
      updateData.sent_at = new Date().toISOString()
    } else if (body.sentAt) {
      updateData.sent_at = body.sentAt
    }

    if (status === "delivered" && !deliveredAt) {
      updateData.delivered_at = new Date().toISOString()
    } else if (deliveredAt) {
      updateData.delivered_at = deliveredAt
    }

    // Update the notification
    const { data: notification, error } = await supabase
      .from("emergency_notifications")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Notification status updated successfully",
      notification,
    })
  } catch (error) {
    console.error("Error updating notification status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
