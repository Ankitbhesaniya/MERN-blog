📖 Short Description

This is a full-stack blog application built using Node.js, Express, MongoDB, and React.js. The project implements secure JWT-based authentication, protected APIs, and complete post management functionality (CRUD). It follows a scalable, production-oriented architecture using modern ES6 syntax, validation, authorization, and centralized error handling.

💡 Thought Process

The primary goal of this project was to simulate a real-world production application rather than just a basic CRUD demo. The focus was on designing a clean, maintainable, and scalable backend structure while implementing industry-standard practices such as JWT authentication, route protection, and modular code organization.

Special attention was given to:

Building a structured and reusable architecture

Ensuring security through authentication & authorization

Handling errors and validations properly

Supporting scalability with pagination & clean schema design

Writing readable, modern ES6 code

This project reflects how production-grade applications are designed, emphasizing clarity, maintainability, and performance.

## Setup

### Backend
```bash
cd backend
cp .env.example .env      
npm install
npm run dev           
```

### Frontend
```bash
cd frontend
npm install
npm start     
```

---

## API Endpoints

| Method | Endpoint           | Auth | Description               |
|--------|--------------------|------|---------------------------|
| POST   | /api/auth/register | ✗    | Register                  |
| POST   | /api/auth/login    | ✗    | Login → JWT               |
| GET    | /api/auth/me       | ✓    | Current user              |
| GET    | /api/posts         | ✗    | List posts (paginated)    |
| GET    | /api/posts/:id     | ✗    | Single post               |
| POST   | /api/posts         | ✓    | Create post               |
| PUT    | /api/posts/:id     | ✓    | Update post (owner only)  |
| DELETE | /api/posts/:id     | ✓    | Delete post (owner only)  |

