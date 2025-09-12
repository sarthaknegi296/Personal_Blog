# Personal Blog

This is a full-stack personal blog application built with the MERN stack (MongoDB, Express, React, Node.js). It features a simple and clean interface for reading blog posts and an admin dashboard for managing them.

## Project Overview

The application allows a user to:

*   View a list of all blog posts.
*   View a single blog post.
*   View posts by category.
*   An admin to log in and manage posts (create, edit, delete).

## Tech Stack

### Backend

*   **Framework:** Express.js
*   **Database:** MongoDB (with Mongoose)
*   **Authentication:** JSON Web Tokens (JWT)
*   **Dependencies:**
    *   `bcryptjs`: For hashing passwords.
    *   `cors`: To enable Cross-Origin Resource Sharing.
    *   `dotenv`: For managing environment variables.
    *   `jsonwebtoken`: For creating and verifying JWTs.
    *   `mongoose`: As an ODM for MongoDB.
    *   `slugify`: To create URL-friendly slugs for post titles.

### Frontend

*   **Framework:** React
*   **Routing:** React Router
*   **HTTP Client:** Axios
*   **Styling:** CSS
*   **Build Tool:** Vite
*   **Dependencies:**
    *   `react-markdown`: To render blog content written in Markdown.
    *   `react-helmet-async`: To manage changes to the document head.

## API Routes

### Authentication

| Method | Path              | Description      |
| ------ | ----------------- | ---------------- |
| POST   | `/api/auth/login` | Logs in an admin |

### Posts

| Method | Path                            | Description                   |
| ------ | ------------------------------- | ----------------------------- |
| GET    | `/api/posts`                    | Get all posts (paginated)     |
| POST   | `/api/posts`                    | Create a new post             |
| GET    | `/api/posts/category/:category` | Get posts by category         |
| GET    | `/api/posts/slug/:slug`         | Get a single post by its slug |
| GET    | `/api/posts/id/:id`             | Get a single post by its ID   |
| PATCH  | `/api/posts/:id`                | Update a post by its ID       |
| DELETE | `/api/posts/:id`                | Delete a post by its ID       |



