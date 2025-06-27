
import React from "react";
import Card from "./Card";

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const Modal = ({ isOpen, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card>
        {children}
      </Card>
    </div>
  );
};

export default Modal;
