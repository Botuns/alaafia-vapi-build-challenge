import { type NextRequest, NextResponse } from "next/server";

// This would be replaced with actual database operations in a real implementation
const mockReminders = [
  {
    id: "reminder_1",
    userId: "user_1",
    type: "medication",
    title: "Arthritis Medicine",
    description: "Take 1 tablet with water",
    time: "9:00 AM",
    frequency: "daily",
    active: true,
    lastTriggered: "2023-05-20T09:00:00Z",
  },
  {
    id: "reminder_2",
    userId: "user_1",
    type: "medication",
    title: "Blood Pressure Medicine",
    description: "Take 1 tablet after food",
    time: "6:00 PM",
    frequency: "daily",
    active: true,
    lastTriggered: "2023-05-20T18:00:00Z",
  },
  {
    id: "reminder_3",
    userId: "user_1",
    type: "wellness",
    title: "Afternoon Check-in",
    description: "How are you feeling?",
    time: "2:00 PM",
    frequency: "daily",
    active: true,
    lastTriggered: "2023-05-20T14:00:00Z",
  },
  {
    id: "reminder_4",
    userId: "user_2",
    type: "medication",
    title: "Blood Pressure Medicine",
    description: "Take 1 tablet with water",
    time: "8:00 AM",
    frequency: "daily",
    active: true,
    lastTriggered: "2023-05-20T08:00:00Z",
  },
];

// GET all reminders or filter by userId
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (userId) {
      const filteredReminders = mockReminders.filter(
        (reminder) => reminder.userId === userId
      );
      return NextResponse.json({ reminders: filteredReminders });
    }

    return NextResponse.json({ reminders: mockReminders });
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST to create a new reminder
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const requiredFields = ["userId", "type", "title", "time", "frequency"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // In a real implementation, this would create a reminder in the database
    const newReminder = {
      id: `reminder_${Date.now()}`,
      userId: body.userId,
      type: body.type,
      title: body.title,
      description: body.description || "",
      time: body.time,
      frequency: body.frequency,
      active: body.active !== undefined ? body.active : true,
      lastTriggered: null,
    };
    // Mock adding to database
    mockReminders.push({
      ...newReminder,
      lastTriggered: "2023-05-20T08:00:00Z", // Set a default value instead of null
    });

    return NextResponse.json({
      success: true,
      message: "Reminder created successfully",
      reminder: newReminder,
    });
  } catch (error) {
    console.error("Error creating reminder:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
