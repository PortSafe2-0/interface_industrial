interface IBotao {
  nome: string;
  estilo: "primary" | "secundary" | "transparent" | "portaria" | "entregador" | "myprofile";
  clique?: () => void;
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export default function Button({ nome, estilo, clique, className, icon }: IBotao) {
  return (
    <div className="flex justify-center">
      <button
        onClick={clique}
        className={`flex items-center justify-center gap-2 btn btn-${estilo} ${className ?? ""}`}
      >
        {icon && <span>{icon}</span>}
        {nome}
      </button>
    </div>
  );
}