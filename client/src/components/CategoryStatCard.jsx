import React from 'react';
import { AlertCircle, CheckCircle2, Cpu, Wrench, Cable, Wifi } from 'lucide-react';

const categoryIcons = {
  'Indoor Work': Cpu,
  'Outdoor Work': Wrench,
  Cables: Cable,
  Telecom: Wifi,
};

export default function CategoryStatCard({ summary }) {
  const {
    name,
    overallWeightage,
    earnedProgress,
    percentProgress,
    totalScope,
    totalExecuted,
    laggingItemsCount,
  } = summary;

  const IconComponent = categoryIcons[name] || Cpu;

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-200 transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-800">{name}</h4>
            <span className="text-xs text-slate-500 font-medium">
              Weightage: <strong className="text-slate-700">{overallWeightage}%</strong>
            </span>
          </div>
        </div>

        {laggingItemsCount > 0 ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3 mr-1 text-amber-600" />
            {laggingItemsCount} Lagging
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            On Track
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-2xl font-extrabold text-slate-900">
            {percentProgress}%
          </span>
          <span className="text-xs font-medium text-slate-500">
            Earned: <strong className="text-blue-600">{earnedProgress}%</strong>
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, percentProgress)}%` }}
          ></div>
        </div>

        <div className="mt-3 flex justify-between text-xs text-slate-500">
          <span>Executed: <strong className="text-slate-700">{totalExecuted}</strong></span>
          <span>Scope: <strong className="text-slate-700">{totalScope}</strong></span>
        </div>
      </div>
    </div>
  );
}
