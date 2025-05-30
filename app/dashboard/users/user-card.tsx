"use client";

import { CallButton } from "@/components/call-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MapPin,
  MoreHorizontal,
  Phone,
  User,
  Pill,
  Users,
  Edit,
  Eye,
  Bell,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  age: number;
  phone: string;
  location?: string;
  medications?: any[];
  emergency_contacts?: any[];
}

interface UserCardProps {
  user: User;
  onDelete: (userId: string) => void;
}

export default function UserCard({ user, onDelete }: UserCardProps) {
  const medicationsCount = user?.medications?.length || 0;
  const contactsCount = user?.emergency_contacts?.length || 0;

  return (
    <Card className="transition-all duration-300 ease-in-out hover:shadow-xl border border-transparent hover:border-emerald-500/30">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* User Info Section */}
          <div className="flex items-center space-x-4 flex-grow">
            <div className="bg-emerald-100 p-4 rounded-full flex-shrink-0">
              <User className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold text-xl text-gray-800 hover:text-emerald-600 transition-colors">
                <Link href={`/dashboard/users/${user?.id}`}>{user?.name}</Link>
              </h3>
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{user?.location || "No location"}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{user?.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium text-gray-600">{user?.age}</span>
                  <span className="ml-1">years old</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats and Actions Section */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
            <div className="flex items-center gap-4 border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4 mb-4 sm:mb-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {medicationsCount}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">
                  Medications
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {contactsCount}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">
                  Contacts
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <CallButton
                userId={user?.id || ""}
                phoneNumber={"+13202975024"}
                userName={user?.name || ""}
                variant="outline"
                size="sm"
                className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100"
                  >
                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/users/${user?.id}`}
                      className="flex items-center w-full cursor-pointer"
                    >
                      <Eye className="mr-2 h-4 w-4 text-gray-500" /> View
                      Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/users/${user?.id}/edit`}
                      className="flex items-center w-full cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4 text-gray-500" /> Edit User
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/users/${user?.id}/reminders`}
                      className="flex items-center w-full cursor-pointer"
                    >
                      <Bell className="mr-2 h-4 w-4 text-gray-500" /> Manage
                      Reminders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 hover:!text-red-600 hover:!bg-red-50 focus:bg-red-50 focus:text-red-600 cursor-pointer flex items-center"
                    onClick={() => onDelete(user.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
