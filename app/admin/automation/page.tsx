// For manual triggering via POST (admin use)
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import {
  Play,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Activity,
  Phone,
  Pill,
} from "lucide-react";

export default function AutomationAdminPage() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    todayWellnessChecks: 0,
    todayMedicationReminders: 0,
    totalSuccessful: 0,
    totalErrors: 0,
  });

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/automations/logs");
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Refresh every 30 seconds
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const runAutomation = async (type = "all") => {
    try {
      setLoading(true);

      let endpoint = "/api/automations/process";
      if (type === "wellness") endpoint = "/api/automations/wellness-checks";
      if (type === "medication")
        endpoint = "/api/automations/medication-reminders";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to run automation");
      }

      const result = await response.json();

      toast({
        title: "Automation Completed",
        description: `Successfully processed automation tasks`,
      });

      // Refresh logs
      fetchLogs();
    } catch (error) {
      console.error("Error running automation:", error);
      toast({
        title: "Error",
        description: "Failed to run automation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Automation Dashboard</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => runAutomation("wellness")}
            disabled={loading}
            variant="outline"
          >
            <Phone className="h-4 w-4 mr-2" />
            Run Wellness Checks
          </Button>
          <Button
            onClick={() => runAutomation("medication")}
            disabled={loading}
            variant="outline"
          >
            <Pill className="h-4 w-4 mr-2" />
            Run Medication Reminders
          </Button>
          <Button onClick={() => runAutomation("all")} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Run All Automation
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Wellness Checks
            </CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.todayWellnessChecks}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Medication Reminders
            </CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.todayMedicationReminders}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalSuccessful}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.totalErrors}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Automation Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No logs available
              </p>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {log.type === "wellness_check" ? (
                      <Phone className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Pill className="h-4 w-4 text-purple-500" />
                    )}
                    <div>
                      <div className="font-medium">
                        {log.type === "wellness_check"
                          ? "Wellness Check"
                          : "Medication Reminder"}
                      </div>
                      <div className="text-sm text-gray-500">{log.details}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        log.status === "success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {log.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(log.executed_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
