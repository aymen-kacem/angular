# 🎓 Event & Learning Management Platform

![Angular](https://img.shields.io/badge/Angular-16.2.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)
![RxJS](https://img.shields.io/badge/rxjs-%23B7178C.svg?style=for-the-badge&logo=reactivex&logoColor=white)
![Material](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)

A modern, responsive Single Page Application (SPA) built with Angular 16. This platform allows users to manage, explore, and register for various courses and events (seminars, parties, workshops, etc.). It includes a secure authentication system, an interactive dashboard for data visualization, and a mock RESTful API for rapid development.

## ✨ Features

*   **🔐 Authentication:** Secure user sign-up and login powered by Firebase Authentication.
*   **📅 Event & Course Management:** Browse, create, and manage events and educational courses.
*   **📊 Interactive Dashboard:** Data visualization and analytics using `Chart.js` and `ng2-charts`.
*   **📱 Responsive UI:** Clean and modern interface built with Angular Material and `@ngbracket/ngx-layout`.
*   **🗄️ Mock API:** Full RESTful backend simulation using `json-server` (handling users, events, categories, and registrations).
*   **⚡ Performance:** Modular architecture with lazy-loaded routes for optimized loading times.

## 🛠️ Tech Stack

*   **Frontend Framework:** Angular 16
*   **UI Library:** Angular Material
*   **Authentication:** Firebase Auth
*   **State & Asynchronous Management:** RxJS
*   **Charts & Analytics:** Chart.js, ng2-charts
*   **Mock Backend:** JSON-Server

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (which includes `npm`) and the Angular CLI installed on your machine.
```bash
npm install -g @angular/cli
```

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name/Lab
    ```

2.  **Install the dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Firebase:**
    Ensure your Firebase configuration is properly set up in `src/environments/environment.ts` and `src/environments/environment.development.ts`.

### Running the Application Locally

You need to run two servers concurrently: the mock backend and the Angular frontend.

**1. Start the Mock API (JSON-Server)**
This will serve the data from `src/assets/db.json` on `http://localhost:3000`.
```bash
npm run json-server
```

**2. Start the Angular Development Server**
Open a new terminal window/tab and run:
```bash
npm start
```
Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## 📂 Project Architecture

The application follows a scalable modular structure:
*   `core/` - Singletons, interceptors, and core services.
*   `features/` - Lazy-loaded feature modules (Auth, Dashboard, Courses, Events, Profile, Users, Categories).
*   `shared/` - Reusable UI components, pipes, and directives.

## 📝 License

This project is licensed under the MIT License.
