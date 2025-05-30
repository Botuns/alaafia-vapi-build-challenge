"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Star, Music, BookOpen, History, Heart, Newspaper, BookText } from "lucide-react"
import Link from "next/link"

interface ContentItem {
  id: string
  title: string
  description: string
  content_type: string
  language: string
  cultural_origin: string
  is_featured: boolean
  content_categories: {
    id: string
    name: string
  }
}

interface ContentItemsListProps {
  categoryId?: string
  contentType?: string
  featured?: boolean
  limit?: number
}

export function ContentItemsList({ categoryId, contentType, featured, limit = 10 }: ContentItemsListProps) {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        let url = "/api/content/items?"

        if (categoryId) {
          url += `categoryId=${categoryId}&`
        }

        if (contentType) {
          url += `contentType=${contentType}&`
        }

        if (featured) {
          url += `featured=true&`
        }

        url += `limit=${limit}`

        const response = await fetch(url)
        if (!response.ok) {
          throw new Error("Failed to fetch content items")
        }
        const data = await response.json()
        setItems(data.items || [])
      } catch (error) {
        console.error("Error fetching content items:", error)
        toast({
          title: "Error",
          description: "Failed to load content items. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [categoryId, contentType, featured, limit])

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "music":
        return <Music className="h-4 w-4" />
      case "folktale":
      case "story":
        return <BookOpen className="h-4 w-4" />
      case "history":
        return <History className="h-4 w-4" />
      case "religious":
        return <Heart className="h-4 w-4" />
      case "news":
        return <Newspaper className="h-4 w-4" />
      case "proverb":
        return <BookText className="h-4 w-4" />
      default:
        return <BookText className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500 py-4">No content items available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <div className="flex items-center mb-2">
                  <h3 className="font-medium text-lg mr-2">{item.title}</h3>
                  {item.is_featured && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className="bg-emerald-100 text-emerald-800 flex items-center">
                    {getContentTypeIcon(item.content_type)}
                    <span className="ml-1 capitalize">{item.content_type}</span>
                  </Badge>

                  {item.content_categories && (
                    <Badge className="bg-blue-100 text-blue-800">{item.content_categories.name}</Badge>
                  )}

                  {item.cultural_origin && (
                    <Badge className="bg-purple-100 text-purple-800">{item.cultural_origin}</Badge>
                  )}

                  <Badge className="bg-gray-100 text-gray-800 capitalize">{item.language}</Badge>
                </div>

                {item.description && <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>}
              </div>

              <Link href={`/dashboard/content/${item.id}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
