import { type User, type InsertUser, type Resume, type InsertResume } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getResume(id: string): Promise<Resume | undefined>;
  getResumesByUserId(userId: string): Promise<Resume[]>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: string, resume: Partial<InsertResume>): Promise<Resume | undefined>;
  deleteResume(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private resumes: Map<string, Resume>;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getResume(id: string): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async getResumesByUserId(userId: string): Promise<Resume[]> {
    return Array.from(this.resumes.values()).filter(
      (resume) => resume.userId === userId,
    );
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = randomUUID();
    const now = new Date();
    const resume: Resume = {
      id,
      userId: insertResume.userId,
      title: insertResume.title || "My Resume",
      template: insertResume.template || "minimalist",
      data: insertResume.data as any, // Type assertion for JSON field
      createdAt: now,
      updatedAt: now,
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async updateResume(id: string, updateData: Partial<InsertResume>): Promise<Resume | undefined> {
    const existing = this.resumes.get(id);
    if (!existing) return undefined;

    const updated: Resume = {
      ...existing,
      ...updateData,
      data: updateData.data as any || existing.data, // Type assertion for JSON field
      updatedAt: new Date(),
    };
    this.resumes.set(id, updated);
    return updated;
  }

  async deleteResume(id: string): Promise<boolean> {
    return this.resumes.delete(id);
  }
}

export const storage = new MemStorage();
