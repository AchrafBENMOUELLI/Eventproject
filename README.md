# Event & Feedback API

API REST pour gérer les événements et feedbacks avec NestJS et MongoDB.

---

## 🚀 Installation
```bash
npm install
npm run start:dev
```

L'API sera accessible sur : `http://localhost:3000`

---

## 📡 Endpoints

### 🎉 EVENT

#### CREATE
```http
POST http://localhost:3000/event
Body: 
{
  "title": "Concert de Jazz",
  "description": "Soirée jazz exceptionnelle",
  "date": "2024-12-15T20:00:00Z",
  "location": "Tunis",
  "price": 50,
  "organizerId": 101,
  "imageUrl": "https://example.com/jazz.jpg",
  "nbPlaces": 200,
  "nbrLike": 0
}
```

#### READ ALL
```http
GET http://localhost:3000/event
```

#### READ ONE
```http
GET http://localhost:3000/event/:id
```

#### READ BY ORGANIZER
```http
GET http://localhost:3000/event/organizer/101
```

#### READ BY LOCATION
```http
GET http://localhost:3000/event/location/Tunis
```

#### GET FEEDBACKS OF EVENT
```http
GET http://localhost:3000/event/:id/feedbacks
```

#### UPDATE
```http
PATCH http://localhost:3000/event/:id
Body: { "title": "Nouveau titre", "price": 40 }
```

#### DELETE
```http
DELETE http://localhost:3000/event/:id
```

#### INCREMENT LIKE
```http
PATCH http://localhost:3000/event/:id/like
```

#### DECREMENT LIKE
```http
PATCH http://localhost:3000/event/:id/unlike
```

---

### 💬 FEEDBACK

#### CREATE
```http
POST http://localhost:3000/feedback
Body: 
{
  "id_user": 1,
  "id_event": "674abc123def456...",
  "content": "Super événement !",
  "rate": 5,
  "date": "2024-11-27"
}
```

**Note :** `id_event` doit être un ObjectId MongoDB valide (récupéré lors de la création d'un événement).

#### READ ALL
```http
GET http://localhost:3000/feedback
```

#### READ ONE
```http
GET http://localhost:3000/feedback/:id
```

#### READ BY USER
```http
GET http://localhost:3000/feedback/user/1
```

#### READ BY EVENT
```http
GET http://localhost:3000/feedback/event/674abc123def456...
```

#### UPDATE
```http
PATCH http://localhost:3000/feedback/:id
Body: { "content": "Modifié", "rate": 4 }
```

#### DELETE
```http
DELETE http://localhost:3000/feedback/:id
```

---

## 🔗 Relations

Un **Event** peut avoir plusieurs **Feedbacks**.

La relation se fait via :
- `Feedback.id_event` (ObjectId) → référence `Event._id`

Pour récupérer tous les feedbacks d'un événement :
```http
GET /event/:id/feedbacks
```
ou
```http
GET /feedback/event/:id
```

---

## 📦 Structure MongoDB

### Collection `eventys`
```json
{
  "_id": "674abc123def456...",
  "title": "Concert de Jazz",
  "description": "Soirée jazz exceptionnelle",
  "date": "2024-12-15T20:00:00.000Z",
  "location": "Tunis",
  "price": 50,
  "organizerId": 101,
  "imageUrl": "https://example.com/jazz.jpg",
  "nbPlaces": 200,
  "nbrLike": 0
}
```

### Collection `feedbacks`
```json
{
  "_id": "674xyz789ghi012...",
  "id_user": 1,
  "id_event": "674abc123def456...",
  "content": "Super événement !",
  "rate": 5,
  "date": "2024-11-27T00:00:00.000Z"
}
```

---

## ✅ Validation

### Event
- `title` : 3-200 caractères
- `description` : 10-2000 caractères
- `price` : >= 0
- `nbPlaces` : >= 0
- `imageUrl` : URL valide

### Feedback
- `id_event` : ObjectId MongoDB valide (24 caractères hexadécimaux)
- `content` : 3-500 caractères
- `rate` : entre 1 et 5
- `id_user` : entier positif

---

## 🛠️ Technologies utilisées

- NestJS
- MongoDB avec Mongoose
- Zod pour la validation
- TypeScript