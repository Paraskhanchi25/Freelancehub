import { GoogleGenAI } from "@google/genai";

const STORAGE_KEY = "freelancehub_gemini_api_key";

/**
 * Service to generate comprehensive software system architectures,
 * user/data flows, directory structures, database schemas, and blueprints
 * using Google's Gemini 3.8 Flash model via the @google/genai SDK.
 */
export const aiBlueprintService = {
  /**
   * Retrieves the active Gemini API key from environment variables or localStorage.
   */
  getApiKey() {
    // 1. Check Vite environment variable from .env or Node process.env
    let envKey = "";
    try {
      if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
        envKey = import.meta.env.VITE_GEMINI_API_KEY;
      }
    } catch {
      // ignore
    }

    if (!envKey) {
      try {
        if (typeof process !== "undefined" && process.env) {
          envKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
        }
      } catch {
        // ignore
      }
    }

    if (envKey && typeof envKey === "string" && envKey.trim() && !envKey.includes("YOUR_GEMINI_API_KEY")) {
      return envKey.trim();
    }

    // 2. Check localStorage (for user entering key directly in browser UI)
    try {
      if (typeof localStorage !== "undefined") {
        const localKey = localStorage.getItem(STORAGE_KEY);
        if (localKey && typeof localKey === "string" && localKey.trim()) {
          return localKey.trim();
        }
      }
    } catch {
      // LocalStorage might be disabled or restricted
    }

    return "";
  },

  /**
   * Returns where the active API key is sourced from.
   */
  getKeySource() {
    let envKey = "";
    try {
      if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
        envKey = import.meta.env.VITE_GEMINI_API_KEY;
      }
    } catch {
      // ignore
    }

    if (!envKey) {
      try {
        if (typeof process !== "undefined" && process.env) {
          envKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
        }
      } catch {
        // ignore
      }
    }

    if (envKey && typeof envKey === "string" && envKey.trim() && !envKey.includes("YOUR_GEMINI_API_KEY")) {
      return "env";
    }

    try {
      if (typeof localStorage !== "undefined") {
        const localKey = localStorage.getItem(STORAGE_KEY);
        if (localKey && typeof localKey === "string" && localKey.trim()) {
          return "local";
        }
      }
    } catch {
      // ignore
    }
    return "none";
  },

  /**
   * Checks if an API key is configured.
   */
  hasApiKey() {
    return Boolean(this.getApiKey());
  },

  /**
   * Saves a user-provided API key to localStorage.
   */
  saveCustomApiKey(key) {
    if (!key) return;
    try {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } catch (e) {
      console.warn("Failed to save API key to localStorage:", e);
    }
  },

  /**
   * Clears the user-provided API key from localStorage.
   */
  clearCustomApiKey() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to remove API key from localStorage:", e);
    }
  },

  /**
   * Tests an API key by making a lightweight test call.
   */
  async testApiKey(keyToTest) {
    const key = keyToTest || this.getApiKey();
    if (!key) {
      throw new Error("No API key provided to test.");
    }

    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: "Respond with the single word: OK",
      });
      return response && response.text;
    } catch (err) {
      console.error("Gemini API key verification error:", err);
      throw new Error(err.message || "Invalid Gemini API key or network failure.");
    }
  },

  /**
   * Core generator: Calls Gemini 3.8 Flash with structured schema instructions.
   */
  async generateBlueprint(params) {
    const {
      title = "New Software Platform",
      category = "Web Development",
      description = "",
      skills = [],
      budget = "",
      platform = "Full-Stack Web & Mobile",
      architectureStyle = "Modular Microservices / Cloud-Native",
    } = params;

    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `
You are an Elite Principal Software Architect and Technical Director.
A client has submitted the following project proposal / idea on FreelanceHub:

---
PROJECT TITLE: ${title}
CATEGORY: ${category}
PROJECT REQUIREMENTS & IDEA:
${description || title}

TARGET PLATFORM: ${platform}
PREFERRED ARCHITECTURE STYLE: ${architectureStyle}
RELEVANT SKILLS / STACK MENTIONED: ${Array.isArray(skills) ? skills.join(", ") : skills || "Modern Stack"}
BUDGET CONTEXT: ${budget ? `₹${budget}` : "Not specified"}
---

Generate an exhaustive, enterprise-grade Technical Blueprint & System Architecture in STRICT JSON format.
The JSON MUST follow this exact schema without any markdown commentary outside the JSON block:

{
  "title": "${title}",
  "tagline": "A punchy 1-sentence value proposition and architectural summary",
  "category": "${category}",
  "estimatedDuration": "Estimated weeks (e.g. '5-7 Weeks')",
  "summary": "Detailed 2-3 paragraph executive summary of the system, business logic, and architectural philosophy.",
  "problemStatement": "Clear explanation of the core technical or business challenges this project solves.",
  "solution": "High-level summary of the engineered solution, key workflows, and strategic advantages.",
  "techStack": {
    "frontend": ["Framework / Libs with versions, e.g. React 19, TypeScript, Tailwind CSS"],
    "backend": ["Runtime / Framework, e.g. Node.js 22, Express / Fastify / NestJS"],
    "database": ["Primary DB, Cache, and Object Storage, e.g. PostgreSQL, Redis, Cloud Storage"],
    "devops": ["Hosting, CI/CD, Containerization, e.g. Docker, GitHub Actions, AWS / GCP"],
    "apis": ["Key integrations, e.g. Stripe / Razorpay, Auth0 / Firebase Auth, SendGrid, WebSockets"]
  },
  "systemArchitecture": {
    "summary": "Multi-tier architecture breakdown explaining how traffic flows from CDN to database.",
    "pattern": "${architectureStyle}",
    "tiers": [
      {
        "name": "Client & Presentation Tier",
        "technologies": ["React / Next.js / Mobile SPA"],
        "responsibilities": "Responsive UI rendering, state management, client-side caching, and auth session handling."
      },
      {
        "name": "API Gateway & Edge Tier",
        "technologies": ["Cloudflare / NGINX / Express Gateway"],
        "responsibilities": "Rate limiting, SSL termination, CORS validation, JWT verification, and route proxying."
      },
      {
        "name": "Core Application & Domain Tier",
        "technologies": ["Node.js / Express REST API & WebSocket Engine"],
        "responsibilities": "Business rules, transaction management, payment settlement, notification dispatch, and RBAC."
      },
      {
        "name": "Persistence & Caching Tier",
        "technologies": ["PostgreSQL + Redis Cache + Object Storage"],
        "responsibilities": "Relational data persistence, ACID transactions, sub-millisecond session caching, and secure file storage."
      }
    ],
    "diagramSummary": "ASCII or textual representation of the flow (e.g. [User/Client] -> (Cloudflare/CDN) -> [API Gateway] -> [Microservices] -> [PostgreSQL + Redis])"
  },
  "userFlow": [
    {
      "stepNumber": 1,
      "stepName": "Onboarding & Authentication",
      "actor": "End User",
      "action": "Registers via OAuth or email/password and completes role verification.",
      "systemResponse": "Issues signed JWT, initializes user record in DB, and loads customized dashboard."
    },
    {
      "stepNumber": 2,
      "stepName": "Core Workflow Execution",
      "actor": "End User",
      "action": "Creates primary entity / searches services / interacts with main feature.",
      "systemResponse": "Validates request, writes event log, persists payload, and broadcasts live update via WebSockets."
    },
    {
      "stepNumber": 3,
      "stepName": "Payment / Settlement / Handover",
      "actor": "User / System",
      "action": "Triggers transaction or formal task approval.",
      "systemResponse": "Processes payment webhook, updates escrow balance, and dispatches invoice & notifications."
    }
  ],
  "dataFlow": [
    {
      "step": 1,
      "from": "Client Application",
      "to": "API Gateway",
      "protocol": "HTTPS / WSS",
      "description": "Authenticated requests with Bearer tokens and request payloads."
    },
    {
      "step": 2,
      "from": "API Gateway",
      "to": "Backend Controllers",
      "protocol": "Internal RPC / HTTP",
      "description": "Validated requests routed to domain services."
    },
    {
      "step": 3,
      "from": "Backend Services",
      "to": "PostgreSQL / Redis",
      "protocol": "TCP / Connection Pool",
      "description": "ACID transactional updates and cache invalidation."
    }
  ],
  "directoryStructure": [
    { "path": "src/", "type": "dir", "description": "Application root source directory" },
    { "path": "src/components/", "type": "dir", "description": "Reusable UI components and design system elements" },
    { "path": "src/pages/", "type": "dir", "description": "Route-level page views and layouts" },
    { "path": "src/services/", "type": "dir", "description": "HTTP client, API services, and Gemini AI integrations" },
    { "path": "src/context/", "type": "dir", "description": "Global state management and authentication context" },
    { "path": "server/controllers/", "type": "dir", "description": "API route handlers and request validation" },
    { "path": "server/models/", "type": "dir", "description": "ORM schemas and database entity models" },
    { "path": "server/routes/", "type": "dir", "description": "Express REST API route definitions" },
    { "path": "server/middleware/", "type": "dir", "description": "Auth, rate limiting, and error handling middleware" },
    { "path": ".env", "type": "file", "description": "Environment variables and API keys configuration" }
  ],
  "databaseSchema": [
    {
      "tableName": "users",
      "description": "System accounts, auth profiles, and role identities",
      "columns": [
        { "name": "id", "type": "UUID / VARCHAR", "constraints": "PRIMARY KEY", "description": "Unique identifier" },
        { "name": "email", "type": "VARCHAR(255)", "constraints": "UNIQUE, NOT NULL", "description": "Login email address" },
        { "name": "role", "type": "VARCHAR(50)", "constraints": "NOT NULL", "description": "User role: client, freelancer, admin" },
        { "name": "created_at", "type": "TIMESTAMP", "constraints": "DEFAULT NOW()", "description": "Registration timestamp" }
      ]
    },
    {
      "tableName": "projects",
      "description": "Core project or order entities with specifications and budgets",
      "columns": [
        { "name": "id", "type": "UUID / VARCHAR", "constraints": "PRIMARY KEY", "description": "Unique project identifier" },
        { "name": "user_id", "type": "UUID", "constraints": "FOREIGN KEY -> users.id", "description": "Creator / Client reference" },
        { "name": "title", "type": "VARCHAR(255)", "constraints": "NOT NULL", "description": "Project title" },
        { "name": "status", "type": "VARCHAR(50)", "constraints": "DEFAULT 'active'", "description": "Lifecycle state" },
        { "name": "budget", "type": "DECIMAL(12,2)", "constraints": "CHECK (budget >= 0)", "description": "Allocated budget" }
      ]
    }
  ],
  "apiEndpoints": [
    {
      "method": "POST",
      "path": "/api/v1/auth/login",
      "description": "Authenticates user credentials and returns signed JWT access token.",
      "requestBody": "{ email, password }",
      "response": "{ token, user: { id, name, role } }"
    },
    {
      "method": "GET",
      "path": "/api/v1/projects",
      "description": "Fetches paginated list of projects with filtering by category and status.",
      "requestBody": "None (Query params: search, category, page)",
      "response": "{ data: [...], pagination: { page, total } }"
    },
    {
      "method": "POST",
      "path": "/api/v1/projects",
      "description": "Creates a new project posting and notifies relevant talent.",
      "requestBody": "{ title, description, category, budget, skills }",
      "response": "{ success: true, project: { id, ... } }"
    }
  ],
  "milestones": [
    {
      "phase": "Sprint 1",
      "title": "Foundation, Infrastructure & Auth",
      "timeline": "Week 1-2",
      "deliverables": ["Database migrations & schema setup", "Authentication & JWT flow", "Core API routing & base UI layout"]
    },
    {
      "phase": "Sprint 2",
      "title": "Core Feature Development & Workflows",
      "timeline": "Week 3-4",
      "deliverables": ["Main business entity CRUD", "Search & filtering system", "Payment / notification integration"]
    },
    {
      "phase": "Sprint 3",
      "title": "Optimization, QA & Handover",
      "timeline": "Week 5-6",
      "deliverables": ["End-to-end integration tests", "Security audit & rate limiting", "Production deployment & documentation"]
    }
  ],
  "teamRecommendations": [
    {
      "role": "Lead Full-Stack Engineer",
      "count": 1,
      "skills": ["React 19", "Node.js", "PostgreSQL", "System Architecture"],
      "responsibilities": "Owns end-to-end architecture, API contracts, database schema, and deployment pipeline.",
      "estimatedHours": "120 Hours"
    },
    {
      "role": "UI/UX & Frontend Specialist",
      "count": 1,
      "skills": ["React", "CSS3 / Modern UI", "Responsive Design", "Accessibility"],
      "responsibilities": "Delivers interactive user experience, responsive components, and fluid animations.",
      "estimatedHours": "70 Hours"
    }
  ]
}

Return ONLY the raw JSON object. Do not wrap in markdown or backticks if possible, or use standard \`\`\`json \`\`\`.
`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        const rawText = response.text || "";
        const cleaned = rawText
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        const parsed = JSON.parse(cleaned);
        parsed.isLiveGemini = true;
        parsed.engine = "Google Gemini 3.8 Flash";
        parsed.generatedAt = new Date().toISOString();
        return parsed;
      } catch (err) {
        console.warn("Live Gemini generation failed, falling back to contextual generator:", err);
        // Fall through to fallback generator
      }
    }

    // Contextual intelligent fallback generator
    return this.createFallbackBlueprint(params);
  },

  /**
   * Helper to generate a blueprint directly from a FreelanceHub job object.
   */
  async generateBlueprintFromJob(job) {
    if (!job) {
      throw new Error("Job details are required to generate an architecture blueprint.");
    }
    return this.generateBlueprint({
      title: job.title || "Untitled Project",
      category: job.category || "Web Development",
      description: job.description || "",
      skills: job.skills || [],
      budget: job.budget || "",
      platform: "Full-Stack Web Application",
      architectureStyle: "Component-Driven Modern Architecture",
    });
  },

  /**
   * Provides a robust, highly detailed contextual blueprint when API key
   * is absent or during quota/network interruptions.
   */
  createFallbackBlueprint(params) {
    const {
      title = "Modern Full-Stack Solution",
      category = "Web Development",
      description = "Comprehensive scalable platform built with best architectural practices.",
      skills = ["React", "Node.js", "PostgreSQL"],
      budget = "50,000",
    } = params;

    const skillsList = Array.isArray(skills)
      ? skills
      : String(skills).split(",").map((s) => s.trim()).filter(Boolean);

    const safeTitle = title.trim();
    const primaryTech = skillsList[0] || "React 19";
    const backendTech = skillsList.find((s) => /node|express|python|django|fastapi|java|spring/i.test(s)) || "Node.js & Express";
    const dbTech = skillsList.find((s) => /sql|postgres|mongo|mysql|database/i.test(s)) || "PostgreSQL & Redis";

    return {
      title: safeTitle,
      tagline: `Enterprise ${category} Platform with High-Availability Architecture`,
      category: category,
      estimatedDuration: "4-6 Weeks",
      estimatedBudget: budget ? `₹${budget}` : "₹50,000",
      isFallback: true,
      engine: "FreelanceHub System Architect (Demo Mode)",
      generatedAt: new Date().toISOString(),
      summary: description
        ? `The "${safeTitle}" platform is engineered as a cloud-native, high-throughput solution tailored for ${category}. Requirements Context: "${description}". Designed around domain-driven principles, it decouples presentation from core services to ensure 99.9% uptime, sub-200ms API response latencies, and rapid feature iteration.`
        : `The "${safeTitle}" platform is engineered as a cloud-native, high-throughput solution tailored for ${category}. Designed around domain-driven principles, it decouples presentation from core services to ensure 99.9% uptime, sub-200ms API response latencies, and rapid feature iteration.`,
      problemStatement: `Modern ${category} workloads often suffer from monolithic coupling, slow query response times, and difficult deployment pipelines. This project addresses the challenge of building a reliable, scalable system that delivers seamless user experiences while maintaining rigorous data consistency and security.`,
      solution: `A layered, multi-tier architecture powered by ${primaryTech} on the presentation layer and ${backendTech} on the services layer. It features unified API routing, JWT role-based security, automated caching via ${dbTech}, and continuous integration for zero-downtime deployments.`,
      techStack: {
        frontend: [primaryTech, "TypeScript", "Vite", "Tailwind CSS / Modern CSS", "React Query"],
        backend: [backendTech, "REST & WebSockets", "Zod Validation", "JWT & Bcrypt"],
        database: [dbTech, "Prisma / TypeORM", "S3 / Cloud Storage for Assets"],
        devops: ["Docker", "GitHub Actions CI/CD", "Vercel / Cloud Run", "Prometheus & Winston Logs"],
        apis: ["Stripe / Payment Gateway", "SendGrid Email API", "Real-Time Push Notifications"],
      },
      systemArchitecture: {
        pattern: "Modular Decoupled Tier Architecture",
        summary: "The architecture separates concerns into a reactive client presentation tier, an authenticated gateway, specialized domain service controllers, and an ACID relational persistence tier with memory caching.",
        tiers: [
          {
            name: "Client Presentation Tier",
            technologies: [primaryTech, "Responsive UI"],
            responsibilities: "Handles UI state, client-side route caching, accessible form validations, and asynchronous request orchestration.",
          },
          {
            name: "Edge & API Gateway",
            technologies: ["Reverse Proxy / Rate Limiter"],
            responsibilities: "SSL termination, CORS policy enforcement, token validation, and distributed rate limiting.",
          },
          {
            name: "Business Logic & Service Layer",
            technologies: [backendTech],
            responsibilities: "Encapsulates domain logic, payment processing, transaction orchestration, and background worker queues.",
          },
          {
            name: "Data Persistence & Storage",
            technologies: [dbTech],
            responsibilities: "Provides reliable transactional consistency, optimized index lookup, and encrypted binary storage.",
          },
        ],
        diagramSummary: "[Client Apps (Web/Mobile)] ---> [Cloud CDN / Edge] ---> [API Gateway (Auth & Rate Limit)] ---> [Domain Services] ---> [DB & Redis Cache]",
      },
      userFlow: [
        {
          stepNumber: 1,
          stepName: "Discovery & User Authentication",
          actor: "Customer / Client",
          action: `Visits ${safeTitle}, reviews project listings, and signs in securely.`,
          systemResponse: "Validates credentials, delivers encrypted session token, and hydrates tailored dashboard.",
        },
        {
          stepNumber: 2,
          stepName: "Project Initiation & Specification",
          actor: "User",
          action: "Submits detailed requirements, selects parameters, and attaches assets.",
          systemResponse: "Performs schema validation, saves project draft, and triggers matching recommendations.",
        },
        {
          stepNumber: 3,
          stepName: "Execution & Collaboration",
          actor: "Collaborator / Freelancer",
          action: "Submits deliverables, communicates via chat, and updates milestone status.",
          systemResponse: "Broadcasts real-time events, stores artifacts, and maintains audit trail.",
        },
        {
          stepNumber: 4,
          stepName: "Review & Completion",
          actor: "Client & System",
          action: "Approves completed milestones and initiates payout settlement.",
          systemResponse: "Releases escrow balance, issues completion certificates, and solicits ratings.",
        },
      ],
      dataFlow: [
        {
          step: 1,
          from: "User Browser / Device",
          to: "API Gateway",
          protocol: "HTTPS / TLS 1.3",
          description: "Encrypted payload with authentication headers and CSRF tokens.",
        },
        {
          step: 2,
          from: "API Gateway",
          to: "Application Controllers",
          protocol: "Internal HTTP/JSON",
          description: "Sanitized request routed to corresponding micro-handler.",
        },
        {
          step: 3,
          from: "Application Controllers",
          to: "Database Cluster",
          protocol: "Connection Pool / TCP",
          description: "Read/Write queries with parameterized inputs preventing SQL injection.",
        },
      ],
      directoryStructure: [
        { path: "src/", type: "dir", description: "Frontend application root source" },
        { path: "src/components/common/", type: "dir", description: "Global UI building blocks (Navbar, Modal, Buttons)" },
        { path: "src/pages/", type: "dir", description: "Route-level views and user experiences" },
        { path: "src/services/", type: "dir", description: "API clients, data abstraction layer, and Gemini AI services" },
        { path: "src/context/", type: "dir", description: "State providers for Auth, Notifications, and Settings" },
        { path: "server/controllers/", type: "dir", description: "REST endpoint controllers and request validation" },
        { path: "server/models/", type: "dir", description: "Data schemas, migrations, and relationship definitions" },
        { path: "server/middleware/", type: "dir", description: "Authentication, error boundary, and rate limiters" },
        { path: "tests/", type: "dir", description: "Unit, integration, and E2E automation test suites" },
        { path: ".env", type: "file", description: "Environment secrets, database credentials, and Gemini API key" },
      ],
      databaseSchema: [
        {
          tableName: "users",
          description: "Core account information and authentication credentials",
          columns: [
            { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Unique user identifier" },
            { name: "email", type: "VARCHAR(255)", constraints: "UNIQUE, NOT NULL", description: "Registered email address" },
            { name: "name", type: "VARCHAR(150)", constraints: "NOT NULL", description: "Full user name" },
            { name: "role", type: "VARCHAR(50)", constraints: "DEFAULT 'user'", description: "Access control role" },
            { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT NOW()", description: "Account creation date" },
          ],
        },
        {
          tableName: "projects",
          description: "Entities representing posted jobs, briefs, and deliverables",
          columns: [
            { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Unique project ID" },
            { name: "client_id", type: "UUID", constraints: "FOREIGN KEY -> users.id", description: "Owner reference" },
            { name: "title", type: "VARCHAR(255)", constraints: "NOT NULL", description: "Project title" },
            { name: "budget", type: "DECIMAL(12,2)", constraints: "NOT NULL", description: "Allocated budget" },
            { name: "status", type: "VARCHAR(50)", constraints: "DEFAULT 'Active'", description: "Current lifecycle state" },
            { name: "updated_at", type: "TIMESTAMP", constraints: "DEFAULT NOW()", description: "Last modification time" },
          ],
        },
        {
          tableName: "proposals",
          description: "Bids, contract proposals, and negotiations submitted by talent",
          columns: [
            { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Unique proposal ID" },
            { name: "project_id", type: "UUID", constraints: "FOREIGN KEY -> projects.id", description: "Target project" },
            { name: "freelancer_id", type: "UUID", constraints: "FOREIGN KEY -> users.id", description: "Applicant reference" },
            { name: "bid_amount", type: "DECIMAL(12,2)", constraints: "NOT NULL", description: "Proposed bid rate" },
            { name: "status", type: "VARCHAR(50)", constraints: "DEFAULT 'Under Review'", description: "Review / Awarded status" },
          ],
        },
      ],
      apiEndpoints: [
        {
          method: "POST",
          path: "/api/v1/auth/session",
          description: "Authenticates credentials and establishes session token.",
          requestBody: "{ email: string, password: string }",
          response: "{ token: string, user: UserProfile }",
        },
        {
          method: "GET",
          path: "/api/v1/projects",
          description: "Returns filtered list of active project postings.",
          requestBody: "Query: { category, search, page }",
          response: "{ projects: Project[], total: number }",
        },
        {
          method: "POST",
          path: "/api/v1/projects",
          description: "Publishes a new project brief to the marketplace.",
          requestBody: "{ title, category, description, budget, skills }",
          response: "{ success: true, project: Project }",
        },
        {
          method: "POST",
          path: "/api/v1/proposals",
          description: "Submits a competitive bid with milestone schedule.",
          requestBody: "{ projectId, bidAmount, estimatedDays, coverLetter }",
          response: "{ success: true, proposalId: string }",
        },
      ],
      milestones: [
        {
          phase: "Sprint 1",
          title: "System Architecture, Database Setup & Core Auth",
          timeline: "Weeks 1 - 2",
          deliverables: [
            "Database schema migrations & connection pooling",
            "Authentication endpoints and session state verification",
            "Project layout scaffolding and design tokens",
          ],
        },
        {
          phase: "Sprint 2",
          title: "Core Business Logic & Entity Workflows",
          timeline: "Weeks 3 - 4",
          deliverables: [
            "Project creation, browsing, and detail views",
            "Proposal submission & status transition pipeline",
            "Interactive client and freelancer dashboard analytics",
          ],
        },
        {
          phase: "Sprint 3",
          title: "Hardening, Security, QA & Production Handover",
          timeline: "Weeks 5 - 6",
          deliverables: [
            "End-to-end integration and load testing",
            "PDF blueprint export and automated documentation",
            "Deployment pipeline configuration and handover runbooks",
          ],
        },
      ],
      teamRecommendations: [
        {
          role: "Senior Full-Stack Architect",
          count: 1,
          skills: skillsList.slice(0, 3),
          responsibilities: "Leads technical design, oversees database schema, and ensures API security compliance.",
          estimatedHours: "100 - 120 Hours",
        },
        {
          role: "Frontend Engineer / UI Specialist",
          count: 1,
          skills: [primaryTech, "CSS3", "Design Systems"],
          responsibilities: "Builds high-performance interactive interfaces, animated transitions, and accessible workflows.",
          estimatedHours: "60 - 80 Hours",
        },
      ],
    };
  },
};
