import { getSupabaseServerClient } from "@/lib/supabase"

// Function to detect emergency keywords in a transcript
export async function detectEmergency(transcript: string, userId: string, callId: string) {
  try {
    const supabase = getSupabaseServerClient()

    // Get all emergency keywords
    const { data: keywords, error } = await supabase.from("emergency_keywords").select("*")

    if (error) {
      console.error("Error fetching emergency keywords:", error)
      return null
    }

    if (!keywords || keywords.length === 0) {
      return null
    }

    // Convert transcript to lowercase for case-insensitive matching
    const lowercaseTranscript = transcript.toLowerCase()

    // Find matching keywords
    const matchedKeywords = keywords.filter((keyword) => lowercaseTranscript.includes(keyword.keyword.toLowerCase()))

    if (matchedKeywords.length === 0) {
      return null
    }

    // Determine highest severity
    let highestSeverity = "low"
    if (matchedKeywords.some((k) => k.severity === "high")) {
      highestSeverity = "high"
    } else if (matchedKeywords.some((k) => k.severity === "medium")) {
      highestSeverity = "medium"
    }

    // Extract a relevant excerpt from the transcript (context around the first matched keyword)
    const firstKeyword = matchedKeywords[0].keyword
    const keywordIndex = lowercaseTranscript.indexOf(firstKeyword.toLowerCase())

    let excerptStart = Math.max(0, keywordIndex - 50)
    let excerptEnd = Math.min(transcript.length, keywordIndex + firstKeyword.length + 100)

    // Try to start at the beginning of a sentence
    while (
      excerptStart > 0 &&
      transcript[excerptStart] !== "." &&
      transcript[excerptStart] !== "!" &&
      transcript[excerptStart] !== "?"
    ) {
      excerptStart--
    }
    if (excerptStart > 0) excerptStart++ // Skip the punctuation

    // Try to end at the end of a sentence
    while (
      excerptEnd < transcript.length &&
      transcript[excerptEnd] !== "." &&
      transcript[excerptEnd] !== "!" &&
      transcript[excerptEnd] !== "?"
    ) {
      excerptEnd++
    }
    if (excerptEnd < transcript.length) excerptEnd++ // Include the punctuation

    const transcriptExcerpt = transcript.substring(excerptStart, excerptEnd).trim()

    // Create emergency alert
    const { data: alert, error: alertError } = await supabase
      .from("emergency_alerts")
      .insert({
        user_id: userId,
        call_id: callId,
        severity: highestSeverity,
        status: "pending",
        detected_keywords: matchedKeywords.map((k) => k.keyword),
        transcript_excerpt: transcriptExcerpt,
      })
      .select()
      .single()

    if (alertError) {
      console.error("Error creating emergency alert:", alertError)
      return null
    }

    // Get user details
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("name, phone")
      .eq("id", userId)
      .single()

    if (userError) {
      console.error("Error fetching user details:", userError)
    }

    // Get emergency contacts
    const { data: contacts, error: contactsError } = await supabase
      .from("emergency_contacts")
      .select("id, name, phone")
      .eq("user_id", userId)

    if (contactsError) {
      console.error("Error fetching emergency contacts:", contactsError)
    }

    // Create notifications for each emergency contact
    if (contacts && contacts.length > 0) {
      // For high severity, notify all contacts
      // For medium and low, notify only the first contact
      const contactsToNotify = highestSeverity === "high" ? contacts : [contacts[0]]

      const notifications = contactsToNotify.map((contact) => ({
        alert_id: alert.id,
        contact_id: contact.id,
        contact_type: "emergency_contact",
        contact_name: contact.name,
        contact_phone: contact.phone,
        notification_method: highestSeverity === "high" ? "call" : "sms",
        status: "pending",
      }))

      const { error: notificationError } = await supabase.from("emergency_notifications").insert(notifications)

      if (notificationError) {
        console.error("Error creating notifications:", notificationError)
      }
    }

    // Create initial escalation record
    const { error: escalationError } = await supabase.from("emergency_escalations").insert({
      alert_id: alert.id,
      escalation_level: 1,
      escalation_time: new Date().toISOString(),
      action_taken: "Emergency detected",
      performed_by: "System",
      notes: `Detected keywords: ${matchedKeywords.map((k) => k.keyword).join(", ")}`,
    })

    if (escalationError) {
      console.error("Error creating escalation record:", escalationError)
    }

    return {
      alert,
      severity: highestSeverity,
      keywords: matchedKeywords.map((k) => k.keyword),
      excerpt: transcriptExcerpt,
    }
  } catch (error) {
    console.error("Error in emergency detection:", error)
    return null
  }
}
