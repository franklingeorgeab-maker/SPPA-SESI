/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Company, Responsible, EPI, GHE, Employee } from "./types";
import {
  DEFAULT_COMPANIES,
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
  Activity,
  Menu,
  X,
  ChevronDown,
  Check,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type TabID = "dashboard" | "company" | "epis" | "ghes" | "employees" | "report" | "abnormal";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabID>("dashboard");

  // Mobile drawer state (Request 2: Mobile / Tablet responsive)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Empresa Ativa dropdown state (Request 17)
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef<HTMLDivElement>(null);

  // List of registered companies for quick switching (Request 17)
  const [companiesList, setCompaniesList] = useState<Company[]>(() => {
    const saved = localStorage.getItem("sppa_companies_list");
    return saved ? JSON.parse(saved) : DEFAULT_COMPANIES;
  });

  // Active Company State
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
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 4) return parsed;
      } catch (_) {}
    }
    return DEFAULT_GHES;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem("sppa_employees");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((e: Employee) => e.cracha === "M0210" || e.local?.includes("Administrativo"))) {
          return parsed;
        }
      } catch (_) {}
    }
    return DEFAULT_EMPLOYEES;
  });

  // Synchronize storage
  useEffect(() => {
    localStorage.setItem("sppa_company", JSON.stringify(company));
  }, [company]);

  useEffect(() => {
    localStorage.setItem("sppa_companies_list", JSON.stringify(companiesList));
  }, [companiesList]);

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

  // Click outside to close Empresa Ativa dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        companyDropdownRef.current &&
        !companyDropdownRef.current.contains(event.target as Node)
      ) {
        setCompanyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // When active company updates, also synchronize in companiesList
  const handleUpdateCompany = (updatedCompany: Company) => {
    setCompany(updatedCompany);
    setCompaniesList((prev) => {
      const idx = prev.findIndex((c) => c.cnpj === updatedCompany.cnpj);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedCompany;
        return copy;
      }
      return [...prev, updatedCompany];
    });
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

  const navigationItems = [
    {
      id: "dashboard" as TabID,
      label: "Dashboard Geral",
      icon: BarChart3,
    },
    {
      id: "company" as TabID,
      label: "Dados da Empresa",
      icon: Building2,
    },
    {
      id: "epis" as TabID,
      label: "Equipamentos (EPI)",
      icon: Shield,
    },
    {
      id: "ghes" as TabID,
      label: "GHE / GES Mapeados",
      icon: ShieldCheck,
    },
    {
      id: "employees" as TabID,
      label: "Funcionários",
      icon: Users,
    },
  ];

  const officialReportItems = [
    {
      id: "report" as TabID,
      label: "Documento Base SPPA",
      icon: FileText,
    },
    {
      id: "abnormal" as TabID,
      label: "Gerenciamento Audiométrico",
      icon: Activity,
    },
  ];

  const handleTabSelect = (tab: TabID) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div
      className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#f1f5f9] text-[#1e293b] flex flex-col lg:flex-row font-sans"
      id="sppa-root"
    >
      {/* ------------------------------------------------------------------- */}
      {/* MOBILE / TABLET BACKDROP OVERLAY                                    */}
      {/* ------------------------------------------------------------------- */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SIDEBAR NAVIGATION (Desktop & Responsive Mobile Drawer)              */}
      {/* ------------------------------------------------------------------- */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-[#0f172a] text-white flex flex-col no-print shrink-0 border-r border-slate-800 shadow-xl transform transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        id="sppa-navigation"
      >
        {/* Sidebar Brand/Header (Item 6) */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-sky-500 rounded-xl flex items-center justify-center font-black text-white italic shadow-md shadow-sky-500/20 text-sm">
              S
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block">
                SPPA
              </span>
              <span className="text-[10px] text-slate-400 block leading-tight">
                Sistema de Prevenção de Perdas Auditivas
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 block mb-2">
            Módulos de Controle
          </span>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-sky-500/10 text-sky-400 border-l-4 border-sky-500 pl-2.5"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-800 mt-4 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 block mb-2">
              Relatórios Oficiais
            </span>

            {officialReportItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-sky-500/10 text-sky-400 border-l-4 border-sky-500 pl-2.5"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0b1120]">
          <div className="text-[9px] text-slate-400 uppercase font-bold mb-1.5 tracking-widest flex items-center justify-between">
            <span>Empresa Ativa</span>
            <span>{company.logo || "🏢"}</span>
          </div>
          <div className="bg-[#1e293b]/70 border border-slate-800 rounded-xl p-2.5">
            <p className="text-xs font-semibold text-white truncate">{company.razaoSocial}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">CNPJ: {company.cnpj}</p>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA                                                   */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header (Cleaned up as per Requests 6, 15, 16, 17, 18) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 no-print z-20 shadow-xs relative">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger button for mobile/tablet */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Abrir menu de navegação"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Application Title (Request 6) */}
            <div className="flex items-center gap-2 truncate">
              <div className="w-7 h-7 bg-sky-500 rounded-lg flex items-center justify-center font-bold text-white italic text-xs shrink-0 shadow-xs">
                S
              </div>
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-800 font-display truncate">
                SPPA - Sistema de Prevenção de Perdas Auditivas
              </h1>
            </div>
          </div>

          {/* Empresa Ativa Selector in Header (Request 17) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative" ref={companyDropdownRef}>
              <button
                onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all text-xs text-slate-700 font-medium cursor-pointer shadow-xs"
                title="Clique para alternar de empresa ativa"
              >
                <span className="text-base shrink-0">{company.logo || "🏢"}</span>
                <div className="text-left hidden sm:block max-w-[180px] md:max-w-[260px]">
                  <div className="text-[9px] font-bold text-sky-600 uppercase tracking-wider leading-none">
                    Empresa Ativa
                  </div>
                  <div className="font-bold text-slate-800 text-xs truncate mt-0.5">
                    {company.razaoSocial}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-0.5" />
              </button>

              {/* Dropdown Menu */}
              {companyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 space-y-1">
                  <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex justify-between items-center">
                    <span>Alternar Empresa Ativa</span>
                    <Building2 className="w-3.5 h-3.5 text-sky-500" />
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-1 pt-1">
                    {companiesList.map((c) => {
                      const isSelected = c.cnpj === company.cnpj;
                      return (
                        <button
                          key={c.cnpj}
                          onClick={() => {
                            setCompany(c);
                            setCompanyDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                            isSelected
                              ? "bg-sky-50 border border-sky-200 text-sky-900"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <span className="text-lg mt-0.5 shrink-0">{c.logo || "🏢"}</span>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs truncate">{c.razaoSocial}</div>
                            <div className="text-[10px] text-slate-400 font-mono">CNPJ: {c.cnpj}</div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {c.cidade}/{c.uf} &bull; {c.grauRisco}
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-sky-600 shrink-0 mt-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-100 pt-1.5 mt-1">
                    <button
                      onClick={() => {
                        setActiveTab("company");
                        setCompanyDropdownOpen(false);
                      }}
                      className="w-full text-center py-2 px-3 text-xs font-bold text-sky-600 hover:bg-sky-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Gerenciar / Cadastrar Empresa
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Panel Workspace */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto lg:overflow-y-auto print:overflow-visible">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
              className="h-full"
            >
              {activeTab === "dashboard" && (
                <Dashboard
                  employees={employees}
                  ghes={ghes}
                  epis={epis}
                  onUpdateEmployee={handleUpdateEmployee}
                />
              )}

              {activeTab === "company" && (
                <CompanyProfile
                  company={company}
                  responsible={responsible}
                  onUpdateCompany={handleUpdateCompany}
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
