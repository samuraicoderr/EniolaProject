import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NotificationService from "@/lib/api/services/Notification.Service";
import type { NotificationType } from "@/lib/api/services/Notification.Service";

const keys = {
  notifications: ["notifications"] as const,
  unreadCount: ["notifications", "unread-count"] as const,
};

export function useNotifications() {
  return useQuery<NotificationType[]>({
    queryKey: keys.notifications,
    queryFn: () => NotificationService.getNotifications(),
  });
}

export function useUnreadNotificationsCount() {
  return useQuery<number>({
    queryKey: keys.unreadCount,
    queryFn: () => NotificationService.getUnreadCount(),
  });
}

export function useMarkNotificationAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => NotificationService.markAsRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.notifications });
      qc.invalidateQueries({ queryKey: keys.unreadCount });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => NotificationService.markAllAsRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.notifications });
      qc.invalidateQueries({ queryKey: keys.unreadCount });
    },
  });
}
