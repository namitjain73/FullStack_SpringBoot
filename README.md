# 📊 AutoViz Dashboard

Automated Data Visualization & Dashboard Generator

---

## 🚀 Overview

AutoViz Dashboard is a full-stack web application that converts raw data files (CSV or Excel) into interactive dashboards automatically.

It detects data types and generates charts without requiring manual configuration.

---

## ✨ Features

- Upload `.csv`, `.xls`, `.xlsx` files  
- Automatic detection of numerical and categorical data  
- Auto-generated charts:
  - Bar Chart (Distribution)
  - Line Chart (Trend)
  - Pie Chart (Composition)  
- Dynamic filtering  
- Aggregations (Sum, Average, Count)  
- Export filtered data to CSV  
- Clean and responsive UI  

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Recharts
- CSS

### Backend
- Spring Boot (Java)
- Apache POI
- OpenCSV

---

## ⚙️ Setup Instructions

### Backend

```bash
cd backend
./mvnw spring-boot:run
