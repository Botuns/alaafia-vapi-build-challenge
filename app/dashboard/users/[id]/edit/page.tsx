"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import DashboardHeader from "@/components/dashboard-header"
import DashboardNav from "@/components/dashboard-nav"
import { ArrowLeft, Plus, Trash, Loader2 } from "lucide-react"
import Link from "next/link"

export default function EditUserPage({ params }) {
  const userId = params.id
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    location: "",
    emergencyContacts: [],
    medications: [],
    preferences: {
      stories: [],
      music: [],
      callTimes: ["9:00 AM", "7:00 PM"],
    },
  })
  const [additionalPreferences, setAdditionalPreferences] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch user")
        }

        const { user } = await response.json()

        // Transform the data to match our form structure
        setFormData({
          name: user.name,
          age: user.age.toString(),
          phone: user.phone,
          location: user.location || "",
          emergencyContacts:
            user.emergency_contacts.length > 0
              ? user.emergency_contacts.map((contact) => ({
                  name: contact.name,
                  phone: contact.phone,
                  relationship: contact.relationship || "",
                }))
              : [{ name: "", phone: "", relationship: "" }],
          medications:
            user.medications.length > 0
              ? user.medications.map((med) => ({
                  name: med.name,
                  time: med.time,
                  frequency: med.frequency,
                }))
              : [{ name: "", time: "", frequency: "daily" }],
          preferences: {
            stories: user.preferences[0]?.stories || [],
            music: user.preferences[0]?.music || [],
            callTimes: user.preferences[0]?.call_times || ["9:00 AM", "7:00 PM"],
          },
        })
      } catch (error) {
        console.error("Error fetching user:", error)
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        })
        router.push("/dashboard/users")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEmergencyContactChange = (index, field, value) => {
    const updatedContacts = [...formData.emergencyContacts]
    updatedContacts[index] = { ...updatedContacts[index], [field]: value }
    setFormData((prev) => ({ ...prev, emergencyContacts: updatedContacts }))
  }

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...formData.medications]
    updatedMedications[index] = { ...updatedMedications[index], [field]: value }
    setFormData((prev) => ({ ...prev, medications: updatedMedications }))
  }

  const addEmergencyContact = () => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: "", phone: "", relationship: "" }],
    }))
  }

  const removeEmergencyContact = (index) => {
    if (formData.emergencyContacts.length > 1) {
      const updatedContacts = [...formData.emergencyContacts]
      updatedContacts.splice(index, 1)
      setFormData((prev) => ({ ...prev, emergencyContacts: updatedContacts }))
    }
  }

  const addMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, { name: "", time: "", frequency: "daily" }],
    }))
  }

  const removeMedication = (index) => {
    if (formData.medications.length > 1) {
      const updatedMedications = [...formData.medications]
      updatedMedications.splice(index, 1)
      setFormData((prev) => ({ ...prev, medications: updatedMedications }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Basic validation
      if (!formData.name || !formData.age || !formData.phone) {
        throw new Error("Name, age, and phone number are required")
      }

      // Process additional preferences if provided
      if (additionalPreferences.trim()) {
        const prefsArray = additionalPreferences
          .split(",")
          .map((pref) => pref.trim())
          .filter((pref) => pref)

        // Simple categorization based on keywords
        const stories = prefsArray.filter(
          (pref) =>
            pref.toLowerCase().includes("story") ||
            pref.toLowerCase().includes("tale") ||
            pref.toLowerCase().includes("news"),
        )

        const music = prefsArray.filter(
          (pref) =>
            pref.toLowerCase().includes("music") ||
            pref.toLowerCase().includes("song") ||
            pref.toLowerCase().includes("radio"),
        )

        // Update preferences
        setFormData((prev) => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            stories: [...prev.preferences.stories, ...stories],
            music: [...prev.preferences.music, ...music],
          },
        }))
      }

      // Send data to API
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update user")
      }

      toast({
        title: "Success",
        description: "User updated successfully",
      })

      // Redirect to users page after successful update
      router.push("/dashboard/users")
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="flex">
        <DashboardNav />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <Link href="/dashboard/users" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Edit User</CardTitle>
              <CardDescription>Update information for {formData.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g., Mama Titi"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        placeholder="e.g., 75"
                        value={formData.age}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="e.g., +234 801 234 5678"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="e.g., Lagos"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Emergency Contacts</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addEmergencyContact}>
                      <Plus className="h-4 w-4 mr-2" /> Add Contact
                    </Button>
                  </div>

                  {formData.emergencyContacts.map((contact, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg relative">
                      <div className="space-y-2">
                        <Label htmlFor={`contact-name-${index}`}>Contact Name</Label>
                        <Input
                          id={`contact-name-${index}`}
                          placeholder="e.g., Titi"
                          value={contact.name}
                          onChange={(e) => handleEmergencyContactChange(index, "name", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`contact-phone-${index}`}>Contact Phone</Label>
                        <Input
                          id={`contact-phone-${index}`}
                          placeholder="e.g., +234 901 234 5678"
                          value={contact.phone}
                          onChange={(e) => handleEmergencyContactChange(index, "phone", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`contact-relationship-${index}`}>Relationship</Label>
                        <Input
                          id={`contact-relationship-${index}`}
                          placeholder="e.g., Daughter"
                          value={contact.relationship}
                          onChange={(e) => handleEmergencyContactChange(index, "relationship", e.target.value)}
                        />
                      </div>

                      {formData.emergencyContacts.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                          onClick={() => removeEmergencyContact(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Medications</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                      <Plus className="h-4 w-4 mr-2" /> Add Medication
                    </Button>
                  </div>

                  {formData.medications.map((medication, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg relative">
                      <div className="space-y-2">
                        <Label htmlFor={`medication-name-${index}`}>Medication Name</Label>
                        <Input
                          id={`medication-name-${index}`}
                          placeholder="e.g., Blood Pressure Medicine"
                          value={medication.name}
                          onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`medication-time-${index}`}>Time</Label>
                        <Input
                          id={`medication-time-${index}`}
                          placeholder="e.g., 9:00 AM"
                          value={medication.time}
                          onChange={(e) => handleMedicationChange(index, "time", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`medication-frequency-${index}`}>Frequency</Label>
                        <Select
                          value={medication.frequency}
                          onValueChange={(value) => handleMedicationChange(index, "frequency", value)}
                        >
                          <SelectTrigger id={`medication-frequency-${index}`}>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="twice_daily">Twice Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="as_needed">As Needed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.medications.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                          onClick={() => removeMedication(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preferences</h3>

                  <div className="space-y-2">
                    <Label htmlFor="preferences">Additional Preferences</Label>
                    <Textarea
                      id="preferences"
                      placeholder="Enter preferences separated by commas (e.g., Yoruba stories, Gospel music, Evening news)"
                      rows={4}
                      value={additionalPreferences}
                      onChange={(e) => setAdditionalPreferences(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">
                      These will be used to personalize the user's experience with stories, music, and other content.
                    </p>
                  </div>

                  {(formData.preferences.stories.length > 0 || formData.preferences.music.length > 0) && (
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Current Preferences</h4>

                      {formData.preferences.stories.length > 0 && (
                        <div className="mb-2">
                          <p className="text-sm font-medium">Stories/Content:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {formData.preferences.stories.map((story, i) => (
                              <div key={i} className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                                {story}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {formData.preferences.music.length > 0 && (
                        <div>
                          <p className="text-sm font-medium">Music:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {formData.preferences.music.map((item, i) => (
                              <div key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => router.push("/dashboard/users")}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  )
}
