import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

// GET responses for a specific wellness check
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const wellnessCheckId = params.id
    const supabase = getSupabaseServerClient()

    const { data: responses, error } = await supabase
      .from("wellness_responses")
      .select("*")
      .eq("wellness_check_id", wellnessCheckId)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ responses })
  } catch (error) {
    console.error("Error fetching wellness responses:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST to create a new wellness response
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const wellnessCheckId = params.id
    const body = await req.json()
    const { callId, moodRating, physicalWellbeing, notes } = body
    const supabase = getSupabaseServerClient()

    // Validate required fields
    if (!moodRating) {
      return NextResponse.json({ error: "Missing required field: moodRating is required" }, { status: 400 })
    }

    // Insert the wellness response
    const { data, error } = await supabase
      .from("wellness_responses")
      .insert({
        wellness_check_id: wellnessCheckId,
        call_id: callId,
        mood_rating: moodRating,
        physical_wellbeing: physicalWellbeing || "not_specified",
        notes: notes || "",
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Update the last_check_at field in the wellness check
    const { error: updateError } = await supabase
      .from("wellness_checks")
      .update({
        last_check_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", wellnessCheckId)

    if (updateError) {
      console.error("Error updating wellness check:", updateError)
    }

    return NextResponse.json({
      success: true,
      message: "Wellness response recorded successfully",
      response: data,
    })
  } catch (error) {
    console.error("Error creating wellness response:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
