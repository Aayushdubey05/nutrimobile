-- ============================================================
-- NutriVision 3D
-- Flyway V3 - Add description column to food_category
-- PostgreSQL
-- ============================================================

ALTER TABLE food_category ADD COLUMN description TEXT;

COMMENT ON COLUMN food_category.description IS 'Category description';