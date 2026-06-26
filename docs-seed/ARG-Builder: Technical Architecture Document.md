# ARG-Builder: Technical Architecture Document

## Executive Summary

This document defines the complete system architecture for the ARG-Builder platform — an AI-powered SaaS application that autonomously generates interactive operational reference guides for mid-market companies. The architecture is designed for scalability (supporting 900+ concurrent customers by Year 5), security (SOC 2 Type II compliance), reliability (99.9% uptime SLA), and performance (sub-3-second page loads globally). The system employs a microservices architecture with event-driven communication, leveraging modern cloud-native technologies on AWS.

---

## Architecture Overview

The ARG-Builder platform consists of five primary layers: Client Layer, API Gateway Layer, Application Services Layer, AI/ML Pipeline Layer, and Data Layer. Each layer is independently scalable and communicates through well-defined interfaces.

| Layer | Responsibility | Key Technologies |
|-------|---------------|-----------------|
| Client Layer | User interface, real-time interactions | React 19, TypeScript, Tailwind CSS, WebSockets |
| API Gateway | Authentication, rate limiting, routing | AWS API Gateway, CloudFront, WAF |
| Application Services | Business logic, orchestration | Node.js (Express), Python (FastAPI) |
| AI/ML Pipeline | Content generation, NLP, extraction | OpenAI GPT-4, Claude, custom fine-tuned models |
| Data Layer | Persistence, caching, search | PostgreSQL, Redis, Elasticsearch, S3 |

---

## Client Architecture

### Technology Stack

The client application is a single-page application (SPA) built with React 19 and TypeScript, using Tailwind CSS 4 for styling and Framer Motion for animations. The application supports offline-first capabilities through service workers and provides real-time updates via WebSocket connections.

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | React | 19.x | UI rendering, component architecture |
| Language | TypeScript | 5.6+ | Type safety, developer experience |
| Styling | Tailwind CSS | 4.x | Utility-first styling, design tokens |
| State | Zustand | 5.x | Global state management |
| Data Fetching | TanStack Query | 5.x | Server state, caching, optimistic updates |
| Routing | React Router | 7.x | Client-side navigation |
| Forms | React Hook Form + Zod | Latest | Form handling, validation |
| Real-time | Socket.io Client | 4.x | WebSocket communication |
| Charts | Recharts | 2.x | Data visualization |
| Animation | Framer Motion | 12.x | UI animations, transitions |

### Client Architecture Patterns

The client follows a feature-based module architecture where each major feature (Dashboard, Interview, Builder, Guide, Analytics) is self-contained with its own components, hooks, and state management. Shared utilities, design tokens, and common components live in a central library.

```
client/
├── src/
│   ├── features/
│   │   ├── dashboard/      # Project overview, management
│   │   ├── interview/      # AI interview module
│   │   ├── builder/        # Guide generation & preview
│   │   ├── guide/          # Deployed guide viewer
│   │   └── analytics/      # Usage tracking, ROI
│   ├── shared/
│   │   ├── components/     # Design system components
│   │   ├── hooks/          # Shared custom hooks
│   │   ├── utils/          # Helper functions
│   │   └── types/          # Shared TypeScript types
│   ├── lib/
│   │   ├── api/            # API client, interceptors
│   │   ├── auth/           # Authentication logic
│   │   └── websocket/      # Real-time connection
│   └── app/
│       ├── routes/         # Route definitions
│       ├── layouts/        # Page layouts
│       └── providers/      # Context providers
```

---

## Backend Architecture

### Microservices Overview

The backend is composed of six core microservices, each responsible for a distinct domain. Services communicate asynchronously through an event bus (AWS EventBridge) for loose coupling, with synchronous REST/gRPC calls only where real-time response is required.

| Service | Language | Responsibility | Database |
|---------|----------|---------------|----------|
| Auth Service | Node.js | Authentication, authorization, SSO | PostgreSQL |
| Project Service | Node.js | Project CRUD, collaboration, permissions | PostgreSQL |
| Interview Service | Python | AI interview orchestration, NLP | PostgreSQL + Redis |
| Generator Service | Python | Guide generation, template engine | PostgreSQL + S3 |
| Analytics Service | Node.js | Usage tracking, metrics, reporting | TimescaleDB |
| Notification Service | Node.js | Email, in-app, webhook notifications | Redis + SQS |

### API Design

All external APIs follow RESTful conventions with consistent error handling, pagination, and versioning. Internal service-to-service communication uses gRPC for performance-critical paths and EventBridge for asynchronous workflows.

**API Versioning:** URL-based versioning (`/api/v1/`, `/api/v2/`) with 12-month deprecation windows.

**Authentication:** JWT tokens with 15-minute access token expiry and 7-day refresh tokens. OAuth 2.0 support for enterprise SSO (SAML, OIDC).

**Rate Limiting:** Tiered rate limits based on subscription plan — Starter (100 req/min), Professional (500 req/min), Enterprise (2000 req/min).

---

## AI/ML Pipeline Architecture

### Interview Engine

The Interview Engine is the core AI component that conducts structured stakeholder interviews, extracts operational knowledge, and organizes it into the ARG-Builder content model. It uses a multi-model approach combining large language models for conversation with specialized models for extraction and classification.

| Component | Model | Purpose |
|-----------|-------|---------|
| Conversation Engine | GPT-4 / Claude 3.5 | Natural language interview, follow-up questions |
| Entity Extraction | Custom fine-tuned BERT | Identify personas, processes, tools, metrics |
| Classification | Custom classifier | Categorize content into ARG-Builder taxonomy |
| Summarization | GPT-4 | Condense responses into structured sections |
| Quality Scoring | Custom model | Assess completeness, accuracy, coherence |

### Generation Pipeline

The Generation Pipeline transforms extracted knowledge into a complete, interactive operational guide. It operates as a multi-stage pipeline with quality gates between each stage.

**Stage 1: Content Structuring** — Organize extracted knowledge into personas, processes (7 stages each), capabilities, and guidelines. Validate completeness against the ARG-Builder content model.

**Stage 2: Design Selection** — Apply the appropriate design system based on industry, brand guidelines, and user preferences. Generate color palettes, typography selections, and layout configurations.

**Stage 3: Component Assembly** — Generate React components for each section of the guide using pre-built templates populated with structured content. Apply design tokens and responsive layouts.

**Stage 4: Feature Integration** — Add interactive features (search indexing, command palette configuration, process timeline data, PDF export) based on the generated content.

**Stage 5: Quality Assurance** — Automated testing for accessibility (WCAG AA), performance (Lighthouse 90+), responsiveness, and content accuracy. Human review gate for founding customers.

---

## Data Architecture

### Primary Database (PostgreSQL 16)

PostgreSQL serves as the primary relational database for all structured data. The schema is designed for multi-tenancy with row-level security policies ensuring complete data isolation between customers.

**Key Tables:**

| Table | Purpose | Estimated Rows (Year 1) |
|-------|---------|------------------------|
| organizations | Customer accounts | 63 |
| users | Team members | 6,300 |
| projects | Operational guide projects | 189 |
| personas | Defined personas per project | 567 |
| processes | Process definitions (7 stages) | 1,323 |
| guidelines | Operational guidelines | 3,780 |
| interviews | Interview transcripts | 756 |
| analytics_events | Usage tracking events | 12M+ |

### Caching Layer (Redis)

Redis provides high-performance caching for frequently accessed data, session management, and real-time features. The caching strategy uses a combination of TTL-based expiry and event-driven invalidation.

| Cache Type | TTL | Purpose |
|-----------|-----|---------|
| Session tokens | 15 min | Authentication state |
| Guide content | 1 hour | Reduce database load for guide rendering |
| Search index | 30 min | Fast search results |
| Analytics aggregates | 5 min | Dashboard metrics |
| Rate limit counters | 1 min | API rate limiting |

### Search Engine (Elasticsearch)

Elasticsearch powers the full-text search functionality within operational guides. Each guide's content is indexed with custom analyzers for domain-specific terminology, enabling instant search results across personas, processes, and guidelines.

### Object Storage (AWS S3)

S3 stores all generated assets including guide HTML/CSS/JS bundles, uploaded images, PDF exports, and interview audio recordings. Content is served through CloudFront CDN for global performance.

---

## Infrastructure & Deployment

### Cloud Architecture (AWS)

| Service | AWS Component | Purpose |
|---------|--------------|---------|
| Compute | ECS Fargate | Containerized microservices |
| Load Balancing | ALB | Traffic distribution, health checks |
| CDN | CloudFront | Static asset delivery, global performance |
| Database | RDS PostgreSQL | Primary data store |
| Cache | ElastiCache Redis | Caching, sessions, real-time |
| Search | OpenSearch | Full-text search |
| Storage | S3 | Object storage, static assets |
| Queue | SQS | Async job processing |
| Events | EventBridge | Service-to-service communication |
| Secrets | Secrets Manager | API keys, credentials |
| Monitoring | CloudWatch + Datadog | Observability, alerting |
| CI/CD | GitHub Actions + ECR | Automated deployment pipeline |

### Deployment Strategy

The platform uses a blue-green deployment strategy with automated rollback capabilities. Each microservice is independently deployable with its own CI/CD pipeline. Database migrations are handled through versioned migration scripts with forward-only compatibility.

**Environments:**
- Development: Feature branches, ephemeral environments
- Staging: Pre-production mirror, integration testing
- Production: Blue-green deployment, canary releases

---

## Security Architecture

### Authentication & Authorization

The platform implements a multi-layered security model with OAuth 2.0 / OIDC for authentication and role-based access control (RBAC) for authorization. Enterprise customers can integrate their existing identity providers through SAML 2.0 or OIDC.

| Role | Permissions |
|------|------------|
| Owner | Full access, billing, user management |
| Admin | Project management, user invitations, settings |
| Editor | Create/edit guides, run interviews |
| Viewer | Read-only access to deployed guides |

### Data Protection

All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Customer data is logically isolated through row-level security policies in PostgreSQL. PII is identified and handled according to GDPR and CCPA requirements.

### Compliance Framework

| Standard | Timeline | Status |
|----------|----------|--------|
| SOC 2 Type I | Month 6 | Planned |
| SOC 2 Type II | Month 12 | Planned |
| GDPR | Launch | Required |
| CCPA | Launch | Required |
| HIPAA | Year 2 | Healthcare vertical |

---

## Scalability & Performance

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page load time | < 3 seconds | P95, global |
| API response time | < 200ms | P95, authenticated |
| Search latency | < 100ms | P95, full-text |
| Guide generation | < 19 hours | P95, complete guide |
| Uptime | 99.9% | Monthly, excluding maintenance |
| Concurrent users | 10,000+ | Per customer guide |

### Scaling Strategy

The architecture supports horizontal scaling at every layer. ECS Fargate auto-scales based on CPU/memory utilization and request count. The database uses read replicas for query distribution and connection pooling (PgBouncer) for efficient connection management. Redis cluster mode enables cache scaling beyond single-node limits.

**Year 1 Capacity:** 63 customers, ~6,300 users, ~189 active guides
**Year 3 Capacity:** 300 customers, ~30,000 users, ~900 active guides
**Year 5 Capacity:** 900 customers, ~90,000 users, ~2,700 active guides

---

## Monitoring & Observability

### Observability Stack

| Tool | Purpose | Coverage |
|------|---------|----------|
| Datadog | APM, infrastructure monitoring | All services |
| Sentry | Error tracking, crash reporting | Client + Backend |
| CloudWatch | AWS resource monitoring, logs | Infrastructure |
| PagerDuty | Incident alerting, on-call rotation | Critical alerts |
| Grafana | Custom dashboards, SLA tracking | Business metrics |

### Key Alerts

| Alert | Severity | Threshold | Response Time |
|-------|----------|-----------|---------------|
| API error rate > 5% | Critical | 5 min sustained | 5 min |
| P95 latency > 1s | High | 10 min sustained | 15 min |
| Database CPU > 80% | High | 5 min sustained | 15 min |
| Generation failure | Medium | Any single failure | 30 min |
| Disk usage > 85% | Medium | Threshold crossed | 1 hour |

---

## Technology Decision Records

### ADR-001: React over Next.js for Client

**Decision:** Use React SPA with Vite instead of Next.js.
**Rationale:** Operational guides are authenticated, private applications — SEO is irrelevant. SPA provides faster client-side navigation, simpler deployment (static hosting + API), and avoids SSR complexity. Vite provides superior DX with instant HMR.

### ADR-002: PostgreSQL over MongoDB for Primary Database

**Decision:** Use PostgreSQL as the primary database.
**Rationale:** Operational guide data is inherently relational (organizations → projects → personas → processes → stages). PostgreSQL's row-level security enables clean multi-tenancy. JSONB columns provide document flexibility where needed without sacrificing relational integrity.

### ADR-003: Multi-Model AI Strategy

**Decision:** Use multiple AI models (GPT-4, Claude, custom fine-tuned) rather than a single model.
**Rationale:** Different tasks require different model strengths. GPT-4 excels at conversation flow, Claude at structured extraction, and custom models at domain-specific classification. This approach also provides vendor redundancy and cost optimization (using smaller models for simpler tasks).

### ADR-004: Event-Driven Architecture for Service Communication

**Decision:** Use EventBridge for inter-service communication with REST for synchronous needs.
**Rationale:** Loose coupling between services enables independent scaling and deployment. Event-driven patterns naturally support the asynchronous nature of guide generation (which takes hours, not seconds). REST is reserved for real-time user-facing operations where immediate response is required.
