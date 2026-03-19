import { RESUME_ANALYSIS_PROMPT, RESUME_PARSE_PROMPT, FEEDBACK_PROMPT } from './aiPrompts';

const getPuter = () => {
    if (typeof window !== 'undefined' && window.puter) {
        return window.puter;
    }
    return null;
};

export const signIn = async () => {
    const puter = getPuter();
    if (!puter) throw new Error('Puter.js not loaded');
    return await puter.auth.signIn();
};

export const signOut = async () => {
    const puter = getPuter();
    if (!puter) return;
    window.location.reload();
};

export const getUser = async () => {
    const puter = getPuter();
    if (!puter) return null;
    try {
        const user = await puter.auth.getUser();
        return user;
    } catch {
        return null;
    }
};

export const isSignedIn = () => {
    const puter = getPuter();
    if (!puter) return false;
    return puter.auth?.isSignedIn?.() ?? false;
};

export const analyzeResume = async (resumeText, jobDescription) => {
    const puter = getPuter();
    if (!puter) throw new Error('Puter.js not loaded');

    const prompt = RESUME_ANALYSIS_PROMPT(resumeText, jobDescription);

    const response = await puter.ai.chat(prompt, { model: 'gpt-4o-mini' });
    const text = typeof response === 'string' ? response : response?.message?.content || response?.toString() || '';

    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('No JSON found in response');
    } catch (e) {
        console.error('Failed to parse AI response:', e);
        return {
            matchScore: 0,
            overallAssessment: 'Unable to parse AI response. Please try again.',
            skills: { matched: [], missing: [], additional: [] },
            experience: { totalYears: 0, relevantYears: 0, summary: '' },
            education: { level: '', relevance: '', details: '' },
            strengths: [],
            concerns: ['AI response parsing failed'],
            recommendations: ['Please retry the analysis'],
            keywordMatch: { found: [], missing: [] },
            cultureFit: 'Unknown',
            interviewQuestions: []
        };
    }
};

export const parseResume = async (resumeText) => {
    const puter = getPuter();
    if (!puter) throw new Error('Puter.js not loaded');

    const prompt = RESUME_PARSE_PROMPT(resumeText);
    const response = await puter.ai.chat(prompt, { model: 'gpt-4o-mini' });
    const text = typeof response === 'string' ? response : response?.message?.content || response?.toString() || '';

    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('No JSON found');
    } catch {
        return null;
    }
};

export const generateFeedback = async (resumeText, jobDescription, matchScore) => {
    const puter = getPuter();
    if (!puter) throw new Error('Puter.js not loaded');

    const prompt = FEEDBACK_PROMPT(resumeText, jobDescription, matchScore);
    const response = await puter.ai.chat(prompt, { model: 'gpt-4o-mini' });
    const text = typeof response === 'string' ? response : response?.message?.content || response?.toString() || '';

    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('No JSON found');
    } catch {
        return null;
    }
};

const JOBS_KEY = 'ats_jobs';

export const getJobs = async () => {
    const puter = getPuter();
    if (!puter) return getDemoJobs();
    try {
        const data = await puter.kv.get(JOBS_KEY);
        if (!data || data === '' || data === 'null' || data === 'undefined') return getDemoJobs();
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : getDemoJobs();
    } catch {
        return getDemoJobs();
    }
};

export const saveJobs = async (jobs) => {
    const puter = getPuter();
    if (!puter) return;
    await puter.kv.set(JOBS_KEY, JSON.stringify(jobs));
};

export const addJob = async (job) => {
    const jobs = await getJobs();
    const newJob = {
        ...job,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        applicants: 0,
        status: job.status || 'open'
    };
    jobs.push(newJob);
    await saveJobs(jobs);
    return newJob;
};

export const updateJob = async (id, updates) => {
    const jobs = await getJobs();
    const idx = jobs.findIndex(j => j.id === id);
    if (idx !== -1) {
        jobs[idx] = { ...jobs[idx], ...updates };
        await saveJobs(jobs);
        return jobs[idx];
    }
    return null;
};

export const deleteJob = async (id) => {
    const jobs = await getJobs();
    const filtered = jobs.filter(j => j.id !== id);
    await saveJobs(filtered);
};

const CANDIDATES_KEY = 'ats_candidates';

export const getCandidates = async () => {
    const puter = getPuter();
    if (!puter) return getDemoCandidates();
    try {
        const data = await puter.kv.get(CANDIDATES_KEY);
        if (!data || data === '' || data === 'null' || data === 'undefined') return getDemoCandidates();
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : getDemoCandidates();
    } catch {
        return getDemoCandidates();
    }
};

export const saveCandidates = async (candidates) => {
    const puter = getPuter();
    if (!puter) return;
    await puter.kv.set(CANDIDATES_KEY, JSON.stringify(candidates));
};

export const addCandidate = async (candidate) => {
    const candidates = await getCandidates();
    const newCandidate = {
        ...candidate,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'new'
    };
    candidates.push(newCandidate);
    await saveCandidates(candidates);
    return newCandidate;
};

export const updateCandidate = async (id, updates) => {
    const candidates = await getCandidates();
    const idx = candidates.findIndex(c => c.id === id);
    if (idx !== -1) {
        candidates[idx] = { ...candidates[idx], ...updates };
        await saveCandidates(candidates);
        return candidates[idx];
    }
    return null;
};

export const deleteCandidate = async (id) => {
    const candidates = await getCandidates();
    const filtered = candidates.filter(c => c.id !== id);
    await saveCandidates(filtered);
};

export const getDemoJobs = () => [
    {
        id: '1',
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        location: 'Remote',
        type: 'Full-time',
        salary: '$120,000 - $160,000',
        status: 'open',
        description: 'We are looking for an experienced Frontend Developer proficient in React, TypeScript, and modern CSS. You will build responsive, performant user interfaces for our SaaS platform.',
        requirements: 'React, TypeScript, CSS/SCSS, REST APIs, Git, 5+ years experience, Bachelor\'s degree in CS or related field',
        applicants: 24,
        createdAt: '2026-02-20T10:00:00Z'
    },
    {
        id: '2',
        title: 'Machine Learning Engineer',
        department: 'AI/ML',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$150,000 - $200,000',
        status: 'open',
        description: 'Join our AI team to develop and deploy machine learning models. Work on NLP, computer vision, and recommendation systems.',
        requirements: 'Python, TensorFlow/PyTorch, MLOps, Statistics, PhD or MS in CS/ML, 3+ years experience',
        applicants: 18,
        createdAt: '2026-02-18T09:00:00Z'
    },
    {
        id: '3',
        title: 'Product Designer',
        department: 'Design',
        location: 'New York, NY',
        type: 'Full-time',
        salary: '$100,000 - $140,000',
        status: 'open',
        description: 'Design beautiful, intuitive user experiences for our products. Collaborate closely with engineering and product teams.',
        requirements: 'Figma, User Research, Prototyping, Design Systems, 4+ years experience',
        applicants: 31,
        createdAt: '2026-02-15T14:00:00Z'
    },
    {
        id: '4',
        title: 'DevOps Engineer',
        department: 'Infrastructure',
        location: 'Remote',
        type: 'Contract',
        salary: '$130,000 - $170,000',
        status: 'closed',
        description: 'Build and maintain CI/CD pipelines, cloud infrastructure, and monitoring systems.',
        requirements: 'AWS/GCP, Kubernetes, Docker, Terraform, CI/CD, Linux, 4+ years experience',
        applicants: 12,
        createdAt: '2026-02-10T08:00:00Z'
    }
];

export const getDemoCandidates = () => [
    {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah.chen@email.com',
        phone: '+1 555-0101',
        title: 'Senior React Developer',
        location: 'San Francisco, CA',
        jobId: '1',
        jobTitle: 'Senior Frontend Developer',
        matchScore: 92,
        status: 'interview',
        skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'CSS-in-JS', 'Testing'],
        experience: '7 years',
        education: 'MS Computer Science, Stanford',
        appliedAt: '2026-02-22T10:30:00Z',
        analysis: {
            overallAssessment: 'Exceptional candidate with strong React expertise and relevant SaaS experience. Highly recommended for interview.',
            strengths: ['Deep React/TypeScript expertise', 'SaaS platform experience', 'Strong testing practices'],
            concerns: ['May be overqualified for some aspects'],
            recommendations: ['Ask about architecture decisions', 'Discuss team leadership experience']
        }
    },
    {
        id: '2',
        name: 'Marcus Johnson',
        email: 'marcus.j@email.com',
        phone: '+1 555-0102',
        title: 'ML Research Engineer',
        location: 'Boston, MA',
        jobId: '2',
        jobTitle: 'Machine Learning Engineer',
        matchScore: 87,
        status: 'screening',
        skills: ['Python', 'PyTorch', 'NLP', 'Computer Vision', 'MLOps', 'Statistics'],
        experience: '5 years',
        education: 'PhD Machine Learning, MIT',
        appliedAt: '2026-02-21T14:00:00Z',
        analysis: {
            overallAssessment: 'Strong ML background with relevant NLP and CV experience. PhD research aligns well with team goals.',
            strengths: ['PhD in ML', 'Published research', 'Production ML experience'],
            concerns: ['Limited industry experience outside academia'],
            recommendations: ['Evaluate production engineering skills', 'Discuss transition from academia']
        }
    },
    {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily.r@email.com',
        phone: '+1 555-0103',
        title: 'UX/UI Designer',
        location: 'Austin, TX',
        jobId: '3',
        jobTitle: 'Product Designer',
        matchScore: 78,
        status: 'new',
        skills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'Design Systems', 'HTML/CSS'],
        experience: '4 years',
        education: 'BFA Interaction Design, RISD',
        appliedAt: '2026-02-23T09:15:00Z',
        analysis: {
            overallAssessment: 'Solid design skills with strong user research background. Good cultural fit potential.',
            strengths: ['Strong portfolio', 'User research methodology', 'Design system experience'],
            concerns: ['Could benefit from more enterprise product experience'],
            recommendations: ['Review portfolio in detail', 'Discuss design process']
        }
    },
    {
        id: '4',
        name: 'Alex Kim',
        email: 'alex.kim@email.com',
        phone: '+1 555-0104',
        title: 'Full Stack Developer',
        location: 'Remote',
        jobId: '1',
        jobTitle: 'Senior Frontend Developer',
        matchScore: 71,
        status: 'new',
        skills: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'Express', 'Git'],
        experience: '3 years',
        education: 'BS Computer Science, UCLA',
        appliedAt: '2026-02-24T11:00:00Z',
        analysis: {
            overallAssessment: 'Promising full-stack developer with React experience. Could grow into the role with mentoring.',
            strengths: ['Full-stack perspective', 'Quick learner', 'Open source contributions'],
            concerns: ['Less experience than required', 'Missing TypeScript expertise'],
            recommendations: ['Assess TypeScript learning ability', 'Consider for junior variant of role']
        }
    },
    {
        id: '5',
        name: 'Priya Patel',
        email: 'priya.p@email.com',
        phone: '+1 555-0105',
        title: 'Senior Software Engineer',
        location: 'Seattle, WA',
        jobId: '1',
        jobTitle: 'Senior Frontend Developer',
        matchScore: 85,
        status: 'offer',
        skills: ['React', 'TypeScript', 'Webpack', 'Performance Optimization', 'Accessibility', 'CSS'],
        experience: '6 years',
        education: 'MS Software Engineering, Carnegie Mellon',
        appliedAt: '2026-02-19T16:30:00Z',
        analysis: {
            overallAssessment: 'Excellent candidate with strong frontend specialization and accessibility focus.',
            strengths: ['Performance optimization expert', 'Accessibility champion', 'Mentoring experience'],
            concerns: ['Salary expectations may be at top of range'],
            recommendations: ['Discuss performance case studies', 'Evaluate team fit']
        }
    }
];
