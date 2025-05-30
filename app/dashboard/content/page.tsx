"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardHeader from "@/components/dashboard-header";
import DashboardNav from "@/components/dashboard-nav";
import { ContentCategories } from "@/components/content-categories";
import { ContentItemsList } from "@/components/content-items-list";
import { BookOpen, Music, History, BookText, Plus } from "lucide-react";
import Link from "next/link";

export default function ContentLibraryPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const [activeTab, setActiveTab] = useState("all");
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    // If a category ID is provided, fetch the category name
    if (categoryId) {
      const fetchCategoryName = async () => {
        try {
          const response = await fetch("/api/content/categories");
          if (response.ok) {
            const data = await response.json();
            const category = data.categories.find(
              (cat: { id: string; name: string }) => cat.id === categoryId
            );
            if (category) {
              setCategoryName(category.name);
            }
          }
        } catch (error) {
          console.error("Error fetching category name:", error);
        }
      };

      fetchCategoryName();
    }
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="flex">
        <DashboardNav />

        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Content Library</h1>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/content/add">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Content
                </Button>
              </Link>
              <Link href="/dashboard/content/categories/add">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </Link>
            </div>
          </div>

          {categoryId ? (
            <div className="mb-6">
              <Link
                href="/dashboard/content"
                className="text-emerald-600 hover:underline"
              >
                ← Back to All Categories
              </Link>
              <h2 className="text-xl font-semibold mt-2">
                {categoryName || "Category Content"}
              </h2>
            </div>
          ) : (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Content Categories</CardTitle>
                <CardDescription>Browse content by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ContentCategories />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>
                {categoryId ? `${categoryName} Content` : "All Content"}
              </CardTitle>
              <CardDescription>
                {categoryId
                  ? `Browse all content in the ${categoryName} category`
                  : "Browse all content in the library"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="folktale" className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Folktales
                    </TabsTrigger>
                    <TabsTrigger value="proverb" className="flex items-center">
                      <BookText className="h-4 w-4 mr-1" />
                      Proverbs
                    </TabsTrigger>
                    <TabsTrigger value="music" className="flex items-center">
                      <Music className="h-4 w-4 mr-1" />
                      Music
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex items-center">
                      <History className="h-4 w-4 mr-1" />
                      History
                    </TabsTrigger>
                  </TabsList>

                  <Select defaultValue="english">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="yoruba">Yoruba</SelectItem>
                      <SelectItem value="igbo">Igbo</SelectItem>
                      <SelectItem value="hausa">Hausa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <TabsContent value="all">
                  <ContentItemsList categoryId={categoryId || undefined} />
                </TabsContent>

                <TabsContent value="folktale">
                  <ContentItemsList
                    categoryId={categoryId || undefined}
                    contentType="folktale"
                  />
                </TabsContent>

                <TabsContent value="proverb">
                  <ContentItemsList
                    categoryId={categoryId || undefined}
                    contentType="proverb"
                  />
                </TabsContent>

                <TabsContent value="music">
                  <ContentItemsList
                    categoryId={categoryId || undefined}
                    contentType="music"
                  />
                </TabsContent>

                <TabsContent value="history">
                  <ContentItemsList
                    categoryId={categoryId || undefined}
                    contentType="history"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
