"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Plus, Trash2, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function EmergencyKeywordsManager() {
  const [keywords, setKeywords] = useState([])
  const [loading, setLoading] = useState(true)
  const [newKeyword, setNewKeyword] = useState("")
  const [newSeverity, setNewSeverity] = useState("medium")
  const [isAdding, setIsAdding] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchKeywords()
  }, [])

  const fetchKeywords = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/emergency/keywords")

      if (!response.ok) {
        throw new Error("Failed to fetch emergency keywords")
      }

      const data = await response.json()
      setKeywords(data.keywords || [])
    } catch (error) {
      console.error("Error fetching emergency keywords:", error)
      toast({
        title: "Error",
        description: "Failed to load emergency keywords. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddKeyword = async (e) => {
    e.preventDefault()

    if (!newKeyword.trim()) {
      toast({
        title: "Error",
        description: "Keyword cannot be empty",
        variant: "destructive",
      })
      return
    }

    try {
      setIsAdding(true)
      const response = await fetch("/api/emergency/keywords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword: newKeyword,
          severity: newSeverity,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to add keyword")
      }

      const data = await response.json()

      setKeywords([...keywords, data.keyword])
      setNewKeyword("")
      setNewSeverity("medium")

      toast({
        title: "Success",
        description: "Emergency keyword added successfully",
      })
    } catch (error) {
      console.error("Error adding keyword:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add keyword. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteKeyword = async () => {
    if (!deleteId) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/emergency/keywords/${deleteId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete keyword")
      }

      setKeywords(keywords.filter((keyword) => keyword.id !== deleteId))
      toast({
        title: "Success",
        description: "Emergency keyword deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting keyword:", error)
      toast({
        title: "Error",
        description: "Failed to delete keyword. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Keywords</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <form onSubmit={handleAddKeyword} className="flex items-end gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="keyword">New Keyword</Label>
              <Input
                id="keyword"
                placeholder="Enter emergency keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
              />
            </div>
            <div className="space-y-2 w-40">
              <Label htmlFor="severity">Severity</Label>
              <Select value={newSeverity} onValueChange={setNewSeverity}>
                <SelectTrigger id="severity">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isAdding}>
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Keyword
                </>
              )}
            </Button>
          </form>

          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            </div>
          ) : keywords.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No emergency keywords found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {keywords.map((keyword) => (
                <div key={keyword.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(keyword.severity)}>
                      {keyword.severity.charAt(0).toUpperCase() + keyword.severity.slice(1)}
                    </Badge>
                    <span>{keyword.keyword}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(keyword.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the emergency keyword.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteKeyword}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
