# NutriVision-3D — Frontend Architecture & UI Guidelines

## 1. Overview & Tech Stack

- **Framework**: React Native 0.86.3 (Expo SDK 57)
- **Routing**: Expo Router (File-based navigation under `/app`)
- **Language**: TypeScript 6.0
- **State Management**: React Context (`AuthContext`, `OnboardingContext`) + TanStack Query (`@tanstack/react-query`)
- **API Client**: Axios with automatic JWT bearer authorization & token refresh interceptor

---

## 2. Design System & UX Principles

### Core Aesthetics
- **Background**: Warm off-white `#F7F5F3`
- **Card Container**: White `#FFFFFF` with 16–24px border radius and subtle border `#EBEBEB`
- **Primary Accent**: Dark Charcoal `#171717` / `#1B1B1B`
- **Secondary Text**: Muted Gray `#737373` / `#9CA3AF`
- **Macro Indicators**: 
  - Protein: Blue `#3B82F6`
  - Carbs: Green `#10B981`
  - Fat: Yellow/Orange `#F59E0B`

### Strict Guidelines
- **No Chatbots / AI Popups**: The UI must feel like a calm, high-end health app, not an experimental chatbot.
- **Android-First Responsiveness**: Handled using `SafeAreaView` and dynamic window dimensions.
- **Micro-Interactions**: Smooth press opacity (`opacity: 0.85`) and native SVG progress rings.

---

## 3. Navigation Structure

The app uses Expo Router with a fixed **5-Item Bottom Navigation Bar**:

```text
[ Home ]  |  [ Diary ]  |  [ SCAN (Primary) ]  |  [ Progress ]  |  [ Profile ]
```

### Route Index
```text
mobile/app/
├── index.tsx              # Onboarding / Splash entry
├── auth/
│   ├── login.tsx          # Login screen
│   └── signup.tsx         # User registration screen
├── onboarding/
│   └── diet-health.tsx    # Dietary preferences & health profile setup
└── main/
    ├── dashboard.tsx      # Home screen (Calorie ring & today's meals)
    ├── diary.tsx          # Daily meal log history
    ├── scan.tsx           # Camera / photo upload scan food screen
    ├── manual-entry.tsx   # Add meal manually
    ├── recommendations.tsx# Personalized dietary recommendations
    ├── progress.tsx       # Weekly & monthly progress charts
    └── profile.tsx        # Profile management & calorie target adjustment
```

---

## 4. Key Screen Details

1. **Splash / Onboarding (`index.tsx`)**: High-impact welcome screen with primary CTA `Get Started` pointing to Login.
2. **Login (`auth/login.tsx`)**: Email/Password authentication with inline validation and JWT storage.
3. **Signup (`auth/signup.tsx`)**: Multi-step registration capturing age, activity level, dietary restrictions, and health conditions.
4. **Dashboard (`main/dashboard.tsx`)**:
   - Dynamic SVG Calorie Progress ring.
   - Real-time macro progress bars (Protein, Carbs, Fat).
   - Primary `Scan Food` action button and today's logged meals list.
5. **Scan Food (`main/scan.tsx`)**: Camera viewfinder / gallery selector for food detection *(Communicates with analysis backend)*.
6. **Profile & Settings (`main/profile.tsx`)**:
   - Shows user details, dietary restrictions, health conditions, and Daily Calorie Target.
   - Handles graceful profile loading (fallback prompting setup if profile missing).
   - Clean logout with immediate router replacement to `/auth/login`.

---

## 5. API Integration & Error Handling

- **Axios Interceptor (`apiClient.ts`)**: Automatically attaches `Bearer <token>` to requests and seamlessly handles 401 token refresh via `/auth/refresh`.
- **404 Fallback Pattern**: Endpoints returning 404 for uninitialized user profiles prompt the user to complete profile setup rather than throwing raw alert crashes.
- **Base URL Configuration**: Configured in `src/constants/config.ts` via `EXPO_PUBLIC_API_URL`.
