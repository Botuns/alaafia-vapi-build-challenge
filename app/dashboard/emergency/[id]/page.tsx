"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import DashboardHeader from "@/components/dashboard-header"
import DashboardNav from "@/components/dashboard-nav"
import { EmergencyAlertDetail } from "@/components/emergency-alert-detail"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function EmergencyAlertDetailPage({ params }) {
  const alertId = params.id
  const router = useRouter()
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchAlert = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/emergency/alerts/${alertId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch alert details")
      }

      const data = await response.json()
      setAlert(data.alert)
    } catch (error) {
      console.error("Error fetching alert details:", error)
      toast({
        title: "Error",
        description: "Failed to load alert details. Please try again.",
        variant: "destructive",
      })
      router.push("/dashboard/emergency")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlert()
  }, [alertId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="flex">
          <DashboardNav />
          <main className="flex-1 p-6 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </main>
        </div>
      </div>
    )
  }

  if (!alert) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="flex">
          <DashboardNav />
          <main className="flex-1 p-6">
            <div className="text-center py-10">
              <p>Alert not found.</p>
              <Link href="/dashboard/emergency">
                <Button variant="link">Back to Emergency Dashboard</Button>
              </Link>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="flex">
        <DashboardNav />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <Link href="/dashboard/emergency" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Emergency Dashboard
            </Link>
          </div>

          <EmergencyAlertDetail alert={alert} onStatusChange={fetchAlert} />
        </main>
      </div>
    </div>
  )
}
