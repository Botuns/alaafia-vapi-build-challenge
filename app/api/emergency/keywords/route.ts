import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

// GET all emergency keywords
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    const { data: keywords, error } = await supabase
      .from("emergency_keywords")
      .select("*")
      .order("severity", { ascending: false })
      .order("keyword", { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json({ keywords })
  } catch (error) {
    console.error("Error fetching emergency keywords:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST to create a new emergency keyword
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { keyword, severity } = body
    const supabase = getSupabaseServerClient()

    // Validate required fields
    if (!keyword || !severity) {
      return NextResponse.json({ error: "Missing required fields: keyword and severity are required" }, { status: 400 })
    }

    // Validate severity
    if (!["low", "medium", "high"].includes(severity)) {
      return NextResponse.json({ error: "Invalid severity: must be 'low', 'medium', or 'high'" }, { status: 400 })
    }

    // Check if keyword already exists
    const { data: existingKeyword } = await supabase
      .from("emergency_keywords")
      .select("id")
      .ilike("keyword", keyword)
      .single()

    if (existingKeyword) {
      return NextResponse.json({ error: "Keyword already exists" }, { status: 400 })
    }

    // Insert the keyword
    const { data, error } = await supabase
      .from("emergency_keywords")
      .insert({
        keyword: keyword.toLowerCase().trim(),
        severity,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Emergency keyword added successfully",
      keyword: data,
    })
  } catch (error) {
    console.error("Error creating emergency keyword:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
