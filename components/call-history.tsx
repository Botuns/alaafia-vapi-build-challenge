"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Phone, Clock, FileText, Loader2 } from "lucide-react"

interface CallHistoryProps {
  userId?: string
  limit?: number
}

export function CallHistory({ userId, limit }: CallHistoryProps) {
  const [calls, setCalls] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        setLoading(true)
        const url = userId ? `/api/calls?userId=${userId}` : "/api/calls"
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error("Failed to fetch call history")
        }

        const data = await response.json()
        setCalls(limit ? data.calls.slice(0, limit) : data.calls)
      } catch (error) {
        console.error("Error fetching call history:", error)
        toast({
          title: "Error",
          description: "Failed to load call history. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCalls()
  }, [userId, limit])

  const getStatusColor = (status) => {
    switch (status) {
      case "initiated":
        return "bg-blue-100 text-blue-800"
      case "started":
        return "bg-yellow-100 text-yellow-800"
      case "ended":
        return "bg-green-100 text-green-800"
      case "emergency":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCallType = (type) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const formatDuration = (seconds) => {
    if (!seconds) return "N/A"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (calls.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">No call history available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {calls.map((call) => (
        <Card key={call.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-emerald-100 p-2 rounded-full mr-4">
                  <Phone className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{formatCallType(call.call_type)}</h3>
                    <Badge className={getStatusColor(call.status)}>{call.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">{new Date(call.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm">{formatDuration(call.duration)}</span>
                </div>
                {call.transcript && (
                  <div className="flex items-center text-emerald-600">
                    <FileText className="h-4 w-4 mr-1" />
                    <span className="text-sm">Transcript</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
