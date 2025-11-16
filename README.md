# Loan Automation Platform

Monorepo for the mortgage automation platform spanning borrower portal, broker console, backend services, and infrastructure-as-code.

## Directory Layout
- `docs/` – requirements, implementation plans, design artifacts.
- `infra/` – Terraform and infrastructure configuration.
- `services/` – backend microservices (auth, loan, document, workflow, rules, integration, notifications).
- `apps/` – React Native desktop/mobile application.
- `libs/` – shared TypeScript libraries (types, UI kit, workflow clients, etc.).
- `tools/` – scripts and automation utilities.

## Getting Started

### Prerequisites
- Node.js 18+ installed
- pnpm installed: `npm install -g pnpm`

### Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start all services:**
   
   **Windows (PowerShell):**
   ```powershell
   .\scripts\start-all.ps1
   ```
   
   **Mac/Linux:**
   ```bash
   chmod +x scripts/start-all.sh
   ./scripts/start-all.sh
   ```
   
   **Or start manually in separate terminals:**
   ```bash
   # Terminal 1: Loan Service
   cd services/loan-service && pnpm start
   
   # Terminal 2: Document Service
   cd services/document-service && pnpm start
   
   # Terminal 3: Workflow Service
   cd services/workflow-service && pnpm start
   
   # Terminal 4: React Native App (optional)
   cd apps/loan-automation-app && pnpm start
   ```

3. **Test the services:**
   ```bash
   # Health checks
   curl http://localhost:4002/health  # Loan Service
   curl http://localhost:4003/health  # Document Service
   curl http://localhost:4004/health  # Workflow Service
   ```

### Documentation
- [Testing Guide](docs/testing-guide.md) - Complete testing instructions
- [Workflow Service](docs/workflow-service-implementation.md) - Workflow automation details
- [Requirements](docs/loan-automation-requirements.md) - Full requirements
- [Implementation Plan](docs/implementation-plan.md) - Development roadmap

## Status
- ✅ Repository foundation complete
- ✅ Core services (loan, document, workflow) implemented
- ✅ React Native app with all screens complete
- ✅ Document checklist feature
- ✅ Rules service for automated underwriting
- ✅ Database integration (PostgreSQL + Prisma)
- ✅ Workflow automation complete
- 📋 Visual Studio setup required for Windows desktop

## Desktop App Setup

For Windows desktop development, you need:
- **Visual Studio 2022** with C++ tools
- See [Visual Studio Setup Guide](docs/visual-studio-setup.md) for download links and instructions


