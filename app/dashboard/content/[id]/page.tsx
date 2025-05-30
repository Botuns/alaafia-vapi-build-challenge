"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import DashboardHeader from "@/components/dashboard-header";
import DashboardNav from "@/components/dashboard-nav";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  Music,
  BookOpen,
  History,
  Heart,
  Newspaper,
  BookText,
  Loader2,
  Globe,
  Tag,
} from "lucide-react";
import Link from "next/link";

export default function ContentItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved_params = use(params);
  const itemId = resolved_params.id;
  const router = useRouter();
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/content/items/${itemId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch content item");
        }

        const data = await response.json();
        setItem(data.item);
      } catch (error) {
        console.error("Error fetching content item:", error);
        toast({
          title: "Error",
          description: "Failed to load content item. Please try again.",
          variant: "destructive",
        });
        router.push("/dashboard/content");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId, router]);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this content item? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(`/api/content/items/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete content item");
      }

      toast({
        title: "Success",
        description: "Content item deleted successfully",
      });
      router.push("/dashboard/content");
    } catch (error) {
      console.error("Error deleting content item:", error);
      toast({
        title: "Error",
        description: "Failed to delete content item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "music":
        return <Music className="h-5 w-5" />;
      case "folktale":
      case "story":
        return <BookOpen className="h-5 w-5" />;
      case "history":
        return <History className="h-5 w-5" />;
      case "religious":
        return <Heart className="h-5 w-5" />;
      case "news":
        return <Newspaper className="h-5 w-5" />;
      case "proverb":
        return <BookText className="h-5 w-5" />;
      default:
        return <BookText className="h-5 w-5" />;
    }
  };

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
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="flex">
          <DashboardNav />
          <main className="flex-1 p-6">
            <div className="text-center py-10">
              <p>Content item not found.</p>
              <Link href="/dashboard/content">
                <Button variant="link">Back to Content Library</Button>
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="flex">
        <DashboardNav />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <Link
              href="/dashboard/content"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Content Library
            </Link>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{item.title}</h1>
            <div className="flex gap-3">
              <Link href={`/dashboard/content/${itemId}/edit`}>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Content
                </Button>
              </Link>
              <Button
                variant="outline"
                className="text-red-600"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>Full content text</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{item.content_text}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
                <CardDescription>Content metadata</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Content Type
                    </h3>
                    <div className="flex items-center">
                      {getContentTypeIcon(item.content_type)}
                      <span className="ml-2 capitalize">
                        {item.content_type}
                      </span>
                    </div>
                  </div>

                  {item.content_categories && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Category
                      </h3>
                      <div className="flex items-center">
                        <span>{item.content_categories.name}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Language
                    </h3>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      <span className="capitalize">{item.language}</span>
                    </div>
                  </div>

                  {item.cultural_origin && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Cultural Origin
                      </h3>
                      <div className="flex items-center">
                        <span>{item.cultural_origin}</span>
                      </div>
                    </div>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag: string, index: number) => (
                          <Badge
                            key={index}
                            className="bg-gray-100 text-gray-800"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Status
                    </h3>
                    <div className="flex items-center">
                      {item.is_featured && (
                        <Badge className="bg-yellow-100 text-yellow-800 mr-2">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge
                        className={
                          item.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {item.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>

                  {item.audio_url && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Audio
                      </h3>
                      <audio controls className="w-full">
                        <source src={item.audio_url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  {item.image_url && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Image
                      </h3>
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-auto rounded-md"
                        style={{ maxHeight: "200px", objectFit: "cover" }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Voice Activation</CardTitle>
              <CardDescription>
                Keywords that trigger this content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  When users say these keywords during a call, this content may
                  be played:
                </p>
                <div className="flex flex-wrap gap-2">
                  {/* Default keywords based on content type */}
                  <Badge className="bg-emerald-100 text-emerald-800">
                    {item.content_type === "folktale"
                      ? "story"
                      : item.content_type}
                  </Badge>

                  {item.content_type === "folktale" && (
                    <Badge className="bg-emerald-100 text-emerald-800">
                      folktale
                    </Badge>
                  )}

                  {/* Keywords based on title (simplified) */}
                  {item.title.split(" ").map((word: string, index: number) => {
                    if (word.length > 4) {
                      return (
                        <Badge
                          key={index}
                          className="bg-blue-100 text-blue-800"
                        >
                          {word.toLowerCase()}
                        </Badge>
                      );
                    }
                    return null;
                  })}

                  {/* Cultural origin as keyword */}
                  {item.cultural_origin && (
                    <Badge className="bg-purple-100 text-purple-800">
                      {item.cultural_origin.toLowerCase()}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
