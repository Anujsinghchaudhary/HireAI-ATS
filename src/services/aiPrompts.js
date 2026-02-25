// AI Prompt templates for resume analysis

export const RESUME_ANALYSIS_PROMPT = (resumeText, jobDescription) => `
You are an expert HR AI assistant and ATS (Applicant Tracking System) analyzer. Analyze the following resume against the provided job description.

## Job Description:
${jobDescription}

## Resume:
${resumeText}

## Instructions:
Provide a comprehensive analysis in the following JSON format ONLY (no additional text):

{
  "matchScore": <number 0-100>,
  "overallAssessment": "<2-3 sentence summary>",
  "skills": {
    "matched": ["<skill1>", "<skill2>"],
    "missing": ["<skill1>", "<skill2>"],
    "additional": ["<skill1>", "<skill2>"]
  },
  "experience": {
    "totalYears": <number>,
    "relevantYears": <number>,
    "summary": "<brief experience summary>"
  },
  "education": {
    "level": "<highest education level>",
    "relevance": "<High/Medium/Low>",
    "details": "<education summary>"
  },
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "concerns": ["<concern1>", "<concern2>"],
  "recommendations": ["<recommendation1>", "<recommendation2>", "<recommendation3>"],
  "keywordMatch": {
    "found": ["<keyword1>", "<keyword2>"],
    "missing": ["<keyword1>", "<keyword2>"]
  },
  "cultureFit": "<High/Medium/Low>",
  "interviewQuestions": ["<question1>", "<question2>", "<question3>"]
}
`;

export const RESUME_PARSE_PROMPT = (resumeText) => `
You are an expert resume parser. Extract structured information from the following resume text.

## Resume:
${resumeText}

## Instructions:
Extract and return the following JSON format ONLY (no additional text):

{
  "name": "<full name>",
  "email": "<email address>",
  "phone": "<phone number>",
  "location": "<city, state/country>",
  "title": "<current/most recent job title>",
  "summary": "<professional summary in 2-3 sentences>",
  "skills": ["<skill1>", "<skill2>"],
  "experience": [
    {
      "title": "<job title>",
      "company": "<company name>",
      "duration": "<start - end>",
      "description": "<brief description>"
    }
  ],
  "education": [
    {
      "degree": "<degree>",
      "institution": "<school/university>",
      "year": "<graduation year>"
    }
  ],
  "certifications": ["<cert1>", "<cert2>"],
  "languages": ["<language1>", "<language2>"]
}
`;

export const FEEDBACK_PROMPT = (resumeText, jobDescription, matchScore) => `
You are a career coach AI. Based on the resume analysis results, provide actionable feedback to help the candidate improve their application.

Match Score: ${matchScore}/100

## Job Description:
${jobDescription}

## Resume:
${resumeText}

## Instructions:
Provide personalized, constructive feedback in the following JSON format ONLY:

{
  "overallFeedback": "<2-3 sentences of encouragement and key areas to focus on>",
  "resumeImprovements": [
    {
      "section": "<section name>",
      "suggestion": "<specific improvement suggestion>",
      "priority": "<High/Medium/Low>"
    }
  ],
  "skillGapSuggestions": [
    {
      "skill": "<missing skill>",
      "learningPath": "<how to acquire this skill>",
      "timeEstimate": "<estimated time to learn>"
    }
  ],
  "formattingTips": ["<tip1>", "<tip2>"],
  "atsOptimization": ["<tip1>", "<tip2>"]
}
`;
