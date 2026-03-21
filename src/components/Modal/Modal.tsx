import type { ReactNode } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>

          <button className={styles.closeButton} type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
