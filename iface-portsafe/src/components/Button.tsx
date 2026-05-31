interface IBotao {
  nome: string;
  estilo: "primary" | "secundary" | "transparent" | "portaria" | "entregador" | "myprofile";
  clique?: () => void;
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
}

export default function Button({ nome, estilo, clique, className, icon, disabled }: IBotao) {
  return (
    <div className="flex justify-center">
      <button
        onClick={clique}
        disabled={disabled}
        className={`flex items-center justify-center gap-2 btn btn-${estilo} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className ?? ""}`}
      >
        {icon && <span>{icon}</span>}
        {nome}
      </button>
    </div>
  );
}