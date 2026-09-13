# 🌱 KisanLens

AI-powered agriculture assistant that helps farmers analyze
soil and detect crop diseases using images, location, weather,
and machine learning.

## 🚀 Project Overview

KisanLens provides two primary workflows:

1. 🔬 Soil Scan
   - Capture/upload soil image
   - Analyze soil characteristics using ML
   - Combine results with location and weather data
   - Provide recommendations

2. 🌿 Disease Scan
   - Capture/upload crop/leaf image
   - Detect possible plant disease using ML
   - Estimate confidence
   - Provide treatment and prevention recommendations

## 🏗️ System Architecture

React / React Native Client
        ↓
Spring Boot REST API
        ↓
 ┌───────────────┬──────────────────┐
 │               │                  │
Weather API    ML Inference      MongoDB
 │               │                  │
 │          Soil CNN             Users
 │          Disease CNN          Fields
 │                              Scans
 │                              Diagnoses
 │                              Treatment KB
 └───────────────┴──────────────────┘

## 🛠️ Tech Stack

### Frontend
- React
- React Native (planned/mobile)
- Tailwind CSS
- REST API integration
- Multipart image upload

### Backend
- Java
- Spring Boot
- Spring Security
- JWT Authentication
- REST APIs

### Database
- MongoDB
- GridFS / S3 for image storage

### Machine Learning
- Python
- Soil classification CNN
- Plant disease detection CNN

### External Services
- OpenWeatherMap / NASA POWER
- GPS / Location services

## 🔄 Core Flow

### Soil Scan

User → Capture Soil Image
     → Upload Image
     → Spring Boot API
     → Soil ML Model
     → Weather + Location Data
     → Recommendation Engine
     → Results

### Disease Scan

User → Capture Leaf/Crop Image
     → Upload Image
     → Spring Boot API
     → Disease ML Model
     → Diagnosis
     → Treatment Engine
     → Results

## 📌 Current Progress

- [x] Frontend UI
- [x] Soil Scan flow UI
- [x] Disease Scan flow UI
- [x] Authentication UI
- [x] Dashboard UI
- [ ] Spring Boot backend
- [ ] JWT authentication
- [ ] MongoDB integration
- [ ] ML inference service
- [ ] Soil classification model
- [ ] Disease detection model
- [ ] Weather API integration
- [ ] Recommendation engine
- [ ] Image storage
- [ ] Mobile application

1. Final Architecture
┌──────────────────────┐
│  React Native (app)   │  or React web (browser camera upload works fine
│  or React web client  │  for a capstone demo — see note at bottom)
└──────────┬────────────┘
           │ REST (JSON + multipart image upload), JWT in header
┌──────────▼─────────────────────────────────────────────────┐
│                Spring Boot API  (Java)                      │
│                                                              │
│  auth/           user/            field/                    │
│  soilscan/       diseasescan/     recommendation/            │
│  treatment/      weather/         mlclient/                  │
│  storage/        notification/    common/                    │
└──────────┬───────────────────────┬──────────────┬───────────┘
           │                       │              │
           ▼                       ▼              ▼
 ┌──────────────────┐   ┌──────────────────┐   ┌──────────────┐
 │  MongoDB          │   │  FastAPI ML       │   │  Weather API  │
 │  users, fields,   │   │  service          │   │  (OpenWeather │
 │  soil_scans,      │   │  /predict/soil    │   │   / NASA      │
 │  disease_scans,   │   │  /predict/disease │   │   POWER)      │
 │  treatment_kb     │   └──────────────────┘   └──────────────┘
 └──────────────────┘
           │
           ▼
 ┌──────────────────┐
 │  Image storage    │  local disk for capstone; interface swappable
 │  (or GridFS)       │  to S3 later without touching business logic
 └──────────────────┘


Request flow — soil scan: client uploads photo + GPS → Spring Boot saves image, creates soil_scans doc (status: pending) → calls FastAPI /predict/soil → gets soil type + confidence → calls weather API using GPS → CropRecommendationEngine ranks crops from soil + weather + season → updates doc, returns result.

Request flow — disease scan: client uploads photo → Spring Boot saves image, creates disease_scans doc → calls FastAPI /predict/disease → gets disease + confidence + severity → looks up treatment_kb by disease class → updates doc, returns diagnosis + treatment plan.

Both flows share the same mlclient and storage modules — only the domain module (soilscan vs diseasescan) and the downstream lookup (weather+crops vs treatment KB) differ.

2. Monorepo Layout
agrodoc-ai/
├── docker-compose.yml
├── README.md
├── backend/            ← Spring Boot
├── ml-service/         ← FastAPI
├── frontend-web/       ← React (recommended primary client — see note)
└── mobile-app/         ← React Native (optional/stretch)

3. backend/ — Spring Boot (Java)
backend/
├── pom.xml
├── Dockerfile
├── src/main/java/com/agrodoc/
│   ├── AgroDocApplication.java
│   │
│   ├── config/
│   │   ├── SecurityConfig.java          # Spring Security + JWT filter chain
│   │   ├── MongoConfig.java             # enables Mongo auditing, custom converters
│   │   ├── WebClientConfig.java         # WebClient bean for calling ml-service
│   │   └── CorsConfig.java
│   │
│   ├── auth/
│   │   ├── AuthController.java          # POST /auth/register, /auth/login
│   │   ├── JwtService.java              # issue/validate tokens
│   │   ├── JwtAuthFilter.java
│   │   └── dto/
│   │       ├── LoginRequest.java
│   │       ├── RegisterRequest.java
│   │       └── AuthResponse.java
│   │
│   ├── user/
│   │   ├── User.java                    # @Document("users")
│   │   ├── UserRepository.java          # extends MongoRepository
│   │   ├── UserService.java
│   │   └── UserController.java          # GET/PUT /users/me
│   │
│   ├── field/
│   │   ├── Field.java                   # @Document("fields") — geo location, crop history
│   │   ├── FieldRepository.java         # includes @GeoSpatialIndexed query
│   │   ├── FieldService.java
│   │   └── FieldController.java
│   │
│   ├── soilscan/
│   │   ├── SoilScan.java                # @Document("soil_scans")
│   │   ├── SoilScanRepository.java
│   │   ├── SoilScanService.java         # orchestrates: image → ML → weather → recommend
│   │   ├── SoilScanController.java      # POST /scans/soil, GET /scans/soil/{id}
│   │   └── dto/
│   │       ├── SoilScanResponse.java
│   │       └── CropSuggestionDto.java
│   │
│   ├── diseasescan/
│   │   ├── DiseaseScan.java             # @Document("disease_scans")
│   │   ├── DiseaseScanRepository.java
│   │   ├── DiseaseScanService.java      # orchestrates: image → ML → treatment lookup
│   │   ├── DiseaseScanController.java   # POST /scans/disease, GET /scans/disease/{id}
│   │   └── dto/
│   │       ├── DiseaseScanResponse.java
│   │       └── TreatmentPlanDto.java
│   │
│   ├── recommendation/
│   │   ├── Crop.java                    # @Document("crops") — reference data
│   │   ├── CropRepository.java
│   │   └── CropRecommendationEngine.java # ranking logic: soil + weather + season → top-N crops
│   │
│   ├── treatment/
│   │   ├── TreatmentEntry.java          # @Document("treatment_kb")
│   │   ├── TreatmentRepository.java
│   │   └── TreatmentService.java        # lookup by disease class, builds dosage/plan
│   │
│   ├── weather/
│   │   ├── WeatherClient.java           # calls OpenWeatherMap/NASA POWER by lat/lon
│   │   └── WeatherSnapshot.java         # embedded sub-document, stored on scan
│   │
│   ├── mlclient/
│   │   ├── MlInferenceClient.java       # WebClient calls to FastAPI service
│   │   ├── SoilPredictionResult.java
│   │   └── DiseasePredictionResult.java
│   │
│   ├── storage/
│   │   ├── ImageStorageService.java     # interface: store(bytes) -> url/path
│   │   └── LocalDiskStorageService.java # capstone default impl
│   │
│   ├── notification/
│   │   └── NotificationService.java     # stub — logs only, no real push/SMS for capstone
│   │
│   └── common/
│       ├── ApiResponse.java             # generic {success, data, error} wrapper
│       └── exception/
│           ├── GlobalExceptionHandler.java
│           ├── ResourceNotFoundException.java
│           └── MlServiceUnavailableException.java
│
├── src/main/resources/
│   ├── application.yml
│   ├── application-dev.yml              # local Mongo, local ml-service URL
│   └── application-prod.yml
│
└── src/test/java/com/agrodoc/
    ├── soilscan/SoilScanServiceTest.java
    ├── diseasescan/DiseaseScanServiceTest.java
    └── recommendation/CropRecommendationEngineTest.java

4. ml-service/ — FastAPI (Python)
ml-service/
├── requirements.txt          # fastapi, uvicorn, torch, pillow, python-multipart
├── Dockerfile
├── main.py                   # creates FastAPI app, includes routers
│
├── app/
│   ├── config.py             # model paths, class label lists
│   │
│   ├── routers/
│   │   ├── soil.py           # POST /predict/soil  (multipart image in)
│   │   └── disease.py        # POST /predict/disease
│   │
│   ├── models/
│   │   ├── soil_classifier.py     # load model once at startup, run inference
│   │   └── disease_classifier.py  # + severity/segmentation scoring
│   │
│   ├── schemas/
│   │   ├── soil.py           # Pydantic response: {soil_type, confidence, scores{}}
│   │   └── disease.py        # Pydantic response: {disease, confidence, severity}
│   │
│   ├── preprocessing/
│   │   └── image_utils.py    # shared resize/normalize (must match training exactly)
│   │
│   └── weights/
│       ├── soil_cnn.pt
│       └── disease_cnn.pt
│
├── training/                 # not part of the served app — where you build the models
│   ├── train_soil_model.py
│   ├── train_disease_model.py
│   └── datasets/              # gitignored — README pointing to dataset source (e.g. PlantVillage)
│
└── tests/
    ├── test_soil_endpoint.py
    └── test_disease_endpoint.py

5. frontend-web/ — React (recommended primary client)
frontend-web/
├── package.json
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── api/
│   │   ├── client.js          # axios instance, JWT interceptor, base URL
│   │   ├── authApi.js
│   │   ├── soilScanApi.js
│   │   └── diseaseScanApi.js
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── SoilScanPage.jsx
│   │   ├── DiseaseScanPage.jsx
│   │   └── HistoryPage.jsx
│   ├── components/
│   │   ├── ImageUploadForm.jsx     # file input + camera capture (works on phone browsers too)
│   │   ├── SoilResultCard.jsx
│   │   ├── DiseaseResultCard.jsx
│   │   ├── ConfidenceBadge.jsx
│   │   └── Navbar.jsx
│   └── context/
│       └── AuthContext.jsx

6. mobile-app/ — React Native (optional/stretch)
mobile-app/
├── package.json
├── App.tsx
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── SoilScanScreen.tsx
│   │   ├── DiseaseScanScreen.tsx
│   │   └── HistoryScreen.tsx
│   ├── components/
│   │   ├── CameraCapture.tsx
│   │   └── ResultCard.tsx
│   ├── api/
│   │   └── client.ts          # same endpoints as web
│   └── navigation/
│       └── AppNavigator.tsx

7. Root docker-compose.yml (services)
services:
  mongo:        # mongo:7, volume-mounted, exposes 27017
  ml-service:   # builds ml-service/, exposes 8000
  backend:      # builds backend/, exposes 8080, depends_on mongo + ml-service
  frontend-web: # builds frontend-web/, exposes 5173




## 🔮 Future Improvements

- Farmer field history
- Scan history and analytics
- Weather-based crop recommendations
- Multilingual support
- Voice assistance
- Mobile application
- Crop-specific treatment recommendations
