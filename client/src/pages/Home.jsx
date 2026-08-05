import React, { useEffect, useState } from 'react';
import { fetchProjects } from '../api/client';
import ProjectCard from '../components/ProjectCard';
import Navbar from '../components/Navbar';
import CreateProjectModal from '../components/CreateProjectModal';
import { Layers, Activity, AlertTriangle, RefreshCw, Plus } from 'lucide-react';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError('Could not connect to backend server. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleProjectCreated = () => {
    loadProjects();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30 mb-3">
              <Activity className="w-3.5 h-3.5 mr-1.5" /> Live Project Analytics
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              S&amp;T Infrastructure Progress Hub
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
              Real-time reporting and progress tracking for Railway Signal &amp; Telecommunication projects across Indoor, Outdoor, Cables, and Telecom works.
            </p>
          </div>

          <div className="relative z-10">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-bold shadow-md transition cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Project</span>
            </button>
          </div>

          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Layers className="w-96 h-96" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Active Railway Projects</h2>
            <p className="text-xs text-slate-500">Select a project to view analytics dashboard &amp; editable tables</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>

            <button
              onClick={loadProjects}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Reload</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white h-64 rounded-xl border border-slate-200 p-6 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-16 bg-slate-100 rounded mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="font-bold">{error}</p>
            <button
              onClick={loadProjects}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition"
            >
              Retry Connection
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            No projects found. Click "Create New Project" above to create your first project.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </main>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        Railway Infrastructure | S&amp;T Progress Tracker &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
