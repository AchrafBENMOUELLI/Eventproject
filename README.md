# Feedback API

API REST pour gérer les feedbacks d'événements avec NestJS et MongoDB.

---

## 🚀 Installation
```bash
npm install
npm run start:dev
```

L'API sera accessible sur : `http://localhost:3000`

---

## 📡 Endpoints

### CREATE
```http
POST http://localhost:3000/feedback
Body: { "id_user": 1, "id_event": 10, "content": "Super!", "rate": 5, "date": "2024-11-27" }
```

### READ ALL
```http
GET http://localhost:3000/feedback
```

### READ ONE
```http
GET http://localhost:3000/feedback/:id
```

### READ BY USER
```http
GET http://localhost:3000/feedback/user/1
```

### READ BY EVENT
```http
GET http://localhost:3000/feedback/event/10
```

### UPDATE
```http
PATCH http://localhost:3000/feedback/:id
Body: { "content": "Modifié", "rate": 4 }
```

### DELETE
```http
DELETE http://localhost:3000/feedback/:id
```
