#  College Chronicle
*A Full-Stack Web Application for Academic Communication & Event Management*

College Chronicle is a centralized platform designed to streamline the communication of academic circulars, event announcements, and deadline management within educational institutions. It provides a centralized platform with role-based access control for Admins, Faculty, and Coordinators. The application supports advanced filtering, secure authentication, and seamless Google Calendar integration via OAuth 2.0. By consolidating updates into one platform, it improves efficiency and engagement between students, faculty, and administrators.

---

##  Features

-  **Role-Based Posting**  
  Different user roles (Admin, Faculty, Coordinator) can create and manage posts according to their access level.

-  **Search & Filter**  
  Quickly locate posts using filters like title, department, and user role.

-  **Google Calendar Integration (OAuth 2.0)**  
  - Users can add events directly to their Google Calendar.
  - On first login, users authenticate via Google OAuth.
  - Refresh tokens are securely stored in the MongoDB database for continued access.

-  **Authentication & Authorization**  
  - A secure email/password-based login system with access control tailored to different user roles.
---

##  Tech Stack

| Layer            | Technologies Used                          |
|------------------|---------------------------------------------|
| **Frontend**     | React.js, HTML5, CSS3, JavaScript           |
| **Backend**      | Node.js, Express.js                         |
| **Database**     | MongoDB                  |
| **Authentication** | Email/Password-based Custom Auth          |
| **OAuth**        | Google Calendar API via OAuth 2.0           |
| **Token Storage**| MongoDB stores refresh tokens securely      |
| **Version Control** | Git, GitHub                              |
| **Dev Tools**    | VS Code, Postman                            |

---



