import * as React from "react";
//import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg z-10 p-20 max-w-4xl mx-auto transform transition-all duration-300 ease-in-out scale-100 relative">
        <button className="absolute top-4 right-4 text-gray-100 hover:text-gray-900 transition-colors duration-150" onClick={onClose}>
          ✖
        </button>
        <h3 className="modal-title text-lg font-semibold mb-4 text-center"> {}

        </h3>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
