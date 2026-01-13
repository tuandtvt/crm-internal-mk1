"use client";

import { useState, useEffect } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Loader2, Chrome, Github, ShieldAlert, UserCog, User } from "lucide-react";
import { useAuthStore } from "@/lib/store";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("auth.login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { isAuthenticated, loginAs } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    console.log("Login data:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // For demo purposes, we'll just login as ADMIN if they use the form
    loginAs("ADMIN");
    setIsLoading(false);
    router.push("/");
  }

  const handleDemoLogin = (role: "ADMIN" | "MANAGER" | "SALE") => {
    setIsLoading(true);
    setTimeout(() => {
      loginAs(role);
      router.push("/");
    }, 500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Gradient/Pattern (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 overflow-hidden">
        {/* Abstract Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-indigo-400/10 rounded-full blur-2xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white max-w-2xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <span className="text-xl font-bold">CRM</span>
            </div>
            <span className="text-2xl font-bold">MK1 CRM</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Manage Your
            <br />
            Customer Relationships
            <br />
            <span className="text-indigo-200">Effortlessly</span>
          </h1>

          <p className="text-lg text-indigo-100/90 mb-12 max-w-md">
            Streamline your sales pipeline, track customer interactions, and close more deals with our powerful enterprise CRM platform.
          </p>

          {/* Stats Row */}
          <div className="flex gap-10">
            <div>
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-sm text-indigo-200">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold">95%</p>
              <p className="text-sm text-indigo-200">Satisfaction</p>
            </div>
            <div>
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-sm text-indigo-200">Support</p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-12 p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
            <p className="text-indigo-100 italic mb-4">
              &quot;MK1 CRM transformed how our sales team operates. We&apos;ve increased conversions by 40% in just 3 months.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-400/30 flex items-center justify-center">
                <span className="text-sm font-medium">JD</span>
              </div>
              <div>
                <p className="font-medium text-sm">James Davidson</p>
                <p className="text-xs text-indigo-200">VP of Sales, TechCorp</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
              <span className="text-sm font-bold text-white">CRM</span>
            </div>
            <span className="text-xl font-bold text-slate-900">MK1 CRM</span>
          </div>

          <div className="absolute top-4 right-4">
            <LanguageSwitcher />
          </div>

          {/* Form Header */}
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">
              {t("title")}
            </h2>
            <p className="text-slate-600 mt-2">
              {t("description")}
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button variant="outline" className="h-11" type="button">
              <Chrome className="h-5 w-5 mr-2" />
              Google
            </Button>
            <Button variant="outline" className="h-11" type="button">
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </Button>
          </div>

          <div className="relative mb-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-slate-500">
              {t("orContinue")}
            </span>
          </div>

          {/* Login Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700">{t("emailLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        className="h-11"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-slate-700">{t("passwordLabel")}</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        {t("forgotPassword")}
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={t("passwordPlaceholder")}
                          className="h-11 pr-10"
                          autoComplete="current-password"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal text-slate-600 cursor-pointer">
                      {t("rememberMe")}
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-600/25"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? t("signingIn") : t("submit")}
              </Button>
            </form>
          </Form>

          {/* Demo Access Panel */}
          <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                {t("demoTitle")}
              </h3>
            </div>
            
            <p className="text-xs text-slate-500 mb-4">
              {t("demoDescription")}
            </p>

            <div className="space-y-3">
              <Button 
                variant="destructive" 
                className="w-full h-10 justify-start gap-3 bg-red-600 hover:bg-red-700"
                onClick={() => handleDemoLogin("ADMIN")}
                disabled={isLoading}
              >
                <ShieldAlert className="h-4 w-4" />
                {t("loginAsAdmin")}
              </Button>
              
              <Button 
                variant="default" 
                className="w-full h-10 justify-start gap-3 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => handleDemoLogin("MANAGER")}
                disabled={isLoading}
              >
                <UserCog className="h-4 w-4" />
                {t("loginAsManager")}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full h-10 justify-start gap-3 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 hover:border-emerald-300"
                onClick={() => handleDemoLogin("SALE")}
                disabled={isLoading}
              >
                <User className="h-4 w-4" />
                {t("loginAsSale")}
              </Button>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-slate-600">
            {t("noAccount")}{" "}
            <Link
              href="#"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {t("contactAdmin")}
            </Link>
          </p>

          {/* Terms */}
          <p className="mt-4 text-center text-xs text-slate-400">
            {t.rich("terms", {
              terms: (chunks) => <Link href="#" className="underline hover:text-slate-600">{t("termsLink")}</Link>,
              privacy: (chunks) => <Link href="#" className="underline hover:text-slate-600">{t("privacyLink")}</Link>
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
