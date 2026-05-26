"use client";

import React, { useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import BackButton from "@/components/BackButton";
import IconLogo from '@/assets/icons/icon_logo.png';
import axios from 'axios';
import { useRouter } from "next/navigation";
import Image from 'next/image';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setError("");

    if (!validateEmail(email)) {
      setError('Formato de email inválido.');
      return;
    }

    try {
      const response = await axios.post(
        '/api/Auth/Login',
        { UsernameOrEmail: email, Password: password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { usuario, token } = response.data;

      localStorage.setItem("porteiro", JSON.stringify(usuario));
      localStorage.setItem("token", token);

      router.push("/Porter/PorterDashboardPage");

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Email ou senha inválidos.");
        } else if (error.response?.data?.Message || error.response?.data?.message) {
          setError(error.response.data.Message || error.response.data.message);
        } else {
          setError("Erro ao fazer login.");
        }
      } else {
        setError("Erro inesperado.");
      }
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
            className="w-full h-10 pl-4"
          />

          <p className="text-left mt-4 text-lg pl-4">Senha</p>
          <Input
            placeholder="Insira aqui sua senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-10 pl-4"
          />

          <a href="/General/ForgotPasswordPage" className="block text-left text-sm pl-4 mt-3 hover:underline">
            Esqueceu a senha?
          </a>

          <Button
            nome="Entrar"
            estilo="primary"
            clique={handleLogin}
            className='mt-3 mb-3'
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