import * as React from "react";
import { cn } from "@/lib/utils";

interface PropsNotificacao {
  mensagem: string;
  tipo?: "sucesso" | "erro";
  onClose: () => void;
}

const Notificacao: React.FC<PropsNotificacao> = ({ mensagem, tipo = "sucesso", onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer); 
  }, [onClose]);

  return (
    <div className={cn("p-4 rounded-md text-white", {
      "bg-green-500": tipo === "sucesso",
      "bg-red-500": tipo === "erro",
    })}>
      {mensagem}
    </div>
  );
};

export default Notificacao;
