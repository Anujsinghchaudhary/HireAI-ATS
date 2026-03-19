import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Filter, SortAsc, Users, Star,
    ArrowRight, Mail, MapPin, Briefcase
} from 'lucide-react';
import { getCandidates } from '../services/puter';
import './Candidates.css';

const STATUS_OPTIONS = [
    { value: '', label: 'All Status' },
    { value: 'new', label: 'New' },
    { value: 'screening', label: 'Screening' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' },
];

export default function Candidates() {
    const [candidates, setCandidates] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortBy, setSortBy] = useState('score');
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            const data = await getCandidates();
            setCandidates(data);
        };
        loadData();
    }, []);

    const filteredCandidates = candidates
        .filter(c => {
            const matchesSearch = c.name?.toLowerCase().includes(search.toLowerCase()) ||
                c.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
                c.email?.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = !statusFilter || c.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'score': return (b.matchScore || 0) - (a.matchScore || 0);
                case 'name': return (a.name || '').localeCompare(b.name || '');
                case 'date': return new Date(b.appliedAt || 0) - new Date(a.appliedAt || 0);
                default: return 0;
            }
        });

    const getStatusBadge = (status) => {
        const map = {
            new: 'badge-info',
            screening: 'badge-warning',
            interview: 'badge-primary',
            offer: 'badge-success',
            hired: 'badge-success',
            rejected: 'badge-danger'
        };
        return <span className={`badge ${map[status] || 'badge-info'}`}>{status}</span>;
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'var(--color-success)';
        if (score >= 60) return 'var(--color-warning)';
        return 'var(--color-danger)';
    };

    return (
        <div className="candidates-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Candidates</h1>
                    <p>{candidates.length} total candidates in your pipeline.</p>
                </div>
            </div>

            <div className="candidates-filters glass-card">
                <div className="filter-search">
                    <Search size={16} className="filter-search-icon" />
                    <input
                        type="text"
                        placeholder="Search candidates..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '2.25rem' }}
                    />
                </div>
                <select
                    className="form-select"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <select
                    className="form-select"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                >
                    <option value="score">Sort by Score</option>
                    <option value="name">Sort by Name</option>
                    <option value="date">Sort by Date</option>
                </select>
            </div>

            <div className="glass-card candidates-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Candidate</th>
                            <th>Applied For</th>
                            <th>Match Score</th>
                            <th>Status</th>
                            <th>Applied</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCandidates.map(candidate => (
                            <tr
                                key={candidate.id}
                                className="candidate-table-row"
                                onClick={() => navigate(`/candidates/${candidate.id}`)}
                            >
                                <td>
                                    <div className="candidate-cell">
                                        <div className="candidate-avatar">
                                            {candidate.name?.charAt(0) || '?'}
                                        </div>
                                        <div className="candidate-cell-info">
                                            <span className="candidate-cell-name">{candidate.name}</span>
                                            <span className="candidate-cell-detail">
                                                <Mail size={11} /> {candidate.email}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="candidate-cell-info">
                                        <span className="font-medium">{candidate.jobTitle}</span>
                                        <span className="candidate-cell-detail">
                                            <MapPin size={11} /> {candidate.location}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div className="score-cell">
                                        <div className="score-bar-bg">
                                            <div
                                                className="score-bar-fill"
                                                style={{
                                                    width: `${candidate.matchScore}%`,
                                                    background: getScoreColor(candidate.matchScore)
                                                }}
                                            />
                                        </div>
                                        <span
                                            className="score-number"
                                            style={{ color: getScoreColor(candidate.matchScore) }}
                                        >
                                            {candidate.matchScore}%
                                        </span>
                                    </div>
                                </td>
                                <td>{getStatusBadge(candidate.status)}</td>
                                <td className="text-secondary text-sm">
                                    {new Date(candidate.appliedAt).toLocaleDateString()}
                                </td>
                                <td>
                                    <button className="btn btn-ghost btn-sm">
                                        <ArrowRight size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredCandidates.length === 0 && (
                    <div className="empty-state">
                        <Users size={48} />
                        <h3>No candidates found</h3>
                        <p>Upload and analyze resumes to populate this list.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
