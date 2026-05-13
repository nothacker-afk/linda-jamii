# 🗄️ LindaJamii Database Schema (ERD)

This schema is translated from the advanced ERD structure for community engagement and safety.

## 1. Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique user identifier |
| username | VARCHAR(50) | Unique display name |
| phone_number | VARCHAR(15) | Verified phone number |
| password_hash | TEXT | Bcrypt hashed password |
| role | ENUM | USER, WARDEN, ADMIN |
| neighbourhood_id | UUID (FK) | Link to Neighbourhoods table |
| created_at | TIMESTAMP | Account creation time |

## 2. Posts Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique post identifier |
| user_id | UUID (FK) | Author of the post |
| content | TEXT | Post body |
| image_url | TEXT | Optional image link |
| type | ENUM | GENERAL, INCIDENT, ALERT |
| created_at | TIMESTAMP | Post time |

## 3. Comments Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique comment identifier |
| post_id | UUID (FK) | Link to parent post |
| user_id | UUID (FK) | Author of the comment |
| content | TEXT | Comment body |
| created_at | TIMESTAMP | Comment time |

## 4. Followers Table
| Column | Type | Description |
|--------|------|-------------|
| follower_id | UUID (FK) | User who follows |
| following_id | UUID (FK) | User being followed |
| created_at | TIMESTAMP | Follow time |

## 5. Likes Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique like identifier |
| user_id | UUID (FK) | User who liked |
| target_id | UUID (FK) | ID of Post or Comment |
| target_type | ENUM | POST, COMMENT |

## 6. Chats & Messages
### Chats Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique chat identifier |
| type | ENUM | DIRECT, GROUP |
| created_at | TIMESTAMP | Chat creation time |

### Messages Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique message identifier |
| chat_id | UUID (FK) | Link to Chat |
| sender_id | UUID (FK) | Link to User |
| content | TEXT | Message body |
| is_read | BOOLEAN | Read status |
| created_at | TIMESTAMP | Send time |

## 7. Notifications Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique notification identifier |
| user_id | UUID (FK) | Recipient |
| type | ENUM | LIKE, COMMENT, FOLLOW, ALERT |
| reference_id | UUID | ID of related entity |
| is_seen | BOOLEAN | Seen status |
| created_at | TIMESTAMP | Generation time |

---

## SQL Table Definitions (PostgreSQL)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE neighbourhoods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    neighbourhood_id UUID REFERENCES neighbourhoods(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    post_type VARCHAR(20) DEFAULT 'GENERAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE followers (
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    target_id UUID NOT NULL,
    target_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_type VARCHAR(20) DEFAULT 'DIRECT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    notif_type VARCHAR(20) NOT NULL,
    reference_id UUID,
    is_seen BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
