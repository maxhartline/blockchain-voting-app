# Blockchain Voting App

A secure voting application built with blockchain technology and a modern web frontend. This project demonstrates how blockchain can be used to create tamper-proof voting records while maintaining voter privacy through token-based authentication.

## Project Overview

The application consists of:
- **Backend**: Python Flask API with blockchain implementation
- **Frontend**: React SPA with Vite bundler
- **Database**: SQLite for voter and candidate storage
- **Blockchain**: Custom SHA-256 based blockchain for immutable vote recording

## Database

The application uses SQLite with two main tables:

### Voters Table
- `id`: Unique identifier
- `voter_name`: Name of the voter
- `date_of_birth`: DOB for identity verification
- `address`: Voter address
- `token`: Unique voting token (format: ABC123)
- `token_used`: Flag (0/1) indicating if token has been used

### Candidates Table
- `id`: Unique identifier
- `candidate_name`: Name of the candidate

**Default Candidates**: Doug Ford, Dwayne 'The Rock' Johnson, Zohran Mamdani, Bernie Sanders, Tim Houston

## Blockchain

The blockchain is a linked-list data structure where each block contains:
- **Previous Hash**: SHA-256 hash of the previous block
- **Timestamp**: Unix timestamp when block was created
- **Transactions**: Array of voting records
- **Block Hash**: SHA-256 hash of current block (input: transactions + previous_hash + timestamp)

**Features**:
- Genesis block initialized with predefined hash (64 zeros)
- Immutable records - any tampering breaks the chain validation
- Blockchain integrity validated after each vote

## Running the Server

### Prerequisites
- Python 3.7+
- Flask
- flask-cors

### Installation
```bash
pip install flask flask-cors
```

### Starting the Server
```bash
python server.py
```

The server runs on `http://127.0.0.1:5000` (port 5000) with debug mode enabled.

## Server Endpoints

### POST `/register`
Register a new voter and receive a voting token.

**Request Body**:
```json
{
  "name": "John Doe",
  "date_of_birth": "1990-01-15",
  "address": "123 Main St, Toronto, ON"
}
```

**Response**:
```json
{
  "success": true,
  "token": "ABC123",
  "message": "Registration successful. Please save your token."
}
```

**Status Codes**: 201 (success), 400 (validation error/already registered), 500 (server error)

---

### POST `/validate-token`
Validate a voting token before allowing access to the voting page.

**Request Body**:
```json
{
  "token": "ABC123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Token is valid. Proceed to vote."
}
```

**Status Codes**: 200 (valid), 400 (invalid/already used), 500 (server error)

---

### POST `/vote`
Submit a vote for a candidate.

**Request Body**:
```json
{
  "token": "ABC123",
  "selected_candidate": "Doug Ford"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Vote successfully added to the blockchain!"
}
```

**Status Codes**: 200 (success), 400 (validation error), 500 (server error)

---

### GET `/candidates`
Retrieve the list of all candidates.

**Response**:
```json
{
  "success": true,
  "candidates": ["Doug Ford", "Dwayne 'The Rock' Johnson", "Zohran Mamdani", "Bernie Sanders", "Tim Houston"]
}
```

**Status Codes**: 200 (success), 500 (server error)

---

### GET `/blockchain`
View the entire blockchain with all recorded votes.

**Response**:
```json
{
  "success": true,
  "blockchain": [
    {
      "block_index": 0,
      "previous_hash": "0000000000000000000000000000000000000000000000000000000000000000",
      "timestamp": 1702000000.123,
      "transactions": ["Genesis block"],
      "block_hash": "abc123..."
    },
    {
      "block_index": 1,
      "previous_hash": "abc123...",
      "timestamp": 1702000010.456,
      "transactions": ["User token ABC123 voted for Doug Ford"],
      "block_hash": "def456..."
    }
  ],
  "length": 2
}
```

**Status Codes**: 200 (success), 500 (server error)

## Using the UI

The frontend is a React application with three main pages:

### Welcome Page
- **Purpose**: Entry point for the application
- **Features**:
  - Token input field for returning voters
  - "Register" button to create a new voter account
  - Token validation before proceeding to voting

### Registration Page
- **Purpose**: Register a new voter
- **Fields Required**:
  - Full Name
  - Date of Birth
  - Address
- **Output**: Displays a unique voting token that must be saved for voting
- **Validation**: Prevents duplicate registration (same name + DOB)

### Vote Page
- **Purpose**: Cast a vote for a candidate
- **Features**:
  - Displays all available candidates
  - Allows selection of one candidate
  - Submits vote to blockchain
  - Shows success/error messages
  - "Back to Welcome" button to return

## Running the UI Locally

### Prerequisites
- Node.js 16+ and npm/yarn
- Server running on `http://127.0.0.1:5000`

### Installation
```bash
cd frontend
npm install
```

### Development Server
Start the development server with hot module reloading:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (default Vite port)

### Build for Production
```bash
npm run build
```

Compiled files are output to the `dist/` directory.

### Linting
Check for code quality issues:
```bash
npm run lint
```

### Preview Production Build
```bash
npm run preview
```

## Workflow

1. **User Registers**: Visitor fills out registration form → receives unique token
2. **User Validates Token**: Returns to welcome page → enters token → redirected to voting page
3. **User Votes**: Selects a candidate → vote is recorded on blockchain → token is marked as used
4. **Blockchain Integrity**: System validates chain after each vote to ensure no tampering
5. **View Results**: GET `/blockchain` displays all votes immutably recorded

## Key Features

**Blockchain Security**: Tamper-proof voting records using SHA-256 hashing  
**Token-Based Authentication**: One-time use tokens prevent double voting  
**Duplicate Prevention**: Database checks prevent same person registering twice  
**Chain Validation**: Automatic verification of blockchain integrity after each vote  
**CORS Enabled**: Cross-origin requests supported for frontend/backend separation  
**Responsive UI**: Clean, user-friendly voting interface  
**Immutable Audit Trail**: All votes permanently recorded on blockchain  

## Project Structure

```
blockchain-voting-app/
├── main.py              # Blockchain logic and vote casting
├── Block.py             # Block class definition
├── database.py          # Database operations (voters, candidates)
├── server.py            # Flask API endpoints
├── votes.db             # SQLite database (generated on first run)
└── frontend/
    ├── src/
    │   ├── App.jsx      # Main app component
    │   ├── pages/
    │   │   ├── WelcomePage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── VotePage.jsx
    │   └── index.css
    ├── package.json     # Frontend dependencies
    └── vite.config.js   # Vite configuration
```

## Technical Stack

- **Backend**: Python 3, Flask, SQLite
- **Frontend**: React 19, Vite, JavaScript/JSX
- **Blockchain**: Custom SHA-256 implementation
- **API**: RESTful JSON endpoints with CORS support
