import { getSupabaseServerClient } from "@/lib/supabase"
import {
  detectContentKeywords,
  getContentById,
  getContentByCategory,
  getContentByType,
  getRecommendedContent,
} from "./content-management"

// Function to handle content requests in a transcript
export async function handleContentRequest(transcript: string, userId: string, callId?: string) {
  try {
    // Detect content keywords in the transcript
    const keywordMatch = await detectContentKeywords(transcript)

    if (!keywordMatch) {
      return null
    }

    let content = null

    // Get content based on the type of keyword match
    switch (keywordMatch.type) {
      case "content":
        content = await getContentById(keywordMatch.contentId)
        break
      case "category":
        const categoryContent = await getContentByCategory(keywordMatch.categoryId, 1)
        content = categoryContent.length > 0 ? categoryContent[0] : null
        break
      case "contentType":
        const typeContent = await getContentByType(keywordMatch.contentType, 1)
        content = typeContent.length > 0 ? typeContent[0] : null
        break
      case "culturalOrigin":
      case "language":
        // For cultural origin and language, get recommended content
        const recommendedContent = await getRecommendedContent(userId, null, 1)
        content = recommendedContent.length > 0 ? recommendedContent[0] : null
        break
    }

    if (!content) {
      // If no specific content was found, get a general recommendation
      const recommendedContent = await getRecommendedContent(userId, null, 1)
      content = recommendedContent.length > 0 ? recommendedContent[0] : null
    }

    if (!content) {
      return null
    }

    // Record the content playback in user history
    if (callId) {
      const supabase = getSupabaseServerClient()
      await supabase.from("user_content_history").insert({
        user_id: userId,
        content_id: content.id,
        call_id: callId,
        played_at: new Date().toISOString(),
      })
    }

    return {
      content,
      contentType: content.content_type,
      category: content.content_categories,
    }
  } catch (error) {
    console.error("Error in handleContentRequest:", error)
    return null
  }
}

// Function to format content for speech
export function formatContentForSpeech(content) {
  if (!content) return null

  let speechText = ""

  // Add introduction based on content type
  switch (content.content_type) {
    case "folktale":
      speechText += `Let me tell you a story. This is a ${content.cultural_origin || "Nigerian"} folktale called "${
        content.title
      }". `
      break
    case "proverb":
      speechText += `Here are some ${content.cultural_origin || "Nigerian"} proverbs and wisdom. `
      break
    case "music":
      speechText += `Let me tell you about some ${content.cultural_origin || "Nigerian"} music. `
      break
    case "history":
      speechText += `Let me share some history about ${content.title}. `
      break
    case "news":
      speechText += `Here's some news and current events. `
      break
    case "religious":
      speechText += `Here's some religious content that might interest you. `
      break
    default:
      speechText += `Here's something I think you might enjoy. `
  }

  // Add the content text
  speechText += content.content_text

  // Add a closing remark
  speechText += " I hope you enjoyed that. Would you like to hear something else?"

  return speechText
}

// Function to generate content recommendations prompt
export function generateContentRecommendationsPrompt(userId: string) {
  return `I can share stories, proverbs, music, or history with you. What would you like to hear about today?`
}
