import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Radio, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function Navbar({ onRefresh, isRefreshing }) {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/project/');

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:bg-blue-700 transition shadow-xs">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
                Railway Infrastructure
              </span>
              <span className="text-lg font-bold text-slate-800 tracking-tight leading-none group-hover:text-blue-600 transition">
                S&T Progress Tracker
              </span>
            </div>
          </Link>

          {isDashboard && (
            <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-slate-200">
              <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Project Hub
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium">Live DB Connected</span>
          </div>

          {isDashboard && onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3.5 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50"
              title="Trigger hard DB fetch"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
