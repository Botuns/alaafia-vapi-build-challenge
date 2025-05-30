"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { AlertTriangle, CheckCircle, Clock, User, Phone, MapPin, Loader2 } from "lucide-react"
import Link from "next/link"

interface EmergencyAlertsListProps {
  userId?: string
  status?: string
  severity?: string
  limit?: number
  showUser?: boolean
}

export function EmergencyAlertsList({
  userId,
  status,
  severity,
  limit = 10,
  showUser = true,
}: EmergencyAlertsListProps) {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        let url = "/api/emergency/alerts?"

        if (userId) {
          url += `userId=${userId}&`
        }

        if (status) {
          url += `status=${status}&`
        }

        if (severity) {
          url += `severity=${severity}&`
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error("Failed to fetch emergency alerts")
        }

        const data = await response.json()
        setAlerts(data.alerts || [])
      } catch (error) {
        console.error("Error fetching emergency alerts:", error)
        toast({
          title: "Error",
          description: "Failed to load emergency alerts. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [userId, status, severity])

  const getSeverityColor = (alertSeverity) => {
    switch (alertSeverity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (alertStatus) => {
    switch (alertStatus) {
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "acknowledged":
        return "bg-purple-100 text-purple-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "false_alarm":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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

  if (alerts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500 py-4">No emergency alerts found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Card key={alert.id} className="overflow-hidden">
          <div
            className={`h-2 ${
              alert.severity === "high" ? "bg-red-500" : alert.severity === "medium" ? "bg-orange-500" : "bg-yellow-500"
            }`}
          />
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle
                    className={`h-5 w-5 ${
                      alert.severity === "high"
                        ? "text-red-500"
                        : alert.severity === "medium"
                          ? "text-orange-500"
                          : "text-yellow-500"
                    }`}
                  />
                  <h3 className="font-medium text-lg">Emergency Alert</h3>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)} Severity
                  </Badge>
                  <Badge className={getStatusColor(alert.status)}>
                    {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                  </Badge>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Detected at {formatDate(alert.created_at)}</span>
                </div>

                {showUser && alert.users && (
                  <div className="flex items-center text-sm mb-3">
                    <User className="h-3 w-3 mr-1 text-gray-500" />
                    <span className="font-medium mr-3">{alert.users.name}</span>
                    {alert.users.phone && (
                      <>
                        <Phone className="h-3 w-3 mr-1 text-gray-500" />
                        <span className="mr-3">{alert.users.phone}</span>
                      </>
                    )}
                    {alert.users.location && (
                      <>
                        <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                        <span>{alert.users.location}</span>
                      </>
                    )}
                  </div>
                )}

                {alert.detected_keywords && alert.detected_keywords.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 mb-1">Detected keywords:</p>
                    <div className="flex flex-wrap gap-1">
                      {alert.detected_keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {alert.transcript_excerpt && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 mb-1">Transcript excerpt:</p>
                    <div className="bg-gray-50 p-2 rounded-md text-sm text-gray-800 italic">
                      "{alert.transcript_excerpt}"
                    </div>
                  </div>
                )}
              </div>

              <Link href={`/dashboard/emergency/${alert.id}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </div>

            {alert.status === "resolved" && alert.resolved_at && (
              <div className="mt-3 flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Resolved at {formatDate(alert.resolved_at)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
