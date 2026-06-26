/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Employee, Company, Responsible, RETESTE_AUXILIARY_TABLE } from "../types";
import { 
  FileText, 
  Printer, 
  Calendar, 
  Edit3, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  RotateCcw, 
  UserCheck, 
  Activity, 
  Trash2,
  HardHat,
  Search,
  Undo
} from "lucide-react";

interface AbnormalReportProps {
  employees: Employee[];
  company: Company;
  responsible: Responsible;
  onUpdateEmployee: (updatedEmp: Employee) => void;
}

// Inline input for Airtable-like spreadsheet editing experience
interface InlineTextInputProps {
  initialValue: string;
  onSave: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const InlineTextInput = ({ initialValue, onSave, placeholder, className }: InlineTextInputProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onSave(value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSave(value);
          (e.target as HTMLInputElement).blur();
        }
      }}
      placeholder={placeholder}
      className={className}
    />
  );
};

// Custom parser to transform written ear diagnosis into beautiful visual tag badges
const renderTags = (text: string) => {
  if (!text || text.trim() === "") {
    return <span className="text-slate-400 italic text-[10px]">Sem dados</span>;
  }

  // Normalize separators: ' ou ', '|', '/', '+', ';' into commas
  const normalized = text
    .replace(/\s+ou\s+/gi, ", ")
    .replace(/\s*\|\s*/g, ", ")
    .replace(/\s*\/\s*/g, ", ")
    .replace(/\s*\+\s*/g, ", ");

  const parts = normalized
    .split(/[,;]+/)
    .map(p => p.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return <span className="text-slate-400 italic text-[10px]">Sem dados</span>;
  }

  return parts.map((part, index) => {
    const lower = part.toLowerCase();

    // 1. Normal
    if (lower === "nl" || lower === "normal" || lower === "lna" || lower === "nl = normal") {
      return (
        <span key={index} className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold uppercase px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0">
          <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
          NL = Normal
        </span>
      );
    }

    // 2. Sensorioneural
    if (lower === "sn" || lower === "sensorioneural" || lower === "sensório-neural" || lower === "sn = sensorioneural") {
      return (
        <span key={index} className="text-[9px] bg-rose-100 text-rose-800 border border-rose-300 font-extrabold uppercase px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0">
          <span className="w-1 h-1 rounded-full bg-rose-500"></span>
          SN = Sensorioneural
        </span>
      );
    }

    // 3. Condutiva
    if (lower === "c" || lower === "condutiva" || lower === "c = condutiva") {
      return (
        <span key={index} className="text-[9px] bg-amber-100 text-amber-800 border border-amber-300 font-extrabold uppercase px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0">
          <span className="w-1 h-1 rounded-full bg-amber-500"></span>
          C = Condutiva
        </span>
      );
    }

    // 4. Mista
    if (lower === "m" || lower === "mista" || lower === "m = mista") {
      return (
        <span key={index} className="text-[9px] bg-purple-100 text-purple-800 border border-purple-300 font-extrabold uppercase px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0">
          <span className="w-1 h-1 rounded-full bg-purple-500"></span>
          M = Mista
        </span>
      );
    }

    // 5. Anacusia
    if (lower === "anacusia") {
      return (
        <span key={index} className="text-[9px] bg-red-150 text-red-800 border border-red-300 font-extrabold uppercase px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0">
          <span className="w-1 h-1 rounded-full bg-red-500"></span>
          Anacusia
        </span>
      );
    }

    // 6. Graus (Leve, Moderado, Severo, Profundo)
    if (lower === "leve" || lower === "grau leve") {
      return (
        <span key={index} className="text-[9px] bg-blue-100 text-blue-800 border border-blue-200 font-bold uppercase px-1.5 py-0.5 rounded-md shrink-0">
          Grau Leve
        </span>
      );
    }
    if (lower === "moderado" || lower === "grau moderado") {
      return (
        <span key={index} className="text-[9px] bg-cyan-100 text-cyan-800 border border-cyan-200 font-bold uppercase px-1.5 py-0.5 rounded-md shrink-0">
          Grau Moderado
        </span>
      );
    }
    if (lower === "severo" || lower === "grau severo") {
      return (
        <span key={index} className="text-[9px] bg-orange-100 text-orange-800 border border-orange-200 font-bold uppercase px-1.5 py-0.5 rounded-md shrink-0">
          Grau Severo
        </span>
      );
    }
    if (lower === "profundo" || lower === "grau profundo") {
      return (
        <span key={index} className="text-[9px] bg-red-100 text-red-800 border border-red-200 font-bold uppercase px-1.5 py-0.5 rounded-md shrink-0">
          Grau Profundo
        </span>
      );
    }

    // 7. Curvas (Entalhe, Descendente, Ascendente, Horizontal, Irregular)
    if (lower === "entalhe" || lower === "curva entalhe") {
      return (
        <span key={index} className="text-[9px] bg-sky-100 text-sky-800 border border-sky-200 font-bold uppercase px-1.5 py-0.5 rounded-md shrink-0">
          Curva Entalhe
        </span>
      );
    }
    if (lower === "descendente" || lower === "curva descendente") {
      return (
        <span key={index} className="text-[9px] bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold uppercase px-1.5 py-0.5 rounded-md shrink-0">
          Curva Descendente
        </span>
      );
    }
    if (lower === "ascendente" || lower === "curva ascendente") {
      return (
        <span key={index} className="text-[9px] bg-teal-100 text-teal-800 border border-teal-200 font-bold uppercase px-1.5 py-0.5 rounded-md shrink-0">
          Curva Ascendente
        </span>
      );
    }
    if (lower === "horizontal" || lower === "curva horizontal") {
      return (
        <span key={index} className="text-[9px] bg-slate-100 text-slate-800 border border-slate-200 font-bold uppercase px-1.5 py-0.5 rounded-md shrink-0">
          Curva Horizontal
        </span>
      );
    }
    if (lower === "irregular" || lower === "curva irregular") {
      return (
        <span key={index} className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 font-bold uppercase px-1.5 py-0.5 rounded-md shrink-0">
          Curva Irregular
        </span>
      );
    }

    // General fallback for unknown strings (styled cleanly)
    return (
      <span key={index} className="text-[9px] bg-slate-100 text-slate-700 border border-slate-200 font-semibold px-1.5 py-0.5 rounded-md shrink-0">
        {part}
      </span>
    );
  });
};

const isEarAbnormal = (val: string): boolean => {
  const text = (val || "").trim();
  if (!text) return false;

  // Split into individual word tokens to check exact short codes and substring roots
  const tokens = text
    .toLowerCase()
    .replace(/[()=+,;|/\\]/g, " ") // replace all punctuation with spaces
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 0) return false;

  const abnormalShortCodes = new Set(["sn", "c", "m", "pair"]);
  const abnormalRoots = [
    "sensori",
    "condut",
    "mist",
    "anacus",
    "entalh",
    "descend",
    "ascend",
    "horizont",
    "irregul",
    "lev",
    "moder",
    "sever",
    "profund",
    "rebaix",
    "perda",
    "altera"
  ];

  return tokens.some(token => {
    if (abnormalShortCodes.has(token)) return true;
    return abnormalRoots.some(root => token.includes(root));
  });
};

export default function AbnormalReport({ employees, company, responsible, onUpdateEmployee }: AbnormalReportProps) {
  // 1. Date Range Filters (Default from 2025-01-01 to 2027-12-31 to cover all mock/simulated database records)
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2027-12-31");
  
  // Search text filter
  const [searchText, setSearchText] = useState("");

  // Edit State
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Employee>>({});

  // General Clinical Observation Text
  const [clinicalObservation, setClinicalObservation] = useState("");

  // Helper to determine if an employee's audiometry is abnormal
  const isAbnormal = (emp: Employee) => {
    return isEarAbnormal(emp.parecerOrelhaDireita) || isEarAbnormal(emp.parecerOrelhaEsquerda);
  };

  // Filtered list of abnormal employees
  const filteredEmployees = employees.filter((emp) => {
    // 1. Must be abnormal
    if (!isAbnormal(emp)) return false;

    // 2. Filter by date of current exam (dataExameAtual)
    const examDate = emp.dataExameAtual || emp.dataExame || "";
    if (startDate && examDate < startDate) return false;
    if (endDate && examDate > endDate) return false;

    // 3. Search Text filter
    if (searchText) {
      const query = searchText.toLowerCase();
      const matchName = (emp.nome || "").toLowerCase().includes(query);
      const matchLocal = (emp.local || "").toLowerCase().includes(query);
      const matchCargo = (emp.cargo || "").toLowerCase().includes(query);
      return matchName || matchLocal || matchCargo;
    }

    return true;
  });

  // Automatically suggest/generate a detailed clinical observation based on the filtered records
  const generateSuggestedObservation = () => {
    if (filteredEmployees.length === 0) {
      setClinicalObservation(
        "Nenhum caso de alteração audiométrica detectado no período selecionado."
      );
      return;
    }

    // Count statistics
    const totalCases = filteredEmployees.length;
    
    // Categorize by types
    let pairCount = 0;
    let sensorioneuralCount = 0;
    let condutivaCount = 0;
    let mistaCount = 0;
    let retestNeededCount = 0;
    let cerumenCount = 0;
    
    const sectorStats: Record<string, number> = {};

    filteredEmployees.forEach((emp) => {
      const od = (emp.parecerOrelhaDireita || "").toLowerCase();
      const oe = (emp.parecerOrelhaEsquerda || "").toLowerCase();
      
      const isSN = od.includes("sn") || od.includes("sensorioneural") || oe.includes("sn") || oe.includes("sensorioneural");
      const isC = od.includes("condutiva") || od === "c" || od.includes(" c ") || oe.includes("condutiva") || oe === "c" || oe.includes(" c ");
      const isM = od.includes("mista") || od === "m" || od.includes(" m ") || oe.includes("mista") || oe === "m" || oe.includes(" m ");
      
      if (od.includes("pair") || oe.includes("pair")) pairCount++;
      else if (isSN) sensorioneuralCount++;
      else if (isC) condutivaCount++;
      else if (isM) mistaCount++;

      if (emp.reteste && emp.reteste !== "Não necessário") retestNeededCount++;
      if (emp.remocaoCerumen) cerumenCount++;

      const sector = emp.local || "Não Informado";
      sectorStats[sector] = (sectorStats[sector] || 0) + 1;
    });

    const topSector = Object.entries(sectorStats).sort((a, b) => b[1] - a[1])[0];

    const suggestion = `CONCLUSÃO E DIRETRIZES DO DIAGNÓSTICO EPIDEMIOLÓGICO:
Durante o período de ${new Date(startDate).toLocaleDateString("pt-BR")} a ${new Date(endDate).toLocaleDateString("pt-BR")}, foram analisados os exames audiométricos alterados (excluindo limiares normais). Identificou-se um total de ${totalCases} colaboradores apresentando perdas ou rebaixamentos auditivos significativos.

Desses casos, constatou-se a seguinte distribuição:
• PAIR (Perda Auditiva Induzida por Ruído): ${pairCount} caso(s).
• Perda Sensorioneural Não-Ocupacional: ${sensorioneuralCount} caso(s).
• Perda Condutiva: ${condutivaCount} caso(s).
• Perda Mista: ${mistaCount} caso(s).

O setor com maior prevalência de alterações detectadas é "${topSector ? topSector[0] : "N/A"}" com ${topSector ? topSector[1] : 0} ocorrência(s). 
Recomendamos reteste para ${retestNeededCount} colaborador(es) para fins de monitoramento e controle. Adicionalmente, foram identificados ${cerumenCount} caso(s) com indicação para higienização/remoção de cerúmen antes de nova avaliação.

Conduta recomendada: Intensificar o monitoramento do uso efetivo de protetores auriculares no setor de maior risco, fiscalizar os prazos de troca de EPIs e agendar os retestes solicitados com repouso acústico de 14 horas.`;

    setClinicalObservation(suggestion);
  };

  // Generate initial observation when component loads or date filters change
  useEffect(() => {
    generateSuggestedObservation();
  }, [startDate, endDate, employees.length]);

  // Open Edit Dialog/Inline
  const handleStartEdit = (emp: Employee) => {
    setEditingEmployeeId(emp.id);
    setEditForm({
      ...emp,
      evolucaoOrelhaDireita: emp.evolucaoOrelhaDireita || emp.avaliacaoAnexoII || "Estável",
      evolucaoOrelhaEsquerda: emp.evolucaoOrelhaEsquerda || emp.avaliacaoAnexoII || "Estável",
      parecerOrelhaDireita: emp.parecerOrelhaDireita || "",
      parecerOrelhaEsquerda: emp.parecerOrelhaEsquerda || "",
      remocaoCerumen: emp.remocaoCerumen ?? false,
    });
  };

  // Save changes back to Parent state
  const handleSaveEdit = () => {
    if (editingEmployeeId && editForm) {
      const updatedForm = { ...editForm };
      
      const od = updatedForm.parecerOrelhaDireita || "";
      const oe = updatedForm.parecerOrelhaEsquerda || "";
      
      updatedForm.parecerAudiologico = `OD: ${od} | OE: ${oe}`;

      onUpdateEmployee(updatedForm as Employee);
      setEditingEmployeeId(null);
      setEditForm({});
    }
  };

  // Quick Action Toggles from the table
  const handleToggleRetest = (emp: Employee) => {
    const isCurrentlyRetest = emp.reteste && emp.reteste !== "Não necessário";
    const nextRetestVal = isCurrentlyRetest ? "Não necessário" : "Reteste 15 dias (Diferença de limiares)";
    
    onUpdateEmployee({
      ...emp,
      reteste: nextRetestVal,
    });
  };

  const handleToggleCerumen = (emp: Employee) => {
    onUpdateEmployee({
      ...emp,
      remocaoCerumen: !emp.remocaoCerumen,
    });
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="sppa-abnormal-audiometries-panel">
      {/* 1. Header Area (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-4 no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 font-display">
            <Activity className="text-rose-600 w-6 h-6" />
            Gerenciamento Audiométrico
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Lista consolidada exclusiva de exames alterados para diagnóstico do PCA, com indicação de retestes, condutas de cerúmen e laudos bilaterais.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4.5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-slate-900/10 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimir Paisagem (PDF)
          </button>
        </div>
      </div>

      {/* 2. Filters Row (Hidden when printing) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 no-print">
        <div className="flex items-center gap-2 font-semibold text-xs text-slate-500 uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-blue-500" />
          Filtros de Período e Busca de Informações
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Data Inicial do Exame</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Data Final do Exame</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Filtrar Nome, Setor ou Cargo</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Busca rápida..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
          <span className="text-slate-500">
            Mostrando <strong className="text-rose-600">{filteredEmployees.length}</strong> exames alterados de um universo total de <strong className="text-slate-700">{employees.length}</strong> funcionários cadastrados.
          </span>
          <button 
            onClick={() => { setStartDate("2025-01-01"); setEndDate("2027-12-31"); setSearchText(""); }}
            className="text-blue-600 hover:underline font-bold"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* 3. EDIT DIALOG MODAL (Hidden when printing) */}
      {editingEmployeeId && editForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 no-print">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm font-display flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-rose-400" />
                  Editar Registro Audiométrico Alterado
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Colaborador: {editForm.nome}</p>
              </div>
              <button 
                onClick={() => setEditingEmployeeId(null)}
                className="text-slate-400 hover:text-white text-xs font-bold bg-slate-800 px-2.5 py-1.5 rounded-xl transition-all"
              >
                Cancelar
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {/* Basic info */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={editForm.nome || ""}
                    onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Idade (Anos)</label>
                  <input
                    type="number"
                    value={editForm.idade || 0}
                    onChange={(e) => setEditForm({ ...editForm, idade: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Setor</label>
                  <input
                    type="text"
                    value={editForm.local || ""}
                    onChange={(e) => setEditForm({ ...editForm, local: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cargo</label>
                  <input
                    type="text"
                    value={editForm.cargo || ""}
                    onChange={(e) => setEditForm({ ...editForm, cargo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipo de Exame</label>
                  <select
                    value={editForm.tipoExameAtual || editForm.tipoExameReferencia || "Periódico"}
                    onChange={(e) => setEditForm({ ...editForm, tipoExameAtual: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold"
                  >
                    <option value="Admissional">Admissional</option>
                    <option value="Periódico">Periódico</option>
                    <option value="Demissional">Demissional</option>
                    <option value="Retorno ao Trabalho">Retorno ao Trabalho</option>
                    <option value="Mudança de Função">Mudança de Função</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Data do Exame</label>
                  <input
                    type="date"
                    value={editForm.dataExameAtual || editForm.dataExame || ""}
                    onChange={(e) => setEditForm({ ...editForm, dataExameAtual: e.target.value, dataExame: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold font-mono"
                  />
                </div>
              </div>

              {/* Ears Details */}
              <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4">
                {/* Orelha Direita (OD) */}
                <div className="bg-blue-50/50 p-3.5 border border-blue-100 rounded-2xl space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-blue-800 uppercase block mb-1">Orelha Direita (OD)</span>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Laudo, Grau e Curva (Livre)</label>
                    <input
                      type="text"
                      value={editForm.parecerOrelhaDireita || ""}
                      onChange={(e) => setEditForm({ ...editForm, parecerOrelhaDireita: e.target.value })}
                      placeholder="Ex: SN, Grau Leve, Curva Entalhe"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-blue-500 font-semibold text-slate-700"
                    />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {renderTags(editForm.parecerOrelhaDireita || "")}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Evolução OD</label>
                    <select
                      value={editForm.evolucaoOrelhaDireita || "Estável"}
                      onChange={(e) => setEditForm({ ...editForm, evolucaoOrelhaDireita: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 font-bold text-slate-700 cursor-pointer"
                    >
                      <option value="Estável">Estável</option>
                      <option value="Desencadeamento">Desencadeamento</option>
                      <option value="Agravamento">Agravamento</option>
                    </select>
                  </div>
                </div>

                {/* Orelha Esquerda (OE) */}
                <div className="bg-rose-50/40 p-3.5 border border-rose-100 rounded-2xl space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-rose-800 uppercase block mb-1">Orelha Esquerda (OE)</span>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Laudo, Grau e Curva (Livre)</label>
                    <input
                      type="text"
                      value={editForm.parecerOrelhaEsquerda || ""}
                      onChange={(e) => setEditForm({ ...editForm, parecerOrelhaEsquerda: e.target.value })}
                      placeholder="Ex: SN, Grau Leve, Curva Entalhe"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-rose-500 font-semibold text-slate-700"
                    />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {renderTags(editForm.parecerOrelhaEsquerda || "")}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Evolução OE</label>
                    <select
                      value={editForm.evolucaoOrelhaEsquerda || "Estável"}
                      onChange={(e) => setEditForm({ ...editForm, evolucaoOrelhaEsquerda: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-rose-500 font-bold text-slate-700 cursor-pointer"
                    >
                      <option value="Estável">Estável</option>
                      <option value="Desencadeamento">Desencadeamento</option>
                      <option value="Agravamento">Agravamento</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Quick Actions Indicators */}
              <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-slate-50 p-3 border border-slate-200 rounded-2xl">
                  <input
                    type="checkbox"
                    id="retest-check-modal"
                    checked={editForm.reteste !== "Não necessário"}
                    onChange={(e) => {
                      setEditForm({
                        ...editForm,
                        reteste: e.target.checked ? "Reteste 15 dias (Diferença de limiares)" : "Não necessário"
                      });
                    }}
                    className="w-4.5 h-4.5 accent-blue-600 rounded"
                  />
                  <div>
                    <label htmlFor="retest-check-modal" className="block text-xs font-bold text-slate-700 cursor-pointer">
                      Exame de Reteste Requerido
                    </label>
                    <span className="text-[10px] text-slate-400 block">Diferença de limiares a confirmar</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-3 border border-slate-200 rounded-2xl">
                  <input
                    type="checkbox"
                    id="cerumen-check-modal"
                    checked={editForm.remocaoCerumen || false}
                    onChange={(e) => setEditForm({ ...editForm, remocaoCerumen: e.target.checked })}
                    className="w-4.5 h-4.5 accent-emerald-600 rounded"
                  />
                  <div>
                    <label htmlFor="cerumen-check-modal" className="block text-xs font-bold text-slate-700 cursor-pointer">
                      Indicação de Remoção de Cerúmen
                    </label>
                    <span className="text-[10px] text-slate-400 block">Higienização de condutos indicada</span>
                  </div>
                </div>
              </div>

              {/* Specific Observation suggestion input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Observações Médicas Individuais</label>
                <textarea
                  value={editForm.observacao || ""}
                  onChange={(e) => setEditForm({ ...editForm, observacao: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-700"
                  placeholder="Laudo descritivo complementar do trabalhador..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setEditingEmployeeId(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. PRINTABLE LANDSCAPE REPORT CONTAINER */}
      <div 
        id="sppa-abnormal-report-printable"
        className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 print:shadow-none print:border-none print:p-0 print:m-0"
      >
        {/* Print Only Header (Visible only when printing) */}
        <div className="hidden print:block mb-6 border-b-2 border-slate-900 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight uppercase font-display">
                SPPA • Gerenciamento Audiométrico de Exames Alterados
              </h1>
              <p className="text-[11px] text-slate-600 mt-1">
                Programa de Conservação Auditiva (PCA) • Diretrizes NR-7 Anexo II & Manual Fundacentro
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                Período Auditado: {new Date(startDate).toLocaleDateString("pt-BR")} até {new Date(endDate).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div className="text-right text-xs">
              <div className="font-bold text-slate-800">{company.razaoSocial}</div>
              <div className="text-slate-500 font-mono">CNPJ: {company.cnpj}</div>
              <div className="text-slate-400 mt-1">Relatório Técnico Periódico</div>
            </div>
          </div>
        </div>

        {/* Report Overview Block */}
        <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4 print:bg-white print:border-slate-300">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
              Diagnóstico de Casos Clínicos Alterados
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 print:text-slate-600">
              Esta relação de saúde descritiva demonstra os funcionários ativos do período que apresentaram queda nos limiares normais.
            </p>
          </div>
          <div className="text-right text-[11px] font-mono">
            <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200/50 print:border-slate-300">
              Total de Alterações Ativas: <strong>{filteredEmployees.length}</strong>
            </span>
          </div>
        </div>

        {/* MAIN MATRIX TABLE IN LANDSCAPE */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 print:border-slate-400">
          <table className="w-full text-left border-collapse text-xs min-w-[1050px] table-fixed">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold print:bg-slate-200 print:border-slate-400">
                <th className="p-3 w-[140px] font-display">Nome do Colaborador</th>
                <th className="p-3 w-[50px] text-center">Idade</th>
                <th className="p-3 w-[90px] truncate">Setor</th>
                <th className="p-3 w-[90px] truncate">Cargo</th>
                <th className="p-3 w-[80px] text-center">Exame</th>
                <th className="p-3 w-[80px] text-center">Data Exame</th>
                <th className="p-3 w-[180px] bg-blue-50/40 print:bg-slate-100 text-blue-900">
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs font-black">OD</span>
                    <span className="text-[9px] font-normal text-blue-700/80 lowercase">laudo</span>
                  </div>
                </th>
                <th className="p-3 w-[180px] bg-rose-50/20 print:bg-slate-100 text-rose-900">
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs font-black">OE</span>
                    <span className="text-[9px] font-normal text-rose-700/80 lowercase">laudo</span>
                  </div>
                </th>
                <th className="p-3 w-[110px] bg-blue-50/20 print:bg-slate-100 text-blue-900 text-center">
                  <div className="flex flex-col items-center leading-tight">
                    <span className="text-xs font-black">OD</span>
                    <span className="text-[9px] font-normal text-blue-700/80 lowercase">evolução</span>
                  </div>
                </th>
                <th className="p-3 w-[110px] bg-rose-50/10 print:bg-slate-100 text-rose-900 text-center">
                  <div className="flex flex-col items-center leading-tight">
                    <span className="text-xs font-black">OE</span>
                    <span className="text-[9px] font-normal text-rose-700/80 lowercase">evolução</span>
                  </div>
                </th>
                <th className="p-3 w-[120px] text-center no-print">Ações Rápidas</th>
                <th className="p-3 w-[100px] text-center hidden print:table-cell border-l border-slate-300">Reteste / Cerúmen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium print:divide-slate-300">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-slate-400 italic font-medium">
                    Nenhum exame audiométrico alterado encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp, idx) => {
                  const hasRetest = emp.reteste && emp.reteste !== "Não necessário";
                  const hasCerumen = emp.remocaoCerumen;

                  return (
                    <tr 
                      key={emp.id} 
                      className={`hover:bg-slate-50/60 transition-colors ${idx % 2 === 1 ? "bg-slate-50/20" : "bg-white"}`}
                    >
                      {/* Name */}
                      <td className="p-3 font-bold text-slate-900 truncate" title={emp.nome}>
                        {emp.nome}
                      </td>
                      
                      {/* Age */}
                      <td className="p-3 text-center font-mono text-slate-600">
                        {emp.idade} anos
                      </td>
                      
                      {/* Sector */}
                      <td className="p-3 truncate text-slate-600 font-semibold" title={emp.local}>
                        {emp.local}
                      </td>
                      
                      {/* Cargo */}
                      <td className="p-3 truncate text-slate-600" title={emp.cargo}>
                        {emp.cargo}
                      </td>
                      
                      {/* Type of exam */}
                      <td className="p-3 text-center">
                        <span className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-bold text-slate-600 uppercase">
                          {emp.tipoExameAtual || emp.tipoExameReferencia || "Periódico"}
                        </span>
                      </td>
                      
                      {/* Date of exam */}
                      <td className="p-3 text-center font-mono text-slate-500 font-semibold text-[11px]">
                        {emp.dataExameAtual 
                          ? new Date(emp.dataExameAtual).toLocaleDateString("pt-BR") 
                          : emp.dataExame 
                          ? new Date(emp.dataExame).toLocaleDateString("pt-BR") 
                          : "N/A"
                        }
                      </td>
                      
                      {/* 1. Orelha Direita (Laudo, Grau e Curva) */}
                      <td className="p-3 bg-blue-50/10 print:bg-white">
                        <div className="flex flex-col gap-1.5 w-full">
                          <InlineTextInput
                            initialValue={emp.parecerOrelhaDireita || ""}
                            onSave={(val) => {
                              onUpdateEmployee({
                                ...emp,
                                parecerOrelhaDireita: val,
                                parecerAudiologico: `OD: ${val} | OE: ${emp.parecerOrelhaEsquerda || ""}`
                              });
                            }}
                            placeholder="NL, SN, C, M..."
                            className="no-print w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-500 rounded-xl px-2 py-1 text-xs outline-none transition-all font-semibold text-slate-700 shadow-xs"
                          />
                          <span className="hidden print:inline font-bold text-slate-800 text-[10px] mb-1">
                            {emp.parecerOrelhaDireita || "LNA (Normal)"}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {renderTags(emp.parecerOrelhaDireita || "")}
                          </div>
                        </div>
                      </td>
                      
                      {/* 2. Orelha Esquerda (Laudo, Grau e Curva) */}
                      <td className="p-3 bg-rose-50/10 print:bg-white">
                        <div className="flex flex-col gap-1.5 w-full">
                          <InlineTextInput
                            initialValue={emp.parecerOrelhaEsquerda || ""}
                            onSave={(val) => {
                              onUpdateEmployee({
                                ...emp,
                                parecerOrelhaEsquerda: val,
                                parecerAudiologico: `OD: ${emp.parecerOrelhaDireita || ""} | OE: ${val}`
                              });
                            }}
                            placeholder="NL, SN, C, M..."
                            className="no-print w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-rose-500 rounded-xl px-2 py-1 text-xs outline-none transition-all font-semibold text-slate-700 shadow-xs"
                          />
                          <span className="hidden print:inline font-bold text-slate-800 text-[10px] mb-1">
                            {emp.parecerOrelhaEsquerda || "LNA (Normal)"}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {renderTags(emp.parecerOrelhaEsquerda || "")}
                          </div>
                        </div>
                      </td>
                      
                      {/* 3. Evolução OD */}
                      <td className="p-3 bg-blue-50/5 print:bg-white text-center">
                        <div className="w-full">
                          <select
                            value={emp.evolucaoOrelhaDireita || "Estável"}
                            onChange={(e) => {
                              onUpdateEmployee({
                                ...emp,
                                evolucaoOrelhaDireita: e.target.value
                              });
                            }}
                            className="no-print w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-500 rounded-xl px-2 py-1 text-xs outline-none transition-all font-bold text-slate-700 shadow-xs cursor-pointer"
                          >
                            <option value="Estável">Estável</option>
                            <option value="Desencadeamento">Desencadeamento</option>
                            <option value="Agravamento">Agravamento</option>
                          </select>
                          <span className={`hidden print:inline-block text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            (emp.evolucaoOrelhaDireita || "Estável") === "Desencadeamento"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : (emp.evolucaoOrelhaDireita || "Estável") === "Agravamento"
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : "bg-emerald-50 text-emerald-800 border border-emerald-150"
                          }`}>
                            {emp.evolucaoOrelhaDireita || "Estável"}
                          </span>
                        </div>
                      </td>
                      
                      {/* 4. Evolução OE */}
                      <td className="p-3 bg-rose-50/5 print:bg-white text-center">
                        <div className="w-full">
                          <select
                            value={emp.evolucaoOrelhaEsquerda || "Estável"}
                            onChange={(e) => {
                              onUpdateEmployee({
                                ...emp,
                                evolucaoOrelhaEsquerda: e.target.value
                              });
                            }}
                            className="no-print w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-rose-500 rounded-xl px-2 py-1 text-xs outline-none transition-all font-bold text-slate-700 shadow-xs cursor-pointer"
                          >
                            <option value="Estável">Estável</option>
                            <option value="Desencadeamento">Desencadeamento</option>
                            <option value="Agravamento">Agravamento</option>
                          </select>
                          <span className={`hidden print:inline-block text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            (emp.evolucaoOrelhaEsquerda || "Estável") === "Desencadeamento"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : (emp.evolucaoOrelhaEsquerda || "Estável") === "Agravamento"
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : "bg-emerald-50 text-emerald-800 border border-emerald-150"
                          }`}>
                            {emp.evolucaoOrelhaEsquerda || "Estável"}
                          </span>
                        </div>
                      </td>
                      
                      {/* Actions column */}
                      <td className="p-3 text-center no-print">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleStartEdit(emp)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                            title="Editar informações do exame"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleRetest(emp)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                              hasRetest
                                ? "bg-amber-100 border-amber-300 text-amber-800 shadow-xs font-semibold"
                                : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                            }`}
                            title={hasRetest ? "Remover requisição de reteste" : "Solicitar Reteste de 15 dias"}
                          >
                            Reteste
                          </button>

                          <button
                            onClick={() => handleToggleCerumen(emp)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                              hasCerumen
                                ? "bg-emerald-100 border-emerald-300 text-emerald-800 shadow-xs font-semibold"
                                : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                            }`}
                            title={hasCerumen ? "Remover indicação de cerúmen" : "Marcar Indicação de Remoção de Cerúmen"}
                          >
                            Cerúmen
                          </button>
                        </div>
                      </td>

                      {/* Print-Only Status Column */}
                      <td className="p-3 text-center hidden print:table-cell border-l border-slate-200 text-[10px]">
                        <div className="flex flex-col gap-0.5 items-center justify-center font-semibold">
                          {hasRetest && (
                            <span className="text-amber-800 font-bold bg-amber-50 px-1 py-0.5 rounded border border-amber-200 text-[8px] uppercase">
                              [X] Reteste 15d
                            </span>
                          )}
                          {hasCerumen && (
                            <span className="text-emerald-800 font-bold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200 text-[8px] uppercase">
                              [X] Cerúmen
                            </span>
                          )}
                          {!hasRetest && !hasCerumen && (
                            <span className="text-slate-400 italic text-[9px]">-</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. DYNAMIC CLINICAL OBSERVATION SUGGESTION BOX */}
        <div className="mt-6 space-y-3 p-5 bg-slate-50 border border-slate-200/60 rounded-2xl print:bg-white print:border-slate-400 print:mt-8">
          <div className="flex justify-between items-center no-print">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-500" />
              Sugestão de Parecer de Observações Coletivas (PCA)
            </span>
            <button
              onClick={generateSuggestedObservation}
              className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-xl border border-slate-200 transition-colors text-[10px] font-bold cursor-pointer"
              title="Recalcular observação com base nos filtros ativos"
            >
              <RotateCcw className="w-3 h-3" />
              Sugerir Novamente
            </button>
          </div>

          <div className="hidden print:block border-b border-slate-900 pb-1 mb-2">
            <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider">
              8. Parecer Técnico Coletivo e Observações do Coordenador do SPPA/PCA
            </h4>
          </div>

          <textarea
            value={clinicalObservation}
            onChange={(e) => setClinicalObservation(e.target.value)}
            rows={6}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-medium text-slate-700 leading-relaxed print:border-none print:bg-white print:p-0 print:text-xs print:resize-none print:h-auto"
            placeholder="Digite ou edite a observação epidemiológica clínica final do programa..."
          />
        </div>

        {/* Signatures block for printing */}
        <div className="hidden print:grid grid-cols-2 gap-12 mt-16 max-w-3xl mx-auto text-[10px] text-center">
          <div className="border-t border-slate-400 pt-3">
            <div className="font-bold text-slate-900">{responsible.nome}</div>
            <div className="text-slate-600 font-semibold">{responsible.funcao}</div>
            <div className="text-slate-500 font-mono text-[9px] mt-0.5">{responsible.conselho}</div>
          </div>

          <div className="border-t border-slate-400 pt-3">
            <div className="font-bold text-slate-900">Coordenador SESMT / Direção</div>
            <div className="text-slate-600">Representante Legal da Empresa</div>
            <div className="text-slate-500 font-mono text-[9px] mt-0.5">{company.razaoSocial}</div>
          </div>
        </div>
      </div>

      {/* Landscape Print Helper CSS styling injection */}
      <style>{`
        @media print {
          /* Force page setup to Landscape */
          @page {
            size: landscape;
            margin: 0.8cm;
          }
          
          body {
            background-color: white !important;
            color: black !important;
          }

          /* Hide UI wrappers of standard page elements */
          #sppa-navigation,
          header,
          .no-print,
          aside {
            display: none !important;
          }

          /* Remove borders, paddings or sizing of the outer container for exact landscape printing */
          #sppa-root,
          main,
          .min-h-screen {
            height: auto !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }

          #sppa-abnormal-report-printable {
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          /* Adjust font size slightly for printing consistency */
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }
      `}</style>
    </div>
  );
}
