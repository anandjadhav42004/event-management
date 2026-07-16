<div align="center">

# 🎟️ Event Management
### A modern, full-stack event management platform built with TypeScript

[![TypeScript](https://img.shields.io/badge/TypeScript-98%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-Monorepo-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)

### 🔗 [Live Demo](https://rika2.netlify.app/)

</div>

---

## ✨ Overview

**Event Management** is a full-stack platform for creating, organizing, and managing events end-to-end. It combines a secure, JWT-authenticated backend with a clean, responsive frontend — built as a pnpm monorepo for a maintainable, scalable codebase.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure login and session handling using signed JSON Web Tokens |
| 🛡️ **Security Hardening** | Backend built with best-practice security measures against common vulnerabilities |
| 📡 **REST API** | Well-structured API routes with auto-generated client schemas |
| 🎨 **Modern UI** | Clean, responsive interface for creating and browsing events |
| 📦 **Monorepo Architecture** | Organized `frontend/` and `backend/` workspaces sharing config and tooling |
| ⚡ **Fast Iteration** | Powered by pnpm workspaces for efficient dependency management |

---

## 🛠️ Tech Stack

- **Language:** TypeScript
- **Architecture:** Monorepo (`frontend/` + `backend/`)
- **Package Manager:** pnpm
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment:** Netlify

---

## 📦 Getting Started

### Prerequisites
- Node.js v16 or higher
- pnpm

### 1️⃣ Clone the repository
```bash
git clone https://github.com/anandjadhav42004/event-management.git
cd event-management
```

### 2️⃣ Install dependencies
```bash
pnpm install
```

### 3️⃣ Configure environment variables
Create a `.env` file in the appropriate workspace(s) (see `.env.example` if provided) with your backend/API configuration, such as JWT secrets and database connection strings.

> ⚠️ **Never commit your `.env` file** — it's already excluded via `.gitignore`.

### 4️⃣ Run the development server
```bash
pnpm dev
```

This starts both the frontend and backend in development mode.

### 5️⃣ Build for production
```bash
pnpm build
```

---

## 📁 Project Structure

```
event-management/
├── frontend/           # Client-side application
├── backend/             # Server-side API & auth logic
├── attached_assets/     # API routes & generated client schemas
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── tsconfig.json
```

---

## 🌐 Deployment

Deploy in minutes using **Netlify** or **Vercel**:

1. Push your code to GitHub
2. Import the repository into Netlify/Vercel
3. Set the build command (`pnpm build`) and output directory for the frontend workspace
4. Add any required environment variables in your project settings
5. Click **Deploy** 🚀

Live version currently hosted at: **[https://rika2.netlify.app/](https://rika2.netlify.app/)**

---

## 📄 License

This project is open source and available for personal and educational use.

---

<div align="center">

Made with ❤️ by **Anand Jadhav**
[GitHub](https://github.com/anandjadhav42004)

</div>
