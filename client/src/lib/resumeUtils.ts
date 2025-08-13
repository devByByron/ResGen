export const formatBulletPoints = (text: any): string => {
  if (!text) return '';
  
  // Ensure text is a string
  const textStr = typeof text === 'string' ? text : String(text);
  
  // Convert bullet points to HTML list items
  const lines = textStr.split('\n').filter(line => line.trim());
  let html = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
      // Remove the bullet character and add as list item
      const content = trimmedLine.replace(/^[•\-*]\s*/, '');
      html += `<li>${content}</li>`;
    } else if (trimmedLine) {
      // Regular text line
      html += `<li>${trimmedLine}</li>`;
    }
  }
  
  return html ? `<ul class="list-disc">${html}</ul>` : '';
};

export const enhanceJobDescription = (description: string): string => {
  if (!description) return '';
  
  // Add action verbs if they're missing
  const actionVerbs = [
    'Led', 'Managed', 'Developed', 'Implemented', 'Designed', 'Created',
    'Improved', 'Optimized', 'Increased', 'Reduced', 'Achieved', 'Collaborated',
    'Coordinated', 'Established', 'Built', 'Launched', 'Streamlined', 'Delivered'
  ];
  
  const lines = description.split('\n').filter(line => line.trim());
  const enhancedLines = lines.map(line => {
    const trimmedLine = line.trim().replace(/^[•\-*]\s*/, '');
    
    // Check if line starts with an action verb
    const startsWithActionVerb = actionVerbs.some(verb => 
      trimmedLine.toLowerCase().startsWith(verb.toLowerCase())
    );
    
    if (!startsWithActionVerb && trimmedLine.length > 0) {
      // Try to add an appropriate action verb based on context
      if (trimmedLine.includes('team') || trimmedLine.includes('people')) {
        return `Led ${trimmedLine.toLowerCase()}`;
      } else if (trimmedLine.includes('system') || trimmedLine.includes('application')) {
        return `Developed ${trimmedLine.toLowerCase()}`;
      } else if (trimmedLine.includes('performance') || trimmedLine.includes('efficiency')) {
        return `Improved ${trimmedLine.toLowerCase()}`;
      } else {
        return `Achieved ${trimmedLine.toLowerCase()}`;
      }
    }
    
    return trimmedLine;
  });
  
  return enhancedLines.join('\n');
};

export const calculateATSKeywords = (resumeData: any): string[] => {
  const keywords: string[] = [];
  
  // Extract from skills
  if (resumeData.skills?.technical) {
    keywords.push(...resumeData.skills.technical.split(',').map((s: string) => s.trim()));
  }
  
  // Extract from job titles and company names
  resumeData.experience?.forEach((exp: any) => {
    if (exp.jobTitle) keywords.push(exp.jobTitle);
    if (exp.company) keywords.push(exp.company);
  });
  
  // Extract from education
  resumeData.education?.forEach((edu: any) => {
    if (edu.degree) keywords.push(edu.degree);
    if (edu.fieldOfStudy) keywords.push(edu.fieldOfStudy);
  });
  
  // Extract from certifications
  resumeData.certifications?.forEach((cert: any) => {
    if (cert.name) keywords.push(cert.name);
  });
  
  // Return unique keywords
  return Array.from(new Set(keywords.filter(k => k && k.length > 2)));
};
