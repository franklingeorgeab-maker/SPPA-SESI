/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Company, Responsible, EPI, GHE, Employee } from "./types";
import {
  DEFAULT_COMPANY,
  DEFAULT_RESPONSIBLE,
  DEFAULT_EPIS,
  DEFAULT_GHES,
  DEFAULT_EMPLOYEES,
} from "./data/defaults";

// Sub-components
import Dashboard from "./components/Dashboard";
import CompanyProfile from "./components/CompanyProfile";
import EPIManager from "./components/EPIManager";
import GHEManager from "./components/GHEManager";
import EmployeeManager from "./components/EmployeeManager";
import SPPAReport from "./components/SPPAReport";
import AbnormalReport from "./components/AbnormalReport";

// Icons & Animation
import {
  BarChart3,
  Building2,
  Shield,
  ShieldCheck,
  Users,
  FileText,
  RotateCcw,
  Sparkles,
  Award,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type TabID = "dashboard" | "company" | "epis" | "ghes" | "employees" | "report" | "abnormal";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabID>("dashboard");

  // State Declarations
  const [company, setCompany] = useState<Company>(() => {
    const saved = localStorage.getItem("sppa_company");
    return saved ? JSON.parse(saved) : DEFAULT_COMPANY;
  });

  const [responsible, setResponsible] = useState<Responsible>(() => {
    const saved = localStorage.getItem("sppa_responsible");
    return saved ? JSON.parse(saved) : DEFAULT_RESPONSIBLE;
  });

  const [epis, setEpis] = useState<EPI[]>(() => {
    const saved = localStorage.getItem("sppa_epis");
    return saved ? JSON.parse(saved) : DEFAULT_EPIS;
  });

  const [ghes, setGhes] = useState<GHE[]>(() => {
    const saved = localStorage.getItem("sppa_ghes");
    return saved ? JSON.parse(saved) : DEFAULT_GHES;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem("sppa_employees");
    return saved ? JSON.parse(saved) : DEFAULT_EMPLOYEES;
  });

  // Effects to synchronize with localStorage
  useEffect(() => {
    localStorage.setItem("sppa_company", JSON.stringify(company));
  }, [company]);

  useEffect(() => {
    localStorage.setItem("sppa_responsible", JSON.stringify(responsible));
  }, [responsible]);

  useEffect(() => {
    localStorage.setItem("sppa_epis", JSON.stringify(epis));
  }, [epis]);

  useEffect(() => {
    localStorage.setItem("sppa_ghes", JSON.stringify(ghes));
  }, [ghes]);

  useEffect(() => {
    localStorage.setItem("sppa_employees", JSON.stringify(employees));
  }, [employees]);

  // Global Reset / Restore Demo Data handler
  const handleResetDemoData = () => {
    if (
      confirm(
        "Atenção: Isso irá redefinir todas as informações e carregar os dados de simulação padrão da Fundacentro. Continuar?"
      )
    ) {
      setCompany(DEFAULT_COMPANY);
      setResponsible(DEFAULT_RESPONSIBLE);
      setEpis(DEFAULT_EPIS);
      setGhes(DEFAULT_GHES);
      setEmployees(DEFAULT_EMPLOYEES);
      setActiveTab("dashboard");
      alert("Dados de simulação reestabelecidos com sucesso!");
    }
  };

  // State Mutators
  const handleAddEPI = (epi: EPI) => {
    setEpis((prev) => [...prev, epi]);
  };

  const handleUpdateEPI = (updatedEpi: EPI) => {
    setEpis((prev) => prev.map((e) => (e.id === updatedEpi.id ? updatedEpi : e)));
  };

  const handleDeleteEPI = (id: string) => {
    setEpis((prev) => prev.filter((e) => e.id !== id));
  };

  const handleAddGHE = (ghe: GHE) => {
    setGhes((prev) => [...prev, ghe]);
  };

  const handleUpdateGHE = (updatedGhe: GHE) => {
    setGhes((prev) => prev.map((g) => (g.id === updatedGhe.id ? updatedGhe : g)));
  };

  const handleDeleteGHE = (id: string) => {
    setGhes((prev) => prev.filter((g) => g.id !== id));
  };

  const handleAddEmployee = (emp: Employee) => {
    setEmployees((prev) => [...prev, emp]);
  };

  const handleUpdateEmployee = (updatedEmp: Employee) => {
    setEmployees((prev) => prev.map((e) => (e.id === updatedEmp.id ? updatedEmp : e)));
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const handleBulkImportEmployees = (imported: Employee[]) => {
    setEmployees((prev) => [...prev, ...imported]);
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#f1f5f9] text-[#1e293b] flex flex-col lg:flex-row font-sans" id="sppa-root">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-[#0f172a] text-white flex flex-col no-print shrink-0 border-r border-slate-800 shadow-xl" id="sppa-navigation">
        {/* Sidebar Brand/Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-white italic shadow-md shadow-sky-500/20">
            S
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white block">
              SPPA <span className="font-light opacity-60 text-xs italic">PCA Manager</span>
            </span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 block mb-2">
            Módulos de Controle
          </span>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "dashboard"
                ? "bg-sky-500/10 text-sky-400 border-l-4 border-sky-500 pl-2.5"
                : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
            }`}
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            Dashboard Geral
          </button>

          <button
            onClick={() => setActiveTab("company")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "company"
                ? "bg-sky-500/10 text-sky-400 border-l-4 border-sky-500 pl-2.5"
                : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            Dados da Empresa
          </button>

          <button
            onClick={() => setActiveTab("epis")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "epis"
                ? "bg-sky-500/10 text-sky-400 border-l-4 border-sky-500 pl-2.5"
                : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
            }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            Equipamentos (EPI)
          </button>

          <button
            onClick={() => setActiveTab("ghes")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "ghes"
                ? "bg-sky-500/10 text-sky-400 border-l-4 border-sky-500 pl-2.5"
                : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            GHE / GES Mapeados
          </button>

          <button
            onClick={() => setActiveTab("employees")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "employees"
                ? "bg-sky-500/10 text-sky-400 border-l-4 border-sky-500 pl-2.5"
                : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            Funcionários (Roster)
          </button>

          <div className="pt-4 border-t border-slate-800 mt-4 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 block mb-2">
              Relatórios Oficiais
            </span>

            <button
              onClick={() => setActiveTab("report")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "report"
                  ? "bg-sky-500/10 text-sky-400 border-l-4 border-sky-500 pl-2.5"
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              Documento Base SPPA
            </button>

            <button
              onClick={() => setActiveTab("abnormal")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "abnormal"
                  ? "bg-sky-500/10 text-sky-400 border-l-4 border-sky-500 pl-2.5"
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
              }`}
            >
              <Activity className="w-4 h-4 shrink-0" />
              Gerenciamento Audiométrico
            </button>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0b1120]">
          <div className="text-[9px] text-slate-500 uppercase font-bold mb-2 tracking-widest">Empresa Ativa</div>
          <div className="bg-[#1e293b]/60 border border-slate-800 rounded-xl p-3">
            <p className="text-xs font-semibold text-white truncate">{company.razaoSocial}</p>
            <p className="text-[9px] text-slate-400 mt-0.5">CNPJ: {company.cnpj}</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 no-print z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-base md:text-lg font-bold text-slate-800 font-display">
              {activeTab === "dashboard" && "Visão Geral do Programa"}
              {activeTab === "company" && "Cadastro da Empresa & Responsável Técnico"}
              {activeTab === "epis" && "Catálogo de Equipamentos de Proteção"}
              {activeTab === "ghes" && "Mapeamento de Riscos e GHE/GES"}
              {activeTab === "employees" && "Quadro de Funcionários"}
              {activeTab === "report" && "Relatório Regulamentar SPPA"}
              {activeTab === "abnormal" && "Gerenciamento Audiométrico"}
            </h1>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold uppercase shrink-0">
              STATUS: ATIVO
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetDemoData}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors font-semibold text-xs shrink-0"
              title="Restaurar dados padrão de teste para visualização"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Resetar Demo
            </button>

            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

            <div className="text-right hidden md:block">
              <p className="text-xs font-bold leading-tight text-slate-800">{responsible.nome}</p>
              <p className="text-[10px] text-slate-500">Resp. Segurança (CONSELHO: {responsible.conselho})</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
              {responsible.nome ? responsible.nome.substring(0, 2).toUpperCase() : "RM"}
            </div>
          </div>
        </header>

        {/* Dynamic Panel Workspace */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto lg:overflow-y-auto print:overflow-visible">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {activeTab === "dashboard" && (
                <Dashboard employees={employees} ghes={ghes} epis={epis} />
              )}

              {activeTab === "company" && (
                <CompanyProfile
                  company={company}
                  responsible={responsible}
                  onUpdateCompany={setCompany}
                  onUpdateResponsible={setResponsible}
                />
              )}

              {activeTab === "epis" && (
                <EPIManager
                  epis={epis}
                  onAddEPI={handleAddEPI}
                  onUpdateEPI={handleUpdateEPI}
                  onDeleteEPI={handleDeleteEPI}
                />
              )}

              {activeTab === "ghes" && (
                <GHEManager
                  ghes={ghes}
                  epis={epis}
                  onAddGHE={handleAddGHE}
                  onUpdateGHE={handleUpdateGHE}
                  onDeleteGHE={handleDeleteGHE}
                />
              )}

              {activeTab === "employees" && (
                <EmployeeManager
                  employees={employees}
                  ghes={ghes}
                  epis={epis}
                  onAddEmployee={handleAddEmployee}
                  onUpdateEmployee={handleUpdateEmployee}
                  onDeleteEmployee={handleDeleteEmployee}
                  onBulkImport={handleBulkImportEmployees}
                />
              )}

              {activeTab === "report" && (
                <SPPAReport
                  company={company}
                  responsible={responsible}
                  epis={epis}
                  ghes={ghes}
                  employees={employees}
                />
              )}

              {activeTab === "abnormal" && (
                <AbnormalReport
                  employees={employees}
                  company={company}
                  responsible={responsible}
                  onUpdateEmployee={handleUpdateEmployee}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
