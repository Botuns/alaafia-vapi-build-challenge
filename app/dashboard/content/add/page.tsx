"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import DashboardHeader from "@/components/dashboard-header";
import DashboardNav from "@/components/dashboard-nav";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

export default function AddContentPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contentType: "",
    categoryId: "",
    language: "english",
    culturalOrigin: "",
    contentText: "",
    audioUrl: "",
    imageUrl: "",
    duration: "",
    isFeatured: false,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/content/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.contentType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/content/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          contentType: formData.contentType,
          categoryId: formData.categoryId || null,
          language: formData.language,
          culturalOrigin: formData.culturalOrigin,
          contentText: formData.contentText,
          audioUrl: formData.audioUrl,
          imageUrl: formData.imageUrl,
          duration: formData.duration
            ? Number.parseInt(formData.duration)
            : null,
          tags: tags,
          isFeatured: formData.isFeatured,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create content item");
      }

      toast({
        title: "Success",
        description: "Content item created successfully",
      });

      router.push("/dashboard/content");
    } catch (error) {
      console.error("Error creating content item:", error);
      toast({
        title: "Error",
        description: "Failed to create content item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <DashboardHeader />

      <div className="flex">
        <DashboardNav />

        <main className="flex-1 p-6 ">
          <div className="mb-6">
            <Link
              href="/dashboard/content"
              className="inline-flex items-center text-emerald-600 hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Content Library
            </Link>
            <h1 className="text-2xl font-bold mt-2">Add New Content</h1>
          </div>

          <Card className=" mx-auto max-w-4xl">
            <CardHeader>
              <CardTitle>Create Content Item</CardTitle>
              <CardDescription>
                Add new culturally appropriate content for elderly users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Enter content title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contentType">Content Type *</Label>
                    <Select
                      value={formData.contentType}
                      onValueChange={(value) =>
                        handleInputChange("contentType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="folktale">Folktale</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                        <SelectItem value="proverb">Proverb</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="religious">Religious</SelectItem>
                        <SelectItem value="news">News</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Brief description of the content"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) =>
                        handleInputChange("categoryId", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) =>
                        handleInputChange("language", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="yoruba">Yoruba</SelectItem>
                        <SelectItem value="igbo">Igbo</SelectItem>
                        <SelectItem value="hausa">Hausa</SelectItem>
                        <SelectItem value="pidgin">Nigerian Pidgin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="culturalOrigin">Cultural Origin</Label>
                    <Input
                      id="culturalOrigin"
                      value={formData.culturalOrigin}
                      onChange={(e) =>
                        handleInputChange("culturalOrigin", e.target.value)
                      }
                      placeholder="e.g., Yoruba, Igbo, Hausa"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentText">Content Text</Label>
                  <Textarea
                    id="contentText"
                    value={formData.contentText}
                    onChange={(e) =>
                      handleInputChange("contentText", e.target.value)
                    }
                    placeholder="The actual content text (story, proverb, etc.)"
                    rows={8}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="audioUrl">Audio URL</Label>
                    <Input
                      id="audioUrl"
                      value={formData.audioUrl}
                      onChange={(e) =>
                        handleInputChange("audioUrl", e.target.value)
                      }
                      placeholder="https://example.com/audio.mp3"
                      type="url"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        handleInputChange("imageUrl", e.target.value)
                      }
                      placeholder="https://example.com/image.jpg"
                      type="url"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) =>
                        handleInputChange("duration", e.target.value)
                      }
                      placeholder="120"
                      type="number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      handleInputChange("isFeatured", checked as boolean)
                    }
                  />
                  <Label htmlFor="featured">Mark as featured content</Label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {loading ? "Creating..." : "Create Content"}
                  </Button>
                  <Link href="/dashboard/content">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
