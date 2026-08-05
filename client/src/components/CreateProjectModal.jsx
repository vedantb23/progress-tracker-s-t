import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { createProject } from '../api/client';

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [totalPlannedDays, setTotalPlannedDays] = useState(180);
  const [daysElapsed, setDaysElapsed] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) {
      setError('Project title and location are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newProj = await createProject({
        title: title.trim(),
        location: location.trim(),
        totalPlannedDays: Number(totalPlannedDays),
        daysElapsed: Number(daysElapsed),
      });

      setTitle('');
      setLocation('');
      setTotalPlannedDays(180);
      setDaysElapsed(30);
      onProjectCreated(newProj);
      onClose();
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-800">Create New Project</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Vizag Port Line S&T Works"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Location *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Visakhapatnam, AP"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Planned Days
              </label>
              <input
                type="number"
                min="1"
                value={totalPlannedDays}
                onChange={(e) => setTotalPlannedDays(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Days Elapsed
              </label>
              <input
                type="number"
                min="0"
                value={daysElapsed}
                onChange={(e) => setDaysElapsed(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
