import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

// GET content keywords
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const contentId = searchParams.get("contentId");
    const categoryId = searchParams.get("categoryId");
    const contentType = searchParams.get("contentType");
    const language = searchParams.get("language");
    const culturalOrigin = searchParams.get("culturalOrigin");
    const supabase = getSupabaseServerClient();

    let query = supabase.from("content_keywords").select("*");

    if (contentId) {
      query = query.eq("content_id", contentId);
    }

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (contentType) {
      query = query.eq("content_type", contentType);
    }

    if (language) {
      query = query.eq("language", language);
    }

    if (culturalOrigin) {
      query = query.eq("cultural_origin", culturalOrigin);
    }

    const { data: keywords, error } = await query.order("keyword", {
      ascending: true,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ keywords });
  } catch (error) {
    console.error("Error fetching content keywords:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST to create a new content keyword
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      keyword,
      contentId,
      categoryId,
      contentType,
      language,
      culturalOrigin,
    } = body;
    const supabase = getSupabaseServerClient();

    // Validate required fields
    if (!keyword) {
      return NextResponse.json(
        { error: "Missing required field: keyword is required" },
        { status: 400 }
      );
    }

    // Validate that exactly one target is provided
    const targets = [
      contentId,
      categoryId,
      contentType,
      language,
      culturalOrigin,
    ].filter(Boolean);
    if (targets.length !== 1) {
      return NextResponse.json(
        {
          error:
            "Exactly one of contentId, categoryId, contentType, language, or culturalOrigin must be provided",
        },
        { status: 400 }
      );
    }

    // Insert the keyword
    const { data, error } = await supabase
      .from("content_keywords")
      .insert({
        keyword: keyword.toLowerCase().trim(),
        content_id: contentId,
        category_id: categoryId,
        content_type: contentType,
        language: language,
        cultural_origin: culturalOrigin,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Content keyword created successfully",
      keyword: data,
    });
  } catch (error) {
    console.error("Error creating content keyword:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
