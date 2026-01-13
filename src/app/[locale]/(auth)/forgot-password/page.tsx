"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Loader2, Mail } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPassword");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true);
    // TODO: Implement password reset logic
    console.log("Reset password for:", data.email);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <Card className="w-[400px] shadow-2xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{t("successTitle")}</CardTitle>
          <CardDescription>
            {t("successDescription")}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToLogin")}
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-[400px] shadow-2xl border-0 bg-white/95 backdrop-blur">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
        <CardDescription>
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("emailLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? t("sending") : t("submit")}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-primary hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToLogin")}
        </Link>
      </CardFooter>
    </Card>
  );
}
