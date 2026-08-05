import {
  apiRequest,
} from "./client.js";

export async function getNotifications() {
  const notifications =
    await apiRequest(
      "/users/me/notifications"
    );

  return Array.isArray(
    notifications
  )
    ? notifications
    : [];
}

export async function markNotificationRead(
  notificationId
) {
  return apiRequest(
    `/users/me/notifications/${notificationId}/read`,
    {
      method: "PATCH",
    }
  );
}

export async function markAllNotificationsRead() {
  return apiRequest(
    "/users/me/notifications/read-all",
    {
      method: "PATCH",
    }
  );
}