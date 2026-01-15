import { useNotifications } from "@/hooks/useNotifications";
import { NotificationFilters } from "./NotificationFilters";
import { NotificationItem } from "./NotificationItem";
import { NotificationDetail } from "./NotificationDetail";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bell, CheckCheck, X } from "lucide-react";

export const NotificationCenter = () => {
  const {
    notifications,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    selectedNotification,
    selectNotification,
    setSelectedNotification,
    toggleStar,
    deleteNotification,
    markAllAsRead,
    unreadCount,
  } = useNotifications();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Centro de Notificaciones</h1>
                <p className="text-sm text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} sin leer` : "Todo al día"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar notificaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Marcar todo como leído
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <NotificationFilters
        currentFilter={filter}
        onFilterChange={setFilter}
        unreadCount={unreadCount}
      />

      {/* Content */}
      <div className="container mx-auto">
        <div className="flex">
          {/* Notification List */}
          <div className={`${selectedNotification ? "w-1/2 border-r border-border" : "w-full"} transition-all`}>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Bell className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg">No hay notificaciones</p>
                <p className="text-sm">
                  {searchQuery ? "Intenta con otra búsqueda" : "¡Estás al día!"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    isSelected={selectedNotification?.id === notification.id}
                    onSelect={selectNotification}
                    onToggleStar={toggleStar}
                    onDelete={deleteNotification}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Notification Detail */}
          {selectedNotification && (
            <div className="w-1/2">
              <NotificationDetail
                notification={selectedNotification}
                onClose={() => setSelectedNotification(null)}
                onToggleStar={toggleStar}
                onDelete={deleteNotification}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
