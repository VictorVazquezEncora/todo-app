<h1 align="center">
  <a href="#"> Todo App Frontend </a>
</h1>

<h3 align="center">A modern React-based Todo application with advanced features!</h3>

<p align="center">
  <img alt="React Version" src="https://img.shields.io/badge/react-18.3.1-blue">
  <img alt="TypeScript" src="https://img.shields.io/badge/typescript-5.5.3-blue">
  <img alt="Tailwind" src="https://img.shields.io/badge/tailwind-3.4-blueviolet">
</p>

## About

Todo App is a modern web application built with React and TypeScript. It provides an interface for managing todos with features like filtering, sorting, and priority management. The UI is built with shadcn/ui components and styled with Tailwind CSS for a clean, professional look.

---

## Features

- Create, edit, and delete todos
- Priority-based task management (High, Medium, Low)
- Due date assignment and tracking
- Advanced filtering and search capabilities
- Task status management (Done/Undone)
- Dark/Light theme support
- Pagination for large task lists
- Performance metrics dashboard

---

## How it works

The project is divided into two parts:

1. Backend (Spring Boot API)
2. Frontend (This React application)

### Pre-requisites

Before you begin, you will need to have the following tools installed on your machine:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Git](https://git-scm.com)
- A code editor like [VSCode](https://code.visualstudio.com/)

#### Running the web application

```bash
# Clone this repository
$ git clone <your-repo-url>

# Access the project folder
$ cd todo-app/frontend

# Install dependencies
$ npm install

# Run the development server
$ npm run dev

# The application will open on port 8080 - go to http://localhost:8080
```

---

## Tech Stack

The following tools were used in the construction of the project:

#### **Core** ([React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/))

- **[Vite](https://vitejs.dev/)** - Build tool and development server
- **[React Router Dom](https://reactrouter.com/)** - Routing
- **[Axios](https://axios-http.com/)** - HTTP client
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[shadcn/ui](https://ui.shadcn.com/)** - UI Components
- **[date-fns](https://date-fns.org/)** - Date utilities

#### **Development Tools**

- **[TypeScript](https://www.typescriptlang.org/)**
- **[ESLint](https://eslint.org/)**
- **[Jest](https://jestjs.io/)**
- **[Testing Library](https://testing-library.com/)**

> See the file [package.json](package.json) for all dependencies

#### **Component Architecture**

The application follows a feature-based architecture:
- `components/` - Reusable UI components
- `features/` - Feature-specific components and logic
- `context/` - React context providers
- `services/` - API communication
- `utils/` - General purpose functions
- `lib/` - Adapter patterns to avoid tight coupling with 3rd party libraries

#### **Styling**

- Uses Tailwind CSS for utility-first styling
- Uses ShadCN as the component library
- Dark mode support
- Animation utilities
