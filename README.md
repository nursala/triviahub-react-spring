# TriviaHub — Quiz Creation & Playing Platform

A full-stack quiz platform built with a **React + TypeScript** frontend and a **Spring Boot (Java 25)** REST API backend. Users can browse quizzes, play timed quiz games, save their results, and compete on a global leaderboard. An admin panel provides full CRUD management of quizzes and questions.

## Authors

Developed by **Noor Salah** and **Amer Abu Sair** as university coursework. This is an independent portfolio copy; the original Classroom submission is preserved.

## Tech stack

* React 19 + TypeScript + Vite
* React Router v7 (`BrowserRouter`)
* Bootstrap 5 + react-bootstrap
* Spring Boot (Java 25)
* Java ObjectStreams for persistence
* No database is used in Assignment 2

---

## Features

* **Quiz Browser** (`/quizzes`) — browse all quizzes as cards showing title, category, question count, and a Play button. Includes a client-side title search box and a category filter.
* **Game Screen** (`/play/:quizId`) — timed gameplay with a progress bar, running stopwatch, attempt counter, one-time-per-question Hint button, and Quit confirmation modal.
* **Results Page** (`/results/:quizId`) — shows the player’s final score, correct answers, time taken, and hints used, alongside the quiz top-10 leaderboard.
* **Global Leaderboard** (`/leaderboard`) — shows the top 20 results across all quizzes, sortable by score, date, or player name.
* **Admin Panel** (`/admin`) — full CRUD for quizzes and questions, including validation, duplicate-title protection, and cascading delete.
* **Home** (`/`) — landing page with live platform statistics and navigation.
* **About** (`/about`) — app description and submitter names.
* **Error handling** — all user-facing messages are shown using Bootstrap `Alert`, `Toast`, or `Modal` components. `alert()` is not used anywhere.

---

## Architecture overview

### Frontend

The frontend is located under:

```text
frontend/
```

Pages are located under:

```text
frontend/src/Pages/
```

Reusable components are located under:

```text
frontend/src/Components/
```

Custom hooks are located under:

```text
frontend/src/hooks/
```

Context files are located under:

```text
frontend/src/context/
```

The frontend uses React Router with `BrowserRouter`. Data fetching is done with `useEffect`, and reusable logic is extracted into custom hooks where appropriate.

### Game state machine

The game flow is managed using a `useReducer` state machine through the custom hook:

```text
frontend/src/hooks/useQuizMachine.ts
```

The reducer manages the current question, selected answer, correct answer count, attempts, hint usage, elapsed time, and final result state.

### Backend

The backend is located under:

```text
src/main/java/com/example/demo/
```

Main backend packages:

```text
controller/
model/
service/
init/
```

The backend is a Spring Boot REST API. It stores data using Java ObjectStreams in `.ser` files. No SQL database, JPA, Hibernate, MariaDB, Docker, or external database service is required for Assignment 2.

### Persistence

The backend persists data in the following files at the project root:

```text
quizzes.ser
questions.ser
results.ser
```

The main persistence service is:

```text
src/main/java/com/example/demo/service/DataService.java
```

File operations are synchronized to protect against concurrent HTTP requests reading and writing the same `.ser` files.

---

## Score formula

The score is computed in:

```text
frontend/src/utils/scoreUtils.ts
```

Formula:

```text
accuracy     = correctAnswers / totalQuestions
speedFactor  = max(0.5, 1 - durationSeconds / (totalQuestions * 30))
hintPenalty  = 1 - (hintsUsed / totalQuestions) * 0.3
score        = round(accuracy * speedFactor * hintPenalty * 100)
```

The final score is clamped to the `0–100` range.

Explanation:

* Accuracy is the primary factor.
* Longer time reduces the score, but the penalty is capped.
* Each hint used reduces the score.
* The maximum possible score is 100.
* The score cannot go below 0.

---

## Compilation and run instructions

The backend should be run through the bundled **Maven Wrapper**.

This means a global Maven installation is not required for the backend build/run commands. Use the command format that matches your terminal.

Important notes:

* In **Windows PowerShell**, local scripts must be called with `.\`.
* In **Windows PowerShell**, the `-Dexec.mainClass=...` argument should be wrapped in quotes.
* In **Windows CMD**, use `mvnw.cmd`.
* In **macOS/Linux/Git Bash**, use `./mvnw`.

---

## Prerequisites

* Java 25 configured on `PATH` / `JAVA_HOME`
* Node.js and npm

---

## 1. Seed the data with `DataInit`

`DataInit` is a standalone Java class that recreates the seed data files:

```text
quizzes.ser
questions.ser
results.ser
```

Run it once from the project root before starting the backend.

### Windows PowerShell

```powershell
.\mvnw.cmd compile exec:java "-Dexec.mainClass=com.example.demo.init.DataInit"
```

### Windows CMD

```cmd
mvnw.cmd compile exec:java -Dexec.mainClass=com.example.demo.init.DataInit
```

### macOS / Linux / Git Bash

```bash
./mvnw compile exec:java -Dexec.mainClass=com.example.demo.init.DataInit
```

### Alternative if Maven is installed globally

```bash
mvn compile exec:java -Dexec.mainClass=com.example.demo.init.DataInit
```

For Windows PowerShell with global Maven:

```powershell
mvn compile exec:java "-Dexec.mainClass=com.example.demo.init.DataInit"
```

Running `DataInit` again overwrites the existing `.ser` files from scratch.

---

## 2. Build the Spring Boot backend

Run from the project root.

### Windows PowerShell

```powershell
.\mvnw.cmd clean package
```

### Windows CMD

```cmd
mvnw.cmd clean package
```

### macOS / Linux / Git Bash

```bash
./mvnw clean package
```

Expected result:

```text
BUILD SUCCESS
```

---

## 3. Run the Spring Boot backend

Run from the project root.

### Windows PowerShell

```powershell
.\mvnw.cmd spring-boot:run
```

### Windows CMD

```cmd
mvnw.cmd spring-boot:run
```

### macOS / Linux / Git Bash

```bash
./mvnw spring-boot:run
```

The backend starts on:

```text
http://localhost:8080
```

Keep this terminal open while using the frontend.

---

## 4. Run the React frontend

Open a second terminal.

```bash
cd frontend
npm install
npm run dev
```

The Vite development server usually starts on:

```text
http://localhost:5173
```

The frontend proxies `/api/*` requests to the Spring Boot backend on port `8080`.

The proxy configuration is located in:

```text
frontend/vite.config.ts
```

---

## Recommended clean-clone verification

After cloning the repository, the project should be testable with these commands.

### Windows PowerShell

```powershell
.\mvnw.cmd clean package
.\mvnw.cmd compile exec:java "-Dexec.mainClass=com.example.demo.init.DataInit"
.\mvnw.cmd spring-boot:run
```

Then, in a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

### Windows CMD

```cmd
mvnw.cmd clean package
mvnw.cmd compile exec:java -Dexec.mainClass=com.example.demo.init.DataInit
mvnw.cmd spring-boot:run
```

Then, in a second terminal:

```cmd
cd frontend
npm install
npm run dev
```

### macOS / Linux / Git Bash

```bash
./mvnw clean package
./mvnw compile exec:java -Dexec.mainClass=com.example.demo.init.DataInit
./mvnw spring-boot:run
```

Then, in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

---

## Other useful commands

### Frontend

Run from `frontend/`:

```bash
npm run build
npm run lint
npm run preview
```

### Backend

Run from the project root:

```bash
./mvnw -DskipTests compile
./mvnw test
```

On Windows PowerShell:

```powershell
.\mvnw.cmd -DskipTests compile
.\mvnw.cmd test
```

---

## Routes

| Route              | Page                                         |
| ------------------ | -------------------------------------------- |
| `/`                | Home — platform statistics and navigation    |
| `/quizzes`         | Quiz Browser — search, filter, and play      |
| `/play/:quizId`    | Game Screen — timed gameplay                 |
| `/results/:quizId` | Results — score summary and quiz leaderboard |
| `/leaderboard`     | Global Leaderboard — top 20 sortable results |
| `/admin`           | Admin Panel — quiz and question CRUD         |
| `/about`           | About — app description and submitters       |

---

## REST API overview

The backend exposes REST endpoints for:

### Quizzes

* List all quizzes with question count
* Get quiz by ID
* Create quiz
* Update quiz
* Delete quiz and all of its questions
* Reject duplicate quiz titles with HTTP `409 Conflict`

### Questions

* List questions for a quiz
* Return shuffled questions for gameplay
* Add question
* Update question
* Delete question

### Results

* Save game result
* Get global leaderboard
* Get quiz-specific leaderboard

The backend returns appropriate HTTP status codes such as:

```text
200 OK
201 Created
204 No Content
400 Bad Request
404 Not Found
409 Conflict
500 Internal Server Error
```

Errors are returned as JSON and raw stack traces are not exposed to the client.

---

## Error handling

| Situation                        | Behaviour                                                                                |
| -------------------------------- | ---------------------------------------------------------------------------------------- |
| Server unavailable at startup    | Quiz Browser shows an inline danger banner and disables Play buttons.                    |
| Quiz has 0 questions             | Game does not start; user is redirected back to Quiz Browser with a warning toast.       |
| Quiz deleted while browsing      | A 404 triggers graceful redirect to `/quizzes` with a toast notification.                |
| Server fails while saving result | Local results are still shown and a warning explains that the result could not be saved. |
| Duplicate quiz title in Admin    | API returns 409; the form shows an inline error and is not cleared.                      |

All user-facing messages use Bootstrap `Alert`, `Toast`, or `Modal`.

`alert()` is not used.

---

## Data model

### Quiz

```text
id          UUID, auto-generated
title       mandatory, non-empty
category    mandatory, lowercase a-z letters only
description optional
```

### Question

```text
id           UUID, auto-generated
quizId       quiz identifier
text         mandatory
options      exactly 4 non-empty answer choices
correctIndex 0–3
hint         optional
difficulty   easy | medium | hard
```

### GameResult

```text
id              UUID
quizId          quiz identifier
playerName      mandatory
score           0–100
correctAnswers  number of correct answers
totalQuestions  total number of questions
hintsUsed       number of used hints
durationSeconds game duration
playedAt        result timestamp
```

---

## Known limitations

* The backend requires a Java 25-compatible environment.
* Persistence uses Java ObjectStream-serialized `.ser` files instead of a database, as required by Assignment 2.
* The `.ser` file approach is protected with synchronized read-modify-write operations, but it is not intended as production-grade storage.
* The frontend and backend are started as two separate processes.
* There is no authentication on the Admin Panel, as permitted by the assignment brief.
