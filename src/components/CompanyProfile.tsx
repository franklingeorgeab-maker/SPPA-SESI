/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Company, Responsible } from "../types";
import { Building2, ShieldCheck, Phone, MapPin, FileText, User, Award, CheckCircle2 } from "lucide-react";

interface CompanyProfileProps {
  company: Company;
  responsible: Responsible;
  onUpdateCompany: (company: Company) => void;
  onUpdateResponsible: (responsible: Responsible) => void;
}

const LOGO_PRESETS = ["⚙️", "🏢", "🛡️", "🏥", "🔊", "📐", "🦾"];

export default function CompanyProfile({
  company,
  responsible,
  onUpdateCompany,
  onUpdateResponsible,
}: CompanyProfileProps) {
  const [compState, setCompState] = useState<Company>({ ...company });
  const [respState, setRespState] = useState<Responsible>({ ...responsible });
  const [isSaved, setIsSaved] = useState(false);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCompState((prev) => ({ ...prev, [name]: value }));
  };

  const handleResponsibleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRespState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompany(compState);
    onUpdateResponsible(respState);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8" id="company-profile-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 font-display">
            <Building2 className="text-blue-600 w-6 h-6" />
            Cadastro da Empresa & Responsável Técnico
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Configure os dados institucionais e o responsável pela assinatura e coordenação do PCA (SPPA).
          </p>
        </div>
        
        {isSaved && (
          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200 text-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            Alterações salvas com sucesso!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Company Card Block */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Dados da Empresa (Razão Social)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Razão Social
              </label>
              <input
                type="text"
                name="razaoSocial"
                value={compState.razaoSocial}
                onChange={handleCompanyChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm"
                placeholder="Ex: Indústria e Comércio Metalúrgica S.A."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                CNPJ
              </label>
              <input
                type="text"
                name="cnpj"
                value={compState.cnpj}
                onChange={handleCompanyChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm"
                placeholder="00.000.000/0000-00"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Telefone
              </label>
              <input
                type="text"
                name="telefone"
                value={compState.telefone}
                onChange={handleCompanyChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm"
                placeholder="(47) 3456-7890"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Endereço Completo
              </label>
              <input
                type="text"
                name="endereco"
                value={compState.endereco}
                onChange={handleCompanyChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm"
                placeholder="Rua, Número, Quadra..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Bairro
              </label>
              <input
                type="text"
                name="bairro"
                value={compState.bairro}
                onChange={handleCompanyChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm"
                placeholder="Centro, Industrial..."
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  name="cidade"
                  value={compState.cidade}
                  onChange={handleCompanyChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm"
                  placeholder="Joinville"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  UF
                </label>
                <input
                  type="text"
                  name="uf"
                  value={compState.uf}
                  onChange={handleCompanyChange}
                  maxLength={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm uppercase text-center"
                  placeholder="SC"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                CEP
              </label>
              <input
                type="text"
                name="cep"
                value={compState.cep}
                onChange={handleCompanyChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm"
                placeholder="89200-000"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                CNAE Principal
              </label>
              <input
                type="text"
                name="cnae"
                value={compState.cnae}
                onChange={handleCompanyChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm"
                placeholder="Ex: 25.39-0-01"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Grau de Risco (NR-4)
              </label>
              <select
                name="grauRisco"
                value={compState.grauRisco}
                onChange={handleCompanyChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 text-sm"
              >
                <option value="Grau de Risco 1">Grau de Risco 1</option>
                <option value="Grau de Risco 2">Grau de Risco 2</option>
                <option value="Grau de Risco 3">Grau de Risco 3</option>
                <option value="Grau de Risco 4">Grau de Risco 4</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Logotipo / Símbolo Visual
              </label>
              <div className="flex gap-2 items-center mt-1">
                {LOGO_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCompState((prev) => ({ ...prev, logo: p }))}
                    className={`w-9 h-9 flex items-center justify-center text-lg rounded-lg border transition-all ${
                      compState.logo === p
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Responsible Block */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Responsável Técnico</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Nome do Profissional
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="nome"
                    value={respState.nome}
                    onChange={handleResponsibleChange}
                    required
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm"
                    placeholder="Nome completo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Função / Cargo no PCA
                </label>
                <input
                  type="text"
                  name="funcao"
                  value={respState.funcao}
                  onChange={handleResponsibleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm"
                  placeholder="Ex: Fonoaudiólogo(a) ou Médico do Trabalho"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Conselho Profissional (Nº)
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="conselho"
                    value={respState.conselho}
                    onChange={handleResponsibleChange}
                    required
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm"
                    placeholder="Ex: CRFa 3-9999 ou CRM-SC 12456"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Setor / Departamento
                </label>
                <input
                  type="text"
                  name="setor"
                  value={respState.setor}
                  onChange={handleResponsibleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm"
                  placeholder="Ex: Saúde e Segurança Ocupacional"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Instituição Vinculada
                </label>
                <input
                  type="text"
                  name="instituicao"
                  value={respState.instituicao}
                  onChange={handleResponsibleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 text-sm"
                  placeholder="Ex: Sesi ou Própria Empresa"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-1.5 font-display text-blue-300">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Diretrizes de Responsabilidade
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              O Responsável Técnico responde eticamente pela elaboração, execução e guarda dos exames audiométricos e do Documento Base do SPPA, conforme as normas regulamentadoras da Fundacentro e do Ministério do Trabalho.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            Salvar Todas as Informações
          </button>
        </div>
      </form>
    </div>
  );
}
