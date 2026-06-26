# ARG-Builder: Scalability Infrastructure

## Executive Summary

This document defines ARG-Builder's infrastructure scaling strategy — the architecture decisions, capacity planning models, and operational procedures that ensure the platform performs reliably as customer count grows from 10 to 10,000+ organizations. Every architectural choice is made with a 10x growth horizon in mind.

---

## Scaling Milestones

### Infrastructure Tiers

| Tier | Customers | Monthly Users | Requests/sec | Monthly Cost | Architecture |
|------|-----------|---------------|-------------|-------------|-------------|
| Startup | 1–50 | 500–5K | 10–50 | $2K–$5K | Single region, managed services |
| Growth | 50–500 | 5K–50K | 50–500 | $5K–$20K | Multi-AZ, auto-scaling |
| Scale | 500–2,000 | 50K–200K | 500–2,000 | $20K–$60K | Multi-region, microservices |
| Enterprise | 2,000–10,000 | 200K–1M | 2,000–10,000 | $60K–$200K | Global, distributed |

---

## Architecture Evolution

### Phase 1: Monolith (0–50 Customers)

| Component | Technology | Configuration | Cost |
|-----------|-----------|---------------|------|
| Application | Node.js (Express/Fastify) | Single instance, t3.medium | $50/month |
| Database | PostgreSQL (RDS) | db.t3.medium, 100GB | $150/month |
| Cache | Redis (ElastiCache) | cache.t3.micro | $15/month |
| Storage | S3 | Standard tier | $5/month |
| CDN | CloudFront | Basic distribution | $10/month |
| Search | PostgreSQL full-text | Built-in | $0 |
| Queue | Bull (Redis-backed) | Shared Redis | $0 |
| Monitoring | CloudWatch + Sentry | Basic | $50/month |

### Phase 2: Scaled Monolith (50–500 Customers)

| Component | Technology | Configuration | Cost |
|-----------|-----------|---------------|------|
| Application | Node.js cluster | Auto-scaling group (2–8 instances) | $400–$1,600/month |
| Load balancer | ALB | Multi-AZ | $50/month |
| Database | PostgreSQL (RDS) | db.r6g.large, Multi-AZ, read replicas | $800/month |
| Cache | Redis (ElastiCache) | cache.r6g.large, cluster mode | $300/month |
| Storage | S3 + CloudFront | Intelligent tiering | $50/month |
| Search | Elasticsearch (OpenSearch) | 2-node cluster | $400/month |
| Queue | SQS + Lambda | Serverless workers | $100/month |
| AI/LLM | OpenAI API + Anthropic | Rate-limited, cached | $2K–$5K/month |
| Monitoring | Datadog | Full APM | $500/month |

### Phase 3: Microservices (500–2,000 Customers)

| Service | Technology | Scaling Strategy | Cost |
|---------|-----------|-----------------|------|
| API Gateway | Kong / AWS API Gateway | Horizontal auto-scale | $500/month |
| Auth Service | Auth0 / Custom | Stateless, cached | $300/month |
| Guide Service | Node.js (ECS Fargate) | Task-based scaling | $1K/month |
| AI Service | Python (ECS Fargate) | GPU-backed, queue-based | $5K/month |
| Search Service | OpenSearch | 3-node cluster, auto-tune | $1.5K/month |
| Notification Service | Lambda + SES/SNS | Event-driven | $200/month |
| Analytics Service | ClickHouse / Redshift | Columnar, batch processing | $1K/month |
| Database | Aurora PostgreSQL | Multi-AZ, auto-scaling storage | $2K/month |
| Cache | Redis Cluster | 6-node cluster | $1K/month |
| Message Queue | SQS + EventBridge | Serverless, event-driven | $300/month |

### Phase 4: Global Distribution (2,000+ Customers)

| Component | Strategy | Regions | Cost |
|-----------|----------|---------|------|
| Application | Multi-region active-active | US-East, US-West, EU-West | 3x compute |
| Database | Aurora Global Database | Primary + 2 read regions | $8K/month |
| Cache | ElastiCache Global Datastore | 3 regions | $3K/month |
| CDN | CloudFront (global) | All edge locations | $2K/month |
| DNS | Route 53 (latency-based routing) | Global | $100/month |
| Storage | S3 Cross-Region Replication | 3 regions | $500/month |
| AI | Regional endpoints + caching | US + EU | $15K/month |

---

## Capacity Planning

### Resource Scaling Rules

| Resource | Metric | Scale-Up Trigger | Scale-Down Trigger | Cooldown |
|----------|--------|-----------------|-------------------|----------|
| App servers | CPU utilization | > 70% for 3 min | < 30% for 10 min | 5 min |
| App servers | Request latency (p99) | > 500ms for 2 min | N/A | 5 min |
| Database | Connection count | > 80% max | N/A (manual) | N/A |
| Database | CPU | > 75% for 5 min | N/A (manual) | N/A |
| Cache | Memory utilization | > 75% | N/A (manual) | N/A |
| Search | Query latency (p95) | > 200ms for 5 min | < 50ms for 30 min | 10 min |
| AI workers | Queue depth | > 100 messages | < 10 messages | 3 min |

### Load Testing Targets

| Scenario | Target | Acceptable | Degraded | Critical |
|----------|--------|-----------|----------|----------|
| Homepage load | < 1s | < 2s | 2–5s | > 5s |
| Search query | < 200ms | < 500ms | 500ms–1s | > 1s |
| Guide generation (AI) | < 30s | < 60s | 60–120s | > 120s |
| API response (p95) | < 100ms | < 250ms | 250–500ms | > 500ms |
| Concurrent users | 1,000 | 500–1,000 | 200–500 | < 200 |
| Throughput | 5,000 req/s | 2,000–5,000 | 500–2,000 | < 500 |

---

## Disaster Recovery

### Recovery Objectives

| Tier | RTO (Recovery Time) | RPO (Recovery Point) | Strategy |
|------|--------------------|--------------------|----------|
| Critical (auth, billing) | < 5 min | 0 (synchronous replication) | Multi-AZ active-active |
| High (core app, API) | < 15 min | < 1 min | Multi-AZ with failover |
| Medium (search, analytics) | < 1 hour | < 15 min | Automated restore |
| Low (batch jobs, reports) | < 4 hours | < 1 hour | Manual restore |

### Backup Strategy

| Data | Method | Frequency | Retention | Location |
|------|--------|-----------|-----------|----------|
| Database | Automated snapshots | Every 5 min (PITR) | 35 days | Cross-region |
| File storage (S3) | Versioning + replication | Real-time | 90 days | Cross-region |
| Configuration | Infrastructure as Code (Terraform) | On every change | Unlimited (Git) | GitHub |
| Secrets | AWS Secrets Manager | On change | Version history | Multi-region |
| Logs | CloudWatch + S3 archival | Real-time + daily archive | 90 days (hot), 1 year (cold) | Same region + S3 |

---

## Cost Optimization

### Strategies by Growth Stage

| Strategy | Savings | Implementation Effort | When to Apply |
|----------|---------|----------------------|---------------|
| Reserved Instances (1-year) | 30–40% | Low | > $5K/month compute |
| Savings Plans (3-year) | 50–60% | Low | > $10K/month, stable workload |
| Spot Instances (non-critical) | 60–90% | Medium | Batch processing, dev/test |
| Right-sizing | 20–40% | Medium | Quarterly review |
| Auto-scaling (scale-down) | 30–50% | Medium | Off-peak hours |
| Caching (reduce compute) | 20–60% | Medium | Repeated queries, AI responses |
| S3 Intelligent Tiering | 20–40% | Low | > 100GB storage |
| CDN caching | 30–50% | Low | Static assets, API responses |

---

## Security at Scale

### Security Layers

| Layer | Controls | Tools |
|-------|----------|-------|
| Network | VPC, security groups, NACLs, WAF | AWS VPC, CloudFront WAF |
| Application | Input validation, rate limiting, CORS | Express middleware, API Gateway |
| Data | Encryption at rest + transit, field-level encryption | KMS, TLS 1.3, pgcrypto |
| Identity | MFA, SSO, RBAC, session management | Auth0, JWT, Redis sessions |
| Monitoring | SIEM, anomaly detection, audit logs | CloudTrail, GuardDuty, Datadog |
| Compliance | SOC 2 controls, automated evidence | Vanta, AWS Config |

---

## SLA Commitments by Tier

| Plan | Uptime SLA | Support Response | Credits |
|------|-----------|-----------------|---------|
| Starter | 99.5% | 24h (business hours) | None |
| Professional | 99.9% | 4h (business hours) | 5% per 0.1% below |
| Enterprise | 99.95% | 1h (24/7) | 10% per 0.05% below |
| Strategic | 99.99% | 15 min (24/7) | 25% per 0.01% below |
