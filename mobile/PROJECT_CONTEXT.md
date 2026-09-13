# Nutrivision 3D — System Context & Specifications

Compact reference guide for **Nutrivision 3D** (Expo v57 + FastAPI AI backend).

---

## 1. Core Architecture & AI Models

- **Frontend**: React Native with **Expo v57** (`expo-router` file-based routing), TypeScript, Reanimated.
- **Backend**: **FastAPI** (Python) serving 4 core AI pipelines:
  1. **SAM2**: Multi-object food mask instance segmentation.
  2. **Monocular Depth**: 3D food volumetric estimation ($cm^3 \rightarrow \text{grams}$).
  3. **Vision Classifier + XAI**: Food classification + confidence score + Grad-CAM heatmap overlays.
  4. **LSTM + RLHF**: Personalized meal recommendations driven by eating history and thumbs up/down user feedback signals, constrained by user health conditions.

---

## 2. Screen Specifications (13 Mandatory Screens)

| # | Screen | Mandatory Elements & Requirements |
|---|--------|-----------------------------------|
| 1 | **Splash / Onboarding** | Logo/Name, 1-line value prop, "Get Started" CTA. *(No chatbot/AI Assistant claims)* |
| 2 | **Login** | Email, password (show/hide toggle), Login CTA, Forgot password, Sign up link, **inline error banner for FastAPI 401s**. |
| 3 | **Signup** | Name, email, password, confirm password + **Health Profile** (Age, Activity Level, Dietary Restrictions: *veg/vegan/gluten-free/none*, Known Health Conditions: *diabetes/hypertension/none* for LSTM+RLHF). |
| 4 | **Home / Dashboard** | Greeting + name, today's calorie ring (consumed/goal), macro mini-bars (carbs/protein/fat), search bar, **"Scan Food"** primary CTA, recent 3–5 logged meals, zero-log empty state. |
| 5 | **Camera Capture** | Live viewfinder, shutter button, gallery fallback, flash toggle, back button, **inference loading overlay** (SAM2 + depth model latency). |
| 6 | **Segmentation Review** | Photo + SAM2 mask overlays, tap-to-toggle segment actions (confirm/remove/merge), "Looks good, continue" CTA, fallback text if 0 segments (*"No food items found — try manual entry"*). |
| 7 | **Manual / Search Entry** | Search bar, live-filtered list (name, thumbnail, kcal/100g), custom item link, recent search history. |
| 8 | **Food Detail / Result** | Food photo, **editable name**, classifier confidence indicator, total kcal, macro cards, **editable portion weight** (grams), "Add to Log" & "Update Details" buttons. |
| 9 | **Explainability Panel** | **Expandable modal on Screen 8** (non-blocking), Grad-CAM heatmap overlay on food photo, 1-line caption (*"Model focused on: charred surface, greens"*), close trigger. |
| 10 | **Meal Log / Diary** | Date selector, chronological entry list (thumbnail, name, kcal, time), running total vs goal, swipe/tap to edit/delete, empty state for zero logs. |
| 11 | **Recommendations** | Suggestion cards (what + why in 1 line), **thumbs up/down RLHF feedback buttons**, cold-start state (*"No recommendations yet"*). |
| 12 | **Progress / History** | Date-range selector (week/month), calorie trend chart, macro trend chart, goal-adherence percentage. |
| 13 | **Profile / Settings** | **Editable health profile** (age, activity, diet, health conditions), notification toggle, logout button, **GDPR/HIPAA data export & account deletion**. |

---

## 3. Project Directory Structure

```
nutrivision-3d/
├── PROJECT_CONTEXT.md
└── src/
    ├── app/                        # Expo Router Pages
    │   ├── index.tsx               # Splash / Onboarding (Screen 1)
    │   ├── camera.tsx              # Camera Capture (Screen 5)
    │   ├── segmentation-review.tsx # SAM2 Mask Review (Screen 6)
    │   ├── search.tsx              # Manual Search (Screen 7)
    │   ├── food-detail.tsx         # Nutrient Result & XAI (Screens 8 & 9)
    │   ├── auth/                   # Login & Signup (Screens 2 & 3)
    │   └── (tabs)/                 # Dashboard, Diary, Recs, Progress, Profile (Screens 4, 10-13)
    ├── components/                 # Reusable UI & Domain Components
    │   ├── ui/                     # Button, Input, Card, ProgressRing, ErrorBanner
    │   ├── camera/                 # Viewfinder, MaskOverlay
    │   └── food/                   # NutrientCard, ExplainabilityModal, RecommendationCard
    ├── context/                    # Auth, MealLog, Theme Contexts
    ├── services/                   # FastAPI Endpoints (Auth, Vision, Meals, Recs, User)
    ├── types/                      # TypeScript Interfaces (User, Vision, Meal, RLHF)
    └── utils/                      # Formatters, Validators, Constants
```

---

## 4. Key Data Models

```typescript
// User Health Profile (RLHF & LSTM Input)
export interface HealthProfile {
  age: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  dietaryRestrictions: ('vegetarian' | 'vegan' | 'gluten_free' | 'none')[];
  healthConditions: ('diabetes' | 'hypertension' | 'none')[];
}

// Vision & SAM2 Analysis Output
export interface VisionAnalysisResult {
  imageUrl: string;
  segments: { id: string; label: string; maskPoints: number[][]; isSelected: boolean }[];
  confidenceScore: number;
  foodName: string;
  weightGrams: number; // Editable by user
  heatmapUrl: string; // XAI overlay
  explainCaption: string; // "Model focused on..."
  calories: number;
  macros: { carbs: number; protein: number; fat: number };
}

// RLHF Feedback Payload
export interface RLHFFeedbackPayload {
  recommendationId: string;
  feedback: 'thumbs_up' | 'thumbs_down';
}
```

---

## 5. Development Best Practices

1. **Inline API Error Feedback**: Always render visible error states (e.g. 401s on login) rather than silent fails.
2. **Editable Portions**: Monocular depth estimates require user confirmation/adjustment for irregular shapes; portion weight must be editable on Screen 8.
3. **Modal XAI Context**: Screen 9 (Explainability Panel) must remain a dismissible overlay on Screen 8, not a separate route.
4. **Clean Separation**: Presentation UI (`src/components`) isolated from API calls (`src/services`) and Router pages (`src/app`).
