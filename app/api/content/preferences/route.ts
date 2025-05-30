import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"
import { updateUserContentPreference } from "@/lib/content-management"

// GET user content preferences
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing required parameter: userId" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    const { data: preferences, error } = await supabase
      .from("user_content_preferences")
      .select(`
        *,
        content_categories(*)
      `)
      .eq("user_id", userId)
      .order("preference_level", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ preferences })
  } catch (error) {
    console.error("Error fetching user content preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST to create or update a user content preference
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, categoryId, contentType, language, culturalOrigin, preferenceLevel } = body

    // Validate required fields
    if (!userId || !preferenceLevel) {
      return NextResponse.json(
        { error: "Missing required fields: userId and preferenceLevel are required" },
        { status: 400 },
      )
    }

    // Validate that at least one preference type is provided
    if (!categoryId && !contentType && !language && !culturalOrigin) {
      return NextResponse.json(
        { error: "At least one of categoryId, contentType, language, or culturalOrigin must be provided" },
        { status: 400 },
      )
    }

    // Validate preference level
    if (preferenceLevel < 1 || preferenceLevel > 5) {
      return NextResponse.json({ error: "Invalid preference level: must be between 1 and 5" }, { status: 400 })
    }

    const preference = await updateUserContentPreference(userId, {
      categoryId,
      contentType,
      language,
      culturalOrigin,
      preferenceLevel,
    })

    if (!preference) {
      throw new Error("Failed to update user content preference")
    }

    return NextResponse.json({
      success: true,
      message: "User content preference updated successfully",
      preference,
    })
  } catch (error) {
    console.error("Error updating user content preference:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
