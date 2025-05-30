import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

// GET a specific emergency alert
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const alertId = (await params).id;
    const supabase = getSupabaseServerClient();

    const { data: alert, error } = await supabase
      .from("emergency_alerts")
      .select(
        `
        *,
        users:user_id (id, name, phone, age, location),
        calls:call_id (id, vapi_call_id, call_type, transcript, created_at),
        emergency_notifications (*)
      `
      )
      .eq("id", alertId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Alert not found" }, { status: 404 });
      }
      throw error;
    }

    // Get escalation history
    const { data: escalations, error: escalationError } = await supabase
      .from("emergency_escalations")
      .select("*")
      .eq("alert_id", alertId)
      .order("escalation_time", { ascending: true });

    if (escalationError) {
      console.error("Error fetching escalations:", escalationError);
    }

    return NextResponse.json({
      alert: {
        ...alert,
        escalations: escalations || [],
      },
    });
  } catch (error) {
    console.error("Error fetching emergency alert:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT to update an emergency alert
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const alertId = (await params).id;
    const body = await req.json();
    const { status, notes, resolvedBy } = body;
    const supabase = getSupabaseServerClient();

    // Validate status if provided
    if (
      status &&
      !["pending", "acknowledged", "resolved", "false_alarm"].includes(status)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid status: must be 'pending', 'acknowledged', 'resolved', or 'false_alarm'",
        },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updateData.status = status;
    }

    if (notes) {
      updateData.notes = notes;
    }

    // If status is resolved or false_alarm, set resolved_at and resolved_by
    if (status === "resolved" || status === "false_alarm") {
      updateData.resolved_at = new Date().toISOString();
      if (resolvedBy) {
        updateData.resolved_by = resolvedBy;
      }
    }

    // Update the alert
    const { data: alert, error } = await supabase
      .from("emergency_alerts")
      .update(updateData)
      .eq("id", alertId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Create escalation record for status change
    if (status) {
      const { error: escalationError } = await supabase
        .from("emergency_escalations")
        .insert({
          alert_id: alertId,
          escalation_level:
            status === "acknowledged"
              ? 2
              : status === "resolved" || status === "false_alarm"
              ? 3
              : 1,
          escalation_time: new Date().toISOString(),
          action_taken: `Alert ${status}`,
          performed_by: resolvedBy ? "User" : "System",
          notes: notes || null,
        });

      if (escalationError) {
        console.error("Error creating escalation record:", escalationError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Emergency alert updated successfully",
      alert,
    });
  } catch (error) {
    console.error("Error updating emergency alert:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
