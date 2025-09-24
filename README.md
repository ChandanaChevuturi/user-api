User API

A simple REST API for managing users.
Supports create, read, update, delete (CRUD) with filters, pagination, and sorting.
Built using Express, Prisma, SQLite, and Zod.

🚀 Stack

Express → Web framework

Prisma → ORM with SQLite

SQLite → Lightweight, file-based database

Zod → Input validation

Swagger → Auto-generated API docs (/docs)

🛠️ Running the project

Install dependencies
npm install

Development (auto-reload)
npm run dev

Seed database (optional)
npm run seed

Run tests
npm test

Build for production
npm run build

Start production build
npm start

(Optional) Run with Docker
docker build -t user-api .
docker run -p 3000:3000 --env-file .env user-api

📚 API Endpoints

Create user
POST /api/users
Body: { "email": "alice@example.com
", "name": "Alice", "city": "Seattle" }

List users
GET /api/users?city=Seattle&page=1&pageSize=5&sortBy=name&order=asc

Get one user
GET /api/users/{id}

Update user
PATCH /api/users/{id}
Body: { "name": "Alice Updated" }

Delete user
DELETE /api/users/{id}

API Docs
GET /docs

✨ Notes & Design Decisions

SQLite: chosen for simplicity and easy local development; can be swapped with Postgres/MySQL in production.

Prisma: provides a modern, type-safe ORM.

Zod: ensures input validation at the API boundary.

Pagination, filtering, sorting: included to reflect real-world API needs.

Swagger docs: allow interactive testing and documentation.

Test commit from Git GUI
