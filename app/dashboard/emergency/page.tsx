"use client";

import { useState, useEffect } from "react";
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
import { EmergencyAlertsList } from "@/components/emergency-alerts-list";
import { AlertTriangle, Bell, CheckCircle, Clock } from "lucide-react";

export default function EmergencyDashboardPage() {
  const [severityFilter, setSeverityFilter] = useState("all");

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="flex">
        <DashboardNav />

        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Emergency Dashboard</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-center py-4">
                  <EmergencyStatusCount status="pending" />
                </div>
                <p className="text-center text-sm text-gray-500">
                  Pending alerts requiring attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-purple-500" />
                  Acknowledged
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-center py-4">
                  <EmergencyStatusCount status="acknowledged" />
                </div>
                <p className="text-center text-sm text-gray-500">
                  Alerts that have been acknowledged
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Resolved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-center py-4">
                  <EmergencyStatusCount status="resolved" />
                </div>
                <p className="text-center text-sm text-gray-500">
                  Alerts that have been resolved
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Emergency Alerts</CardTitle>
                  <CardDescription>
                    Monitor and manage emergency situations
                  </CardDescription>
                </div>
                <Select
                  value={severityFilter}
                  onValueChange={setSeverityFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="high">High Severity</SelectItem>
                    <SelectItem value="medium">Medium Severity</SelectItem>
                    <SelectItem value="low">Low Severity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="pending" className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Pending
                  </TabsTrigger>
                  <TabsTrigger
                    value="acknowledged"
                    className="flex items-center"
                  >
                    <Bell className="h-4 w-4 mr-1" />
                    Acknowledged
                  </TabsTrigger>
                  <TabsTrigger value="resolved" className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolved
                  </TabsTrigger>
                  <TabsTrigger value="all" className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    All
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                  <EmergencyAlertsList
                    status="pending"
                    severity={
                      severityFilter !== "all" ? severityFilter : undefined
                    }
                  />
                </TabsContent>

                <TabsContent value="acknowledged">
                  <EmergencyAlertsList
                    status="acknowledged"
                    severity={
                      severityFilter !== "all" ? severityFilter : undefined
                    }
                  />
                </TabsContent>

                <TabsContent value="resolved">
                  <EmergencyAlertsList
                    status="resolved"
                    severity={
                      severityFilter !== "all" ? severityFilter : undefined
                    }
                  />
                </TabsContent>

                <TabsContent value="all">
                  <EmergencyAlertsList
                    severity={
                      severityFilter !== "all" ? severityFilter : undefined
                    }
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

function EmergencyStatusCount({ status }: { status: string }) {
  const [count, setCount] = useState("--");

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch(`/api/emergency/alerts?status=${status}`);
        if (response.ok) {
          const data = await response.json();
          setCount(data.alerts?.length.toString() || "0");
        }
      } catch (error) {
        console.error(`Error fetching ${status} count:`, error);
      }
    };
    fetchCount();
  }, [status]);

  return count;
}
