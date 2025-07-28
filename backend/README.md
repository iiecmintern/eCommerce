# CommerceForge Backend

Backend API for the CommerceForge e-commerce platform built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp env.example .env
```

3. Update the `.env` file with your MongoDB connection string and other configuration.

4. Start the development server:

```bash
npm run dev
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

## API Endpoints

- `GET /` - Health check endpoint

## Database

The application uses MongoDB as the primary database. Make sure MongoDB is running locally or update the `MONGODB_URI` in your `.env` file to point to your MongoDB instance.
