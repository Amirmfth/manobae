"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/icons";

type OverlayProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel?: string;
  children: React.ReactNode;
};

function Overlay({ open, onClose, title, closeLabel = "Close", children, kind }: OverlayProps & { kind: "modal" | "sheet" }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className={`overlay overlay--${kind}`} onCancel={onClose} onClick={(event) => {
      if (event.target === ref.current) onClose();
    }}>
      <div className="overlay__panel">
        <header className="overlay__header">
          <h2 className="section-title display-type">{title}</h2>
          <button type="button" className="button button--quiet button--icon" onClick={onClose} aria-label={closeLabel}>
            <Icon name="close" />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}

export function Modal(props: OverlayProps) {
  return <Overlay {...props} kind="modal" />;
}

export function BottomSheet(props: OverlayProps) {
  return <Overlay {...props} kind="sheet" />;
}
