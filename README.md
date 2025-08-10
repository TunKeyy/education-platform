# English Education Platform

A comprehensive full-stack application for English language learning with AI assistance, moderation, and community features.

## Project Structure

```
education-platform/
├── backend/          # NestJS API Server
│   ├── src/          # Source code
│   ├── prisma/       # Database schema and migrations
│   ├── test/         # Test files
│   └── docs/         # API documentation
└── frontend/         # ReactJS Web Application (To be implemented)
```

## Backend (NestJS API)

The backend is a robust NestJS application with 12 comprehensive modules:

### 🔧 Core Modules
- **Authentication** - JWT-based auth with role-based access control
- **Users** - User management and profiles
- **Posts** - Content creation and management
- **Comments** - Threaded discussions
- **Votes** - Upvoting/downvoting system

### 📚 Educational Features
- **Taxonomy** - Learning levels, skills, and categories
- **Search** - Advanced content discovery
- **Media** - File upload and management
- **Learning Artifacts** - Educational resources and tracking
- **AI Assist** - AI-powered learning assistance

### 🛡️ Moderation & Admin
- **Moderation** - Content moderation and reporting
- **Admin** - System administration and analytics

### 🚀 Getting Started with Backend

```bash
cd backend
npm install
npm run build
npm run start:dev
```

For detailed backend setup instructions, see [backend/EDUCATION_PLATFORM_SETUP.md](backend/EDUCATION_PLATFORM_SETUP.md)

### 📡 API Documentation
- **Postman Collection**: [backend/postman_collection.json](backend/postman_collection.json)
- **API Docs**: [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md)
- **Database Schema**: [backend/DATABASE_SCHEMA_OVERVIEW.md](backend/DATABASE_SCHEMA_OVERVIEW.md)

## Frontend (ReactJS) - Coming Soon

The frontend will be a modern ReactJS application that integrates with the backend APIs to provide:

- **Student Dashboard** - Learning progress and recommendations
- **Content Creation** - Rich text editor for posts and comments
- **AI Chat Interface** - Interactive learning assistance
- **Community Features** - Social learning and discussions
- **Admin Panel** - System management interface

### Planned Frontend Tech Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Query** for API state management
- **React Router** for navigation
- **React Hook Form** for form handling

## Development

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Environment Setup
1. Clone the repository
2. Set up backend (see backend/README.md)
3. Set up frontend (instructions coming soon)

## Features

### ✅ Implemented (Backend)
- Complete REST API with 80+ endpoints
- JWT authentication and authorization
- Role-based access control (Admin, Moderator, User)
- Database with Prisma ORM
- File upload and media management
- AI integration for learning assistance
- Content moderation system
- Advanced search and filtering
- Real-time notifications (via WebSocket)
- Comprehensive test coverage

### 🚧 In Development (Frontend)
- User interface for all backend features
- Responsive design for mobile and desktop
- Real-time updates and notifications
- Rich content editor
- Interactive learning tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions and support, please open an issue in the GitHub repository.