import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProjectDashboard, fetchProjectItems } from '../api/client';
import Navbar from '../components/Navbar';
import CategoryStatCard from '../components/CategoryStatCard';
import WeightagePieChart from '../components/WeightagePieChart';
import CategoryBarChart from '../components/CategoryBarChart';
import ExcelDataTable from '../components/ExcelDataTable';
import { Calendar, MapPin, AlertTriangle, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const { id } = useParams();

  const [dashboardData, setDashboardData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Indoor Work');
  const [categoryItems, setCategoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadDashboardData = async (isHardRefresh = false) => {
    if (isHardRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await fetchProjectDashboard(id);
      setDashboardData(data);

      const itemsData = await fetchProjectItems(id, activeCategory);
      setCategoryItems(itemsData.items || []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to fetch dashboard data from server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadCategoryItems = async (catName) => {
    setActiveCategory(catName);
    try {
      const itemsData = await fetchProjectItems(id, catName);
      setCategoryItems(itemsData.items || []);
    } catch (err) {
      console.error('Failed to load category items:', err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [id]);

  useEffect(() => {
    loadCategoryItems(activeCategory);
  }, [activeCategory]);

  const handleItemUpdated = () => {
    fetchProjectDashboard(id).then((data) => setDashboardData(data));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="text-sm font-semibold text-slate-600">Loading Live Analytics Dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-4xl mx-auto w-full p-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-700">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold">Error Loading Dashboard</h3>
            <p className="text-sm mt-1 mb-4">{error || 'Project data unavailable'}</p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Project Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { project, categorySummaries, chartDataByCategory } = dashboardData;
  const currentCategoryChartItems = chartDataByCategory[activeCategory] || [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onRefresh={() => loadDashboardData(true)} isRefreshing={refreshing} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                Railway S&amp;T Project
              </span>
              <span className="flex items-center text-xs text-slate-500 font-medium">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {project.location}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {project.title}
            </h1>

            <div className="flex items-center space-x-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Day {project.daysElapsed} of {project.totalPlannedDays} Planned Days
              </span>
              <span>•</span>
              <span>Expected Timeline: <strong className="text-slate-800">{project.timelineProgress}%</strong></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-center sm:text-right">
              <span className="text-xs text-slate-500 font-medium block">Overall Progress</span>
              <span className="text-3xl font-black text-blue-600 tracking-tight">
                {project.overallProgress}%
              </span>
            </div>

            <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>

            <button
              onClick={() => loadDashboardData(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Hard Refresh DB</span>
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Category Progress Gauges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categorySummaries.map((summary) => (
              <CategoryStatCard key={summary.categoryId} summary={summary} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <WeightagePieChart categorySummaries={categorySummaries} />
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800">Category Weightage &amp; Completion Breakdown</h3>
              <p className="text-xs text-slate-500 mt-0.5 mb-4">
                Summary of weightages and earned progress contributions per category
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Weightage</th>
                      <th className="py-2.5 px-3 text-right">Completion</th>
                      <th className="py-2.5 px-3 text-right">Earned %</th>
                      <th className="py-2.5 px-3 text-center">Pace Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {categorySummaries.map((cat) => (
                      <tr key={cat.categoryId} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-slate-800">{cat.name}</td>
                        <td className="py-3 px-3 text-right font-mono text-slate-600">{cat.overallWeightage}%</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">{cat.percentProgress}%</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-blue-600">{cat.earnedProgress}%</td>
                        <td className="py-3 px-3 text-center">
                          {cat.laggingItemsCount > 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700">
                              <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
                              {cat.laggingItemsCount} Lagging
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">
                              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                              Healthy
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
              <span>Total Weightage: <strong>100%</strong></span>
              <span>Total Earned: <strong className="text-blue-600">{project.overallProgress}%</strong></span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-900">Editable Data Table (Excel-like)</h2>
            <span className="text-xs text-slate-500">Inline edits save instantly to MongoDB</span>
          </div>

          <ExcelDataTable
            items={categoryItems}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onItemUpdated={handleItemUpdated}
            projectId={id}
            timelineProgress={project.timelineProgress}
          />
        </div>

        <div>
          <CategoryBarChart
            categoryName={activeCategory}
            items={currentCategoryChartItems}
          />
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        Railway Infrastructure | S&amp;T Progress Tracker Dashboard &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
