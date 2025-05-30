"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button" // Button might not be needed if the whole card is a link
import { toast } from "@/components/ui/use-toast";
import { Loader2, BookOpen, ArrowRight, FolderOpen } from "lucide-react"; // Added BookOpen, ArrowRight, FolderOpen
import Link from "next/link";

interface ContentCategory {
  id: string;
  name: string;
  description: string;
  icon: string; // Assuming this might be an emoji or a placeholder for now
}

export function ContentCategories() {
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Simulate API delay for loading state demonstration
        // await new Promise(resolve => setTimeout(resolve, 1500));
        const response = await fetch("/api/content/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error Loading Categories",
          description:
            "Could not fetch content categories. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mb-4" />
        <p className="text-gray-600 text-lg">Loading Content Categories...</p>
        <p className="text-gray-400 text-sm">Please wait a moment.</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-20 min-h-[300px] bg-gray-50 rounded-xl">
        <FolderOpen className="h-16 w-16 text-gray-400 mb-6" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Categories Found
        </h3>
        <p className="text-gray-500 max-w-sm text-center">
          It seems there are no content categories available at the moment.
          Please check back later or contact support if you believe this is an
          error.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/dashboard/content?categoryId=${category.id}`}
          className="block group"
        >
          <Card
            className="h-full rounded-xl overflow-hidden transition-all duration-300 ease-in-out \
                           border border-gray-200 hover:border-emerald-500/70 \
                           hover:shadow-2xl hover:-translate-y-1 bg-white"
          >
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center mb-5">
                <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-green-100 rounded-lg mr-5 group-hover:from-emerald-100 group-hover:to-green-200 transition-all duration-300">
                  {/* Using a generic BookOpen icon, can be replaced with category.icon if it's a component or URL */}
                  <BookOpen className="h-7 w-7 text-emerald-600 group-hover:text-emerald-700 transition-all duration-300" />
                </div>
                <h3 className="font-semibold text-xl text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  {category.name}
                </h3>
              </div>
              <p className="text-gray-600 text-sm flex-grow mb-5 leading-relaxed line-clamp-3">
                {category.description ||
                  "No description available for this category."}
              </p>
              <div className="mt-auto pt-4 border-t border-gray-100 group-hover:border-emerald-100 transition-colors duration-300">
                <div className="flex items-center justify-between text-emerald-600 group-hover:text-emerald-700 transition-colors duration-300">
                  <span className="font-medium text-sm">Explore Category</span>
                  <ArrowRight className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
