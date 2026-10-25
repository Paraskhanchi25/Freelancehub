# ⚡ FreelanceHub

> A clean, modern freelance marketplace connecting ambitious clients with verified talent across web development, design, and digital services.

---

## 🌟 Overview

**FreelanceHub** is a responsive, feature-rich web platform designed to streamline hiring and freelancing. Whether clients are posting projects or freelancers are pitching their skills, FreelanceHub provides an end-to-end interactive experience powered by React 19, Vite, and a modular JSON-based REST API.

---

## 🚀 Key Features

### 👤 Role-Based Portals & Accounts
- **Client Account**: Post new projects with custom budgets, filter applicant proposals, shortlist candidates, hire freelancers, and toggle job listings.
- **Freelancer Account**: Search and filter opportunities, submit custom proposals (bid amount, estimated delivery, cover letter), track active contracts, and calculate net earnings.
- **Platform Administrator**: Monitor platform-wide metrics, oversee registered users (active/suspended states), review all jobs, and manage proposals.

### 💼 Work & Talent Discovery
- **Find Work**: Real-time project search by title or keyword, status filters (Active vs. Closed), category filtering, and budget sorting.
- **Find Talent**: Discover top freelancers with search, availability toggles, hourly rate sorting, skill chips, and performance metrics.
- **Smart Recommendations**: Interactive algorithm that recommends talent based on matched keywords, rating, experience, and availability.

### 🤖 AI Project Architect & Blueprint Studio (Gemini 3.8 Flash)
- **Idea to Architecture**: Enter any software idea or choose an existing marketplace job to instantly synthesize enterprise-grade system design.
- **End-to-End Visual Flows**: Generates user interaction steps, event data flows, multi-tier topology, and network protocol mappings.
- **Production Directory Tree**: Generates clean repository file hierarchies with component responsibilities.
- **Relational Database Schemas**: Formulates entity tables with field names, data types, primary/foreign keys, and constraints.
- **API Contracts & Milestones**: Documents REST/GraphQL endpoints and sprint-by-sprint delivery roadmaps.
- **Downloadable & Viewable Executive PDF**: 1-click export to publication-quality, multi-page branded PDF blueprints using `jsPDF`.
- **Integrated Buttons across Platform**: Direct 1-click blueprint generation from Navbar (`✨ AI Architect`), `JobDetails`, `JobCard`, `ClientDashboard`, and `PostJob`.
- **Google GenAI SDK Integration**: Uses `@google/genai` with `gemini-3.8-flash` and structured schema parsing. Configurable via `.env` (`VITE_GEMINI_API_KEY`).

### 🧮 Interactive Tools
- **Rate Calculator**: Real-time hourly rate and earnings calculator taking into account platform fees, weekly hours, and estimated tax.
- **Profile Onboarding & Editor**: Complete personal profile with photo compression, hourly rate, skills, and portfolio bio.

---

## 📁 Project Architecture & Clean Structure

```text
Freelancehub/
├── data/                      # Root JSON database (synced automatically)
│   ├── freelancers.json       # Seed talent profiles
│   ├── jobs.json              # Active and closed job postings
│   ├── proposals.json         # Freelancer proposals & contracts
│   └── users.json             # Registered users & credentials
│
├── public/                    # Static assets served at root
│   ├── assets/                # Avatar photos, logos, and illustrations
│   └── favicon.svg            # Platform favicon
│
├── src/
│   ├── assets/                # Bundled graphics
│   ├── components/
│   │   ├── common/            # Shared components (Navbar, Footer, Hero, HowItWorks...)
│   │   ├── jobs/              # Job-specific components (JobCard)
│   │   └── talent/            # Talent components (FreelancerCard, RecommendedProfessionals...)
│   ├── context/               # Authentication & session state (AuthContext, useAuth)
│   ├── data/                  # In-app fallback JSON datasets
│   ├── pages/
│   │   ├── auth/              # Login, Signup, CompleteProfile
│   │   ├── dashboard/         # ClientDashboard, FreelancerDashboard, AdminDashboard
│   │   ├── jobs/              # FindWork, JobDetails, PostJob, EditJob
│   │   ├── static/            # Home, AboutUs, HelpCenter, HourlyCalculator
│   │   └── talent/            # FindTalent, Profile
│   ├── services/              # API and storage services (auth, jobs, proposals, talent)
│   ├── App.jsx                # Main route configuration
│   ├── index.css              # Global design system & tokens (Plus Jakarta Sans)
│   └── main.jsx               # Application entry point
│
├── server.js                  # Standalone Node.js REST API server (Port 5000)
├── vite.config.js             # Vite development configuration with integrated CRUD API
└── package.json               # Dependencies and build scripts
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js** v18+ (tested with v24)
- **npm** v9+

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Running in Development
Start the Vite development server (includes the embedded mock JSON API):
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Running the Standalone API Server (Optional)
If running an external client or backend test:
```bash
npm run server
```
Runs at [http://localhost:5000](http://localhost:5000).

### 5. Production Build & Linting
```bash
# Check code style and rules with Oxlint
npm run lint

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🔑 Quick Demo Accounts

You can log in instantly using the one-click demo pills on the [Login page](/login) or use these credentials:

| Role | Email | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Client** | `himakshi@example.com` | `password123` | Post jobs, review proposals, hire freelancers |
| **Freelancer** | `paras@example.com` | `password123` | Browse jobs, submit proposals, track earnings |
| **Admin** | `admin@devlance.com` | `password123` | Moderate platform, manage users, view all metrics |

---

## 🎨 Design System & Accessibility

- **Font Family**: Plus Jakarta Sans (loaded via Google Fonts)
- **Theme Colors**: Vibrant primary orange (`#ff6b00`), deep slate neutrals (`#0f172a`), semantic feedback (`#10b981`, `#ef4444`)
- **Responsive**: Fully optimized for mobile, tablet, and desktop screens with flexible grid layouts and mobile drawer navigation.

---

## 📜 License
Built with passion by students at Chitkara University. Distributed for educational and portfolio demonstration purposes.
