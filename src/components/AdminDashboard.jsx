import React, { useState, useEffect } from 'react';
import { LogOut, Download, RefreshCw } from 'lucide-react';
import { getAllAssessments, getAssessmentStats } from '../lib/supabase';

export default function AdminDashboard({ onLogout }) {
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [assessmentsData, statsData] = await Promise.all([
        getAllAssessments(),
        getAssessmentStats()
      ]);
      setAssessments(assessmentsData);
      calculateStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (!data || data.length === 0) {
      setStats(null);
      return;
    }

    const clusters = {};
    let totalAiAppetite = 0;
    let totalReadiness = 0;

    data.forEach(item => {
      clusters[item.cluster] = (clusters[item.cluster] || 0) + 1;
      totalAiAppetite += item.ai_appetite;
      totalReadiness += item.readiness;
    });

    setStats({
      totalAssessments: data.length,
      clusters,
      avgAiAppetite: (totalAiAppetite / data.length).toFixed(2),
      avgReadiness: (totalReadiness / data.length).toFixed(2),
    });
  };

  const filteredAssessments = filter === 'all' 
    ? assessments 
    : assessments.filter(a => a.cluster === filter);

  const exportToCSV = () => {
    if (!assessments.length) return;

    const headers = ['Name', 'Email', 'Age', 'Role', 'Department', 'Years Exp', 
                    'AI Skill', 'Curiosity', 'Process Improve', 'Adaptability', 
                    'Willingness', 'Business Knowledge', 'AI Appetite', 'Readiness', 
                    'Overall', 'Cluster', 'Tier'];
    
    const rows = assessments.map(a => [
      a.name, a.email, a.age, a.role, a.department, a.years_experience,
      a.ai_skill, a.ai_curiosity, a.process_improvement, a.adaptability,
      a.willingness, a.business_knowledge, a.ai_appetite, a.readiness,
      a.overall, a.cluster, a.tier
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI-Army-Assessments-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const clusterColors = {
    'AI Champions': 'bg-purple-100 border-purple-300',
    'AI Accelerators': 'bg-blue-100 border-blue-300',
    'AI Builders': 'bg-cyan-100 border-cyan-300',
    'AI Learners': 'bg-amber-100 border-amber-300',
    'AI Explorers': 'bg-gray-100 border-gray-300',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">AI Army Dashboard</h1>
            <p className="text-slate-400">Member Analytics & Cluster Overview</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
            Error: {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-300 text-lg">Loading assessments...</p>
          </div>
        ) : !stats ? (
          <div className="text-center py-12">
            <p className="text-slate-300 text-lg">No assessments yet</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                <p className="text-slate-400 text-sm font-semibold mb-1">Total Members</p>
                <p className="text-4xl font-bold text-white">{stats.totalAssessments}</p>
              </div>
              <div className="bg-blue-600 rounded-lg p-6 border border-blue-500">
                <p className="text-blue-100 text-sm font-semibold mb-1">Avg AI Appetite</p>
                <p className="text-4xl font-bold text-white">{stats.avgAiAppetite}</p>
                <p className="text-blue-200 text-xs mt-1">/ 5.0</p>
              </div>
              <div className="bg-indigo-600 rounded-lg p-6 border border-indigo-500">
                <p className="text-indigo-100 text-sm font-semibold mb-1">Avg Readiness</p>
                <p className="text-4xl font-bold text-white">{stats.avgReadiness}</p>
                <p className="text-indigo-200 text-xs mt-1">/ 5.0</p>
              </div>
              {Object.entries(stats.clusters).slice(0, 2).map(([cluster, count]) => (
                <div key={cluster} className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                  <p className="text-slate-400 text-sm font-semibold mb-1 truncate">{cluster}</p>
                  <p className="text-3xl font-bold text-white">{count}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                <h2 className="text-xl font-bold text-white mb-6">Cluster Distribution</h2>
                <div className="space-y-4">
                  {Object.entries(stats.clusters).map(([cluster, count]) => {
                    const percentage = ((count / stats.totalAssessments) * 100).toFixed(1);
                    return (
                      <div key={cluster}>
                        <div className="flex justify-between mb-2">
                          <span className="text-slate-300 font-semibold">{cluster}</span>
                          <span className="text-white font-bold">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                <h2 className="text-xl font-bold text-white mb-6">Members by Cluster</h2>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(stats.clusters).map(([cluster, count]) => (
                    <div
                      key={cluster}
                      className={`rounded-lg p-4 border ${clusterColors[cluster] || 'bg-gray-100'}`}
                    >
                      <p className="font-semibold text-gray-900 text-sm">{cluster}</p>
                      <p className="text-2xl font-bold text-gray-800 mt-2">{count}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-6 border border-slate-600 mb-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <label className="text-slate-300 font-semibold mr-3">Filter:</label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 bg-slate-600 text-white border border-slate-500 rounded-lg"
                  >
                    <option value="all">All Members</option>
                    {Object.keys(stats.clusters).map(cluster => (
                      <option key={cluster} value={cluster}>{cluster}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={loadData}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                  >
                    <RefreshCw size={18} />
                    Refresh
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                  >
                    <Download size={18} />
                    Export CSV
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg border border-slate-600 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800 border-b border-slate-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-slate-300 font-semibold">Name</th>
                      <th className="px-4 py-3 text-left text-slate-300 font-semibold">Email</th>
                      <th className="px-4 py-3 text-left text-slate-300 font-semibold">Role</th>
                      <th className="px-4 py-3 text-center text-slate-300 font-semibold">AI Appetite</th>
                      <th className="px-4 py-3 text-center text-slate-300 font-semibold">Readiness</th>
                      <th className="px-4 py-3 text-left text-slate-300 font-semibold">Cluster</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-600">
                    {filteredAssessments.map((assessment, idx) => (
                      <tr key={idx} className="hover:bg-slate-600 transition">
                        <td className="px-4 py-3 text-white font-medium">{assessment.name}</td>
                        <td className="px-4 py-3 text-slate-300 text-sm">{assessment.email}</td>
                        <td className="px-4 py-3 text-slate-300">{assessment.role}</td>
                        <td className="px-4 py-3 text-center font-bold text-blue-400">{assessment.ai_appetite}</td>
                        <td className="px-4 py-3 text-center font-bold text-indigo-400">{assessment.readiness}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${clusterColors[assessment.cluster] || 'bg-gray-100'}`}>
                            {assessment.cluster}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-center text-slate-400 text-sm mt-6">
              Showing {filteredAssessments.length} of {stats.totalAssessments} members
            </p>
          </>
        )}
      </div>
    </div>
  );
}
