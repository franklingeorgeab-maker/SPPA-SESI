/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Company, Responsible, EPI, GHE, Employee } from "../types";
import { Printer, Shield, FileText, CheckCircle, AlertTriangle, CalendarRange } from "lucide-react";

interface SPPAReportProps {
  company: Company;
  responsible: Responsible;
  epis: EPI[];
  ghes: GHE[];
  employees: Employee[];
}

export default function SPPAReport({ company, responsible, epis, ghes, employees }: SPPAReportProps) {
  const currentDate = new Date().toLocaleDateString("pt-BR");

  // Summary counts
  const totalEmps = employees.length;
  const pairCount = employees.filter((e) => e.parecerAudiologico && e.parecerAudiologico.includes("PAIR")).length;
  const triggeringCount = employees.filter((e) => e.avaliacaoAnexoII === "Desencadeamento").length;
  const agravamentoCount = employees.filter((e) => e.avaliacaoAnexoII === "Agravamento").length;
  const stableCount = employees.filter((e) => e.avaliacaoAnexoII === "Estável").length;
  
  const retestCount = employees.filter((e) => e.reteste === "Sim" || e.reteste === "Agendado").length;
  
  const auditsDone = employees.filter((e) => e.auditoria === "Realizada");
  const nonConformantCount = auditsDone.filter((e) => e.situacaoAuditoria === "Não Conforme").length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="sppa-report-section">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-4 no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 font-display">
            <FileText className="text-blue-600 w-6 h-6" />
            Documento Base do SPPA / PCA (Fundacentro)
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Gere o relatório regulamentar oficial do Programa de Conservação Auditiva estruturado nos moldes do manual da Fundacentro.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-all shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Imprimir / Exportar PDF
        </button>
      </div>

      {/* Printable Document Box */}
      <div className="bg-white border border-slate-200 shadow-lg rounded-xl p-8 max-w-4xl mx-auto text-slate-800 print:shadow-none print:border-none print:p-0 print:max-w-none">
        
        {/* Cover / Capa */}
        <div className="text-center space-y-8 py-16 print:py-6 border-b border-slate-200 print-page">
          <div className="flex items-center justify-center gap-3">
            <span className="text-5xl">{company.logo || "⚙️"}</span>
            <div className="text-left">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">SPPA</h1>
              <p className="text-xs font-semibold text-blue-600 tracking-widest uppercase">Sistema de Proteção e Conservação Auditiva</p>
            </div>
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-slate-800 uppercase font-display tracking-wide">Documento Base Anual do PCA</h2>
            <p className="text-sm text-slate-500">
              Programa de Gestão de Riscos Ocupacionais, Auditorias de Campo e Controle Epidemiológico de Limiares Auditivos conforme as diretrizes do <strong>Manual do PCA da Fundacentro</strong> e da <strong>NR-7 Anexo II</strong>.
            </p>
          </div>

          <div className="border border-slate-100 rounded-xl p-5 bg-slate-50 max-w-md mx-auto text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
              <span className="font-semibold text-slate-400">EMPRESA:</span>
              <span className="font-bold text-slate-700 text-right">{company.razaoSocial}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
              <span className="font-semibold text-slate-400">CNPJ:</span>
              <span className="font-mono text-slate-700">{company.cnpj}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
              <span className="font-semibold text-slate-400">RESPONSÁVEL TÉCNICO:</span>
              <span className="font-bold text-slate-700">{responsible.nome}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-400">DATA DE EMISSÃO:</span>
              <span className="font-bold text-slate-700">{currentDate}</span>
            </div>
          </div>
        </div>

        {/* Section 1: Intro */}
        <div className="py-6 space-y-3 print-page">
          <h3 className="text-md font-bold text-slate-950 uppercase border-b border-slate-900 pb-1 font-display">
            1. Introdução e Objetivo do SPPA
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed text-justify">
            Este Documento Base estabelece o Programa de Conservação Auditiva (SPPA) da empresa <strong>{company.razaoSocial}</strong>. O objetivo principal do programa é a prevenção do desencadeamento ou agravamento de perdas auditivas induzidas por níveis elevados de pressão sonora (ruído ocupacional), atendendo as disposições contidas na Norma Regulamentadora nº 7 (NR-7), Norma Regulamentadora nº 15 (NR-15) e as recomendações técnicas da Fundacentro. 
            A conservação auditiva é conduzida de forma contínua, englobando avaliações periódicas de níveis de ruído por Grupo de Exposição Semelhante (GES), fornecimento, monitoramento de CA e auditorias de uso de EPIs, além de avaliações médicas epidemiológicas.
          </p>
        </div>

        {/* Section 2: Company Info */}
        <div className="py-6 space-y-3 print-page">
          <h3 className="text-md font-bold text-slate-950 uppercase border-b border-slate-900 pb-1 font-display">
            2. Caracterização Institucional da Empresa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <div><strong className="text-slate-400">Razão Social:</strong> <span className="text-slate-800 font-bold">{company.razaoSocial}</span></div>
              <div><strong className="text-slate-400">CNPJ:</strong> <span className="font-mono text-slate-800">{company.cnpj}</span></div>
              <div><strong className="text-slate-400">Endereço:</strong> <span className="text-slate-800">{company.endereco}, {company.bairro}</span></div>
              <div><strong className="text-slate-400">Cidade/UF:</strong> <span className="text-slate-800">{company.cidade} - {company.uf}</span></div>
            </div>
            <div className="space-y-1.5">
              <div><strong className="text-slate-400">CEP:</strong> <span className="text-slate-800">{company.cep}</span></div>
              <div><strong className="text-slate-400">Telefone:</strong> <span className="text-slate-800">{company.telefone}</span></div>
              <div><strong className="text-slate-400">CNAE Principal:</strong> <span className="text-slate-800">{company.cnae}</span></div>
              <div><strong className="text-slate-400">Grau de Risco (NR-4):</strong> <span className="text-slate-800 font-semibold">{company.grauRisco}</span></div>
            </div>
          </div>
        </div>

        {/* Section 3: Responsible Profile */}
        <div className="py-6 space-y-3 print-page">
          <h3 className="text-md font-bold text-slate-950 uppercase border-b border-slate-900 pb-1 font-display">
            3. Responsabilidade Técnica e Coordenação do Programa
          </h3>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="font-bold text-slate-800 text-sm mb-1">{responsible.nome}</div>
              <div className="text-slate-500 font-semibold">{responsible.funcao}</div>
            </div>
            <div className="space-y-1 text-slate-600">
              <div><strong>Conselho Registro:</strong> {responsible.conselho}</div>
              <div><strong>Setor Atuação:</strong> {responsible.setor}</div>
              <div><strong>Instituição de Vínculo:</strong> {responsible.instituicao}</div>
            </div>
          </div>
        </div>

        {/* Section 4: GHE Noise Exposure Matrix */}
        <div className="py-6 space-y-3 print-page">
          <h3 className="text-md font-bold text-slate-950 uppercase border-b border-slate-900 pb-1 font-display">
            4. Mapeamento de Ruído e Avaliação de Riscos por GHE / GES
          </h3>
          <p className="text-xs text-slate-500">
            Abaixo estão mapeados os Grupos de Homogeneidade de Exposição (GHE/GES) com os respectivos níveis de ruído avaliados e eficácia projetada das opções de protetores auditivos vigentes.
          </p>

          <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                <th className="py-2 px-2 border-r border-slate-300">GES Nº</th>
                <th className="py-2 px-2 border-r border-slate-300">Funções & Atividades</th>
                <th className="py-2 px-2 border-r border-slate-300 text-center">Nível Ruído [dB(A)]</th>
                <th className="py-2 px-2 border-r border-slate-300">EPI Recom. (C.A.)</th>
                <th className="py-2 px-2 border-r border-slate-300 text-center">Atenuação NRRsf</th>
                <th className="py-2 px-2 border-r border-slate-300 text-center">Eficácia (Fundacentro)</th>
                <th className="py-2 px-2">Medidas de Controle Adicionais</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {ghes.map((g) => {
                const isOverLimit = g.intensidadeConcentracao >= 85;

                return (
                  <tr key={g.id}>
                    <td className="py-2 px-2 border-r border-slate-300 font-bold">{g.gesNumero}</td>
                    <td className="py-2 px-2 border-r border-slate-300 font-medium">{g.funcaoGes}</td>
                    <td className="py-2 px-2 border-r border-slate-300 text-center font-mono font-bold">
                      {g.intensidadeConcentracao}
                    </td>
                    <td className="py-2 px-2 border-r border-slate-300">
                      {g.necessarioEpi ? `Opção 1 (CA ${g.ca1 || "N/A"})` : "Dispensado"}
                    </td>
                    <td className="py-2 px-2 border-r border-slate-300 text-center font-mono">
                      {g.necessarioEpi ? `${g.nrrsf1} dB` : "0"}
                    </td>
                    <td className="py-2 px-2 border-r border-slate-300 text-center font-semibold">
                      {g.necessarioEpi ? (g.eficaz1 ? "Eficaz" : "Insuficiente") : "Seguro"}
                    </td>
                    <td className="py-2 px-2 text-slate-500 italic">
                      {g.medidasControlesAdicionais || "Acompanhamento administrativo padrão."}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Section 5: Epidemiological Analysis */}
        <div className="py-6 space-y-3 print-page">
          <h3 className="text-md font-bold text-slate-950 uppercase border-b border-slate-900 pb-1 font-display">
            5. Perfil Clínico Ocupacional & Epidemiologia Auditiva
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Consolidação dos laudos audiométricos periódicos, admissionais e de desligamento processados no quadro ativo de {totalEmps} colaboradores ativos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center py-2">
            <div className="border border-emerald-200 bg-emerald-50 p-3 rounded-lg">
              <span className="text-[10px] text-emerald-600 font-bold uppercase">Limiares Normais (LNA)</span>
              <div className="text-xl font-bold text-emerald-800 font-display mt-0.5">
                {totalEmps - pairCount} / {totalEmps}
              </div>
              <span className="text-[9px] text-slate-400">({(((totalEmps - pairCount) / totalEmps) * 100).toFixed(0)}% do quadro)</span>
            </div>

            <div className="border border-amber-200 bg-amber-50 p-3 rounded-lg">
              <span className="text-[10px] text-amber-600 font-bold uppercase">Casos Ativos P.A.I.R</span>
              <div className="text-xl font-bold text-amber-800 font-display mt-0.5">
                {pairCount} / {totalEmps}
              </div>
              <span className="text-[9px] text-slate-400">({((pairCount / totalEmps) * 100).toFixed(0)}% do quadro)</span>
            </div>

            <div className="border border-blue-200 bg-blue-50 p-3 rounded-lg">
              <span className="text-[10px] text-blue-600 font-bold uppercase">Exames de Reteste Necessários</span>
              <div className="text-xl font-bold text-blue-800 font-display mt-0.5">
                {retestCount}
              </div>
              <span className="text-[9px] text-slate-400">Confirmação em 15 dias</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs space-y-1.5 text-slate-600">
            <h4 className="font-bold text-slate-700">Resumo de Evolução Audiométrica (Anexo II NR-7):</h4>
            <div className="grid grid-cols-3 text-center text-[11px]">
              <div>Estáveis: <strong className="text-slate-800 font-mono">{stableCount}</strong></div>
              <div className="text-amber-600 font-semibold">Novos Desencadeamentos: <strong className="text-amber-700 font-mono">{triggeringCount}</strong></div>
              <div className="text-red-600 font-semibold">Agravamentos: <strong className="text-red-700 font-mono">{agravamentoCount}</strong></div>
            </div>
          </div>
        </div>

        {/* Section 6: Audits and corrective actions */}
        <div className="py-6 space-y-3 print-page">
          <h3 className="text-md font-bold text-slate-950 uppercase border-b border-slate-900 pb-1 font-display">
            6. Resultados de Auditoria e Medidas Corretivas
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Diagnóstico de conformidade regulamentar com foco no acompanhamento em campo da guarda, higienização e obrigatoriedade do uso de protetores auditivos.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2 text-xs">
            <div className="flex justify-between font-semibold border-b border-slate-200 pb-1">
              <span>Auditorias de Posto Realizadas:</span>
              <span className="text-slate-800 font-mono font-bold">{auditsDone.length}</span>
            </div>
            <div className="flex justify-between font-semibold border-b border-slate-200 pb-1 text-red-600">
              <span>Desvios / Não Conformidades Ativas:</span>
              <span>{nonConformantCount} ocorrências</span>
            </div>
            <div className="text-[10px] text-slate-500 leading-relaxed pt-1">
              <strong>Plano de Ação Corretivo Recomendo:</strong> <br />
              1. Substituição imediata de EPIs com C.A. vencido ou prazo de troca higiênica esgotado.<br />
              2. Realização de palestras de conscientização de ruído e treinamento do correto ajuste do plug de silicone.<br />
              3. Reavaliação audiométrica clínica (reteste) em cabine acústica para casos com desencadeamento/agravamento.
            </div>
          </div>
        </div>

        {/* Section 7: Cronograma de Metas (Interactive checklist style) */}
        <div className="py-6 space-y-3 print-page">
          <h3 className="text-md font-bold text-slate-950 uppercase border-b border-slate-900 pb-1 font-display flex items-center gap-2">
            <CalendarRange className="w-5 h-5" />
            7. Cronograma Anual de Metas e Ações do SPPA
          </h3>
          <p className="text-xs text-slate-500">
            Ações de cronograma previstas para garantir o ciclo de melhoria contínua (PDCA) do PCA na empresa durante o próximo ciclo anual.
          </p>

          <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                <th className="py-1.5 px-2 border-r border-slate-300">Ação / Meta Preventiva</th>
                <th className="py-1.5 px-2 border-r border-slate-300">Periodicidade</th>
                <th className="py-1.5 px-2 border-r border-slate-300 text-center">Responsável</th>
                <th className="py-1.5 px-2 text-center">Status Esperado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              <tr>
                <td className="py-1.5 px-2 border-r border-slate-300 font-medium">Realização de Exames de Audiometria Periódicos (Anuais)</td>
                <td className="py-1.5 px-2 border-r border-slate-300">Anual</td>
                <td className="py-1.5 px-2 border-r border-slate-300 text-center">Medicina do Trabalho</td>
                <td className="py-1.5 px-2 text-center font-bold text-blue-600">Planejado (Campanha Out/Nov)</td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 border-r border-slate-300 font-medium">Treinamento de Uso Prático, Guarda e Higienização de Protetores</td>
                <td className="py-1.5 px-2 border-r border-slate-300">Semestral</td>
                <td className="py-1.5 px-2 border-r border-slate-300 text-center">Engenharia de Segurança</td>
                <td className="py-1.5 px-2 text-center font-bold text-green-600">Em Execução Contínua</td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 border-r border-slate-300 font-medium">Inspeção Visual e Auditorias Sistemáticas de Uso nos Postos de Trabalho</td>
                <td className="py-1.5 px-2 border-r border-slate-300">Mensal</td>
                <td className="py-1.5 px-2 border-r border-slate-300 text-center">Supervisão de Setor / SESMT</td>
                <td className="py-1.5 px-2 text-center font-bold text-green-600">Em Execução Contínua</td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 border-r border-slate-300 font-medium">Medição de Dosimetria de Ruído e Atualização de Laudo de Insalubridade</td>
                <td className="py-1.5 px-2 border-r border-slate-300">Bienal</td>
                <td className="py-1.5 px-2 border-r border-slate-300 text-center">Engenheiro Higienista</td>
                <td className="py-1.5 px-2 text-center font-bold text-slate-500">Agendada para Próximo Ciclo</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 8: Signature blocks */}
        <div className="pt-12 pb-6 space-y-12">
          <p className="text-[10px] text-center text-slate-400">
            Joinville (SC), {currentDate}. Declaro que as informações coletadas no presente documento condizem com os registros de saúde ocupacional desta empresa.
          </p>

          <div className="grid grid-cols-2 gap-12 max-w-2xl mx-auto text-xs text-center">
            {/* Signature 1 */}
            <div className="border-t border-slate-400 pt-3">
              <div className="font-bold text-slate-800">{responsible.nome}</div>
              <div className="text-slate-500 font-semibold">{responsible.funcao}</div>
              <div className="text-slate-400 font-mono text-[10px] mt-0.5">{responsible.conselho}</div>
            </div>

            {/* Signature 2 */}
            <div className="border-t border-slate-400 pt-3">
              <div className="font-bold text-slate-800">Representante Legal da Empresa</div>
              <div className="text-slate-500">Diretoria / Gerência Geral</div>
              <div className="text-slate-400 font-mono text-[10px] mt-0.5">Metalúrgica Força e Aço Ltda S.A.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
