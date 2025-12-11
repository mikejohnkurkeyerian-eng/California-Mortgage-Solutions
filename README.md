# Broker Console

A Next.js web application for brokers and loan officers to manage loan applications, review documents, and approve submissions.

## Features

- **Pipeline Dashboard**: View all loans organized by stage (Draft, Submitted, PreUnderwriting, Underwriting, Conditional, ClearToClose, Closed)
- **Loan Detail View**: Comprehensive loan information including borrower details, property information, documents, and conditions
- **Document Management**: View and track document status for each loan
- **Condition Tracking**: Monitor and manage underwriting conditions

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Query**: Data fetching and caching
- **Shared Types**: Reuses `@loan-platform/shared-types` from the monorepo

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm installed globally: `npm install -g pnpm`

### Installation

From the repository root:

```bash
pnpm install
```

This will install dependencies for all packages including the broker console.

### Development

Run the broker console in development mode:

```bash
cd web/broker-console
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env.local` file in `web/broker-console/`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### Build

Build the application for production:

```bash
pnpm build
```

### Production

Start the production server:

```bash
pnpm start
```

## Project Structure

```
web/broker-console/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── dashboard/    # Pipeline dashboard
│   │   ├── loans/        # Loan detail pages
│   │   └── layout.tsx    # Root layout
│   └── components/       # React components
│       ├── PipelineDashboard.tsx
│       ├── LoanCard.tsx
│       ├── LoanDetailView.tsx
│       └── ...
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## API Integration

The broker console integrates with the backend services via REST APIs:

- `GET /api/loans` - Fetch all loans
- `GET /api/loans/:id` - Fetch a specific loan

These endpoints are provided by the `loan-service` in the monorepo.

## Future Enhancements

- Authentication and authorization
- Task management for loan officers
- Approval workflows
- Reporting and analytics
- Real-time notifications
- Document preview and download
- Bulk operations

