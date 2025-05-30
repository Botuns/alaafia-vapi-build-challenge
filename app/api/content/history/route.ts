import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"
import { getUserContentHistory } from "@/lib/content-management"

// GET user content history
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    if (!userId) {
      return NextResponse.json({ error: "Missing required parameter: userId" }, { status: 400 })
    }

    const history = await getUserContentHistory(userId, limit)
    return NextResponse.json({ history })
  } catch (error) {
    console.error("Error fetching user content history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST to record content playback
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, contentId, callId, completed, rating, feedback } = body
    const supabase = getSupabaseServerClient()

    // Validate required fields
    if (!userId || !contentId) {
      return NextResponse.json({ error: "Missing required fields: userId and contentId are required" }, { status: 400 })
    }

    // Insert the history record
    const { data, error } = await supabase
      .from("user_content_history")
      .insert({
        user_id: userId,
        content_id: contentId,
        call_id: callId,
        completed: completed || false,
        rating: rating,
        feedback: feedback,
        played_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Content playback recorded successfully",
      history: data,
    })
  } catch (error) {
    console.error("Error recording content playback:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
