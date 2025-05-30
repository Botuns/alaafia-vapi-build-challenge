"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { PhoneCall, MapPin } from "lucide-react";

interface FormData {
  name: string;
  age: string;
  phone: string;
  location: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    phone: "",
    location: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Use reverse geocoding to get the address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data.display_name) {
            setFormData((prev) => ({
              ...prev,
              location: data.display_name,
            }));
          } else {
            setFormData((prev) => ({
              ...prev,
              location: `${latitude}, ${longitude}`,
            }));
          }
        } catch (err) {
          setError("Failed to get location details");
          console.error(err);
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setError("Unable to retrieve your location");
        console.error(error);
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (
      !formData.name ||
      !formData.age ||
      !formData.phone ||
      !formData.email ||
      !formData.password
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate age is a number
    if (isNaN(Number(formData.age))) {
      setError("Age must be a number");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          age: parseInt(formData.age),
          phone: formData.phone,
          location: formData.location,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      // Redirect to dashboard after successful signup
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during signup. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <PhoneCall className="h-8 w-8 text-emerald-600" />
        <span className="text-2xl font-bold text-emerald-600">Alafia</span>
      </Link>

      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Sign up to start managing care for your loved ones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-gray-500">
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 555-5555"
                      value={formData.phone}
                      onChange={(e) => {
                        // Remove any non-digit characters
                        let value = e.target.value.replace(/\D/g, "");

                        // If it starts with 1, keep it, otherwise add it
                        if (value.length > 0 && !value.startsWith("1")) {
                          value = "1" + value;
                        }

                        // Format the number
                        if (value.length > 1) {
                          value =
                            "+" +
                            value.slice(0, 1) +
                            " " +
                            "(" +
                            value.slice(1, 4) +
                            ") " +
                            value.slice(4, 7) +
                            "-" +
                            value.slice(7, 11);
                        }

                        setFormData((prev) => ({ ...prev, phone: value }));
                      }}
                      pattern="^\+1\s?\(?[0-9]{3}\)?\s?[0-9]{3}-?[0-9]{4}$"
                      title="Please enter a valid US phone number starting with +1"
                      required
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Please enter a US phone number starting with +1. Due to
                      Twilio's international calling policies, we currently only
                      support phone numbers from the United States. This ensures
                      reliable delivery of automated calls and messages.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="flex gap-2">
                      <Input
                        id="location"
                        name="location"
                        placeholder="Enter your location"
                        value={formData.location}
                        onChange={handleChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={getCurrentLocation}
                        disabled={locationLoading}
                        className="shrink-0"
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                    {locationLoading && (
                      <p className="text-sm text-gray-500">
                        Getting your location...
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-gray-500">
                  Account Information
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-600 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
