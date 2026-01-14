"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockTemplates, mockAudienceSegments } from "@/lib/mock-data/marketing";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface CampaignWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CampaignWizard({ open, onOpenChange }: CampaignWizardProps) {
  const t = useTranslations("campaignWizard");
  const tc = useTranslations("common");
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [campaignData, setCampaignData] = useState({
    name: "",
    type: "" as string,
    subject: "",
    content: "",
    audience: "",
    budget: "",
    targetUrl: "",
    scheduleType: "now",
    scheduleDate: "",
  });

  const totalSteps = campaignData.type === "email" ? 3 : 2;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleClose = () => {
    setStep(1);
    setSelectedTemplate("");
    setCampaignData({
      name: "",
      type: "" as string,
      subject: "",
      content: "",
      audience: "",
      budget: "",
      targetUrl: "",
      scheduleType: "now",
      scheduleDate: "",
    });
    onOpenChange(false);
  };

  const handleSubmit = () => {
    console.log("Campaign created:", { ...campaignData, template: selectedTemplate });
    handleClose();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[640px] overflow-y-auto p-0">
        <div className="bg-gradient-premium p-6 text-white">
          <SheetHeader className="text-white">
            <SheetTitle className="text-white text-xl">{t("title")}</SheetTitle>
            <SheetDescription className="text-violet-100">
              {t("description")}
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 border-b bg-slate-50">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[
              { num: 1, label: t("selectType") },
              { num: 2, label: campaignData.type === "email" ? t("selectTemplate") : t("campaignDetails") },
              ...(campaignData.type === "email" ? [{ num: 3, label: t("audienceSchedule") }] : [])
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all font-semibold ${
                      s.num < step
                        ? "bg-gradient-premium border-violet-500 text-white shadow-lg"
                        : s.num === step
                        ? "border-violet-500 text-violet-600 bg-white shadow-md"
                        : "border-slate-300 text-slate-400 bg-white"
                    }`}
                  >
                    {s.num < step ? <Check className="h-5 w-5" /> : s.num}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium text-center max-w-[80px] ${
                    s.num <= step ? "text-violet-600" : "text-slate-400"
                  }`}>
                    {s.label}
                  </span>
                </div>
                {idx < (campaignData.type === "email" ? 2 : 1) && (
                  <div
                    className={`flex-1 h-0.5 mx-3 transition-colors ${
                      s.num < step ? "bg-violet-500" : "bg-slate-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-6">
          {/* Step 1: Select Type */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900">{t("selectChannel")}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "email", name: t("channels.email"), icon: "📧" },
                  { id: "facebook", name: t("channels.facebook"), icon: "📱" },
                  { id: "google", name: t("channels.google"), icon: "🔍" },
                  { id: "tiktok", name: t("channels.tiktok"), icon: "🎵" },
                  { id: "linkedin", name: t("channels.linkedin"), icon: "💼" },
                  { id: "youtube", name: t("channels.youtube"), icon: "🎥" },
                ].map((channel) => (
                  <div
                    key={channel.id}
                    onClick={() => {
                      setCampaignData({ ...campaignData, type: channel.id });
                    }}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:border-violet-300 hover:shadow-md ${
                      campaignData.type === channel.id
                        ? "border-violet-500 bg-violet-50 shadow-lg"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="text-4xl mb-3 flex justify-center">{channel.icon}</div>
                    <h4 className="font-semibold text-center text-slate-900">{channel.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Template (Email) or Details (Social) */}
          {step === 2 && campaignData.type === "email" && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900">{t("selectTemplateDesc")}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1">
                {mockTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-violet-300 hover:shadow-md ${
                      selectedTemplate === template.id
                        ? "border-violet-500 bg-violet-50 shadow-lg ring-2 ring-violet-200"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="aspect-video bg-gradient-to-br from-violet-100 to-indigo-100 rounded-lg mb-3 flex items-center justify-center text-4xl shadow-inner">
                      📧
                    </div>
                    <h4 className="font-semibold text-sm mb-1 text-slate-900">{template.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-2">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && campaignData.type !== "email" && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900">{t("campaignDetails")}</h3>
              </div>
              <div className="space-y-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div>
                  <Label className="text-slate-700 font-medium">{t("campaignName")} <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder={t("campaignNamePlaceholder")}
                    value={campaignData.name}
                    onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                    className="mt-1.5 bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700 font-medium">{t("budget")}</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 50"
                      value={campaignData.budget}
                      onChange={(e) => setCampaignData({ ...campaignData, budget: e.target.value })}
                      className="mt-1.5 bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">{t("targetUrl")}</Label>
                    <Input
                      placeholder="https://..."
                      value={campaignData.targetUrl}
                      onChange={(e) => setCampaignData({ ...campaignData, targetUrl: e.target.value })}
                      className="mt-1.5 bg-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-slate-700 font-medium">{t("adContent")}</Label>
                  <Textarea
                    rows={4}
                    placeholder={t("adContentPlaceholder")}
                    value={campaignData.content}
                    onChange={(e) => setCampaignData({ ...campaignData, content: e.target.value })}
                    className="mt-1.5 bg-white resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Select Audience & Schedule */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900">{t("audienceScheduleDesc")}</h3>
              </div>
              <div className="space-y-5">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <Label htmlFor="audience" className="text-slate-700 font-medium flex items-center gap-2">
                    👥 {t("audienceSegment")} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={campaignData.audience} onValueChange={(value) => setCampaignData({ ...campaignData, audience: value })}>
                    <SelectTrigger id="audience" className="mt-2 bg-white">
                      <SelectValue placeholder={t("selectAudience")} />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAudienceSegments.map((segment) => (
                        <SelectItem key={segment.id} value={segment.id}>
                          <span className="font-medium">{segment.name}</span>
                          <span className="text-slate-500 ml-2">({segment.count.toLocaleString()} {t("contacts")})</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <Label className="text-slate-700 font-medium flex items-center gap-2">📅 {t("sendingSchedule")}</Label>
                  <Select
                    value={campaignData.scheduleType}
                    onValueChange={(value) => setCampaignData({ ...campaignData, scheduleType: value })}
                  >
                    <SelectTrigger className="mt-2 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">🚀 {t("sendNow")}</SelectItem>
                      <SelectItem value="schedule">⏰ {t("scheduleLater")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {campaignData.scheduleType === "schedule" && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <Label htmlFor="schedule-date" className="text-slate-700 font-medium">{t("scheduleDateTime")}</Label>
                      <Input
                        id="schedule-date"
                        type="datetime-local"
                        value={campaignData.scheduleDate}
                        onChange={(e) => setCampaignData({ ...campaignData, scheduleDate: e.target.value })}
                        className="mt-2 bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between p-6 border-t bg-slate-50">
          <Button
            variant="outline"
            onClick={step === 1 ? handleClose : handlePrevious}
            className="cursor-pointer px-6"
          >
            {step === 1 ? tc("cancel") : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                {tc("previous")}
              </>
            )}
          </Button>
          {step < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={step === 1 && !campaignData.type}
              className="bg-gradient-premium cursor-pointer px-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              {tc("next")}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              className="bg-gradient-premium cursor-pointer px-6 shadow-lg hover:shadow-xl transition-shadow" 
              disabled={!campaignData.name || (campaignData.type === 'email' && !campaignData.audience)}
            >
              <Check className="h-4 w-4 mr-2" />
              {t("createCampaign")}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
