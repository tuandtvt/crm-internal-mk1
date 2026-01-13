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
  const t = useTranslations("CampaignWizard");
  const tc = useTranslations("Common");
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [campaignData, setCampaignData] = useState({
    name: "",
    subject: "",
    content: "",
    audience: "",
    scheduleType: "now",
    scheduleDate: "",
  });

  const totalSteps = 3;

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
      subject: "",
      content: "",
      audience: "",
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
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>
            {t("description")}
          </SheetDescription>
        </SheetHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 my-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  s < step
                    ? "bg-gradient-premium border-violet-500 text-white"
                    : s === step
                    ? "border-violet-500 text-violet-600"
                    : "border-slate-300 text-slate-400"
                }`}
              >
                {s < step ? <Check className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-0.5 mx-2 transition-colors ${
                    s < step ? "bg-violet-500" : "bg-slate-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="mt-6 space-y-6">
          {/* Step 1: Select Template */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{t("step")} 1: {t("selectTemplate")}</h3>
                <p className="text-sm text-slate-600">{t("selectTemplateDesc")}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                {mockTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-violet-300 ${
                      selectedTemplate === template.id
                        ? "border-violet-500 bg-violet-50"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="aspect-video bg-gradient-subtle rounded mb-2 flex items-center justify-center text-3xl">
                      📧
                    </div>
                    <h4 className="font-medium text-sm mb-1">{template.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{template.description}</p>
                    <div className="mt-2 text-xs text-slate-400">{t("used")} {template.usageCount}x</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Edit Content */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{t("step")} 2: {t("editContent")}</h3>
                <p className="text-sm text-slate-600">{t("editContentDesc")}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="campaign-name">{t("campaignName")}</Label>
                  <Input
                    id="campaign-name"
                    placeholder={t("campaignNamePlaceholder")}
                    value={campaignData.name}
                    onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="subject">{t("subject")}</Label>
                  <Input
                    id="subject"
                    placeholder={t("subjectPlaceholder")}
                    value={campaignData.subject}
                    onChange={(e) => setCampaignData({ ...campaignData, subject: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="content">{t("contentPreview")}</Label>
                  <Textarea
                    id="content"
                    rows={6}
                    placeholder={t("contentPlaceholder")}
                    value={campaignData.content}
                    onChange={(e) => setCampaignData({ ...campaignData, content: e.target.value })}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {t("richTextNote")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Select Audience & Schedule */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{t("step")} 3: {t("audienceSchedule")}</h3>
                <p className="text-sm text-slate-600">{t("audienceScheduleDesc")}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="audience">{t("audienceSegment")}</Label>
                  <Select value={campaignData.audience} onValueChange={(value) => setCampaignData({ ...campaignData, audience: value })}>
                    <SelectTrigger id="audience">
                      <SelectValue placeholder={t("selectAudience")} />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAudienceSegments.map((segment) => (
                        <SelectItem key={segment.id} value={segment.id}>
                          {segment.name} ({segment.count.toLocaleString()} {t("contacts")})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t("sendingSchedule")}</Label>
                  <Select
                    value={campaignData.scheduleType}
                    onValueChange={(value) => setCampaignData({ ...campaignData, scheduleType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">{t("sendNow")}</SelectItem>
                      <SelectItem value="schedule">{t("scheduleLater")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {campaignData.scheduleType === "schedule" && (
                  <div>
                    <Label htmlFor="schedule-date">{t("scheduleDateTime")}</Label>
                    <Input
                      id="schedule-date"
                      type="datetime-local"
                      value={campaignData.scheduleDate}
                      onChange={(e) => setCampaignData({ ...campaignData, scheduleDate: e.target.value })}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={step === 1 ? handleClose : handlePrevious}
            className="cursor-pointer"
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
              disabled={step === 1 && !selectedTemplate}
              className="bg-gradient-premium cursor-pointer"
            >
              {tc("next")}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-gradient-premium cursor-pointer" disabled={!campaignData.name || !campaignData.audience}>
              <Check className="h-4 w-4 mr-2" />
              {t("createCampaign")}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
