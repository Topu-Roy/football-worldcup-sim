/**
 * Promise-based confirmation using the app's own <dialog> (see
 * ConfirmDialog.astro). Falls back to window.confirm only when the native
 * dialog API is unavailable.
 */
export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Style the confirm action as destructive. */
  danger?: boolean;
}

const DIALOG_ID = "confirm-dialog";

export function confirmAction(options: ConfirmOptions): Promise<boolean> {
  const dialog = document.getElementById(DIALOG_ID);

  if (!(dialog instanceof HTMLDialogElement) || !dialog.showModal) {
    const text = options.message
      ? `${options.title}\n\n${options.message}`
      : options.title;
    return Promise.resolve(window.confirm(text));
  }

  const titleEl = dialog.querySelector<HTMLElement>("[data-confirm-title]");
  const messageEl = dialog.querySelector<HTMLElement>("[data-confirm-message]");
  const confirmBtn =
    dialog.querySelector<HTMLButtonElement>("[data-confirm-ok]");
  const cancelBtn = dialog.querySelector<HTMLButtonElement>(
    "[data-confirm-cancel]",
  );

  if (titleEl) titleEl.textContent = options.title;
  if (messageEl) {
    messageEl.textContent = options.message ?? "";
    messageEl.hidden = !options.message;
  }
  if (confirmBtn) {
    confirmBtn.textContent = options.confirmLabel ?? "Confirm";
    confirmBtn.classList.toggle("is-danger", options.danger === true);
  }
  if (cancelBtn) cancelBtn.textContent = options.cancelLabel ?? "Cancel";

  // Only one confirmation at a time; cancel any dialog still open.
  if (dialog.open) dialog.close("cancel");

  document.documentElement.classList.add("dialog-open");
  // Escape and backdrop close resolve as cancel.
  dialog.returnValue = "cancel";

  return new Promise<boolean>((resolve) => {
    const onClose = () => {
      document.documentElement.classList.remove("dialog-open");
      dialog.removeEventListener("close", onClose);
      resolve(dialog.returnValue === "confirm");
    };
    dialog.addEventListener("close", onClose);
    dialog.showModal();
    // Default focus lands on the safe action.
    cancelBtn?.focus();
  });
}
