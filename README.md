[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/yvxsppkI)

# Programming Assignment 03 - Phreddit (Fake Reddit using express and mongoose)

In the sections below, list and describe each contribution briefly.

## Team Member 1 Contribution

<Yaseen Maqsudi>

## Completed Sections

### Backend Setup

- MongoDB schema created for:
  - `Community`
  - `Post`
  - `Comment`
  - `LinkFlair`
- `initializeDB.js` script used to seed sample data
- API endpoints implemented:
  - `GET /api/communities`
  - `GET /api/posts`

### ️ Frontend Setup

- React app initialized with custom styling
- Application layout includes:
  - `Banner` with site title, search bar, and "Create Post" button
  - `Navbar` listing all communities and navigation
  - Main content area for dynamic view rendering

### Home View

- Displays all posts across communities
- Sorting buttons for:
  - Newest
  - Oldest
  - Most active (recent comment)

### Community View

- Displays all posts in the selected community
- Shows community metadata:
  - Name
  - Description
  - Creation date
  - Member count
- Supports post sorting (newest, oldest, active)

### Search Results View

- Functional search bar in the `Banner`
- Filters posts by:
  - Title
  - Content
- Displays matching posts with sorting options

## Team Member 2 Contribution

<Gavin Levitt>

### Post View

- Displays post contents, metadata and comments
- Bbuttons for:
  - creating new comment
  - replies

### NewComment NewPost NewCommunity Views

- Displays all forms for creating new comments, posts, and communities
- initialization of metadata:
  - Name
  - Description
  - Creation date
  - Contents
  - Author/Username

### Phreddit.js

- React app initialized with custom styling
- Application layout includes:
  - `Banner` with site title, search bar, and "Create Post" button
  - `Navbar` listing all communities and navigation
  - Main content area for dynamic view rendering
 
### Routers

- provided post functions to routers
- got hyper-links working
- comments now searchable and appear on posts 
