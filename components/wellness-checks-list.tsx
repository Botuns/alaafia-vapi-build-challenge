"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { WellnessCheckForm } from "./wellness-check-form";
import { CallButton } from "./call-button";

interface WellnessChecksListProps {
  userId: string;
  userName: string;
  phoneNumber: string;
}

export function WellnessChecksList({
  userId,
  userName,
  phoneNumber,
}: WellnessChecksListProps) {
  const [wellnessChecks, setWellnessChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingCheck, setEditingCheck] = useState(null);

  useEffect(() => {
    fetchWellnessChecks();
  }, [userId]);

  const fetchWellnessChecks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/wellness-checks?userId=${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch wellness checks");
      }

      const data = await response.json();
      setWellnessChecks(data.wellnessChecks || []);
    } catch (error) {
      console.error("Error fetching wellness checks:", error);
      toast({
        title: "Error",
        description: "Failed to load wellness checks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/wellness-checks/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete wellness check");
      }

      setWellnessChecks(
        wellnessChecks.filter((check) => check.id !== deleteId)
      );
      toast({
        title: "Success",
        description: "Wellness check deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting wellness check:", error);
      toast({
        title: "Error",
        description: "Failed to delete wellness check. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleToggleActive = async (id, currentActive) => {
    try {
      const response = await fetch(`/api/wellness-checks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          active: !currentActive,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update wellness check");
      }

      // Update the local state
      setWellnessChecks(
        wellnessChecks.map((check) =>
          check.id === id ? { ...check, active: !currentActive } : check
        )
      );

      toast({
        title: "Success",
        description: `Wellness check ${
          !currentActive ? "activated" : "deactivated"
        } successfully`,
      });
    } catch (error) {
      console.error("Error updating wellness check:", error);
      toast({
        title: "Error",
        description: "Failed to update wellness check. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatNextCheckTime = (dateString) => {
    if (!dateString) return "Not scheduled";

    const date = new Date(dateString);
    const now = new Date();

    // Check if it's today
    const isToday = date.toDateString() === now.toDateString();

    // Format the date and time
    const timeString = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) {
      return `Today at ${timeString}`;
    } else {
      // Check if it's tomorrow
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (date.toDateString() === tomorrow.toDateString()) {
        return `Tomorrow at ${timeString}`;
      } else {
        return `${date.toLocaleDateString()} at ${timeString}`;
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
          <p className="text-gray-500 text-sm">Loading wellness checks...</p>
        </div>
      </div>
    );
  }

  if (editingCheck) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditingCheck(null)}
          className="hover:bg-gray-100 transition-colors duration-200"
        >
          Back to List
        </Button>
        <WellnessCheckForm
          userId={userId}
          userName={userName}
          isEditing={true}
          wellnessCheckId={editingCheck.id}
          defaultValues={{
            scheduleTime: editingCheck.schedule_time,
            frequency: editingCheck.frequency,
          }}
          onSuccess={() => {
            fetchWellnessChecks();
            setEditingCheck(null);
          }}
        />
      </div>
    );
  }

  if (wellnessChecks.length === 0) {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Wellness Checks
            </h3>
            <p className="text-gray-500 max-w-sm">
              No wellness checks have been scheduled yet. Schedule a check to
              start monitoring wellness.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {wellnessChecks.map((check) => (
        <Card
          key={check.id}
          className="hover:shadow-lg transition-all duration-200 border border-gray-100"
        >
          <CardContent className="pt-6 pb-6">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Wellness Check
                  </h3>
                  <Badge
                    className={`${
                      check.active
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    } transition-colors duration-200`}
                  >
                    {check.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-emerald-600" />
                    <span>{check.schedule_time}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="font-medium">
                      {check.frequency.charAt(0).toUpperCase() +
                        check.frequency.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
                    <span>
                      Next check:{" "}
                      <span className="font-medium">
                        {formatNextCheckTime(check.next_check_at)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleActive(check.id, check.active)}
                  title={check.active ? "Deactivate" : "Activate"}
                  className="hover:bg-gray-100 transition-colors duration-200"
                >
                  {check.active ? (
                    <XCircle className="h-5 w-5 text-gray-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingCheck(check)}
                  title="Edit"
                  className="hover:bg-gray-100 transition-colors duration-200"
                >
                  <Edit className="h-5 w-5 text-gray-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(check.id)}
                  title="Delete"
                  className="hover:bg-red-50 transition-colors duration-200"
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
                <CallButton
                  userId={userId}
                  phoneNumber={"+13202975024"}
                  userName={userName}
                  callType="wellness_check"
                  variant="outline"
                  size="sm"
                  className="hover:bg-emerald-50 transition-colors duration-200"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">
              Delete Wellness Check
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              This action cannot be undone. This will permanently delete the
              wellness check schedule and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel
              disabled={isDeleting}
              className="mt-0 hover:bg-gray-100 transition-colors duration-200"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 transition-colors duration-200"
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
    </div>
  );
}
