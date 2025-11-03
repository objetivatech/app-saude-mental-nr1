# Documentação Operacional - Saúde Corporativa MVP

**Versão:** 1.0  
**Data:** Novembro de 2025  
**Autor:** Manus AI

---

## Introdução

Este documento descreve os **fluxos operacionais** do sistema Saúde Corporativa, detalhando como cada tipo de usuário interage com a plataforma. O objetivo é fornecer um guia prático para utilização do sistema, garantindo que todos os perfis compreendam suas funcionalidades e responsabilidades.

---

## Perfis de Usuário

O sistema possui **quatro perfis distintos** de acesso, cada um com funcionalidades específicas:

| Perfil | Descrição | Objetivo Principal |
|--------|-----------|-------------------|
| **Empresa** | Representante da organização (RH, Gestão) | Monitorar bem-estar dos colaboradores e gerenciar equipe |
| **Funcionário** | Colaborador da empresa | Registrar estado de bem-estar através de questionários |
| **Profissional da Saúde** | Psicólogo, psiquiatra, terapeuta | Oferecer suporte especializado aos colaboradores |
| **Administrador** | Gestor da plataforma | Aprovar cadastros e gerenciar conteúdos educativos |

---

## Fluxo 1: Cadastro e Acesso - Empresa

### 1.1 Primeiro Acesso

O representante da empresa acessa a plataforma pela primeira vez seguindo estes passos:

**Passo 1: Acessar a Página Inicial**
- Navegar até a URL da plataforma
- Visualizar a página inicial com apresentação do sistema
- Identificar o card "Empresa" entre as opções de perfil

**Passo 2: Realizar Login**
- Clicar no botão "Acessar como Empresa"
- Ser redirecionado para o portal de autenticação Manus OAuth
- Realizar login com credenciais (e-mail, Google, etc.)
- Ser redirecionado de volta para a plataforma após autenticação

**Passo 3: Selecionar Tipo de Perfil**
- Na tela de seleção de perfil, escolher "Empresa"
- Ser redirecionado para o formulário de cadastro

**Passo 4: Preencher Dados da Empresa**
- Informar os seguintes dados obrigatórios:
  - Nome da Empresa
  - CNPJ (formato: 00.000.000/0000-00)
  - E-mail de Contato
- Informar dados opcionais:
  - Telefone de Contato
- Clicar em "Cadastrar Empresa"

**Passo 5: Aguardar Aprovação**
- Receber mensagem de confirmação de cadastro
- Aguardar análise e aprovação pelo administrador da plataforma
- Durante este período, o dashboard exibirá badge "Aguardando Aprovação"

### 1.2 Uso do Dashboard da Empresa

Após aprovação do cadastro, a empresa tem acesso ao dashboard com as seguintes funcionalidades:

#### Visualização de Estatísticas Gerais

O dashboard apresenta **quatro cards principais** com métricas consolidadas:

1. **Total de Funcionários**: Número de colaboradores cadastrados na plataforma
2. **Respostas Coletadas**: Quantidade total de questionários respondidos
3. **Humor Médio**: Média geral do nível de humor dos funcionários (escala 1-5)
4. **Nível de Estresse**: Média geral do nível de estresse (escala 1-5)

#### Indicadores de Bem-Estar

Um painel dedicado exibe as **médias detalhadas** de todos os indicadores:

- **Humor**: Média do estado emocional geral
- **Estresse**: Média do nível de tensão percebida
- **Cansaço**: Média do nível de fadiga
- **Satisfação**: Média da satisfação com o trabalho

Cada indicador possui **código de cores**:
- **Verde**: Valores saudáveis (4-5 para humor/satisfação, 1-2 para estresse/cansaço)
- **Amarelo**: Valores de atenção (3 para todos os indicadores)
- **Vermelho**: Valores críticos (1-2 para humor/satisfação, 4-5 para estresse/cansaço)

#### Respostas Recentes

Lista das **últimas 5 respostas** de questionários, mostrando:
- Nome do funcionário
- Data da resposta
- Nível de humor registrado

#### Lista de Funcionários

Visualização completa de todos os colaboradores cadastrados, incluindo:
- Nome completo
- E-mail corporativo
- Departamento
- Cargo

### 1.3 Cadastro de Funcionários

A empresa pode cadastrar funcionários de duas formas:

**Opção 1: Funcionário se Autocadastra**
- Fornecer ao funcionário o **ID da empresa** (visível no dashboard)
- Funcionário acessa a plataforma e realiza cadastro informando o ID

**Opção 2: Cadastro Manual (Futura Implementação)**
- Acessar seção "Funcionários" no dashboard
- Clicar em "Adicionar Funcionário"
- Preencher dados e enviar convite por e-mail

---

## Fluxo 2: Cadastro e Uso - Funcionário

### 2.1 Cadastro Inicial

O funcionário realiza seu cadastro seguindo os passos abaixo:

**Passo 1: Obter ID da Empresa**
- Solicitar ao departamento de RH o **ID da empresa** na plataforma
- Este ID é necessário para vincular o cadastro à empresa correta

**Passo 2: Acessar a Plataforma**
- Navegar até a página inicial
- Clicar em "Acessar como Funcionário"
- Realizar login via Manus OAuth

**Passo 3: Selecionar Perfil de Funcionário**
- Na tela de seleção, escolher "Funcionário"
- Ser redirecionado para o formulário de cadastro

**Passo 4: Preencher Dados Pessoais**
- Informar dados obrigatórios:
  - ID da Empresa (fornecido pelo RH)
  - Nome Completo
  - E-mail Corporativo
- Informar dados opcionais:
  - Departamento
  - Cargo
- Clicar em "Completar Cadastro"

**Passo 5: Acessar Dashboard**
- Ser redirecionado automaticamente para o dashboard do funcionário
- Começar a utilizar o sistema imediatamente

### 2.2 Responder Questionário Semanal

O principal objetivo do funcionário é **registrar seu estado de bem-estar** através de questionários periódicos.

#### Estrutura do Questionário

O questionário avalia **quatro dimensões** da saúde mental:

1. **Nível de Humor**
   - Pergunta: "Como você está se sentindo emocionalmente?"
   - Escala: 1 (Muito Baixo) a 5 (Muito Alto)
   - Indicador de estado emocional geral

2. **Nível de Estresse**
   - Pergunta: "Quanto estresse você está sentindo?"
   - Escala: 1 (Muito Baixo) a 5 (Muito Alto)
   - Indicador de tensão e pressão percebida

3. **Nível de Cansaço**
   - Pergunta: "Qual seu nível de fadiga?"
   - Escala: 1 (Muito Baixo) a 5 (Muito Alto)
   - Indicador de esgotamento físico e mental

4. **Satisfação com o Trabalho**
   - Pergunta: "Quão satisfeito você está com seu trabalho?"
   - Escala: 1 (Muito Baixo) a 5 (Muito Alto)
   - Indicador de contentamento profissional

5. **Observações (Opcional)**
   - Campo de texto livre para comentários adicionais
   - Permite ao funcionário compartilhar contexto ou preocupações específicas

#### Processo de Preenchimento

**Passo 1: Acessar o Questionário**
- Fazer login na plataforma
- No dashboard, localizar o card "Questionário Semanal"

**Passo 2: Ajustar os Níveis**
- Utilizar os **sliders** para definir cada nível (1 a 5)
- Observar a mudança de cor conforme o valor:
  - Verde: Valores saudáveis
  - Amarelo: Valores de atenção
  - Vermelho: Valores críticos

**Passo 3: Adicionar Observações (Opcional)**
- No campo de texto, descrever situações ou sentimentos relevantes
- Exemplo: "Semana muito produtiva, mas com prazos apertados"

**Passo 4: Enviar Questionário**
- Clicar em "Enviar Questionário"
- Aguardar confirmação de envio bem-sucedido
- Formulário é resetado para próxima resposta

#### Frequência Recomendada

- **Semanal**: Responder o questionário uma vez por semana
- **Mesmo dia**: Escolher um dia fixo (ex: toda sexta-feira)
- **Consistência**: Manter regularidade para análise de tendências

### 2.3 Visualizar Histórico Pessoal

O funcionário pode acompanhar sua evolução através do **histórico de respostas**.

#### Informações Disponíveis

Para cada resposta anterior, o sistema exibe:
- Data da resposta
- Valores de todos os quatro indicadores
- Observações registradas
- Código de cores para interpretação rápida

#### Análise de Tendências

O funcionário pode:
- Identificar padrões ao longo do tempo
- Reconhecer períodos de maior estresse
- Avaliar eficácia de mudanças implementadas
- Preparar-se para conversas com gestores ou profissionais

---

## Fluxo 3: Cadastro e Listagem - Profissional da Saúde

### 3.1 Cadastro de Profissional

Profissionais da área de saúde mental podem se cadastrar para serem listados na plataforma.

**Passo 1: Acessar a Plataforma**
- Navegar até a página inicial
- Clicar em "Cadastrar-se" no card de Profissional
- Realizar login via Manus OAuth

**Passo 2: Selecionar Perfil de Profissional**
- Na tela de seleção, escolher "Profissional"
- Ser redirecionado para o formulário de cadastro

**Passo 3: Preencher Dados Profissionais**
- Informar dados obrigatórios:
  - Nome Completo
  - Especialidade (ex: Psicologia, Psiquiatria, Terapia Ocupacional)
  - Número de Registro Profissional (ex: CRP 00/00000)
  - E-mail de Contato
- Informar dados opcionais:
  - Telefone de Contato
  - Biografia/Apresentação (descrição da experiência e abordagem)

**Passo 4: Enviar Cadastro**
- Clicar em "Enviar Cadastro"
- Receber confirmação de cadastro
- Aguardar aprovação pelo administrador

**Passo 5: Aprovação**
- Administrador analisa credenciais e registro profissional
- Após aprovação, profissional é listado publicamente na plataforma

### 3.2 Listagem Pública

Após aprovação, o profissional aparece na **página de Profissionais da Saúde Mental**, acessível por:
- Funcionários buscando suporte
- Empresas querendo contratar serviços
- Visitantes da plataforma

#### Informações Exibidas

Cada card de profissional mostra:
- Nome completo
- Especialidade
- Biografia (se fornecida)
- E-mail de contato (clicável)
- Telefone de contato (se fornecido, clicável)
- Número de registro profissional
- Botão "Entrar em Contato" (abre cliente de e-mail)

---

## Fluxo 4: Gestão Administrativa

### 4.1 Acesso Administrativo

Administradores da plataforma possuem acesso privilegiado para gerenciar o sistema.

**Requisitos de Acesso:**
- Usuário com `role = 'admin'` no banco de dados
- Login realizado com conta de proprietário da plataforma

**Dashboard Administrativo:**
- Acesso via rota `/admin/dashboard`
- Visão consolidada de todas as operações

### 4.2 Aprovação de Empresas

O administrador é responsável por **validar cadastros de empresas** antes de conceder acesso completo.

#### Processo de Aprovação

**Passo 1: Visualizar Empresas Pendentes**
- Acessar seção "Empresas Aguardando Aprovação"
- Revisar lista de empresas com status "Pendente"

**Passo 2: Analisar Dados**
Para cada empresa, verificar:
- Nome da empresa
- CNPJ (validar formato e autenticidade)
- E-mail de contato (verificar domínio corporativo)
- Telefone de contato

**Passo 3: Aprovar ou Rejeitar**
- Clicar em "Aprovar" para liberar acesso
- Sistema atualiza status `approved = true`
- Empresa recebe notificação e pode usar o sistema completamente

#### Critérios de Aprovação

- CNPJ válido e ativo
- Dados de contato verificáveis
- Empresa real e operante
- Sem duplicidade de cadastros

### 4.3 Aprovação de Profissionais da Saúde

Administradores validam **credenciais de profissionais** antes de listá-los publicamente.

#### Processo de Aprovação

**Passo 1: Visualizar Profissionais Pendentes**
- Acessar seção "Profissionais Aguardando Aprovação"
- Revisar lista de profissionais com status "Pendente"

**Passo 2: Validar Credenciais**
Para cada profissional, verificar:
- Nome completo
- Especialidade declarada
- **Número de registro profissional** (CRP, CRM, etc.)
- Dados de contato

**Passo 3: Verificação Externa**
- Consultar registro no conselho profissional correspondente
- Confirmar que o número de registro é válido e ativo
- Verificar se há restrições ou suspensões

**Passo 4: Aprovar ou Rejeitar**
- Clicar em "Aprovar" para incluir na listagem pública
- Sistema atualiza status `approved = true`
- Profissional aparece na página de listagem

#### Critérios de Aprovação

- Registro profissional válido e ativo
- Especialidade condizente com registro
- Dados de contato verificáveis
- Sem histórico de infrações éticas

### 4.4 Gerenciamento de Conteúdos Educativos

Administradores podem criar e gerenciar **materiais educativos** sobre saúde mental.

#### Tipos de Conteúdo Suportados

- **Artigos**: Textos informativos sobre temas de saúde mental
- **Vídeos**: Palestras, tutoriais, depoimentos
- **Podcasts**: Episódios de áudio sobre bem-estar
- **Infográficos**: Visualizações de dados e conceitos
- **Guias**: Manuais práticos e orientações

#### Processo de Criação

**Passo 1: Acessar Gerenciamento de Conteúdos**
- No dashboard administrativo, navegar para "Conteúdos Educativos"
- Clicar em "Criar Novo Conteúdo"

**Passo 2: Preencher Informações**
- Título do conteúdo
- Tipo (selecionar entre as opções)
- Descrição detalhada
- URL do conteúdo (link externo ou arquivo hospedado)
- URL da thumbnail (imagem de capa)

**Passo 3: Definir Status**
- **Rascunho**: Conteúdo salvo mas não visível publicamente
- **Publicado**: Conteúdo visível para todos os usuários

**Passo 4: Salvar e Publicar**
- Clicar em "Criar Conteúdo"
- Conteúdo aparece na listagem de materiais educativos

#### Edição e Remoção

- **Editar**: Atualizar informações de conteúdos existentes
- **Despublicar**: Remover da visualização pública sem deletar
- **Excluir**: Remover permanentemente do sistema

---

## Fluxo 5: Interpretação de Dados e Ações

### 5.1 Análise de Indicadores pela Empresa

A empresa deve **monitorar regularmente** os indicadores de bem-estar e tomar ações preventivas.

#### Níveis de Alerta

| Indicador | Valor Saudável | Atenção | Crítico |
|-----------|---------------|---------|---------|
| Humor | 4-5 | 3 | 1-2 |
| Estresse | 1-2 | 3 | 4-5 |
| Cansaço | 1-2 | 3 | 4-5 |
| Satisfação | 4-5 | 3 | 1-2 |

#### Ações Recomendadas por Nível

**Nível Saudável (Verde)**
- Manter práticas atuais
- Reconhecer e valorizar equipe
- Compartilhar boas práticas

**Nível de Atenção (Amarelo)**
- Investigar possíveis causas
- Realizar conversas individuais com funcionários
- Implementar ações preventivas (pausas, flexibilidade)
- Monitorar evolução nas próximas semanas

**Nível Crítico (Vermelho)**
- **Ação imediata requerida**
- Conversar com funcionários afetados
- Oferecer suporte profissional (psicólogo, terapeuta)
- Revisar carga de trabalho e prazos
- Considerar ajustes organizacionais
- Documentar ações tomadas

### 5.2 Uso de Observações Qualitativas

As **observações textuais** dos funcionários fornecem contexto valioso:

**Análise de Padrões:**
- Identificar temas recorrentes (prazos, conflitos, sobrecarga)
- Reconhecer situações específicas que afetam bem-estar
- Validar percepções quantitativas com relatos qualitativos

**Privacidade e Ética:**
- Observações devem ser tratadas com **confidencialidade**
- Não identificar funcionários publicamente
- Usar informações apenas para melhorias organizacionais

### 5.3 Periodicidade de Análise

**Recomendações de Frequência:**

- **Diária**: Verificar se há novas respostas críticas
- **Semanal**: Analisar tendências da semana
- **Mensal**: Gerar relatórios consolidados
- **Trimestral**: Avaliar eficácia de ações implementadas
- **Anual**: Revisar estratégia geral de saúde mental

---

## Fluxo 6: Conformidade com NR1

### 6.1 Documentação para Auditorias

O sistema facilita a **comprovação de conformidade** com a NR1:

**Evidências Disponíveis:**
- Histórico completo de questionários respondidos
- Estatísticas consolidadas de bem-estar
- Registro de ações tomadas (observações e intervenções)
- Lista de profissionais disponibilizados aos funcionários

**Geração de Relatórios:**
- Exportar dados em formato adequado para auditorias
- Demonstrar monitoramento contínuo de riscos psicossociais
- Comprovar acesso a suporte profissional

### 6.2 Gestão de Riscos Psicossociais

A NR1 exige **identificação e controle de riscos**. O sistema apoia este processo:

**Identificação:**
- Questionários revelam indicadores de risco (estresse alto, humor baixo)
- Tendências ao longo do tempo indicam agravamento ou melhoria

**Avaliação:**
- Estatísticas consolidadas permitem priorização de ações
- Comparação entre departamentos identifica áreas críticas

**Controle:**
- Acesso a profissionais da saúde para intervenção
- Registro de ações tomadas para mitigação
- Monitoramento contínuo para avaliar eficácia

---

## Suporte e Treinamento

### 7.1 Onboarding de Usuários

**Para Empresas:**
- Sessão de apresentação da plataforma
- Demonstração do dashboard e interpretação de dados
- Orientações sobre frequência de análise e ações recomendadas

**Para Funcionários:**
- Comunicação clara sobre objetivo dos questionários
- Garantia de confidencialidade e uso ético dos dados
- Instruções de preenchimento e frequência

**Para Profissionais:**
- Validação de credenciais e processo de aprovação
- Orientações sobre visibilidade e contato com clientes

### 7.2 Materiais de Apoio

- **Guia Rápido**: PDF com instruções básicas para cada perfil
- **Vídeos Tutoriais**: Demonstrações em vídeo das principais funcionalidades
- **FAQ**: Perguntas frequentes e soluções de problemas comuns
- **Suporte Técnico**: Canal de contato para dúvidas e problemas

---

## Conclusão

O sistema **Saúde Corporativa** oferece uma solução completa para monitoramento e promoção da saúde mental no ambiente de trabalho, alinhada às exigências da **NR1**. Através de fluxos claros e intuitivos, cada perfil de usuário contribui para a criação de um ambiente corporativo mais saudável e produtivo.

A utilização consistente da plataforma, aliada à análise criteriosa dos dados e ações preventivas, permite que empresas cumpram suas obrigações regulatórias enquanto demonstram genuíno cuidado com o bem-estar de seus colaboradores.

---

**Documentação gerada por:** Manus AI  
**Última atualização:** Novembro de 2025
