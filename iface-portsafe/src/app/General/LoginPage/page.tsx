"use client";

import React, { useState } from 'react';
import ToggleButton from '@/components/ToggleButton';
import Button from '@/components/Button';
import Input from '@/components/Input';
import BackButton from "@/components/BackButton";
import IconLogo from '@/assets/icons/icon_logo.png';
import axios from 'axios';
import { useRouter } from "next/navigation";
import Image from 'next/image';

type SelectedType = "morador" | "porteiro" | null;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedType, setSelectedType] = useState<SelectedType>(null);
  const [error, setError] = useState('');

  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // utilitário para pegar campos ignorando case
  const getAny = (obj: Record<string, unknown>, keys: string[]) => {
    if (!obj) return undefined;
    for (const k of keys) {
      if (k in obj && obj[k] != null) return obj[k];
    }
    return undefined;
  };

  // detectar se é morador baseado no objeto retornado
  const isMoradorFromUsuario = (usuario: Record<string, unknown>) => {
    const cpf = getAny(usuario, ['CPF', 'cpf', 'Cpf']);
    const unidadeId = getAny(usuario, ['UnidadeId', 'unidadeId']);
    const photo = getAny(usuario, ['Photo', 'photo']);

    const possuiCamposMorador = !!cpf || !!unidadeId || !!photo;

    const tipoEnum = getAny(usuario, ['Tipo', 'tipo']);
    const tipoNum = typeof tipoEnum === 'number'
      ? tipoEnum
      : (typeof tipoEnum === 'string' && /^\d+$/.test(tipoEnum)
        ? parseInt(tipoEnum, 10)
        : undefined);

    const ehMoradorPeloEnum = tipoNum === 0;

    console.debug("Detecção Morador:", {
      cpf, unidadeId, photo, tipoEnum, tipoNum, possuiCamposMorador, ehMoradorPeloEnum
    });

    return possuiCamposMorador || ehMoradorPeloEnum;
  };

  const handleLogin = async () => {
    setError("");

    if (!selectedType) {
      setError("Selecione Morador ou Porteiro antes de entrar.");
      return;
    }

    if (!validateEmail(email)) {
      setError('Formato de email inválido. Use @ e .');
      return;
    }

    try {
      const response = await axios.post(
        '/api/Auth/Login',
        { UsernameOrEmail: email, Password: password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { usuario, token } = response.data;

      // identificar se o backend reconheceu como morador
      const ehMorador = isMoradorFromUsuario(usuario);

      // validação contra o toggle
      const invalidProfileMessage = "Credenciais incompatíveis com o perfil selecionado.";

      if (selectedType === "morador" && !ehMorador) {
        setError(invalidProfileMessage);
        return;
      }

      if (selectedType === "porteiro" && ehMorador) {
        setError(invalidProfileMessage);
        return;
      }

      // salvar no localStorage apenas o tipo correto
      if (ehMorador) {
        localStorage.setItem("morador", JSON.stringify(usuario));
      } else {
        localStorage.setItem("porteiro", JSON.stringify(usuario));
      }

      // salvar token
      localStorage.setItem("token", token);

      // agora redireciona
      if (ehMorador) {
        router.push("/Resident/ResidentDashboardPage");
      } else {
        router.push("/Porter/PorterDashboardPage");
      }

    } catch (error) {
      console.error("Erro no login:", error);
      
      if (axios.isAxiosError(error)) {
        // Erro 401 - credenciais inválidas
        if (error.response?.status === 401) {
          setError("Email ou senha inválidos.");
        } 
        // Outros erros do backend
        else if (error.response?.data?.Message || error.response?.data?.message) {
          setError(error.response.data.Message || error.response.data.message);
        }
        // Erro de rede
        else if (error.message.includes('Network Error')) {
          setError("Erro de conexão. Verifique sua internet.");
        }
        // Erro genérico
        else {
          setError("Erro ao fazer login. Tente novamente.");
        }
      } else {
        setError("Erro inesperado. Tente novamente.");
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

      <div className="w-full max-w-[600px] min-w-[300px]  bg-[#ffffff26] rounded-3xl text-white text-center mx-4 sm:mx-6 md:mx-auto">

        <div className="flex items-center justify-between p-10 bg-[#084571] rounded-t-3xl min-h-[150px]">
          <div>
            <h1 className="title font-marmelad text-2xl">Bem-vindo de volta</h1>
            <h3>Faça login para ter acesso à sua conta</h3>
          </div>
          <Image src={IconLogo} alt="Logo" className="w-[24%] max-w-[120px] min-w-[60px]" />
        </div>

        {/* Toggle convertendo o valor para minúsculo */}
        <ToggleButton onToggle={(value) => setSelectedType(value.toLowerCase() as SelectedType)} />

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
            placeholder="Insira aqui sua senha "
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
      <BackButton className="mt-4 font-normal" />

    </div>
  );
};

export default LoginPage;