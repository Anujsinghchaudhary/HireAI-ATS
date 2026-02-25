import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase, Users, FileSearch, Target,
    TrendingUp, Clock, Star, ArrowRight,
    BarChart3, Activity
} from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import StatCard from '../components/StatCard';
import { getJobs, getCandidates } from '../services/puter';
import './Dashboard.css';

const applicationData = [
    { name: 'Mon', applications: 12, interviews: 3 },
    { name: 'Tue', applications: 19, interviews: 5 },
    { name: 'Wed', applications: 15, interviews: 4 },
    { name: 'Thu', applications: 22, interviews: 7 },
    { name: 'Fri', applications: 28, interviews: 8 },
    { name: 'Sat', applications: 8, interviews: 2 },
    { name: 'Sun', applications: 5, interviews: 1 },
];

const departmentData = [
    { name: 'Engineering', openings: 8, filled: 12 },
    { name: 'Design', openings: 3, filled: 5 },
    { name: 'Marketing', openings: 4, filled: 7 },
    { name: 'AI/ML', openings: 5, filled: 3 },
    { name: 'Sales', openings: 6, filled: 9 },
];

const recentActivity = [
    { id: 1, text: 'Sarah Chen moved to Interview stage', time: '2 hours ago', type: 'interview' },
    { id: 2, text: 'New application for Senior Frontend Developer', time: '3 hours ago', type: 'application' },
    { id: 3, text: 'Resume analysis completed for Marcus Johnson', time: '5 hours ago', type: 'analysis' },
    { id: 4, text: 'Priya Patel received offer', time: '8 hours ago', type: 'offer' },
    { id: 5, text: 'New job posted: DevOps Engineer', time: '1 day ago', type: 'job' },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="chart-tooltip glass-card">
                <p className="tooltip-label">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }} className="tooltip-value">
                        {entry.name}: <strong>{entry.value}</strong>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function Dashboard() {
    const [jobs, setJobs] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            const [jobsData, candidatesData] = await Promise.all([
                getJobs(),
                getCandidates()
            ]);
            setJobs(jobsData);
            setCandidates(candidatesData);
        };
        loadData();
    }, []);

    const activeJobs = jobs.filter(j => j.status === 'open').length;
    const avgScore = candidates.length
        ? Math.round(candidates.reduce((sum, c) => sum + (c.matchScore || 0), 0) / candidates.length)
        : 0;

    return (
        <div className="dashboard animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back! Here's your hiring pipeline overview.</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/resume-analysis')}>
                    <FileSearch size={16} />
                    Analyze Resume
                </button>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid stagger-children">
                <StatCard
                    icon={Briefcase}
                    label="Active Jobs"
                    value={activeJobs}
                    trend="up"
                    trendValue="+12%"
                    color="primary"
                />
                <StatCard
                    icon={Users}
                    label="Total Candidates"
                    value={candidates.length}
                    trend="up"
                    trendValue="+24%"
                    color="success"
                />
                <StatCard
                    icon={FileSearch}
                    label="Resumes Analyzed"
                    value={candidates.length}
                    trend="up"
                    trendValue="+18%"
                    color="info"
                />
                <StatCard
                    icon={Target}
                    label="Avg Match Score"
                    value={`${avgScore}%`}
                    trend="up"
                    trendValue="+5%"
                    color="warning"
                />
            </div>

            {/* Charts Row */}
            <div className="two-col-grid">
                <div className="glass-card chart-card">
                    <div className="chart-header">
                        <div>
                            <h3>Application Trends</h3>
                            <p className="text-secondary text-sm">Weekly application activity</p>
                        </div>
                        <div className="badge badge-success">
                            <Activity size={12} /> Live
                        </div>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={applicationData}>
                                <defs>
                                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="applications"
                                    stroke="#6366f1"
                                    fill="url(#colorApps)"
                                    strokeWidth={2}
                                    name="Applications"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="interviews"
                                    stroke="#22c55e"
                                    fill="url(#colorInterviews)"
                                    strokeWidth={2}
                                    name="Interviews"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card chart-card">
                    <div className="chart-header">
                        <div>
                            <h3>Department Breakdown</h3>
                            <p className="text-secondary text-sm">Openings vs Filled positions</p>
                        </div>
                        <div className="badge badge-primary">
                            <BarChart3 size={12} /> Overview
                        </div>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={departmentData} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="openings" fill="#6366f1" radius={[4, 4, 0, 0]} name="Openings" />
                                <Bar dataKey="filled" fill="#22c55e" radius={[4, 4, 0, 0]} name="Filled" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="two-col-grid mt-lg">
                {/* Recent Activity */}
                <div className="glass-card">
                    <div className="chart-header">
                        <h3>Recent Activity</h3>
                        <button className="btn btn-ghost btn-sm">View All</button>
                    </div>
                    <div className="activity-list">
                        {recentActivity.map(item => (
                            <div key={item.id} className="activity-item">
                                <div className={`activity-dot activity-dot-${item.type}`} />
                                <div className="activity-content">
                                    <p className="activity-text">{item.text}</p>
                                    <span className="activity-time">
                                        <Clock size={12} /> {item.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Candidates */}
                <div className="glass-card">
                    <div className="chart-header">
                        <h3>Top Candidates</h3>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/candidates')}>
                            View All <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="top-candidates-list">
                        {candidates
                            .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
                            .slice(0, 5)
                            .map((candidate, index) => (
                                <div
                                    key={candidate.id}
                                    className="candidate-row"
                                    onClick={() => navigate(`/candidates/${candidate.id}`)}
                                >
                                    <div className="candidate-rank">{index + 1}</div>
                                    <div className="candidate-avatar-sm">
                                        {candidate.name?.charAt(0) || '?'}
                                    </div>
                                    <div className="candidate-info-sm">
                                        <span className="candidate-name-sm">{candidate.name}</span>
                                        <span className="candidate-job-sm">{candidate.jobTitle}</span>
                                    </div>
                                    <div className="candidate-score-sm">
                                        <Star size={14} className="star-icon" />
                                        <span>{candidate.matchScore}%</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
