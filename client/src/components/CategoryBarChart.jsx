import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CategoryBarChart({ categoryName, items = [] }) {
  const chartData = items.map((item) => ({
    name: item.description.length > 22 ? `${item.description.substring(0, 20)}...` : item.description,
    fullDescription: item.description,
    scope: item.scopeQuantity,
    executed: item.executedQuantity,
    percent: item.percentProgress,
    uom: item.uom,
    isLagging: item.isLagging,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-xl max-w-xs border border-slate-800">
          <p className="font-bold text-sm mb-1 text-blue-300">{data.fullDescription}</p>
          <div className="space-y-1">
            <p className="flex justify-between">
              <span className="text-slate-400">Total Scope:</span>
              <span className="font-bold text-slate-200">{data.scope} {data.uom}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-400">Executed Work:</span>
              <span className="font-bold text-blue-400">{data.executed} {data.uom}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-slate-400">% Completed:</span>
              <span className={`font-bold ${data.isLagging ? 'text-rose-400' : 'text-emerald-400'}`}>
                {data.percent}% {data.isLagging ? '(Lagging!)' : ''}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">{categoryName} - Scope vs Executed</h3>
          <p className="text-xs text-slate-500">Comparison of Total Scope vs Executed Work items</p>
        </div>
        <div className="flex items-center space-x-4 text-xs font-semibold">
          <span className="flex items-center text-slate-600">
            <span className="w-3 h-3 bg-slate-300 rounded-sm mr-1.5 inline-block"></span> Total Scope
          </span>
          <span className="flex items-center text-slate-600">
            <span className="w-3 h-3 bg-blue-600 rounded-sm mr-1.5 inline-block"></span> Executed Work
          </span>
        </div>
      </div>

      <div className="h-72 w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[600px] h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748b' }}
                interval={0}
                angle={-25}
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="scope" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={30} name="Total Scope" />
              <Bar dataKey="executed" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={30} name="Executed Work" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
