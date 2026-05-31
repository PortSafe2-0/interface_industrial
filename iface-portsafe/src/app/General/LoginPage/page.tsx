"use client";

import React, { useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import BackButton from "@/components/BackButton";
import IconLogo from '@/assets/icons/icon_logo.png';
import { authService } from '@/services/api';
import { useRouter } from "next/navigation";
import Image from 'next/image';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Formato de email inválido.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.login({ email, password });

      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);

      router.push("/DashboardIndustrial");

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.Message || 
                          error.message ||
                          "Erro ao fazer login.";
      setError(errorMessage);
      console.error("Erro ao fazer login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-r from-[#002236] via-black to-[#002134] relative">

      {error && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-[#338AF2] to-[#0DB0D8] text-white p-2 rounded">
          {error}
        </div>
      )}

      <div className="w-full max-w-[600px] min-w-[300px] bg-[#ffffff26] rounded-3xl text-white text-center mx-4 sm:mx-6 md:mx-auto">

        <div className="flex items-center justify-between p-10 bg-[#084571] rounded-t-3xl min-h-[150px]">
          <div>
            <h1 className="title font-marmelad text-2xl">Bem-vindo de volta</h1>
            <h3>Faça login para ter acesso à sua conta</h3>
          </div>
          <Image src={IconLogo} alt="Logo" className="w-[24%] max-w-[120px] min-w-[60px]" />
        </div>

        <div className="px-4 sm:px-10 md:px-20">
          <p className="text-left mt-4 text-lg pl-4">E-mail</p>
          <Input
            placeholder="Insira aqui seu e-mail"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full h-10 pl-4"
          />

          <p className="text-left mt-4 text-lg pl-4">Senha</p>
          <Input
            placeholder="Insira aqui sua senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full h-10 pl-4"
          />

          <a href="/General/ForgotPasswordPage" className="block text-left text-sm pl-4 mt-3 hover:underline">
            Esqueceu a senha?
          </a>

          <Button
            nome={isLoading ? "Entrando..." : "Entrar"}
            estilo="primary"
            clique={handleLogin}
            className='mt-3 mb-3'
            disabled={isLoading}
          />

          <h2 className="text-gray-400 text-sm">Não tem uma conta?</h2>
          <a href="/General/RegisterPage" className="text-blue-300 block text-sm mt-0 mb-3 hover:underline">
            Cadastre-se aqui
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;