import { Notification } from "@/types/notification";
import { Star, Trash2, Mail, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface NotificationItemProps {
  notification: Notification;
  isSelected: boolean;
  onSelect: (notification: Notification) => void;
  onToggleStar: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationItem = ({
  notification,
  isSelected,
  onSelect,
  onToggleStar,
  onDelete,
}: NotificationItemProps) => {
  const timeAgo = formatDistanceToNow(notification.date, {
    addSuffix: true,
    locale: es,
  });

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 border-b border-border cursor-pointer transition-colors hover:bg-accent/50",
        !notification.read && "bg-primary/5",
        isSelected && "bg-accent"
      )}
      onClick={() => onSelect(notification)}
    >
      <div className="flex-shrink-0 mt-1">
        {notification.read ? (
          <MailOpen className="h-5 w-5 text-muted-foreground" />
        ) : (
          <Mail className="h-5 w-5 text-primary" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={cn("font-medium truncate", !notification.read && "font-semibold")}>
            {notification.from}
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {timeAgo}
          </span>
        </div>
        <p className={cn("text-sm truncate", !notification.read && "font-medium")}>
          {notification.subject}
        </p>
        <p className="text-sm text-muted-foreground truncate">
          {notification.preview}
        </p>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(notification.id);
          }}
        >
          <Star
            className={cn(
              "h-4 w-4",
              notification.starred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            )}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
