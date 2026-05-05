<div align="center">
  
# 📊 AutoViz Dashboard

**An Automated Data Visualization & Dashboard Generator**

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.4-6DB33F?logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Recharts](https://img.shields.io/badge/Recharts-2.12-22B5BF?logo=recharts&logoColor=white)](https://recharts.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

*Transform raw spreadsheets into beautiful, interactive visual stories instantly.*

</div>

<br />

## 🌟 Overview

Data is everywhere, but raw numbers in spreadsheets are hard to interpret. **AutoViz Dashboard** is a plug-and-play full-stack web application designed to instantly transform any raw data file (Excel or CSV) into an interactive, visual story without requiring technical skills. 

The system intelligently parses your file, infers data types (Categorical vs. Numerical), and automatically generates a comprehensive dashboard equipped with dynamic filtering, aggregations, and premium glassmorphism visual aesthetics.

## ✨ Key Features

- **Drag-and-Drop Ingestion:** Effortlessly upload `.csv`, `.xls`, and `.xlsx` files using a smooth, animated drop zone.
- **Smart Type Inference:** The Spring Boot backend automatically scans dataset columns to detect Categorical and Numerical fields.
- **Auto-Visualization:** Instantly renders optimal charts based on your data:
  - 📊 **Distribution (Bar Chart)**
  - 📈 **Trend Analysis (Line Chart)**
  - 🍩 **Composition (Pie Chart)**
- **Dynamic Interaction:** Slice and dice your data using real-time sidebar filters.
- **Data Aggregation:** Aggregate your charts instantly using `Sum`, `Average`, or `Count`.
- **Export Capabilities:** Export your filtered and aggregated chart insights back into a clean CSV format.
- **Premium UI/UX:** Built with a stunning "Midnight Glass" theme featuring glassmorphism cards, fluid hover animations, and vibrant gradient color palettes.

## 💻 Technology Stack

### Frontend
- **Framework:** React.js (Bootstrapped with Vite for lightning-fast HMR)
- **Styling:** Custom CSS3 with Glassmorphism UI & CSS Variables
- **Charting Library:** Recharts
- **Icons:** Lucide React

### Backend
- **Framework:** Java Spring Boot (v3.2.4)
- **Data Parsing:** Apache POI (Excel) & OpenCSV (CSV)
- **Architecture:** Layered REST API Controller & Service patterns

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

- **Node.js** (v18.0 or higher)
- **Java JDK** (v17 or higher)
- **Maven** (Included via `mvnw` wrapper)

### 1. Backend Setup (Spring Boot)

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Start the Spring Boot application using the Maven wrapper:
   ```bash
   # Windows
   .\mvnw.cmd spring-boot:run

   # Mac/Linux
   ./mvnw spring-boot:run
   ```
   *The backend will start and listen on `http://localhost:8081`.*

### 2. Frontend Setup (React + Vite)

1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the required Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will launch and be accessible at `http://localhost:5173`.*

---

## 📂 Project Structure

```text
AutoViz/
├── backend/                       # Spring Boot Application
│   ├── pom.xml                    
│   ├── mvnw / mvnw.cmd            
│   └── src/main/
│       ├── resources/
│       │   └── application.properties     # Configures port 8081 & upload limits
│       └── java/com/example/dataviz/
│           ├── DataVizApplication.java    # Application Entry
│           ├── FileUploadController.java  # REST API endpoints
│           ├── DataParserService.java     # File parsing & logic
│           ├── DatasetResponse.java       # DTOs
│           └── ColumnMetadata.java        # DTOs
│
└── frontend/                      # React Application
    ├── package.json               
    ├── vite.config.js             
    └── src/
        ├── index.css              # Global Glassmorphism Styles
        ├── main.jsx               # React Entry
        ├── App.jsx                # Layout & File Upload Logic
        └── Dashboard.jsx          # Interactive Recharts Component
```

## 🧪 Testing with Sample Data

A `sample_sales_data.csv` file is included in the root directory. You can drag and drop this file directly into the application's upload zone to immediately see the interactive dashboard in action!

---

<div align="center">
  <b>Built with ❤️ by Gangadhar</b>
</div>
