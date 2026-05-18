"use client";

import React from "react";
import Button from "@/components/Button";
import { VscArrowCircleRight } from "react-icons/vsc";
import Logo from "@/assets/logo_portsafe.png";
import IconMorador from "@/assets/icons/icon_morador.png";
import IconPorteiro from "@/assets/icons/icon_portaria.png";
import IconEntregador from "@/assets/icons/icon_entregador.png";
import Image from "next/image";

import { useRouter } from "next/navigation";

const SelectProfilePage: React.FC = () => {
    const router = useRouter();

    const handleRedirect = (path: string) => {
        router.push(path);
    };


    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-r from-[#002236] via-black to-[#002134] text-white relative px-4">
            {/* Logo e título */}
            <div className="flex flex-col items-center text-center mb-8 sm:mb-20">
                <Image
                    src={Logo.src}
                    alt="Logo PortSafe"
                    width={160}
                    height={160}
                    className="w-32 sm:w-40 mb-4"
                />
                <p className="text-white text-sm sm:text-base">
                    Sistema de Entregas do Condomínio
                </p>
            </div>

            {/* Título principal */}
            <h1 className="title font-marmelad text-xl sm:text-2xl lg:text-3xl mb-6 sm:mb-10 text-center font-semibold">
                Bem-vindo! Selecione seu perfil:
            </h1>

            {/* Cards de seleção */}
            <div className="flex flex-col md:flex-row gap-4 sm:gap-8 justify-center items-center w-full max-w-4xl sm:max-w-5xl">
                {/* Card Portaria */}
                <div className="bg-[#ffffff18] w-full max-w-xs sm:max-w-sm rounded-2xl p-4 sm:p-6 text-center shadow-lg border border-[#ffffff] hover:scale-105 transition-transform duration-300">
                    <Image
                        src={IconPorteiro.src}
                        alt="Icon Porteiro"
                        width={64}
                        height={64}
                        className="w-12 sm:w-16 mx-auto mb-4"
                    />
                    <h3 className="text-xl sm:text-2xl font-semibold text-white">Portaria</h3>
                    <p className="font-thin text-sm sm:text-base text-white/80 mt-2 mb-5">
                        Acesse o painel de controle da portaria
                    </p>
                    <Button
                        nome="Login com usuário e senha"
                        estilo="portaria"
                        className="text-xs !font-thin !w-full mb-4 !bg-gradient-to-r !from-green-400/20 !to-green-500/20"
                    />
                    <Button
                        nome="Acessar"
                        estilo="portaria"
                        clique={() => handleRedirect("/General/LoginPage")}
                        className="!w-full"
                        icon={<VscArrowCircleRight className="text-xl sm:text-2xl" />}
                    />
                </div>

                {/* Card Morador */}
                <div className="bg-[#ffffff18] w-full max-w-xs sm:max-w-sm rounded-2xl p-4 sm:p-6 text-center shadow-lg border border-[#ffffff] hover:scale-105 transition-transform duration-300">
                    <Image
                        src={IconMorador.src}
                        alt="Icon Morador"
                        width={64}
                        height={64}
                        className="w-12 sm:w-16 mx-auto mb-4"
                    />
                    <h3 className="text-xl sm:text-2xl font-semibold text-white">Moradores</h3>
                    <p className="font-thin text-sm sm:text-base text-white/80 mt-2 mb-5">
                        Retire sua encomenda com código ou QR Code
                    </p>
                    <Button
                        nome="Login com usuário e senha"
                        estilo="primary"
                        className="text-xs !font-thin !w-full mb-4 !bg-gradient-to-r !from-blue-400/20 !to-blue-500/20"
                    />
                    <Button
                        nome="Acessar"
                        estilo="primary"
                        clique={() => handleRedirect("/General/LoginPage")}
                        className="!w-full"
                        icon={<VscArrowCircleRight className="text-xl sm:text-2xl" />}
                    />
                </div>

                {/* Card Entregador */}
                <div className="bg-[#ffffff18] w-full max-w-xs sm:max-w-sm rounded-2xl p-4 sm:p-6 text-center shadow-lg border border-[#ffffff] hover:scale-105 transition-transform duration-300">
                    <Image
                        src={IconEntregador.src}
                        alt="Icon Entregador"
                        width={64}
                        height={64}
                        className="w-12 sm:w-16 mx-auto mb-4"
                    />
                    <h3 className="text-xl sm:text-2xl font-semibold text-white">Entregador</h3>
                    <p className="font-thin text-sm sm:text-base text-white/80 mt-2 mb-5">
                        Registre uma nova entrega no sistema
                    </p>
                    <Button
                        nome="Processo rápido e simplificado"
                        estilo="entregador"
                        className="text-xs !font-thin !w-full mb-4 !bg-gradient-to-r !from-orange-400/20 !to-orange-500/20"
                    />
                    <Button
                        nome="Acessar"
                        estilo="entregador"
                        clique={() => handleRedirect("/DeliveryPeople/RegisterDeliveryPage")}
                        className="!w-full"
                        icon={<VscArrowCircleRight className="text-xl sm:text-2xl" />}
                    />
                </div>

            </div>
        </div>
    );
};

export default SelectProfilePage;