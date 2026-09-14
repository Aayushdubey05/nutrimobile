-- ============================================================
-- NutriVision 3D
-- Flyway V1 - Initial Database Schema
-- PostgreSQL
--
-- Total tables: 26
-- ============================================================


-- ============================================================
-- 1. ENUM TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM (
    'USER',
    'ADMIN'
);

CREATE TYPE gender_type AS ENUM (
    'MALE',
    'FEMALE',
    'OTHER',
    'PREFER_NOT_TO_SAY'
);

CREATE TYPE fitness_goal_type AS ENUM (
    'WEIGHT_LOSS',
    'MUSCLE_GAIN',
    'MAINTAIN_WEIGHT',
    'BODY_RECOMPOSITION',
    'HEALTHY_WEIGHT_GAIN',
    'GENERAL_HEALTH',
    'ATHLETIC_PERFORMANCE'
);

CREATE TYPE activity_level_type AS ENUM (
    'SEDENTARY',
    'LIGHTLY_ACTIVE',
    'MODERATELY_ACTIVE',
    'VERY_ACTIVE',
    'EXTRA_ACTIVE'
);

CREATE TYPE meal_type AS ENUM (
    'BREAKFAST',
    'LUNCH',
    'DINNER',
    'SNACK',
    'OTHER'
);

CREATE TYPE custom_food_status AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);

CREATE TYPE analysis_status AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED'
);

CREATE TYPE recommendation_category AS ENUM (
    'CALORIES',
    'PROTEIN',
    'CARBOHYDRATES',
    'FAT',
    'MEAL_TIMING',
    'FOOD_CHOICE',
    'HYDRATION',
    'GENERAL_HEALTH',
    'FITNESS'
);

-- The PDF names this type but does not specify its values.
-- V1 implementation decision:
CREATE TYPE recommendation_status AS ENUM (
    'ACTIVE',
    'EXPIRED'
);

CREATE TYPE recommendation_feedback_type AS ENUM (
    'LIKE',
    'DISLIKE'
);


-- ============================================================
-- 2. USERS
-- ============================================================

CREATE TABLE users (
                       id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                       name VARCHAR(100) NOT NULL,

                       email VARCHAR(320) NOT NULL,

                       password_hash VARCHAR(255) NOT NULL,

                       role user_role NOT NULL DEFAULT 'USER',

                       is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

                       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                       updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Case-insensitive email uniqueness
CREATE UNIQUE INDEX ux_users_email_lower
    ON users (LOWER(email));

CREATE INDEX idx_users_role
    ON users (role);

CREATE INDEX idx_users_is_deleted
    ON users (is_deleted);


-- ============================================================
-- 3. USER_PROFILE
-- ============================================================

CREATE TABLE user_profile (
                              id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                              user_id BIGINT NOT NULL,

                              age SMALLINT NOT NULL,

                              gender gender_type NOT NULL,

                              height_cm NUMERIC(5,2) NOT NULL,

                              current_weight_kg NUMERIC(6,2) NOT NULL,

                              target_weight_kg NUMERIC(6,2),

                              fitness_goal fitness_goal_type NOT NULL,

                              activity_level activity_level_type NOT NULL,

                              created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                              updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                              CONSTRAINT uq_user_profile_user
                                  UNIQUE (user_id),

                              CONSTRAINT fk_user_profile_user
                                  FOREIGN KEY (user_id)
                                      REFERENCES users(id)
                                      ON DELETE CASCADE,

                              CONSTRAINT chk_user_profile_age
                                  CHECK (age > 0 AND age <= 120),

                              CONSTRAINT chk_user_profile_height
                                  CHECK (height_cm > 0 AND height_cm <= 300),

                              CONSTRAINT chk_user_profile_current_weight
                                  CHECK (
                                      current_weight_kg > 0
                                          AND current_weight_kg <= 500
                                      ),

                              CONSTRAINT chk_user_profile_target_weight
                                  CHECK (
                                      target_weight_kg IS NULL
                                          OR (
                                          target_weight_kg > 0
                                              AND target_weight_kg <= 500
                                          )
                                      )
);


-- ============================================================
-- 4. DIETARY_RESTRICTION
-- ============================================================

CREATE TABLE dietary_restriction (
                                     id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                                     name VARCHAR(50) NOT NULL,

                                     CONSTRAINT uq_dietary_restriction_name
                                         UNIQUE (name)
);


-- ============================================================
-- 5. USER_DIETARY_RESTRICTION
-- ============================================================

CREATE TABLE user_dietary_restriction (
                                          user_id BIGINT NOT NULL,

                                          restriction_id BIGINT NOT NULL,

                                          PRIMARY KEY (user_id, restriction_id),

                                          CONSTRAINT fk_user_dietary_restriction_user
                                              FOREIGN KEY (user_id)
                                                  REFERENCES users(id)
                                                  ON DELETE CASCADE,

                                          CONSTRAINT fk_user_dietary_restriction_restriction
                                              FOREIGN KEY (restriction_id)
                                                  REFERENCES dietary_restriction(id)
                                                  ON DELETE RESTRICT
);


-- ============================================================
-- 6. HEALTH_CONDITION
-- ============================================================

CREATE TABLE health_condition (
                                  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                                  name VARCHAR(100) NOT NULL,

                                  CONSTRAINT uq_health_condition_name
                                      UNIQUE (name)
);


-- ============================================================
-- 7. USER_HEALTH_CONDITION
-- ============================================================

CREATE TABLE user_health_condition (
                                       user_id BIGINT NOT NULL,

                                       condition_id BIGINT NOT NULL,

                                       PRIMARY KEY (user_id, condition_id),

                                       CONSTRAINT fk_user_health_condition_user
                                           FOREIGN KEY (user_id)
                                               REFERENCES users(id)
                                               ON DELETE CASCADE,

                                       CONSTRAINT fk_user_health_condition_condition
                                           FOREIGN KEY (condition_id)
                                               REFERENCES health_condition(id)
                                               ON DELETE RESTRICT
);


-- ============================================================
-- 8. WEIGHT_HISTORY
-- ============================================================

CREATE TABLE weight_history (
                                id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                                user_id BIGINT NOT NULL,

                                weight_kg NUMERIC(6,2) NOT NULL,

                                recorded_at TIMESTAMPTZ NOT NULL,

                                CONSTRAINT fk_weight_history_user
                                    FOREIGN KEY (user_id)
                                        REFERENCES users(id)
                                        ON DELETE CASCADE,

                                CONSTRAINT chk_weight_history_weight
                                    CHECK (
                                        weight_kg > 0
                                            AND weight_kg <= 500
                                        )
);

CREATE INDEX idx_weight_history_user_recorded_at
    ON weight_history (user_id, recorded_at DESC);


-- ============================================================
-- 9. REFRESH_TOKEN
-- ============================================================

CREATE TABLE refresh_token (
                               id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                               user_id BIGINT NOT NULL,

                               token_hash VARCHAR(255) NOT NULL,

                               expires_at TIMESTAMPTZ NOT NULL,

                               created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                               revoked_at TIMESTAMPTZ,

                               CONSTRAINT uq_refresh_token_hash
                                   UNIQUE (token_hash),

                               CONSTRAINT fk_refresh_token_user
                                   FOREIGN KEY (user_id)
                                       REFERENCES users(id)
                                       ON DELETE CASCADE
);

CREATE INDEX idx_refresh_token_user
    ON refresh_token (user_id);

CREATE INDEX idx_refresh_token_expires_at
    ON refresh_token (expires_at);


-- ============================================================
-- 10. FOOD_CATEGORY
-- ============================================================

CREATE TABLE food_category (
                               id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                               name VARCHAR(100) NOT NULL,

                               CONSTRAINT uq_food_category_name
                                   UNIQUE (name)
);


-- ============================================================
-- 11. FOOD
-- ============================================================

CREATE TABLE food (
                      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                      name VARCHAR(150) NOT NULL,

                      description TEXT,

                      category_id BIGINT NOT NULL,

                      image_url TEXT,

                      is_verified BOOLEAN NOT NULL,

                      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                      CONSTRAINT fk_food_category
                          FOREIGN KEY (category_id)
                              REFERENCES food_category(id)
                              ON DELETE RESTRICT
);

CREATE INDEX idx_food_category_id
    ON food (category_id);

CREATE INDEX idx_food_name
    ON food (name);


-- ============================================================
-- 12. FOOD_NUTRITION
-- ============================================================

CREATE TABLE food_nutrition (
                                id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                                food_id BIGINT NOT NULL,

                                calories_kcal NUMERIC(8,2) NOT NULL,

                                protein_g NUMERIC(8,2) NOT NULL,

                                carbohydrates_g NUMERIC(8,2) NOT NULL,

                                fat_g NUMERIC(8,2) NOT NULL,

                                fiber_g NUMERIC(8,2) NOT NULL,

                                sugar_g NUMERIC(8,2) NOT NULL,

                                saturated_fat_g NUMERIC(8,2) NOT NULL,

                                sodium_mg NUMERIC(10,2) NOT NULL,

                                cholesterol_mg NUMERIC(10,2) NOT NULL,

                                CONSTRAINT uq_food_nutrition_food
                                    UNIQUE (food_id),

                                CONSTRAINT fk_food_nutrition_food
                                    FOREIGN KEY (food_id)
                                        REFERENCES food(id)
                                        ON DELETE CASCADE,

                                CONSTRAINT chk_food_nutrition_values
                                    CHECK (
                                        calories_kcal >= 0
                                            AND protein_g >= 0
                                            AND carbohydrates_g >= 0
                                            AND fat_g >= 0
                                            AND fiber_g >= 0
                                            AND sugar_g >= 0
                                            AND saturated_fat_g >= 0
                                            AND sodium_mg >= 0
                                            AND cholesterol_mg >= 0
                                        )
);


-- ============================================================
-- 13. FOOD_SERVING
-- ============================================================

CREATE TABLE food_serving (
                              id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                              food_id BIGINT NOT NULL,

                              serving_name VARCHAR(100) NOT NULL,

                              weight_g NUMERIC(7,2) NOT NULL,

                              CONSTRAINT fk_food_serving_food
                                  FOREIGN KEY (food_id)
                                      REFERENCES food(id)
                                      ON DELETE CASCADE,

                              CONSTRAINT chk_food_serving_weight
                                  CHECK (
                                      weight_g > 0
                                      )
);

CREATE INDEX idx_food_serving_food
    ON food_serving (food_id);


-- ============================================================
-- 14. CUSTOM_FOOD
-- ============================================================

CREATE TABLE custom_food (
                             id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                             user_id BIGINT NOT NULL,

                             name VARCHAR(150) NOT NULL,

                             image_url TEXT,

                             calories_kcal NUMERIC(8,2) NOT NULL,

                             protein_g NUMERIC(8,2) NOT NULL,

                             carbohydrates_g NUMERIC(8,2) NOT NULL,

                             fat_g NUMERIC(8,2) NOT NULL,

                             fiber_g NUMERIC(8,2) NOT NULL,

                             sugar_g NUMERIC(8,2) NOT NULL,

                             saturated_fat_g NUMERIC(8,2) NOT NULL,

                             sodium_mg NUMERIC(10,2) NOT NULL,

                             cholesterol_mg NUMERIC(10,2) NOT NULL,

                             serving_size_g NUMERIC(7,2) NOT NULL,

                             status custom_food_status NOT NULL DEFAULT 'PENDING',

                             created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                             updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                             CONSTRAINT fk_custom_food_user
                                 FOREIGN KEY (user_id)
                                     REFERENCES users(id)
                                     ON DELETE RESTRICT,

                             CONSTRAINT chk_custom_food_nutrition
                                 CHECK (
                                     calories_kcal >= 0
                                         AND protein_g >= 0
                                         AND carbohydrates_g >= 0
                                         AND fat_g >= 0
                                         AND fiber_g >= 0
                                         AND sugar_g >= 0
                                         AND saturated_fat_g >= 0
                                         AND sodium_mg >= 0
                                         AND cholesterol_mg >= 0
                                     ),

                             CONSTRAINT chk_custom_food_serving_size
                                 CHECK (
                                     serving_size_g > 0
                                     )
);

CREATE INDEX idx_custom_food_user
    ON custom_food (user_id);

CREATE INDEX idx_custom_food_status
    ON custom_food (status);

CREATE INDEX idx_custom_food_status_created_at
    ON custom_food (status, created_at DESC);


-- ============================================================
-- 15. MEAL
-- ============================================================

CREATE TABLE meal (
                      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                      user_id BIGINT NOT NULL,

                      meal_type meal_type NOT NULL,

                      meal_date DATE NOT NULL,

                      meal_time TIME NOT NULL,

                      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                      CONSTRAINT fk_meal_user
                          FOREIGN KEY (user_id)
                              REFERENCES users(id)
                              ON DELETE CASCADE
);

CREATE INDEX idx_meal_user_date
    ON meal (user_id, meal_date DESC);

CREATE INDEX idx_meal_user_date_time
    ON meal (user_id, meal_date, meal_time);


-- ============================================================
-- 16. MEAL_ITEM
-- ============================================================

CREATE TABLE meal_item (
                           id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                           meal_id BIGINT NOT NULL,

                           food_id BIGINT,

                           custom_food_id BIGINT,

                           quantity NUMERIC(8,2) NOT NULL,

                           weight_g NUMERIC(8,2) NOT NULL,

                           calories_kcal NUMERIC(10,2) NOT NULL,

                           protein_g NUMERIC(10,2) NOT NULL,

                           carbohydrates_g NUMERIC(10,2) NOT NULL,

                           fat_g NUMERIC(10,2) NOT NULL,

                           fiber_g NUMERIC(10,2) NOT NULL,

                           sugar_g NUMERIC(10,2) NOT NULL,

                           saturated_fat_g NUMERIC(10,2) NOT NULL,

                           sodium_mg NUMERIC(10,2) NOT NULL,

                           cholesterol_mg NUMERIC(10,2) NOT NULL,

                           created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                           CONSTRAINT fk_meal_item_meal
                               FOREIGN KEY (meal_id)
                                   REFERENCES meal(id)
                                   ON DELETE CASCADE,

                           CONSTRAINT fk_meal_item_food
                               FOREIGN KEY (food_id)
                                   REFERENCES food(id)
                                   ON DELETE RESTRICT,

                           CONSTRAINT fk_meal_item_custom_food
                               FOREIGN KEY (custom_food_id)
                                   REFERENCES custom_food(id)
                                   ON DELETE RESTRICT,

                           CONSTRAINT chk_meal_item_exactly_one_source
                               CHECK (
                                   (food_id IS NOT NULL AND custom_food_id IS NULL)
                                       OR
                                   (food_id IS NULL AND custom_food_id IS NOT NULL)
                                   ),

                           CONSTRAINT chk_meal_item_quantity
                               CHECK (
                                   quantity > 0
                                   ),

                           CONSTRAINT chk_meal_item_weight
                               CHECK (
                                   weight_g > 0
                                   ),

                           CONSTRAINT chk_meal_item_nutrition
                               CHECK (
                                   calories_kcal >= 0
                                       AND protein_g >= 0
                                       AND carbohydrates_g >= 0
                                       AND fat_g >= 0
                                       AND fiber_g >= 0
                                       AND sugar_g >= 0
                                       AND saturated_fat_g >= 0
                                       AND sodium_mg >= 0
                                       AND cholesterol_mg >= 0
                                   )
);

CREATE INDEX idx_meal_item_meal
    ON meal_item (meal_id);

CREATE INDEX idx_meal_item_food
    ON meal_item (food_id);

CREATE INDEX idx_meal_item_custom_food
    ON meal_item (custom_food_id);


-- ============================================================
-- 17. FOOD_ANALYSIS
-- ============================================================

CREATE TABLE food_analysis (
                               id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                               user_id BIGINT NOT NULL,

                               image_url TEXT NOT NULL,

                               status analysis_status NOT NULL,

                               created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                               completed_at TIMESTAMPTZ,

                               CONSTRAINT fk_food_analysis_user
                                   FOREIGN KEY (user_id)
                                       REFERENCES users(id)
                                       ON DELETE CASCADE
);

CREATE INDEX idx_food_analysis_user_created_at
    ON food_analysis (user_id, created_at DESC);

CREATE INDEX idx_food_analysis_status
    ON food_analysis (status);


-- ============================================================
-- 18. FOOD_ANALYSIS_ITEM
-- ============================================================

CREATE TABLE food_analysis_item (
                                    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                                    analysis_id BIGINT NOT NULL,

                                    food_id BIGINT NOT NULL,

                                    detected_name VARCHAR(150) NOT NULL,

                                    confidence NUMERIC(5,4) NOT NULL,

                                    estimated_weight_g NUMERIC(8,2) NOT NULL,

                                    final_weight_g NUMERIC(8,2) NOT NULL,

                                    final_food_id BIGINT,

                                    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                    CONSTRAINT fk_food_analysis_item_analysis
                                        FOREIGN KEY (analysis_id)
                                            REFERENCES food_analysis(id)
                                            ON DELETE CASCADE,

                                    CONSTRAINT fk_food_analysis_item_food
                                        FOREIGN KEY (food_id)
                                            REFERENCES food(id)
                                            ON DELETE RESTRICT,

                                    CONSTRAINT fk_food_analysis_item_final_food
                                        FOREIGN KEY (final_food_id)
                                            REFERENCES food(id)
                                            ON DELETE RESTRICT,

                                    CONSTRAINT chk_food_analysis_item_confidence
                                        CHECK (
                                            confidence >= 0
                                                AND confidence <= 1
                                            ),

                                    CONSTRAINT chk_food_analysis_item_estimated_weight
                                        CHECK (
                                            estimated_weight_g > 0
                                            ),

                                    CONSTRAINT chk_food_analysis_item_final_weight
                                        CHECK (
                                            final_weight_g > 0
                                            )
);

CREATE INDEX idx_food_analysis_item_analysis
    ON food_analysis_item (analysis_id);

CREATE INDEX idx_food_analysis_item_food
    ON food_analysis_item (food_id);

CREATE INDEX idx_food_analysis_item_final_food
    ON food_analysis_item (final_food_id);


-- ============================================================
-- 19. EXPLAINABILITY_RESULT
-- ============================================================

CREATE TABLE explainability_result (
                                       id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                                       analysis_item_id BIGINT NOT NULL,

                                       heatmap_url TEXT,

                                       caption TEXT,

                                       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                       CONSTRAINT uq_explainability_result_analysis_item
                                           UNIQUE (analysis_item_id),

                                       CONSTRAINT fk_explainability_result_analysis_item
                                           FOREIGN KEY (analysis_item_id)
                                               REFERENCES food_analysis_item(id)
                                               ON DELETE CASCADE
);


-- ============================================================
-- 20. AI_MODEL_RESULT
-- ============================================================

CREATE TABLE ai_model_result (
                                 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                                 analysis_item_id BIGINT NOT NULL,

                                 model_name VARCHAR(100) NOT NULL,

                                 model_version VARCHAR(50) NOT NULL,

                                 confidence NUMERIC(5,4) NOT NULL,

                                 processing_time_ms INTEGER NOT NULL,

                                 created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                 CONSTRAINT fk_ai_model_result_analysis_item
                                     FOREIGN KEY (analysis_item_id)
                                         REFERENCES food_analysis_item(id)
                                         ON DELETE CASCADE,

                                 CONSTRAINT chk_ai_model_result_confidence
                                     CHECK (
                                         confidence >= 0
                                             AND confidence <= 1
                                         ),

                                 CONSTRAINT chk_ai_model_result_processing_time
                                     CHECK (
                                         processing_time_ms >= 0
                                         )
);

CREATE INDEX idx_ai_model_result_analysis_item
    ON ai_model_result (analysis_item_id);

CREATE INDEX idx_ai_model_result_model
    ON ai_model_result (model_name, model_version);


-- ============================================================
-- 21. RECOMMENDATION
-- ============================================================

CREATE TABLE recommendation (
                                id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                                user_id BIGINT NOT NULL,

                                title VARCHAR(200) NOT NULL,

                                description TEXT NOT NULL,

                                reason TEXT NOT NULL,

                                category recommendation_category NOT NULL,

                                status recommendation_status NOT NULL,

                                generated_at TIMESTAMPTZ NOT NULL,

                                expires_at TIMESTAMPTZ,

                                CONSTRAINT fk_recommendation_user
                                    FOREIGN KEY (user_id)
                                        REFERENCES users(id)
                                        ON DELETE CASCADE,

                                CONSTRAINT chk_recommendation_expiry
                                    CHECK (
                                        expires_at IS NULL
                                            OR expires_at >= generated_at
                                        )
);

CREATE INDEX idx_recommendation_user_generated_at
    ON recommendation (user_id, generated_at DESC);

CREATE INDEX idx_recommendation_user_status
    ON recommendation (user_id, status);


-- ============================================================
-- 22. RECOMMENDATION_FEEDBACK
-- ============================================================

CREATE TABLE recommendation_feedback (
                                         id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                                         recommendation_id BIGINT NOT NULL,

                                         user_id BIGINT NOT NULL,

                                         feedback recommendation_feedback_type NOT NULL,

                                         created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                         CONSTRAINT uq_recommendation_feedback_user
                                             UNIQUE (recommendation_id, user_id),

                                         CONSTRAINT fk_recommendation_feedback_recommendation
                                             FOREIGN KEY (recommendation_id)
                                                 REFERENCES recommendation(id)
                                                 ON DELETE CASCADE,

                                         CONSTRAINT fk_recommendation_feedback_user
                                             FOREIGN KEY (user_id)
                                                 REFERENCES users(id)
                                                 ON DELETE CASCADE
);

CREATE INDEX idx_recommendation_feedback_user
    ON recommendation_feedback (user_id);

CREATE INDEX idx_recommendation_feedback_recommendation
    ON recommendation_feedback (recommendation_id);


-- ============================================================
-- 23. FOOD_SEARCH_HISTORY
-- ============================================================

CREATE TABLE food_search_history (
                                     id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                                     user_id BIGINT NOT NULL,

                                     food_id BIGINT NOT NULL,

                                     searched_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                     CONSTRAINT uq_food_search_history_user_food
                                         UNIQUE (user_id, food_id),

                                     CONSTRAINT fk_food_search_history_user
                                         FOREIGN KEY (user_id)
                                             REFERENCES users(id)
                                             ON DELETE CASCADE,

                                     CONSTRAINT fk_food_search_history_food
                                         FOREIGN KEY (food_id)
                                             REFERENCES food(id)
                                             ON DELETE RESTRICT
);

CREATE INDEX idx_food_search_history_user_searched_at
    ON food_search_history (user_id, searched_at DESC);


-- ============================================================
-- 24. USER_SETTINGS
-- ============================================================

CREATE TABLE user_settings (
                               id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                               user_id BIGINT NOT NULL,

                               notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,

                               created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                               updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                               CONSTRAINT uq_user_settings_user
                                   UNIQUE (user_id),

                               CONSTRAINT fk_user_settings_user
                                   FOREIGN KEY (user_id)
                                       REFERENCES users(id)
                                       ON DELETE CASCADE
);


-- ============================================================
-- 25. CUSTOM_FOOD_REVIEW
-- ============================================================

CREATE TABLE custom_food_review (
                                    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                                    custom_food_id BIGINT NOT NULL,

                                    admin_id BIGINT NOT NULL,

                                    status custom_food_status NOT NULL,

                                    comment TEXT,

                                    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                    CONSTRAINT fk_custom_food_review_custom_food
                                        FOREIGN KEY (custom_food_id)
                                            REFERENCES custom_food(id)
                                            ON DELETE CASCADE,

                                    CONSTRAINT fk_custom_food_review_admin
                                        FOREIGN KEY (admin_id)
                                            REFERENCES users(id)
                                            ON DELETE RESTRICT
);

CREATE INDEX idx_custom_food_review_custom_food
    ON custom_food_review (custom_food_id);

CREATE INDEX idx_custom_food_review_admin
    ON custom_food_review (admin_id);

CREATE INDEX idx_custom_food_review_reviewed_at
    ON custom_food_review (reviewed_at DESC);


-- ============================================================
-- 26. AUDIT_LOG
-- ============================================================

CREATE TABLE audit_log (
                           id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                           admin_id BIGINT NOT NULL,

                           action VARCHAR(100) NOT NULL,

                           entity_type VARCHAR(100) NOT NULL,

                           entity_id BIGINT NOT NULL,

                           description TEXT,

                           created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                           CONSTRAINT fk_audit_log_admin
                               FOREIGN KEY (admin_id)
                                   REFERENCES users(id)
                                   ON DELETE RESTRICT
);

CREATE INDEX idx_audit_log_admin_created_at
    ON audit_log (admin_id, created_at DESC);

CREATE INDEX idx_audit_log_entity
    ON audit_log (entity_type, entity_id);

CREATE INDEX idx_audit_log_created_at
    ON audit_log (created_at DESC);


-- ============================================================
-- 27. NUTRITION_TARGET
-- ============================================================

CREATE TABLE nutrition_target (
                                  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                                  user_id BIGINT NOT NULL,

                                  calorie_target_kcal NUMERIC(8,2) NOT NULL,

                                  protein_target_g NUMERIC(8,2) NOT NULL,

                                  carbohydrate_target_g NUMERIC(8,2) NOT NULL,

                                  fat_target_g NUMERIC(8,2) NOT NULL,

                                  calculation_method VARCHAR(100) NOT NULL,

                                  is_customized BOOLEAN NOT NULL,

                                  effective_from TIMESTAMPTZ NOT NULL,

                                  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                  CONSTRAINT fk_nutrition_target_user
                                      FOREIGN KEY (user_id)
                                          REFERENCES users(id)
                                          ON DELETE CASCADE,

                                  CONSTRAINT chk_nutrition_target_values
                                      CHECK (
                                          calorie_target_kcal >= 0
                                              AND protein_target_g >= 0
                                              AND carbohydrate_target_g >= 0
                                              AND fat_target_g >= 0
                                          )
);

CREATE INDEX idx_nutrition_target_user_effective_from
    ON nutrition_target (user_id, effective_from DESC);


-- ============================================================
-- END OF V1
-- ============================================================