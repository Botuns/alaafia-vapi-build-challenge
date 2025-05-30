import { getSupabaseServerClient } from "@/lib/supabase"

// Function to get recommended content for a user
export async function getRecommendedContent(userId: string, contentType?: string, limit = 5) {
  try {
    const supabase = getSupabaseServerClient()

    // Get user's content history to avoid recommending recently played content
    const { data: history, error: historyError } = await supabase
      .from("user_content_history")
      .select("content_id")
      .eq("user_id", userId)
      .order("played_at", { ascending: false })
      .limit(10)

    if (historyError) {
      console.error("Error fetching user content history:", historyError)
    }

    // Get user preferences
    const { data: preferences, error: preferencesError } = await supabase
      .from("user_content_preferences")
      .select("*")
      .eq("user_id", userId)
      .order("preference_level", { ascending: false })

    if (preferencesError) {
      console.error("Error fetching user preferences:", preferencesError)
    }

    // Get user details to check cultural preferences
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("preferences")
      .eq("id", userId)
      .single()

    if (userError) {
      console.error("Error fetching user details:", userError)
    }

    // Build query for content items
    let query = supabase.from("content_items").select("*, content_categories(*)")

    // Filter by content type if provided
    if (contentType) {
      query = query.eq("content_type", contentType)
    }

    // Filter out recently played content
    if (history && history.length > 0) {
      const recentContentIds = history.map((h) => h.content_id)
      query = query.not("id", "in", `(${recentContentIds.join(",")})`)
    }

    // Prioritize featured content and active content
    query = query.eq("is_active", true).order("is_featured", { ascending: false })

    // Apply user preferences if available
    if (preferences && preferences.length > 0) {
      // Get preferred languages and cultural origins
      const preferredLanguages = preferences
        .filter((p) => p.language)
        .map((p) => p.language)
        .filter(Boolean)

      const preferredOrigins = preferences
        .filter((p) => p.cultural_origin)
        .map((p) => p.cultural_origin)
        .filter(Boolean)

      // If user has language preferences, apply them
      if (preferredLanguages.length > 0) {
        query = query.in("language", preferredLanguages)
      }

      // If user has cultural origin preferences, prioritize them
      if (preferredOrigins.length > 0) {
        query = query.order("cultural_origin", { ascending: false, nullsLast: true })
      }
    } else if (user && user.preferences && user.preferences[0]) {
      // Use preferences from user profile if available
      const userPrefs = user.preferences[0]

      // If user has story preferences, prioritize content with matching tags
      if (userPrefs.stories && userPrefs.stories.length > 0) {
        // This is a simplification - in a real app, you'd use a more sophisticated matching algorithm
        query = query.order("created_at", { ascending: false })
      }

      // If user has music preferences, prioritize content with matching tags
      if (userPrefs.music && userPrefs.music.length > 0) {
        // This is a simplification - in a real app, you'd use a more sophisticated matching algorithm
        query = query.order("created_at", { ascending: false })
      }
    }

    // Get the content items
    const { data: contentItems, error } = await query.limit(limit)

    if (error) {
      console.error("Error fetching recommended content:", error)
      return []
    }

    return contentItems || []
  } catch (error) {
    console.error("Error in getRecommendedContent:", error)
    return []
  }
}

// Function to record content playback in user history
export async function recordContentPlayback(userId: string, contentId: string, callId?: string) {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from("user_content_history")
      .insert({
        user_id: userId,
        content_id: contentId,
        call_id: callId,
        played_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error recording content playback:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in recordContentPlayback:", error)
    return null
  }
}

// Function to update user content preferences
export async function updateUserContentPreference(
  userId: string,
  preferenceData: {
    categoryId?: string
    contentType?: string
    language?: string
    culturalOrigin?: string
    preferenceLevel: number
  },
) {
  try {
    const supabase = getSupabaseServerClient()
    const { categoryId, contentType, language, culturalOrigin, preferenceLevel } = preferenceData

    // Check if preference already exists
    let query = supabase.from("user_content_preferences").select("id").eq("user_id", userId)

    if (categoryId) query = query.eq("category_id", categoryId)
    else query = query.is("category_id", null)

    if (contentType) query = query.eq("content_type", contentType)
    else query = query.is("content_type", null)

    if (language) query = query.eq("language", language)
    else query = query.is("language", null)

    if (culturalOrigin) query = query.eq("cultural_origin", culturalOrigin)
    else query = query.is("cultural_origin", null)

    const { data: existingPreference, error: fetchError } = await query.maybeSingle()

    if (fetchError) {
      console.error("Error fetching user preference:", fetchError)
      return null
    }

    let result

    if (existingPreference) {
      // Update existing preference
      const { data, error } = await supabase
        .from("user_content_preferences")
        .update({
          preference_level: preferenceLevel,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingPreference.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating user preference:", error)
        return null
      }

      result = data
    } else {
      // Create new preference
      const { data, error } = await supabase
        .from("user_content_preferences")
        .insert({
          user_id: userId,
          category_id: categoryId,
          content_type: contentType,
          language: language,
          cultural_origin: culturalOrigin,
          preference_level: preferenceLevel,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating user preference:", error)
        return null
      }

      result = data
    }

    return result
  } catch (error) {
    console.error("Error in updateUserContentPreference:", error)
    return null
  }
}

// Function to detect content keywords in transcript
export async function detectContentKeywords(transcript: string) {
  try {
    const supabase = getSupabaseServerClient()

    // Get all content keywords
    const { data: keywords, error } = await supabase.from("content_keywords").select("*")

    if (error) {
      console.error("Error fetching content keywords:", error)
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

    // Group matched keywords by type
    const contentIdMatches = matchedKeywords.filter((k) => k.content_id)
    const categoryIdMatches = matchedKeywords.filter((k) => k.category_id)
    const contentTypeMatches = matchedKeywords.filter((k) => k.content_type)
    const languageMatches = matchedKeywords.filter((k) => k.language)
    const culturalOriginMatches = matchedKeywords.filter((k) => k.cultural_origin)

    // Prioritize matches: specific content > category > content type > cultural origin > language
    if (contentIdMatches.length > 0) {
      return {
        type: "content",
        contentId: contentIdMatches[0].content_id,
      }
    } else if (categoryIdMatches.length > 0) {
      return {
        type: "category",
        categoryId: categoryIdMatches[0].category_id,
      }
    } else if (contentTypeMatches.length > 0) {
      return {
        type: "contentType",
        contentType: contentTypeMatches[0].content_type,
      }
    } else if (culturalOriginMatches.length > 0) {
      return {
        type: "culturalOrigin",
        culturalOrigin: culturalOriginMatches[0].cultural_origin,
      }
    } else if (languageMatches.length > 0) {
      return {
        type: "language",
        language: languageMatches[0].language,
      }
    }

    return null
  } catch (error) {
    console.error("Error in detectContentKeywords:", error)
    return null
  }
}

// Function to get content by ID
export async function getContentById(contentId: string) {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from("content_items")
      .select("*, content_categories(*)")
      .eq("id", contentId)
      .single()

    if (error) {
      console.error("Error fetching content by ID:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getContentById:", error)
    return null
  }
}

// Function to get content by category
export async function getContentByCategory(categoryId: string, limit = 10) {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from("content_items")
      .select("*, content_categories(*)")
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching content by category:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getContentByCategory:", error)
    return []
  }
}

// Function to get content by type
export async function getContentByType(contentType: string, limit = 10) {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from("content_items")
      .select("*, content_categories(*)")
      .eq("content_type", contentType)
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching content by type:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getContentByType:", error)
    return []
  }
}

// Function to get all categories
export async function getAllCategories() {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase.from("content_categories").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching all categories:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllCategories:", error)
    return []
  }
}

// Function to get user content history
export async function getUserContentHistory(userId: string, limit = 10) {
  try {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from("user_content_history")
      .select(`
        *,
        content_items (*, content_categories(*))
      `)
      .eq("user_id", userId)
      .order("played_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching user content history:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getUserContentHistory:", error)
    return []
  }
}
