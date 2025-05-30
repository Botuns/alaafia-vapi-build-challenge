import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

// GET all emergency alerts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")
    const severity = searchParams.get("severity")
    const supabase = getSupabaseServerClient()

    let query = supabase.from("emergency_alerts").select(`
      *,
      users:user_id (id, name, phone, age, location),
      calls:call_id (id, vapi_call_id, call_type, transcript, created_at)
    `)

    if (userId) {
      query = query.eq("user_id", userId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    if (severity) {
      query = query.eq("severity", severity)
    }

    const { data: alerts, error } = await query.order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error("Error fetching emergency alerts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST to create a new emergency alert
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, callId, severity, detectedKeywords, transcriptExcerpt } = body
    const supabase = getSupabaseServerClient()

    // Validate required fields
    if (!userId || !severity) {
      return NextResponse.json({ error: "Missing required fields: userId and severity are required" }, { status: 400 })
    }

    // Validate severity
    if (!["low", "medium", "high"].includes(severity)) {
      return NextResponse.json({ error: "Invalid severity: must be 'low', 'medium', or 'high'" }, { status: 400 })
    }

    // Insert the alert
    const { data: alert, error } = await supabase
      .from("emergency_alerts")
      .insert({
        user_id: userId,
        call_id: callId,
        severity,
        status: "pending",
        detected_keywords: detectedKeywords || [],
        transcript_excerpt: transcriptExcerpt || "",
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Get user details for notifications
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("name, phone")
      .eq("id", userId)
      .single()

    if (userError) {
      console.error("Error fetching user details:", userError)
    }

    // Get emergency contacts
    const { data: contacts, error: contactsError } = await supabase
      .from("emergency_contacts")
      .select("id, name, phone")
      .eq("user_id", userId)

    if (contactsError) {
      console.error("Error fetching emergency contacts:", contactsError)
    }

    // Create notifications for each emergency contact
    if (contacts && contacts.length > 0) {
      const notifications = contacts.map((contact) => ({
        alert_id: alert.id,
        contact_id: contact.id,
        contact_type: "emergency_contact",
        contact_name: contact.name,
        contact_phone: contact.phone,
        notification_method: "sms", // Default to SMS
        status: "pending",
      }))

      const { error: notificationError } = await supabase.from("emergency_notifications").insert(notifications)

      if (notificationError) {
        console.error("Error creating notifications:", notificationError)
      }
    }

    // Create initial escalation record
    const { error: escalationError } = await supabase.from("emergency_escalations").insert({
      alert_id: alert.id,
      escalation_level: 1,
      escalation_time: new Date().toISOString(),
      action_taken: "Alert created",
      performed_by: "System",
    })

    if (escalationError) {
      console.error("Error creating escalation record:", escalationError)
    }

    return NextResponse.json({
      success: true,
      message: "Emergency alert created successfully",
      alert,
    })
  } catch (error) {
    console.error("Error creating emergency alert:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
