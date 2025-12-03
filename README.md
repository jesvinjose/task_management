Task Management Backend (Node.js + TypeScript)

A simple task management backend built using Node.js, TypeScript, Express, and MongoDB.
Supports user authentication using JWT and full CRUD operations for tasks with filtering, sorting, and pagination.

Features
Authentication

Register (POST /users/register)

Login (POST /users/login)

JWT-based authentication

Protected routes (only logged-in users can access their tasks)

Task CRUD

1. Create task

2. Get all tasks

3. Get task by ID

4. Update task

5. Delete task

Each task belongs to the logged-in user

Filtering & Sorting

Filter by status or priority

Sort by createdAt or priority

Pagination

/tasks?page=1&limit=10

Project Structure
src/
 ├── controllers/
 ├── middlewares/
 ├── models/
 ├── routes/
 ├── validators/
 ├── utils/
 └── server.ts

📦 Installation

Clone the repository:

git clone https://github.com/jesvinjose/task_management.git
cd task_management


Install dependencies:

npm install


Create a .env file:

PORT=7232
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=10m

Running the App
---------------

Development
npm run dev

Build
npm run build

Production
npm start

API Endpoints
-------------
Auth
Method	Endpoint	Description
POST	/users/register	Register user
POST	/users/login	Login user

Tasks (Protected)
Method	Endpoint	Description
POST	/tasks	Create a task
GET	/tasks	Get all tasks
GET	/tasks/:id	Get task by ID
PUT	/tasks/:id	Update task
DELETE	/tasks/:id	Delete task

Example Request (Create Task)
{
  "title": "Finish assignment",
  "description": "Complete task management API",
  "priority": "High",
  "status": "Pending"
}

