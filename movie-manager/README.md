# Movie Management System:

## Description
A simple full-stack web application for managing movies and genres using Node.js, Express, MySQL, and a simple frontend.

---

## Features
- CRUD operations for movies
- Add/view genres
- Relation between movies and genres
- REST API backend
- Simple frontend UI

---

## Tech Stack
Node.js, Express.js, MySQL, HTML, CSS, JavaScript

---

## Project Structure
movie-project/
├── backend/
│   ├── index.js
│   └── package.json
├── frontend/
│   └── index.html
├── database/
│   └── movie_db.sql
└── README.md

---

## Setup

### Install dependencies
npm install

### Run server
node index.js

Server runs on:
http://localhost:3000

### Frontend
Open frontend/index.html in browser

### Database
Import movie_db.sql into MySQL (movie_db)

---

## API

Movies:
GET /movies
POST /movies
DELETE /movies/:id

Genres:
GET /genres
POST /genres

---

## Tables
movies(id, title, year, genre_id)
genres(id, name)

---

##  Author
Student Project – ITWS Course