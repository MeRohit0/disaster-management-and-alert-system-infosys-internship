# DMAS: Disaster Management & Alert System 🛡️

**A Full-Stack Emergency Response Platform**

---

## 📌 Project Overview
DMAS is a comprehensive solution designed to streamline emergency response during disasters. It bridges the gap between **Citizens** in distress, **Admins** overseeing the situation, and **Field Responders** on the ground. The system transforms raw data from RSS feeds and citizen SOS requests into actionable geospatial intelligence.



---

## 🚀 Key Modules & Features

### 1. Unified Command Center (Admin)
* **Geospatial Intelligence:** Live SOS requests mapped using **Leaflet.js** with real-time "Fly-To" focus.
* **Verified Alerting:** RSS feed ingestion where admins verify raw data and broadcast official safety instructions.
* **Incident Lifecycle Management:** Ability to assign responders and track tasks from 'Pending' to 'Resolved'.

### 2. Field Responder Portal
* **Mobile-First Dashboard:** Real-time task queue specific to the logged-in responder.
* **Live Reporting:** Responders post field updates with status changes (`EN_ROUTE`, `AT_LOCATION`, `COMPLETED`).
* **Audit Trail:** A timestamped timeline view showing every update made during a rescue mission.

### 3. Analytics & Crisis Intelligence
* **Performance Metrics:** Tracking Average Response Time and Success Rates.
* **Trend Analysis:** Visualizing incident frequency (Monthly/Yearly) using **Recharts**.
* **Resource Mapping:** Pie chart distribution of disaster types (Flood, Fire, Medical).

---

## 🛠️ Tech Stack

### Frontend
* **React (TypeScript):** Type-safe UI development.
* **Tailwind CSS:** Modern, utility-first styling for high responsiveness.
* **Leaflet.js:** Interactive maps and geospatial markers.
* **Recharts:** SVG-based data visualization.

### Backend
* **Java (Spring Boot 3):** Robust REST API architecture.
* **Spring Security + JWT:** Secure authentication with role-based access control.
* **Spring Data JPA:** Efficient database management and ORM mapping.
* **MySQL:** Reliable relational data storage.



---

## 📐 Low-Level Design (LLD)
The system is built on a **Unidirectional Data Pipeline**:
1.  **Ingestion:** Data is received as **DTOs** to prevent internal entity exposure.
2.  **State Machine:** SOS requests transition through statuses, triggering audit logs.
3.  **Visualization:** Backend `GROUP BY` queries aggregate data, which React maps into interactive charts.

---

## 📦 Installation & Setup

### Prerequisites
* JDK 21 or higher
* Node.js 22+
* MySQL Server

### Backend Setup
1. Clone the repository.
2. Update `dmas/src/main/resources/application.properties` with your MySQL credentials.
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
4. Run Frontend Code 
    ```bash
    cd dmas-frontend 
    npm i && npm run dev ```

## 🖼️Screenshort

#### Admin Dashboard
SOS Request dashboard
![alt text](<screenshorts/Screenshot 2026-04-16 121850.png>)

SOS Request Logs
![alt text](<screenshorts/Screenshot 2026-04-16 121818.png>)

Disaster External API Integration 
![alt text](<screenshorts/Screenshot 2026-04-10 142422.png>)

Dashboard for quick overview
![alt text](<screenshorts/Screenshot 2026-04-10 141502.png>)


#### Citizen Dashboard
See Active Disaster and Request Help 
![alt text](<screenshorts/Screenshot 2026-04-10 141749.png>)

SOS Form Component
![alt text](<screenshorts/Screenshot 2026-04-10 122432.png>)

#### Responders Dashboard

Reponders acknowledgement 
![alt text](<screenshorts/Screenshot 2026-04-10 122329.png>)

Status Update of SOS
![alt text](<screenshorts/Screenshot 2026-04-10 122344.png>)

#### Signin / Signup

![alt text](<screenshorts/Screenshot 2026-04-10 121314.png>)

![alt text](<screenshorts/Screenshot 2026-04-10 121246.png>)