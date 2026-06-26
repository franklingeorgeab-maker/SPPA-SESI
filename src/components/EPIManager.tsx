/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { EPI } from "../types";
import { Shield, Plus, Edit2, Trash2, Calendar, AlertTriangle, Check, RefreshCw } from "lucide-react";

interface EPIManagerProps {
  epis: EPI[];
  onAddEPI: (epi: EPI) => void;
  onUpdateEPI: (epi: EPI) => void;
  onDeleteEPI: (id: string) => void;
}

export default function EPIManager({ epis, onAddEPI, onUpdateEPI, onDeleteEPI }: EPIManagerProps) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [formState, setFormState] = useState<Omit<EPI, "id">>({
    descricao: "",
    marca: "",
    tamanho: "Único",
    ca: "",
    validadeCa: "",
    nrrsf: 15,
  });

  const currentDateStr = "2026-06-25"; // Injected current local date for the system

  const isExpired = (dateStr: string) => {
    if (!dateStr) return false;
    return dateStr < currentDateStr;
  };

  const isNearExpiration = (dateStr: string) => {
    if (!dateStr || isExpired(dateStr)) return false;
    // Within 90 days
    const current = new Date(currentDateStr);
    const target = new Date(dateStr);
    const diffTime = Math.abs(target.getTime() - current.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90;
  };

  const resetForm = () => {
    setFormState({
      descricao: "",
      marca: "",
      tamanho: "Único",
      ca: "",
      validadeCa: "",
      nrrsf: 15,
    });
    setErrorMsg("");
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAdding(true);
    setIsEditing(null);
  };

  const handleOpenEdit = (epi: EPI) => {
    setFormState({
      descricao: epi.descricao,
      marca: epi.marca,
      tamanho: epi.tamanho,
      ca: epi.ca,
      validadeCa: epi.validadeCa,
      nrrsf: epi.nrrsf,
    });
    setIsEditing(epi.id);
    setIsAdding(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.descricao || !formState.ca) {
      setErrorMsg("Descrição e CA são obrigatórios.");
      return;
    }

    if (isAdding) {
      const newEPI: EPI = {
        ...formState,
        id: `epi-${Date.now()}`,
      };
      onAddEPI(newEPI);
      setIsAdding(false);
    } else if (isEditing) {
      const updatedEPI: EPI = {
        ...formState,
        id: isEditing,
      };
      onUpdateEPI(updatedEPI);
      setIsEditing(null);
    }
    resetForm();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Deseja mesmo remover o protetor auditivo "${name}"?`)) {
      onDeleteEPI(id);
    }
  };

  return (
    <div className="space-y-6" id="epi-manager-section">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 font-display">
            <Shield className="text-blue-600 w-6 h-6" />
            Catálogo de Protetores Auditivos (EPIs)
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Cadastre e monitore os CA (Certificados de Aprovação) e os índices de atenuação (NRRsf) dos protetores auditivos.
          </p>
        </div>

        {!isAdding && !isEditing && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Adicionar Protetor
          </button>
        )}
      </div>

      {/* Adding or Editing Form */}
      {(isAdding || isEditing) && (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-blue-100 rounded-xl p-5 space-y-4 animate-fade-in">
          <h3 className="text-md font-semibold text-slate-800 flex items-center gap-1.5 font-display">
            <Shield className="w-4 h-4 text-blue-600" />
            {isAdding ? "Cadastrar Novo Protetor Auditivo" : "Editar Protetor Auditivo"}
          </h3>

          {errorMsg && (
            <div className="bg-red-50 text-red-700 text-xs px-3 py-2 rounded-md border border-red-100">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Descrição / Modelo</label>
              <input
                type="text"
                value={formState.descricao}
                onChange={(e) => setFormState({ ...formState, descricao: e.target.value })}
                placeholder="Ex: Protetor de Inserção Silicone Pomps"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Marca</label>
              <input
                type="text"
                value={formState.marca}
                onChange={(e) => setFormState({ ...formState, marca: e.target.value })}
                placeholder="Ex: 3M, Honeywell"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">C.A. (Certificado de Aprovação)</label>
              <input
                type="text"
                value={formState.ca}
                onChange={(e) => setFormState({ ...formState, ca: e.target.value })}
                placeholder="Ex: 11512"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Validade do C.A.</label>
              <input
                type="date"
                value={formState.validadeCa}
                onChange={(e) => setFormState({ ...formState, validadeCa: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Atenuação NRRsf (dB)</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={formState.nrrsf}
                  onChange={(e) => setFormState({ ...formState, nrrsf: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Tamanho</label>
                <select
                  value={formState.tamanho}
                  onChange={(e) => setFormState({ ...formState, tamanho: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Único">Único</option>
                  <option value="P">P</option>
                  <option value="M">M</option>
                  <option value="G">G</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setIsEditing(null);
                resetForm();
              }}
              className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-all shadow-sm flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              {isAdding ? "Adicionar Protetor" : "Salvar Alterações"}
            </button>
          </div>
        </form>
      )}

      {/* EPI Table / List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Protetor Auditivo</th>
                <th className="py-3 px-4">Marca & Tamanho</th>
                <th className="py-3 px-4 text-center">Nº do C.A.</th>
                <th className="py-3 px-4 text-center">Atenuação NRRsf</th>
                <th className="py-3 px-4">Validade C.A.</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {epis.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 text-xs">
                    Nenhum protetor auditivo cadastrado. Clique em "Adicionar Protetor".
                  </td>
                </tr>
              ) : (
                epis.map((epi) => {
                  const expired = isExpired(epi.validadeCa);
                  const nearExp = isNearExpiration(epi.validadeCa);

                  return (
                    <tr key={epi.id} className="hover:bg-slate-50/55 transition-all">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{epi.descricao}</div>
                        <div className="text-xs text-slate-400 mt-0.5">ID: {epi.id}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium">
                          {epi.marca}
                        </span>
                        <span className="text-slate-400 text-xs ml-2">Tamanho: {epi.tamanho}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-xs font-semibold text-slate-600">
                        {epi.ca}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                          {epi.nrrsf} dB
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className={expired ? "text-red-600 font-semibold" : nearExp ? "text-amber-600 font-semibold" : "text-slate-600"}>
                            {epi.validadeCa ? new Date(epi.validadeCa).toLocaleDateString("pt-BR") : "Não definida"}
                          </span>
                          
                          {expired && (
                            <span className="flex items-center gap-0.5 bg-red-50 text-red-700 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                              Vencido
                            </span>
                          )}
                          {nearExp && (
                            <span className="flex items-center gap-0.5 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              A Vencer
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(epi)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-all"
                            title="Editar protetor"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(epi.id, epi.descricao)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-all"
                            title="Excluir protetor"
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
