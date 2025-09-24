import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, className, children, ...props }, ref) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
      if (isOpen) {
        setShouldRender(true);
        setClosing(false);
      } else if (shouldRender) {
        setClosing(true);
        const timeout = setTimeout(() => {
          setShouldRender(false);
        }, 300);

        return () => clearTimeout(timeout);
      }
    }, [isOpen, shouldRender]);

    // Close on Escape key
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }, [isOpen, onClose]);

    if (!shouldRender) return null;

    return createPortal(
      <div
        className={cn(
          "modal-overlay",
          "bg-black/70",
          "fixed",
          "inset-0",
          "z-50",
          "flex",
          "items-center",
          "justify-center",
          closing ? "animate-fade-out" : "animate-fade-in"
        )}
        onClick={(e) => {
          if (
            e.target instanceof HTMLElement &&
            e.target.classList.contains("modal-overlay")
          ) {
            onClose();
          }
        }}
        aria-modal="true"
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div
          ref={ref}
          className={cn(
            "modal-content",
            closing ? "animate-slide-out" : "animate-slide-in",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>,
      document.body
    );
  }
);

Modal.displayName = "Modal";

export { Modal, type ModalProps };
