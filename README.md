<div align="center">

# ThyroAssess AI

### AI-Powered Thyroid Disease Prediction System

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.119-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Scikit Learn](https://img.shields.io/badge/Scikit--Learn-1.6-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-Visualization-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![License](https://img.shields.io/badge/License-GPL--3.0-blue?style=for-the-badge&logo=gnu&logoColor=white)](./LICENSE)

[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)]()
[![Model Accuracy](https://img.shields.io/badge/Model_Accuracy-83%25-blueviolet?style=flat-square)]()
[![Version](https://img.shields.io/badge/Version-2.0-informational?style=flat-square)]()
[![University](https://img.shields.io/badge/University-Semester_Project-orange?style=flat-square)]()

---

A full-stack web application that leverages Machine Learning to predict thyroid cancer malignancy risk based on clinical parameters. Built with a FastAPI backend, a vanilla HTML/CSS/JS frontend, and a trained Scikit-learn classification model.

[View Demo](#screenshots) | [Report Bug](https://github.com/precious-05/ThyroAssessAI_Local/issues) | [Request Feature](https://github.com/precious-05/ThyroAssessAI_Local/issues)

</div>

---

## Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Machine Learning Model](#machine-learning-model)
- [Screenshots](#screenshots)
- [Disclaimer](#disclaimer)
- [License](#license)
- [Developed By](#developed-by)

---

## About The Project

ThyroAssess AI is a comprehensive medical AI research project designed to assist healthcare professionals in evaluating thyroid cancer risk. The system accepts 13 clinical parameters -- including hormone levels (TSH, T3, T4), nodule size, patient demographics, and lifestyle risk factors -- and produces a risk assessment using a trained machine learning classifier.

The application features an interactive web interface with real-time form validation, dynamic risk visualization through Chart.js, detailed prediction reports with downloadable summaries, and a complete prediction history dashboard with analytics.

> **Note:** This project is developed for educational and research purposes as a university semester project. It is not intended as a substitute for professional medical diagnosis.

---

## Key Features

| Feature | Description |
|:---|:---|
| **AI-Powered Prediction** | Trained ML model analyzes 13 clinical parameters to assess thyroid malignancy risk |
| **Real-Time Validation** | Input fields validate against clinically accepted ranges as the user types |
| **Risk Visualization** | Interactive charts and gauge indicators display risk scores and feature importance |
| **Prediction History** | Complete history of past predictions with analytics, trend charts, and search/filter |
| **Downloadable Reports** | Generate and download detailed PDF-style prediction reports |
| **Responsive Design** | Fully responsive UI with modern glassmorphism design, animations, and dark mode support |
| **RESTful API** | Well-documented FastAPI backend with Swagger UI and ReDoc |
| **Database Integration** | MongoDB integration for persistent storage of prediction records |

---

## Tech Stack

### Backend

| Technology | Purpose |
|:---|:---|
| ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) Python 3.10+ | Core programming language |
| ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) FastAPI 0.119 | REST API framework |
| ![Uvicorn](https://img.shields.io/badge/Uvicorn-2C2C2C?style=flat-square&logo=gunicorn&logoColor=white) Uvicorn | ASGI server |
| ![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-F7931E?style=flat-square&logo=scikit-learn&logoColor=white) Scikit-learn 1.6 | Machine learning model |
| ![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white) Pandas | Data processing |
| ![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat-square&logo=numpy&logoColor=white) NumPy | Numerical computation |
| ![Plotly](https://img.shields.io/badge/Plotly-3F4F75?style=flat-square&logo=plotly&logoColor=white) Plotly | Server-side chart generation |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) PyMongo | Database driver |

### Frontend

| Technology | Purpose |
|:---|:---|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) HTML5 | Page structure and semantics |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) CSS3 | Styling, animations, and responsive layout |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) JavaScript ES6+ | Application logic and interactivity |
| ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white) Chart.js | Client-side data visualization |
| ![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=flat-square&logo=fontawesome&logoColor=white) Font Awesome 6 | Icon library |

---

## Project Structure

```
ThyroAssessAI_Local/
|
|-- backend/
|   |-- main.py                  # FastAPI application and API endpoints
|   |-- database.py              # MongoDB connection and database operations
|   |-- requirements.txt         # Python dependencies
|   |-- .env                     # Environment variables (MongoDB URI)
|   |-- ml_models/
|   |   |-- thyroid_model.pkl    # Trained ML classification model
|   |   |-- features.txt         # Feature names used by the model
|   |-- fallback_predictions.json
|
|-- frontend/
|   |-- index.html               # Home / Landing page
|   |-- predict.html             # Prediction form and results page
|   |-- history.html             # Prediction history and analytics
|   |-- about.html               # About the project
|   |-- style.css                # Global stylesheet
|   |-- script.js                # Legacy shared scripts
|   |-- js/
|       |-- main.js              # Core utilities and navigation
|       |-- home.js              # Landing page animations
|       |-- predict.js           # Prediction form logic and API integration
|       |-- history.js           # History dashboard and charts
|       |-- about.js             # About page interactivity
|
|-- Deploy.ipynb                 # Jupyter notebook for model training
|-- LICENSE                      # GNU GPL v3.0
|-- README.md
```

---

## Getting Started

### Prerequisites

- **Python** 3.10 or higher
- **pip** (Python package manager)
- **MongoDB** (local or cloud instance via MongoDB Atlas) -- optional, app includes fallback
- A modern web browser (Chrome, Firefox, Edge)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/precious-05/ThyroAssessAI_Local.git
   cd ThyroAssessAI_Local
   ```

2. **Set up the backend**

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Configure environment variables**

   Create a `.env` file inside the `backend/` directory (if not already present):

   ```env
   MONGODB_URI=mongodb://localhost:27017
   ```

   Replace the URI with your MongoDB Atlas connection string if using a cloud database.

### Running the Application

1. **Start the backend server**

   ```bash
   cd backend
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`. Interactive documentation is accessible at `http://localhost:8000/docs`.

2. **Start the frontend server**

   Open a new terminal window:

   ```bash
   cd frontend
   python -m http.server 8080
   ```

   Open your browser and navigate to `http://localhost:8080`.

3. **Verify the connection**

   - The application will display a green "Connected" badge in the bottom-right corner when the backend is reachable.
   - Visit `http://localhost:8000/health` to verify the API health status.

---

## API Documentation

The backend exposes a RESTful API with automatic interactive documentation.

| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET` | `/` | API information and available endpoints |
| `GET` | `/health` | Health check -- server, model, and database status |
| `GET` | `/features` | List of required input features with data types |
| `POST` | `/predict` | Submit clinical data and receive risk prediction |
| `GET` | `/history` | Retrieve prediction history from database |
| `GET` | `/stats` | Get aggregate statistics on predictions |

### Prediction Request Example

```json
POST /predict
Content-Type: application/json

{
  "Age": 45,
  "Family_History": 0,
  "Radiation_Exposure": 0,
  "Iodine_Deficiency": 0,
  "Smoking": 0,
  "Obesity": 0,
  "Diabetes": 0,
  "TSH_Level": 2.5,
  "T3_Level": 1.2,
  "T4_Level": 8.0,
  "Nodule_Size": 1.5,
  "Thyroid_Cancer_Risk": 2,
  "Gender_Male": 1.0
}
```

### Prediction Response Example

```json
{
  "prediction": "Benign",
  "risk_percentage": 48.5,
  "confidence": "Moderate",
  "features_importance": {
    "Nodule_Size": 0.3012,
    "TSH_Level": 0.2541,
    "Age": 0.1987,
    "T3_Level": 0.1345,
    "Thyroid_Cancer_Risk": 0.1115
  },
  "chart_data": "..."
}
```

> Full interactive API docs are available at `/docs` (Swagger UI) and `/redoc` (ReDoc) when the backend is running.

---

## Machine Learning Model

| Property | Details |
|:---|:---|
| **Algorithm** | Logistic Regression (Scikit-learn) |
| **Accuracy** | 83% |
| **Input Features** | 13 clinical parameters |
| **Output Classes** | Benign / Malignant |
| **Training Data** | Thyroid disease clinical dataset |
| **Serialization** | Pickle (`.pkl`) |

### Input Features

| # | Feature | Type | Range / Values |
|:---:|:---|:---:|:---|
| 1 | Age | Integer | 0 -- 120 |
| 2 | Family_History | Integer | 0 (No) / 1 (Yes) |
| 3 | Radiation_Exposure | Integer | 0 (No) / 1 (Yes) |
| 4 | Iodine_Deficiency | Integer | 0 (No) / 1 (Yes) |
| 5 | Smoking | Integer | 0 (No) / 1 (Yes) |
| 6 | Obesity | Integer | 0 (No) / 1 (Yes) |
| 7 | Diabetes | Integer | 0 (No) / 1 (Yes) |
| 8 | TSH_Level | Float | 0.0 -- 50.0 mIU/L |
| 9 | T3_Level | Float | 0.0 -- 10.0 pg/mL |
| 10 | T4_Level | Float | 0.0 -- 20.0 ug/dL |
| 11 | Nodule_Size | Float | 0.0 -- 10.0 cm |
| 12 | Thyroid_Cancer_Risk | Integer | 0 / 1 / 2 |
| 13 | Gender_Male | Float | 0.0 (Female) / 1.0 (Male) |

---

## Screenshots

> Screenshots can be added here to showcase the application UI.

| Page | Description |
|:---|:---|
| **Home** | Landing page with animated hero section and project overview |
| **Predict** | Clinical parameter input form with real-time validation and AI analysis |
| **Results** | Modal displaying risk score, confidence, feature importance chart, and recommendations |
| **History** | Dashboard with prediction records, distribution charts, and trend analytics |
| **About** | Project information, team details, and technology stack |

---

## Disclaimer

> **Important:** ThyroAssess AI is developed strictly for **educational and research purposes** as a university semester project. It is **not** a certified medical device and should **never** be used as a substitute for professional medical diagnosis, advice, or treatment. Always consult a qualified healthcare provider for medical decisions.

---

## License

Distributed under the **GNU General Public License v3.0**. See [`LICENSE`](./LICENSE) for more information.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=flat-square)](https://www.gnu.org/licenses/gpl-3.0)

---

## Developed By

| | |
|:---|:---|
| **Developer Name** | Alina Liaquat |
| **Supervisor Name** | Ma'am Nabiha Komal |
| **GitHub** | [@precious-05](https://github.com/precious-05) |
| **Email** | [alina.insights@gmail.com](mailto:alina.insights@gmail.com) |
| **Class & Semester** | BS Computer Science - 5th Semester |
| **Department** | Department of Computer Science |
| **Course** | Web Technologies |
| **LinkedIn** | [www.linkedin.com/in/alina-liaquat-779347325](https://www.linkedin.com/in/alina-liaquat-779347325) |

---

<div align="center">

[![Made with Love](https://img.shields.io/badge/Made_with-Dedication-red?style=for-the-badge)]()
[![FastAPI](https://img.shields.io/badge/Powered_by-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/ML_by-Scikit--Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)

**ThyroAssess AI** -- Version 2.0

</div>
