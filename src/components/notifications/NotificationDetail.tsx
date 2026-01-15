import { Notification } from "@/types/notification";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Star, Trash2, Reply, Forward, Paperclip } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface NotificationDetailProps {
  notification: Notification;
  onClose: () => void;
  onToggleStar: (id: string) => void;
  onDelete: (id: string) => void;
}

const categoryLabels: Record<string, string> = {
  primary: "Principal",
  social: "Social",
  promotions: "Promociones",
  updates: "Actualizaciones",
};

export const NotificationDetail = ({
  notification,
  onClose,
  onToggleStar,
  onDelete,
}: NotificationDetailProps) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <Badge variant="secondary">{categoryLabels[notification.category]}</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onToggleStar(notification.id)}>
            <Star
              className={cn(
                "h-4 w-4",
                notification.starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
              )}
            />
          </Button>
          <Button variant="ghost" size="icon">
            <Reply className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Forward className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(notification.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <h2 className="text-xl font-semibold mb-4">{notification.subject}</h2>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-semibold">
              {notification.from.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium">{notification.from}</p>
            <p className="text-sm text-muted-foreground">{notification.fromEmail}</p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            {format(notification.date, "PPPp", { locale: es })}
          </div>
        </div>

        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap font-sans bg-transparent p-0 text-foreground">
            {notification.content}
          </pre>
        </div>

        {notification.attachments && notification.attachments.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              Adjuntos ({notification.attachments.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {notification.attachments.map((attachment, index) => (
                <Button key={index} variant="outline" size="sm">
                  {attachment}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
