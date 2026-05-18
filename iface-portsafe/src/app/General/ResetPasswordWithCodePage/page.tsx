"use client";

import React, { useState, Suspense } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import IconLogo from '@/assets/icons/icon_logo.png';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email'); 

  const [email, setEmail] = useState(emailFromUrl || '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleResetPassword = async () => {
    setError('');
    setSuccess('');

    if (!email || !code || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      await axios.post('/api/Auth/RedefinirSenha', {
        Email: email,
        Token: code,
        NovaSenha: password,
        ConfirmarSenha: confirmPassword
      });

      setSuccess('Senha redefinida com sucesso! Redirecionando...');
      setTimeout(() => {
        router.push('/General/LoginPage');
      }, 2000);

    } catch (err: unknown) {
      const error = err as { response?: { data?: { Message?: string } } };
      const msg = error.response?.data?.Message || 'Código inválido ou expirado.';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-[#002236] via-black to-[#002134] relative">

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

      <div className="w-full max-w-[600px] bg-[#ffffff26] rounded-3xl text-white text-center mx-4">

        <div className="flex items-center justify-between p-10 bg-[#084571] rounded-t-3xl">
          <div className="text-left">
            <h1 className="title font-marmelad text-2xl">Redefinir Senha</h1>
            <h3>Digite o código recebido por e-mail</h3>
          </div>
          <Image src={IconLogo} alt="Logo" width={120} height={120} className="w-[24%] max-w-[120px]" />
        </div>

        <div className="px-10 py-6 !space-y-4">

          <Input
            placeholder="seu@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 pl-4"
          />

          <Input
            placeholder="Código de 6 dígitos"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full h-15 pl-4 text-center text-2xl tracking-widest"
          />

          <Input
            placeholder="Nova senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-10 pl-4"
          />

          <Input
            placeholder="Confirme a nova senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-10 pl-4"
          />

          <Button
            nome="Redefinir Senha"
            estilo="primary"
            clique={handleResetPassword}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

const ResetPasswordWithCode: React.FC = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#002236] via-black to-[#002134] text-white">Carregando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordWithCode;