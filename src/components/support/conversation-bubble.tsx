import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ConversationMessage } from "@/lib/mock-data/support";
import { cn } from "@/lib/utils";

interface ConversationBubbleProps {
  message: ConversationMessage;
}

export function ConversationBubble({ message }: ConversationBubbleProps) {
  const isCustomer = message.sender === "customer";
  const isSystem = message.sender === "system";

  if (isSystem) {
    return (
      <div className="flex items-center justify-center">
        <div className="bg-slate-100 text-slate-600 text-xs px-4 py-2 rounded-full max-w-md text-center">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-start gap-3", !isCustomer && "flex-row-reverse")}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback
          className={cn(
            "text-xs",
            isCustomer ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"
          )}
        >
          {message.senderName.split(" ").map((n) => n[0]).join("")}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "flex-1 max-w-[75%] space-y-1",
          !isCustomer && "flex flex-col items-end"
        )}
      >
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {!isCustomer && <span>{message.timestamp.toLocaleTimeString()}</span>}
          <span className="font-medium">{message.senderName}</span>
          {isCustomer && <span>{message.timestamp.toLocaleTimeString()}</span>}
        </div>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl text-sm",
            isCustomer
              ? "bg-blue-500 text-white rounded-tl-sm"
              : "bg-slate-100 text-slate-900 rounded-tr-sm"
          )}
        >
          {message.content}
        </div>
        {message.attachments && message.attachments.length > 0 && (
          <div className="space-y-1 mt-2">
            {message.attachments.map((attachment, idx) => (
              <div
                key={idx}
                className="text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg flex items-center gap-2 cursor-pointer hover:border-violet-300"
              >
                <span>📎</span>
                <span className="text-slate-700">{attachment.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
