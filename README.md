# Event Management

A full-stack event management platform built with TypeScript, featuring secure JWT authentication, a modern frontend, and a robust backend API.

**🔗 Live Demo:** [https://rika2.netlify.app/](https://rika2.netlify.app/)

## Overview

Event Management is a web application designed to help users create, organize, and manage events with ease. The platform provides a clean, responsive interface backed by a secure and scalable API.

## Features

- 🔐 **JWT Authentication** — Secure user authentication and session management
- 🛡️ **Security Enhancements** — Hardened backend with best-practice security measures
- 🎨 **Modern UI** — Clean and responsive frontend experience
- 📡 **REST API** — Well-structured API routes with auto-generated client schemas
- 📦 **Monorepo Structure** — Organized frontend and backend workspaces for maintainability

## Tech Stack

- **Language:** TypeScript (98%)
- **Architecture:** Monorepo (`frontend/` + `backend/`)
- **Package Manager:** pnpm
- **Auth:** JWT (JSON Web Tokens)

## Project Structure

```
event-management/
├── frontend/          # Client-side application
├── backend/           # Server-side API
├── attached_assets/   # API routes & client schemas
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- Node.js
- pnpm

### Installation

```bash
git clone https://github.com/anandjadhav42004/event-management.git
cd event-management
pnpm install
```

### Running Locally

```bash
pnpm dev
```

This will start both the frontend and backend in development mode.

## Live Demo

Check out the deployed version here: **[https://rika2.netlify.app/](https://rika2.netlify.app/)**

## Author

**Anand Jadhav**
[GitHub](https://github.com/anandjadhav42004)

## License

This project is open source and available for personal and educational use.
