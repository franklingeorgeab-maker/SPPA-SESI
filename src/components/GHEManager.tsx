/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { GHE, EPI } from "../types";
import { ShieldCheck, Plus, Edit2, Trash2, HelpCircle, Check, Sparkles, Volume2, ShieldAlert } from "lucide-react";

interface GHEManagerProps {
  ghes: GHE[];
  epis: EPI[];
  onAddGHE: (ghe: GHE) => void;
  onUpdateGHE: (ghe: GHE) => void;
  onDeleteGHE: (id: string) => void;
}

export default function GHEManager({ ghes, epis, onAddGHE, onUpdateGHE, onDeleteGHE }: GHEManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [formState, setFormState] = useState<Omit<GHE, "id">>({
    gesNumero: "",
    avaliacaoRiscos: "",
    intensidadeConcentracao: 85,
    funcaoGes: "",
    necessarioEpi: true,
    epi1Id: "",
    ca1: "",
    nrrsf1: 0,
    atenuacao1: 0,
    eficaz1: false,
    epi2Id: "",
    ca2: "",
    nrrsf2: 0,
    atenuacao2: 0,
    eficaz2: false,
    medidasControlesAdicionais: "",
  });

  const resetForm = () => {
    setFormState({
      gesNumero: "",
      avaliacaoRiscos: "",
      intensidadeConcentracao: 85,
      funcaoGes: "",
      necessarioEpi: true,
      epi1Id: "",
      ca1: "",
      nrrsf1: 0,
      atenuacao1: 0,
      eficaz1: false,
      epi2Id: "",
      ca2: "",
      nrrsf2: 0,
      atenuacao2: 0,
      eficaz2: false,
      medidasControlesAdicionais: "",
    });
    setErrorMsg("");
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAdding(true);
    setIsEditing(null);
  };

  const handleOpenEdit = (ghe: GHE) => {
    setFormState({
      gesNumero: ghe.gesNumero,
      avaliacaoRiscos: ghe.avaliacaoRiscos,
      intensidadeConcentracao: ghe.intensidadeConcentracao,
      funcaoGes: ghe.funcaoGes,
      necessarioEpi: ghe.necessarioEpi,
      epi1Id: ghe.epi1Id,
      ca1: ghe.ca1,
      nrrsf1: ghe.nrrsf1,
      atenuacao1: ghe.atenuacao1,
      eficaz1: ghe.eficaz1,
      epi2Id: ghe.epi2Id,
      ca2: ghe.ca2,
      nrrsf2: ghe.nrrsf2,
      atenuacao2: ghe.atenuacao2,
      eficaz2: ghe.eficaz2,
      medidasControlesAdicionais: ghe.medidasControlesAdicionais,
    });
    setIsEditing(ghe.id);
    setIsAdding(false);
  };

  // Helper to sync GHE calculations based on chosen EPI
  const handleEpiSelection = (optionNum: 1 | 2, epiId: string, noiseLevel: number) => {
    const selectedEpi = epis.find((e) => e.id === epiId);
    if (!selectedEpi) {
      if (optionNum === 1) {
        setFormState((prev) => ({
          ...prev,
          epi1Id: "",
          ca1: "",
          nrrsf1: 0,
          atenuacao1: 0,
          eficaz1: false,
        }));
      } else {
        setFormState((prev) => ({
          ...prev,
          epi2Id: "",
          ca2: "",
          nrrsf2: 0,
          atenuacao2: 0,
          eficaz2: false,
        }));
      }
      return;
    }

    const nrrsf = selectedEpi.nrrsf;
    // According to Fundacentro, real ear attenuation is NRRsf.
    // In practice, we can apply a safety factor of 100% or calculate: Estimated Exposure = Noise - NRRsf
    const estimatedExposure = noiseLevel - nrrsf;
    const isEficaz = estimatedExposure <= 80; // Limit is 80-85 dB(A). Below 80 is 100% safe.

    if (optionNum === 1) {
      setFormState((prev) => ({
        ...prev,
        epi1Id: epiId,
        ca1: selectedEpi.ca,
        nrrsf1: nrrsf,
        atenuacao1: nrrsf,
        eficaz1: isEficaz,
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        epi2Id: epiId,
        ca2: selectedEpi.ca,
        nrrsf2: nrrsf,
        atenuacao2: nrrsf,
        eficaz2: isEficaz,
      }));
    }
  };

  const handleNoiseChange = (noiseVal: number) => {
    setFormState((prev) => {
      // Re-evaluate efficiencies
      const epi1 = epis.find((e) => e.id === prev.epi1Id);
      const epi2 = epis.find((e) => e.id === prev.epi2Id);

      const exp1 = epi1 ? noiseVal - epi1.nrrsf : noiseVal;
      const exp2 = epi2 ? noiseVal - epi2.nrrsf : noiseVal;

      return {
        ...prev,
        intensidadeConcentracao: noiseVal,
        eficaz1: epi1 ? exp1 <= 80 : false,
        eficaz2: epi2 ? exp2 <= 80 : false,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.gesNumero || !formState.funcaoGes) {
      setErrorMsg("Nº do GES e Função são obrigatórios.");
      return;
    }

    if (isAdding) {
      const newGHE: GHE = {
        ...formState,
        id: `ghe-${Date.now()}`,
      };
      onAddGHE(newGHE);
      setIsAdding(false);
    } else if (isEditing) {
      const updatedGHE: GHE = {
        ...formState,
        id: isEditing,
      };
      onUpdateGHE(updatedGHE);
      setIsEditing(null);
    }
    resetForm();
  };

  const handleDelete = (id: string, code: string) => {
    if (confirm(`Deseja mesmo remover o grupo GHE/GES "${code}"?`)) {
      onDeleteGHE(id);
    }
  };

  return (
    <div className="space-y-6" id="ghe-manager-section">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 font-display">
            <ShieldCheck className="text-blue-600 w-6 h-6" />
            Configuração de GHE / GES (Mapeamento de Ruído)
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Defina os Grupos de Homogeneidade de Exposição (GHE/GES), avalie as intensidades de ruído e mapeie os EPIs necessários.
          </p>
        </div>

        {!isAdding && !isEditing && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Adicionar GHE / GES
          </button>
        )}
      </div>

      {/* GHE/GES Form */}
      {(isAdding || isEditing) && (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-blue-100 rounded-xl p-5 space-y-5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-md font-semibold text-slate-800 flex items-center gap-1.5 font-display">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {isAdding ? "Adicionar Novo GHE / GES" : "Editar GHE / GES"}
            </h3>
            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded">
              Conformidade Fundacentro
            </span>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-700 text-xs px-3 py-2 rounded-md border border-red-100">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Nº do GES / GHE</label>
              <input
                type="text"
                value={formState.gesNumero}
                onChange={(e) => setFormState({ ...formState, gesNumero: e.target.value })}
                placeholder="Ex: GHE-01, GES-Prensas"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Funções Cobertas no GES</label>
              <input
                type="text"
                value={formState.funcaoGes}
                onChange={(e) => setFormState({ ...formState, funcaoGes: e.target.value })}
                placeholder="Ex: Operador de Prensa, Soldador"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Nível de Ruído - Intensidade [dB(A)]
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="50"
                  max="120"
                  value={formState.intensidadeConcentracao}
                  onChange={(e) => handleNoiseChange(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <span className="text-slate-500 text-xs font-bold bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
                  dB(A)
                </span>
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Avaliação de Riscos (Descrição)</label>
              <textarea
                value={formState.avaliacaoRiscos}
                onChange={(e) => setFormState({ ...formState, avaliacaoRiscos: e.target.value })}
                placeholder="Descreva a exposição ao ruído, fontes emissoras e características do ambiente laboral..."
                rows={2}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-3 border-t border-slate-200 pt-3">
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  id="necessarioEpi"
                  checked={formState.necessarioEpi}
                  onChange={(e) => setFormState({ ...formState, necessarioEpi: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <label htmlFor="necessarioEpi" className="text-xs font-semibold text-slate-700">
                  Uso de Protetor Auditivo (EPI) é obrigatório para este grupo? (Acima do Nível de Ação: 80 dB(A))
                </label>
              </div>
            </div>

            {formState.necessarioEpi && (
              <>
                {/* EPI Option 1 */}
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">EPI (1ª Opção recomendada)</label>
                    <select
                      value={formState.epi1Id}
                      onChange={(e) => handleEpiSelection(1, e.target.value, formState.intensidadeConcentracao)}
                      className="w-full px-2 py-1 border border-slate-200 rounded text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Selecione um Protetor...</option>
                      {epis.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.descricao} (C.A. {e.ca} - {e.nrrsf} dB NRRsf)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">C.A. / NRRsf</label>
                    <div className="text-xs font-mono font-bold text-slate-600 mt-1.5">
                      {formState.epi1Id ? `CA: ${formState.ca1} | ${formState.nrrsf1} dB` : "Nenhum selecionado"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Eficácia Estimada</label>
                    {formState.epi1Id ? (
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500">
                          Exposição Residual: <strong className="font-mono text-slate-700">{formState.intensidadeConcentracao - formState.nrrsf1} dB</strong>
                        </span>
                        <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold uppercase mt-1 ${formState.eficaz1 ? "text-green-600" : "text-amber-600"}`}>
                          ● {formState.eficaz1 ? "Eficaz (<80dB)" : "Atenuação Limite"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </div>
                </div>

                {/* EPI Option 2 */}
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-3 bg-indigo-50/20 p-3 rounded-lg border border-indigo-100/30">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">EPI (2ª Opção / Reserva)</label>
                    <select
                      value={formState.epi2Id}
                      onChange={(e) => handleEpiSelection(2, e.target.value, formState.intensidadeConcentracao)}
                      className="w-full px-2 py-1 border border-slate-200 rounded text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Selecione um Protetor...</option>
                      {epis.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.descricao} (C.A. {e.ca} - {e.nrrsf} dB NRRsf)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">C.A. / NRRsf</label>
                    <div className="text-xs font-mono font-bold text-slate-600 mt-1.5">
                      {formState.epi2Id ? `CA: ${formState.ca2} | ${formState.nrrsf2} dB` : "Nenhum selecionado"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Eficácia Estimada</label>
                    {formState.epi2Id ? (
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500">
                          Exposição Residual: <strong className="font-mono text-slate-700">{formState.intensidadeConcentracao - formState.nrrsf2} dB</strong>
                        </span>
                        <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold uppercase mt-1 ${formState.eficaz2 ? "text-green-600" : "text-amber-600"}`}>
                          ● {formState.eficaz2 ? "Eficaz (<80dB)" : "Atenuação Limite"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="md:col-span-3 border-t border-slate-200 pt-3">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Medidas de Controles Adicionais (EPCs ou Administrativas)</label>
              <input
                type="text"
                value={formState.medidasControlesAdicionais}
                onChange={(e) => setFormState({ ...formState, medidasControlesAdicionais: e.target.value })}
                placeholder="Ex: Treinamentos periódicos de conservação auditiva, revezamento de postos..."
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
              {isAdding ? "Adicionar GHE/GES" : "Salvar Alterações"}
            </button>
          </div>
        </form>
      )}

      {/* GHEs Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Código / GES Nº</th>
                <th className="py-3 px-4">Função / Cargos Atendidos</th>
                <th className="py-3 px-4 text-center">Intensidade do Ruído</th>
                <th className="py-3 px-4">Obrigatoriedade EPI</th>
                <th className="py-3 px-4">EPIs Vinculados</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {ghes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 text-xs">
                    Nenhum GHE / GES cadastrado. Clique em "Adicionar GHE / GES".
                  </td>
                </tr>
              ) : (
                ghes.map((ghe) => {
                  const aboveLimit = ghe.intensidadeConcentracao >= 85;
                  const aboveAction = ghe.intensidadeConcentracao >= 80;

                  return (
                    <tr key={ghe.id} className="hover:bg-slate-50/55 transition-all">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{ghe.gesNumero}</div>
                        <div className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono w-max mt-1">
                          Ref: {ghe.id.substring(0, 8)}
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-slate-700 truncate" title={ghe.funcaoGes}>
                          {ghe.funcaoGes}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1" title={ghe.avaliacaoRiscos}>
                          {ghe.avaliacaoRiscos || "Sem descrição de risco."}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                            aboveLimit
                              ? "bg-red-50 text-red-700 border border-red-100"
                              : aboveAction
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-green-50 text-green-700 border border-green-100"
                          }`}>
                            {ghe.intensidadeConcentracao} dB(A)
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            {aboveLimit ? "Acima do Limite" : aboveAction ? "Nível de Ação" : "Sob Controle"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          ghe.necessarioEpi
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                          {ghe.necessarioEpi ? "EPI Obrigatório" : "EPI Dispensado"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {ghe.necessarioEpi ? (
                          <div className="space-y-1.5 text-xs">
                            {ghe.epi1Id ? (
                              <div className="flex items-center gap-1.5">
                                <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold text-[10px] border border-emerald-100">
                                  Opção 1
                                </span>
                                <span className="text-slate-600">CA: {ghe.ca1}</span>
                                <span className={`text-[10px] font-bold ${ghe.eficaz1 ? "text-green-600" : "text-amber-600"}`}>
                                  ({ghe.eficaz1 ? "Eficaz" : "Limiar"})
                                </span>
                              </div>
                            ) : (
                              <div className="text-amber-500 font-semibold flex items-center gap-1">
                                <ShieldAlert className="w-3.5 h-3.5" /> Sem EPI 1
                              </div>
                            )}

                            {ghe.epi2Id && (
                              <div className="flex items-center gap-1.5">
                                <span className="bg-indigo-50 text-indigo-800 px-1.5 py-0.5 rounded font-mono font-bold text-[10px] border border-indigo-100">
                                  Opção 2
                                </span>
                                <span className="text-slate-600">CA: {ghe.ca2}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Não se aplica</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(ghe)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-all"
                            title="Editar GHE"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(ghe.id, ghe.gesNumero)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-all"
                            title="Excluir GHE"
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
