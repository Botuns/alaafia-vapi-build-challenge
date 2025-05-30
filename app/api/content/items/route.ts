import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

// GET all content items with optional filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const contentType = searchParams.get("contentType");
    const language = searchParams.get("language");
    const culturalOrigin = searchParams.get("culturalOrigin");
    const featured = searchParams.get("featured");
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10);
    const supabase = getSupabaseServerClient();

    let query = supabase
      .from("content_items")
      .select("*, content_categories(*)");

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

    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    query = query
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    const { data: items, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ items: items || [] });
  } catch (error) {
    console.error("Error fetching content items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST to create a new content item
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      contentType,
      categoryId,
      language,
      culturalOrigin,
      contentText,
      audioUrl,
      imageUrl,
      duration,
      tags,
      isFeatured,
    } = body;
    const supabase = getSupabaseServerClient();

    // Validate required fields
    if (!title || !contentType) {
      return NextResponse.json(
        {
          error: "Missing required fields: title and contentType are required",
        },
        { status: 400 }
      );
    }

    // Validate content type
    const validContentTypes = [
      "story",
      "music",
      "news",
      "proverb",
      "folktale",
      "history",
      "religious",
    ];
    if (!validContentTypes.includes(contentType)) {
      return NextResponse.json(
        {
          error: `Invalid content type: must be one of ${validContentTypes.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Insert the content item
    const { data, error } = await supabase
      .from("content_items")
      .insert({
        title,
        description: description || "",
        content_type: contentType,
        category_id: categoryId,
        language: language || "english",
        cultural_origin: culturalOrigin,
        content_text: contentText || "",
        audio_url: audioUrl,
        image_url: imageUrl,
        duration: duration,
        tags: tags || [],
        is_featured: isFeatured || false,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Content item created successfully",
      item: data,
    });
  } catch (error) {
    console.error("Error creating content item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
