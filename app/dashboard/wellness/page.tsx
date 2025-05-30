"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import DashboardHeader from "@/components/dashboard-header"
import DashboardNav from "@/components/dashboard-nav"
import { WellnessCheckForm } from "@/components/wellness-check-form"
import { WellnessChecksList } from "@/components/wellness-checks-list"
import { WellnessTrends } from "@/components/wellness-trends"
import { Loader2, Plus, Users } from "lucide-react"

export default function WellnessPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [activeTab, setActiveTab] = useState("scheduled")
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/users")

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data.users || [])

      // Select the first user by default if available
      if (data.users && data.users.length > 0) {
        setSelectedUserId(data.users[0].id)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedUser = users.find((user) => user.id === selectedUserId)

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="flex">
        <DashboardNav />

        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Wellness Check-ins</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Users</CardTitle>
                <CardDescription>Select a user to manage wellness checks</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                  </div>
                ) : users.length === 0 ? (
                  <p className="text-center text-gray-500 py-2">No users found</p>
                ) : (
                  <div className="space-y-2">
                    {users.map((user) => (
                      <Button
                        key={user.id}
                        variant={selectedUserId === user.id ? "default" : "outline"}
                        className={`w-full justify-start ${
                          selectedUserId === user.id ? "bg-emerald-600 hover:bg-emerald-700" : ""
                        }`}
                        onClick={() => {
                          setSelectedUserId(user.id)
                          setShowAddForm(false)
                        }}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        {user.name}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="md:col-span-3">
              {!selectedUserId ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500 py-4">Select a user to manage wellness checks</p>
                  </CardContent>
                </Card>
              ) : showAddForm ? (
                <div className="space-y-4">
                  <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                    Back to List
                  </Button>
                  <WellnessCheckForm
                    userId={selectedUserId}
                    userName={selectedUser?.name || ""}
                    onSuccess={() => {
                      setShowAddForm(false)
                      setActiveTab("scheduled")
                    }}
                  />
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{selectedUser?.name}'s Wellness Checks</h2>
                    <Button onClick={() => setShowAddForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Schedule Check
                    </Button>
                  </div>

                  <Tabs defaultValue="scheduled" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="scheduled">Scheduled Checks</TabsTrigger>
                      <TabsTrigger value="trends">Wellness Trends</TabsTrigger>
                    </TabsList>

                    <TabsContent value="scheduled" className="space-y-4">
                      <WellnessChecksList
                        userId={selectedUserId}
                        userName={selectedUser?.name || ""}
                        phoneNumber={selectedUser?.phone || ""}
                      />
                    </TabsContent>

                    <TabsContent value="trends">
                      <WellnessTrends userId={selectedUserId} />
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
