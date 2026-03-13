// Mock candidate generator from file name
export function mockCandidateFromFile(file) {
  // Extract name from file name
  const name = file.name.replace(/(_|-|\.|resume|cv)/gi, ' ').replace(/\s+/g, ' ').trim();
  // Random skills, GPA, location, years exp
  const skillsPool = [
    'React', 'Node.js', 'MongoDB', 'PostgreSQL', 'NestJS', 'Kafka', 'TypeScript', 'Java', 'Spring Boot', 'Python', 'AWS', 'Docker', 'ElasticSearch', 'HTML', 'CSS', 'Vue', 'Angular', 'C#', 'SQL', 'Redis', 'CI/CD', 'Microservices', 'System Design', 'GCP', 'Azure'
  ];
  const locations = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];
  const randomSkills = () => {
    const count = Math.floor(Math.random() * 5) + 3;
    return Array.from({ length: count }, () => skillsPool[Math.floor(Math.random() * skillsPool.length)]);
  };
  const randomGPA = () => (3 + Math.random() * 1).toFixed(2);
  const randomExp = () => (Math.random() * 5 + 1).toFixed(1);
  const randomLocation = () => locations[Math.floor(Math.random() * locations.length)];

  return {
    id: Math.random().toString(36).slice(2),
    name,
    email: `${name.split(' ').join('.').toLowerCase()}@gmail.com`,
    phone: '09' + Math.floor(Math.random() * 100000000),
    skills: randomSkills(),
    gpa: randomGPA(),
    experience_years: randomExp(),
    location: randomLocation(),
    summary: `Strong experience in ${name.includes('Long') ? 'Node.js, NestJS' : 'React, Full Stack'} with GPA ${randomGPA()} and ${randomExp()} years exp.`,
    score: Math.floor(Math.random() * 40) + 60,
    status: 'In-Review',
    strengths: 'Robust backend, system design, high GPA',
    gaps: 'Lacks explicit React hands-on',
    resumeFile: file.name,
  };
}

// Filter and score candidates by prompt
export function filterCandidatesByPrompt(candidates, prompt) {
  // Simple keyword matching for demo
  const lowerPrompt = prompt.toLowerCase();
  return candidates
    .map(c => {
      let score = 0;
      if (lowerPrompt.includes('react') && c.skills.some(s => s.toLowerCase().includes('react'))) score += 20;
      if (lowerPrompt.includes('node') && c.skills.some(s => s.toLowerCase().includes('node'))) score += 20;
      if (lowerPrompt.includes('gpa')) {
        const gpaMatch = lowerPrompt.match(/gpa\s*(above|>)\s*([\d\.]+)/);
        if (gpaMatch && parseFloat(c.gpa) > parseFloat(gpaMatch[2])) score += 20;
      }
      if (lowerPrompt.includes('years')) {
        const expMatch = lowerPrompt.match(/(\d+)\+?\s*years/);
        if (expMatch && parseFloat(c.experience_years) >= parseFloat(expMatch[1])) score += 20;
      }
      if (lowerPrompt.includes('location')) {
        const locMatch = lowerPrompt.match(/location\s*([a-zA-Z\s]+)/);
        if (locMatch && c.location.toLowerCase().includes(locMatch[1].trim().toLowerCase())) score += 20;
      }
      return { ...c, matchScore: score };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
}
