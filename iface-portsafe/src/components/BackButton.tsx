"use client";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

interface BackButtonProps {
  label?: string;
  className?: string;
}

export default function BackButton({ label = "Voltar a Página Inicial", className }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/General/SelectProfilePage")}
      className={`flex items-center gap-2 text-base text-gray-400 hover:text-[#10ACD9] transition ${className || ""}`}
    >
      <FaArrowLeft size={18} />
      {label}
    </button>
  );
}
