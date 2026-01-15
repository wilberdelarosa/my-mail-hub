import { useState, useCallback, useMemo } from "react";
import { Notification, NotificationFilter } from "@/types/notification";
import { mockNotifications } from "@/data/mockNotifications";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const filteredNotifications = useMemo(() => {
    let result = notifications;

    // Apply category filter
    if (filter === "unread") {
      result = result.filter((n) => !n.read);
    } else if (filter === "starred") {
      result = result.filter((n) => n.starred);
    } else if (filter !== "all") {
      result = result.filter((n) => n.category === filter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.subject.toLowerCase().includes(query) ||
          n.from.toLowerCase().includes(query) ||
          n.preview.toLowerCase().includes(query)
      );
    }

    return result.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [notifications, filter, searchQuery]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const toggleStar = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, starred: !n.starred } : n))
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setSelectedNotification(null);
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const selectNotification = useCallback((notification: Notification) => {
    setSelectedNotification(notification);
    markAsRead(notification.id);
  }, [markAsRead]);

  return {
    notifications: filteredNotifications,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    selectedNotification,
    selectNotification,
    setSelectedNotification,
    markAsRead,
    toggleStar,
    deleteNotification,
    markAllAsRead,
    unreadCount,
  };
};
