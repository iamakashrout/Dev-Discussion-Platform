# DevSphere: Code, Connect, and Collaborate

**DevSphere** is a dynamic and collaborative platform for developers and tech learners. It features an intelligent chatbot for answering tech-related queries, and a digital library for document sharing and learning resources.

---

## Features
### Secure Auth System
- JWT-based user authentication.
- Scalable backend with MongoDB.
### AI Chatbot
- Get answers to programming queries, roadmaps, tools, frameworks, etc.
- Fast, smart, and developer-focused support.

### Digital Tech Library
- Upload, browse, and download computer science documents.
- A community-driven pool of technical resources.



---

## 🧑‍💻 Tech Stack

| Layer       | Tech                    |
|------------|--------------------------|
| Frontend   | React.js                 |
| Backend    | Node.js                  |
| Database   | MongoDB Atlas            |
| Auth       | JWT                      |

---

## Getting Started

### Installation Steps

```bash
# Step 1: Clone the repository
git clone https://github.com/iamakashrout/Dev-Discussion-Platform.git
cd Dev-Discussion-Platform

# Step 2: Create .env file
touch .env
```

### 📄 .env File (Required)

Ask for keys to be placed inside your `.env` file:

```env
MONGO_URI=your_mongodb_key
JWT_SECRET=your_jwt_secret_key
GOOGLE_API_KEY=your_google_api_key
```


---

### To Run the Application

```bash
# Install dependencies
npm install

#  To Start  the backend
cd backend
node index.js

# In a new terminal, start  the frontend
cd frontend
npm start
```

