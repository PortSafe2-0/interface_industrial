"use client";

import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputProps {
  placeholder: string;
  type?: "text" | "password" | "email";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  icon?: React.ReactNode;
}

export default function Input({
  placeholder,
  type = "text",
  value,
  onChange,
  className
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div
      className="input-wrapper"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <InputText
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={className}
        style={{
          backgroundColor: "#333B40",
          color: "#ffffff", // cor do texto digitado
          border: "1px solid #ffffff26",
          borderRadius: "15px",
          width: "100%",
          paddingRight: type === "password" ? "2.5rem" : "0.625rem",
        }}
      />
      {type === "password" && (
        <span
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            color: "#757575",
          }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}

      {/* CSS interno (styled-jsx) */}
      <style jsx>{`
        :global(.p-inputtext::placeholder) {
          color: #757575; /* Cor do placeholder */
        }
        :global(.p-inputtext:focus::placeholder) {
          color: #555; /* Opcional: muda o placeholder ao focar */
        }
      `}</style>
    </div>
  );
}
