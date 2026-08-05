import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

export default function WeightagePieChart({ categorySummaries }) {
  const data = categorySummaries.map((cat) => ({
    name: cat.name,
    value: cat.overallWeightage,
    earned: cat.earnedProgress,
    progress: cat.percentProgress,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-xl border border-slate-800">
          <p className="font-bold text-sm mb-1">{dataPoint.name}</p>
          <p>Overall Weightage: <span className="font-bold text-blue-400">{dataPoint.value}%</span></p>
          <p>Category Completion: <span className="font-bold text-emerald-400">{dataPoint.progress}%</span></p>
          <p>Earned Progress Contribution: <span className="font-bold text-amber-400">{dataPoint.earned}%</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-slate-800">Weightage Distribution</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Proportional weightage contribution across S&T categories
        </p>
      </div>

      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-xs font-semibold text-slate-700">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
