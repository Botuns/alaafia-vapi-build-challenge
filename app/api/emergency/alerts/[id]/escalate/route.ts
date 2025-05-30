import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

// POST to escalate an emergency alert
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const alertId = (await params).id;
    const body = await req.json();
    const { action, performedBy, notes } = body;
    const supabase = getSupabaseServerClient();

    // Validate required fields
    if (!action) {
      return NextResponse.json(
        { error: "Missing required field: action is required" },
        { status: 400 }
      );
    }

    // Get current alert status and escalation level
    const { data: alert, error: alertError } = await supabase
      .from("emergency_alerts")
      .select("status, severity")
      .eq("id", alertId)
      .single();

    if (alertError) {
      if (alertError.code === "PGRST116") {
        return NextResponse.json({ error: "Alert not found" }, { status: 404 });
      }
      throw alertError;
    }

    // Get latest escalation level
    const { data: latestEscalation, error: escalationError } = await supabase
      .from("emergency_escalations")
      .select("escalation_level")
      .eq("alert_id", alertId)
      .order("escalation_level", { ascending: false })
      .limit(1)
      .single();

    if (escalationError && escalationError.code !== "PGRST116") {
      throw escalationError;
    }

    const currentLevel = latestEscalation
      ? latestEscalation.escalation_level
      : 0;
    const nextLevel = currentLevel + 1;

    // Create new escalation record
    const { data: escalation, error } = await supabase
      .from("emergency_escalations")
      .insert({
        alert_id: alertId,
        escalation_level: nextLevel,
        escalation_time: new Date().toISOString(),
        action_taken: action,
        performed_by: performedBy || "System",
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update alert status based on escalation level if not already resolved
    if (alert.status !== "resolved" && alert.status !== "false_alarm") {
      let newStatus = alert.status;

      if (nextLevel >= 3 && alert.status === "pending") {
        newStatus = "acknowledged";
      }

      const { error: updateError } = await supabase
        .from("emergency_alerts")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", alertId);

      if (updateError) {
        console.error("Error updating alert status:", updateError);
      }
    }

    // For high severity alerts at level 2 or higher, notify additional contacts
    if (alert.severity === "high" && nextLevel >= 2) {
      // Get the user ID from the alert
      const { data: alertWithUser, error: userError } = await supabase
        .from("emergency_alerts")
        .select("user_id")
        .eq("id", alertId)
        .single();

      if (userError) {
        console.error("Error fetching alert user:", userError);
      } else {
        // Get emergency contacts that haven't been notified yet
        const { data: existingNotifications, error: notifError } =
          await supabase
            .from("emergency_notifications")
            .select("contact_id")
            .eq("alert_id", alertId);

        if (notifError) {
          console.error("Error fetching existing notifications:", notifError);
        } else {
          const notifiedContactIds = existingNotifications.map(
            (n) => n.contact_id
          );

          const { data: contacts, error: contactsError } = await supabase
            .from("emergency_contacts")
            .select("id, name, phone")
            .eq("user_id", alertWithUser.user_id)
            .not("id", "in", `(${notifiedContactIds.join(",")})`);

          if (contactsError) {
            console.error("Error fetching additional contacts:", contactsError);
          } else if (contacts && contacts.length > 0) {
            // Create notifications for additional contacts
            const notifications = contacts.map((contact) => ({
              alert_id: alertId,
              contact_id: contact.id,
              contact_type: "emergency_contact",
              contact_name: contact.name,
              contact_phone: contact.phone,
              notification_method: nextLevel >= 3 ? "call" : "sms", // Use calls for higher escalation levels
              status: "pending",
            }));

            const { error: notificationError } = await supabase
              .from("emergency_notifications")
              .insert(notifications);

            if (notificationError) {
              console.error(
                "Error creating additional notifications:",
                notificationError
              );
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Emergency alert escalated successfully",
      escalation,
    });
  } catch (error) {
    console.error("Error escalating emergency alert:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
