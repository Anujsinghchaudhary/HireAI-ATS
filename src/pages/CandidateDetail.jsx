import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Mail, Phone, MapPin, Calendar,
    Briefcase, GraduationCap, Star, CheckCircle2,
    XCircle, AlertTriangle, Lightbulb, MessageSquare,
    ChevronDown, ChevronUp
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';
import { getCandidates, updateCandidate } from '../services/puter';
import './CandidateDetail.css';

const STATUSES = ['new', 'screening', 'interview', 'offer', 'hired', 'rejected'];

export default function CandidateDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        skills: true,
        analysis: true,
        recommendations: true
    });

    useEffect(() => {
        const loadCandidate = async () => {
            const candidates = await getCandidates();
            const found = candidates.find(c => c.id === id);
            if (found) setCandidate(found);
        };
        loadCandidate();
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        await updateCandidate(id, { status: newStatus });
        setCandidate(prev => ({ ...prev, status: newStatus }));
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    if (!candidate) {
        return (
            <div className="candidate-detail animate-fade-in">
                <button className="btn btn-ghost" onClick={() => navigate('/candidates')}>
                    <ArrowLeft size={16} /> Back to Candidates
                </button>
                <div className="empty-state mt-lg">
                    <h3>Candidate not found</h3>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const map = {
            new: 'badge-info', screening: 'badge-warning', interview: 'badge-primary',
            offer: 'badge-success', hired: 'badge-success', rejected: 'badge-danger'
        };
        return <span className={`badge ${map[status] || 'badge-info'}`}>{status}</span>;
    };

    return (
        <div className="candidate-detail animate-fade-in">
            <button className="btn btn-ghost mb-lg" onClick={() => navigate('/candidates')}>
                <ArrowLeft size={16} /> Back to Candidates
            </button>

            <div className="candidate-detail-grid">
                {/* Left Panel — Profile */}
                <div className="candidate-profile glass-card">
                    <div className="profile-header">
                        <div className="profile-avatar-lg">
                            {candidate.name?.charAt(0) || '?'}
                        </div>
                        <h2 className="profile-name">{candidate.name}</h2>
                        <p className="profile-title">{candidate.title}</p>
                        {getStatusBadge(candidate.status)}
                    </div>

                    <div className="profile-info-list">
                        <div className="profile-info-item">
                            <Mail size={14} /> {candidate.email}
                        </div>
                        <div className="profile-info-item">
                            <Phone size={14} /> {candidate.phone}
                        </div>
                        <div className="profile-info-item">
                            <MapPin size={14} /> {candidate.location}
                        </div>
                        <div className="profile-info-item">
                            <Briefcase size={14} /> {candidate.experience}
                        </div>
                        <div className="profile-info-item">
                            <GraduationCap size={14} /> {candidate.education}
                        </div>
                        <div className="profile-info-item">
                            <Calendar size={14} /> Applied {new Date(candidate.appliedAt).toLocaleDateString()}
                        </div>
                    </div>

                    {/* Status Pipeline */}
                    <div className="status-pipeline">
                        <h4>Pipeline Status</h4>
                        <div className="pipeline-steps">
                            {STATUSES.filter(s => s !== 'rejected').map((status, i) => {
                                const currentIdx = STATUSES.indexOf(candidate.status);
                                const statusIdx = STATUSES.indexOf(status);
                                const isActive = status === candidate.status;
                                const isPast = statusIdx < currentIdx && candidate.status !== 'rejected';
                                return (
                                    <button
                                        key={status}
                                        className={`pipeline-step ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}
                                        onClick={() => handleStatusChange(status)}
                                    >
                                        <div className="pipeline-dot">
                                            {isPast ? <CheckCircle2 size={14} /> : (i + 1)}
                                        </div>
                                        <span>{status}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {candidate.status !== 'rejected' && (
                            <button
                                className="btn btn-danger btn-sm mt-md w-full"
                                onClick={() => handleStatusChange('rejected')}
                            >
                                <XCircle size={14} /> Reject Candidate
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Panel — Analysis */}
                <div className="candidate-analysis">
                    {/* Score */}
                    <div className="glass-card analysis-score-card">
                        <div className="score-section">
                            <ScoreGauge score={candidate.matchScore || 0} size={150} />
                            <div className="score-meta">
                                <h3>Applied for: {candidate.jobTitle}</h3>
                                <p className="text-secondary text-sm">
                                    {candidate.analysis?.overallAssessment || 'AI analysis pending.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="glass-card collapsible-section">
                        <button className="section-toggle" onClick={() => toggleSection('skills')}>
                            <h3><Star size={18} /> Skills & Expertise</h3>
                            {expandedSections.skills ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {expandedSections.skills && (
                            <div className="section-content">
                                <div className="skills-grid">
                                    {candidate.skills?.map((skill, i) => (
                                        <span key={i} className="skill-tag skill-matched">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AI Analysis */}
                    <div className="glass-card collapsible-section">
                        <button className="section-toggle" onClick={() => toggleSection('analysis')}>
                            <h3><MessageSquare size={18} /> AI Analysis</h3>
                            {expandedSections.analysis ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {expandedSections.analysis && candidate.analysis && (
                            <div className="section-content">
                                <div className="analysis-group">
                                    <h4 className="analysis-group-title">
                                        <CheckCircle2 size={14} className="text-success" /> Strengths
                                    </h4>
                                    <ul className="analysis-list">
                                        {candidate.analysis.strengths?.map((s, i) => (
                                            <li key={i}>{s}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="analysis-group">
                                    <h4 className="analysis-group-title">
                                        <AlertTriangle size={14} className="text-warning" /> Concerns
                                    </h4>
                                    <ul className="analysis-list">
                                        {candidate.analysis.concerns?.map((c, i) => (
                                            <li key={i}>{c}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recommendations */}
                    <div className="glass-card collapsible-section">
                        <button className="section-toggle" onClick={() => toggleSection('recommendations')}>
                            <h3><Lightbulb size={18} /> Recommendations</h3>
                            {expandedSections.recommendations ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {expandedSections.recommendations && candidate.analysis && (
                            <div className="section-content">
                                <ul className="analysis-list recommendations-list">
                                    {candidate.analysis.recommendations?.map((r, i) => (
                                        <li key={i}>{r}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
