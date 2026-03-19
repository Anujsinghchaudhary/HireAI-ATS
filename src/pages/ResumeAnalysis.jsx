import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import * as mammoth from 'mammoth/mammoth.browser';
import {
    Upload, FileText, Sparkles, CheckCircle2,
    AlertTriangle, XCircle, Loader2, ChevronDown,
    Star, Target, BookOpen, MessageSquare, Zap,
    ArrowRight
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';
import { getJobs, analyzeResume, addCandidate, parseResume, generateFeedback } from '../services/puter';
import './ResumeAnalysis.css';

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export default function ResumeAnalysis() {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [fileName, setFileName] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');
    const [results, setResults] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadJobs = async () => {
            const data = await getJobs();
            setJobs(data.filter(j => j.status === 'open'));
        };
        loadJobs();
    }, []);

    const extractPdfText = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument({ data: arrayBuffer }).promise;
        const pageTexts = [];

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
            const page = await pdf.getPage(pageNumber);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map(item => ('str' in item ? item.str : ''))
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();

            if (pageText) {
                pageTexts.push(pageText);
            }
        }

        return pageTexts.join('\n\n');
    };

    const extractDocxText = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value?.trim() || '';
    };

    const readResumeFile = async (file) => {
        const extension = file.name.split('.').pop()?.toLowerCase();

        if (file.type === 'application/pdf' || extension === 'pdf') {
            return await extractPdfText(file);
        }

        if (
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            || extension === 'docx'
        ) {
            return await extractDocxText(file);
        }

        return await file.text();
    };

    const handleFileSelect = async (file) => {
        if (!file) return;

        setFileName(file.name);
        try {
            const content = await readResumeFile(file);
            if (!content.trim()) {
                throw new Error('No readable text found in file');
            }
            setResumeText(content);
            setError('');
        } catch (err) {
            setError('Failed to extract readable text from this file. Please upload a text-based PDF/DOCX or paste resume text.');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const handleAnalyze = async () => {
        if (!resumeText.trim()) {
            setError('Please upload or paste a resume first.');
            return;
        }
        if (!selectedJob) {
            setError('Please select a job to match against.');
            return;
        }

        setAnalyzing(true);
        setError('');
        setResults(null);
        setFeedback(null);

        const job = jobs.find(j => j.id === selectedJob);
        const jobDescription = `${job.title}\n\n${job.description}\n\nRequirements: ${job.requirements}`;

        try {
            setProgress(15);
            setProgressMessage('Parsing resume...');
            const parsed = await parseResume(resumeText);
            await new Promise(r => setTimeout(r, 500));

            setProgress(45);
            setProgressMessage('Running AI analysis...');
            const analysis = await analyzeResume(resumeText, jobDescription);
            await new Promise(r => setTimeout(r, 300));

            setProgress(75);
            setProgressMessage('Generating feedback...');
            const fb = await generateFeedback(resumeText, jobDescription, analysis.matchScore);

            setProgress(90);
            setProgressMessage('Saving results...');

            const candidateData = {
                name: parsed?.name || 'Unknown Candidate',
                email: parsed?.email || '',
                phone: parsed?.phone || '',
                title: parsed?.title || '',
                location: parsed?.location || '',
                jobId: job.id,
                jobTitle: job.title,
                matchScore: analysis.matchScore || 0,
                skills: analysis.skills?.matched || parsed?.skills || [],
                experience: parsed?.experience?.[0]?.duration || `${analysis.experience?.totalYears || 0} years`,
                education: parsed?.education?.[0] ? `${parsed.education[0].degree}, ${parsed.education[0].institution}` : analysis.education?.details || '',
                analysis: {
                    overallAssessment: analysis.overallAssessment,
                    strengths: analysis.strengths,
                    concerns: analysis.concerns,
                    recommendations: analysis.recommendations
                }
            };

            await addCandidate(candidateData);

            setProgress(100);
            setProgressMessage('Complete!');
            setResults(analysis);
            setFeedback(fb);

        } catch (err) {
            console.error('Analysis error:', err);
            setError(`Analysis failed: ${err.message}. Make sure you are signed in to Puter.`);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="resume-analysis-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Resume Analysis</h1>
                    <p>Upload a resume and let AI evaluate it against your job listings.</p>
                </div>
            </div>

            <div className="analysis-layout">
                <div className="upload-section glass-card">
                    <h3><Upload size={18} /> Upload Resume</h3>

                    <div
                        className={`drop-zone ${dragOver ? 'drag-over' : ''} ${fileName ? 'has-file' : ''}`}
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={e => handleFileSelect(e.target.files[0])}
                            accept=".txt,.pdf,.md,.docx"
                            hidden
                        />
                        {fileName ? (
                            <div className="file-selected">
                                <FileText size={32} className="file-icon" />
                                <span className="file-name">{fileName}</span>
                                <span className="file-change">Click to change</span>
                            </div>
                        ) : (
                            <div className="drop-prompt">
                                <Upload size={40} className="drop-icon" />
                                <p className="drop-title">Drag & drop resume here</p>
                                <p className="drop-subtitle">or click to browse (TXT, PDF, DOCX)</p>
                            </div>
                        )}
                    </div>

                    <div className="paste-divider">
                        <span>OR</span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Paste Resume Text</label>
                        <textarea
                            className="form-textarea resume-textarea"
                            value={resumeText}
                            onChange={e => { setResumeText(e.target.value); setFileName(''); }}
                            placeholder="Paste the full resume text here..."
                            rows={8}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Match Against Job *</label>
                        <select
                            className="form-select"
                            value={selectedJob}
                            onChange={e => setSelectedJob(e.target.value)}
                        >
                            <option value="">Select a job listing...</option>
                            {jobs.map(job => (
                                <option key={job.id} value={job.id}>
                                    {job.title} — {job.department}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && (
                        <div className="analysis-error">
                            <XCircle size={16} /> {error}
                        </div>
                    )}

                    <button
                        className="btn btn-primary btn-lg w-full"
                        onClick={handleAnalyze}
                        disabled={analyzing}
                    >
                        {analyzing ? (
                            <>
                                <Loader2 size={18} className="spinner" /> Analyzing...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} /> Analyze with AI
                            </>
                        )}
                    </button>

                    {analyzing && (
                        <div className="progress-section">
                            <div className="progress-bar-bg">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="progress-text">{progressMessage}</p>
                        </div>
                    )}
                </div>

                <div className="results-section">
                    {!results && !analyzing && (
                        <div className="results-placeholder glass-card">
                            <Sparkles size={48} className="placeholder-icon" />
                            <h3>AI Analysis Results</h3>
                            <p>Upload a resume and select a job to see AI-powered analysis results here.</p>
                        </div>
                    )}

                    {analyzing && !results && (
                        <div className="results-placeholder glass-card">
                            <Loader2 size={48} className="spinner placeholder-icon" />
                            <h3>Analyzing Resume...</h3>
                            <p>{progressMessage}</p>
                        </div>
                    )}

                    {results && (
                        <div className="results-content stagger-children">
                            <div className="glass-card results-score-card">
                                <div className="results-score-layout">
                                    <ScoreGauge score={results.matchScore || 0} size={160} />
                                    <div className="results-score-info">
                                        <h3>Analysis Complete</h3>
                                        <p className="text-secondary">{results.overallAssessment}</p>
                                        <div className="results-quick-stats">
                                            <div className="quick-stat">
                                                <CheckCircle2 size={14} className="text-success" />
                                                <span>{results.skills?.matched?.length || 0} skills matched</span>
                                            </div>
                                            <div className="quick-stat">
                                                <AlertTriangle size={14} className="text-warning" />
                                                <span>{results.skills?.missing?.length || 0} skills missing</span>
                                            </div>
                                            <div className="quick-stat">
                                                <Star size={14} style={{ color: 'var(--color-warning)' }} />
                                                <span>{results.experience?.relevantYears || 0}yr relevant exp</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card">
                                <h3 className="result-section-title"><Target size={18} /> Skills Analysis</h3>
                                {results.skills?.matched?.length > 0 && (
                                    <div className="skills-group">
                                        <h4 className="skills-group-label">
                                            <CheckCircle2 size={14} /> Matched Skills
                                        </h4>
                                        <div className="skills-grid">
                                            {results.skills.matched.map((s, i) => (
                                                <span key={i} className="skill-tag skill-matched">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {results.skills?.missing?.length > 0 && (
                                    <div className="skills-group">
                                        <h4 className="skills-group-label missing-label">
                                            <XCircle size={14} /> Missing Skills
                                        </h4>
                                        <div className="skills-grid">
                                            {results.skills.missing.map((s, i) => (
                                                <span key={i} className="skill-tag skill-missing">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {results.skills?.additional?.length > 0 && (
                                    <div className="skills-group">
                                        <h4 className="skills-group-label extra-label">
                                            <Zap size={14} /> Additional Skills
                                        </h4>
                                        <div className="skills-grid">
                                            {results.skills.additional.map((s, i) => (
                                                <span key={i} className="skill-tag skill-extra">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="glass-card">
                                <h3 className="result-section-title"><MessageSquare size={18} /> Assessment</h3>
                                <div className="assessment-grid">
                                    <div>
                                        <h4 className="assessment-label text-success">
                                            <CheckCircle2 size={14} /> Strengths
                                        </h4>
                                        <ul className="analysis-list">
                                            {results.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="assessment-label text-warning">
                                            <AlertTriangle size={14} /> Concerns
                                        </h4>
                                        <ul className="analysis-list">
                                            {results.concerns?.map((c, i) => <li key={i}>{c}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {results.interviewQuestions?.length > 0 && (
                                <div className="glass-card">
                                    <h3 className="result-section-title"><BookOpen size={18} /> Suggested Interview Questions</h3>
                                    <ol className="interview-questions">
                                        {results.interviewQuestions.map((q, i) => (
                                            <li key={i}>{q}</li>
                                        ))}
                                    </ol>
                                </div>
                            )}

                            {feedback && (
                                <div className="glass-card feedback-card">
                                    <h3 className="result-section-title"><Sparkles size={18} /> Candidate Feedback</h3>
                                    <p className="text-secondary mb-md">{feedback.overallFeedback}</p>

                                    {feedback.resumeImprovements?.length > 0 && (
                                        <div className="feedback-section">
                                            <h4>Resume Improvements</h4>
                                            {feedback.resumeImprovements.map((imp, i) => (
                                                <div key={i} className="feedback-item">
                                                    <span className={`badge badge-${imp.priority === 'High' ? 'danger' : imp.priority === 'Medium' ? 'warning' : 'info'}`}>
                                                        {imp.priority}
                                                    </span>
                                                    <div>
                                                        <strong>{imp.section}:</strong> {imp.suggestion}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="results-actions">
                                <button className="btn btn-primary" onClick={() => navigate('/candidates')}>
                                    View Candidates <ArrowRight size={16} />
                                </button>
                                <button className="btn btn-secondary" onClick={() => {
                                    setResults(null);
                                    setFeedback(null);
                                    setResumeText('');
                                    setFileName('');
                                    setProgress(0);
                                }}>
                                    Analyze Another
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
