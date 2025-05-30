import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

// GET a specific content item
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const itemId = (await params).id;
    const supabase = getSupabaseServerClient();

    const { data: item, error } = await supabase
      .from("content_items")
      .select("*, content_categories(*)")
      .eq("id", itemId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Content item not found" },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error("Error fetching content item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT to update a content item
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const itemId = (await params).id;
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
      isActive,
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

    // Update the content item
    const { data, error } = await supabase
      .from("content_items")
      .update({
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
        is_featured: isFeatured !== undefined ? isFeatured : false,
        is_active: isActive !== undefined ? isActive : true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Content item updated successfully",
      item: data,
    });
  } catch (error) {
    console.error("Error updating content item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE a content item
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const itemId = (await params).id;
    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from("content_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Content item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting content item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
