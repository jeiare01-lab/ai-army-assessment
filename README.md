# AI Business Process Army - Assessment Platform

A comprehensive diagnostic assessment tool for clustering PGB employees based on AI appetite, readiness, and process improvement mindset.

## Features

- **Assessment Flow** - 3-step diagnostic for demographics, AI skill, and AI appetite
- **Cluster Assignment** - 5-tier classification system
- **Admin Dashboard** - Real-time analytics and member export
- **Supabase Integration** - Secure data storage
- **Mobile-Friendly** - Works on all devices

## Quick Start

1. Create Supabase project at supabase.com
2. Run the SQL schema in Supabase SQL Editor
3. Deploy to Vercel with environment variables:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_ADMIN_PASSWORD

## Clustering Tiers

| Tier | Cluster | AI Appetite | Readiness | Track |
|------|---------|------------|-----------|-------|
| 1 | AI Champions | ≥4.5 | ≥4.0 | Leadership |
| 2 | AI Accelerators | ≥4.0 | ≥3.5 | Fast Track |
| 3 | AI Builders | ≥3.5 | ≥2.5 | Core |
| 4 | AI Learners | ≥2.5 | Any | Foundation |
| 5 | AI Explorers | <2.5 | Any | Awareness |

## Admin Dashboard

Access with password set in `VITE_ADMIN_PASSWORD` environment variable.

Features:
- View all member assessments
- Filter by cluster
- Export CSV
- View analytics

## Support

See full documentation in project root for troubleshooting and customization.
