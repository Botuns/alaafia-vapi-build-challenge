import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { getAllCategories } from "@/lib/content-management";

// GET all content categories
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();

    const { data: categories, error } = await supabase
      .from("content_categories")
      .select("*")
      .order("name");

    if (error) {
      throw error;
    }

    return NextResponse.json({ categories: categories || [] });
  } catch (error) {
    console.error("Error fetching content categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST to create a new content category
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, icon } = body;
    const supabase = getSupabaseServerClient();

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Missing required field: name is required" },
        { status: 400 }
      );
    }

    // Insert the category
    const { data, error } = await supabase
      .from("content_categories")
      .insert({
        name,
        description: description || "",
        icon: icon || "",
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Content category created successfully",
      category: data,
    });
  } catch (error) {
    console.error("Error creating content category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
