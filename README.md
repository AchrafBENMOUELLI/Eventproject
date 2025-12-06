# Event & Feedback & User API

API REST pour gérer les événements, feedbacks et utilisateurs avec NestJS, MongoDB et JWT.

---

## 🚀 Installation
```bash
npm install
npm run start:dev
```

L'API sera accessible sur : `http://localhost:3000`

---

## 📡 Endpoints

### 👤 USER & AUTH

#### REGISTER
```http
POST http://localhost:3000/user/register
Body: 
{
  "email": "achraf@example.com",
  "password": "password123",
  "firstName": "Achraf",
  "lastName": "Benmouelhi",
  "role": "organizer"
}
```

**Rôles disponibles :** `user`, `organizer`, `admin`

#### LOGIN
```http
POST http://localhost:3000/user/login
Body: 
{
  "email": "achraf@example.com",
  "password": "password123"
}
```

**Réponse :**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "674abc123...",
    "email": "achraf@example.com",
    "firstName": "Achraf",
    "lastName": "Benmouelhi",
    "role": "organizer"
  }
}
```

#### GET ALL USERS
```http
GET http://localhost:3000/user
```

#### GET ONE USER
```http
GET http://localhost:3000/user/:id
```

#### UPDATE USER
```http
PATCH http://localhost:3000/user/:id
Body: { "firstName": "Nouveau nom", "role": "admin" }
```

#### DELETE USER
```http
DELETE http://localhost:3000/user/:id
```

---

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
  "organizerId": "674abc123def456...",
  "imageUrl": "https://example.com/jazz.jpg",
  "nbPlaces": 200,
  "nbrLike": 0
}
```

**Note :** `organizerId` doit être un ObjectId MongoDB valide d'un utilisateur.

#### READ ALL
```http
GET http://localhost:3000/event
```

**Réponse avec populate :**
```json
{
  "_id": "674event123",
  "title": "Concert de Jazz",
  "organizerId": {
    "_id": "674user456",
    "firstName": "Achraf",
    "lastName": "Benmouelhi",
    "email": "achraf@example.com"
  },
  "location": "Tunis",
  "price": 50
}
```

#### READ ONE
```http
GET http://localhost:3000/event/:id
```

#### READ BY ORGANIZER
```http
GET http://localhost:3000/event/organizer/:organizerId
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
  "id_user": "674user123...",
  "id_event": "674event456...",
  "content": "Super événement !",
  "rate": 5,
  "date": "2024-11-27"
}
```

**Note :** `id_user` et `id_event` doivent être des ObjectId MongoDB valides.

#### READ ALL
```http
GET http://localhost:3000/feedback
```

**Réponse avec populate :**
```json
{
  "_id": "674feedback789",
  "content": "Super événement !",
  "rate": 5,
  "id_user": {
    "_id": "674user111",
    "firstName": "Alice",
    "lastName": "Dupont"
  },
  "id_event": {
    "_id": "674event222",
    "title": "Concert de Jazz"
  }
}
```

#### READ ONE
```http
GET http://localhost:3000/feedback/:id
```

#### READ BY USER
```http
GET http://localhost:3000/feedback/user/:userId
```

#### READ BY EVENT
```http
GET http://localhost:3000/feedback/event/:eventId
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

### User → Event (One-to-Many)
Un **User** peut créer plusieurs **Events**.
- `Event.organizerId` (ObjectId) → référence `User._id`

### Event → Feedback (One-to-Many)
Un **Event** peut avoir plusieurs **Feedbacks**.
- `Feedback.id_event` (ObjectId) → référence `Event._id`

### User → Feedback (One-to-Many)
Un **User** peut créer plusieurs **Feedbacks**.
- `Feedback.id_user` (ObjectId) → référence `User._id`

**Schéma des relations :**
```
User (organizerId)
  ↓
  └── Event
        ↓
        └── Feedback ← User (id_user)
```

---

## 📦 Structure MongoDB

### Collection `users`
```json
{
  "_id": "674user123...",
  "email": "achraf@example.com",
  "password": "$2b$10$hashedpassword...",
  "firstName": "Achraf",
  "lastName": "Benmouelhi",
  "role": "organizer",
  "isActive": true,
  "createdAt": "2024-12-06T15:00:00.000Z",
  "updatedAt": "2024-12-06T15:00:00.000Z"
}
```

### Collection `eventys`
```json
{
  "_id": "674event123...",
  "title": "Concert de Jazz",
  "description": "Soirée jazz exceptionnelle",
  "date": "2024-12-15T20:00:00.000Z",
  "location": "Tunis",
  "price": 50,
  "organizerId": "674user123...",
  "imageUrl": "https://example.com/jazz.jpg",
  "nbPlaces": 200,
  "nbrLike": 0,
  "createdAt": "2024-12-06T15:00:00.000Z",
  "updatedAt": "2024-12-06T15:00:00.000Z"
}
```

### Collection `feedbacks`
```json
{
  "_id": "674feedback789...",
  "id_user": "674user456...",
  "id_event": "674event123...",
  "content": "Super événement !",
  "rate": 5,
  "date": "2024-11-27T00:00:00.000Z",
  "createdAt": "2024-12-06T15:00:00.000Z",
  "updatedAt": "2024-12-06T15:00:00.000Z"
}
```

---

## ✅ Validation

### User
- `email` : Email valide et unique
- `password` : Minimum 6 caractères (hashé avec bcrypt)
- `firstName` : Minimum 2 caractères
- `lastName` : Minimum 2 caractères
- `role` : 'user', 'organizer', ou 'admin'

### Event
- `title` : 3-200 caractères
- `description` : 10-2000 caractères
- `price` : >= 0
- `nbPlaces` : >= 0
- `organizerId` : ObjectId MongoDB valide
- `imageUrl` : URL valide

### Feedback
- `id_user` : ObjectId MongoDB valide
- `id_event` : ObjectId MongoDB valide
- `content` : 3-500 caractères
- `rate` : entre 1 et 5

---

## 🔐 JWT Authentication

### Token JWT
- Expire après **7 jours**
- Contient : `sub` (user ID), `email`, `role`
- Secret : `your-secret-key-change-this-in-production` ⚠️ **À changer en production !**

### Utilisation du token
Après login, utilisez le token dans les requêtes protégées :
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🛠️ Technologies utilisées

- **NestJS** - Framework backend
- **MongoDB** avec **Mongoose** - Base de données
- **JWT** avec **Passport** - Authentification
- **Bcrypt** - Hashage des mots de passe
- **Zod** - Validation des données
- **TypeScript** - Typage statique

---

## 🧪 Ordre de test recommandé

1. **Créer un utilisateur** : `POST /user/register`
2. **Se connecter** : `POST /user/login` (récupérer le token)
3. **Créer un événement** : `POST /event` (avec `organizerId` de l'utilisateur)
4. **Créer un feedback** : `POST /feedback` (avec `id_user` et `id_event`)
5. **Récupérer les events** : `GET /event` (voir les infos de l'organisateur)
6. **Récupérer les feedbacks** : `GET /feedback` (voir les infos user et event)