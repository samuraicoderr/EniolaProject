"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, BellOff, CheckCheck, Loader2 } from "lucide-react";
import {
  useNotifications,
  useUnreadNotificationsCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/lib/api/query";
import FrontendRoutes from "@/lib/api/FrontendRoutes";

function timeAgo(dateString?: string): string {
  if (!dateString) return "";
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const levelColors: Record<string, string> = {
  info: "border-l-slate-400",
  success: "border-l-emerald-400",
  warning: "border-l-amber-400",
  error: "border-l-red-400",
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: notifications = [], isLoading } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationsCount();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const recent = notifications.slice(0, 5);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-full p-2 text-[#6b7280] transition hover:bg-slate-100"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[360px] rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead.mutate()}
                disabled={markAllAsRead.isPending}
                className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50"
              >
                {markAllAsRead.isPending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <CheckCheck size={12} />
                )}
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {isLoading ? (
              <div className="flex h-32 items-center justify-center text-sm text-slate-500">
                <Loader2 size={16} className="mr-2 animate-spin" />
                Loading...
              </div>
            ) : recent.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                <BellOff className="mb-2 h-8 w-8 text-slate-300" />
                <p className="text-sm text-slate-500">No notifications yet</p>
              </div>
            ) : (
              recent.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-l-4 px-4 py-3 transition hover:bg-slate-50 ${!notification.is_read ? levelColors[notification.level ?? "info"] : "border-l-transparent"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm ${!notification.is_read ? "font-semibold text-slate-900" : "text-slate-600"}`}
                      >
                        {notification.title || notification.message || notification.body || "Notification"}
                      </p>
                      {(notification.message || notification.body) && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {notification.message || notification.body}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-slate-400">
                        {timeAgo(notification.created_at)}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <button
                        type="button"
                        onClick={() => markAsRead.mutate(notification.id)}
                        disabled={markAsRead.isPending}
                        className="shrink-0 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                        aria-label="Mark as read"
                      >
                        {markAsRead.isPending ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Bell size={14} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 px-4 py-2">
            <Link
              href={FrontendRoutes.dashboardRoutes.notifications}
              onClick={() => setOpen(false)}
              className="block text-center text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
