import React from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

class ToasterErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Toaster error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ToastProvider>
          <ToastViewport />
        </ToastProvider>
      );
    }

    return this.props.children;
  }
}

function ToasterComponent() {
  try {
    const { toasts } = useToast()

    return (
      <ToastProvider>
        {toasts.map(function ({ id, title, description, action, ...props }) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          )
        })}
        <ToastViewport />
      </ToastProvider>
    )
  } catch (error) {
    console.error('Toaster hook error:', error);
    return (
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>
    );
  }
}

export function Toaster() {
  return (
    <ToasterErrorBoundary>
      <ToasterComponent />
    </ToasterErrorBoundary>
  );
}