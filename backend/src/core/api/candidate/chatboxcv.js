import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { CandidateRepository } from 'core/modules/candidate/candidate.repository';

const router = express.Router();

// Lưu file vào thư mục uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ─── Gọi Gemini API để phân tích CV ────────────────────────────────────────
async function parseCVWithGemini(filePath, originalName) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  // Đọc file PDF và encode base64
  const fileBuffer = fs.readFileSync(filePath);
  const base64Data = fileBuffer.toString('base64');

  const prompt = `You are an expert HR assistant. Analyze the following CV/Resume PDF and extract structured information.

Return a JSON object with EXACTLY this structure (no extra text, only valid JSON):
{
  "name": "Full name of candidate",
  "email": "email@example.com",
  "phone": "phone number or empty string",
  "summary": "Professional summary in 2-3 sentences",
  "experiences": "JSON string of experiences array: [{\"company\":\"...\",\"position\":\"...\",\"duration\":\"...\",\"description\":\"...\"}]",
  "education": "JSON string of education array: [{\"school\":\"...\",\"degree\":\"...\",\"year\":\"...\"}]",
  "certifications": "JSON string of certifications array: [\"cert1\",\"cert2\"]",
  "skills": ["skill1", "skill2", "skill3"],
  "score": 70,
  "status": "In-Review"
}

Rules:
- "score" is a number 0-100 estimating candidate quality based on experience and skills
- All string fields must be valid strings
- "experiences", "education", "certifications" must be JSON stringified arrays
- Return ONLY the JSON object, no markdown, no explanation`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: 'application/pdf',
                  data: base64Data,
                },
              },
              { text: prompt },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048,
        },
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Clean JSON từ response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Gemini returned invalid JSON');

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;
  } catch (error) {
    console.error('Gemini parse error:', error.message);
    // Fallback: dùng tên file làm tên candidate
    const nameFallback = originalName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    return {
      name: nameFallback || 'Unknown Candidate',
      email: '',
      phone: '',
      summary: `CV uploaded: ${originalName}`,
      experiences: '[]',
      education: '[]',
      certifications: '[]',
      skills: [],
      score: 50,
      status: 'In-Review',
    };
  }
}

// ─── POST /api/candidates/cv-upload ────────────────────────────────────────
router.post('/cv-upload', upload.single('cv'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      console.error('[ChatboxCV] No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`[ChatboxCV] Processing: ${file.originalname}`);

    // Parse CV bằng Gemini
    let parsed;
    try {
      parsed = await parseCVWithGemini(file.path, file.originalname);
    } catch (geminiErr) {
      console.error('[ChatboxCV] Gemini parse error:', geminiErr);
      return res.status(500).json({ error: 'Gemini API error: ' + geminiErr.message });
    }

    // Chuẩn bị data để lưu vào PostgreSQL
    const candidateData = {
      name: parsed.name || 'Unknown',
      email: parsed.email || '',
      phone: parsed.phone || '',
      summary: parsed.summary || '',
      experiences: typeof parsed.experiences === 'string'
        ? parsed.experiences
        : JSON.stringify(parsed.experiences || []),
      education: typeof parsed.education === 'string'
        ? parsed.education
        : JSON.stringify(parsed.education || []),
      certifications: typeof parsed.certifications === 'string'
        ? parsed.certifications
        : JSON.stringify(parsed.certifications || []),
      resume_file: `/uploads/${file.filename}`,
      score: typeof parsed.score === 'number' ? parsed.score : 50,
      status: 'In-Review',
      job_posting_id: req.body.job_posting_id ? parseInt(req.body.job_posting_id) : null,
      industry_id: req.body.industry_id ? parseInt(req.body.industry_id) : null,
    };

    // Lưu vào PostgreSQL
    let result, savedCandidate;
    try {
      result = await CandidateRepository.createCandidate(candidateData);
      savedCandidate = Array.isArray(result) ? result[0] : result;
    } catch (dbErr) {
      console.error('[ChatboxCV] DB save error:', dbErr);
      return res.status(500).json({ error: 'Database error: ' + dbErr.message });
    }

    console.log(`[ChatboxCV] Saved candidate: ${savedCandidate.name} (id: ${savedCandidate.id})`);

    res.json({
      id: savedCandidate.id,
      name: savedCandidate.name,
      email: savedCandidate.email,
      phone: savedCandidate.phone,
      summary: savedCandidate.summary,
      score: savedCandidate.score,
      status: savedCandidate.status,
      resumeFile: savedCandidate.resumeFile || candidateData.resume_file,
      skills: parsed.skills || [],
      experiences: parsed.experiences,
      education: parsed.education,
    });
  } catch (err) {
    console.error('[ChatboxCV] Upload error:', err);
    res.status(500).json({ error: 'Unknown error: ' + err.message });
  }
});

// ─── GET /api/candidates/cv-file/:filename ──────────────────────────────────
router.get('/cv-file/:filename', (req, res) => {
  const filePath = path.join(process.cwd(), 'uploads', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

export default router;
