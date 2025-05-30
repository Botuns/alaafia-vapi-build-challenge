"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Phone,
  MapPin,
  MessageSquare,
  Bell,
  ArrowUpRight,
  Loader2,
} from "lucide-react"

interface EmergencyAlertDetailProps {
  alert: any
  onStatusChange?: () => void
}

export function EmergencyAlertDetail({ alert, onStatusChange }: EmergencyAlertDetailProps) {
  const [notes, setNotes] = useState("")
  const [updating, setUpdating] = useState(false)
  const [escalating, setEscalating] = useState(false)

  const getSeverityColor = (severity) => {
    switch (severity) {
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

  const getStatusColor = (status) => {
    switch (status) {
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

  const updateAlertStatus = async (newStatus) => {
    try {
      setUpdating(true)
      const response = await fetch(`/api/emergency/alerts/${alert.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          notes: notes.trim() || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update alert status")
      }

      toast({
        title: "Success",
        description: `Alert status updated to ${newStatus}`,
      })

      if (onStatusChange) {
        onStatusChange()
      }
    } catch (error) {
      console.error("Error updating alert status:", error)
      toast({
        title: "Error",
        description: "Failed to update alert status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const escalateAlert = async () => {
    try {
      setEscalating(true)
      const response = await fetch(`/api/emergency/alerts/${alert.id}/escalate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "Manual escalation",
          notes: notes.trim() || undefined,
          performedBy: "Caregiver",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to escalate alert")
      }

      toast({
        title: "Success",
        description: "Alert escalated successfully",
      })

      if (onStatusChange) {
        onStatusChange()
      }
    } catch (error) {
      console.error("Error escalating alert:", error)
      toast({
        title: "Error",
        description: "Failed to escalate alert. Please try again.",
        variant: "destructive",
      })
    } finally {
      setEscalating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <div
          className={`h-2 ${
            alert.severity === "high" ? "bg-red-500" : alert.severity === "medium" ? "bg-orange-500" : "bg-yellow-500"
          }`}
        />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle
                className={`h-5 w-5 ${
                  alert.severity === "high"
                    ? "text-red-500"
                    : alert.severity === "medium"
                      ? "text-orange-500"
                      : "text-yellow-500"
                }`}
              />
              <CardTitle>Emergency Alert</CardTitle>
            </div>
            <div className="flex gap-2">
              <Badge className={getSeverityColor(alert.severity)}>
                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)} Severity
              </Badge>
              <Badge className={getStatusColor(alert.status)}>
                {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
              </Badge>
            </div>
          </div>
          <CardDescription>
            <div className="flex items-center text-sm">
              <Clock className="h-3 w-3 mr-1" />
              <span>Detected at {formatDate(alert.created_at)}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alert.users && (
              <div className="border-b pb-4">
                <h3 className="text-sm font-medium mb-2">User Information</h3>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">{alert.users.name}</span>
                  </div>
                  {alert.users.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{alert.users.phone}</span>
                    </div>
                  )}
                  {alert.users.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{alert.users.location}</span>
                    </div>
                  )}
                  {alert.users.age && (
                    <div className="flex items-center">
                      <span className="text-gray-500 ml-6">Age: {alert.users.age}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="border-b pb-4">
              <h3 className="text-sm font-medium mb-2">Alert Details</h3>
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
                  <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-800 italic">
                    "{alert.transcript_excerpt}"
                  </div>
                </div>
              )}

              {alert.calls && (
                <div className="mb-3">
                  <p className="text-sm text-gray-700 mb-1">Call Information:</p>
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Call Type:</span>
                      <span>{alert.calls.call_type || "Unknown"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Call Time:</span>
                      <span>{formatDate(alert.calls.created_at)}</span>
                    </div>
                  </div>
                </div>
              )}

              {alert.notes && (
                <div className="mb-3">
                  <p className="text-sm text-gray-700 mb-1">Notes:</p>
                  <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-800">{alert.notes}</div>
                </div>
              )}
            </div>

            {alert.status !== "resolved" && alert.status !== "false_alarm" && (
              <div>
                <h3 className="text-sm font-medium mb-2">Actions</h3>
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add notes about this alert..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                  <div className="flex flex-wrap gap-2">
                    {alert.status === "pending" && (
                      <Button
                        onClick={() => updateAlertStatus("acknowledged")}
                        className="bg-purple-600 hover:bg-purple-700"
                        disabled={updating}
                      >
                        {updating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Bell className="mr-2 h-4 w-4" />
                        )}
                        Acknowledge
                      </Button>
                    )}
                    <Button
                      onClick={() => updateAlertStatus("resolved")}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={updating}
                    >
                      {updating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Mark as Resolved
                    </Button>
                    <Button onClick={() => updateAlertStatus("false_alarm")} variant="outline" disabled={updating}>
                      {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      False Alarm
                    </Button>
                    <Button onClick={escalateAlert} variant="outline" className="text-red-600" disabled={escalating}>
                      {escalating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                      )}
                      Escalate
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {alert.emergency_notifications && alert.emergency_notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Emergency contact notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alert.emergency_notifications.map((notification) => (
                <div key={notification.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">{notification.contact_name}</span>
                      <Badge className="ml-2 capitalize">{notification.contact_type}</Badge>
                    </div>
                    <Badge
                      className={
                        notification.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : notification.status === "sent"
                            ? "bg-blue-100 text-blue-800"
                            : notification.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                      }
                    >
                      {notification.status}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <span className="capitalize">{notification.notification_method}</span>
                    {notification.contact_phone && (
                      <>
                        <span className="mx-1">•</span>
                        <Phone className="h-3 w-3 mr-1" />
                        <span>{notification.contact_phone}</span>
                      </>
                    )}
                  </div>
                  {notification.sent_at && (
                    <div className="text-xs text-gray-500 mt-1">Sent at: {formatDate(notification.sent_at)}</div>
                  )}
                  {notification.delivered_at && (
                    <div className="text-xs text-gray-500">Delivered at: {formatDate(notification.delivered_at)}</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {alert.escalations && alert.escalations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Escalation History</CardTitle>
            <CardDescription>Timeline of alert escalation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alert.escalations.map((escalation) => (
                <div key={escalation.id} className="relative pl-6 pb-4 border-l border-gray-200">
                  <div className="absolute left-0 top-0 -ml-[7px] h-3 w-3 rounded-full bg-emerald-500"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Level {escalation.escalation_level} Escalation</p>
                      <p className="text-sm text-gray-500">{escalation.action_taken}</p>
                      {escalation.notes && <p className="text-sm text-gray-600 mt-1">{escalation.notes}</p>}
                      <p className="text-xs text-gray-400 mt-1">
                        By {escalation.performed_by} at {formatDate(escalation.escalation_time)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
