/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Company {
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  telefone: string;
  cnae: string;
  grauRisco: string;
  logo: string; // Base64 or icon name preset
}

export interface Responsible {
  nome: string;
  funcao: string;
  conselho: string;
  setor: string;
  instituicao: string;
}

export interface EPI {
  id: string;
  descricao: string;
  marca: string;
  tamanho: string; // P, M, G, Único
  ca: string;
  validadeCa: string;
  nrrsf: number; // NRRsf dB rating
}

export interface GHE {
  id: string;
  gesNumero: string; // GES Nº
  avaliacaoRiscos: string; // Avaliação de Riscos por GES
  intensidadeConcentracao: number; // Nível de Ruído por GES in dB(A)
  funcaoGes: string; // Função por GES
  necessarioEpi: boolean; // Necessário EPI?
  epi1Id: string; // EPI (1º Opção) ID
  ca1: string; // CA (1º Opção)
  nrrsf1: number; // NRRsf do EPI (1º Opção)
  atenuacao1: number; // Atenuação/Fator de Proteção (1º Opção)
  eficaz1: boolean; // Eficaz (1º Opção)
  epi2Id: string; // EPI (2º Opção) ID
  ca2: string; // CA (2º Opção)
  nrrsf2: number; // NRRsf do EPI (2º Opção)
  atenuacao2: number; // Atenuação/Fator de Proteção (2º Opção)
  eficaz2: boolean; // Eficaz (2º Opção)
  medidasControlesAdicionais: string; // medidas de controles adicionais
}

export interface Employee {
  id: string;
  cracha: string;
  nome: string;
  idade: number; // Idade
  admissao: string; // Date string (YYYY-MM-DD)
  nasc: string; // Date string (YYYY-MM-DD)
  cpf: string;
  local: string; // Setor / Local
  cargo: string;
  escala: string;
  
  // GES & noise fields
  gheId: string; // GHE ID (GHE correspondente)
  localGes: string; // Local GES
  funcaoGes: string; // Função por GES
  npsDb: number; // NPS dB (A)

  // EPI fields
  protetorVigenteId: string; // Protetor Vigente ID
  epi: string; // Protetor (EPI nome/modelo)
  nrrsf: number; // NRRsf
  validadeCa: string; // Validade CA
  dataEntrega: string; // Date string (YYYY-MM-DD) (keep for compatibility)
  dataEntregaProtetor: string; // Data Entrega Protetor
  validade: string; // Date string (YYYY-MM-DD) (keep for compatibility)
  validadeProtetor: string; // Validade Protetor

  // Clinical & Audiometry fields
  dataExameReferencia: string; // Data Exame Referência
  tipoExameReferencia: string; // Tipo do Exame Referência
  dataExame: string; // Data do exame audiométrico (keep for compatibility, set to current exam)
  dataExameAtual: string; // Data Exame Atual
  tipoExameAtual: string; // Tipo do Exame Atual
  parecerAudiologico: string; // Parecer Audiológico (keep for compatibility)
  parecerOrelhaDireita: string; // Parecer Audiológico Orelha Direita
  parecerOrelhaEsquerda: string; // Parecer Audiológico Orelha Esquerda
  avaliacaoAnexoII: string; // Avaliação Anexo II NR7
  evolucaoOrelhaDireita?: string; // Evolução Orelha Direita
  evolucaoOrelhaEsquerda?: string; // Evolução Orelha Esquerda
  tipoAlteracaoOD?: string; // "Condutiva", "Mista", "Sensorioneural", "Normal", "Anacusia"
  tipoAlteracaoOE?: string; // "Condutiva", "Mista", "Sensorioneural", "Normal", "Anacusia"
  frequenciasNormalOD?: string[]; // ["250Hz", "6kHz", "8kHz"]
  frequenciasNormalOE?: string[]; // ["250Hz", "6kHz", "8kHz"]
  curvaOD?: string; // "Ascendente", "Descendente", "Horizontal", "Entalhe"
  curvaOE?: string; // "Ascendente", "Descendente", "Horizontal", "Entalhe"
  remocaoCerumen?: boolean; // Indicação de Remoção de Cerúmen
  observacao: string; // Observação
  reteste: string; // Reteste (com tabela auxiliar/tipos)
  dataPrevistaRetorno: string; // Data prevista retorno (Normalmente 365 dias)
  statusAudiometrico: string; // Status (ESTÁVEL OU INSTÁVEL)
  situacao: string; // Situação (TRABALHANDO, APOSENTADO, FÉRIAS, INATIVO, etc.)
  situacaoTrabalhador: string; // Situação Trabalhador (keep for compatibility)

  // Auditoria fields
  auditoria: string; // Auditoria (Realizada, Pendente, Não se aplica)
  auditoriaData: string; // Data da Auditoria
  situacaoAuditoria: string; // Situação Auditoria (keep for compatibility)
  auditoriaSituacao: string; // Situação (Conforme, Não Conforme)
  inadequacaoAuditoria: string; // Inadequação Auditoria (keep for compatibility)
  auditoriaInadequacao: string; // Inadequação
  auditoriaVencimento: string; // Auditoria Vencimento

  // Treinamento fields
  dataTreinamento: string; // Data Treinamento
  dataRetreinamento: string; // Data Retreinamento
  horarioTreinamento: string; // Horário
  localTreinamento: string; // LOCAL
}

// Dropdown Helper Lists
export const PARECER_AUDIOLOGICO_OPTIONS = [
  "Limiares Auditivos Normais (LNA)",
  "PAIR (Perda Auditiva Induzida por Ruído)",
  "Perda Auditiva Sensorioneural Não-Ocupacional",
  "Perda Auditiva Condutiva",
  "Perda Auditiva Mista",
  "Acompanhamento Preventivo"
];

export const AVALIACAO_ANEXO_II_OPTIONS = [
  "Estável",
  "Desencadeamento",
  "Agravamento",
  "Não aplicável (Primeiro Exame / Admissional)"
];

export const STATUS_OPTIONS = [
  "Estável",
  "Instável"
];

export const SITUACAO_TRABALHADOR_OPTIONS = [
  "Trabalhando",
  "Aposentado",
  "Férias",
  "Inativo",
  "Afastado",
  "Licença Médica",
  "Demitido"
];

export const TIPO_EXAME_OPTIONS = [
  "Admissional",
  "Periódico",
  "Demissional",
  "Retorno ao Trabalho",
  "Mudança de Função",
  "Especial"
];

// Auxiliary Retest options with mapping table
export interface RetestType {
  value: string;
  label: string;
  description: string;
  color: string;
}

export const RETESTE_AUXILIARY_TABLE: RetestType[] = [
  {
    value: "Não necessário",
    label: "Não necessário",
    description: "Sem alterações significativas em relação ao exame de referência.",
    color: "slate"
  },
  {
    value: "Reteste 15 dias (Diferença de limiares)",
    label: "Reteste 15 dias (Diferença)",
    description: "Diferença em relação ao exame de referência; agendar novo exame em 15 dias de repouso acústico.",
    color: "amber"
  },
  {
    value: "Reteste Confirmatório",
    label: "Reteste Confirmatório",
    description: "Indicado para confirmar suspeita clínica de desencadeamento ou agravamento de perda auditiva.",
    color: "red"
  },
  {
    value: "Agendado",
    label: "Agendado",
    description: "Exame complementar de reteste agendado para os próximos dias.",
    color: "blue"
  },
  {
    value: "Realizado e Confirmado Estável",
    label: "Realizado e Confirmado Estável",
    description: "Reteste executado, confirmando estabilidade dos limiares auditivos.",
    color: "emerald"
  },
  {
    value: "Realizado e Confirmado Alterado",
    label: "Realizado e Confirmado Alterado",
    description: "Reteste executado, constatando agravo de limiares clínicos (Anexo II).",
    color: "rose"
  }
];

export const RETESTE_OPTIONS = RETESTE_AUXILIARY_TABLE.map(r => r.value);

export const AUDITORIA_OPTIONS = [
  "Realizada",
  "Pendente",
  "Não se aplica"
];

export const SITUACAO_AUDITORIA_OPTIONS = [
  "Conforme",
  "Não Conforme"
];

export const INADEQUACAO_AUDITORIA_OPTIONS = [
  "Nenhuma",
  "Falta de uso de EPI",
  "EPI vencido",
  "Treinamento de uso vencido",
  "Atenuação insuficiente",
  "Ficha de EPI desatualizada",
  "Outros"
];
