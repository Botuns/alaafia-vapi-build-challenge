// Updated Vapi client utility for interacting with the Vapi API

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_API_URL = "https://api.vapi.ai";
// const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
const APP_URL = "https://6139-102-89-69-98.ngrok-free.app";
const VAPI_API_KEY_B = "72cb8b72-ed8e-4522-a4d8-69c5f319eeeb";

// Types for Vapi API
interface VapiAssistantConfig {
  name: string;
  model: {
    provider: string;
    model: string;
    messages: Array<{
      role: string;
      content: string;
    }>;
    tools?: VapiTool[];
  };
  voice: {
    provider: string;
    voiceId: string;
  };
  firstMessage: string;
  voicemailMessage?: string;
  endCallMessage?: string;
  endCallFunctionEnabled?: boolean;
  recordingEnabled?: boolean;
  transcriber?: {
    provider: string;
    wordBoost?: string[];
  };
  serverUrl?: string;
}

interface VapiTool {
  type:
    | "dtmf"
    | "endCall"
    | "transferCall"
    | "output"
    | "voicemail"
    | "query"
    | "sms"
    | "function"
    | "mcp"
    | "apiRequest"
    | "bash"
    | "computer"
    | "textEditor"
    | "google.calendar.event.create"
    | "google.calendar.availability.check"
    | "google.sheets.row.append"
    | "slack.message.send"
    | "gohighlevel.calendar.event.create"
    | "gohighlevel.calendar.availability.check"
    | "gohighlevel.contact.create"
    | "gohighlevel.contact.get"
    | "make"
    | "ghl";

  // For function type tools (most common)
  function?: {
    name: string;
    description: string;
    parameters: {
      type: string;
      properties: Record<string, any>;
      required?: string[];
    };
  };

  // For other tool types, add relevant properties as needed
  [key: string]: any;
}

function createFunctionTool(
  name: string,
  description: string,
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  }
): VapiTool {
  return {
    type: "function",
    function: {
      name,
      description,
      parameters,
    },
  };
}

interface VapiCallOptions {
  assistantId: string;
  customer: {
    number: string;
  };
  phoneNumberId?: string;
}

// Create a Vapi assistant
export async function createAssistant(config: VapiAssistantConfig) {
  try {
    console.log("config", config.model.tools);
    const response = await fetch(`${VAPI_API_URL}/assistant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VAPI_API_KEY_B}`,
      },
      body: JSON.stringify({
        ...config,
        serverUrl: config.serverUrl || `${APP_URL}/api/vapi/webhook`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create assistant");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating Vapi assistant:", error);
    throw error;
  }
}

// Create a phone number for outbound calls
export async function createPhoneNumber() {
  try {
    const response = await fetch(`${VAPI_API_URL}/phone-number`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VAPI_API_KEY}`,
      },
      body: JSON.stringify({
        provider: "vapi",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create phone number");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating Vapi phone number:", error);
    throw error;
  }
}

// Make an outbound call
export async function makeOutboundCall(options: VapiCallOptions) {
  try {
    const response = await fetch(`${VAPI_API_URL}/call`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VAPI_API_KEY_B}`,
      },
      body: JSON.stringify({
        assistantId: options.assistantId,
        customer: options.customer,
        phoneNumberId: options.phoneNumberId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to make call");
    }

    return await response.json();
  } catch (error) {
    console.error("Error making Vapi call:", error);
    throw error;
  }
}

// Get call details
export async function getCallDetails(callId: string) {
  try {
    const response = await fetch(`${VAPI_API_URL}/call/${callId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${VAPI_API_KEY_B}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get call details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting Vapi call details:", error);
    throw error;
  }
}

// List assistants
export async function listAssistants() {
  try {
    const response = await fetch(`${VAPI_API_URL}/assistant`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${VAPI_API_KEY_B}`,
      },
    });
    const data = await response.json();
    // console.log("response", data);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to list assistants");
    }

    return data;
  } catch (error) {
    console.error("Error listing Vapi assistants:", error);
    throw error;
  }
}

// Update assistant configuration
export async function updateAssistant(
  assistantId: string,
  config: Partial<VapiAssistantConfig>
) {
  try {
    const response = await fetch(`${VAPI_API_URL}/assistant/${assistantId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${VAPI_API_KEY_B}`,
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update assistant");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating Vapi assistant:", error);
    throw error;
  }
}

// Helper function to create different types of assistants
export function createWellnessCheckAssistant(userName: string) {
  const tool = createFunctionTool(
    "logWellnessCheck",
    "Log the wellness check results",
    {
      type: "object",
      properties: {
        mood: {
          type: "string",
          description: "The user's reported mood",
        },
        concerns: {
          type: "string",
          description: "Any concerns the user mentioned",
        },
        notes: {
          type: "string",
          description: "Additional notes from the conversation",
        },
      },
      required: ["mood"],
    }
  );

  return createAssistant({
    name: `Wellness Check Assistant for ${userName}`,
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You're Alafia, a caring voice companion for ${userName}. You're calling to check on their wellness and see how they're doing today. Be warm, empathetic, and engaging. Ask about their mood, any concerns they might have, and offer encouragement. Keep the conversation natural and supportive.`,
        },
      ],
      tools: [tool],
    },
    voice: {
      provider: "openai",
      voiceId: "nova",
    },
    firstMessage: `Hello ${userName}, this is Alafia, your voice companion. I'm calling to check how you're doing today. How are you feeling?`,
    voicemailMessage: `Hi ${userName}, this is Alafia. I was calling to check on you. Please call back when you can, or I'll try again later.`,
    endCallMessage:
      "Take care, and remember I'm here whenever you need to talk.",
    endCallFunctionEnabled: true,
    recordingEnabled: false,
    transcriber: {
      provider: "deepgram",
      // wordBoost: ["Alafia:1", userName + ":1"],
    },
  });
}

export function createMedicationReminderAssistant(
  userName: string,
  medication?: string
) {
  const tool = createFunctionTool(
    "logMedicationReminder",
    "Log the medication reminder response",
    {
      type: "object",
      properties: {
        taken: {
          type: "boolean",
          description: "Whether the user has taken their medication",
        },
        willTake: {
          type: "boolean",
          description: "Whether the user promises to take their medication",
        },
        concerns: {
          type: "string",
          description: "Any concerns about the medication",
        },
      },
      required: ["taken"],
    }
  );

  return createAssistant({
    name: `Medication Reminder Assistant for ${userName}`,
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You're Alafia, a caring voice companion for ${userName}. You're calling to remind them about their medication. Be gentle but persistent in ensuring they understand the importance of taking their medication. Ask if they've taken it today and if they need any help or have questions.${
            medication ? ` The medication is ${medication}.` : ""
          }`,
        },
      ],
      tools: [tool],
    },
    voice: {
      provider: "openai",
      voiceId: "nova",
    },
    firstMessage: `Hello ${userName}, this is Alafia. I'm calling to remind you about your medication. Have you taken it today?`,
    voicemailMessage: `Hi ${userName}, this is Alafia reminding you about your medication. Please don't forget to take it today.`,
    endCallMessage: "Take care, and don't forget your medication!",
    endCallFunctionEnabled: true,
    recordingEnabled: false,
    transcriber: {
      provider: "deepgram",
      wordBoost: ["Alafia:1", userName + ":1"],
    },
  });
}

export function createEntertainmentAssistant(userName: string) {
  const tool = createFunctionTool(
    "logEntertainmentRequest",
    "Log the entertainment request",
    {
      type: "object",
      properties: {
        request: {
          type: "string",
          description: "The user's entertainment request",
        },
      },
      required: ["request"],
    }
  );

  return createAssistant({
    name: `Entertainment Assistant for ${userName}`,
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You're Alafia, a friendly voice companion for ${userName}. You're here to provide entertainment through stories, jokes, music recommendations, or just friendly conversation. Be upbeat, engaging, and adapt to what the user seems to enjoy. You can tell stories, share interesting facts, or just chat about their interests.`,
        },
      ],
      tools: [tool],
    },
    voice: {
      provider: "openai",
      voiceId: "nova",
    },
    firstMessage: `Hello ${userName}, this is Alafia! I'm here to brighten your day. Would you like to hear a story, some jokes, or just chat about something interesting?`,
    voicemailMessage: `Hi ${userName}, this is Alafia. I called to chat and share something fun with you. Call back when you can!`,
    endCallMessage: "It was wonderful talking with you! Have a great day!",
    endCallFunctionEnabled: true,
    recordingEnabled: false,
    transcriber: {
      provider: "deepgram",
      wordBoost: ["Alafia:1", userName + ":1"],
    },
  });
}
