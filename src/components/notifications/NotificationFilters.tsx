import { NotificationFilter } from "@/types/notification";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Inbox, Mail, Star, Tag, Users, Bell, Megaphone } from "lucide-react";

interface NotificationFiltersProps {
  currentFilter: NotificationFilter;
  onFilterChange: (filter: NotificationFilter) => void;
  unreadCount: number;
}

const filters: { value: NotificationFilter; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "Todos", icon: <Inbox className="h-4 w-4" /> },
  { value: "unread", label: "No leídos", icon: <Mail className="h-4 w-4" /> },
  { value: "starred", label: "Destacados", icon: <Star className="h-4 w-4" /> },
  { value: "primary", label: "Principal", icon: <Tag className="h-4 w-4" /> },
  { value: "social", label: "Social", icon: <Users className="h-4 w-4" /> },
  { value: "promotions", label: "Promociones", icon: <Megaphone className="h-4 w-4" /> },
  { value: "updates", label: "Actualizaciones", icon: <Bell className="h-4 w-4" /> },
];

export const NotificationFilters = ({
  currentFilter,
  onFilterChange,
  unreadCount,
}: NotificationFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 p-4 border-b border-border bg-muted/30">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={currentFilter === filter.value ? "default" : "outline"}
          size="sm"
          className={cn(
            "gap-2",
            currentFilter === filter.value && "shadow-sm"
          )}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.icon}
          {filter.label}
          {filter.value === "unread" && unreadCount > 0 && (
            <span className="ml-1 bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};
