/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SPPAMonthAction {
  mes: string;
  mesNumero: number;
  titulo: string;
  descricao: string;
  categoria: "Exames" | "EPI & Engenharia" | "Treinamento" | "Auditoria" | "Gestão";
  status: "Concluído" | "Em Andamento" | "Programado";
  publicoAlvo: string;
  responsavel: string;
}

export const SPPA_MONTHLY_ACTIONS: SPPAMonthAction[] = [
  {
    mes: "Janeiro",
    mesNumero: 1,
    titulo: "Planejamento Anual & Calibração dos Audiômetros",
    descricao: "Revisão das metas anuais do SPPA/PCA, calibração biológica e eletroacústica dos equipamentos de audiometria (Norma ISO 8253-1).",
    categoria: "Gestão",
    status: "Concluído",
    publicoAlvo: "Equipe de Saúde Ocupacional & SESMT",
    responsavel: "Fonoaudiologia / Engenharia de Segurança"
  },
  {
    mes: "Fevereiro",
    mesNumero: 2,
    titulo: "Inspeção e Renovação dos Protetores Auditivos (EPIs)",
    descricao: "Verificação de CA válido, estado de conservação de conchas e fornecimento de novos plugs de silicone para setores com ruído elevado.",
    categoria: "EPI & Engenharia",
    status: "Concluído",
    publicoAlvo: "Usinagem, Estamparia e Soldagem",
    responsavel: "Técnico de Segurança do Trabalho"
  },
  {
    mes: "Março",
    mesNumero: 3,
    titulo: "Campanha do Dia Mundial da Audição & Treinamento",
    descricao: "Sensibilização sobre ruído extra-ocupacional (fones de ouvido, baladas), higiene dos ouvidos e técnica correta de inserção do protetor.",
    categoria: "Treinamento",
    status: "Concluído",
    publicoAlvo: "100% dos colaboradores operacionais",
    responsavel: "Fonoaudiólogo do Trabalho"
  },
  {
    mes: "Abril",
    mesNumero: 4,
    titulo: "Dosimetria e Mapeamento Acústico de Ruído nos GHEs",
    descricao: "Medições de Nível de Pressão Sonora contínuo e intermitente (NHO-01 / NR-15) com dosímetros calibrados por GHE/GES.",
    categoria: "EPI & Engenharia",
    status: "Concluído",
    publicoAlvo: "GHE-1 (Estamparia), GHE-2 (Soldagem), GHE-3 (Almoxarifado)",
    responsavel: "Engenheiro de Segurança do Trabalho"
  },
  {
    mes: "Maio",
    mesNumero: 5,
    titulo: "Audiometrias Periódicas Ocupacionais - Lote 1",
    descricao: "Realização de exames audiométricos admissionais e periódicos dos setores de Soldagem e Usinagem Pesada com 14h de repouso.",
    categoria: "Exames",
    status: "Concluído",
    publicoAlvo: "Colaboradores do Setor de Soldagem e Usinagem",
    responsavel: "Fonoaudióloga Clínica / Perita"
  },
  {
    mes: "Junho",
    mesNumero: 6,
    titulo: "Gestão de MTL e Agendamento de Retestes (15 dias)",
    descricao: "Investigação clínica de Mudança Temporária de Limiar (Grupo 4), notificação médica e agendamento de retestes confirmatórios.",
    categoria: "Exames",
    status: "Em Andamento",
    publicoAlvo: "Casos instáveis detectados no Lote 1",
    responsavel: "Médico do Trabalho & Fonoaudiologia"
  },
  {
    mes: "Julho",
    mesNumero: 7,
    titulo: "Auditoria de Campo: Fit-Test e Atenuação de Protetores",
    descricao: "Vistoria presencial nos postos de trabalho para verificar adesão, tempo real de uso e vedação acústica dos protetores tipo concha/plug.",
    categoria: "Auditoria",
    status: "Em Andamento",
    publicoAlvo: "Operadores de Prensa e Soldadores",
    responsavel: "SESMT & CIPA"
  },
  {
    mes: "Agosto",
    mesNumero: 8,
    titulo: "Audiometrias Periódicas Ocupacionais - Lote 2",
    descricao: "Exames audiométricos periódicos do Setor de Estamparia, Caldeiraria e Almoxarifado, comparando com traçados de referência.",
    categoria: "Exames",
    status: "Programado",
    publicoAlvo: "Colaboradores de Estamparia e Almoxarifado",
    responsavel: "Fonoaudiologia do Trabalho"
  },
  {
    mes: "Setembro",
    mesNumero: 9,
    titulo: "Treinamento Específico para Colaboradores do Grupo 3 (PAIR)",
    descricao: "Oficina individualizada sobre proteção auditiva dupla, sinais precoces de perda zumbido, e comorbidades metabólicas (diabetes/anemia).",
    categoria: "Treinamento",
    status: "Programado",
    publicoAlvo: "Trabalhadores classificados no Grupo 3",
    responsavel: "Médico do Trabalho & Enfermeiro do Trabalho"
  },
  {
    mes: "Outubro",
    mesNumero: 10,
    titulo: "Inspeção de Controles de Engenharia & Enclausuramento",
    descricao: "Manutenção de barreiras acústicas, amortecedores de vibração de bancadas e enclausuramento de compressores de ar.",
    categoria: "EPI & Engenharia",
    status: "Programado",
    publicoAlvo: "Maquinário de Estamparia e Linha de Produção",
    responsavel: "Manutenção Industrial & Engenharia"
  },
  {
    mes: "Novembro",
    mesNumero: 11,
    titulo: "Investigação Fonoaudiológica e Emissão de CAT (se aplicável)",
    descricao: "Análise aprofundada de desencadeamento e agravamento (Anexo II NR-7), exclusão de causas extralaborais e conduta médico-pericial.",
    categoria: "Exames",
    status: "Programado",
    publicoAlvo: "Casos selecionados com perda auditiva comprovada",
    responsavel: "Médico Coordenador do PCMSO"
  },
  {
    mes: "Dezembro",
    mesNumero: 12,
    titulo: "Relatório Anual de Desempenho Epidemiológico do SPPA",
    descricao: "Consolidação dos 4 Grupos, cálculo de taxa de incidência/prevalência de PAIR, apresentação à diretoria e planejamento do próximo ciclo.",
    categoria: "Gestão",
    status: "Programado",
    publicoAlvo: "Diretoria, CIPA e Coordenação de SMS",
    responsavel: "Responsável Técnico pelo SPPA"
  }
];
