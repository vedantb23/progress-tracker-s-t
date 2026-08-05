import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, AlertTriangle, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';

export default function ProjectCard({ project }) {
  const {
    _id,
    title,
    location,
    totalPlannedDays,
    daysElapsed,
    timelineProgress,
    overallProgress,
    totalItems,
    laggingItemsCount,
    categoryCount,
  } = project;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-2">
              <Layers className="w-3 h-3 mr-1" /> Railway S&T
            </span>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition">
              {title}
            </h3>
          </div>
          {laggingItemsCount > 0 ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
              {laggingItemsCount} Pace Flag{laggingItemsCount > 1 ? 's' : ''}
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              On Schedule
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center text-xs text-slate-500 space-x-4">
          <span className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
            {location}
          </span>
          <span className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
            {daysElapsed} / {totalPlannedDays} Days Elapsed ({timelineProgress}%)
          </span>
        </div>

        {/* Timeline vs Progress Bars */}
        <div className="mt-6 space-y-3">
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-600">Overall Executed Completion</span>
              <span className="font-bold text-blue-600">{overallProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, overallProgress)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
              <span>Expected Timeline Progress</span>
              <span>{timelineProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-slate-400 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, timelineProgress)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{totalItems} Line Items</span>
          <span>{categoryCount} Work Categories</span>
        </div>
      </div>

      <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100">
        <Link
          to={`/project/${_id}`}
          className="w-full inline-flex items-center justify-center text-sm font-semibold text-blue-600 hover:text-blue-700 group-hover:translate-x-0.5 transition"
        >
          View Dashboard & Editable Tables
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Link>
      </div>
    </div>
  );
}
