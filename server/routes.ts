import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertResumeSchema, resumeDataSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { generateResumeFromPrompt, parseResumeText, enhanceResumeContent, type GenerateResumeRequest } from "./ai";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // AI Resume Generation Routes
  
  // Generate resume from prompt
  app.post("/api/ai/generate-resume", async (req, res) => {
    try {
      const request: GenerateResumeRequest = req.body;
      const resumeData = await generateResumeFromPrompt(request);
      res.json(resumeData);
    } catch (error) {
      console.error('Error generating resume:', error);
      res.status(500).json({ 
        message: "Failed to generate resume. Please check your API key and try again." 
      });
    }
  });

  // Upload and parse resume file
  app.post("/api/ai/parse-resume", upload.single('resume'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      let resumeText = '';

      if (req.file.mimetype === 'application/pdf') {
        // Import pdf-parse dynamically to avoid the test file issue
        const pdf = await import('pdf-parse');
        const pdfData = await pdf.default(req.file.buffer);
        resumeText = pdfData.text;
      } else if (req.file.mimetype === 'text/plain') {
        resumeText = req.file.buffer.toString('utf-8');
      } else {
        return res.status(400).json({ 
          message: "Unsupported file type. Please upload a PDF or TXT file." 
        });
      }

      const resumeData = await parseResumeText(resumeText);
      res.json(resumeData);
    } catch (error) {
      console.error('Error parsing resume:', error);
      res.status(500).json({ 
        message: "Failed to parse resume. Please check your API key and try again." 
      });
    }
  });

  // Enhance existing resume content
  app.post("/api/ai/enhance-resume", async (req, res) => {
    try {
      const { resumeData, targetRole } = req.body;
      
      if (!resumeData) {
        return res.status(400).json({ message: "Resume data is required" });
      }

      const enhancedData = await enhanceResumeContent(resumeData, targetRole);
      res.json(enhancedData);
    } catch (error) {
      console.error('Error enhancing resume:', error);
      res.status(500).json({ 
        message: "Failed to enhance resume. Please check your API key and try again." 
      });
    }
  });

  // Resume CRUD routes
  
  // Get all resumes (for demo purposes, in production this would be user-specific)
  app.get("/api/resumes", async (req, res) => {
    try {
      // For demo, return all resumes. In production, filter by user ID
      const resumes = await storage.getResumesByUserId("demo-user");
      res.json(resumes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resumes" });
    }
  });

  // Get a specific resume
  app.get("/api/resumes/:id", async (req, res) => {
    try {
      const resume = await storage.getResume(req.params.id);
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      res.json(resume);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resume" });
    }
  });

  // Create a new resume
  app.post("/api/resumes", async (req, res) => {
    try {
      const validatedData = insertResumeSchema.parse({
        ...req.body,
        userId: "demo-user", // In production, get from authenticated user
      });

      const resume = await storage.createResume(validatedData);
      res.status(201).json(resume);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create resume" });
    }
  });

  // Update a resume
  app.put("/api/resumes/:id", async (req, res) => {
    try {
      const validatedData = insertResumeSchema.partial().parse(req.body);
      const resume = await storage.updateResume(req.params.id, validatedData);
      
      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
      
      res.json(resume);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update resume" });
    }
  });

  // Delete a resume
  app.delete("/api/resumes/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteResume(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Resume not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete resume" });
    }
  });

  // Validate resume data endpoint
  app.post("/api/resumes/validate", async (req, res) => {
    try {
      const validatedData = resumeDataSchema.parse(req.body);
      res.json({ valid: true, data: validatedData });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          valid: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Validation failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
