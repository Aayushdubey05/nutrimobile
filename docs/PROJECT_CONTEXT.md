# NutriVision-3D — Full Project Architecture & System Context

## 1. Executive Summary

**NutriVision-3D** is a full-stack mobile health & nutrition application designed to streamline calorie logging, macro tracking, and personalized diet management. 

The system relies on a 3-tier architecture:
1. **Mobile Frontend**: React Native with Expo SDK 57 (TypeScript).
2. **Backend API Service**: Java Spring Boot 3.x with PostgreSQL database.
3. **AI/ML Service**: Python/FastAPI microservice *(Currently under active development; image analysis currently uses fallback mock logic for testing)*.

---

## 2. High-Level System Architecture

```text
📱 React Native Mobile App (Expo SDK 57)
         │
         │  HTTP / REST API + JWT Bearer Tokens
         ▼
⚙️ Spring Boot Backend API (/api/v1)
    ├── Auth & JWT Security Filter
    ├── User Profile & Settings Engine
    ├── Nutrition Calculation Engine (Mifflin-St Jeor)
    ├── Food & Custom Meal Database
    ├── AI Analysis Orchestration
    └── Progress Analytics
         │
         ├──────────────────────────┐
         ▼                          ▼
🗄️ PostgreSQL Database      🐍 FastAPI ML Service (In Dev)
(Schemas, Users, Meals)    (3D Mesh & Portion Estimation)
```

---

## 3. Unified Repository Structure

```text
nutrivision-3d/
├── docs/                        # Project Context & Documentation
│   ├── PROJECT_CONTEXT.md       # High-level architecture & workflows (This file)
│   ├── BACKEND_PROJECT_CONTEXT.md# Spring Boot API, schemas & modules
│   └── FRONTEND_PROJECT_CONTEXT.md# Mobile design system, screens & routing
├── backend/                     # Java Spring Boot 3.x Backend Application
│   ├── src/main/java/com/nutrivision/backend/
│   │   ├── auth/                # Auth, JWT, Login, Registration
│   │   ├── user/                # User profiles, settings, restrictions
│   │   ├── food/                # Global foods database & custom items
│   │   ├── meal/                # Daily meals & logged items
│   │   ├── nutrition/           # Daily target calculation & tracking
│   │   ├── analysis/            # Image analysis & AI detection pipeline
│   │   ├── recommendation/      # Health & goal-based recommendation engine
│   │   └── security/            # Security config & JWT filters
│   └── src/main/resources/
│       └── db/migration/        # Flyway SQL migrations (V1__init_schema.sql)
├── mobile/                      # React Native / Expo Mobile Application
│   ├── app/                     # Expo Router file-based pages
│   │   ├── index.tsx            # Splash / Onboarding entry screen
│   │   ├── auth/                # Login & Signup screens
│   │   └── main/                # Main tabs (Home, Diary, Scan, Progress, Profile)
│   └── src/                     # Core reusable UI & logic
│       ├── api/                 # Axios client, endpoints, types
│       ├── components/          # Reusable UI components & bottom nav
│       ├── constants/           # Color palette, spacing, typography tokens
│       └── features/            # Feature-sliced modules (auth, profile, home, etc.)
└── ml-service/                  # Python FastAPI AI Microservice (Under Development)
```

---

## 4. End-to-End User Workflows

```text
[1. User Registration & Onboarding]
   └── User signs up -> Enters Age, Height, Weight, Activity Level & Goals.
   └── Backend calculates Daily BMR & TDEE using Mifflin-St Jeor formula.

[2. Daily Dashboard & Target Monitoring]
   └── User opens Home screen -> Views circular calorie progress & macro breakdown (Protein, Carbs, Fat).
   └── Backend computes consumed values against target values for today's date.

[3. Food Logging Flow (Scan or Search)]
   └── User clicks "Scan Food" -> Captures/Uploads food image.
   └── Backend submits image to Analysis Engine (Mock/ML Service) -> Returns detected food items & volume.
   └── User reviews detection -> Adjusts portion -> Saves to Daily Meal (Breakfast/Lunch/Dinner/Snack).

[4. Personal Recommendations & Insights]
   └── System analyzes dietary restrictions, health conditions, and macro deficit.
   └── Generates personalized recommendations (e.g. High Protein Snack, Hydration Tip).

[5. Progress Analytics]
   └── User views Progress screen -> Analyzes weekly/monthly calorie intake trends and weight trajectory.
```

---

## 5. Key System Design Principles

1. **Clean Separation of Concerns**: Controllers handle HTTP endpoints; Services contain business logic; Repositories handle database queries.
2. **Mobile UX Excellence**: Android-first design system with calm, warm aesthetics (`#F7F5F3` background, `#171717` dark primary), high legibility, and zero cluttered AI popups.
3. **Stateless JWT Security**: Short-lived JWT Access Tokens paired with rotating Refresh Tokens stored securely on mobile device via `expo-secure-store`.
4. **Graceful Fallbacks**: Mobile app handles offline or 404 missing user profile states smoothly without crashing.
