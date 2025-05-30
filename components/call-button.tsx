"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Phone, Loader2 } from "lucide-react"

interface CallButtonProps {
  userId: string
  phoneNumber: string
  userName: string
  callType?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function CallButton({
  userId,
  phoneNumber,
  userName,
  callType = "general",
  variant = "outline",
  size = "sm",
  className,
}: CallButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCall = async () => {
    try {
      setIsLoading(true)

      // Prepare message based on call type
      let message = `Hello ${userName}, this is Alafia, your voice companion.`

      if (callType === "medication_reminder") {
        message = `Hello ${userName}, this is Alafia. I'm calling to remind you about your medication.`
      } else if (callType === "wellness_check") {
        message = `Hello ${userName}, this is Alafia. I'm calling to check how you're doing today.`
      }

      // Make API call to initiate the call
      const response = await fetch("/api/calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          phoneNumber,
          callType,
          message,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to initiate call")
      }

      const data = await response.json()

      toast({
        title: "Call Initiated",
        description: `Calling ${userName} now...`,
      })
    } catch (error) {
      console.error("Error initiating call:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to initiate call. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={handleCall} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Calling...
        </>
      ) : (
        <>
          <Phone className="h-4 w-4 mr-2" />
          Call Now
        </>
      )}
    </Button>
  )
}
