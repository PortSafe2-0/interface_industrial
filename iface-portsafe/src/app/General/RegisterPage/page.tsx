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
  const [cpf, setCpf] = useState('');
  const [userType, setUserType] = useState('Morador');
  const [tipoCondominio, setTipoCondominio] = useState('Apartamento');
  const [condominioId, setCondominioId] = useState('');
  const [condominios, setCondominios] = useState<Array<{ id: number; nomeDoCondominio: string; tipo: string }>>([]);

  // Campos para Apartamento
  const [bloco, setBloco] = useState('');
  const [numeroApartamento, setNumeroApartamento] = useState('');

  // Campos para Casa
  const [rua, setRua] = useState('');
  const [numeroCasa, setNumeroCasa] = useState('');
  const [cep, setCep] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Buscar lista de condomínios ao carregar a página
  React.useEffect(() => {
    const fetchCondominios = async () => {
      try {
        const response = await axios.get('/api/Condominio');

        setCondominios(response.data);
      } catch (error) {
        console.error('Erro ao buscar condomínios:', error);
        if (axios.isAxiosError(error) && error.response?.status === 500) {
          setError('Erro no servidor. Verifique se o banco de dados está configurado corretamente.');
        }
      }
    };
    fetchCondominios();
  }, []);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateCpf = (cpf: string) => cpf.replace(/\D/g, '').length === 11;

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Formato de email inválido. Use @ e .');
      return;
    }

    // CPF é obrigatório apenas para Morador
    if (userType !== 'Porteiro' && !validateCpf(cpf)) {
      setError('CPF deve ter 11 dígitos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Senhas não coincidem.');
      return;
    }
    if (!condominioId) {
      setError('Selecione um condomínio.');
      return;
    }

    // Validação específica para Morador
    if (userType !== 'Porteiro') {
      if (tipoCondominio === 'Apartamento') {
        if (!bloco || !numeroApartamento) {
          setError('Preencha o Bloco e o número do Apartamento.');
          return;
        }
      } else {
        if (!rua || !numeroCasa || !cep) {
          setError('Preencha a Rua, número da Casa e CEP.');
          return;
        }
      }
    }

    // Define o endpoint conforme o tipo de usuário
    const endpoint =
      userType === 'Porteiro'
        ? '/api/Auth/CadastroPorteiro'
        : '/api/Auth/Cadastro';

    // Monta os dados conforme o tipo de usuário
    let requestData: Record<string, string | number | object>;

    if (userType === 'Porteiro') {
      // Dados simplificados para Porteiro
      requestData = {
        nome: name,
        email: email,
        senha: password,
        telefone: phone,
        condominioId: parseInt(condominioId)
      };
    } else {
      // Dados completos para Morador
      requestData = {
        Nome: name,
        Email: email,
        Senha: password,
        Telefone: phone,
        CPF: cpf.replace(/\D/g, ''),
        CondominioId: parseInt(condominioId),
      };

      if (tipoCondominio === 'Apartamento') {
        requestData.DadosApartamento = {
          TipoUnidade: 'Apartamento',
          Bloco: bloco,
          NumeroApartamento: numeroApartamento
        };
      } else {
        requestData.DadosCasa = {
          TipoUnidade: 'Casa',
          Rua: rua,
          NumeroCasa: numeroCasa,
          CEP: cep.replace(/\D/g, '')
        };
      }
    }

    try {
      const response = await axios.post(
        endpoint,
        requestData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        setSuccess(response.data?.Message || 'Cadastro realizado com sucesso!');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhone('');
        setCpf('');
        setBloco('');
        setNumeroApartamento('');
        setRua('');
        setNumeroCasa('');
        setCep('');
        setUserType('Morador');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.Message || error.response?.data?.message || 'Erro no registro. Tente novamente!';
        setError(errorMessage);
        console.error('Erro:', errorMessage);
      } else {
        setError('Erro inesperado. Tente novamente!');
        console.error('Erro inesperado:', error);
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
        <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded">
          {success}
        </div>
      )}

      {/* Container principal*/}
      <div className="w-full max-w-[600px] min-w-[300px] bg-[#ffffff26] rounded-3xl text-white text-center mx-8 sm:mx-10 md:mx-auto m-10">



        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-10 bg-[#084571] rounded-t-3xl min-h-[150px]">
          <div>
            <h1 className="title font-marmelad text-2xl">Criar Nova Conta</h1>
            <h3>Escolha seu tipo de usuário e complete o cadastro</h3>
          </div>
          <Image src={IconLogo} alt="Logo" className="w-[24%] max-w-[120px] min-w-[60px]" />
        </div>

        <ToggleButton onToggle={setUserType} options={['Morador', 'Porteiro']} />

        {/* Select de Condomínio */}
        <div className="px-4 sm:px-10 md:px-20 mt-4">
          <p className="text-left text-lg pl-4 mb-2">Condomínio</p>
          <select
            value={condominioId}
            onChange={(e) => setCondominioId(e.target.value)}
            className="w-full h-10 pl-4 pr-4 bg-[#1E2432] text-white border border-[#606060] rounded-lg focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            style={{ backgroundImage: 'none' }}
          >
            <option value="" className="bg-[#1E2432] text-gray-400">Selecione um condomínio</option>
            {condominios.map((cond) => (
              <option key={cond.id} value={cond.id} className="bg-[#1E2432] text-white">
                {cond.nomeDoCondominio} ({cond.tipo})
              </option>
            ))}
          </select>
        </div>

        {/* Toggle para tipo de condomínio - apenas para Morador */}
        {userType !== 'Porteiro' && (
          <div className="px-4 sm:px-10 md:px-20 mt-4">
            <p className="text-left text-lg pl-4 mb-2">Tipo de Residência</p>
            <ToggleButton onToggle={setTipoCondominio} options={['Apartamento', 'Casa']} />
          </div>
        )}

{/* Campos */}
<div className="
  px-4 
  sm:px-10 
  md:px-20 
  grid 
  grid-cols-1 
  sm:grid-cols-2 
  gap-4
  w-full
">

  {/* ===== CONFIGURAÇÃO SE FOR PORTEIRO ===== */}
  {userType === "Porteiro" ? (
    <>

      {/* Nome ocupa 2 colunas mesmo no desktop, mas no mobile vira 1 */}
      <div className="col-span-1 sm:col-span-2">
        <p className="text-left mt-4 text-lg pl-4">Nome Completo</p>
        <Input
          placeholder="Insira seu nome completo"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-10 pl-4"
        />
      </div>

      {/* Email */}
      <div className="col-span-1">
        <p className="text-left text-lg pl-4">E-mail</p>
        <Input
          placeholder="Insira aqui seu e-mail"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-10 pl-4"
        />
      </div>

      {/* Telefone */}
      <div className="col-span-1">
        <p className="text-left text-lg pl-4">Telefone</p>
        <Input
          placeholder="(15) 9999-9999"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full h-10 pl-4"
        />
      </div>

      {/* Senha */}
      <div className="col-span-1">
        <p className="text-left text-lg pl-4">Senha</p>
        <Input
          placeholder="Insira aqui sua senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-10 pl-4"
        />
      </div>

      {/* Confirmar senha */}
      <div className="col-span-1">
        <p className="text-left text-lg pl-4">Confirmar Senha</p>
        <Input
          placeholder="Reescreva sua senha"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full h-10 pl-4"
        />
      </div>

    </>
  ) : (
    <>
      {/* ===== CONFIG PADRÃO (NÃO PORTEIRO) ===== */}

      {/* COLUNA ESQUERDA */}
      <div className="col-span-1">

        <p className="text-left mt-4 text-lg pl-4">Nome Completo</p>
        <Input
          placeholder="Insira seu nome completo"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

        <p className="text-left mt-4 text-lg pl-4">Telefone</p>
        <Input
          placeholder="(15) 9999-9999"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full h-10 pl-4"
        />

        {userType !== 'Porteiro' && tipoCondominio === 'Apartamento' && (
          <>
            <p className="text-left mt-4 text-lg pl-4">Bloco</p>
            <Input
              placeholder="Bloco A, B, C..."
              type="text"
              value={bloco}
              onChange={(e) => setBloco(e.target.value)}
              className="w-full h-10 pl-4"
            />
          </>
        )}
      </div>

      {/* COLUNA DIREITA */}
      <div className="col-span-1">
        <p className="text-left mt-4 text-lg pl-4">E-mail</p>
        <Input
          placeholder="Insira aqui seu e-mail"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-10 pl-4"
        />

        <p className="text-left mt-4 text-lg pl-4">Confirmar Senha</p>
        <Input
          placeholder="Reescreva sua senha"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full h-10 pl-4"
        />

        {userType !== 'Porteiro' && (
          <>
            <p className="text-left mt-4 text-lg pl-4">CPF</p>
            <Input
              placeholder="123.456.789-01"
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="w-full h-10 pl-4"
            />

            {tipoCondominio === 'Apartamento' && (
              <>
                <p className="text-left mt-4 text-lg pl-4">Apartamento</p>
                <Input
                  placeholder="Apt 101"
                  type="text"
                  value={numeroApartamento}
                  onChange={(e) => setNumeroApartamento(e.target.value)}
                  className="w-full h-10 pl-4"
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Rua (2 colunas) */}
      {userType !== 'Porteiro' && tipoCondominio !== 'Apartamento' && (
        <div className="col-span-1 sm:col-span-2">
          <p className="text-left text-lg pl-4">Rua</p>
          <Input
            placeholder="Ex: Rua das Flores"
            type="text"
            value={rua}
            onChange={(e) => setRua(e.target.value)}
            className="w-full h-10 pl-4"
          />
        </div>
      )}

      {/* Número / CEP */}
      {userType !== 'Porteiro' && tipoCondominio !== 'Apartamento' && (
        <>
          <div className="col-span-1">
            <p className="text-left text-lg pl-4">Número da Casa</p>
            <Input
              placeholder="Ex: 123"
              type="text"
              value={numeroCasa}
              onChange={(e) => setNumeroCasa(e.target.value)}
              className="w-full h-10 pl-4"
            />
          </div>

          <div className="col-span-1">
            <p className="text-left text-lg pl-4">CEP</p>
            <Input
              placeholder="12345-678"
              type="text"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              className="w-full h-10 pl-4"
            />
          </div>
        </>
      )}
    </>
  )}
</div>




        <Button
          nome="Cadastrar "
          estilo="primary"
          clique={handleRegister}
          className='mt-6 mb-3'
        />

        <h2 className="text-gray-400 text-sm mb-3 ">
          Já tem uma conta?
        </h2>
        <a href="/General/LoginPage" className="text-blue-300 block text-sm mt-0 mb-3 hover:underline">
          Faça login aqui!
        </a>
      </div>
      <BackButton className=" font-normal" />
    </div>
  );
};

export default RegisterPage;
