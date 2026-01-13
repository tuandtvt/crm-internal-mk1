"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  Building2,
  Lock,
  Shield,
  Camera,
  Save,
  Loader2,
} from "lucide-react";

// Mock user data
const currentUser = {
  id: "1",
  name: "John Doe",
  email: "john.doe@company.com",
  phone: "+1-555-0199",
  department: "Sales",
  role: "Sales Manager",
  avatar: "",
};

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    department: currentUser.department,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 lg:space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
          My Profile
        </h1>
        <p className="text-slate-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Identity Card */}
      <Card className="bg-white border-slate-200/60 shadow-sm border-t-4 border-t-blue-500">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar with Upload */}
            <div className="relative group">
              <Avatar className="h-24 w-24">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-2xl font-bold">
                  {currentUser.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-6 w-6 text-white" />
              </button>
            </div>
            
            {/* User Info */}
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
              <p className="text-slate-600">{currentUser.role}</p>
              <p className="text-sm text-slate-500 mt-1">{currentUser.department} Department</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Form */}
      <Card className="bg-white border-slate-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <User className="h-5 w-5 text-slate-600" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  placeholder="john@company.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10"
                  placeholder="+1-555-0100"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="HR">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card className="bg-white border-slate-200/60 shadow-sm border-l-4 border-l-amber-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Shield className="h-5 w-5 text-slate-600" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Change Password */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Change Password
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update Password
            </Button>
          </div>

          <Separator />

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium text-slate-900">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-slate-500">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>

          {twoFactorEnabled && (
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-sm text-emerald-700">
                Two-factor authentication is enabled. You'll be asked to enter a verification code when signing in.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
