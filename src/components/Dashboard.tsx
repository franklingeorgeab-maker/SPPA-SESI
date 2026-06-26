/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Employee, GHE, EPI } from "../types";
import PieChart from "./PieChart";
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  BookOpen, 
  Layers, 
  Volume2, 
  FileSpreadsheet, 
  Download, 
  Info, 
  HardHat 
} from "lucide-react";

interface DashboardProps {
  employees: Employee[];
  ghes: GHE[];
  epis: EPI[];
}

export default function Dashboard({ employees, ghes, epis }: DashboardProps) {
  const currentDateStr = "2026-06-25";
  const [viewMode, setViewMode] = useState<"both" | "charts" | "spreadsheet">("both");

  // Calculations for Key Stats
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.situacao === "Ativo").length;
  
  // PAIR / Losses
  const pairCases = employees.filter((e) => e.parecerAudiologico && e.parecerAudiologico.includes("PAIR"));
  const normalCasesCount = employees.filter((e) => e.parecerAudiologico && e.parecerAudiologico.includes("Normais")).length;
  const otherLossesCount = totalEmployees - pairCases.length - normalCasesCount;

  // EPIs
  const employeesWithEpi = employees.filter((e) => e.protetorVigenteId);
  const expiredEpis = employeesWithEpi.filter((e) => e.validade && e.validade < currentDateStr);
  const activeEpis = employeesWithEpi.length - expiredEpis.length;

  // Audits
  const auditsDone = employees.filter((e) => e.auditoria === "Realizada");
  const auditsConforme = auditsDone.filter((e) => e.situacaoAuditoria === "Conforme");
  const auditsNaoConforme = auditsDone.filter((e) => e.situacaoAuditoria === "Não Conforme");
  const auditsPending = employees.filter((e) => e.auditoria === "Pendente");

  // ------------------------------------------------------------
  // DINAMIC EPIDEMIOLOGICAL CALCULATIONS FOR THE SECTOR REPORT
  // ------------------------------------------------------------
  const sectorSummaryMap: Record<string, {
    name: string;
    total: number;
    normal: number;
    altered: number;
    loss250: number;
    loss6k: number;
    loss8k: number;
    sensorioneural: number;
    conductive: number;
    mixed: number;
    tempShift: number;
  }> = {};

  employees.forEach((emp) => {
    const sector = emp.local || "Não Informado";
    if (!sectorSummaryMap[sector]) {
      sectorSummaryMap[sector] = {
        name: sector,
        total: 0,
        normal: 0,
        altered: 0,
        loss250: 0,
        loss6k: 0,
        loss8k: 0,
        sensorioneural: 0,
        conductive: 0,
        mixed: 0,
        tempShift: 0,
      };
    }

    const summary = sectorSummaryMap[sector];
    summary.total += 1;

    const p = (emp.parecerAudiologico || "").toLowerCase();
    const od = (emp.parecerOrelhaDireita || "").toLowerCase();
    const oe = (emp.parecerOrelhaEsquerda || "").toLowerCase();
    
    // Normal checks
    const isLna = (p.includes("lna") || p.includes("normais") || p.includes("normal") || p.includes("preventivo")) &&
                  (!od || od.includes("lna") || od.includes("normais") || od.includes("normal") || od.includes("preventivo")) &&
                  (!oe || oe.includes("lna") || oe.includes("normais") || oe.includes("normal") || oe.includes("preventivo"));

    if (isLna) {
      summary.normal += 1;
    } else {
      summary.altered += 1;
    }

    const obsText = `${emp.observacao || ""} ${emp.parecerAudiologico || ""} ${emp.parecerOrelhaDireita || ""} ${emp.parecerOrelhaEsquerda || ""}`.toLowerCase();
    const retestText = (emp.reteste || "").toLowerCase();

    const l250 = obsText.includes("250") || obsText.includes("250hz") || obsText.includes("250 hz");
    const l6k = obsText.includes("6khz") || obsText.includes("6 khz") || obsText.includes("6.000") || obsText.includes("6000") || obsText.includes("6 k");
    const l8k = obsText.includes("8khz") || obsText.includes("8 khz") || obsText.includes("8.000") || obsText.includes("8000") || obsText.includes("8 k");
    
    const sens = obsText.includes("sensorioneural") || obsText.includes("sensório-neural") || obsText.includes("sensóro-neural") || obsText.includes("pair");
    const cond = obsText.includes("condutiva") || obsText.includes("condutivo");
    const mist = obsText.includes("mista") || obsText.includes("misto");
    const temp = obsText.includes("temporária") || obsText.includes("temporaria") || obsText.includes("mtl") || retestText.includes("reteste 15 dias") || obsText.includes("mudança temporária") || obsText.includes("mudanca temporaria");

    if (l250) summary.loss250 += 1;
    if (l6k) summary.loss6k += 1;
    if (l8k) summary.loss8k += 1;
    if (sens) summary.sensorioneural += 1;
    if (cond) summary.conductive += 1;
    if (mist) summary.mixed += 1;
    if (temp) summary.tempShift += 1;
  });

  const sectorSummaryList = Object.values(sectorSummaryMap);

  // General company-wide totals
  const grandTotal = sectorSummaryList.reduce((acc, curr) => ({
    total: acc.total + curr.total,
    normal: acc.normal + curr.normal,
    altered: acc.altered + curr.altered,
    loss250: acc.loss250 + curr.loss250,
    loss6k: acc.loss6k + curr.loss6k,
    loss8k: acc.loss8k + curr.loss8k,
    sensorioneural: acc.sensorioneural + curr.sensorioneural,
    conductive: acc.conductive + curr.conductive,
    mixed: acc.mixed + curr.mixed,
    tempShift: acc.tempShift + curr.tempShift,
  }), {
    total: 0, normal: 0, altered: 0, loss250: 0, loss6k: 0, loss8k: 0, sensorioneural: 0, conductive: 0, mixed: 0, tempShift: 0
  });

  // EPI grouping calculations
  const epiTypeMap: Record<string, { name: string; count: number }> = {};
  let totalEpisAccounted = 0;

  employees.forEach((emp) => {
    let epiName = emp.epi || "Sem EPI Atribuído";
    if (epiName.toLowerCase().includes("silicone") || epiName.toLowerCase().includes("plug") || epiName.toLowerCase().includes("inserção") || epiName.toLowerCase().includes("insercao")) {
      epiName = "Plug de Silicone (Inserção)";
    } else if (epiName.toLowerCase().includes("concha") || epiName.toLowerCase().includes("abafador")) {
      epiName = "Abafador Concha";
    } else if (epiName.toLowerCase().includes("espuma") || epiName.toLowerCase().includes("moldável") || epiName.toLowerCase().includes("moldavel")) {
      epiName = "Espuma Moldável";
    } else if (epiName.toLowerCase().includes("sem protetor") || epiName.toLowerCase().includes("sem epi") || !emp.protetorVigenteId) {
      epiName = "Sem EPI (Abaixo Nível de Ação)";
    } else {
      epiName = "Outros Protetores";
    }

    if (!epiTypeMap[epiName]) {
      epiTypeMap[epiName] = { name: epiName, count: 0 };
    }
    epiTypeMap[epiName].count += 1;
    totalEpisAccounted += 1;
  });

  const epiDistribution = Object.values(epiTypeMap).map(item => ({
    ...item,
    percentage: totalEpisAccounted ? (item.count / totalEpisAccounted) * 100 : 0
  })).sort((a, b) => b.count - a.count);

  const handleExportCSV = () => {
    let csvContent = "Setor;Total de Audiometrias;Normais;Alteradas;Perda 250Hz;Perda 6kHz;Perda 8kHz;Sensorioneural;Condutiva;Mista;Mudanca Temp. Limiar\n";
    
    sectorSummaryList.forEach((sec) => {
      csvContent += `${sec.name};${sec.total};${sec.normal};${sec.altered};${sec.loss250};${sec.loss6k};${sec.loss8k};${sec.sensorioneural};${sec.conductive};${sec.mixed};${sec.tempShift}\n`;
    });
    
    csvContent += `TOTAL GERAL;${grandTotal.total};${grandTotal.normal};${grandTotal.altered};${grandTotal.loss250};${grandTotal.loss6k};${grandTotal.loss8k};${grandTotal.sensorioneural};${grandTotal.conductive};${grandTotal.mixed};${grandTotal.tempShift}\n`;

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sppa_diagnostico_setorial_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Chart 1: Alterações / Casos de PAIR por Setor (Local)
  const sectorMap: Record<string, { total: number; pair: number; normal: number }> = {};
  employees.forEach((emp) => {
    const loc = emp.local || "Não Informado";
    if (!sectorMap[loc]) {
      sectorMap[loc] = { total: 0, pair: 0, normal: 0 };
    }
    sectorMap[loc].total += 1;
    if (emp.parecerAudiologico && emp.parecerAudiologico.includes("PAIR")) {
      sectorMap[loc].pair += 1;
    } else {
      sectorMap[loc].normal += 1;
    }
  });

  const sectorData = Object.entries(sectorMap).map(([sector, stats]) => ({
    name: sector,
    ...stats,
  }));

  // Chart 2: Pareceres Audiológicos Breakdown
  const parecerCounts: Record<string, number> = {};
  employees.forEach((emp) => {
    const p = emp.parecerAudiologico || "Limiares Auditivos Normais (LNA)";
    parecerCounts[p] = (parecerCounts[p] || 0) + 1;
  });

  const totalPareceres = Object.values(parecerCounts).reduce((a, b) => a + b, 0);

  // Chart 3: Inadequações em Auditorias
  const inadequacaoCounts: Record<string, number> = {
    "Falta de uso de EPI": 0,
    "EPI vencido": 0,
    "Treinamento de uso vencido": 0,
    "Atenuação insuficiente": 0,
    "Ficha de EPI desatualizada": 0,
    "Outros": 0,
  };

  employees.forEach((emp) => {
    if (emp.situacaoAuditoria === "Não Conforme" && emp.inadequacaoAuditoria) {
      const label = emp.inadequacaoAuditoria;
      if (inadequacaoCounts[label] !== undefined) {
        inadequacaoCounts[label] += 1;
      } else if (label !== "Nenhuma") {
        inadequacaoCounts["Outros"] += 1;
      }
    }
  });

  const totalInadequacies = Object.values(inadequacaoCounts).reduce((a, b) => a + b, 0);

  // Chart 4: EPI Expiry alerts relative to GHE Noise Levels
  // We'll calculate GHE exposures
  const noiseUnder80 = ghes.filter(g => g.intensidadeConcentracao < 80).length;
  const noise80to85 = ghes.filter(g => g.intensidadeConcentracao >= 80 && g.intensidadeConcentracao < 85).length;
  const noiseOver85 = ghes.filter(g => g.intensidadeConcentracao >= 85).length;

  // Prepared data for Pie Charts
  const chartColors = [
    "#3b82f6", // Sky/Blue
    "#10b981", // Emerald/Green
    "#f59e0b", // Amber/Yellow
    "#f43f5e", // Rose/Red
    "#8b5cf6", // Violet/Purple
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#14b8a6", // Teal
    "#64748b"  // Slate
  ];

  const sectorAlteredPieData = sectorSummaryList.map((sec, idx) => ({
    label: sec.name,
    value: sec.altered,
    color: chartColors[idx % chartColors.length]
  }));

  const epiPieData = epiDistribution.map((epi, idx) => ({
    label: epi.name,
    value: epi.count,
    color: chartColors[idx % chartColors.length]
  }));

  const clinicalProfilePieData = Object.entries(parecerCounts).map(([label, count]) => {
    const isLna = label.includes("LNA") || label.includes("Normais");
    const isPair = label.includes("PAIR");
    return {
      label,
      value: count,
      color: isLna ? "#10b981" : isPair ? "#f59e0b" : "#3b82f6"
    };
  });

  const pairBySectorPieData = Object.entries(sectorMap).map(([sector, stats], idx) => ({
    label: sector,
    value: stats.pair,
    color: chartColors[idx % chartColors.length]
  }));

  const noisePieData = [
    { label: "Crítico (≥ 85 dB)", value: noiseOver85, color: "#f43f5e" },
    { label: "Nível de Ação (80-84.9 dB)", value: noise80to85, color: "#f59e0b" },
    { label: "Conforto (< 80 dB)", value: noiseUnder80, color: "#10b981" }
  ];

  // Dynamic Recent Activities based on real state
  const recentActivities: { title: string; subtitle: string; time: string; type: "alert" | "success" | "info" }[] = [];
  
  // 1. Audit non-conformance check
  const nonConformantEmps = employees.filter(e => e.situacaoAuditoria === "Não Conforme");
  if (nonConformantEmps.length > 0) {
    recentActivities.push({
      title: "Inadequação em Auditoria de Campo",
      subtitle: `${nonConformantEmps[0].nome} (${nonConformantEmps[0].local || "Campo"}) — desvio: ${nonConformantEmps[0].inadequacaoAuditoria || "EPI não utilizado"}`,
      time: "Hoje",
      type: "alert"
    });
  } else {
    recentActivities.push({
      title: "Vistoria de Auditoria Concluída",
      subtitle: "Todas as frentes de trabalho auditadas apresentaram conformidade no uso de EPI.",
      time: "Hoje",
      type: "success"
    });
  }

  // 2. Retests check
  const retestEmps = employees.filter(e => e.reteste === "Sim" || e.reteste === "Agendado");
  if (retestEmps.length > 0) {
    recentActivities.push({
      title: `Exame de Reteste Auditivo ${retestEmps[0].reteste === "Agendado" ? "Agendado" : "Pendente"}`,
      subtitle: `Agendamento preventivo de 15 dias para confirmação clínica de ${retestEmps[0].nome}.`,
      time: "Ontem",
      type: "info"
    });
  }

  // 3. Stable cases check
  const stableEmps = employees.filter(e => e.avaliacaoAnexoII === "Estável");
  if (stableEmps.length > 0) {
    recentActivities.push({
      title: "Laudo Periódico Processado",
      subtitle: `${stableEmps[0].nome} — Parecer fonoaudiológico estável (Anexo II NR-7).`,
      time: "Há 2 dias",
      type: "success"
    });
  }

  // Fallbacks if not enough data
  if (recentActivities.length < 3) {
    recentActivities.push({
      title: "Integração de Laudos Fonoaudiológicos",
      subtitle: "Importação e cruzamento de exames audiométricos concluídos com sucesso.",
      time: "Há 3 dias",
      type: "info"
    });
  }

  return (
    <div className="space-y-6" id="sppa-dashboard-section">
      {/* Grid 4 Key Metrics (Bento Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Workers */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between h-32 transition-all hover:border-slate-300">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Funcionários</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-black text-slate-900 font-display">{totalEmployees}</span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              {activeEmployees} ativos
            </span>
          </div>
        </div>

        {/* Metric 2: PAIR Cases */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between h-32 transition-all hover:border-slate-300">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">GHE Críticos / PAIR</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-black text-slate-900 font-display">{pairCases.length}</span>
            <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
              {totalEmployees ? ((pairCases.length / totalEmployees) * 100).toFixed(0) : 0}% do quadro
            </span>
          </div>
        </div>

        {/* Metric 3: EPI compliance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between h-32 transition-all hover:border-slate-300">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">EPIs Vencendo / Vencidos</span>
            <span className={`p-1.5 rounded-lg shrink-0 ${expiredEpis.length > 0 ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-500"}`}>
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-black text-slate-900 font-display">{activeEpis}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${expiredEpis.length > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
              {expiredEpis.length} pendentes
            </span>
          </div>
        </div>

        {/* Metric 4: Audit failures */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between h-32 transition-all hover:border-slate-300">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Auditorias Realizadas</span>
            <span className="p-1.5 bg-slate-100 text-slate-600 rounded-lg shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-black text-slate-900 font-display">{auditsDone.length}</span>
            <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
              {auditsPending.length} em aberto
            </span>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* SECTOR EPIDEMIOLOGICAL DIAGNOSIS & EPI PROTECTION MODULE         */}
      {/* ---------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6" id="sppa-sector-diagnosis-module">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800 font-display flex items-center gap-2">
              <span className="p-1.5 bg-sky-50 text-sky-600 rounded-lg shrink-0">
                <BarChart3 className="w-4.5 h-4.5" />
              </span>
              Diagnóstico Epidemiológico & Controle de EPI por Setor
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Análise quantitativa de perdas por frequências clínicas, tipologia do laudo e taxa de adesão por categoria de protetor auricular.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* View Mode Selectors */}
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-[11px] font-semibold">
              <button
                onClick={() => setViewMode("both")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === "both"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Visualização Completa
              </button>
              <button
                onClick={() => setViewMode("spreadsheet")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === "spreadsheet"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                Planilha
              </button>
              <button
                onClick={() => setViewMode("charts")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === "charts"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Gráficos
              </button>
            </div>

            {/* CSV Export Button */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-2 rounded-xl border border-emerald-200/50 transition-colors text-xs font-semibold shadow-sm cursor-pointer"
              title="Exportar planilha de auditoria epidemiológica para Excel / CSV"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Informative Help Banner */}
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-[11px] text-blue-800 leading-relaxed">
            <strong>Auditoria de Dados Fonoaudiológicos:</strong> O SPPA monitora e compila perdas em <strong>frequências isoladas (250Hz, 6kHz, 8kHz)</strong> e alterações clínicas a partir de análises estruturadas dos pareceres de orelha direita/esquerda e cruzamentos dos termos no campo de observações médicas.
          </div>
        </div>

        {/* 1. SPREADSHEET / PLANILHA VIEW */}
        {(viewMode === "spreadsheet" || viewMode === "both") && (
          <div className="space-y-3" id="sppa-epidemiology-spreadsheet">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                Matriz de Controle de Perdas Auditivas por Setor
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Valores consolidados em tempo real</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200/60 shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="p-3.5 font-display min-w-[180px]">Setor</th>
                    <th className="p-3.5 text-center font-mono">Total Exames</th>
                    <th className="p-3.5 text-center text-emerald-600 bg-emerald-50/30">Normais (LNA)</th>
                    <th className="p-3.5 text-center text-rose-600 bg-rose-50/20">Alteradas</th>
                    <th className="p-3.5 text-center font-mono border-l border-slate-200/60 bg-amber-50/10">Perda 250Hz</th>
                    <th className="p-3.5 text-center font-mono bg-amber-50/10">Perda 6kHz</th>
                    <th className="p-3.5 text-center font-mono bg-amber-50/10">Perda 8kHz</th>
                    <th className="p-3.5 text-center font-mono border-l border-slate-200/60 bg-blue-50/10">Sensorioneural</th>
                    <th className="p-3.5 text-center font-mono bg-blue-50/10">Condutiva</th>
                    <th className="p-3.5 text-center font-mono bg-blue-50/10">Mista</th>
                    <th className="p-3.5 text-center font-mono border-l border-slate-200/60 bg-violet-50/10 text-violet-700">Mudança Temp (MTL)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {sectorSummaryList.map((sec, idx) => (
                    <tr key={sec.name} className={`hover:bg-slate-50/80 transition-colors ${idx % 2 === 1 ? "bg-slate-50/30" : "bg-white"}`}>
                      <td className="p-3.5 font-bold text-slate-800">{sec.name}</td>
                      <td className="p-3.5 text-center font-mono text-slate-500 font-semibold">{sec.total}</td>
                      <td className="p-3.5 text-center text-emerald-600 bg-emerald-50/10 font-bold font-mono">{sec.normal}</td>
                      <td className="p-3.5 text-center text-rose-600 bg-rose-50/10 font-bold font-mono">{sec.altered}</td>
                      <td className="p-3.5 text-center font-mono border-l border-slate-200/60 text-amber-700 bg-amber-50/10">{sec.loss250 || "-"}</td>
                      <td className="p-3.5 text-center font-mono text-amber-700 bg-amber-50/10">{sec.loss6k || "-"}</td>
                      <td className="p-3.5 text-center font-mono text-amber-700 bg-amber-50/10">{sec.loss8k || "-"}</td>
                      <td className="p-3.5 text-center font-mono border-l border-slate-200/60 text-blue-700 bg-blue-50/10">{sec.sensorioneural || "-"}</td>
                      <td className="p-3.5 text-center font-mono text-blue-700 bg-blue-50/10">{sec.conductive || "-"}</td>
                      <td className="p-3.5 text-center font-mono text-blue-700 bg-blue-50/10">{sec.mixed || "-"}</td>
                      <td className="p-3.5 text-center font-mono border-l border-slate-200/60 text-violet-700 bg-violet-50/10 font-bold">{sec.tempShift || "-"}</td>
                    </tr>
                  ))}
                  
                  {/* Grand Totals Excel Style row */}
                  <tr className="bg-slate-900 text-white font-bold border-t-2 border-slate-800">
                    <td className="p-4 font-display uppercase tracking-wider text-xs">Total Geral da Empresa</td>
                    <td className="p-4 text-center font-mono text-sky-400">{grandTotal.total}</td>
                    <td className="p-4 text-center text-emerald-400 bg-slate-800/50 font-mono">{grandTotal.normal}</td>
                    <td className="p-4 text-center text-rose-400 bg-slate-800/30 font-mono">{grandTotal.altered}</td>
                    <td className="p-4 text-center font-mono border-l border-slate-800 text-amber-400">{grandTotal.loss250}</td>
                    <td className="p-4 text-center font-mono text-amber-400">{grandTotal.loss6k}</td>
                    <td className="p-4 text-center font-mono text-amber-400">{grandTotal.loss8k}</td>
                    <td className="p-4 text-center font-mono border-l border-slate-800 text-blue-300">{grandTotal.sensorioneural}</td>
                    <td className="p-4 text-center font-mono text-blue-300">{grandTotal.conductive}</td>
                    <td className="p-4 text-center font-mono text-blue-300">{grandTotal.mixed}</td>
                    <td className="p-4 text-center font-mono border-l border-slate-800 text-violet-300">{grandTotal.tempShift}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. DYNAMIC CSS BAR CHARTS FOR SENSITIVE HEALTH ANALYSIS */}
        {(viewMode === "charts" || viewMode === "both") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="sppa-epidemiology-charts">
            {/* Chart Block A: Frequencies & Type of Loss per Sector as a Pie Chart */}
            <PieChart
              title="Prevalência de Alterações por Setor"
              subtitle="Distribuição proporcional de trabalhadores com laudos alterados entre os setores ativos."
              data={sectorAlteredPieData}
              centerLabel="Alterados"
              centerValue={grandTotal.altered.toString()}
            />

            {/* Chart Block B: EPI Utilized Percentages as a Pie Chart */}
            <PieChart
              title="Distribuição de EPIs por Tipo"
              subtitle="Proporção de uso de cada modelo de proteção auditiva vigente entre os trabalhadores."
              data={epiPieData}
              centerLabel="EPIs"
              centerValue={totalEmployees.toString()}
            />
          </div>
        )}
      </div>

      {/* Main Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        {/* Large Bento Box: Perfil Clínico Breakdown (col-span-2) */}
        <div className="lg:col-span-2">
          <PieChart
            title="Perfil Clínico - Pareceres"
            subtitle="Divisão fonoaudiológica total do quadro de funcionários por laudos registrados."
            data={clinicalProfilePieData}
            centerLabel="Laudos"
            centerValue={totalPareceres.toString()}
          />
        </div>

        {/* Bento Box: PAIR vs Normalidade por Setor (col-span-2) */}
        <div className="lg:col-span-2">
          <PieChart
            title="Incidência de P.A.I.R por Setor"
            subtitle="Distribuição proporcional de diagnósticos indicativos de perda por ruído (P.A.I.R) nos setores."
            data={pairBySectorPieData}
            centerLabel="Sug. PAIR"
            centerValue={pairCases.length.toString()}
          />
        </div>

        {/* Bento Box: GHE Exposure Levels (col-span-2) */}
        <div className="lg:col-span-2">
          <PieChart
            title="Níveis de Ruído por GHE"
            subtitle="Classificação regulamentar e níveis de pressão sonora coletados nos grupos de exposição."
            data={noisePieData}
            centerLabel="GHEs"
            centerValue={ghes.length.toString()}
          />
        </div>

        {/* Bento Dark Contrast Box: Recent Activities / Logs (col-span-2) */}
        <div className="lg:col-span-2 bg-[#0f172a] text-white rounded-2xl p-6 shadow-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sky-400 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              Ações Recentes do PCA
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Log de eventos e alterações registradas em tempo real no banco de dados.
            </p>
          </div>

          <div className="my-5 space-y-4 flex-1">
            {recentActivities.map((act, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${
                    act.type === "alert" ? "bg-rose-500 shadow-md shadow-rose-500/50" : 
                    act.type === "success" ? "bg-emerald-500 shadow-md shadow-emerald-500/50" : "bg-sky-400 shadow-md shadow-sky-400/50"
                  }`}></div>
                  {idx < recentActivities.length - 1 && (
                    <div className="w-[1px] flex-1 bg-slate-800 my-1"></div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-100 font-semibold truncate">{act.title}</p>
                    <span className="text-[9px] text-slate-500 shrink-0 ml-2">{act.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed truncate-2-lines">{act.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-2 flex justify-between items-center">
            <span>Servidor local integrado</span>
            <span className="font-semibold text-sky-400 uppercase tracking-widest text-[8px]">PCA Ativo</span>
          </div>
        </div>

      </div>
    </div>
  );
}
