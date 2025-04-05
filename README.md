# DevSphere: Code, Connect, and Collaborate

**DevSphere** is a dynamic and collaborative platform for developers and tech learners. It features an intelligent chatbot for answering tech-related queries, and a digital library for document sharing and learning resources.

---

## Features

### Secure Auth System
- JWT-based user authentication.
- Scalable backend with MongoDB.  
  <img src="https://github.com/user-attachments/assets/cef9c028-8d35-4fe0-bf50-c2d4a4b5050a" width="400"/>

### AI Chatbot
- Get answers to programming queries, roadmaps, tools, frameworks, etc.
- Fast, smart, and developer-focused support.  
  <img src="https://github.com/user-attachments/assets/a075f84d-fe68-4118-89c0-d06d47516bae" width="400"/>  
  <img src="https://github.com/user-attachments/assets/533bf18e-8818-46d6-9440-1874c8823ded" width="400"/>

### Digital Tech Library
- Upload, browse, and download computer science documents.
- A community-driven pool of technical resources.  
  <img src="https://github.com/user-attachments/assets/20d59e94-0d70-44e4-9a26-5f78cbeb9388" width="400"/>
---

## Tech Stack

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



# Step 2: Create .env file in the backend folder
### 📄 .env File (Required)

Ask for keys to be placed inside your `.env` file:

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

