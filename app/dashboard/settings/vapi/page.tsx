"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import DashboardHeader from "@/components/dashboard-header";
import DashboardNav from "@/components/dashboard-nav";
import { Loader2, Plus, Check, ChevronLeft, ChevronRight } from "lucide-react";

export default function VapiSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [assistants, setAssistants] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [formData, setFormData] = useState({
    name: "Alafia Voice Companion",
    model: "gpt-4",
    voice: "shimmer",
    first_message:
      "Hello, this is Alafia, your voice companion. How are you feeling today?",
  });

  // Calculate pagination values
  const totalPages = Math.ceil(assistants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAssistants = assistants.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/vapi/assistant", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "list" }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch assistants");
        }

        const data = await response.json();
        setAssistants(data.assistants || []);
      } catch (error) {
        console.error("Error fetching assistants:", error);
        toast({
          title: "Error",
          description: "Failed to load Vapi assistants. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssistants();
  }, []);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAssistant = async () => {
    try {
      setCreating(true);
      const response = await fetch("/api/vapi/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create",
          config: formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create assistant");
      }

      const data = await response.json();

      toast({
        title: "Success",
        description: "Vapi assistant created successfully",
      });

      // Refresh the assistants list
      setAssistants((prevAssistants: any[]) => [
        ...prevAssistants,
        { id: data.id, ...formData },
      ]);
    } catch (error) {
      console.error("Error creating assistant:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create assistant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };
  // console.log("assistants", assistants);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="flex">
        <DashboardNav />

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Vapi Assistant Settings</h1>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Existing Assistants</CardTitle>
                <CardDescription>
                  Manage your Vapi voice assistants
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                  </div>
                ) : assistants.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    No assistants found. Create one below.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {currentAssistants.map((assistant: any) => (
                      <div
                        key={assistant.id}
                        className="flex justify-between items-center p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{assistant.name}</h3>
                          <p className="text-sm text-gray-500">
                            Model: {assistant?.model?.model} • Voice:{" "}
                            {assistant.voice?.voiceId}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Active
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          Showing {startIndex + 1} to{" "}
                          {Math.min(endIndex, assistants.length)} of{" "}
                          {assistants.length} assistants
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>
                          <div className="text-sm text-gray-500">
                            Page {currentPage} of {totalPages}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Create New Assistant</CardTitle>
                <CardDescription>
                  Configure a new Vapi voice assistant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Assistant Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Alafia Voice Companion"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model">AI Model</Label>
                      <Select
                        value={formData.model}
                        onValueChange={(value) =>
                          handleSelectChange("model", value)
                        }
                      >
                        <SelectTrigger id="model">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">
                            GPT-3.5 Turbo
                          </SelectItem>
                          <SelectItem value="claude-2">Claude 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="voice">Voice</Label>
                      <Select
                        value={formData.voice}
                        onValueChange={(value) =>
                          handleSelectChange("voice", value)
                        }
                      >
                        <SelectTrigger id="voice">
                          <SelectValue placeholder="Select voice" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shimmer">Shimmer</SelectItem>
                          <SelectItem value="alloy">Alloy</SelectItem>
                          <SelectItem value="echo">Echo</SelectItem>
                          <SelectItem value="fable">Fable</SelectItem>
                          <SelectItem value="onyx">Onyx</SelectItem>
                          <SelectItem value="nova">Nova</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="first_message">First Message</Label>
                    <Textarea
                      id="first_message"
                      name="first_message"
                      value={formData.first_message}
                      onChange={handleChange}
                      placeholder="Enter the first message the assistant will say"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleCreateAssistant}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={creating}
                >
                  {creating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Assistant
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
