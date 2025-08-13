import { GoogleGenerativeAI } from '@google/generative-ai';
import { ResumeData } from '@shared/schema';

const genAI = new GoogleGenerativeAI(process.env.VITE_GOOGLE_API_KEY || '');

// The newest Gemini model is "gemini-2.0-flash-exp", not older versions
const DEFAULT_MODEL_STR = "gemini-2.0-flash-exp";

const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL_STR });

export interface GenerateResumeRequest {
  jobTitle?: string;
  industry?: string;
  experienceLevel?: string;
  skills?: string;
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  additionalInfo?: string;
}

export async function generateResumeFromPrompt(request: GenerateResumeRequest): Promise<ResumeData> {
  const prompt = `You are an expert career coach and resume writer. Generate a complete, professional resume based on the following information:

Job Title: ${request.jobTitle || 'Not specified'}
Industry: ${request.industry || 'Not specified'}
Experience Level: ${request.experienceLevel || 'Not specified'}
Skills: ${request.skills || 'Not specified'}
Personal Info: ${JSON.stringify(request.personalInfo || {})}
Additional Info: ${request.additionalInfo || 'None provided'}

Create a comprehensive resume with:
1. Professional summary (2-3 sentences)
2. Work experience (2-3 relevant positions with achievements)
3. Education (relevant degree)
4. Skills (technical and soft skills)
5. At least 1 certification if relevant to the role

Make the content realistic, professional, and ATS-friendly. Use action verbs and quantifiable achievements.

Return the response as a JSON object matching this exact structure:
{
  "personalInfo": {
    "fullName": "string",
    "email": "string", 
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "website": "string",
    "summary": "string"
  },
  "experience": [
    {
      "jobTitle": "string",
      "company": "string", 
      "location": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "current": false,
      "achievements": "• Bullet point 1\\n• Bullet point 2\\n• Bullet point 3"
    }
  ],
  "education": [
    {
      "degree": "string",
      "fieldOfStudy": "string",
      "school": "string",
      "location": "string", 
      "graduationYear": "YYYY",
      "gpa": "string"
    }
  ],
  "skills": {
    "technical": "skill1, skill2, skill3",
    "soft": "skill1, skill2, skill3", 
    "languages": "language1, language2"
  },
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "YYYY-MM",
      "url": "string"
    }
  ],
  "projects": []
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const resumeData = JSON.parse(jsonMatch[0]);
    return resumeData as ResumeData;
  } catch (error) {
    console.error('Error generating resume:', error);
    throw new Error('Failed to generate resume with AI');
  }
}

export async function parseResumeText(resumeText: string): Promise<ResumeData> {
  const prompt = `You are an expert resume parser. Extract and structure the information from this resume text into a standardized format.

Resume Text:
${resumeText}

Parse the resume and return the data as a JSON object matching this exact structure:
{
  "personalInfo": {
    "fullName": "string",
    "email": "string", 
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "website": "string",
    "summary": "string"
  },
  "experience": [
    {
      "jobTitle": "string",
      "company": "string", 
      "location": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "current": false,
      "achievements": "• Bullet point 1\\n• Bullet point 2\\n• Bullet point 3"
    }
  ],
  "education": [
    {
      "degree": "string",
      "fieldOfStudy": "string",
      "school": "string",
      "location": "string", 
      "graduationYear": "YYYY",
      "gpa": "string"
    }
  ],
  "skills": {
    "technical": "skill1, skill2, skill3",
    "soft": "skill1, skill2, skill3", 
    "languages": "language1, language2"
  },
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "YYYY-MM",
      "url": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": "string",
      "url": "string"
    }
  ]
}

If information is missing, use empty strings or empty arrays. Ensure all dates are in YYYY-MM format.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const resumeData = JSON.parse(jsonMatch[0]);
    return resumeData as ResumeData;
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse resume with AI');
  }
}

export async function enhanceResumeContent(resumeData: ResumeData, targetRole?: string): Promise<ResumeData> {
  const prompt = `You are an expert resume writer and ATS optimization specialist. Enhance the following resume content to make it more professional, impactful, and ATS-friendly${targetRole ? ` for a ${targetRole} position` : ''}.

Current Resume Data:
${JSON.stringify(resumeData, null, 2)}

Enhance the resume by:
1. Improving the professional summary with stronger language and keywords
2. Rewriting experience achievements with action verbs and quantifiable results
3. Optimizing skills for ATS compatibility
4. Ensuring consistent formatting and professional language
5. Adding relevant keywords for the target role${targetRole ? ` (${targetRole})` : ''}

Return the enhanced resume as a JSON object with the same structure as provided, but with improved content.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const enhancedData = JSON.parse(jsonMatch[0]);
    return enhancedData as ResumeData;
  } catch (error) {
    console.error('Error enhancing resume:', error);
    throw new Error('Failed to enhance resume with AI');
  }
}
