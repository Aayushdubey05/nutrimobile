# NutriVision-3D — Backend Architecture & Context

## 1. Overview & Stack

- **Framework**: Spring Boot 3.x (Java 17 / 21)
- **Database**: PostgreSQL 14+ with Flyway schema migration (`V1__init_schema.sql`)
- **Base Endpoint**: `/api/v1`
- **Security**: Spring Security + JWT (Access Token + Refresh Token rotation)
- **Documentation**: Swagger / OpenAPI UI (`/swagger-ui/index.html`)

---

## 2. Core Modules & Architecture

The codebase follows the strict layered architecture pattern:
`Controller → Service → Repository → Entity` paired with DTOs.

```text
com.nutrivision.backend/
├── auth           # Register, login, token refresh
├── user           # User account, UserProfile, UserSettings, WeightHistory
├── food           # Global foods, nutrition database, custom foods
├── meal           # Daily meals and meal items
├── nutrition      # Daily nutrition summary & target calculation (Mifflin-St Jeor)
├── analysis       # Food image analysis (FastAPI ML integration / fallback mock)
├── recommendation # Goal & restriction-based recommendations + user feedback
├── admin          # Admin management & audit log
├── common         # Global exception handler, standard ApiResponse DTO, validation
├── security       # JWT authentication filter, user details, SecurityConfig
└── config         # JPA, Web CORS, and Swagger OpenAPI configurations
```

---

## 3. Database Schema Overview (`V1__init_schema.sql`)

The database consists of the following core tables:

1. **`users`**: Stores user authentication credentials, role (`USER`, `ADMIN`), name, and email.
2. **`user_profile`**: Stores age, gender, height, current weight, target weight, activity level, and fitness goal.
3. **`user_settings`**: Notification and app preferences.
4. **`dietary_restrictions` & `health_conditions`**: Lookup tables for user dietary restrictions (Vegetarian, Vegan, etc.) and health conditions (Diabetes, etc.).
5. **`weight_history`**: Tracks weight logs over time.
6. **`foods`**: Global food item repository with macro/micro nutritional values per 100g.
7. **`servings`**: Unit serving definitions for food items (e.g. 1 cup, 1 bowl, 1 piece).
8. **`meals` & `meal_items`**: Logged meals associated with users by date and meal type (`BREAKFAST`, `LUNCH`, `DINNER`, `SNACK`).
9. **`nutrition_targets`**: Computed daily target for calories, protein, carbs, and fat.
10. **`food_analyses` & `analysis_items`**: Image analysis results and portion estimates.
11. **`recommendations` & `recommendation_feedback`**: System generated suggestions and user ratings.

---

## 4. Nutrition Target Calculation (Mifflin-St Jeor)

Daily calorie targets are calculated using the **Mifflin-St Jeor Equation**:

- **Male BMR**: `10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5`
- **Female BMR**: `10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161`
- **Total Daily Energy Expenditure (TDEE)**: `BMR * ActivityMultiplier`
  - *Sedentary*: 1.20 | *Lightly Active*: 1.375 | *Moderately Active*: 1.55 | *Very Active*: 1.725 | *Extra Active*: 1.90
- **Goal Adjustment**:
  - *Weight Loss*: 85% of TDEE (-15%)
  - *Muscle Gain / Weight Gain*: 110% of TDEE (+10%)
  - *Maintain Weight / Health*: 100% of TDEE

Macros are assigned:
- **Protein**: 1.2g to 1.6g per kg of body weight based on goal.
- **Fat**: 25% of target calories.
- **Carbohydrates**: Remaining calories divided by 4.

---

## 5. Standardized API Response & Exception Handling

All API endpoints return a uniform response envelope:

```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": { ... }
}
```

Global errors are handled by `GlobalExceptionHandler`:
- `400 Bad Request`: Validation errors or illegal arguments.
- `401 Unauthorized`: Bad credentials or invalid refresh token.
- `404 Not Found`: Profile or settings resource not found (`UserProfileNotFoundException`).
- `409 Conflict`: Email already registered.

---

## 6. AI/ML Integration Status

> ℹ️ **Status Note**: The Python/FastAPI ML Service for automated 3D food volume estimation is currently **under active development**. 
> The `analysis` module (`FoodAnalysisService`) is structured with clean interfaces so it can seamlessly invoke the FastAPI microservice endpoint when deployed, currently returning structured mock recognition results during development.
