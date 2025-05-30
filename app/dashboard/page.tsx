"use client";

import { useState } from "react";
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
  Users,
  Bell,
  Phone,
  Shield,
  Settings,
  PlusCircle,
  User,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard-header";
import DashboardNav from "@/components/dashboard-nav";
import EmailVerificationBanner from "@/components/email-verification-banner";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <EmailVerificationBanner />

      <div className="flex">
        <DashboardNav />

        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New User
            </Button>
          </div>

          <Tabs
            defaultValue="overview"
            className="space-y-4"
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">
                      +1 from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Reminders
                    </CardTitle>
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">
                      +3 from last week
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Calls Made
                    </CardTitle>
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">
                      +5 from yesterday
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Emergency Alerts
                    </CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">
                      No alerts in the past 30 days
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest interactions with your loved ones
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <ActivityItem
                        icon={<Phone className="h-4 w-4" />}
                        title="Wellness Check-in"
                        description="Mama Titi responded positively to wellness check"
                        timestamp="Today, 10:30 AM"
                        status="success"
                      />
                      <ActivityItem
                        icon={<Bell className="h-4 w-4" />}
                        title="Medication Reminder"
                        description="Papa Segun confirmed taking blood pressure medication"
                        timestamp="Today, 8:15 AM"
                        status="success"
                      />
                      <ActivityItem
                        icon={<Phone className="h-4 w-4" />}
                        title="Missed Call"
                        description="Mama Titi missed evening check-in call"
                        timestamp="Yesterday, 7:00 PM"
                        status="warning"
                      />
                      <ActivityItem
                        icon={<Bell className="h-4 w-4" />}
                        title="Medication Reminder"
                        description="Mama Titi confirmed taking arthritis medication"
                        timestamp="Yesterday, 9:00 AM"
                        status="success"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Upcoming Reminders</CardTitle>
                    <CardDescription>
                      Scheduled calls for the next 24 hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <ReminderItem
                        title="Morning Medication"
                        user="Mama Titi"
                        time="Tomorrow, 9:00 AM"
                        type="medication"
                      />
                      <ReminderItem
                        title="Evening Check-in"
                        user="Papa Segun"
                        time="Today, 7:00 PM"
                        type="wellness"
                      />
                      <ReminderItem
                        title="Blood Pressure Medication"
                        user="Papa Segun"
                        time="Today, 6:00 PM"
                        type="medication"
                      />
                      <ReminderItem
                        title="Afternoon Check-in"
                        user="Mama Titi"
                        time="Today, 2:00 PM"
                        type="wellness"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Users</CardTitle>
                  <CardDescription>
                    Manage your elderly loved ones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <UserCard
                      name="Mama Titi"
                      age={78}
                      location="Lagos"
                      phone="+234 801 234 5678"
                      reminders={5}
                    />
                    <UserCard
                      name="Papa Segun"
                      age={82}
                      location="Ibadan"
                      phone="+234 802 345 6789"
                      reminders={7}
                    />
                    <UserCard
                      name="Aunty Bisi"
                      age={75}
                      location="Abuja"
                      phone="+234 803 456 7890"
                      reminders={0}
                      status="inactive"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reminders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Medication Reminders</CardTitle>
                  <CardDescription>Manage medication schedules</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Reminder management UI would go here */}
                    <p>Reminder management interface coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Alerts</CardTitle>
                  <CardDescription>
                    Configure emergency contacts and alert settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Alert configuration UI would go here */}
                    <p>Alert configuration interface coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Settings UI would go here */}
                    <p>Settings interface coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

function ActivityItem({ icon, title, description, timestamp, status }) {
  return (
    <div className="flex items-start space-x-4">
      <div
        className={`rounded-full p-2 ${
          status === "success"
            ? "bg-green-100"
            : status === "warning"
            ? "bg-yellow-100"
            : status === "error"
            ? "bg-red-100"
            : "bg-gray-100"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-gray-500">{timestamp}</p>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function ReminderItem({ title, user, time, type }) {
  return (
    <div className="flex items-center space-x-4">
      <div
        className={`rounded-full p-2 ${
          type === "medication"
            ? "bg-blue-100"
            : type === "wellness"
            ? "bg-green-100"
            : "bg-gray-100"
        }`}
      >
        {type === "medication" ? (
          <Bell className="h-4 w-4" />
        ) : (
          <Phone className="h-4 w-4" />
        )}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <div className="flex justify-between">
          <p className="text-sm text-gray-600">{user}</p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
      </div>
    </div>
  );
}

function UserCard({
  name,
  age,
  location,
  phone,
  reminders,
  status = "active",
}) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="bg-emerald-100 p-3 rounded-full">
          <User className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <div className="text-sm text-gray-500">
            {age} years • {location} • {phone}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-center">
          <div className="text-sm font-medium">{reminders}</div>
          <div className="text-xs text-gray-500">Reminders</div>
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {status === "active" ? "Active" : "Inactive"}
        </div>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
