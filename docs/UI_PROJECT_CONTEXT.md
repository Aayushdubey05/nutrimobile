# NutriVision-3D — UI & App Flow Context

## 1. App Overview

NutriVision-3D is a React Native + TypeScript + Expo mobile nutrition-tracking app.

Core user flow:

Onboarding → Login/Signup → Home → Scan/Search Food → Review Detection → Food/Nutrition Details → Add to Diary → Recommendations → Progress

The app uses computer vision/3D analysis for food identification and portion estimation, but **there is NO chatbot or AI Assistant**.

The UI should feel like a polished, modern nutrition/health app rather than an AI demo.

---

# 2. Global Design System

### Device

- Primary design reference: ~390 × 844 px
- Android-first, responsive for different mobile sizes
- Use SafeAreaView / appropriate safe-area handling

### Visual Style

- Minimal, premium, clean, calm, professional
- Warm off-white background: `#F7F5F3`
- White cards: `#FFFFFF`
- Primary text: `#1B1B1B`
- Secondary text: muted gray
- Primary buttons: black background + white text
- Rounded cards: ~16–20px radius
- Rounded/pill buttons and controls
- Subtle borders/shadows only
- Modern font similar to Inter/SF Pro
- Generous spacing, approximately 20–26px horizontal padding

### Semantic Colors

- Protein: blue
- Carbs: green
- Fat: yellow/orange
- Success/vegetarian: green
- Error/delete: red
- Warning: yellow/orange

### Avoid

- Gradients
- Glassmorphism
- Excessive shadows
- Excessive colors
- Large decorative illustrations
- Unnecessary animations
- Chatbot/AI Assistant UI
- Unnecessary screens or navigation items

### Main Navigation

Bottom navigation has exactly 5 items:

`Home | Diary | Scan | Progress | Profile`

Scan is the main action.

Recommendations are **not** a bottom-nav item; access them from Home or another appropriate screen.

---

# 3. Screens

## Screen 1 — Splash / Onboarding

### Purpose

Introduce the app and its value.

### Layout

Centered vertical composition:

- Large `NutriVision-3D` app name/logo
- Large rounded food photograph
- Text: `See your food. Understand your nutrition.`
- Bottom full-width black rounded button: `Get Started`

Only one CTA.

Do not add chatbot, AI Assistant, social login, or onboarding carousel.

---

## Screen 2 — Login

### Layout

- App name: `NutriVision-3D`
- Heading: `Welcome back`
- Subtitle: `Log in to continue tracking your nutrition.`
- Rounded `Email` input
- Rounded `Password` input + show/hide eye icon
- Right-aligned `Forgot password?`
- Black `Login` button
- `Don't have an account? Sign up`

### Error State

Show inline error near the form for failed authentication, e.g.:

`Invalid email or password`

Use subtle red styling. Never fail silently.

---

## Screen 3 — Signup

### Layout

Heading: `Create your account`

Subtitle:
`Set up your profile for personalized nutrition tracking.`

Fields:

1. Name
2. Email
3. Password + visibility toggle
4. Confirm Password + visibility toggle
5. Age
6. Activity Level dropdown
7. Dietary Restrictions dropdown
8. Health Conditions dropdown

Activity examples:

- Sedentary
- Lightly Active
- Moderately Active
- Very Active

Dietary restrictions must support:

- Vegetarian
- Vegan
- Gluten-Free
- None
- Multiple restrictions where applicable

Health conditions:

- Diabetes
- Hypertension
- None
- Multiple conditions where applicable

Bottom:
`Create Account`

Below:
`Already have an account? Log in`

The profile information is important because it is used for personalized nutrition/recommendations.

---

## Screen 4 — Home / Dashboard

### Header

- `NutriVision-3D`
- Profile avatar
- `Good morning, [Name] 👋`
- `Let's track your nutrition today.`

### Nutrition Summary Card

Large white rounded card containing:

- Circular calorie ring
- Consumed calories / daily goal
- Protein progress
- Carbs progress
- Fat progress

Example:
`1,240 / 2,000 kcal`
`Protein 72 / 120g`
`Carbs 145 / 250g`
`Fat 42 / 65g`

### Main Actions

- Search field: `Search food...`
- Large black button: `Scan Food`

### Today's Meals

Show latest 3–5 meals with:

- Thumbnail
- Meal type
- Time
- Food name
- Calories

Example:
`BREAKFAST · 8:30 AM`
`Avocado Toast`
`420 kcal`

### Empty State

`No meals logged yet`
`Scan or search your food to start tracking.`

Bottom navigation visible, Home selected.

---

## Screen 5 — Camera Capture

### Purpose

Capture/import a food image.

### Layout

Full-screen live camera preview.

Top:

- Cancel/X button
- Small `NutriVision-3D` pill
- Flash toggle

Center:

- White instruction pill: `Place your food inside the frame`
- Large viewfinder with white corner markers

Bottom:

- Gallery/import button
- Large shutter button
- Secondary camera control

### Processing State

After capture, show captured image with loading overlay:

`Analyzing your food...`

The UI must clearly communicate that processing is happening. Never leave the user looking at a frozen screen.

---

## Screen 6 — Segmentation Review

### Header

- Back button
- `STEP 2 OF 3`
- `+ Add Item`

### Content

Heading:
`Review your food`

Subtitle:
`We detected these food items. Check before continuing.`

Large rounded food image with segmentation masks/overlays.

Detected labels may include:

- Paneer
- Dal
- Rice
- Roti
- Salad

### Detected Portions

Show count and `Merge Segments`.

Each detected-food card contains:

- Food name
- Estimated quantity
- Short description
- Confirm/check action
- Remove/X action

Example:
`Paneer · ~180g`
`Rich paneer gravy curry`

### Fallback

`No food items found`
`Try another photo or enter food manually.`

### CTA

Black button:
`Looks good, Continue →`

---

## Screen 7 — Manual / Search Food

### Header

- Back button
- `Search food`
- Subtitle describing searchable foods
- `+ Custom Food`

### Search

Large rounded search field with search icon and clear button.

### Recent Searches

Show:
`RECENT SEARCHES` + `Clear`

Use compact chips such as:

- Paneer
- Roti
- Dal Tadka
- Basmati Rice

### Results

Each result contains:

- Food thumbnail
- Food name
- Category/vegetarian badge where applicable
- kcal/100g
- Small nutrition summary
- `+` action

Example:
`Paneer Tikka — 265 kcal / 100g`

### Custom Food

Bottom option:
`Can't find your food?`
`Add custom food manually`

---

## Screen 8 — Food Detail / Nutrition Result

### Header

- Back button
- Bookmark/save icon

### Food Information

- Large rounded food image
- Recognition confidence badge
- Vegetarian badge
- Editable food name + pencil icon
- Short description

Example:
`Paneer Butter Masala`
`Recognition confidence: 92%`
`100% Vegetarian`

### Nutrition

Large calorie card:
`620 kcal`
`Estimated Energy`
`31% of daily goal`

Three macro cards:

- Protein: `28g`
- Carbs: `42g`
- Fat: `36g`

Use the global macro colors.

### Portion Size

Editable portion section:

- Current serving
- Weight, e.g. `250g`
- Minus/plus controls
- Presets: `150g Small`, `250g Std`, `350g Large`

Portion **must be editable** because visual/depth estimation may be inaccurate.

### Explainability

Clickable:
`How was this estimated?`

### Actions

Primary:
`✓ Add to Daily Log`

Secondary:
`Update Ingredients or Retake`

---

## Screen 9 — Explainability Panel

This is **NOT a separate navigation screen**.

It is a modal/bottom sheet opened from Screen 8.

### Layout

- Background Food Detail screen remains visible/dimmed
- White rounded bottom sheet
- Close X
- Heading: `How was this estimated?`
- Short explanation

### Food Image

Show food image with heatmap/highlight overlay.

Caption example:
`Model focused on: food surface, texture and visible ingredients.`

### Explanation

Show compact cards for:

**Visual Detection**
Identifies food from visible appearance, texture, colors, etc.

**Volume & Portion**
Explains 3D/depth-based portion estimation.

**Nutrition Lookup**
Explains matching the identified food to nutrition/composition data.

Show:
`Recognition confidence: 92%`

Small disclaimer:
`Nutrition values are estimates based on the identified food items and detected portion volume.`

Bottom:
`Got it`

Panel must be easily dismissible and must not block the main flow.

---

## Screen 10 — Meal Diary

### Header

- `Meal Diary`
- `Strictly Vegetarian Log`
- `+` button

### Date Selector

Horizontal:
`<  Calendar  Today, 7 Sep  >`

### Daily Summary

White card showing:

- Calories consumed
- Daily calorie goal
- Calories remaining
- Progress bar
- Protein / Carbs / Fat totals

Example:
`1,240 / 2,000 kcal`
`760 kcal left`

### Today's Meals

Chronological list.

Each meal card:

- Thumbnail
- Meal type
- Time
- Food name
- Calories
- Vegetarian badge
- Edit icon
- Delete icon

Example:
`BREAKFAST · 8:30 AM`
`Paneer Tikka`
`280 kcal`

### Add Meal

`+ Log another meal or snack`

### Empty State

`No meals logged today`
`Scan or search for food to start your diary.`

Diary selected in bottom navigation.

---

## Screen 11 — Recommendations

### Header

- `Recommendations`
- `Suggestions based on your nutrition today`
- Refresh icon

### Daily Status

Show calorie intake vs goal and remaining calories.

### Recommendation Cards

Each card must clearly show:

**What + Why**

Each card contains:

- Category
- Recommendation title
- Short reason
- Optional suggested food
- `👍 Yes`
- `👎 No`
- Optional `Add to Log`

Example:

**Protein Focus**
`Add more protein`

`You're below your protein goal. Consider Paneer, Dal, or tofu.`

`Recommended: Paneer Tikka / Dal Tadka`

Feedback is important because it provides recommendation feedback data.

### Empty State

For users without enough history:

`No recommendations yet`

`Keep logging meals to receive personalized nutrition recommendations.`

Do not fabricate recommendations when insufficient data exists.

---

## Screen 12 — Progress / History

### Header

- `Your Progress`
- `Track your weekly nutrition trend & consistency`
- Calendar/history icon

### Controls

Segmented selector:
`Week | Month`

Date range:
`1 Sep – 7 Sep`

### Goal Adherence

Card showing:

- Days on target
- Percentage adherence
- Simple status indicator

Example:
`5 / 7 days`
`71% adherence`
`On Target`

### Calorie Trend

Show:

- Daily average calories
- Bar chart
- Days Mon–Sun
- Goal reference line
- Highest/lowest information

Example:
`1,890 daily avg`
`Goal: 2,000`

### Macro Trend / Averages

Show horizontal progress bars for:

- Protein
- Carbohydrates
- Healthy Fats

Example:
`Protein 74g / 100g`
`Carbs 170g / 220g`
`Fat 52g / 65g`

### Weight

Weight tracking can be shown because the profile collects weight.

Example:
`Current Weight: 59.0 kg`
`-0.4 kg this week`

Progress selected in bottom navigation.

---

## Screen 13 — Profile / Settings

### Header

- `Profile & Settings`
- `Manage your preferences and dietary goals`

### Profile Card

Show:

- Avatar
- Name
- Dietary badge
- Email
- `Edit Profile`

### Nutrition & Health Profile

Editable rows for:

- Daily calorie target
- Dietary preference
- Activity level
- Age & weight
- Health conditions
- Other profile information collected during signup

Example:
`2,000 kcal / day`
`Vegetarian`
`Moderate Activity`
`Age & Weight`
`None reported`

### Settings

- `Meal Reminders & Alerts` + toggle
- `Export My Data` + description/action

### Account

- `Log Out`
- `Delete Account` in red

Delete Account must be clearly separated from normal settings.

### Footer

App version and links such as:
`Privacy Policy & Terms of Service`

Profile selected in bottom navigation.

---

# 4. Overall UX Flow

### Authentication

`Onboarding → Login`

or

`Onboarding → Signup → Home`

### Food Scanning

`Home → Camera → Segmentation Review → Food Detail → Add to Diary`

### Manual Food Entry

`Home → Search Food → Food Detail → Add to Diary`

### Explainability

`Food Detail → Explainability Bottom Sheet → Food Detail`

### Daily Tracking

`Home → Meal Diary`

### Personalization

`Home → Recommendations`

Recommendations use:

- User profile
- Nutrition targets
- Meal history
- Recommendation feedback

### History

`Home → Progress`

### Account

`Home → Profile`

---

# 5. Important UI/Implementation Rules

1. Preserve the global design system across all screens.
2. Prefer reusable UI components for buttons, inputs, cards, badges, macro bars, headers and navigation.
3. Use realistic static/mock data when implementing UI before backend integration.
4. Do not invent new product features without explicit instruction.
5. Do not remove required fields/states just to simplify the UI.
6. Keep food portion editing available.
7. Keep recommendation thumbs-up/down feedback available.
8. Keep authentication errors visible.
9. Keep loading/empty/error states where specified.
10. Screen 9 is a modal/bottom sheet, not a navigation destination.
11. Main bottom navigation always remains:
    `Home | Diary | Scan | Progress | Profile`
12. Do not add a chatbot or AI Assistant.
13. Do not redesign the visual language unless explicitly requested.

---

# 6. UI vs Backend/ML Boundary

This document describes the **product UI, content and UX flow**.

Do not invent or modify backend/ML architecture while working on UI unless specifically asked.

The UI will eventually connect to:

- Authentication/backend APIs
- Food database
- Food detection/segmentation
- Classification
- 3D/depth portion estimation
- Nutrition calculation
- Meal logging
- Recommendation system

For UI-only work, use mock data and focus on matching the defined design and flow.
