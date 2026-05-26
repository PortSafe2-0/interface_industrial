"use client";
import React, { useState } from 'react';
import ToggleButton from '@/components/ToggleButton';
import Button from '@/components/Button';
import Input from '@/components/Input';
import BackButton from "@/components/BackButton";
import IconLogo from '@/assets/icons/icon_logo.png';
import axios from 'axios';
import Image from 'next/image';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [condominioId, setCondominioId] = useState('');
  const [condominios, setCondominios] = useState<Array<{ id: number; nomeDoCondominio: string; tipo: string }>>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  React.useEffect(() => {
    const fetchCondominios = async () => {
      try {
        const response = await axios.get('/api/Condominio');
        setCondominios(response.data);
      } catch (error) {
        console.error('Erro ao buscar condomínios:', error);
      }
    };
    fetchCondominios();
  }, []);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Formato de email inválido.');
      return;
    }
    if (!condominioId) {
      setError('Selecione um condomínio.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Senhas não coincidem.');
      return;
    }

    const requestData = {
      nome: name,
      email: email,
      senha: password,
      telefone: phone,
      condominioId: parseInt(condominioId)
    };

    try {
      const response = await axios.post('/api/Auth/CadastroPorteiro', requestData, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.status === 200) {
        setSuccess('Cadastro realizado com sucesso!');
        setName(''); setEmail(''); setPassword(''); setConfirmPassword(''); setPhone(''); setCondominioId('');
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) 
        ? (error.response?.data?.Message || 'Erro no registro.')
        : 'Erro inesperado.';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-r from-[#002236] via-black to-[#002134] relative">
      {error && <div className="absolute top-4 right-4 bg-gradient-to-r from-[#338AF2] to-[#0DB0D8] text-white p-2 rounded">{error}</div>}
      {success && <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded">{success}</div>}

      <div className="w-full max-w-[600px] min-w-[300px] bg-[#ffffff26] rounded-3xl text-white text-center mx-8 sm:mx-10 md:mx-auto m-10">
        <div className="flex items-center justify-between p-10 bg-[#084571] rounded-t-3xl min-h-[150px]">
          <div>
            <h1 className="title font-marmelad text-2xl">Criar Nova Conta</h1>
            <h3>Complete o cadastro do Porteiro</h3>
          </div>
          <Image src={IconLogo} alt="Logo" className="w-[24%] max-w-[120px] min-w-[60px]" />
        </div>

        <div className="px-4 sm:px-10 md:px-20 mt-4">
          <p className="text-left text-lg pl-4 mb-2">Condomínio</p>
          <select
            value={condominioId}
            onChange={(e) => setCondominioId(e.target.value)}
            className="w-full h-10 pl-4 pr-4 bg-[#1E2432] text-white border border-[#606060] rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">Selecione um condomínio</option>
            {condominios.map((cond) => (
              <option key={cond.id} value={cond.id}>
                {cond.nomeDoCondominio} ({cond.tipo})
              </option>
            ))}
          </select>
        </div>

        <div className="px-4 sm:px-10 md:px-20 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="col-span-1 sm:col-span-2">
            <p className="text-left mt-4 text-lg pl-4">Nome Completo</p>
            <Input placeholder="Insira seu nome completo" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 pl-4" />
          </div>
          <div className="col-span-1">
            <p className="text-left text-lg pl-4">E-mail</p>
            <Input placeholder="Insira aqui seu e-mail" type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-10 pl-4" />
          </div>
          <div className="col-span-1">
            <p className="text-left text-lg pl-4">Telefone</p>
            <Input placeholder="(15) 9999-9999" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-10 pl-4" />
          </div>
          <div className="col-span-1">
            <p className="text-left text-lg pl-4">Senha</p>
            <Input placeholder="Insira aqui sua senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-10 pl-4" />
          </div>
          <div className="col-span-1">
            <p className="text-left text-lg pl-4">Confirmar Senha</p>
            <Input placeholder="Reescreva sua senha" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full h-10 pl-4" />
          </div>
        </div>

        <Button nome="Cadastrar" estilo="primary" clique={handleRegister} className='mt-6 mb-3' />
        <h2 className="text-gray-400 text-sm mb-3">Já tem uma conta?</h2>
        <a href="/General/LoginPage" className="text-blue-300 block text-sm mt-0 mb-3 hover:underline">Faça login aqui!</a>
      </div>
      <BackButton className="font-normal" />
    </div>
  );
};

export default RegisterPage;