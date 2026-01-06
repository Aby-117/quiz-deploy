# Quiz App Frontend (Next.js)

This is the frontend of the Quiztastic application, built with Next.js, React, and TypeScript.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see backend README)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed deployment instructions.

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app directory (routing)
│   ├── components/       # React components
│   ├── contexts/         # React contexts (Auth)
│   ├── lib/              # Utility functions
│   └── pages/             # Page components
├── public/               # Static assets
└── package.json
```

