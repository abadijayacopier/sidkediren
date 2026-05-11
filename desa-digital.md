# Desa Digital - Smart Portal & Administration System

> Portal Terintegrasi: Sistem Informasi Desa (Admin), Portal Berita (Publik), Layanan Mandiri (Warga), serta Hub Integrasi Layanan Lokal (Water/RW Net).

---

## 📋 Overview
Projek ini bertujuan untuk mendigitalkan seluruh ekosistem **Desa Kediren**. Menghubungkan pemerintah desa dengan warga melalui platform satu pintu yang modern, transparan (APBDes), dan terintegrasi dengan infrastruktur lokal (Internet/Air bersih) melalui API.

**Project Type:** WEB (Next.js App Router)

---

## 🎯 Success Criteria
- [ ] UI/UX Premium (Vibrant Nature + Clean SaaS).
- [ ] Manajemen Data Penduduk yang CRUD-nya aman & cepat.
- [ ] Sistem Pengajuan Surat Online yang intuitif bagi warga.
- [ ] Portal Berita & Transparansi APBDes yang SEO-friendly.
- [ ] Dashboard Statistik & Pemetaan Wilayah (GIS) yang interaktif.
- [ ] API Endpoint untuk integrasi layanan lokal (Pamsimas).

---

## 🏗️ Tech Stack
- **Frontend & Backend**: Next.js 15 (App Router) - *All-in-one React & Node.js ecosystem*.
- **Styling**: Tailwind CSS v4 + Shadcn UI.
- **Database**: PostgreSQL with PostGIS (For advanced spatial mapping).
- **ORM**: Prisma.
- **GIS Library**: Leaflet.js / React-Leaflet.
- **UI/UX**: Framer Motion, Lucide Icons.
- **Auth**: Next-Auth (Auth.js).

---

## 📂 File Structure (Planned)
```plaintext
/
├── src/
│   ├── app/
│   │   ├── (public)/       # Landing page, Berita, Profil Desa
│   │   ├── (admin)/        # Dashboard SID & Manajemen Data
│   │   ├── (citizen)/      # Portal Layanan Mandiri Warga
│   │   └── api/            # API Route Handlers
│   ├── components/
│   │   ├── ui/             # Base components (Shadcn)
│   │   ├── shared/         # Reusable layouts, navbars
│   │   └── features/       # Specific feature components
│   ├── lib/                # Prisma client, utils, validators
│   └── hooks/              # Custom React hooks
├── prisma/                 # Database schema & migrations
└── public/                 # Static assets (images, icons)
```

---

## 📝 Task Breakdown

### Phase 1: Foundation (P0)
| ID | Task | Agent | Skills | Priority | Dependencies |
|---|---|---|---|---|---|
| T1 | Initialize Next.js 15 + Tailwind v4 + Project Structure | `frontend-specialist` | `react-best-practices`, `tailwind-patterns` | P0 | None |
| T2 | Setup Prisma Schema (Penduduk, Surat, Berita, Users) | `database-architect` | `database-design`, `prisma-expert` | P0 | T1 |
| T3 | Build Design System (Colors, Typography, Shared UI) | `frontend-specialist` | `frontend-design`, `ui-ux-pro-max` | P0 | T1 |

### Phase 2: Public Portal & News (P1)
| ID | Task | Agent | Skills | Priority | Dependencies |
|---|---|---|---|---|---|
| T4 | Landing Page & Profile Desa (Hero, Vision, Map) | `frontend-specialist` | `frontend-design` | P1 | T3 |
| T5 | News/Blog System (List & Detail with SEO) | `frontend-specialist` | `seo-fundamentals` | P1 | T2, T3 |

### Phase 3: Admin SID (P1)
| ID | Task | Agent | Skills | Priority | Dependencies |
|---|---|---|---|---|---|
| T6 | Admin Dashboard Layout & Stats Overview | `frontend-specialist` | `react-best-practices` | P1 | T3 |
| T7 | Citizen Management (CRUD Penduduk) | `backend-specialist` | `nodejs-best-practices`, `api-patterns` | P1 | T2, T6 |

### Phase 4: Citizen Self-Service (P2)
| ID | Task | Agent | Skills | Priority | Dependencies |
|---|---|---|---|---|---|
| T8 | Letter Request System (Form & Tracking) | `backend-specialist` | `nodejs-best-practices` | P2 | T2, T7 |
| T9 | User Profile & Notifications for Citizens | `frontend-specialist` | `react-best-practices` | P2 | T8 |

### Phase 5: GIS & Transparency (P2)
| ID | Task | Agent | Skills | Priority | Dependencies |
|---|---|---|---|---|---|
| T10 | Interactive Map (GIS) for RT/RW & Poverty Mapping | `frontend-specialist` | `frontend-design` | P2 | T2, T3 |
| T11 | APBDes Transparency Module (Budget Visualization) | `frontend-specialist` | `react-best-practices` | P2 | T3 |

### Phase 6: Integration Hub (P3)
| ID | Task | Agent | Skills | Priority | Dependencies |
|---|---|---|---|---|---|
| T12 | API Auth System (API Keys for Local Services) | `security-auditor` | `api-patterns` | P3 | T2 |
| T13 | Webhooks & Integration Endpoints (RW Net / Water Sync) | `backend-specialist` | `nodejs-best-practices` | P3 | T12 |

---

### 🟢 PHASE 1: FOUNDATION & AUTH (COMPLETED)
- [x] Inisialisasi Project (Next.js 15, Tailwind v3, Prisma).
- [x] Perancangan Skema Database (MySQL).
- [x] Setup Next-Auth v5 (Login Admin).
- [x] Desain Landing Page & Dashboard Admin Dasar.
- [x] Setup Seed Data (Admin Account).

## ✅ PHASE X: VERIFICATION
- [ ] Run `npm run build` to ensure no errors.
- [ ] Run `python .agent/scripts/checklist.py .` for security & quality audit.
- [ ] Verify Mobile Responsiveness on all pages.
- [ ] No purple/violet hex codes used (Premium Nature Green/Blue/Earth tones).
- [ ] All interactive elements have unique IDs for testing.

---

## 🚀 Deployment Plan
- Vercel (Frontend & API)
- Neon/Supabase/Self-hosted MySQL (Database)
