/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Employee, GHE, EPI } from "../types";
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  FileSpreadsheet,
  Download,
  Search,
  Calendar,
  CalendarX,
  AlertOctagon,
  Building2,
  Headphones,
  AlertCircle,
  Stethoscope,
  Layers,
} from "lucide-react";
import PieChart, { PieChartItem } from "./PieChart";
import {
  classifyHearingGroup,
  getAssociatedRiskFactors,
  HEARING_GROUPS,
  HearingGroupType,
} from "../utils/hearingGroups";
import { SPPA_MONTHLY_ACTIONS, SPPAMonthAction } from "../data/sppaActions";

interface DashboardProps {
  employees: Employee[];
  ghes: GHE[];
  epis: EPI[];
}

export default function Dashboard({ employees, ghes, epis }: DashboardProps) {
  // State for view toggles & interactive filters
  const [viewMode, setViewMode] = useState<"both" | "spreadsheet" | "charts">("both");
  const [selectedSector, setSelectedSector] = useState<string>("TODOS");
  const [group3Search, setGroup3Search] = useState<string>("");
  const [overdueSearch, setOverdueSearch] = useState<string>("");
  const [controlViewType, setControlViewType] = useState<"ghe" | "setor">("ghe");
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<number | "ALL">("ALL");

  const totalEmployees = employees.length;

  // -------------------------------------------------------------------------
  // 1. CLASSIFICATION INTO 4 FUNDACENTRO / NR-7 SPPA GROUPS (Request 7)
  // -------------------------------------------------------------------------
  const groupStats = useMemo(() => {
    const stats = {
      "Grupo 1": 0,
      "Grupo 2": 0,
      "Grupo 3": 0,
      "Grupo 4": 0,
    };

    employees.forEach((emp) => {
      const g = classifyHearingGroup(emp);
      stats[g] += 1;
    });

    return stats;
  }, [employees]);

  const grupo1Count = groupStats["Grupo 1"];
  const grupo2Count = groupStats["Grupo 2"];
  const grupo3Count = groupStats["Grupo 3"];
  const grupo4Count = groupStats["Grupo 4"];

  const pct = (val: number) =>
    totalEmployees > 0 ? ((val / totalEmployees) * 100).toFixed(0) : "0";

  // -------------------------------------------------------------------------
  // 2. DYNAMIC SECTOR ANALYSIS FOR THE 4 GROUPS (Request 8)
  // -------------------------------------------------------------------------
  const uniqueSectors = useMemo(() => {
    const set = new Set<string>();
    employees.forEach((e) => {
      if (e.local) set.add(e.local);
    });
    return Array.from(set).sort();
  }, [employees]);

  const sectorFilteredEmployees = useMemo(() => {
    if (selectedSector === "TODOS") return employees;
    return employees.filter((e) => e.local === selectedSector);
  }, [employees, selectedSector]);

  const dynamicSectorPieData = useMemo<PieChartItem[]>(() => {
    const counts = {
      "Grupo 1": 0,
      "Grupo 2": 0,
      "Grupo 3": 0,
      "Grupo 4": 0,
    };

    sectorFilteredEmployees.forEach((emp) => {
      const g = classifyHearingGroup(emp);
      counts[g] += 1;
    });

    return [
      {
        label: "Grupo 1 - Normais",
        value: counts["Grupo 1"],
        color: HEARING_GROUPS["Grupo 1"].corHex,
      },
      {
        label: "Grupo 2 - Não sugestivo NPSE",
        value: counts["Grupo 2"],
        color: HEARING_GROUPS["Grupo 2"].corHex,
      },
      {
        label: "Grupo 3 - Sugestivo de PAIR",
        value: counts["Grupo 3"],
        color: HEARING_GROUPS["Grupo 3"].corHex,
      },
      {
        label: "Grupo 4 - Mudança Temp. Limiares",
        value: counts["Grupo 4"],
        color: HEARING_GROUPS["Grupo 4"].corHex,
      },
    ];
  }, [sectorFilteredEmployees]);

  // -------------------------------------------------------------------------
  // 3. HEARING LOSS x RISK FACTORS / COMORBIDITIES (Request 14)
  // -------------------------------------------------------------------------
  const riskFactorsData = useMemo<PieChartItem[]>(() => {
    const factors = getAssociatedRiskFactors(employees);

    return [
      {
        label: "Zumbido (Tinnitus)",
        value: factors.zumbido,
        color: "#f43f5e", // Rose
      },
      {
        label: "Uso de Fone de Ouvido",
        value: factors.foneDeOuvido,
        color: "#f59e0b", // Amber
      },
      {
        label: "Excesso de Cerúmen",
        value: factors.excessoCerumen,
        color: "#06b6d4", // Cyan
      },
      {
        label: "Doença Clínica (Diabetes / Anemia)",
        value: factors.doencasSistemicas,
        color: "#8b5cf6", // Purple
      },
      {
        label: "Sem Comorbidades Associadas",
        value: factors.semFatoresAssociados,
        color: "#64748b", // Slate
      },
    ];
  }, [employees]);

  const totalRiskFactorsCount = useMemo(() => {
    return riskFactorsData.reduce((acc, curr) => acc + curr.value, 0);
  }, [riskFactorsData]);

  // -------------------------------------------------------------------------
  // 4. GROUP 3 EMPLOYEES ROSTER (Request 10)
  // -------------------------------------------------------------------------
  const group3Employees = useMemo(() => {
    return employees.filter((emp) => classifyHearingGroup(emp) === "Grupo 3");
  }, [employees]);

  const filteredGroup3 = useMemo(() => {
    if (!group3Search.trim()) return group3Employees;
    const q = group3Search.toLowerCase();
    return group3Employees.filter(
      (e) =>
        e.nome.toLowerCase().includes(q) ||
        e.cracha.toLowerCase().includes(q) ||
        e.local.toLowerCase().includes(q) ||
        (e.cargo && e.cargo.toLowerCase().includes(q))
    );
  }, [group3Employees, group3Search]);

  // -------------------------------------------------------------------------
  // 5. EPI PIE DATA (Request 9: Subtitle removed)
  // -------------------------------------------------------------------------
  const epiPieData = useMemo<PieChartItem[]>(() => {
    const epiColors = ["#0284c7", "#0d9488", "#ca8a04", "#7c3aed", "#e11d48", "#475569"];
    const epiUsageCount: Record<string, number> = {};

    employees.forEach((emp) => {
      let epiName = emp.epi?.trim() || "Não Especificado / Nenhum";
      if (epiName.length > 32) {
        epiName = epiName.substring(0, 32) + "...";
      }
      epiUsageCount[epiName] = (epiUsageCount[epiName] || 0) + 1;
    });

    return Object.entries(epiUsageCount).map(([label, value], idx) => ({
      label,
      value,
      color: epiColors[idx % epiColors.length],
    }));
  }, [employees]);

  // -------------------------------------------------------------------------
  // 6. SPPA MONTHLY ACTIONS FILTER (Request 11)
  // -------------------------------------------------------------------------
  const filteredActions = useMemo(() => {
    if (selectedMonthFilter === "ALL") return SPPA_MONTHLY_ACTIONS;
    return SPPA_MONTHLY_ACTIONS.filter((a) => a.mesNumero === selectedMonthFilter);
  }, [selectedMonthFilter]);

  // -------------------------------------------------------------------------
  // 7. SECTOR MATRIX DATA (Cleaned up for Item 4)
  // -------------------------------------------------------------------------
  const sectorMatrixData = useMemo(() => {
    const map = new Map<
      string,
      {
        sector: string;
        gheCount: number;
        maxNps: number;
        totalEmps: number;
        grupo1: number;
        grupo2: number;
        grupo3: number;
        grupo4: number;
      }
    >();

    employees.forEach((emp) => {
      const sec = emp.local || "Não Classificado";
      if (!map.has(sec)) {
        map.set(sec, {
          sector: sec,
          gheCount: 0,
          maxNps: 0,
          totalEmps: 0,
          grupo1: 0,
          grupo2: 0,
          grupo3: 0,
          grupo4: 0,
        });
      }
      const data = map.get(sec)!;
      data.totalEmps += 1;
      if (emp.npsDb && emp.npsDb > data.maxNps) {
        data.maxNps = emp.npsDb;
      }

      const g = classifyHearingGroup(emp);
      if (g === "Grupo 1") data.grupo1 += 1;
      else if (g === "Grupo 2") data.grupo2 += 1;
      else if (g === "Grupo 3") data.grupo3 += 1;
      else if (g === "Grupo 4") data.grupo4 += 1;
    });

    // Populate GHE count per sector
    const ghesBySector = new Map<string, Set<string>>();
    employees.forEach((emp) => {
      const sec = emp.local || "Não Classificado";
      if (!ghesBySector.has(sec)) ghesBySector.set(sec, new Set());
      if (emp.gheId) ghesBySector.get(sec)!.add(emp.gheId);
    });

    map.forEach((val, key) => {
      val.gheCount = ghesBySector.get(key)?.size || 1;
    });

    return Array.from(map.values()).sort((a, b) => b.grupo3 - a.grupo3);
  }, [employees, ghes]);

  // -------------------------------------------------------------------------
  // 8. OVERDUE EXAMS LIST (> 30 DAYS OVERDUE) (Request 6)
  // -------------------------------------------------------------------------
  const overdueExamsData = useMemo(() => {
    // Reference date: Current date (or baseline 2026-09-18)
    const refDate = new Date() > new Date("2026-01-01") ? new Date() : new Date("2026-09-18");

    const overdueList: Array<{
      id: string;
      cracha: string;
      nome: string;
      cargo: string;
      setor: string;
      diasVencidos: number;
      dataUltimoExame: string;
      dataPrevistaRetorno: string;
      tempoEspecificoLabel: string;
      tempoEspecificoBadgeClass: string;
      isAlmoxarifado: boolean;
      isAdministrativo: boolean;
      isMTL: boolean;
      acaoRecomendada: string;
    }> = [];

    employees.forEach((emp) => {
      const group = classifyHearingGroup(emp);
      const setorNorm = (emp.local || "").toLowerCase();
      const cargoNorm = (emp.cargo || "").toLowerCase();
      const obsNorm = (emp.observacao || "").toLowerCase();

      const isAlmoxarifado =
        setorNorm.includes("almoxarifad") ||
        cargoNorm.includes("almoxarif") ||
        cargoNorm.includes("conferente");

      const isAdministrativo =
        setorNorm.includes("admin") ||
        cargoNorm.includes("admin") ||
        setorNorm.includes("rh") ||
        setorNorm.includes("escritório") ||
        setorNorm.includes("escritorio");

      const isMTL =
        group === "Grupo 4" ||
        obsNorm.includes("mtl") ||
        obsNorm.includes("mudança temporária") ||
        obsNorm.includes("mudanca temporaria") ||
        obsNorm.includes("reteste");

      // Calculate due date
      let dueDate: Date | null = null;
      if (emp.dataPrevistaRetorno) {
        dueDate = new Date(emp.dataPrevistaRetorno + "T00:00:00");
      } else if (emp.dataExame || emp.dataExameAtual) {
        const baseDate = new Date((emp.dataExame || emp.dataExameAtual) + "T00:00:00");
        dueDate = new Date(baseDate);
        if (isMTL) {
          dueDate.setDate(dueDate.getDate() + 30); // Reteste 15 a 30 dias
        } else if (isAlmoxarifado || isAdministrativo) {
          dueDate.setDate(dueDate.getDate() + 730); // 24 meses bienal
        } else {
          dueDate.setDate(dueDate.getDate() + 365); // 12 meses anual
        }
      }

      if (!dueDate || isNaN(dueDate.getTime())) return;

      const diffMs = refDate.getTime() - dueDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      // Overdue by more than 30 days (Request 6)
      if (diffDays > 30) {
        let tempoEspecificoLabel = "Periódico Anual (12 Meses)";
        let tempoEspecificoBadgeClass = "bg-slate-100 text-slate-700 border-slate-200";
        let acaoRecomendada = "Agendar Exame Audiométrico Periódico Anual";

        if (isMTL) {
          tempoEspecificoLabel = "Mudança Temporária de Limiar (Reteste: 15 a 30 dias)";
          tempoEspecificoBadgeClass = "bg-violet-100 text-violet-800 border-violet-300 font-bold";
          acaoRecomendada = "Convocação Prioritária: Reteste com repouso auditivo de 14h";
        } else if (isAlmoxarifado) {
          tempoEspecificoLabel = "Almoxarifado (Ciclo Específico: Bienal / 24 Meses)";
          tempoEspecificoBadgeClass = "bg-blue-100 text-blue-800 border-blue-300 font-bold";
          acaoRecomendada = "Agendar Periódico Bienal conforme PCMSO / Ruído Baixo";
        } else if (isAdministrativo) {
          tempoEspecificoLabel = "Administrativo (Ciclo Específico: Bienal / 24 Meses)";
          tempoEspecificoBadgeClass = "bg-sky-100 text-sky-800 border-sky-300 font-bold";
          acaoRecomendada = "Agendar Periódico Bienal conforme PCMSO / Ruído Baixo";
        }

        overdueList.push({
          id: emp.id,
          cracha: emp.cracha || "-",
          nome: emp.nome,
          cargo: emp.cargo || "-",
          setor: emp.local || "-",
          diasVencidos: diffDays,
          dataUltimoExame: emp.dataExame || emp.dataExameAtual || "-",
          dataPrevistaRetorno: emp.dataPrevistaRetorno || dueDate.toISOString().slice(0, 10),
          tempoEspecificoLabel,
          tempoEspecificoBadgeClass,
          isAlmoxarifado,
          isAdministrativo,
          isMTL,
          acaoRecomendada,
        });
      }
    });

    return overdueList.sort((a, b) => b.diasVencidos - a.diasVencidos);
  }, [employees]);

  const filteredOverdueExams = useMemo(() => {
    if (!overdueSearch.trim()) return overdueExamsData;
    const q = overdueSearch.toLowerCase();
    return overdueExamsData.filter(
      (item) =>
        item.nome.toLowerCase().includes(q) ||
        item.cracha.toLowerCase().includes(q) ||
        item.cargo.toLowerCase().includes(q) ||
        item.setor.toLowerCase().includes(q) ||
        item.tempoEspecificoLabel.toLowerCase().includes(q)
    );
  }, [overdueExamsData, overdueSearch]);

  // -------------------------------------------------------------------------
  // 9. GHE MATRIX FOR THE 4 GROUPS WITH LINE COLORS PER dB (Request 9)
  // -------------------------------------------------------------------------
  const gheMatrixData = useMemo(() => {
    // Definitive mapping: 1 distinct GHE for each of the 4 groups
    // GHE-01 -> Grupo 3 (Sugestivo de PAIR) - 92.4 dB (≥85 dB: Cor Vermelha)
    // GHE-02 -> Grupo 4 (Mudança Temporária de Limiares - MTL) - 87.5 dB (≥85 dB: Cor Vermelha)
    // GHE-03 -> Grupo 2 (Não sugestivo de perda por NPSE) - 82.0 dB (80 a 84.9 dB: Cor Amarela)
    // GHE-04 -> Grupo 1 (Audiometrias Normais) - 76.5 dB (Até 79 dB: Cor Verde)

    const gheDefinitions = [
      {
        id: "ghe-1",
        gesNumero: "GHE-01",
        grupoVinculado: "Grupo 3 - Sugestivo de perda por NPSE",
        grupoTipo: "Grupo 3",
        funcaoGes: "Operador de Prensa / Estamparia Pesada",
        setor: "Setor de Estamparia",
        db: 92.4,
      },
      {
        id: "ghe-2",
        gesNumero: "GHE-02",
        grupoVinculado: "Grupo 4 - Mudança Temporária de Limiares",
        grupoTipo: "Grupo 4",
        funcaoGes: "Soldador Industrial / Caldeireiro",
        setor: "Setor de Soldagem",
        db: 87.5,
      },
      {
        id: "ghe-3",
        gesNumero: "GHE-03",
        grupoVinculado: "Grupo 2 - Não sugestivo de perda por NPSE",
        grupoTipo: "Grupo 2",
        funcaoGes: "Torneiro Mecânico / Operador de Usinagem",
        setor: "Setor de Usinagem",
        db: 82.0,
      },
      {
        id: "ghe-4",
        gesNumero: "GHE-04",
        grupoVinculado: "Grupo 1 - Audiometrias Normais",
        grupoTipo: "Grupo 1",
        funcaoGes: "Conferente / Assistente Administrativo",
        setor: "Almoxarifado & Administrativo",
        db: 76.5,
      },
    ];

    return gheDefinitions.map((def) => {
      // Find employees associated with this GHE or sector
      const empsInGhe = employees.filter(
        (e) =>
          e.gheId === def.id ||
          (e.local && e.local.toLowerCase().includes(def.setor.toLowerCase().split(" ")[0])) ||
          (def.id === "ghe-4" &&
            ((e.local && e.local.toLowerCase().includes("almoxarif")) ||
              (e.local && e.local.toLowerCase().includes("admin"))))
      );

      let g1 = 0;
      let g2 = 0;
      let g3 = 0;
      let g4 = 0;

      empsInGhe.forEach((e) => {
        const grp = classifyHearingGroup(e);
        if (grp === "Grupo 1") g1++;
        else if (grp === "Grupo 2") g2++;
        else if (grp === "Grupo 3") g3++;
        else if (grp === "Grupo 4") g4++;
      });

      const total = empsInGhe.length;

      // Color coding according to user's exact specification:
      // "sem nível de ação até 79dB cor verde, 80 db com nível de ação cor amarela, a partir de 85db coloque na cor vermelha"
      let rowColorClass = "";
      let dbBadgeClass = "";
      let faixaRuido = "";

      if (def.db >= 85) {
        // Vermelho: A partir de 85 dB
        rowColorClass = "bg-rose-50/70 hover:bg-rose-100/80 border-l-4 border-rose-500 text-rose-950";
        dbBadgeClass = "bg-rose-100 text-rose-800 border-rose-300";
        faixaRuido = "A partir de 85 dB (Limite de Tolerância)";
      } else if (def.db >= 80) {
        // Amarelo: 80 dB a 84.9 dB com nível de ação
        rowColorClass = "bg-amber-50/70 hover:bg-amber-100/80 border-l-4 border-amber-500 text-amber-950";
        dbBadgeClass = "bg-amber-100 text-amber-800 border-amber-300";
        faixaRuido = "80 dB com Nível de Ação";
      } else {
        // Verde: Sem nível de ação até 79 dB
        rowColorClass = "bg-emerald-50/70 hover:bg-emerald-100/80 border-l-4 border-emerald-500 text-emerald-950";
        dbBadgeClass = "bg-emerald-100 text-emerald-800 border-emerald-300";
        faixaRuido = "Sem Nível de Ação (até 79 dB)";
      }

      return {
        ...def,
        total,
        g1,
        g2,
        g3,
        g4,
        rowColorClass,
        dbBadgeClass,
        faixaRuido,
      };
    });
  }, [employees]);

  // CSV Export
  const handleExportCSV = () => {
    if (controlViewType === "ghe") {
      const headers = [
        "GHE",
        "Grupo Vinculado",
        "Setor Operacional / Função",
        "Ruído (dB)",
        "Faixa de Ação",
        "Grupo 1 (Normais)",
        "Grupo 2 (Não-NPSE)",
        "Grupo 3 (PAIR)",
        "Grupo 4 (MTL)",
        "Total Trabalhadores",
      ];

      const rows = gheMatrixData.map((g) => [
        `"${g.gesNumero}"`,
        `"${g.grupoVinculado}"`,
        `"${g.funcaoGes}"`,
        g.db.toFixed(1),
        `"${g.faixaRuido}"`,
        g.g1,
        g.g2,
        g.g3,
        g.g4,
        g.total,
      ]);

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `SPPA_Controle_GHE_Cores_dB_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const headers = [
      "Setor",
      "Total Colaboradores",
      "Ruído Máx (dB)",
      "Grupo 1 (Normais)",
      "Grupo 2 (Não-NPSE)",
      "Grupo 3 (Sugestivo PAIR)",
      "Grupo 4 (MTL)",
      "% PAIR",
    ];

    const rows = sectorMatrixData.map((s) => [
      `"${s.sector}"`,
      s.totalEmps,
      s.maxNps > 0 ? s.maxNps.toFixed(1) : "-",
      s.grupo1,
      s.grupo2,
      s.grupo3,
      s.grupo4,
      s.totalEmps > 0 ? `${((s.grupo3 / s.totalEmps) * 100).toFixed(1)}%` : "0%",
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `SPPA_Controle_Epidemiologico_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" id="sppa-dashboard-section">
      {/* ------------------------------------------------------------------- */}
      {/* 1. TOP METRIC CARDS: 4 AUDIOMETRIC GROUPS                           */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="sppa-groups-metrics">
        {/* Grupo 1 */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between transition-all hover:border-emerald-300">
          <div className="flex justify-between items-start gap-2">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Grupo 1
              </span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 block leading-tight">
                Audiometrias Normais
              </span>
            </div>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-black text-slate-900 font-display">{grupo1Count}</span>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
              {pct(grupo1Count)}% do total
            </span>
          </div>
        </div>

        {/* Grupo 2 */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between transition-all hover:border-sky-300">
          <div className="flex justify-between items-start gap-2">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Grupo 2
              </span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 block leading-tight">
                Não sugestivo de perda por NPSE
              </span>
            </div>
            <span className="p-1.5 bg-sky-50 text-sky-600 rounded-lg shrink-0">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-black text-slate-900 font-display">{grupo2Count}</span>
            <span className="text-[11px] text-sky-700 font-bold bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
              {pct(grupo2Count)}% do total
            </span>
          </div>
        </div>

        {/* Grupo 3 */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between transition-all hover:border-amber-300">
          <div className="flex justify-between items-start gap-2">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Grupo 3
              </span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 block leading-tight">
                Sugestivo de perda por NPSE
              </span>
            </div>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-black text-slate-900 font-display">{grupo3Count}</span>
            <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
              {pct(grupo3Count)}% do total
            </span>
          </div>
        </div>

        {/* Grupo 4 */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between transition-all hover:border-violet-300">
          <div className="flex justify-between items-start gap-2">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Grupo 4
              </span>
              <span className="text-sm font-bold text-slate-800 mt-0.5 block leading-tight">
                Mudança Temporária de Limiares
              </span>
            </div>
            <span className="p-1.5 bg-violet-50 text-violet-600 rounded-lg shrink-0">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-end justify-between mt-4">
            <span className="text-3xl font-black text-slate-900 font-display">{grupo4Count}</span>
            <span className="text-[11px] text-violet-700 font-bold bg-violet-50 px-2.5 py-1 rounded-md border border-violet-100">
              {pct(grupo4Count)}% do total
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. DYNAMIC SECTOR PIE CHART (Request 8) & RISK FACTORS (Request 14) */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="sppa-interactive-charts">
        {/* Dynamic Sector Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-600" />
                Distribuição dos 4 Grupos por Setor
              </h3>
            </div>

            {/* Dynamic Sector Selector (Request 8) */}
            <div className="shrink-0">
              <select
                id="dynamic-sector-selector"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full sm:w-auto text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer shadow-xs"
              >
                <option value="TODOS">Todos os Setores ({employees.length} trab.)</option>
                {uniqueSectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex-1 flex flex-col justify-center">
            <PieChart
              title={`Setor: ${selectedSector === "TODOS" ? "Todos os Setores" : selectedSector}`}
              data={dynamicSectorPieData}
              centerLabel="Trabalhadores"
              centerValue={sectorFilteredEmployees.length.toString()}
            />
          </div>
        </div>

        {/* Perda Auditiva x Fatores Associados e Comorbidades (Request 14) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-rose-500" />
              Perda Auditiva x Alterações & Fatores Clínicos
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Correlação de queixas de zumbido, fones de ouvido, cerúmen e doenças clínicas
            </p>
          </div>

          <div className="pt-4 flex-1 flex flex-col justify-center">
            <PieChart
              title="Fatores de Risco e Comorbidades"
              data={riskFactorsData}
              centerLabel="Ocorrências"
              centerValue={totalRiskFactorsCount.toString()}
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. ROSTER OF EMPLOYEES IN GROUP 3 (Request 10)                      */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4" id="sppa-group3-roster">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-amber-50 text-amber-600 rounded-md">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-800">
              Relação de Colaboradores - Grupo 3 (Sugestivo de perda auditiva por NPSE)
            </h3>
            <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              {group3Employees.length} colaboradores
            </span>
          </div>

          {/* Search in Grupo 3 */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome, crachá..."
              value={group3Search}
              onChange={(e) => setGroup3Search(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700 min-w-[750px]">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Colaborador</th>
                <th className="py-2.5 px-3">Setor / Função</th>
                <th className="py-2.5 px-3">Ruído (NPS)</th>
                <th className="py-2.5 px-3">Parecer Fonoaudiológico</th>
                <th className="py-2.5 px-3">EPI Vigente</th>
                <th className="py-2.5 px-3">Anexo II NR-7</th>
                <th className="py-2.5 px-3">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGroup3.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Nenhum colaborador do Grupo 3 encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredGroup3.map((emp) => (
                  <tr key={emp.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{emp.nome}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Crachá: {emp.cracha}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-800">{emp.local}</div>
                      <div className="text-[10px] text-slate-500">{emp.cargo}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        (emp.npsDb || 0) >= 85
                          ? "bg-rose-100 text-rose-700"
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {emp.npsDb ? `${emp.npsDb.toFixed(1)} dB` : "-"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 max-w-[200px]">
                      <div className="text-[11px] font-semibold text-amber-700">
                        {emp.parecerAudiologico || "PAIR"}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate" title={emp.observacao}>
                        {emp.observacao || "Sem observação"}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 max-w-[160px]">
                      <div className="text-[11px] truncate text-slate-800" title={emp.epi}>
                        {emp.epi || "Não especificado"}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        CA: {emp.validadeCa ? emp.validadeCa.slice(0, 7) : "-"}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        emp.avaliacaoAnexoII?.includes("Desencadeamento")
                          ? "bg-rose-100 text-rose-700"
                          : emp.avaliacaoAnexoII?.includes("Agravamento")
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {emp.avaliacaoAnexoII || "Estável"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded">
                        {emp.situacao || "Trabalhando"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4. EXAMES AUDIOMÉTRICOS VENCIDOS (> 30 DIAS) (Request 6)             */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4" id="sppa-overdue-exams">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg shrink-0">
                <CalendarX className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-slate-800">
                Exames Audiométricos Vencidos (&gt; 30 dias)
              </h3>
              <span className="text-[11px] font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full border border-rose-200">
                {overdueExamsData.length} exames em atraso
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-[11px] text-slate-500 font-semibold">Critérios de tempo específico:</span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                Almoxarifado: Bienal (24m)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200 font-medium">
                Administrativo: Bienal (24m)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-violet-50 text-violet-800 border border-violet-200 font-medium">
                Mudança Temporária de Limiar: Reteste (15-30d)
              </span>
            </div>
          </div>

          {/* Search in Overdue Exams */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por crachá, nome, setor..."
              value={overdueSearch}
              onChange={(e) => setOverdueSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Overdue Exams Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700 min-w-[780px]">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Crachá</th>
                <th className="py-2.5 px-3">Nome</th>
                <th className="py-2.5 px-3">Cargo</th>
                <th className="py-2.5 px-3">Setor</th>
                <th className="py-2.5 px-3 text-center">Dias Vencidos</th>
                <th className="py-2.5 px-3">Tempo Específico Marcado</th>
                <th className="py-2.5 px-3">Último Exame</th>
                <th className="py-2.5 px-3">Ação Recomendada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOverdueExams.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Nenhum exame com vencimento superior a 30 dias encontrado.
                  </td>
                </tr>
              ) : (
                filteredOverdueExams.map((item) => (
                  <tr key={item.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      {item.cracha}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {item.nome}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {item.cargo}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-medium text-slate-800">{item.setor}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-flex items-center justify-center font-bold px-2.5 py-1 rounded-full text-[11px] ${
                        item.diasVencidos >= 90
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}>
                        +{item.diasVencidos} dias
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs border ${item.tempoEspecificoBadgeClass}`}>
                        {item.tempoEspecificoLabel}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                      <div>Exame: {item.dataUltimoExame}</div>
                      <div className="text-[10px] text-rose-600 font-semibold">Prev: {item.dataPrevistaRetorno}</div>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] font-medium text-slate-700">
                      {item.acaoRecomendada}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 5. SPPA - CRONOGRAMA (Requests 5 and 7)                              */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4" id="sppa-monthly-actions">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              SPPA - Cronograma
            </h3>
          </div>

          {/* Month Quick Tabs / Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedMonthFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedMonthFilter === "ALL"
                  ? "bg-sky-500 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Todos (12 Meses)
            </button>
            {[
              { num: 1, name: "Jan" },
              { num: 2, name: "Fev" },
              { num: 3, name: "Mar" },
              { num: 4, name: "Abr" },
              { num: 5, name: "Mai" },
              { num: 6, name: "Jun" },
              { num: 7, name: "Jul" },
              { num: 8, name: "Ago" },
              { num: 9, name: "Set" },
              { num: 10, name: "Out" },
              { num: 11, name: "Nov" },
              { num: 12, name: "Dez" },
            ].map((m) => (
              <button
                key={m.num}
                onClick={() => setSelectedMonthFilter(m.num)}
                className={`px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedMonthFilter === m.num
                    ? "bg-sky-500 text-white font-bold shadow-xs"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/50"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Actions Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredActions.map((action, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {action.mes}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      action.status === "Concluído"
                        ? "bg-emerald-100 text-emerald-700"
                        : action.status === "Em Andamento"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {action.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-800 leading-snug">
                  {action.titulo}
                </h4>

                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  {action.descricao}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/70 text-[10px] text-slate-400 space-y-0.5">
                <div>
                  <strong className="text-slate-600">Público:</strong> {action.publicoAlvo}
                </div>
                <div>
                  <strong className="text-slate-600">Responsável:</strong> {action.responsavel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 6. CONTROLE EPIDEMIOLÓGICO (Requests 8 and 9)                       */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-sky-50 text-sky-600 rounded-lg shrink-0">
                <FileSpreadsheet className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-slate-800">
                Controle Epidemiológico
              </h3>
            </div>

            {/* Legend for dB colors (Request 9) */}
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Cores por Ruído (dB):</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Até 79 dB (Sem nível de ação - Verde)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                80 a 84.9 dB (Com nível de ação - Amarela)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                A partir de 85 dB (Limite de tolerância - Vermelha)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Toggle GHE vs Setor */}
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-[11px] font-semibold">
              <button
                onClick={() => setControlViewType("ghe")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  controlViewType === "ghe"
                    ? "bg-white text-slate-800 shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Por GHE &amp; Cores dB
              </button>
              <button
                onClick={() => setControlViewType("setor")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  controlViewType === "setor"
                    ? "bg-white text-slate-800 shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Por Setor
              </button>
            </div>

            {/* View Mode Selector */}
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-[11px] font-semibold">
              <button
                onClick={() => setViewMode("both")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === "both"
                    ? "bg-white text-slate-800 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Completo
              </button>
              <button
                onClick={() => setViewMode("spreadsheet")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === "spreadsheet"
                    ? "bg-white text-slate-800 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Planilha
              </button>
              <button
                onClick={() => setViewMode("charts")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === "charts"
                    ? "bg-white text-slate-800 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                EPIs
              </button>
            </div>

            {/* CSV Export Button */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200/50 transition-colors text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Spreadsheet Component */}
        {(viewMode === "spreadsheet" || viewMode === "both") && (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            {controlViewType === "ghe" ? (
              /* GHE view with color-coded rows per dB (Request 9) */
              <table className="w-full text-left text-xs min-w-[780px]">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">GHE / GES</th>
                    <th className="py-3 px-3">Grupo Vinculado</th>
                    <th className="py-3 px-3">Função / Posto de Trabalho</th>
                    <th className="py-3 px-3 text-center">Ruído (dB)</th>
                    <th className="py-3 px-3 text-center">Classificação de Ruído</th>
                    <th className="py-3 px-3 text-center">Grupo 1 (Normais)</th>
                    <th className="py-3 px-3 text-center">Grupo 2 (Não-NPSE)</th>
                    <th className="py-3 px-3 text-center">Grupo 3 (PAIR)</th>
                    <th className="py-3 px-3 text-center">Grupo 4 (MTL)</th>
                    <th className="py-3 px-3 text-center font-black">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80">
                  {gheMatrixData.map((item) => (
                    <tr key={item.id} className={`${item.rowColorClass} transition-colors`}>
                      <td className="py-3 px-3 font-mono font-black text-sm">
                        {item.gesNumero}
                      </td>
                      <td className="py-3 px-3 font-bold">
                        <span className="inline-block">{item.grupoVinculado}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold">{item.funcaoGes}</div>
                        <div className="text-[11px] opacity-75">{item.setor}</div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-black border ${item.dbBadgeClass}`}>
                          {item.db.toFixed(1)} dB
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-[11px] font-bold">
                          {item.faixaRuido}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-800">
                        {item.g1}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-sky-800">
                        {item.g2}
                      </td>
                      <td className="py-3 px-3 text-center font-black text-rose-800">
                        {item.g3}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-violet-800">
                        {item.g4}
                      </td>
                      <td className="py-3 px-3 text-center font-black text-slate-900 text-sm">
                        {item.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* Sector View */
              <table className="w-full text-left text-xs text-slate-700 min-w-[700px]">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Setor Operacional</th>
                    <th className="py-2.5 px-3 text-center">GHEs</th>
                    <th className="py-2.5 px-3 text-center">Ruído Máx (dB)</th>
                    <th className="py-2.5 px-3 text-center text-emerald-700">Grupo 1 (Normais)</th>
                    <th className="py-2.5 px-3 text-center text-sky-700">Grupo 2 (Não-NPSE)</th>
                    <th className="py-2.5 px-3 text-center text-amber-700">Grupo 3 (PAIR)</th>
                    <th className="py-2.5 px-3 text-center text-violet-700">Grupo 4 (MTL)</th>
                    <th className="py-2.5 px-3 text-center font-bold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sectorMatrixData.map((sec, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{sec.sector}</td>
                      <td className="py-2.5 px-3 text-center text-slate-500">{sec.gheCount || 1}</td>
                      <td className="py-2.5 px-3 text-center font-mono">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            sec.maxNps >= 85
                              ? "bg-rose-100 text-rose-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {sec.maxNps > 0 ? `${sec.maxNps.toFixed(1)} dB` : "-"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold text-emerald-700">{sec.grupo1}</td>
                      <td className="py-2.5 px-3 text-center font-semibold text-sky-700">{sec.grupo2}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-amber-700 bg-amber-50/40">
                        {sec.grupo3}
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold text-violet-700">{sec.grupo4}</td>
                      <td className="py-2.5 px-3 text-center font-black text-slate-900">{sec.totalEmps}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* EPI Distribution Pie Chart */}
        {(viewMode === "charts" || viewMode === "both") && (
          <div className="pt-2">
            <PieChart
              title="Distribuição de EPIs por Tipo"
              data={epiPieData}
              centerLabel="EPIs"
              centerValue={totalEmployees.toString()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
