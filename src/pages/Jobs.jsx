import { useState, useEffect } from 'react';
import {
    Plus, Search, Filter, MapPin, Clock,
    DollarSign, Users, MoreVertical, Edit,
    Trash2, Eye, Briefcase
} from 'lucide-react';
import Modal from '../components/Modal';
import { getJobs, addJob, updateJob, deleteJob } from '../services/puter';
import './Jobs.css';

const DEPARTMENTS = ['Engineering', 'Design', 'AI/ML', 'Marketing', 'Sales', 'Infrastructure', 'Product', 'HR'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];

const emptyForm = {
    title: '', department: '', location: '', type: 'Full-time',
    salary: '', description: '', requirements: '', status: 'open'
};

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState('');
    const [filterDept, setFilterDept] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [menuOpen, setMenuOpen] = useState(null);

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        const data = await getJobs();
        setJobs(data);
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
            job.department?.toLowerCase().includes(search.toLowerCase());
        const matchesDept = !filterDept || job.department === filterDept;
        const matchesStatus = !filterStatus || job.status === filterStatus;
        return matchesSearch && matchesDept && matchesStatus;
    });

    const handleOpenCreate = () => {
        setEditingJob(null);
        setForm(emptyForm);
        setModalOpen(true);
    };

    const handleOpenEdit = (job) => {
        setEditingJob(job);
        setForm({ ...job });
        setModalOpen(true);
        setMenuOpen(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingJob) {
            await updateJob(editingJob.id, form);
        } else {
            await addJob(form);
        }
        await loadJobs();
        setModalOpen(false);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this job listing?')) {
            await deleteJob(id);
            await loadJobs();
        }
        setMenuOpen(null);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'open': return <span className="badge badge-success">Open</span>;
            case 'closed': return <span className="badge badge-danger">Closed</span>;
            case 'draft': return <span className="badge badge-warning">Draft</span>;
            default: return <span className="badge badge-info">{status}</span>;
        }
    };

    return (
        <div className="jobs-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Job Listings</h1>
                    <p>Manage your open positions and job postings.</p>
                </div>
                <button className="btn btn-primary" onClick={handleOpenCreate}>
                    <Plus size={16} />
                    Create Job
                </button>
            </div>

            {/* Filters */}
            <div className="jobs-filters glass-card">
                <div className="filter-search">
                    <Search size={16} className="filter-search-icon" />
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '2.25rem' }}
                    />
                </div>
                <select
                    className="form-select"
                    value={filterDept}
                    onChange={e => setFilterDept(e.target.value)}
                >
                    <option value="">All Departments</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select
                    className="form-select"
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                </select>
            </div>

            {/* Job Cards */}
            <div className="cards-grid">
                {filteredJobs.map(job => (
                    <div key={job.id} className="job-card glass-card">
                        <div className="job-card-header">
                            <div className="job-card-icon">
                                <Briefcase size={20} />
                            </div>
                            <div className="job-card-actions">
                                {getStatusBadge(job.status)}
                                <div className="dropdown-wrapper">
                                    <button
                                        className="btn-icon btn-ghost"
                                        onClick={() => setMenuOpen(menuOpen === job.id ? null : job.id)}
                                    >
                                        <MoreVertical size={16} />
                                    </button>
                                    {menuOpen === job.id && (
                                        <div className="dropdown-menu glass-card">
                                            <button onClick={() => handleOpenEdit(job)}>
                                                <Edit size={14} /> Edit
                                            </button>
                                            <button className="dropdown-danger" onClick={() => handleDelete(job.id)}>
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <h3 className="job-card-title">{job.title}</h3>
                        <p className="job-card-dept">{job.department}</p>

                        <div className="job-card-meta">
                            <span><MapPin size={14} /> {job.location}</span>
                            <span><Clock size={14} /> {job.type}</span>
                        </div>

                        {job.salary && (
                            <div className="job-card-salary">
                                <DollarSign size={14} /> {job.salary}
                            </div>
                        )}

                        <p className="job-card-desc">{job.description?.substring(0, 120)}...</p>

                        <div className="job-card-footer">
                            <span className="job-applicants">
                                <Users size={14} /> {job.applicants || 0} applicants
                            </span>
                            <span className="job-date">
                                {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredJobs.length === 0 && (
                <div className="empty-state">
                    <Briefcase size={48} />
                    <h3>No jobs found</h3>
                    <p>Create your first job listing to get started.</p>
                    <button className="btn btn-primary mt-md" onClick={handleOpenCreate}>
                        <Plus size={16} /> Create Job
                    </button>
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingJob ? 'Edit Job Listing' : 'Create Job Listing'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="job-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Job Title *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g. Senior Frontend Developer"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Department *</label>
                            <select
                                className="form-select"
                                value={form.department}
                                onChange={e => setForm({ ...form, department: e.target.value })}
                                required
                            >
                                <option value="">Select Department</option>
                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Location *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={form.location}
                                onChange={e => setForm({ ...form, location: e.target.value })}
                                placeholder="e.g. Remote, New York, NY"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Type</label>
                            <select
                                className="form-select"
                                value={form.type}
                                onChange={e => setForm({ ...form, type: e.target.value })}
                            >
                                {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Salary Range</label>
                            <input
                                type="text"
                                className="form-input"
                                value={form.salary}
                                onChange={e => setForm({ ...form, salary: e.target.value })}
                                placeholder="e.g. $100,000 - $140,000"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                className="form-select"
                                value={form.status}
                                onChange={e => setForm({ ...form, status: e.target.value })}
                            >
                                <option value="open">Open</option>
                                <option value="draft">Draft</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description *</label>
                        <textarea
                            className="form-textarea"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
                            required
                            rows={4}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Requirements</label>
                        <textarea
                            className="form-textarea"
                            value={form.requirements}
                            onChange={e => setForm({ ...form, requirements: e.target.value })}
                            placeholder="List required skills, experience, and qualifications (comma separated)..."
                            rows={3}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {editingJob ? 'Update Job' : 'Create Job'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
