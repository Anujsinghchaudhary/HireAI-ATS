import { useState } from 'react';
import {
    User, Bell, Palette, Database, Shield,
    Save, RotateCcw, Trash2, Download, Moon, Sun
} from 'lucide-react';
import './Settings.css';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [settings, setSettings] = useState({
        name: 'Recruiter',
        email: 'recruiter@company.com',
        company: 'HireAI Corp',
        role: 'Head of Talent',
        aiModel: 'gpt-4o-mini',
        analysisDepth: 'comprehensive',
        autoScore: true,
        generateFeedback: true,
        emailNotifications: true,
        newApplication: true,
        analysisComplete: true,
        statusChange: false,
        darkMode: true,
        animations: true
    });

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const tabs = [
        { id: 'profile', icon: User, label: 'Profile' },
        { id: 'ai', icon: Database, label: 'AI Settings' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
        { id: 'appearance', icon: Palette, label: 'Appearance' },
        { id: 'data', icon: Shield, label: 'Data & Privacy' },
    ];

    return (
        <div className="settings-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h1>Settings</h1>
                    <p>Manage your account, preferences, and application settings.</p>
                </div>
            </div>

            <div className="settings-layout">
                {/* Tabs */}
                <div className="settings-tabs glass-card">
                    {tabs.map(({ id, icon: Icon, label }) => (
                        <button
                            key={id}
                            className={`settings-tab ${activeTab === id ? 'active' : ''}`}
                            onClick={() => setActiveTab(id)}
                        >
                            <Icon size={18} /> {label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="settings-content glass-card">
                    {activeTab === 'profile' && (
                        <div className="settings-section animate-fade-in">
                            <h2>Profile Settings</h2>
                            <p className="text-secondary mb-lg">Manage your personal information.</p>

                            <div className="settings-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={settings.name}
                                            onChange={e => handleChange('name', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            value={settings.email}
                                            onChange={e => handleChange('email', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Company</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={settings.company}
                                            onChange={e => handleChange('company', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Role</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={settings.role}
                                            onChange={e => handleChange('role', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="settings-actions">
                                <button className="btn btn-primary"><Save size={16} /> Save Changes</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ai' && (
                        <div className="settings-section animate-fade-in">
                            <h2>AI Configuration</h2>
                            <p className="text-secondary mb-lg">Configure how AI analyzes resumes and generates insights.</p>

                            <div className="settings-form">
                                <div className="form-group">
                                    <label className="form-label">AI Model</label>
                                    <select
                                        className="form-select"
                                        value={settings.aiModel}
                                        onChange={e => handleChange('aiModel', e.target.value)}
                                    >
                                        <option value="gpt-4o-mini">GPT-4o Mini (Fast)</option>
                                        <option value="gpt-4o">GPT-4o (Balanced)</option>
                                        <option value="claude-sonnet-4-20250514">Claude Sonnet (Detailed)</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Analysis Depth</label>
                                    <select
                                        className="form-select"
                                        value={settings.analysisDepth}
                                        onChange={e => handleChange('analysisDepth', e.target.value)}
                                    >
                                        <option value="quick">Quick — Score & key skills only</option>
                                        <option value="standard">Standard — Full skills analysis</option>
                                        <option value="comprehensive">Comprehensive — Full analysis + feedback</option>
                                    </select>
                                </div>

                                <div className="toggle-option">
                                    <div>
                                        <span className="toggle-label">Auto-score candidates</span>
                                        <span className="toggle-description">Automatically generate match scores for new applications</span>
                                    </div>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={settings.autoScore}
                                            onChange={e => handleChange('autoScore', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="toggle-option">
                                    <div>
                                        <span className="toggle-label">Generate feedback</span>
                                        <span className="toggle-description">Create improvement suggestions for candidates</span>
                                    </div>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={settings.generateFeedback}
                                            onChange={e => handleChange('generateFeedback', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="settings-actions">
                                <button className="btn btn-primary"><Save size={16} /> Save Changes</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="settings-section animate-fade-in">
                            <h2>Notification Preferences</h2>
                            <p className="text-secondary mb-lg">Choose what you want to be notified about.</p>

                            <div className="settings-form">
                                <div className="toggle-option">
                                    <div>
                                        <span className="toggle-label">Email Notifications</span>
                                        <span className="toggle-description">Receive notifications via email</span>
                                    </div>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={settings.emailNotifications}
                                            onChange={e => handleChange('emailNotifications', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="toggle-option">
                                    <div>
                                        <span className="toggle-label">New Applications</span>
                                        <span className="toggle-description">When a new candidate applies to a job</span>
                                    </div>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={settings.newApplication}
                                            onChange={e => handleChange('newApplication', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="toggle-option">
                                    <div>
                                        <span className="toggle-label">Analysis Complete</span>
                                        <span className="toggle-description">When AI finishes analyzing a resume</span>
                                    </div>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={settings.analysisComplete}
                                            onChange={e => handleChange('analysisComplete', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="toggle-option">
                                    <div>
                                        <span className="toggle-label">Status Changes</span>
                                        <span className="toggle-description">When a candidate's status is updated</span>
                                    </div>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={settings.statusChange}
                                            onChange={e => handleChange('statusChange', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="settings-actions">
                                <button className="btn btn-primary"><Save size={16} /> Save Changes</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="settings-section animate-fade-in">
                            <h2>Appearance</h2>
                            <p className="text-secondary mb-lg">Customize the look and feel of HireAI.</p>

                            <div className="settings-form">
                                <div className="theme-selector">
                                    <div className={`theme-option ${settings.darkMode ? 'active' : ''}`} onClick={() => handleChange('darkMode', true)}>
                                        <Moon size={24} />
                                        <span>Dark Mode</span>
                                    </div>
                                    <div className={`theme-option ${!settings.darkMode ? 'active' : ''}`} onClick={() => handleChange('darkMode', false)}>
                                        <Sun size={24} />
                                        <span>Light Mode</span>
                                    </div>
                                </div>

                                <div className="toggle-option">
                                    <div>
                                        <span className="toggle-label">Animations</span>
                                        <span className="toggle-description">Enable smooth transitions and animations</span>
                                    </div>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={settings.animations}
                                            onChange={e => handleChange('animations', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'data' && (
                        <div className="settings-section animate-fade-in">
                            <h2>Data & Privacy</h2>
                            <p className="text-secondary mb-lg">Manage your data and privacy settings.</p>

                            <div className="settings-form">
                                <div className="data-option">
                                    <div>
                                        <h4>Export Data</h4>
                                        <p className="text-secondary text-sm">Download all your jobs and candidates data as JSON.</p>
                                    </div>
                                    <button className="btn btn-secondary">
                                        <Download size={16} /> Export
                                    </button>
                                </div>

                                <div className="data-option">
                                    <div>
                                        <h4>Reset Data</h4>
                                        <p className="text-secondary text-sm">Reset all data to demo defaults. This cannot be undone.</p>
                                    </div>
                                    <button className="btn btn-secondary">
                                        <RotateCcw size={16} /> Reset
                                    </button>
                                </div>

                                <div className="data-option danger-option">
                                    <div>
                                        <h4>Clear All Data</h4>
                                        <p className="text-secondary text-sm">Permanently delete all jobs, candidates, and analysis data.</p>
                                    </div>
                                    <button className="btn btn-danger">
                                        <Trash2 size={16} /> Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
