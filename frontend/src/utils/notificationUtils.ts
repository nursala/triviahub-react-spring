/**
 * Lightweight notification types and helpers.
 *
 * This file intentionally contains only TypeScript declarations and re-exports
 * the React components implemented in `notificationUtils.tsx` to avoid JSX
 * being placed inside a `.ts` file which can cause parser errors.
 */

export type NotificationType = "success" | "danger" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  dismissible?: boolean;
  autoClose?: boolean;
}

export function generateNotificationId(): string {
  return `notification-${Date.now()}-${Math.random()}`;
}

// Re-export React components from the TSX implementation file.
export { ToastNotification, InlineAlert } from "./notificationUtils.tsx";

