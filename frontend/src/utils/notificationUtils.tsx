/**
 * Notification Utilities for User Feedback
 * Provides Toast and Alert components to replace native alert() function.
 * Follows Bootstrap styling conventions for consistent UI.
 */

import React from "react";
import { Toast } from "react-bootstrap";
import type { Notification } from "./notificationUtils";

export const ToastNotification: React.FC<{
  notification: Notification;
  onDismiss: (id: string) => void;
}> = ({ notification, onDismiss }) => {
  const bgVariant = notification.type === "danger" ? "danger" : notification.type;

  return (
    <Toast
      onClose={() => onDismiss(notification.id)}
      show={true}
      delay={notification.autoClose ? 5000 : undefined}
      autohide={notification.autoClose}
      className={`bg-${bgVariant} text-white`}
    >
      {notification.title && (
        <Toast.Header closeButton>
          <strong className="me-auto">{notification.title}</strong>
        </Toast.Header>
      )}
      <Toast.Body>{notification.message}</Toast.Body>
    </Toast>
  );
};

export const InlineAlert: React.FC<{
  notification: Notification;
  onDismiss?: (id: string) => void;
}> = ({ notification, onDismiss }) => {
  const alertClasses = `alert alert-${notification.type === "danger" ? "danger" : notification.type} ${
    notification.dismissible ? "alert-dismissible fade show" : ""
  }`;

  return (
    <div className={alertClasses} role="alert">
      {notification.title && <h4 className="alert-heading">{notification.title}</h4>}
      <p>{notification.message}</p>
      {notification.dismissible && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={() => onDismiss?.(notification.id)}
        ></button>
      )}
    </div>
  );
};

