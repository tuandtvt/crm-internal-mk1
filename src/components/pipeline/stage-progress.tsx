"use client";

import { useState } from "react";
import {
  PIPELINE_STAGES,
  getStageConfig,
  getStageProgress,
} from "@/lib/pipeline-config";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface StageProgressProps {
  currentStage: string;
  onStageChange?: (newStage: string) => void;
  readonly?: boolean;
}

export function StageProgress({
  currentStage,
  onStageChange,
  readonly = false,
}: StageProgressProps) {
  const [open, setOpen] = useState(false);
  const stageConfig = getStageConfig(currentStage);
  const progress = getStageProgress(currentStage);
  const activeStages = PIPELINE_STAGES.filter(
    (s) => s.id !== "won" && s.id !== "lost"
  );

  const handleStageSelect = (stage: string) => {
    if (onStageChange) {
      onStageChange(stage);
    }
    setOpen(false);
  };

  // Progress bar colors based on current stage
  const getProgressColor = () => {
    if (currentStage === "won") return "bg-emerald-500";
    if (currentStage === "lost") return "bg-rose-500";
    if (currentStage === "negotiation") return "bg-orange-500";
    if (currentStage === "proposal") return "bg-purple-500";
    if (currentStage === "contacted") return "bg-blue-500";
    return "bg-slate-400";
  };

  const content = (
    <div className="flex items-center gap-3 min-w-[180px]">
      {/* Mini stepper visualization */}
      <div className="flex-1">
        <div className="flex items-center gap-0.5 mb-1">
          {activeStages.map((stage) => {
            const isActive = stage.order <= getStageConfig(currentStage).order;
            const isCurrent = stage.id === currentStage;
            return (
              <div
                key={stage.id}
                className={cn(
                  "h-2 flex-1 rounded-sm transition-colors",
                  isActive ? getProgressColor() : "bg-slate-200",
                  isCurrent && "ring-1 ring-offset-1 ring-slate-400"
                )}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "text-xs font-medium px-1.5 py-0.5 rounded",
              stageConfig.bgColor,
              stageConfig.textColor
            )}
          >
            {stageConfig.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {currentStage === "won" || currentStage === "lost"
              ? ""
              : `${Math.round(progress)}%`}
          </span>
        </div>
      </div>
    </div>
  );

  if (readonly) {
    return content;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="w-full text-left cursor-pointer hover:bg-muted/50 rounded-md p-1 -m-1 transition-colors">
          {content}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground mb-2 px-2">
            Change Stage
          </p>
          {PIPELINE_STAGES.map((stage) => (
            <Button
              key={stage.id}
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start gap-2",
                currentStage === stage.id && "bg-muted"
              )}
              onClick={() => handleStageSelect(stage.id)}
            >
              <span
                className={cn(
                  "w-3 h-3 rounded-full",
                  stage.bgColor,
                  "border border-current",
                  stage.textColor
                )}
              />
              <span className="flex-1 text-left">{stage.label}</span>
              {currentStage === stage.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
