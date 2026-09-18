/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Employee } from "../types";

export type HearingGroupType = "Grupo 1" | "Grupo 2" | "Grupo 3" | "Grupo 4" | "Grupo 5";

export interface GroupDefinition {
  id: HearingGroupType;
  nome: string;
  descricaoCurta: string;
  corHex: string;
}

export const HEARING_GROUPS: Record<HearingGroupType, GroupDefinition> = {
  "Grupo 1": {
    id: "Grupo 1",
    nome: "Grupo 1 - Audiometrias Normais",
    descricaoCurta: "Limiares auditivos dentro dos padrões de normalidade (LNA).",
    corHex: "#10b981", // Emerald
  },
  "Grupo 2": {
    id: "Grupo 2",
    nome: "Grupo 2 - Não sugestivo de perda auditiva por NPSE",
    descricaoCurta: "Perdas condutivas, mistas ou sensorioneurais não ocupacionais.",
    corHex: "#3b82f6", // Blue
  },
  "Grupo 3": {
    id: "Grupo 3",
    nome: "Grupo 3 - Sugestivo de perda auditiva por NPSE",
    descricaoCurta: "Traçado entalhado sugestivo de perda induzida por ruído (PAIR / PAINSPSE).",
    corHex: "#f59e0b", // Amber
  },
  "Grupo 4": {
    id: "Grupo 4",
    nome: "Grupo 4 - Mudança Temporária de Limiares",
    descricaoCurta: "Exames com MTL, reteste preventivo ou instabilidade recente.",
    corHex: "#8b5cf6", // Violet
  },
  "Grupo 5": {
    id: "Grupo 5",
    nome: "Grupo 5 - Audiometrias Normais com Entalhe",
    descricaoCurta: "Limiares normais porém com entalhe acústico precoce (3, 4 ou 6 kHz).",
    corHex: "#06b6d4", // Cyan
  },
};

/**
 * Classifies an employee into one of the 5 Fundacentro / NR-7 SPPA groups:
 * Grupo 1: Audiometrias Normais
 * Grupo 2: Não sugestivo de perda auditiva por NPSE
 * Grupo 3: Sugestivo de perda auditiva por NPSE (PAINSPSE / PAIR)
 * Grupo 4: Mudança Temporária de Limiares (MTL) / Reteste
 * Grupo 5: Audiometrias Normais com Entalhe
 */
export function classifyHearingGroup(emp: Employee): HearingGroupType {
  const p = (emp.parecerAudiologico || "").toLowerCase();
  const od = (emp.parecerOrelhaDireita || "").toLowerCase();
  const oe = (emp.parecerOrelhaEsquerda || "").toLowerCase();
  const anexo = (emp.avaliacaoAnexoII || "").toLowerCase();
  const obs = (emp.observacao || "").toLowerCase();
  const retest = (emp.reteste || "").toLowerCase();
  const curvaOD = (emp.curvaOD || "").toLowerCase();
  const curvaOE = (emp.curvaOE || "").toLowerCase();

  // 1. Grupo 4: Mudança Temporária de Limiares (MTL) / Reteste
  const isMTL =
    obs.includes("mudança temporária") ||
    obs.includes("mudanca temporaria") ||
    obs.includes("mtl") ||
    retest.includes("reteste 15 dias") ||
    retest.includes("diferença de limiares") ||
    retest.includes("diferenca de limiares") ||
    (obs.includes("temporária") && obs.includes("limiar"));

  if (isMTL) {
    return "Grupo 4";
  }

  // 2. Grupo 5: Audiometrias Normais com Entalhe
  const isGrupo5 =
    anexo.includes("entalhe") ||
    p.includes("entalhe") ||
    od.includes("entalhe") ||
    oe.includes("entalhe") ||
    curvaOD.includes("entalhe") ||
    curvaOE.includes("entalhe") ||
    obs.includes("normal com entalhe") ||
    obs.includes("normais com entalhe") ||
    obs.includes("entalhe acústico") ||
    obs.includes("entalhe acustico");

  if (isGrupo5) {
    return "Grupo 5";
  }

  // 3. Grupo 3: Sugestivo de perda auditiva por NPSE (PAIR / PAINSPSE)
  const isPAIR =
    anexo.includes("painspse") ||
    anexo.includes("sugestivo de") ||
    p.includes("painspse") ||
    p.includes("pair") ||
    od.includes("pair") ||
    od.includes("painspse") ||
    oe.includes("pair") ||
    oe.includes("painspse") ||
    obs.includes("sugestivo de pair") ||
    obs.includes("sugestiva de pair") ||
    obs.includes("sugestivo de painspse") ||
    obs.includes("induzida por ruído") ||
    obs.includes("induzida por ruido") ||
    obs.includes("npse");

  if (isPAIR) {
    return "Grupo 3";
  }

  // 4. Grupo 1: Audiometrias Normais
  const isODNorm = !od || od.includes("lna") || od.includes("normais") || od.includes("normal") || od === "nl";
  const isOENorm = !oe || oe.includes("lna") || oe.includes("normais") || oe.includes("normal") || oe === "nl";
  const isPNorm = !p || p.includes("lna") || p.includes("normais") || p.includes("normal") || p.includes("preventivo");

  if (isODNorm && isOENorm && isPNorm && !obs.includes("perda") && !obs.includes("rebaixamento") && !obs.includes("altera")) {
    return "Grupo 1";
  }

  // 5. Grupo 2: Não sugestivo de perda auditiva por NPSE
  return "Grupo 2";
}

/**
 * Evaluates associated alterations/comorbidities for hearing loss analysis (Request 14).
 */
export function getAssociatedRiskFactors(employees: Employee[]) {
  const factors = {
    zumbido: 0,
    foneDeOuvido: 0,
    excessoCerumen: 0,
    doencasSistemicas: 0,
    semFatoresAssociados: 0,
  };

  employees.forEach((emp) => {
    const group = classifyHearingGroup(emp);
    // Focus on employees with hearing alterations (Grupos 2, 3, 4)
    if (group === "Grupo 1") return;

    const obs = (emp.observacao || "").toLowerCase();
    let hasFactor = false;

    // 1. Zumbido (Tinnitus)
    if (emp.zumbido || obs.includes("zumbido") || obs.includes("acúfeno") || obs.includes("acufeno")) {
      factors.zumbido += 1;
      hasFactor = true;
    }

    // 2. Fone de ouvido
    if (emp.usoFoneOuvido || obs.includes("fone") || obs.includes("headphone") || obs.includes("intra-auricular")) {
      factors.foneDeOuvido += 1;
      hasFactor = true;
    }

    // 3. Excesso de cerúmen
    if (emp.remocaoCerumen || emp.excessoCerumen || obs.includes("cerúmen") || obs.includes("cerumen") || obs.includes("rolha")) {
      factors.excessoCerumen += 1;
      hasFactor = true;
    }

    // 4. Doenças metabólicas/sistêmicas (Diabetes, anemia, hipertensão, etc.)
    const comorb = (emp.comorbidade || "").toLowerCase();
    if (
      comorb.includes("diabete") ||
      comorb.includes("anemia") ||
      comorb.includes("hipertens") ||
      obs.includes("diabete") ||
      obs.includes("anemia") ||
      obs.includes("hipertens") ||
      obs.includes("glicemia") ||
      obs.includes("pressão alta") ||
      obs.includes("pressao alta")
    ) {
      factors.doencasSistemicas += 1;
      hasFactor = true;
    }

    if (!hasFactor) {
      factors.semFatoresAssociados += 1;
    }
  });

  return factors;
}
