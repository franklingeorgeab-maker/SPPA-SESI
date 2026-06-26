/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Employee, GHE, EPI, PARECER_AUDIOLOGICO_OPTIONS, AVALIACAO_ANEXO_II_OPTIONS, STATUS_OPTIONS, SITUACAO_TRABALHADOR_OPTIONS, RETESTE_OPTIONS, AUDITORIA_OPTIONS, SITUACAO_AUDITORIA_OPTIONS, INADEQUACAO_AUDITORIA_OPTIONS, TIPO_EXAME_OPTIONS } from "../types";
import { Users, Plus, Edit2, Trash2, Search, Filter, Upload, Download, ClipboardCheck, AlertTriangle, CheckCircle, FileSpreadsheet, X } from "lucide-react";

interface EmployeeManagerProps {
  employees: Employee[];
  ghes: GHE[];
  epis: EPI[];
  onAddEmployee: (emp: Employee) => void;
  onUpdateEmployee: (emp: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  onBulkImport: (emps: Employee[]) => void;
}

export default function EmployeeManager({
  employees,
  ghes,
  epis,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onBulkImport,
}: EmployeeManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [gheFilter, setGheFilter] = useState("");
  const [parecerFilter, setParecerFilter] = useState("");
  const [auditoriaFilter, setAuditoriaFilter] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");

  const calculateIdade = (birthDateStr: string) => {
    if (!birthDateStr) return 30;
    try {
      const birthYear = new Date(birthDateStr).getFullYear();
      const currentYear = new Date().getFullYear();
      if (!isNaN(birthYear) && birthYear > 1900) {
        return Math.max(18, Math.min(85, currentYear - birthYear));
      }
    } catch (e) {}
    return 30;
  };

  const calculateDataRetorno = (examDateStr: string) => {
    if (!examDateStr) return "";
    try {
      const d = new Date(examDateStr);
      if (!isNaN(d.getTime())) {
        d.setFullYear(d.getFullYear() + 1);
        return d.toISOString().split("T")[0];
      }
    } catch (e) {}
    return "";
  };

  // Form State
  const [formState, setFormState] = useState<Omit<Employee, "id">>({
    cracha: "",
    nome: "",
    idade: 30,
    admissao: "",
    nasc: "",
    cpf: "",
    local: "",
    cargo: "",
    escala: "",
    
    // GES
    gheId: "",
    localGes: "",
    funcaoGes: "",
    npsDb: 0,

    // EPI
    protetorVigenteId: "",
    epi: "",
    nrrsf: 0,
    validadeCa: "",
    dataEntrega: "",
    dataEntregaPrototor: "",
    validade: "",
    validadeProtetor: "",

    // Clinical & Audiometry
    dataExameReferencia: "",
    tipoExameReferencia: "Admissional",
    dataExame: "",
    dataExameAtual: "",
    tipoExameAtual: "Periódico",
    parecerAudiologico: "Limiares Auditivos Normais (LNA)",
    parecerOrelhaDireita: "Limiares Auditivos Normais (LNA)",
    parecerOrelhaEsquerda: "Limiares Auditivos Normais (LNA)",
    avaliacaoAnexoII: "Estável",
    observacao: "",
    reteste: "Não necessário",
    dataPrevistaRetorno: "",
    statusAudiometrico: "Estável",
    situacao: "Trabalhando",
    situacaoTrabalhador: "Trabalhando",

    // Auditoria
    auditoria: "Pendente",
    auditoriaData: "",
    situacaoAuditoria: "Conforme",
    auditoriaSituacao: "Conforme",
    inadequacaoAuditoria: "Nenhuma",
    auditoriaInadequacao: "Nenhuma",
    auditoriaVencimento: "",

    // Treinamento
    dataTreinamento: "",
    dataRetreinamento: "",
    horarioTreinamento: "",
    localTreinamento: "",
  });

  const resetForm = () => {
    setFormState({
      cracha: "",
      nome: "",
      idade: 30,
      admissao: "",
      nasc: "",
      cpf: "",
      local: "",
      cargo: "",
      escala: "",
      gheId: "",
      localGes: "",
      funcaoGes: "",
      npsDb: 0,
      protetorVigenteId: "",
      epi: "",
      nrrsf: 0,
      validadeCa: "",
      dataEntrega: "",
      dataEntregaPrototor: "",
      validade: "",
      validadeProtetor: "",
      dataExameReferencia: "",
      tipoExameReferencia: "Admissional",
      dataExame: "",
      dataExameAtual: "",
      tipoExameAtual: "Periódico",
      parecerAudiologico: "Limiares Auditivos Normais (LNA)",
      parecerOrelhaDireita: "Limiares Auditivos Normais (LNA)",
      parecerOrelhaEsquerda: "Limiares Auditivos Normais (LNA)",
      avaliacaoAnexoII: "Estável",
      observacao: "",
      reteste: "Não necessário",
      dataPrevistaRetorno: "",
      statusAudiometrico: "Estável",
      situacao: "Trabalhando",
      situacaoTrabalhador: "Trabalhando",
      auditoria: "Pendente",
      auditoriaData: "",
      situacaoAuditoria: "Conforme",
      auditoriaSituacao: "Conforme",
      inadequacaoAuditoria: "Nenhuma",
      auditoriaInadequacao: "Nenhuma",
      auditoriaVencimento: "",
      dataTreinamento: "",
      dataRetreinamento: "",
      horarioTreinamento: "",
      localTreinamento: "",
    });
    setIsEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setFormState({
      cracha: emp.cracha || "",
      nome: emp.nome || "",
      idade: emp.idade || calculateIdade(emp.nasc),
      admissao: emp.admissao || "",
      nasc: emp.nasc || "",
      cpf: emp.cpf || "",
      local: emp.local || "",
      cargo: emp.cargo || "",
      escala: emp.escala || "",
      gheId: emp.gheId || "",
      localGes: emp.localGes || "",
      funcaoGes: emp.funcaoGes || "",
      npsDb: emp.npsDb || 0,
      protetorVigenteId: emp.protetorVigenteId || "",
      epi: emp.epi || "",
      nrrsf: emp.nrrsf || 0,
      validadeCa: emp.validadeCa || "",
      dataEntrega: emp.dataEntrega || "",
      dataEntregaProtetor: emp.dataEntregaProtetor || emp.dataEntrega || "",
      validade: emp.validade || "",
      validadeProtetor: emp.validadeProtetor || emp.validade || "",
      dataExameReferencia: emp.dataExameReferencia || emp.admissao || "",
      tipoExameReferencia: emp.tipoExameReferencia || "Admissional",
      dataExame: emp.dataExame || emp.dataExameAtual || "",
      dataExameAtual: emp.dataExameAtual || emp.dataExame || "",
      tipoExameAtual: emp.tipoExameAtual || "Periódico",
      parecerAudiologico: emp.parecerAudiologico || "Limiares Auditivos Normais (LNA)",
      parecerOrelhaDireita: emp.parecerOrelhaDireita || emp.parecerAudiologico || "Limiares Auditivos Normais (LNA)",
      parecerOrelhaEsquerda: emp.parecerOrelhaEsquerda || "Limiares Auditivos Normais (LNA)",
      avaliacaoAnexoII: emp.avaliacaoAnexoII || "Estável",
      observacao: emp.observacao || "",
      reteste: emp.reteste || "Não necessário",
      dataPrevistaRetorno: emp.dataPrevistaRetorno || calculateDataRetorno(emp.dataExame || emp.dataExameAtual),
      statusAudiometrico: emp.statusAudiometrico || "Estável",
      situacao: emp.situacao || "Trabalhando",
      situacaoTrabalhador: emp.situacaoTrabalhador || "Trabalhando",
      auditoria: emp.auditoria || "Pendente",
      auditoriaData: emp.auditoriaData || "",
      situacaoAuditoria: emp.situacaoAuditoria || "Conforme",
      auditoriaSituacao: emp.auditoriaSituacao || emp.situacaoAuditoria || "Conforme",
      inadequacaoAuditoria: emp.inadequacaoAuditoria || "Nenhuma",
      auditoriaInadequacao: emp.auditoriaInadequacao || emp.inadequacaoAuditoria || "Nenhuma",
      auditoriaVencimento: emp.auditoriaVencimento || "",
      dataTreinamento: emp.dataTreinamento || "",
      dataRetreinamento: emp.dataRetreinamento || "",
      horarioTreinamento: emp.horarioTreinamento || "",
      localTreinamento: emp.localTreinamento || "",
    });
    setIsEditingId(emp.id);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.nome || !formState.cpf || !formState.cracha) {
      alert("Por favor, preencha Crachá, Nome e CPF.");
      return;
    }

    // Auto-calculate dynamic values if empty before submitting
    const finalIdade = formState.idade || calculateIdade(formState.nasc);
    const finalRetorno = formState.dataPrevistaRetorno || calculateDataRetorno(formState.dataExameAtual || formState.dataExame);

    const completeFormState = {
      ...formState,
      idade: finalIdade,
      dataPrevistaRetorno: finalRetorno,
      dataExame: formState.dataExameAtual || formState.dataExame,
      dataEntrega: formState.dataEntregaPrototor || formState.dataEntrega,
      validade: formState.validadeProtetor || formState.validade,
      situacaoAuditoria: formState.auditoriaSituacao,
      inadequacaoAuditoria: formState.auditoriaInadequacao,
      situacaoTrabalhador: formState.situacao
    };

    if (isEditingId) {
      onUpdateEmployee({ ...completeFormState, id: isEditingId });
    } else {
      onAddEmployee({ ...completeFormState, id: `emp-${Date.now()}` });
    }
    setIsFormOpen(false);
    resetForm();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Excluir permanentemente o registro de "${name}"?`)) {
      onDeleteEmployee(id);
    }
  };

  // CSV paste importer
  const handleCSVImport = () => {
    if (!importText.trim()) {
      setImportError("Insira dados válidos para importação.");
      return;
    }

    try {
      const lines = importText.split("\n");
      const parsedEmployees: Employee[] = [];
      
      // Determine if there is a header line
      let startIndex = 0;
      if (lines[0].toLowerCase().includes("crachá") || lines[0].toLowerCase().includes("nome")) {
        startIndex = 1;
      }

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Splitting by tabs (TSV) or semicolons/commas (CSV)
        const cols = line.split(/\t|;|,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (cols.length < 5) continue;

        // Map column values (safe index access with fallback)
        const cracha = (cols[0] || "").replace(/"/g, "").trim();
        const nome = (cols[1] || "").replace(/"/g, "").trim();
        const admissao = (cols[2] || "").replace(/"/g, "").trim();
        const nasc = (cols[3] || "").replace(/"/g, "").trim();
        const cpf = (cols[4] || "").replace(/"/g, "").trim();
        const local = (cols[5] || "").replace(/"/g, "").trim();
        const cargo = (cols[6] || "").replace(/"/g, "").trim();
        const escala = (cols[7] || "").replace(/"/g, "").trim();
        const protetorVigenteName = (cols[8] || "").replace(/"/g, "").trim();
        const dataEntrega = (cols[9] || "").replace(/"/g, "").trim();
        const validade = (cols[10] || "").replace(/"/g, "").trim();
        const situacao = (cols[11] || "Trabalhando").replace(/"/g, "").trim();
        const gheCode = (cols[12] || "").replace(/"/g, "").trim();

        if (!nome || !cracha) continue;

        // Find matches for GHE and EPI
        const matchedGhe = ghes.find((g) => g.gesNumero.toLowerCase() === gheCode.toLowerCase() || g.id === gheCode) || ghes[0];
        const matchedEpi = epis.find((e) => e.descricao.toLowerCase().includes(protetorVigenteName.toLowerCase()) || e.marca.toLowerCase().includes(protetorVigenteName.toLowerCase()));

        const empAge = calculateIdade(nasc);
        const examDate = "2026-06-15";
        const returnDate = calculateDataRetorno(examDate);

        parsedEmployees.push({
          id: `emp-import-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          cracha,
          nome,
          idade: empAge,
          admissao: admissao || "2026-01-01",
          nasc: nasc || "1990-01-01",
          cpf: cpf || "000.000.000-00",
          local: local || (matchedGhe ? matchedGhe.avaliacaoRiscos : "Produção"),
          cargo: cargo || "Operador",
          escala: escala || "08:00 - 17:00",
          
          // GES
          gheId: matchedGhe ? matchedGhe.id : "",
          localGes: matchedGhe ? matchedGhe.avaliacaoRiscos : "Geral",
          funcaoGes: matchedGhe ? matchedGhe.funcaoGes : cargo || "Operador",
          npsDb: matchedGhe ? matchedGhe.intensidadeConcentracao : 85.0,

          // EPI
          protetorVigenteId: matchedEpi ? matchedEpi.id : (matchedGhe && matchedGhe.epi1Id ? matchedGhe.epi1Id : ""),
          epi: matchedEpi ? matchedEpi.descricao : (matchedGhe && matchedGhe.epi1Id ? "Protetor Integrado" : "Abafador / Plug"),
          nrrsf: matchedEpi ? matchedEpi.nrrsf : 15,
          validadeCa: matchedEpi ? matchedEpi.ca : "2028-12-31",
          dataEntrega: dataEntrega || "2026-01-10",
          dataEntregaProtetor: dataEntrega || "2026-01-10",
          validade: validade || "2026-07-10",
          validadeProtetor: validade || "2026-07-10",

          // Clinical
          dataExameReferencia: admissao || "2026-01-01",
          tipoExameReferencia: "Admissional",
          dataExame: examDate,
          dataExameAtual: examDate,
          tipoExameAtual: "Periódico",
          parecerAudiologico: "Limiares Auditivos Normais (LNA)",
          parecerOrelhaDireita: "Limiares Auditivos Normais (LNA)",
          parecerOrelhaEsquerda: "Limiares Auditivos Normais (LNA)",
          avaliacaoAnexoII: "Estável",
          observacao: "Cadastro mensal importado via planilha.",
          reteste: "Não necessário",
          dataPrevistaRetorno: returnDate,
          statusAudiometrico: "Estável",
          situacao: situacao,
          situacaoTrabalhador: "Trabalhando",

          // Auditoria
          auditoria: "Pendente",
          auditoriaData: "",
          situacaoAuditoria: "Conforme",
          auditoriaSituacao: "Conforme",
          inadequacaoAuditoria: "Nenhuma",
          auditoriaInadequacao: "Nenhuma",
          auditoriaVencimento: "",

          // Treinamento
          dataTreinamento: "",
          dataRetreinamento: "",
          horarioTreinamento: "",
          localTreinamento: "",
        });
      }

      if (parsedEmployees.length === 0) {
        setImportError("Nenhum registro válido pôde ser importado. Verifique os separadores de coluna.");
        return;
      }

      onBulkImport(parsedEmployees);
      setIsImportOpen(false);
      setImportText("");
      setImportError("");
      alert(`${parsedEmployees.length} funcionários importados com sucesso!`);
    } catch (err: any) {
      setImportError(`Erro no processamento: ${err.message}`);
    }
  };

  // Expose sample CSV layout for downloading or copying
  const downloadSampleTemplate = () => {
    const headers = "Crachá\tNome\tAdmissão\tNasc.\tCPF\tLocal\tCargo\tEscala\tProtetor Vigente\tData Entrega\tValidade\tSituação\tGHE\n";
    const row1 = "M0180\tRoberto de Oliveira\t2022-04-12\t1988-06-20\t888.999.555-22\tSetor de Estamparia\tAuxiliar de Prensa\t06:00 - 14:00\tPomps\t2026-01-15\t2026-07-15\tAtivo\tGHE-01\n";
    const row2 = "M0181\tCarla Beatriz Silveira\t2024-03-01\t1995-12-05\t777.666.111-44\tSetor de Soldagem\tSoldador I\t08:00 - 17:00\tPomps\t2026-02-10\t2026-08-10\tAtivo\tGHE-02\n";
    
    setImportText(headers + row1 + row2);
    setImportError("Layout de exemplo copiado para a caixa de texto abaixo! Altere os valores e clique em Importar.");
  };

  // Filtering Logic
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.cracha.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.cpf.includes(searchTerm);
    
    const matchesSector = !sectorFilter || emp.local === sectorFilter;
    
    const matchedGheObj = ghes.find((g) => g.id === emp.gheId);
    const matchesGhe = !gheFilter || emp.gheId === gheFilter || (matchedGheObj && matchedGheObj.gesNumero === gheFilter);
    
    const matchesParecer = !parecerFilter || emp.parecerAudiologico === parecerFilter;
    const matchesAuditoria = !auditoriaFilter || emp.situacaoAuditoria === auditoriaFilter;

    return matchesSearch && matchesSector && matchesGhe && matchesParecer && matchesAuditoria;
  });

  // Extract unique sectors for filters
  const uniqueSectors = Array.from(new Set(employees.map((e) => e.local).filter(Boolean)));

  return (
    <div className="space-y-6" id="employee-manager-section">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 font-display">
            <Users className="text-blue-600 w-6 h-6" />
            Quadro de Funcionários & Audiometria Periódica
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Gerencie os dados dos colaboradores, entregas de EPIs vigentes e o monitoramento clínico ocupacional (Parecer, Anexo II e Auditoria).
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsImportOpen(true)}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3.5 py-2 rounded-lg text-sm transition-all border border-slate-200"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            Importar Planilha
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Funcionário
          </button>
        </div>
      </div>

      {/* CSV Import Simulator Drawer / Panel */}
      {isImportOpen && (
        <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-700 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-md font-semibold font-display flex items-center gap-2 text-blue-400">
              <FileSpreadsheet className="w-5 h-5" />
              Importação Mensal de Planilha
            </h3>
            <button onClick={() => setIsImportOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-xs text-slate-400 space-y-2">
            <p>
              Cole abaixo as linhas copiadas de sua planilha eletrônica (Excel/Google Sheets). Use as colunas nesta ordem exatamente, separadas por tabulação ou ponto-e-vírgula:
            </p>
            <p className="font-mono text-[11px] bg-slate-950 p-2 rounded text-blue-300 border border-slate-800">
              Crachá &nbsp;|&nbsp; Nome &nbsp;|&nbsp; Admissão &nbsp;|&nbsp; Nasc. &nbsp;|&nbsp; CPF &nbsp;|&nbsp; Local &nbsp;|&nbsp; Cargo &nbsp;|&nbsp; Escala &nbsp;|&nbsp; Protetor Vigente &nbsp;|&nbsp; Data Entrega &nbsp;|&nbsp; Validade &nbsp;|&nbsp; Situação &nbsp;|&nbsp; GHE
            </p>
          </div>

          <div>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Cole os dados da planilha aqui..."
              rows={6}
              className="w-full bg-slate-950 text-slate-200 font-mono text-xs p-3 border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {importError && (
              <p className="text-amber-400 text-xs mt-1 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {importError}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
            <button
              onClick={downloadSampleTemplate}
              type="button"
              className="text-blue-400 hover:text-blue-300 underline font-medium flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              Carregar Modelo de Teste
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsImportOpen(false);
                  setImportText("");
                  setImportError("");
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded font-medium text-slate-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleCSVImport}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold"
              >
                Importar Dados
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual CRUD Modal / Drawer */}
      {isFormOpen && (
        <form onSubmit={handleFormSubmit} className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto animate-fade-in text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
              <ClipboardCheck className="w-5.5 h-5.5 text-blue-500" />
              {isEditingId ? "Ficha de Gerenciamento Audiológico - Editar" : "Abertura de Ficha de Gerenciamento Audiológico (SPPA)"}
            </h3>
            <button type="button" onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-800">
              <X className="w-5.5 h-5.5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Section 1: Demographics */}
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-4">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center justify-between">
                <span>1. Identificação do Trabalhador & Cadastro Geral</span>
                <span className="text-slate-500 font-mono normal-case">Cadastro Base</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Crachá / Matrícula *</label>
                  <input
                    type="text"
                    value={formState.cracha}
                    onChange={(e) => setFormState({ ...formState, cracha: e.target.value })}
                    placeholder="Ex: M0015"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500 font-medium"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    value={formState.nome}
                    onChange={(e) => setFormState({ ...formState, nome: e.target.value })}
                    placeholder="Ex: Carlos Eduardo Ferreira"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">CPF *</label>
                  <input
                    type="text"
                    value={formState.cpf}
                    onChange={(e) => setFormState({ ...formState, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    value={formState.nasc}
                    onChange={(e) => {
                      const bDate = e.target.value;
                      setFormState({
                        ...formState,
                        nasc: bDate,
                        idade: calculateIdade(bDate)
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Idade (Calculada)</label>
                  <input
                    type="number"
                    value={formState.idade || ""}
                    onChange={(e) => setFormState({ ...formState, idade: parseInt(e.target.value) || 0 })}
                    placeholder="Ex: 34"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Data de Admissão</label>
                  <input
                    type="date"
                    value={formState.admissao}
                    onChange={(e) => setFormState({ ...formState, admissao: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Situação de Vínculo</label>
                  <select
                    value={formState.situacao}
                    onChange={(e) => setFormState({ ...formState, situacao: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    {SITUACAO_TRABALHADOR_OPTIONS.map((st) => (
                      <option key={st} value={st} className="bg-slate-900">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Setor / Localidade</label>
                  <input
                    type="text"
                    value={formState.local}
                    onChange={(e) => setFormState({ ...formState, local: e.target.value })}
                    placeholder="Ex: Setor de Prensa"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Cargo Atual</label>
                  <input
                    type="text"
                    value={formState.cargo}
                    onChange={(e) => setFormState({ ...formState, cargo: e.target.value })}
                    placeholder="Ex: Operador I"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Escala de Trabalho / Turno</label>
                  <input
                    type="text"
                    value={formState.escala}
                    onChange={(e) => setFormState({ ...formState, escala: e.target.value })}
                    placeholder="Ex: 06:00 - 14:00 (6x2) ou Administrativo"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: GHE/GES Related */}
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-4">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center justify-between">
                <span>2. Grupo de Exposição Ocupacional (GHE / GES Nº)</span>
                <span className="text-slate-500 font-mono normal-case">Higiene Ocupacional</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">GHE / GES Referência *</label>
                  <select
                    value={formState.gheId}
                    onChange={(e) => {
                      const selectedGheId = e.target.value;
                      const ghe = ghes.find(g => g.id === selectedGheId);
                      setFormState({
                        ...formState,
                        gheId: selectedGheId,
                        localGes: ghe ? ghe.avaliacaoRiscos : "",
                        funcaoGes: ghe ? ghe.funcaoGes : "",
                        npsDb: ghe ? ghe.intensidadeConcentracao : 0
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500"
                    required
                  >
                    <option value="" className="bg-slate-900">Selecione o GHE...</option>
                    {ghes.map((g) => (
                      <option key={g.id} value={g.id} className="bg-slate-900">
                        GES {g.gesNumero} - {g.funcaoGes}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Localização do GES</label>
                  <input
                    type="text"
                    value={formState.localGes}
                    onChange={(e) => setFormState({ ...formState, localGes: e.target.value })}
                    placeholder="Ex: Solda de Estruturas"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Função por GES</label>
                  <input
                    type="text"
                    value={formState.funcaoGes}
                    onChange={(e) => setFormState({ ...formState, funcaoGes: e.target.value })}
                    placeholder="Ex: Soldador de Chapas"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Nível de Ruído - NPS dB (A)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formState.npsDb || ""}
                    onChange={(e) => setFormState({ ...formState, npsDb: parseFloat(e.target.value) || 0 })}
                    placeholder="Ex: 87.5"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-amber-300 font-mono font-bold text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: EPI Auditivo */}
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-4">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center justify-between">
                <span>3. Barreiras de Controle (EPI / Protetor Auditivo Vigente)</span>
                <span className="text-slate-500 font-mono normal-case">Proteção Coletiva & Individual</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Vincular EPI Cadastrado</label>
                  <select
                    value={formState.protetorVigenteId}
                    onChange={(e) => {
                      const selectedEpiId = e.target.value;
                      const epiObj = epis.find(ep => ep.id === selectedEpiId);
                      setFormState({
                        ...formState,
                        protetorVigenteId: selectedEpiId,
                        epi: epiObj ? epiObj.descricao : "",
                        nrrsf: epiObj ? epiObj.nrrsf : 0,
                        validadeCa: epiObj ? epiObj.ca : ""
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="" className="bg-slate-900">Selecione um EPI...</option>
                    {epis.map((e) => (
                      <option key={e.id} value={e.id} className="bg-slate-900">
                        {e.descricao} (CA: {e.ca})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Nome/Modelo do Protetor</label>
                  <input
                    type="text"
                    value={formState.epi}
                    onChange={(e) => setFormState({ ...formState, epi: e.target.value })}
                    placeholder="Ex: Concha Howard Leight L3"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Atenuação NRRsf (dB)</label>
                  <input
                    type="number"
                    value={formState.nrrsf || ""}
                    onChange={(e) => setFormState({ ...formState, nrrsf: parseInt(e.target.value) || 0 })}
                    placeholder="Ex: 18"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-emerald-300 font-mono font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Validade do CA (MTE)</label>
                  <input
                    type="text"
                    value={formState.validadeCa}
                    onChange={(e) => setFormState({ ...formState, validadeCa: e.target.value })}
                    placeholder="Ex: 2028-11-20"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Data de Entrega do EPI</label>
                  <input
                    type="date"
                    value={formState.dataEntregaPrototor || formState.dataEntrega}
                    onChange={(e) => setFormState({ ...formState, dataEntregaPrototor: e.target.value, dataEntrega: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Validade de Uso do EPI</label>
                  <input
                    type="date"
                    value={formState.validadeProtetor || formState.validade}
                    onChange={(e) => setFormState({ ...formState, validadeProtetor: e.target.value, validade: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                  />
                </div>

                <div className="md:col-span-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-400 flex flex-col justify-center">
                  <span>💡 <strong>Cálculo de Atenuação:</strong> Nível de ruído equivalente protegido é <strong>{formState.npsDb ? Math.max(0, formState.npsDb - (formState.nrrsf || 0)).toFixed(1) : 0} dB(A)</strong>. Limite recomendável Fundacentro é &lt; 85 dB(A).</span>
                </div>
              </div>
            </div>

            {/* Section 4: Clinical and Audiometry */}
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-4">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center justify-between">
                <span>4. Gerenciamento Audiológico e Parecer Médico</span>
                <span className="text-slate-500 font-mono normal-case">Histórico Clínico (Anexo II NR7)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Data Exame Referência</label>
                  <input
                    type="date"
                    value={formState.dataExameReferencia}
                    onChange={(e) => setFormState({ ...formState, dataExameReferencia: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Tipo Exame Referência</label>
                  <select
                    value={formState.tipoExameReferencia}
                    onChange={(e) => setFormState({ ...formState, tipoExameReferencia: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                  >
                    {TIPO_EXAME_OPTIONS.map(opt => (
                      <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Data Exame Atual (Vigente)</label>
                  <input
                    type="date"
                    value={formState.dataExameAtual || formState.dataExame}
                    onChange={(e) => {
                      const examD = e.target.value;
                      setFormState({
                        ...formState,
                        dataExameAtual: examD,
                        dataExame: examD,
                        dataPrevistaRetorno: calculateDataRetorno(examD)
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm font-semibold text-blue-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Tipo Exame Atual</label>
                  <select
                    value={formState.tipoExameAtual}
                    onChange={(e) => setFormState({ ...formState, tipoExameAtual: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                  >
                    {TIPO_EXAME_OPTIONS.map(opt => (
                      <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Parecer Audiológico Orelha Direita</label>
                  <select
                    value={formState.parecerOrelhaDireita || formState.parecerAudiologico}
                    onChange={(e) => setFormState({ ...formState, parecerOrelhaDireita: e.target.value, parecerAudiologico: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                  >
                    {PARECER_AUDIOLOGICO_OPTIONS.map((po) => (
                      <option key={po} value={po} className="bg-slate-900">
                        {po}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Parecer Audiológico Orelha Esquerda</label>
                  <select
                    value={formState.parecerOrelhaEsquerda}
                    onChange={(e) => setFormState({ ...formState, parecerOrelhaEsquerda: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                  >
                    {PARECER_AUDIOLOGICO_OPTIONS.map((po) => (
                      <option key={po} value={po} className="bg-slate-900">
                        {po}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Avaliação Anexo II NR-7</label>
                  <select
                    value={formState.avaliacaoAnexoII}
                    onChange={(e) => setFormState({ ...formState, avaliacaoAnexoII: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                  >
                    {AVALIACAO_ANEXO_II_OPTIONS.map((ao) => (
                      <option key={ao} value={ao} className="bg-slate-900">
                        {ao}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Status de Evolução</label>
                  <select
                    value={formState.statusAudiometrico}
                    onChange={(e) => setFormState({ ...formState, statusAudiometrico: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm font-semibold"
                  >
                    <option value="Estável" className="bg-slate-900 text-emerald-400">ESTÁVEL</option>
                    <option value="Instável" className="bg-slate-900 text-rose-400">INSTÁVEL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Reteste Requerido (Tabela Aux.)</label>
                  <select
                    value={formState.reteste}
                    onChange={(e) => setFormState({ ...formState, reteste: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-amber-400 text-sm font-semibold focus:outline-none"
                  >
                    {RETESTE_OPTIONS.map((ro) => (
                      <option key={ro} value={ro} className="bg-slate-900">
                        {ro}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Próxima Audiometria Prevista</label>
                  <input
                    type="date"
                    value={formState.dataPrevistaRetorno}
                    onChange={(e) => setFormState({ ...formState, dataPrevistaRetorno: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm font-bold font-mono"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Observações / Anotações Médicas Gerais</label>
                  <textarea
                    value={formState.observacao}
                    onChange={(e) => setFormState({ ...formState, observacao: e.target.value })}
                    placeholder="Digite queixas auditivas, laudos, exames complementares anexos ou recomendações da Fundacentro..."
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Auditoria de Campo SPPA */}
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-4">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center justify-between">
                <span>5. Auditoria de Posto de Trabalho (Garantia do SPPA)</span>
                <span className="text-slate-500 font-mono normal-case">Fiscalização e Eficácia</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Frequência / Auditoria</label>
                  <select
                    value={formState.auditoria}
                    onChange={(e) => setFormState({ ...formState, auditoria: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                  >
                    {AUDITORIA_OPTIONS.map((au) => (
                      <option key={au} value={au} className="bg-slate-900">{au}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Data da Auditoria</label>
                  <input
                    type="date"
                    value={formState.auditoriaData}
                    onChange={(e) => setFormState({ ...formState, auditoriaData: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Parecer da Auditoria</label>
                  <select
                    value={formState.auditoriaSituacao || formState.situacaoAuditoria}
                    onChange={(e) => setFormState({ ...formState, auditoriaSituacao: e.target.value, situacaoAuditoria: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                  >
                    {SITUACAO_AUDITORIA_OPTIONS.map((sa) => (
                      <option key={sa} value={sa} className="bg-slate-900">{sa}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Inadequação Detectada</label>
                  <select
                    value={formState.auditoriaInadequacao || formState.inadequacaoAuditoria}
                    onChange={(e) => setFormState({ ...formState, auditoriaInadequacao: e.target.value, inadequacaoAuditoria: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-rose-300 text-sm font-semibold"
                  >
                    {INADEQUACAO_AUDITORIA_OPTIONS.map((io) => (
                      <option key={io} value={io} className="bg-slate-900">{io}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Vencimento da Auditoria</label>
                  <input
                    type="date"
                    value={formState.auditoriaVencimento}
                    onChange={(e) => setFormState({ ...formState, auditoriaVencimento: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Section 6: Treinamento e Conscientização */}
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-4">
              <div className="text-xs font-bold text-teal-400 uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center justify-between">
                <span>6. Treinamento Ocupacional do PCA (Fundacentro)</span>
                <span className="text-slate-500 font-mono normal-case">Educação e Conscientização</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Data do Treinamento</label>
                  <input
                    type="date"
                    value={formState.dataTreinamento}
                    onChange={(e) => {
                      const tDate = e.target.value;
                      // Set retraining date to +365 days by default
                      let rDate = "";
                      try {
                        const d = new Date(tDate);
                        if (!isNaN(d.getTime())) {
                          d.setFullYear(d.getFullYear() + 1);
                          rDate = d.toISOString().split("T")[0];
                        }
                      } catch (err) {}
                      setFormState({
                        ...formState,
                        dataTreinamento: tDate,
                        dataRetreinamento: rDate || formState.dataRetreinamento
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Data do Retreinamento (Anual)</label>
                  <input
                    type="date"
                    value={formState.dataRetreinamento}
                    onChange={(e) => setFormState({ ...formState, dataRetreinamento: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Horário do Treinamento</label>
                  <input
                    type="text"
                    value={formState.horarioTreinamento}
                    onChange={(e) => setFormState({ ...formState, horarioTreinamento: e.target.value })}
                    placeholder="Ex: 14:00"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">LOCAL do Treinamento</label>
                  <input
                    type="text"
                    value={formState.localTreinamento}
                    onChange={(e) => setFormState({ ...formState, localTreinamento: e.target.value })}
                    placeholder="Ex: Auditório Principal"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                resetForm();
              }}
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-lg active:scale-[0.98]"
            >
              {isEditingId ? "Salvar Ficha do Funcionário" : "Salvar & Registrar Ficha"}
            </button>
          </div>
        </form>
      )}

      {/* Roster Controls: Search & Advanced filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Main search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por Nome, Crachá ou CPF..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
            />
          </div>

          {/* Quick Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {/* Sector filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-700 focus:outline-none w-full"
              >
                <option value="">Todos Setores</option>
                {uniqueSectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            {/* GHE filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={gheFilter}
                onChange={(e) => setGheFilter(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-700 focus:outline-none w-full"
              >
                <option value="">Todos GHEs</option>
                {ghes.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.gesNumero}
                  </option>
                ))}
              </select>
            </div>

            {/* Parecer filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={parecerFilter}
                onChange={(e) => setParecerFilter(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-700 focus:outline-none w-full"
              >
                <option value="">Todos Pareceres</option>
                {PARECER_AUDIOLOGICO_OPTIONS.map((po) => (
                  <option key={po} value={po}>
                    {po.split(" (")[0]} {/* truncate to keep select short */}
                  </option>
                ))}
              </select>
            </div>

            {/* Auditoria status filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={auditoriaFilter}
                onChange={(e) => setAuditoriaFilter(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-700 focus:outline-none w-full"
              >
                <option value="">Todos Status Aud.</option>
                <option value="Conforme">Conforme</option>
                <option value="Não Conforme">Não Conforme</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Roster List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Funcionário</th>
                <th className="py-3 px-4">Cargo & Setor</th>
                <th className="py-3 px-4 text-center">GHE / GES</th>
                <th className="py-3 px-4">EPI Vigente & Validade</th>
                <th className="py-3 px-4 text-center">Parecer Clínico</th>
                <th className="py-3 px-4">Auditoria SPPA</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 text-xs">
                    Nenhum funcionário encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const matchingGheObj = ghes.find((g) => g.id === emp.gheId);
                  const matchingEpiObj = epis.find((e) => e.id === emp.protetorVigenteId);

                  // Highlights
                  const validadeEpiDate = emp.validadeProtetor || emp.validade;
                  const isEpiExpired = validadeEpiDate && validadeEpiDate < "2026-06-25";
                  
                  // Double ear clinical analysis
                  const isPairOD = emp.parecerOrelhaDireita && emp.parecerOrelhaDireita.includes("PAIR");
                  const isPairOE = emp.parecerOrelhaEsquerda && emp.parecerOrelhaEsquerda.includes("PAIR");
                  const hasLoss = isPairOD || isPairOE || (emp.parecerAudiologico && emp.parecerAudiologico.includes("PAIR"));
                  
                  const hasReteste = emp.reteste && emp.reteste !== "Não necessário";
                  const hasAuditFailure = (emp.auditoriaSituacao || emp.situacaoAuditoria) === "Não Conforme";
                  
                  // Protected attenuation calculations
                  const noiseDb = emp.npsDb || (matchingGheObj ? matchingGheObj.intensidadeConcentracao : 0);
                  const epiAttenuation = emp.nrrsf || (matchingEpiObj ? matchingEpiObj.nrrsf : 0);
                  const protectedDb = noiseDb ? Math.max(0, noiseDb - epiAttenuation) : 0;

                  // Fundacentro Action Limit warning (> 80 dB action limit, > 85 dB ceiling limit)
                  let protectedColorClass = "text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900";
                  if (protectedDb >= 85) {
                    protectedColorClass = "text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900 animate-pulse";
                  } else if (protectedDb >= 80) {
                    protectedColorClass = "text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900";
                  }

                  // Training check
                  const isTrained = !!emp.dataTreinamento;
                  const retrainDate = emp.dataRetreinamento;

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/70 transition-all border-b border-slate-100 text-xs">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800 text-sm">{emp.nome}</div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[10px] text-slate-500">
                          <span>Crachá: <strong className="text-slate-700 font-mono">{emp.cracha}</strong></span>
                          <span>•</span>
                          <span>CPF: {emp.cpf}</span>
                          <span>•</span>
                          <span className="bg-slate-100 px-1 py-0.2 rounded font-semibold text-slate-600 font-sans">{emp.idade ? `${emp.idade} anos` : "N/D"}</span>
                          <span>•</span>
                          <span className="font-medium text-blue-600">{emp.situacao || emp.situacaoTrabalhador || "Trabalhando"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{emp.cargo}</div>
                        <div className="text-slate-500 text-[10px]">{emp.local}</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">Admissão: {emp.admissao ? new Date(emp.admissao).toLocaleDateString("pt-BR") : "N/D"}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="bg-slate-900 text-amber-400 px-2.5 py-0.5 rounded text-[10px] font-bold font-mono border border-slate-800">
                            GES {matchingGheObj ? matchingGheObj.gesNumero : "N/D"}
                          </span>
                          <div className="text-[10px] font-bold text-slate-600 mt-1" title="Ruído medido">
                            {noiseDb ? `${noiseDb} dB(A)` : "N/D"}
                          </div>
                          {protectedDb > 0 && (
                            <span className={`mt-1 px-1.5 py-0.2 text-[9px] rounded-full border font-bold ${protectedColorClass}`} title="Nível equivalente protegido">
                              Prot: {protectedDb.toFixed(1)} dB
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {matchingEpiObj || emp.epi ? (
                          <div className="flex flex-col space-y-0.5">
                            <span className="font-semibold text-slate-800">{emp.epi || (matchingEpiObj && matchingEpiObj.descricao)}</span>
                            <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-mono">
                              <span>CA: <strong className="text-slate-700">{emp.validadeCa || (matchingEpiObj && matchingEpiObj.ca)}</strong></span>
                              <span>•</span>
                              <span>Atenuação: <strong className="text-emerald-600 font-bold">-{epiAttenuation} dB</strong></span>
                            </div>
                            <span className={`text-[10px] font-medium ${isEpiExpired ? "text-red-500 font-bold bg-red-50 px-1 py-0.2 rounded" : "text-slate-500"}`}>
                              Substituição: {validadeEpiDate ? new Date(validadeEpiDate).toLocaleDateString("pt-BR") : "N/D"}
                              {isEpiExpired && " (SUBSTITUIR!)"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Sem EPI atribuído</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col space-y-1">
                          {/* Ear-by-ear status display */}
                          <div className="flex gap-1.5 justify-start">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              isPairOD ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-emerald-50 text-emerald-800 border border-emerald-100"
                            }`}>
                              OD: {isPairOD ? "PAIR" : "LNA"}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              isPairOE ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-emerald-50 text-emerald-800 border border-emerald-100"
                            }`}>
                              OE: {isPairOE ? "PAIR" : "LNA"}
                            </span>
                          </div>
                          
                          {/* Evolution stability status */}
                          <div className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${
                              emp.statusAudiometrico === "Instável" ? "bg-rose-500 animate-pulse" : "bg-emerald-500"
                            }`} />
                            <span className={`text-[10px] font-bold ${
                              emp.statusAudiometrico === "Instável" ? "text-rose-600" : "text-emerald-600"
                            }`}>
                              {emp.statusAudiometrico === "Instável" ? "Evolutivo (Instável)" : "Estável"}
                            </span>
                          </div>

                          <div className="text-[9px] text-slate-400 font-sans">
                            <div>Atual: <span className="font-semibold">{emp.dataExameAtual || emp.dataExame ? new Date(emp.dataExameAtual || emp.dataExame).toLocaleDateString("pt-BR") : "N/D"}</span></div>
                            <div>Retorno: <span className="font-bold text-blue-600">{emp.dataPrevistaRetorno ? new Date(emp.dataPrevistaRetorno).toLocaleDateString("pt-BR") : "N/D"}</span></div>
                          </div>

                          {hasReteste && (
                            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-semibold px-1 py-0.2 rounded mt-0.5">
                              {emp.reteste}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col space-y-1">
                          {/* Auditoria status */}
                          <div>
                            <span className={`inline-flex items-center gap-1 font-bold text-[10px] px-1.5 py-0.5 rounded ${
                              hasAuditFailure ? "bg-rose-50 text-rose-700 border border-rose-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            }`}>
                              {hasAuditFailure ? "● Não Conforme" : "● Auditoria Conforme"}
                            </span>
                            {hasAuditFailure && (emp.auditoriaInadequacao || emp.inadequacaoAuditoria) && (
                              <div className="text-[9px] text-rose-500 font-medium italic mt-0.5 truncate max-w-[150px]">
                                Inadequação: {emp.auditoriaInadequacao || emp.inadequacaoAuditoria}
                              </div>
                            )}
                          </div>

                          {/* Training status */}
                          <div className="border-t border-slate-100 pt-1 text-[9px]">
                            {isTrained ? (
                              <div className="text-teal-600 font-semibold flex flex-col">
                                <span>✔ Treinado ({emp.dataTreinamento ? new Date(emp.dataTreinamento).toLocaleDateString("pt-BR") : ""})</span>
                                {retrainDate && <span className="text-slate-400 font-normal">Retreino: {new Date(retrainDate).toLocaleDateString("pt-BR")}</span>}
                              </div>
                            ) : (
                              <span className="text-amber-500 font-bold">⚠ Treinamento Pendente</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(emp)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-all"
                            title="Editar funcionário"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(emp.id, emp.nome)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-all"
                            title="Excluir funcionário"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
