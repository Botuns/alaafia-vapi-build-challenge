"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2, TrendingUp, Smile, Frown, Meh } from "lucide-react"

interface WellnessTrendsProps {
  userId: string
  wellnessCheckId?: string
}

export function WellnessTrends({ userId, wellnessCheckId }: WellnessTrendsProps) {
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    averageMood: 0,
    moodTrend: "stable",
    responseCount: 0,
    lastResponse: null,
  })

  useEffect(() => {
    fetchResponses()
  }, [userId, wellnessCheckId])

  const fetchResponses = async () => {
    try {
      setLoading(true)
      const url = wellnessCheckId
        ? `/api/wellness-checks/${wellnessCheckId}/responses`
        : `/api/wellness-responses?userId=${userId}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to fetch wellness responses")
      }

      const data = await response.json()
      const responseData = data.responses || []
      setResponses(responseData)

      // Calculate stats
      if (responseData.length > 0) {
        const moodSum = responseData.reduce((sum, r) => sum + (r.mood_rating || 0), 0)
        const avgMood = moodSum / responseData.length

        // Determine trend (simple version)
        let trend = "stable"
        if (responseData.length >= 3) {
          const recent = responseData.slice(0, 3).map((r) => r.mood_rating || 0)
          const avg = recent.reduce((sum, val) => sum + val, 0) / recent.length
          const older = responseData.slice(3, 6).map((r) => r.mood_rating || 0)

          if (older.length > 0) {
            const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length
            if (avg > olderAvg + 0.5) trend = "improving"
            else if (avg < olderAvg - 0.5) trend = "declining"
          }
        }

        setStats({
          averageMood: avgMood,
          moodTrend: trend,
          responseCount: responseData.length,
          lastResponse: responseData[0],
        })
      }
    } catch (error) {
      console.error("Error fetching wellness responses:", error)
      toast({
        title: "Error",
        description: "Failed to load wellness data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getMoodIcon = (rating) => {
    if (!rating) return <Meh className="h-5 w-5 text-gray-400" />
    if (rating >= 4) return <Smile className="h-5 w-5 text-green-500" />
    if (rating <= 2) return <Frown className="h-5 w-5 text-red-500" />
    return <Meh className="h-5 w-5 text-yellow-500" />
  }

  const getTrendColor = (trend) => {
    if (trend === "improving") return "text-green-500"
    if (trend === "declining") return "text-red-500"
    return "text-yellow-500"
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (responses.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500 py-4">No wellness data available yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Mood</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="text-4xl font-bold">{stats.averageMood.toFixed(1)}</div>
              <div className="ml-2">{getMoodIcon(stats.averageMood)}</div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">out of 5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Mood Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <TrendingUp className={`h-6 w-6 mr-2 ${getTrendColor(stats.moodTrend)}`} />
              <div className="text-xl font-medium capitalize">{stats.moodTrend}</div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">based on recent responses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Response Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="text-4xl font-bold">{stats.responseCount}</div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">total responses</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {responses.slice(0, 5).map((response) => (
              <div key={response.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    {getMoodIcon(response.mood_rating)}
                    <span className="ml-2 font-medium">
                      Mood: {response.mood_rating ? response.mood_rating + "/5" : "Not recorded"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{formatDate(response.created_at)}</div>
                </div>
                {response.physical_wellbeing && response.physical_wellbeing !== "not_specified" && (
                  <div className="mb-2">
                    <span className="text-sm">
                      Physical wellbeing: <span className="capitalize">{response.physical_wellbeing}</span>
                    </span>
                  </div>
                )}
                {response.notes && (
                  <div className="text-sm text-gray-700 mt-2">
                    <p>{response.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
