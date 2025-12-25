# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Role & Responsibilities

Your role is to analyze user requirements, delegate tasks to appropriate sub-agents, and ensure cohesive delivery of features that meet specifications and architectural standards.

## Workflows

- Primary workflow: `./.claude/workflows/primary-workflow.md`
- Development rules: `./.claude/workflows/development-rules.md`
- Orchestration protocols: `./.claude/workflows/orchestration-protocol.md`
- Documentation management: `./.claude/workflows/documentation-management.md`
- And other workflows: `./.claude/workflows/*`

**IMPORTANT:** Analyze the skills catalog and activate the skills that are needed for the task during the process.
**IMPORTANT:** You must follow strictly the development rules in `./.claude/workflows/development-rules.md` file.
**IMPORTANT:** Before you plan or proceed any implementation, always read the `./README.md` file first to get context.
**IMPORTANT:** Sacrifice grammar for the sake of concision when writing reports.
**IMPORTANT:** In reports, list any unresolved questions at the end, if any.
**IMPORTANT**: Date format is configured in `.ck.json` and injected by session hooks via `$CK_PLAN_DATE_FORMAT` env var. Use this format for plan/report naming.

## Documentation Management

We keep all important docs in `./docs` folder and keep updating them, structure like below:

```
./docs
├── project-overview-pdr.md
├── code-standards.md
├── codebase-summary.md
├── design-guidelines.md
├── deployment-guide.md
├── system-architecture.md
└── project-roadmap.md
```

**IMPORTANT:** *MUST READ* and *MUST COMPLY* all *INSTRUCTIONS* in project `./CLAUDE.md`, especially *WORKFLOWS* section is *CRITICALLY IMPORTANT*, this rule is *MANDATORY. NON-NEGOTIABLE. NO EXCEPTIONS. MUST REMEMBER AT ALL TIMES!!!*

---

## Project: Vietnam Address Converter (Frontend)

### Overview

This is a Next.js 15 frontend application for converting Vietnamese addresses between the old system (63 provinces, pre-2025) and the new system (34 provinces, post-2025). The app uses:
- **Next.js 15** with App Router and React 19
- **TanStack Query (React Query)** for data fetching and caching
- **Tailwind CSS** with a custom Swiss minimalist design system
- **Static export** for Cloudflare Pages deployment

### Development Commands

```bash
# Development server (runs on http://localhost:3000 by default)
npm run dev

# Production build (static export to /out directory)
npm run build

# Preview production build (serves /out directory)
npm start

# Lint code
npm run lint
```

### Architecture

#### Dual API Integration

The app integrates with **two separate APIs**:

1. **Backend Conversion API** (`lib/api.ts`):
   - Base URL: `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`)
   - Endpoints: `/api/convert/old-to-new`, `/api/convert/new-to-old`, `/api/convert/quick/*`
   - Purpose: Performs actual address conversion logic

2. **Provinces Open API** (`lib/api.ts`):
   - Base URL: `https://provinces.open-api.vn/api/`
   - Two versions: v1 (old 63-province system) and v2 (new 34-province system)
   - Purpose: Fetches province/district/ward data for dropdown selectors
   - **Critical distinction**:
     - **v1**: 3-level hierarchy (Province → District → Ward)
     - **v2**: 2-level hierarchy (Province → Ward, no districts)

#### Conversion Mode Determines API Version

The conversion mode (`old-to-new` or `new-to-old`) determines which Provinces API version to use:
- `old-to-new` mode → Uses v1 API (fetches provinces, districts, wards)
- `new-to-old` mode → Uses v2 API (fetches provinces, wards only)

When fetching wards:
- **v1**: `fetchWards(districtCode, "v1")` - fetches wards for a specific district
- **v2**: `fetchWards(provinceCode, "v2")` - fetches wards for a province (no district level)

#### Component Architecture

- **`AddressConverter.tsx`** (components/): Main orchestrator component
  - Manages all state (province, district, ward, conversion mode)
  - Coordinates data fetching and conversion logic
  - Handles form validation and submission

- **Selection Components**: `ProvinceSelect`, `DistrictSelect`, `WardSelect`
  - Reusable dropdown selectors
  - Handle loading states and disable logic

- **`QuickConvertInput.tsx`**: Alternative input mode for full address text
- **`ResultDisplay.tsx`**: Displays conversion results with copy/switch/reset actions
- **`ModeToggle.tsx`**: Switches between old-to-new and new-to-old conversion
- **`InputModeToggle.tsx`**: Switches between selection mode and quick input mode

#### Custom Hooks Pattern

Each data operation has a dedicated React Query hook in `hooks/`:
- `useProvinces(mode)`: Fetches provinces based on conversion mode
- `useDistricts(provinceCode, mode)`: Fetches districts (v1 only)
- `useWards(code, mode, provinceCode)`: Fetches wards (parameter varies by mode)
- `useConvert(mode)`: Mutation hook for structured address conversion
- `useQuickConvert(mode)`: Mutation hook for full address text conversion

#### State Management Pattern

The main component stores both `code` and `name` for each address level:
```typescript
const [province, setProvince] = useState<{ code: string; name: string } | null>(null)
```

This dual storage is required because:
- Provinces API uses numeric **codes** for hierarchical lookups
- Backend Conversion API expects **names** in request body

### Design System: Swiss Minimalism

The app implements a custom design system in `app/globals.css`:

**Color Palette**:
- Accent: `#FF0000` (Swiss red)
- Neutrals: Black (`#000000`), white (`#FFFFFF`), gray scale

**Grid System**:
- Base unit: `8px`
- Spacing variables: `--spacing-xs` through `--spacing-3xl`

**Custom Utility Classes**:
- `.swiss-card`: Card component with border and subtle hover effect
- `.swiss-heading`: Bold headings with tight letter-spacing
- `.swiss-label`: Uppercase labels (10px, 600 weight)
- `.swiss-input`: Styled form inputs with focus states
- `.swiss-button`: Buttons with active scale effect
- `.swiss-accent`: Red accent background color

**Typography**:
- Primary font: Be Vietnam Pro
- Fallback: Inter, Helvetica Neue, Helvetica, Arial
- Font features: Kerning and ligatures enabled
- Letter-spacing: `-0.01em` (body), `-0.03em` (headings)

### Configuration

#### Static Export for Cloudflare Pages

`next.config.ts` is configured for static hosting:
```typescript
{
  output: 'export',              // Static HTML export
  trailingSlash: true,           // Compatibility with static hosts
  images: { unoptimized: true }, // Required for static export
}
```

Build output goes to `/out` directory.

#### TypeScript Path Alias

Import alias: `@/*` maps to project root
```typescript
import { useConvert } from '@/hooks/useConvert'
import type { Province } from '@/types/address'
```

#### React Query Defaults

Default configuration in `app/layout.tsx`:
```typescript
{
  staleTime: 60 * 60 * 1000,      // 1 hour (province data is stable)
  refetchOnWindowFocus: false,    // Prevent unnecessary refetches
  retry: 1,                       // Fail fast
}
```

### Key Implementation Patterns

#### Hydration Error Prevention

The main component uses client-side mounting check:
```typescript
const [mounted, setMounted] = useState(false)
useEffect(() => { setMounted(true) }, [])
if (!mounted) return <LoadingState />
```

This prevents SSR/CSR mismatches in static export mode.

#### Form Validation Logic

Form validity depends on conversion mode:
- **old-to-new**: Requires province **AND** district **AND** ward
- **new-to-old**: Requires province **AND** ward (no district)

```typescript
const isFormValid = mode === 'new-to-old'
  ? (province && ward)
  : (province && district && ward)
```

#### Error Handling

The axios client (`lib/api.ts`) has a response interceptor providing user-friendly errors:
- Server errors: Extracts `detail` or `message` from response
- Network errors: "Cannot connect to server" message
- Other errors: Generic fallback message

#### Client-Side Only

The root layout uses `'use client'` directive because:
- React Query's `QueryClientProvider` requires client-side context
- State management happens entirely on the client
- Static export means no server-side rendering anyway