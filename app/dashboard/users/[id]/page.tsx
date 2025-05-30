"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import DashboardHeader from "@/components/dashboard-header";
import DashboardNav from "@/components/dashboard-nav";
import {
  ArrowLeft,
  Edit,
  Phone,
  MapPin,
  User,
  Clock,
  Calendar,
  Heart,
  Pill,
  Users,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CallButton } from "@/components/call-button";
import { CallHistory } from "@/components/call-history";
import { WellnessCheckForm } from "@/components/wellness-check-form";
import { WellnessChecksList } from "@/components/wellness-checks-list";
import { WellnessTrends } from "@/components/wellness-trends";
import { EmergencyAlertsList } from "@/components/emergency-alerts-list";

interface User {
  id: string;
  name: string;
  age: number;
  phone: string;
  location?: string;
  created_at: string;
  medications: Array<{
    id: string;
    name: string;
    time: string;
    frequency: string;
  }>;
  emergency_contacts: Array<{
    id: string;
    name: string;
    phone: string;
    relationship?: string;
  }>;
  preferences: Array<{
    call_times?: string[];
    stories?: string[];
    music?: string[];
  }>;
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id;
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddWellnessCheck, setShowAddWellnessCheck] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        });
        router.push("/dashboard/users");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, router]);

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="flex">
          <DashboardNav />
          <main className="flex-1 p-6">
            <div className="text-center py-10">
              <p>User not found.</p>
              <Link href="/dashboard/users">
                <Button variant="link">Back to Users</Button>
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

        <main className="flex-1 p-8">
          <div className="mb-8">
            <Link
              href="/dashboard/users"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500 mt-1">User ID: {user.id}</p>
            </div>
            <div className="flex gap-3">
              <CallButton
                userId={user.id}
                phoneNumber={user.phone}
                userName={user.name}
                variant="outline"
                className="hover:bg-gray-100 transition-colors duration-200"
              />
              <Link href={`/dashboard/users/${userId}/edit`}>
                <Button className="bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit User
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <CardContent className="pt-8">
                <div className="flex flex-col items-center">
                  <div className="bg-emerald-100 p-8 rounded-full mb-6 transform hover:scale-105 transition-transform duration-200">
                    <User className="h-16 w-16 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                    {user.name}
                  </h2>
                  <p className="text-gray-500 mb-6 text-lg">
                    {user.age} years old
                  </p>
                  <div className="w-full space-y-4">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-emerald-600 mr-3" />
                      <span className="text-gray-700">{user.phone}</span>
                    </div>
                    {user.location && (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-emerald-600 mr-3" />
                        <span className="text-gray-700">{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-emerald-600 mr-3" />
                      <span className="text-gray-700">
                        Added on{" "}
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center text-gray-900">
                  <Pill className="h-5 w-5 mr-3 text-emerald-600" />
                  Medications
                </CardTitle>
                <CardDescription className="text-gray-500">
                  {user.medications.length} medication
                  {user.medications.length !== 1 ? "s" : ""} scheduled
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.medications.length === 0 ? (
                  <p className="text-gray-500 text-sm p-4 bg-gray-50 rounded-lg">
                    No medications added yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {user.medications.map((medication) => (
                      <div
                        key={medication.id}
                        className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {medication.name}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{medication.time}</span>
                            <span className="mx-2">•</span>
                            <span>{medication.frequency}</span>
                          </div>
                        </div>
                        <CallButton
                          userId={user.id}
                          phoneNumber={user.phone}
                          userName={user.name}
                          callType="medication_reminder"
                          size="sm"
                          variant="ghost"
                          className="hover:bg-emerald-50"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center text-gray-900">
                  <Users className="h-5 w-5 mr-3 text-emerald-600" />
                  Emergency Contacts
                </CardTitle>
                <CardDescription className="text-gray-500">
                  {user.emergency_contacts.length} contact
                  {user.emergency_contacts.length !== 1 ? "s" : ""} available
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.emergency_contacts.length === 0 ? (
                  <p className="text-gray-500 text-sm p-4 bg-gray-50 rounded-lg">
                    No emergency contacts added yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {user.emergency_contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {contact.name}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>{contact.phone}</span>
                            {contact.relationship && (
                              <>
                                <span className="mx-2">•</span>
                                <span>{contact.relationship}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="emergency" className="space-y-6">
            <TabsList className="bg-gray-100 p-1 rounded-lg">
              <TabsTrigger
                value="emergency"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                Emergency Alerts
              </TabsTrigger>
              <TabsTrigger
                value="wellness"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                Wellness Checks
              </TabsTrigger>
              <TabsTrigger
                value="call-history"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                Call History
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                Preferences
              </TabsTrigger>
            </TabsList>

            <TabsContent value="emergency" className="mt-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Emergency Alerts
                  </h2>
                  <Link href="/dashboard/emergency">
                    <Button className="bg-red-600 hover:bg-red-700 transition-colors duration-200">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Emergency Dashboard
                    </Button>
                  </Link>
                </div>
                <EmergencyAlertsList userId={userId} showUser={false} />
              </div>
            </TabsContent>

            <TabsContent value="wellness" className="mt-6">
              {showAddWellnessCheck ? (
                <div className="space-y-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddWellnessCheck(false)}
                    className="hover:bg-gray-100 transition-colors duration-200"
                  >
                    Back to List
                  </Button>
                  <WellnessCheckForm
                    userId={userId}
                    onSuccess={() => setShowAddWellnessCheck(false)}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Wellness Check-ins
                    </h2>
                    <Button
                      onClick={() => setShowAddWellnessCheck(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Schedule Check
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-medium mb-4 text-gray-900">
                        Scheduled Checks
                      </h3>
                      <WellnessChecksList
                        userId={userId}
                        userName={user.name}
                        phoneNumber={user.phone}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-4 text-gray-900">
                        Wellness Trends
                      </h3>
                      <WellnessTrends userId={userId} />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="call-history" className="mt-6">
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">
                    Call History
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    Recent calls with {user.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CallHistory userId={user.id} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="mt-6 space-y-6">
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center text-gray-900">
                    <Heart className="h-5 w-5 mr-3 text-emerald-600" />
                    User Preferences
                  </CardTitle>
                  <CardDescription className="text-gray-500">
                    Personalization settings for {user.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3 text-gray-900">
                        Preferred Call Times
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {user.preferences[0]?.call_times?.map((time, index) => (
                          <div
                            key={index}
                            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200"
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3 text-gray-900">
                        Story Preferences
                      </h3>
                      {user.preferences[0]?.stories?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.preferences[0].stories.map((story, index) => (
                            <div
                              key={index}
                              className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm hover:bg-emerald-200 transition-colors duration-200"
                            >
                              {story}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm p-4 bg-gray-50 rounded-lg">
                          No story preferences set.
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 className="font-medium mb-3 text-gray-900">
                        Music Preferences
                      </h3>
                      {user.preferences[0]?.music?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.preferences[0].music.map((item, index) => (
                            <div
                              key={index}
                              className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm hover:bg-blue-200 transition-colors duration-200"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm p-4 bg-gray-50 rounded-lg">
                          No music preferences set.
                        </p>
                      )}
                    </div>
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
