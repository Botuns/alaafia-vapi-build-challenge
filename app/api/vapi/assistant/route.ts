import { type NextRequest, NextResponse } from "next/server";
import { createAssistant, updateAssistant, listAssistants } from "@/lib/vapi";

// This endpoint will be used to configure the Vapi assistant
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, config } = body;

    if (action === "create") {
      // Create a new assistant
      const assistantConfig = {
        name: config.name || "Alafia Voice Companion",
        model: config.model || "gpt-4",
        voice: config.voice || "shimmer",
        first_message:
          config.first_message ||
          "Hello, this is Alafia, your voice companion. How are you feeling today?",
        functions: [
          {
            name: "setMedicationReminder",
            description: "Set a reminder for medication",
            parameters: {
              type: "object",
              properties: {
                medicationName: {
                  type: "string",
                  description: "Name of the medication",
                },
                time: {
                  type: "string",
                  description: "Time to take the medication (e.g., '9:00 AM')",
                },
                frequency: {
                  type: "string",
                  description:
                    "How often to take the medication (e.g., 'daily', 'twice daily')",
                },
              },
              required: ["medicationName", "time"],
            },
          },
          {
            name: "scheduleWellnessCheck",
            description: "Schedule a wellness check call",
            parameters: {
              type: "object",
              properties: {
                time: {
                  type: "string",
                  description: "Time for the wellness check (e.g., '2:00 PM')",
                },
                frequency: {
                  type: "string",
                  description:
                    "How often to perform the check (e.g., 'daily', 'weekly')",
                },
              },
              required: ["time"],
            },
          },
          {
            name: "playStory",
            description: "Play a story or entertainment content",
            parameters: {
              type: "object",
              properties: {
                storyType: {
                  type: "string",
                  description:
                    "Type of story (e.g., 'folktale', 'news', 'music')",
                },
                language: {
                  type: "string",
                  description:
                    "Language preference (e.g., 'English', 'Yoruba')",
                },
              },
              required: ["storyType"],
            },
          },
          {
            name: "contactEmergency",
            description: "Contact emergency contacts",
            parameters: {
              type: "object",
              properties: {
                reason: {
                  type: "string",
                  description: "Reason for the emergency contact",
                },
                urgency: {
                  type: "string",
                  enum: ["low", "medium", "high"],
                  description: "Urgency level of the situation",
                },
              },
              required: ["reason", "urgency"],
            },
          },
        ],
        webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/vapi/webhook`,
      };

      const response = await createAssistant({
        ...assistantConfig,
        firstMessage: assistantConfig.first_message,
      });

      return NextResponse.json({
        success: true,
        message: "Assistant created successfully",
        assistant_id: response.id,
      });
    } else if (action === "update" && body.assistantId) {
      // Update an existing assistant
      const response = await updateAssistant(body.assistantId, config);

      return NextResponse.json({
        success: true,
        message: "Assistant updated successfully",
        assistant: response,
      });
    } else if (action === "list") {
      // List all assistants
      const response = await listAssistants();

      return NextResponse.json({
        success: true,
        assistants: response,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error configuring assistant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
