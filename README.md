# Eshra7hali (LMS) 🚀

Eshra7hali is a comprehensive Learning Management System (LMS) designed to facilitate seamless interaction between teachers and students. The platform empowers both parties to manage their sessions, communicate effectively, and track their progress. This project is built using Node.js and Express, leveraging various middleware for tasks like authentication, file uploads, and session management.

# Features

# Teacher Features

- Registration & Login: Teachers can register and login with authentication tokens.
- Profile Management: Teachers can update their profile information and reset passwords.
- Session Management: Teachers can approve or reject student session requests, check if they have ongoing sessions, and manage session statuses.
- Student Management: Teachers can view their list of students, approve or reject session requests, and monitor student progress.
- Status Management: Teachers can set their online/offline status, track their availability, and end meetings.

# Student Features

- Registration & Login: Students can register, login, and manage their profiles.
- Teacher Interaction: Students can send connection requests to teachers, view their teachers, and rate teachers based on their experience.
- Session Management: Students can check if they have an ongoing session, track teacher availability, and end their sessions.
- Guest Access: Students can log in as guests and view class and subject lists.

# Session Management

The system provides comprehensive session management, allowing both students and teachers to:

- Approve or reject session requests.
- Track ongoing sessions.
- End sessions and provide feedback.

# Technology Stack

# Backend:
- Node.js: A powerful, event-driven JavaScript runtime used for building scalable applications.
- Express.js: A fast, unopinionated web framework for building RESTful APIs and applications.
- MongoDB: A NoSQL database used to store teacher and student data efficiently.

# Authentication:
- JWT (JSON Web Tokens): Used for secure and scalable authentication and authorization.

# File Uploads:
- Multer: Middleware for handling multipart/form-data for file uploads (e.g., profile pictures).

# Security:
- Bcrypt.js: Used for password hashing to ensure user data security.

# Middleware

- Authentication Middleware: Ensures that routes requiring authentication are protected. It checks the JWT token for validity.
- File Upload Middleware: Handles profile picture or document uploads for both students and teachers.

# Security

- Password Hashing: Passwords are securely hashed using bcrypt.js before being stored in the database.
- JWT Authentication: All authenticated routes are protected using JSON Web Tokens, ensuring secure communication between the server and clients.
- Rate limiting: To protect against brute-force attacks.
- Input validation: Using libraries like Joi or Express-validator to sanitize user inputs.
- CORS Handling: Set up strict CORS policies for enhanced security.

# License

This project is licensed under the MIT License - see the LICENSE file for details.

# Contact

For more information or inquiries, feel free to reach out to the project maintainer:

- Email: <yusefmuhmed6766@gmail.com>
- LinkedIn: [Youssef Abdelmeged](https://www.linkedin.com/in/youssef-abdelmeged-6589a3189/)
