"use client";

import React, { useState } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import IconLogo from '@/assets/icons/icon_logo.png';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';
import Image from 'next/image';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleForgotPassword = async () => {
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    try {
      await axios.post(
        '/api/Auth/SolicitarResetSenha',
        { Email: email },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // SUCESSO! (sempre retorna 200 por segurança)
      setSuccess('Código enviado! Verifique seu e-mail (e a pasta de spam).');

      // Redireciona automaticamente para a tela do código
      setTimeout(() => {
        router.push(`/General/ResetPasswordWithCodePage?email=${encodeURIComponent(email)}`);
      }, 2000);

    } catch (err: unknown) {
      // Qualquer erro (500, CORS, rede, etc.)
      console.error('Erro ao solicitar reset:', err);

      const error = err as { response?: { data?: { Message?: string } }; message?: string };

      if (error.response?.data?.Message) {
        setError(error.response.data.Message);
      } else if (error.message?.includes('Network Error')) {
        setError('Erro de conexão. Verifique se o backend está rodando.');
      } else {
        setError('Erro ao enviar solicitação. Tente novamente.');
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-r from-[#002236] via-black to-[#002134] relative">

      {/* Notificações */}
      {error && (
         <div className="absolute top-4 right-4 bg-gradient-to-r from-[#338AF2] to-[#0DB0D8] text-white p-2 rounded">
          {error}
        </div>
      )}
      {success && (
         <div className="absolute top-4 right-4 bg-gradient-to-r from-[#338AF2] to-[#0DB0D8] text-white p-2 rounded">
          {success}
        </div>
      )}

      <div className="w-full max-w-[600px] min-w-[300px] bg-[#ffffff26] rounded-3xl text-white text-center mx-4">

        <div className="flex items-center justify-between p-10 bg-[#084571] rounded-t-3xl min-h-[150px]">
          <div className="text-left">
            <h1 className="title font-marmelad text-2xl">Esqueceu a senha?</h1>
            <h3>Recupere o acesso à sua conta</h3>
          </div>
          <Image src={IconLogo} alt="Logo" width={120} height={120} className="w-[24%] max-w-[120px] min-w-[60px]" />
        </div>

        <div className="px-10 py-8 space-y-6">
          <div>
            <p className="text-left text-lg mb-2">E-mail</p>
            <Input
              placeholder="exemplo@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 pl-4 text-lg"
            />
          </div>

          <Button
            nome="Enviar Código"
            estilo="secundary"
            clique={handleForgotPassword}
            className="w-full h-12 text-lg"
          />

          <p className="text-sm text-gray-300">
            Enviaremos um código de 6 dígitos para o seu e-mail.
          </p>
        </div>
      </div>
      <BackButton className="mt-4 font-normal" />
    </div>
  );
};

export default ForgotPasswordPage;