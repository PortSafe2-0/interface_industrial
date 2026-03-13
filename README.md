# 🖥 PortSafe Industrial Interface

Interface industrial do ecossistema **PortSafe 2.0**, desenvolvida como
parte do **Projeto Interdisciplinar (PI3)**.

A interface permite o **monitoramento e gerenciamento dos armários inteligentes**, oferecendo visualização clara das entregas, status dos armários e eventos do sistema em tempo real para operadores e administradores.

------------------------------------------------------------------------

# 🚀 Sobre o Projeto

O **PortSafe 2.0** é uma plataforma inteligente para gestão de entregas
em condomínios que integra:

- 📱 Aplicativo Mobile
- 🤖 Armários inteligentes (IoT)
- ☁️ Infraestrutura em nuvem (AWS)
- 📡 Comunicação em tempo real via MQTT
- 🖥 Interface industrial de monitoramento

A interface industrial permite que administradores e operadores visualizem o funcionamento do sistema e acompanhem o fluxo de entregas de forma centralizada.

------------------------------------------------------------------------

# 🎯 Objetivo do Módulo de Interfaces

A interface tem como objetivo permitir que:

### 🏢 Administradores

- Visualizem **status dos armários**
- Monitorem **entregas registradas**
- Consultem **histórico de movimentações**
- Identifiquem **eventos ou falhas no sistema**
- Acompanhem **uso dos armários em tempo real**

### 🛠 Operadores

- Acompanhem o **fluxo de entregas**
- Verifiquem **armários disponíveis**
- Visualizem **alertas do sistema**
- Monitorem **atividade dos dispositivos IoT**

------------------------------------------------------------------------

# 🧠 Arquitetura do Sistema

A interface faz parte de uma arquitetura distribuída baseada em **IoT + Cloud + Interfaces Industriais**.

Sensores / Armário IoT  
↓  
MQTT Broker  
↓  
Backend API  
↓  
Cloud (AWS)  
↓  
Interface Industrial  
↓  
Operador / Administrador

------------------------------------------------------------------------

# 🏗 Tecnologias Utilizadas

Tecnologias previstas para o desenvolvimento da interface:

- Next e React
- JavaScript
- Frameworks de interface web
- Consumo de APIs REST
- WebSocket ou MQTT para dados em tempo real
- Bibliotecas de gráficos e dashboards

------------------------------------------------------------------------

# 🔄 Fluxo de Funcionamento

### 📦 Monitoramento de entregas

1. Entrega é registrada pelo entregador no aplicativo  
2. O backend registra a informação no banco de dados  
3. O sistema atualiza o status do armário  
4. A interface industrial exibe a atualização em tempo real  

### 🖥 Monitoramento do sistema

1. Dispositivos IoT enviam dados via **MQTT**  
2. O backend processa os dados recebidos  
3. A interface exibe **status dos armários e eventos do sistema**  
4. Operadores podem acompanhar o funcionamento da plataforma  

------------------------------------------------------------------------

# 📊 Monitoramento e Visualização

A interface permite visualizar informações como:

- 📦 Entregas registradas
- 📊 Uso dos armários
- 🟢 Status dos dispositivos
- ⚠️ Alertas do sistema
- ⏱ Histórico de eventos

------------------------------------------------------------------------

# ☁️ Integração com a Nuvem

A interface se comunica com a infraestrutura em nuvem:

- API Gateway
- Backend
- Banco de dados (PostgreSQL / RDS)
- Serviços de IoT
- Sistemas de monitoramento

------------------------------------------------------------------------

# 🔗 Integração com Outros Módulos

Este repositório faz parte do ecossistema **PortSafe 2.0**, que possui
os seguintes módulos:

Módulo | Função
------ | -----------------------------------------
IoT | Controle dos armários inteligentes
Backend | APIs e lógica de negócio
Cloud | Infraestrutura em nuvem
Mobile | Interface para moradores e entregadores
Dashboard | Monitoramento administrativo

------------------------------------------------------------------------

# 🎓 Projeto Acadêmico

Este projeto foi desenvolvido para a disciplina de **Interfaces Industriais**, integrando o **Projeto Interdisciplinar (PI3)** do curso de tecnologia.

------------------------------------------------------------------------

# 📌 Status do Projeto

🚧 Em desenvolvimento
