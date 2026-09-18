# NutriVision 3D — Backend Project Context

## 1. Overview

**Project:** NutriVision 3D
**Backend:** Spring Boot + PostgreSQL
**Package:** `com.nutrivision.backend`
**API Base:** `/api/v1`
**Architecture:**

```text
React Native/Expo Mobile App
        ↓ REST/JSON
Spring Boot Backend
        ↓
PostgreSQL
        ↓
ML/FastAPI Service (for food analysis)
```

The backend is the main business/data layer. It handles authentication, users, food data, meals, nutrition calculations, analysis results, recommendations, and admin food management.

**Important:** ML should communicate through the backend/API and should not directly access PostgreSQL.

---

## 2. Tech & Conventions

- Java + Spring Boot
- Spring Web / REST
- Spring Data JPA / Hibernate
- PostgreSQL
- JWT authentication
- Access token + refresh token
- DTO-based API layer
- Entity → Repository → Service → Controller structure
- Bean Validation for request DTOs
- Global exception handling
- Swagger/OpenAPI
- Flyway database migration (`V1__init_schema.sql`)
- API responses use:

```json
{
  "success": true,
  "message": "Message",
  "data": {}
}
```

Use existing project patterns before introducing new architecture or dependencies.

---

# 3. Main Modules

```text
auth            → Registration, login, JWT, refresh token
user            → User, profile, settings, weight history
food            → Global food, nutrition, servings, custom food
meal            → Meals and meal items
nutrition       → Daily nutrition and nutrition targets
analysis        → Food image analysis and AI results
recommendation  → Nutrition/goal-based recommendations + feedback
admin           → Admin-specific data such as audit log
common          → Exceptions, API response, validation/utilities
security        → JWT and Spring Security
config           → JPA, Swagger, web configuration
```

Each business module generally follows:

```text
Controller → Service → Repository → Entity
                  ↓
                 DTO
```

Controllers should remain thin; business logic belongs in services.

---

# 4. Authentication & Security

### Roles

```text
USER
ADMIN
```

Normal registration creates a `USER`.

Admin privileges must not be selectable through normal registration.

### Authentication flow

```text
Register/Login
     ↓
Access Token + Refresh Token
     ↓
Access token used for protected APIs
     ↓
Refresh token used to obtain a new access token
```

Important classes:

```text
auth/
  AuthController
  AuthService
  LoginRequest
  RegisterRequest
  RefreshTokenRequest
  AuthResponse

security/
  JwtService
  JwtAuthenticationFilter
  CustomUserDetails
  CustomUserDetailsService
  SecurityConfig
```

Public endpoints:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
```

Swagger/OpenAPI endpoints are also public.

Admin endpoints under:

```text
/api/v1/admin/**
```

require `ADMIN`.

All other application APIs require authentication.

---

# 5. User Module

### Main entities

```text
User
UserProfile
UserSettings
WeightHistory
DietaryRestriction
HealthCondition
RefreshToken
```

### UserProfile contains

- age
- gender
- height
- current weight
- target weight
- activity level
- fitness goal

Fitness goals include:

```text
WEIGHT_LOSS
MUSCLE_GAIN
MAINTAIN_WEIGHT
BODY_RECOMPOSITION
HEALTHY_WEIGHT_GAIN
GENERAL_HEALTH
ATHLETIC_PERFORMANCE
```

Activity levels:

```text
SEDENTARY
LIGHTLY_ACTIVE
MODERATELY_ACTIVE
VERY_ACTIVE
EXTRA_ACTIVE
```

Gender:

```text
MALE
FEMALE
OTHER
PREFER_NOT_TO_SAY
```

Users can have multiple dietary restrictions and multiple health conditions.

Weight history is stored separately from the current profile weight.

---

# 6. Food Module

### Global food structure

```text
Food
 ├── FoodCategory
 ├── FoodNutrition
 └── FoodServing
```

Additional entities:

```text
FoodSearchHistory
CustomFood
CustomFoodReview
```

### Food

Contains basic information such as:

- name
- description
- category
- image URL
- verified status
- timestamps

Food nutrition includes:

```text
calories
protein
carbohydrates
fat
fiber
sugar
saturated fat
sodium
cholesterol
```

### Food APIs

Users can:

- list foods
- search foods
- get food details
- get foods by category
- view recent searches

Admins can:

- create food
- update food
- delete food

Admin food APIs are under:

```text
/api/v1/admin/foods
```

---

# 7. Custom Food

Users can create their own food when it is not available in the global food database.

Flow:

```text
User creates custom food
        ↓
PENDING
        ↓
Admin reviews
     ↙       ↘
APPROVED    REJECTED
```

A custom food can contain its own nutrition and serving information.

Rules:

- Users can manage their own custom foods.
- Approved custom foods cannot be freely modified.
- Rejected custom foods can be updated and submitted again.
- Admin can approve/reject custom foods.
- Approved foods can later be considered for the global food database.

Important entities:

```text
CustomFood
CustomFoodReview
CustomFoodStatus
```

Admin APIs:

```text
/api/v1/admin/custom-foods
```

---

# 8. Meal Module

Main entities:

```text
Meal
MealItem
MealType
```

A meal belongs to one user and can contain multiple items.

```text
Meal
 └── MealItem
       ├── Food OR CustomFood
       └── nutrition snapshot
```

Meal types are represented by `MealType`.

### Important design decision

`MealItem` stores a **snapshot of nutrition values** at the time the food is added.

Snapshot fields include:

```text
caloriesKcal
proteinG
carbohydratesG
fatG
fiberG
sugarG
saturatedFatG
sodiumMg
cholesterolMg
```

This means historical meals do not change if the original Food nutrition data is later edited.

Meal service supports:

```text
Create meal
Get meal
List meals
Get meals by date
Update meal
Delete meal
```

Daily nutrition totals are calculated from MealItem snapshots.

---

# 9. Nutrition Module

Main entity:

```text
NutritionTarget
```

The nutrition module handles:

- calorie target calculation
- macro targets
- target customization
- daily consumed nutrition
- remaining nutrition

Target calculation uses user profile information such as:

```text
age
gender
height
weight
activity level
fitness goal
```

Current implementation uses the **Mifflin-St Jeor equation + activity multiplier + goal-based adjustment**.

Users can manually customize their nutrition target.

Customization creates a **new target record** rather than overwriting historical targets.

Latest target is selected using:

```text
user_id + effective_from DESC
```

Daily nutrition combines:

```text
Nutrition Target
        +
Today's MealItem nutrition snapshots
        ↓
DailyNutritionResponse
```

---

# 10. Analysis Module

Main entities:

```text
FoodAnalysis
FoodAnalysisItem
AiModelResult
ExplainabilityResult
AnalysisStatus
```

Purpose:

```text
Food image
   ↓
ML model
   ↓
Detected foods + confidence + estimated quantity
   ↓
Spring Boot
   ↓
Food database + nutrition
   ↓
Analysis result
```

Analysis status:

```text
PENDING
PROCESSING
COMPLETED
FAILED
```

Current backend has a **dummy AI implementation** for development/testing.

The dummy implementation creates an analysis with:

- detected food
- confidence
- estimated/final weight
- AI model result
- explainability result

Later, the ML/FastAPI service will replace the dummy prediction.

### Current API

```text
POST /api/v1/analysis
GET  /api/v1/analysis
GET  /api/v1/analysis/{analysisId}
PUT  /api/v1/analysis/{analysisId}/items/{itemId}
```

### ML integration rule

ML should return prediction information to Spring Boot.

Spring Boot remains responsible for:

- authentication
- user ownership
- food lookup
- nutrition lookup
- database persistence
- final API response

ML should not directly modify application database records.

---

# 11. Recommendation Module

Main entities:

```text
Recommendation
RecommendationFeedback
```

Recommendation categories:

```text
CALORIES
PROTEIN
CARBOHYDRATES
FAT
MEAL_TIMING
FOOD_CHOICE
HYDRATION
GENERAL_HEALTH
FITNESS
```

Recommendation status:

```text
ACTIVE
EXPIRED
```

Recommendations are generated using:

```text
User Profile
+ Nutrition Target
+ Today's Nutrition
+ Fitness Goal
```

Current rule-based examples include:

- low protein → protein recommendation
- calories near/exceeding target → calorie recommendation
- low fiber → general health recommendation
- otherwise → goal-based fallback recommendation

Maximum generated recommendations per request: **3**.

Previous active recommendations are expired when new recommendations are generated.

Users can give:

```text
LIKE
DISLIKE
```

Feedback is unique per user + recommendation and can be updated.

### API

```text
POST /api/v1/recommendations/generate
GET  /api/v1/recommendations
GET  /api/v1/recommendations/active
POST /api/v1/recommendations/{id}/feedback
```

---

# 12. Admin

Admin is intentionally kept simple for the FYP.

### Current admin functionality

```text
Food management
Custom food review/approval
```

Admin-only URL structure:

```text
/api/v1/admin/**
```

Current important endpoints:

```text
POST   /api/v1/admin/foods
PUT    /api/v1/admin/foods/{foodId}
DELETE /api/v1/admin/foods/{foodId}

GET    /api/v1/admin/custom-foods
GET    /api/v1/admin/custom-foods/{customFoodId}
POST   /api/v1/admin/custom-foods/{customFoodId}/review
GET    /api/v1/admin/custom-foods/{customFoodId}/reviews
```

`AuditLog` entity/repository exists but full audit logging is not currently required.

User management/admin dashboard is intentionally not overbuilt.

---

# 13. Common API & Error Handling

All APIs should follow the existing `ApiResponse<T>` format.

Example:

```json
{
  "success": true,
  "message": "Meal created successfully",
  "data": {}
}
```

Global exception handling is implemented in:

```text
common/exception/GlobalExceptionHandler
```

Existing handled cases include:

```text
EmailAlreadyExistsException       → 409
InvalidRefreshTokenException      → 401
BadCredentialsException           → 401
UserProfileNotFoundException      → 404
UserSettingsNotFoundException     → 404
MethodArgumentNotValidException   → 400
IllegalArgumentException          → 400
Unexpected exceptions              → 500
```

Use existing exceptions/response patterns instead of creating duplicate error handling.

---

# 14. Database & Relationships

PostgreSQL schema is maintained through:

```text
src/main/resources/db/migration/V1__init_schema.sql
```

Important relationships:

```text
User
 ├── UserProfile
 ├── UserSettings
 ├── WeightHistory
 ├── RefreshToken
 ├── Meal
 ├── FoodSearchHistory
 ├── CustomFood
 ├── FoodAnalysis
 ├── NutritionTarget
 └── Recommendation

Food
 ├── FoodCategory
 ├── FoodNutrition
 ├── FoodServing
 └── MealItem

CustomFood
 ├── CustomFoodReview
 └── MealItem

Meal
 └── MealItem

FoodAnalysis
 ├── FoodAnalysisItem
 ├── AiModelResult
 └── ExplainabilityResult

Recommendation
 └── RecommendationFeedback
```

Database constraints, foreign keys, indexes and enum mappings already exist in the schema/entities. **Check the existing entity + migration before changing relationships.**

---

# 15. Package Structure

```text
com.nutrivision.backend
├── admin
├── analysis
├── auth
├── common
├── config
├── food
├── meal
├── nutrition
├── recommendation
├── security
└── user
```

Most business modules use:

```text
controller/
dto/
entity/
repository/
service/
```

Do not create unnecessary layers or packages.

---

# 16. Current Backend Status

Completed and manually tested:

```text
AUTH             ✓
USER/PROFILE     ✓
FOOD             ✓
CUSTOM FOOD      ✓
MEAL             ✓
NUTRITION        ✓
ANALYSIS         ✓ (dummy AI)
RECOMMENDATION   ✓
ADMIN            ✓
```

The backend is currently considered **feature-complete for the FYP**.

Remaining work is mainly:

```text
Frontend ↔ Backend integration
        +
Real ML/FastAPI integration
        +
End-to-end testing
        +
Small bug fixes/polish
```

Do not add large new backend features unless a real project requirement needs them.

---

# 17. Development Principles

When modifying this backend:

1. **Keep the architecture simple.**
2. Reuse existing entities, DTOs, repositories and services where possible.
3. Do not duplicate business logic.
4. Controllers should be thin.
5. Business logic belongs in services.
6. Use DTOs for API input/output instead of exposing entities directly.
7. Validate request DTOs.
8. Respect authenticated user ownership.
9. Keep `/admin/**` endpoints protected by `ADMIN`.
10. Do not let ML access PostgreSQL directly.
11. Preserve historical meal nutrition snapshots.
12. Prefer small changes over unnecessary refactoring.
13. Do not introduce new dependencies without a clear need.
14. Check existing code/schema before creating a new class.
15. For this FYP, prioritize **correctness + maintainability + integration speed** over overengineering.

---

# 18. Backend ↔ Mobile ↔ ML Responsibilities

```text
┌─────────────────────┐
│ React Native Mobile │
│ UI + user actions   │
└──────────┬──────────┘
           │ REST/JSON
           ↓
┌─────────────────────┐
│ Spring Boot         │
│ Auth                │
│ Business logic      │
│ Validation          │
│ Nutrition           │
│ Food/Meal data      │
│ Recommendations     │
│ Database access     │
└───────┬─────────┬───┘
        │         │
        │         ↓
        │   ┌──────────────┐
        │   │ ML / FastAPI │
        │   │ Food analysis│
        │   └──────────────┘
        │
        ↓
┌─────────────────────┐
│ PostgreSQL           │
│ Persistent data      │
└─────────────────────┘
```

**Source of truth:** Spring Boot + PostgreSQL.

**ML responsibility:** prediction/analysis.

**Mobile responsibility:** presentation and user interaction.

---

# 19. Important Rule for AI Coding Tools

Before changing backend code, an AI should:

```text
1. Read this file.
2. Inspect the existing related module.
3. Check existing entity/repository/service/controller/DTO patterns.
4. Check V1__init_schema.sql if database structure is involved.
5. Reuse existing code where possible.
6. Make the smallest correct change.
7. Do not redesign unrelated modules.
```

The backend is already structured and feature-complete. New code should fit the existing architecture rather than introducing a new architecture.
