# NutriVision-3D 🥗📸

> **NutriVision-3D** is a next-generation mobile nutrition and dietary tracking application designed to simplify food logging using computer vision and portion estimation. Built with a modern, high-performance tech stack (React Native / Expo + Spring Boot + PostgreSQL), it empowers users to track daily macros, receive personalized dietary advice, and monitor health goals effortlessly.

---

## 📌 Project Overview

Traditional calorie tracking apps rely heavily on manual search and tedious weight measurements. **NutriVision-3D** aims to revolutionize this experience by combining instant visual scanning with intelligent nutritional analysis.

### Key Capabilities
- **Visual Food Scanning**: Capture food photos for automated recognition and volume-based calorie estimation *(ML engine currently in development)*.
- **Smart Macro & Calorie Tracking**: Real-time breakdown of daily Calories, Protein, Carbohydrates, and Fats.
- **Personalized Target Calculation**: Automatic calculation of daily target calories and macros using standard formulas (Mifflin-St Jeor equation) tailored to user age, weight, height, activity level, and fitness goals.
- **Dietary & Health Customization**: Tailored preferences for dietary restrictions (Vegetarian, Vegan, Gluten-Free, etc.) and health conditions (Diabetes, Hypertension, etc.).
- **Smart Recommendations**: Rule-based dietary insights and suggestions aligned with user goals.
- **Progress Analytics**: Periodical progress summary and weight history tracking.

> 🛠 **ML Service Status Note**: The dedicated Python/FastAPI 3D AI/ML service for food image analysis and volume estimation is **under active development** by our team and will be integrated soon. The app currently uses simulated analysis logic for end-to-end user testing and demonstration.

---

## 🏗 System Architecture

The project is architected as a modular, multi-tier system:

```text
📱 React Native Mobile App (Expo SDK 57)
         │  REST / JSON (JWT Authentication)
         ▼
☕ Spring Boot Backend Service (Java 17/21 + PostgreSQL 15)
         │  HTTP Integration (Planned)
         ▼
🐍 Python/FastAPI ML Microservice (Under Active Development)
```

1. **Mobile Frontend (`/mobile`)**: Built with React Native & Expo Router. Features a clean, minimal design system and 5-item main navigation.
2. **Backend API (`/backend`)**: Java Spring Boot microservice handling core business logic, user auth, food database, daily logs, and nutrition target calculations.
3. **ML Microservice (`/ml-service`)**: Python-based AI service *(In Development)* dedicated to 3D mesh reconstruction, food detection, and volume estimation.

---

## 💻 Tech Stack & Prerequisites

### Technical Stack
| Tier | Technology / Library |
| :--- | :--- |
| **Mobile App** | React Native 0.86, Expo SDK 57, Expo Router, TypeScript 6.0, Axios, TanStack Query |
| **Backend API** | Java 17 / 21, Spring Boot 3.x, Spring Security, Spring Data JPA, Hibernate, Swagger |
| **Database** | PostgreSQL 14+, Flyway Schema Migrations |
| **ML Service** | Python 3.10+, FastAPI *(Under Active Development)* |

### Prerequisites & Required Tools
Before running the project locally, ensure you have the following installed on your machine:

- **Node.js**: `v18.x` or `v20.x LTS` (Recommended)
- **npm**: `v9.x` or `v10.x`
- **Java Development Kit (JDK)**: `JDK 17` or `JDK 21`
- **PostgreSQL**: `v14.0` or higher (Running on default port `5432`)
- **Expo Go App** (on iOS/Android phone) OR **Android Studio / Xcode Emulator**
- **Git**

---

## 🚀 Quick Start & Setup Guide

### 1. Database Setup
Create a PostgreSQL database named `nutrivision`:

```sql
CREATE DATABASE nutrivision;
```

---

### 2. Backend Setup (`/backend`)

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Configure Database Credentials**:
   Update `src/main/resources/application.yml` (or set environment variables):
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/nutrivision
       username: postgres
       password: your_password
   ```

3. **Build & Run Backend**:
   - On Windows:
     ```bash
     mvnw.cmd spring-boot:run
     ```
   - On macOS/Linux:
     ```bash
     ./mvnw spring-boot:run
     ```

   The backend will start on **`http://localhost:8080`**.  
   - Swagger API Documentation: `http://localhost:8080/swagger-ui/index.html`

---

### 3. Mobile App Setup (`/mobile`)

1. **Navigate to the mobile directory**:
   ```bash
   cd mobile
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure API Base URL**:
   Set environment variable or update `src/constants/config.ts`:
   ```typescript
   export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://<YOUR_LOCAL_IP>:8080/api/v1";
   ```
   *(Note: Replace `<YOUR_LOCAL_IP>` with your computer's local IP address, e.g. `192.168.1.100`, so physical Android/iOS devices can reach your server).*

4. **Start Expo Development Server**:
   ```bash
   npm start
   ```

5. **Launch on Device/Emulator**:
   - Press **`a`** for Android Emulator.
   - Press **`i`** for iOS Simulator.
   - Scan the QR code using **Expo Go** app on your physical mobile phone.

---

## 📚 Project Documentation

Detailed architecture and design documentation can be found in the [`/docs`](./docs) folder:

- 📄 **[Full Project Context](./docs/PROJECT_CONTEXT.md)** — Comprehensive architecture, domain overview, and end-to-end workflows.
- ⚙️ **[Backend Context](./docs/BACKEND_PROJECT_CONTEXT.md)** — Spring Boot architecture, modules, database schema, security, and API endpoints.
- 📱 **[Frontend Context](./docs/FRONTEND_PROJECT_CONTEXT.md)** — Mobile UI/UX design system, Expo Router setup, screen specs, and state management.

---

## 🤝 Contributing & Standards

1. Follow the clean `Controller -> Service -> Repository -> Entity` pattern in backend code.
2. Adhere to the established Design System tokens in the mobile app (`#F7F5F3` background, `#171717` dark primary, minimal clean cards).
3. Do not modify public API response structures (`{ success, message, data }`).

---

## 📄 License

This project is created for educational and development purposes. All rights reserved.
