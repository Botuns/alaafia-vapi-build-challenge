import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

// GET a specific emergency keyword
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const keywordId = (await params).id;
    const supabase = getSupabaseServerClient();

    const { data: keyword, error } = await supabase
      .from("emergency_keywords")
      .select("*")
      .eq("id", keywordId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Keyword not found" },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ keyword });
  } catch (error) {
    console.error("Error fetching emergency keyword:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT to update an emergency keyword
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const keywordId = (await params).id;
    const body = await req.json();
    const { keyword, severity } = body;
    const supabase = getSupabaseServerClient();

    // Validate required fields
    if (!keyword || !severity) {
      return NextResponse.json(
        { error: "Missing required fields: keyword and severity are required" },
        { status: 400 }
      );
    }

    // Validate severity
    if (!["low", "medium", "high"].includes(severity)) {
      return NextResponse.json(
        { error: "Invalid severity: must be 'low', 'medium', or 'high'" },
        { status: 400 }
      );
    }

    // Update the keyword
    const { data, error } = await supabase
      .from("emergency_keywords")
      .update({
        keyword: keyword.toLowerCase().trim(),
        severity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", keywordId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Emergency keyword updated successfully",
      keyword: data,
    });
  } catch (error) {
    console.error("Error updating emergency keyword:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE an emergency keyword
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const keywordId = (await params).id;
    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from("emergency_keywords")
      .delete()
      .eq("id", keywordId);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Emergency keyword deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting emergency keyword:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
