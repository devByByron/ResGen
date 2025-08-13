# AI-Powered Resume Builder Application

## Overview

This is a full-stack AI-powered resume builder application that allows users to create, edit, and preview professional resumes. The application features AI-powered resume generation, file upload parsing, content enhancement, and real-time WYSIWYG editing with multiple professional templates. Users can generate resumes from prompts, upload existing resumes for parsing, or manually input their information to create polished, ATS-optimized resumes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React with TypeScript and utilizes a component-based architecture. The application uses Vite as the build tool and development server for fast hot module replacement. The UI is built with shadcn/ui components based on Radix UI primitives, providing accessible and customizable interface elements.

**Key Design Decisions:**
- **React Router Alternative**: Uses Wouter for lightweight client-side routing instead of React Router to reduce bundle size
- **State Management**: Uses React's built-in state management with hooks rather than external state libraries for simplicity
- **Styling**: Implements Tailwind CSS with custom CSS variables for theming, allowing for consistent design system
- **Form Handling**: Uses React Hook Form with Zod validation for type-safe form management

### Backend Architecture
The backend follows a REST API architecture using Express.js with TypeScript. The server implements a layered architecture with clear separation between routes, business logic, data storage, and AI services.

**Key Design Decisions:**
- **AI Integration**: Uses Google's Gemini AI model for resume generation, parsing, and enhancement
- **File Processing**: Supports PDF and TXT file uploads with content extraction
- **Storage Abstraction**: Uses an interface-based storage system that currently implements in-memory storage but can be easily swapped for database storage
- **API Design**: RESTful endpoints following conventional HTTP methods and status codes
- **Error Handling**: Centralized error handling middleware for consistent error responses
- **Development Setup**: Integrated Vite development server with Express for seamless full-stack development

### AI Features
The application integrates Google's Gemini 2.0 Flash model to provide:
- **Resume Generation**: Create complete resumes from basic prompts and preferences
- **File Parsing**: Extract structured data from uploaded PDF and TXT resume files
- **Content Enhancement**: Improve existing resume content with better language and ATS optimization

### Data Storage Solutions
Currently implements an in-memory storage system using TypeScript Maps for rapid prototyping. The storage layer is abstracted through interfaces, making it database-agnostic and easily extensible.

**Database Schema Design:**
- **Users Table**: Stores user authentication information with unique usernames
- **Resumes Table**: Stores resume data as JSON objects with metadata like title, template, and timestamps
- **Data Validation**: Uses Zod schemas for runtime type checking and validation

### Authentication and Authorization
The application currently uses a demo user system for development purposes. The architecture is prepared for full authentication implementation with user sessions and secure password handling.

**Security Considerations:**
- Password hashing ready for implementation
- Session management structure in place
- User-specific data isolation prepared

### Template System
Implements a modular template system with three distinct resume layouts: Minimalist, Modern, and Creative. Each template is a separate React component that renders the same data structure differently.

**Template Features:**
- Consistent data interface across all templates
- Print-optimized styling
- Responsive design for different screen sizes
- Real-time preview with zoom controls

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with modern hooks and concurrent features
- **Express.js**: Backend web framework for Node.js
- **TypeScript**: Type safety across the entire application stack
- **Vite**: Fast build tool and development server

### AI and File Processing
- **@google/generative-ai**: Google Gemini AI SDK for resume generation and enhancement
- **multer**: File upload middleware for handling resume file uploads
- **pdf-parse**: PDF content extraction for parsing uploaded resume files

### UI and Styling Dependencies
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Radix UI**: Headless UI components for accessibility and customization
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Lucide React**: Icon library for consistent iconography

### Database and Validation
- **Drizzle ORM**: Type-safe SQL ORM configured for PostgreSQL
- **Zod**: Runtime type validation and schema definition
- **@neondatabase/serverless**: PostgreSQL database driver for serverless environments

### Form and State Management
- **React Hook Form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Integration between React Hook Form and Zod validation
- **TanStack Query**: Server state management for data fetching and caching

### Development and Build Tools
- **tsx**: TypeScript execution engine for development
- **esbuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing tool for Tailwind CSS
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay for Replit environment