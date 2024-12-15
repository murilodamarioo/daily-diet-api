# Daily Diet API documentation 🚀

## Overview
Welcome to the API documentation! This API provides functionalities to manage users and their meal records. Below, you will find details about the available endpoints, their usage, and examples of requests and responses.

---

## Dependencies ✔️

### Dev Dependencies:
- tsx
- typescript
- @types/node
- vitest
- supertest
- @types/supertest

### Prod Dependencies:
- Fastify
- Knex
- sqlite3
- dotenv
- zod
- cookie

---

## Base URL
```
https://api.example.com/
```

---

## Authentication
This API uses cookies. To generate a cookie, you need to create a user in the application

---

## Endpoints

### 1. Create a User
**POST** `/users`

**Description:** Creates a new user.

#### Request
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
}
```

#### Response
**201 Created**
```json
{
  "id": "12345",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "createdAt": "2024-12-15T10:00:00Z"
}
```

---

### 2. Log a Meal
**POST** `/meals`

**Description:** Logs a meal for the authenticated user.

#### Request
```json
{
  "name": "Chicken Salad",
  "description": "Grilled chicken with fresh vegetables",
  "dateTime": "2024-12-15T12:30:00",
  "isOnDiet": true
}
```

#### Response
**201 Created**
```json
{
  "id": "67890",
  "name": "Chicken Salad",
  "description": "Grilled chicken with fresh vegetables",
  "dateTime": "2024-12-15T12:30:00Z",
  "isWithinDiet": true,
  "userId": "12345"
}
```

---

### 3. Get User Metrics
**GET** `/meals/metrics`

**Description:** Retrieves metrics for a specific user.

#### Response
**200 OK**
```json
{
    "metrics": {
        "bestOnDietSequence": 1,
        "meals": 1,
        "mealsOnDiet": 1,
        "mealsOffDiet": 0
    }
}
```

---

### 4. Get meals from a user
**GET** `/meals`

**Description:** Returns all meals that user logged

#### Response
**200 OK**
```json
{
    "meals": [
        {
            "id": "93643845-774a-4d27-8048-cc91672a6523",
            "date": 1734289200000,
            "name": "Breakfast",
            "is_on_diet": 1
        }
    ]
}
```

---

### 5. Get meal by ID
**GET** `/meals/{id}`

**Description:** Returns a specific meal that was informed in the URL

#### Response
**200 OK**
```json
{
    "meal": {
        "id": "93643845-774a-4d27-8048-cc91672a6523",
        "name": "Refeição 03",
        "desccription": "Descrição da refeição 03",
        "isOnDiet": 1,
        "date": 1734289200000
    }
}
```

---

### 6. Update meal
**PUT** `/meals/{id}`

**Description:** Updates information from a meal

#### Request
```json
{
  "name": "Chicken Salad",
  "description": "Grilled chicken with fresh vegetables",
  "dateTime": "2024-12-15T12:30:00",
  "isOnDiet": true
}
```

#### Response
**204 No Content**

---

### 7. Delete a Meal
**DELETE** `/meals/{mealId}`

**Description:** Deletes a specific meal created by the authenticated user.

#### Response
**204 No Content**

---

## Error Handling
Errors are returned in the following format:

#### Example Error Response
**400 Bad Request**
```json
{
  "message": "Error message"
}
```

---
