#  College Chronicle

**College Chronicle** is a full-stack web application designed to centralize and streamline academic communication. It allows Admins, Faculty, and Coordinators to post academic circulars, event announcements, and deadline updates. With powerful role-based access, calendar integration via Google OAuth, and a clean interface, it bridges the information gap in educational institutions.

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



