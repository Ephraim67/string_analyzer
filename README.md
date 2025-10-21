## 🧠String Analyzer API

A RESTful API service that analyzes strings and stores their computed properties — built with **Node.js**, **Express**, and **MongoDB**.



### 🚀 Features

* Analyze any string and compute:

  * `length`: Total number of characters
  * `is_palindrome`: Whether the string reads the same forwards and backwards
  * `unique_characters`: Count of distinct characters
  * `word_count`: Number of words separated by whitespace
  * `sha256_hash`: Unique hash identifier for each string
  * `character_frequency_map`: Count of each character’s occurrences
* Retrieve analyzed strings by value or hash
* Filter stored strings with query parameters
* Natural language filtering (e.g. *“all single word palindromic strings”*)
* Secure with rate limiting, Helmet, and CORS
* Clean and modular architecture (controllers, services, utils, routes)

---

### 🏗️ Tech Stack

* **Node.js + Express.js** — Backend framework
* **MongoDB + Mongoose** — Database layer
* **Helmet** — Secures HTTP headers
* **CORS** — Handles cross-origin requests
* **express-rate-limit** — Prevents request flooding
* **dotenv** — Environment variable management
* **morgan** — HTTP request logging

---

### 📁 Folder Structure

```
string_analyzer/
├── config/
│   └── db.js
├── src/
│   ├── app.js
│   ├── controllers/
│   │   └── stringController.js
│   ├── models/
│   │   └── stringModel.js
│   ├── routes/
│   │   └── stringRoutes.js
│   ├── services/
│   │   └── stringService.js
│   └── utils/
│       ├── computeProperties.js
│       └── hashHelper.js
├── server.js
├── package.json
└── README.md
```

---

### ⚙️ Setup Instructions

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Ephraim67/string_analyzer.git
cd string_analyzer
```

#### 2️⃣ Install Dependencies

```bash
npm install
```

#### 3️⃣ Create a `.env` File

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

#### 4️⃣ Start the Server

Development mode (auto-restart with Nodemon):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Server should start at:

```
http://localhost:3000/
```

---

### 🔍 API Endpoints

#### 1. **POST** `/api/strings`

Analyze and store a string.

**Request Body**

```json
{
  "value": "string to analyze"
}
```

**Success (201)**

```json
{
  "id": "sha256_hash_value",
  "value": "string to analyze",
  "properties": {
    "length": 17,
    "is_palindrome": false,
    "unique_characters": 12,
    "word_count": 3,
    "sha256_hash": "abc123...",
    "character_frequency_map": {
      "s": 2,
      "t": 3
    }
  },
  "created_at": "2025-10-18T12:00:00Z"
}
```

**Error Codes**

* `400`: Missing `"value"` field
* `422`: Value is not a string
* `409`: String already exists

---

#### 2. **GET** `/api/strings/:string_value`

Fetch a specific analyzed string.

**Error**

* `404`: String not found

---

#### 3. **GET** `/api/strings`

Fetch all strings with optional filters:

```
/api/strings?is_palindrome=true&min_length=5&max_length=20&word_count=2&contains_character=a
```

**Error**

* `400`: Invalid query parameter type

---

#### 4. **GET** `/api/strings/filter-by-natural-language?query=all single word palindromic strings`

Uses NLP-style filtering.

**Examples**

* “all single word palindromic strings” → `word_count=1, is_palindrome=true`
* “strings longer than 10 characters” → `min_length=11`
* “strings containing the letter z” → `contains_character=z`

**Errors**

* `400`: Unable to parse query
* `422`: Conflicting query filters

---

#### 5. **DELETE** `/api/strings/:string_value`

Delete a specific string record.

**Success**

* `204`: No content

**Error**

* `404`: String not found

---

### 🧩 Environment Variables

| Variable    | Description               | Example           |
| ----------- | ------------------------- | ----------------- |
| `PORT`      | Server port               | 3000              |
| `MONGO_URI` | MongoDB connection string | mongodb+srv://... |



### Testing the API

You can test the API using:

* [Postman](https://www.postman.com/)
* [cURL](https://curl.se/)
* [Hoppscotch](https://hoppscotch.io)

Example:

```bash
curl -X POST http://localhost:3000/api/strings \
-H "Content-Type: application/json" \
-d '{"value": "madam"}'
```



### Dependencies

```
express
mongoose
helmet
cors
morgan
express-rate-limit
dotenv
```



### Author

**Ephraim Norbert**
💼 Backend Developer — Fintech & API Systems
📧 [norbert.ephraim0@gmail.com]
🌍 [https://github.com/Ephraim67](https://github.com/Ephraim67)


