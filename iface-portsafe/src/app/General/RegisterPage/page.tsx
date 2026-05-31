"use client";
import React, { useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import BackButton from "@/components/BackButton";
import IconLogo from '@/assets/icons/icon_logo.png';
import { authService } from '@/services/api';
import { useRouter } from "next/navigation";
import Image from 'next/image';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('porter'); // Valor padrão: porteiro
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validações
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Formato de email inválido.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.register({
        name,
        email,
        password,
        role,
      });

      setSuccess('Cadastro realizado com sucesso!');
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        router.push('/General/LoginPage');
      }, 2000);

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.Message || 
                          error.message ||
                          'Erro no registro.';
      setError(errorMessage);
      console.error('Erro ao registrar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-r from-[#002236] via-black to-[#002134] relative">
      {error && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-[#338AF2] to-[#0DB0D8] text-white p-2 rounded max-w-xs">
          {error}
        </div>
      )}
      {success && (
        <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded max-w-xs">
          {success}
        </div>
      )}

      <div className="w-full max-w-[600px] min-w-[300px] bg-[#ffffff26] rounded-3xl text-white text-center mx-8 sm:mx-10 md:mx-auto m-10">
        <div className="flex items-center justify-between p-10 bg-[#084571] rounded-t-3xl min-h-[150px]">
          <div>
            <h1 className="title font-marmelad text-2xl">Criar Nova Conta</h1>
            <h3>Faça seu cadastro para acessar o sistema</h3>
          </div>
          <Image src={IconLogo} alt="Logo" className="w-[24%] max-w-[120px] min-w-[60px]" />
        </div>

        <div className="px-4 sm:px-10 md:px-20 mt-4">
          <p className="text-left text-lg pl-4 mb-2">Tipo de Usuário</p>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full h-10 pl-4 pr-4 bg-[#1E2432] text-white border border-[#606060] rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="porter">Porteiro</option>
            <option value="resident">Residente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="px-4 sm:px-10 md:px-20 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="col-span-1 sm:col-span-2">
            <p className="text-left mt-4 text-lg pl-4">Nome Completo</p>
            <Input 
              placeholder="Insira seu nome completo" 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full h-10 pl-4" 
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <p className="text-left text-lg pl-4">E-mail</p>
            <Input 
              placeholder="Insira seu e-mail" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full h-10 pl-4" 
            />
          </div>
          <div className="col-span-1">
            <p className="text-left text-lg pl-4">Senha</p>
            <Input 
              placeholder="Mínimo 6 caracteres" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full h-10 pl-4" 
            />
          </div>
          <div className="col-span-1">
            <p className="text-left text-lg pl-4">Confirmar Senha</p>
            <Input 
              placeholder="Reescreva sua senha" 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full h-10 pl-4" 
            />
          </div>
        </div>

        <Button 
          nome={isLoading ? "Cadastrando..." : "Cadastrar"} 
          estilo="primary" 
          clique={handleRegister} 
          className='mt-6 mb-3'
          disabled={isLoading}
        />
        <h2 className="text-gray-400 text-sm mb-3">Já tem uma conta?</h2>
        <a href="/General/LoginPage" className="text-blue-300 block text-sm mt-0 mb-3 hover:underline">
          Faça login aqui!
        </a>
      </div>
      <BackButton className="font-normal" />
    </div>
  );
};

export default RegisterPage;