# 🎵 Music Store App

A simple **MERN stack** application for managing a **Music Store**, built as a learning and development project.  
This project demonstrates a basic **MongoDB**, **Express**, **React**, and **Node.js** architecture, with development and deployment powered by **Docker**.

---

## 📂 Project Structure

```
music-store/
 ├── backend/             # Node.js + Express server (API)
 │   ├── index.js         # Backend entry point (uses nodemon)
 │   └── Dockerfile       # Backend Docker container definition
 ├── frontend/            # React application (Create React App or similar)
 │   └── Dockerfile       # Frontend Docker container definition
 ├── docker-compose.yml   # Orchestrates backend, frontend, and MongoDB
 ├── package.json         # Root-level scripts for local dev
```

---

## ⚙️ Components

**Backend**
- Located in `backend/`
- Express server exposing API endpoints.
- Uses **`nodemon`** for automatic reloads during local development.
- Connects to **MongoDB** for data persistence.

**Frontend**
- Located in `frontend/`
- Built with React (Create React App or similar).
- Communicates with the backend API.

**Database**
- MongoDB container managed by **Docker Compose**.

**Docker**
- Uses `docker-compose` to spin up the entire stack:
    - Backend container
    - Frontend container
    - MongoDB container

**Development Scripts**
- Runs **backend and frontend together** locally using [`concurrently`](https://www.npmjs.com/package/concurrently).

---

## 🚀 Getting Started

### ✅ Local Development (without Docker)

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the entire app**

   ```bash
   npm run start-app
   ```

    - Runs `nodemon` in `backend/`
    - Runs React dev server in `frontend/`
    - Keeps both running together in one terminal

---

### 🐳 Containerized Development (with Docker)

1. **Build & start all services**

   ```bash
   docker-compose up --build
   ```

    - Builds backend & frontend images.
    - Starts MongoDB container.
    - Networks services together.

2. **Stop containers**

   ```bash
   docker-compose down
   ```

---

## 📌 Development Tips

- **Hot Reloading:**
    - Backend auto-restarts via `nodemon`.
    - Frontend supports hot module replacement.

- **Environment Variables:**
    - Store environment configs in `.env` files (e.g., MongoDB URI).

- **Run everything:**
    - Use `npm run start-app` for local dev.
    - Use `docker-compose up` for containerized dev.

---

## ✅ Scripts Overview (`package.json`)

```json
{
  "scripts": {
    "start:backend": "cd backend && nodemon index.js",
    "start:frontend": "cd frontend && npm start",
    "start-app": "concurrently \"npm run start:backend\" \"npm run start:frontend\""
  }
}
```

---

## 🔑 Notes

- Make sure **Docker** and **Docker Compose** are installed.
- Use `npm run start-app` instead of legacy `start-app.sh` — the npm script is the recommended way.
- For production, adjust your `Dockerfile` and `docker-compose.yml` as needed.

---

## 🚀 Next Steps

- Add sample **API routes** to `backend/`.
- Connect your **React frontend** to fetch real data.
- Configure production-ready **Dockerfiles**.
- Add a `.env.example` for easy setup.

---

**Happy building & rock on! 🎸**
