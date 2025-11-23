import React, { useState, useEffect } from 'react';
import { Check, X, Plus, Trash2, ExternalLink } from 'lucide-react';
import axios from 'axios';

const DSProblemTracker = () => {
    // Use relative URL in production, localhost in development
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
    
    const [patterns, setPatterns] = useState([]);
    const [problems, setProblems] = useState([]);
    const [newPatternName, setNewPatternName] = useState('');
    const [expandedPattern, setExpandedPattern] = useState(null);
    const [loading, setLoading] = useState(true);

    const gradients = [
        'from-purple-500 to-pink-500',
        'from-blue-500 to-cyan-500',
        'from-green-500 to-emerald-500',
        'from-orange-500 to-red-500',
        'from-indigo-500 to-purple-500',
        'from-yellow-500 to-orange-500',
        'from-pink-500 to-rose-500',
        'from-teal-500 to-green-500'
    ];

    // Fetch data from backend
    useEffect(() => {
        fetchPatterns();
        fetchProblems();
    }, []);

    const fetchPatterns = async () => {
        try {
            const response = await axios.get(`${API_URL}/pattern`);
            setPatterns(response.data);
        } catch (error) {
            console.error('Error fetching patterns:', error);
        }
    };

    const fetchProblems = async () => {
        try {
            const response = await axios.get(`${API_URL}/problem`);
            setProblems(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching problems:', error);
            setLoading(false);
        }
    };

    const addPattern = async () => {
        if (newPatternName.trim()) {
            try {
                await axios.post(`${API_URL}/pattern`, {
                    name: newPatternName
                });
                setNewPatternName('');
                fetchPatterns();
            } catch (error) {
                console.error('Error adding pattern:', error);
            }
        }
    };

    const deletePattern = async (patternId) => {
        try {
            await axios.delete(`${API_URL}/pattern/${patternId}`);
            fetchPatterns();
        } catch (error) {
            console.error('Error deleting pattern:', error);
        }
    };

    const addProblem = async (patternId) => {
        try {
            const response = await axios.post(`${API_URL}/problem`, {
                name: 'New Problem',
                link: 'https://leetcode.com/',
                solved: false,
                notes: '',
                patternId: patternId
            });
            console.log('Problem added:', response.data);
            await fetchProblems();
        } catch (error) {
            console.error('Error adding problem:', error);
            alert('Failed to add problem. Check console for details.');
        }
    };

    const updateProblem = async (problemId, field, value) => {
        try {
            const problem = problems.find(p => p._id === problemId);
            const updatedProblem = { ...problem, [field]: value };

            await axios.put(`${API_URL}/problem/${problemId}`, updatedProblem);

            setProblems(problems.map(p =>
                p._id === problemId ? { ...p, [field]: value } : p
            ));
        } catch (error) {
            console.error('Error updating problem:', error);
        }
    };

    const deleteProblem = async (problemId) => {
        try {
            await axios.delete(`${API_URL}/problem/${problemId}`);
            fetchProblems();
        } catch (error) {
            console.error('Error deleting problem:', error);
        }
    };

    const toggleSolved = async (problemId) => {
        const problem = problems.find(p => p._id === problemId);
        await updateProblem(problemId, 'solved', !problem.solved);
    };

    // Get problems for a specific pattern
    const getPatternProblems = (patternId) => {
        return problems.filter(p => p.patternId === patternId);
    };

    const getStats = (patternId) => {
        const patternProblems = getPatternProblems(patternId);
        const solved = patternProblems.filter(p => p.solved).length;
        const total = patternProblems.length;
        return {
            solved,
            total,
            percentage: total > 0 ? Math.round((solved / total) * 100) : 0
        };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-4">
                        Pattern Wise DSA Questions
                    </h1>
                    
                </div>

                {/* Add New Pattern */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20 shadow-2xl">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newPatternName}
                            onChange={(e) => setNewPatternName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addPattern()}
                            placeholder="Add new pattern (e.g., Dynamic Programming)"
                            className="flex-1 px-6 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                            onClick={addPattern}
                            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                        >
                            <Plus size={20} /> Add Pattern
                        </button>
                    </div>
                </div>

                {/* Patterns Grid */}
                <div className="space-y-6">
                    {patterns.map((pattern, index) => {
                        const stats = getStats(pattern._id);
                        const patternProblems = getPatternProblems(pattern._id);

                        return (
                            <div key={pattern._id} className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                                {/* Pattern Header */}
                                <div
                                    className={`bg-gradient-to-r ${gradients[index % gradients.length]} p-6 cursor-pointer hover:opacity-90 transition-all`}
                                    onClick={() => setExpandedPattern(expandedPattern === pattern._id ? null : pattern._id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <h2 className="text-3xl font-bold text-white">{pattern.name}</h2>
                                            <div className="bg-white/20 px-4 py-1 rounded-full">
                                                <span className="text-white font-semibold">{stats.solved}/{stats.total}</span>
                                            </div>
                                            {stats.total > 0 && (
                                                <div className="bg-white/20 px-4 py-1 rounded-full">
                                                    <span className="text-white font-semibold">{stats.percentage}%</span>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deletePattern(pattern._id);
                                            }}
                                            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
                                        >
                                            <Trash2 size={20} className="text-white" />
                                        </button>
                                    </div>
                                    {stats.total > 0 && (
                                        <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-white h-full transition-all duration-500"
                                                style={{ width: `${stats.percentage}%` }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Problems List */}
                                {expandedPattern === pattern._id && (
                                    <div className="p-6">
                                        <div className="space-y-3 mb-4">
                                            {patternProblems.map(problem => (
                                                <div key={problem._id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                                                    <div className="grid grid-cols-12 gap-3 items-center">
                                                        {/* Solved Checkbox */}
                                                        <div className="col-span-1 flex justify-center">
                                                            <button
                                                                onClick={() => toggleSolved(problem._id)}
                                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${problem.solved
                                                                    ? 'bg-green-500 shadow-lg shadow-green-500/50'
                                                                    : 'bg-white/10 border border-white/20'
                                                                    }`}
                                                            >
                                                                {problem.solved ? (
                                                                    <Check size={18} className="text-white" />
                                                                ) : (
                                                                    <X size={18} className="text-gray-400" />
                                                                )}
                                                            </button>
                                                        </div>

                                                        {/* Problem Name */}
                                                        <div className="col-span-4">
                                                            <input
                                                                type="text"
                                                                value={problem.name}
                                                                onChange={(e) => updateProblem(problem._id, 'name', e.target.value)}
                                                                placeholder="Problem name"
                                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                            />
                                                        </div>

                                                        {/* Link */}
                                                        <div className="col-span-3 flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={problem.link}
                                                                onChange={(e) => updateProblem(problem._id, 'link', e.target.value)}
                                                                placeholder="Problem URL"
                                                                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                            />
                                                            {problem.link && (
                                                                <a
                                                                    href={problem.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-all"
                                                                >
                                                                    <ExternalLink size={18} className="text-white" />
                                                                </a>
                                                            )}
                                                        </div>

                                                        {/* Notes */}
                                                        <div className="col-span-3">
                                                            <input
                                                                type="text"
                                                                value={problem.notes || ''}
                                                                onChange={(e) => updateProblem(problem._id, 'notes', e.target.value)}
                                                                placeholder="Notes / Hints"
                                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                            />
                                                        </div>

                                                        {/* Delete Button */}
                                                        <div className="col-span-1 flex justify-center">
                                                            <button
                                                                onClick={() => deleteProblem(problem._id)}
                                                                className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-all"
                                                            >
                                                                <Trash2 size={18} className="text-red-400" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => addProblem(pattern._id)}
                                            className="w-full py-3 bg-white/5 border-2 border-dashed border-white/20 rounded-xl text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Plus size={20} /> Add Problem
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DSProblemTracker;