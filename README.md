# Task Dependency Management System

A full-stack web application for managing tasks with dependencies, featuring automatic status updates, circular dependency detection, and interactive graph visualization.

## Features

- ✅ Create, update, and delete tasks
- ✅ Add dependencies between tasks
- ✅ Automatic circular dependency detection
- ✅ Auto-update task status based on dependencies
- ✅ Interactive dependency graph visualization
- ✅ Real-time UI updates
- ✅ Responsive design with Tailwind CSS

## Tech Stack

### Backend
- Django 4.2
- Django REST Framework
- SQLite (easily configurable for MySQL/PostgreSQL)
- Django CORS Headers

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios for API calls
- Custom SVG-based graph visualization

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd task-dependency-manager/backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   # or
   source venv/bin/activate  # On macOS/Linux
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the Django server:
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd task-dependency-manager/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## API Endpoints

- `GET /api/tasks/` - List all tasks
- `POST /api/tasks/` - Create a new task
- `PATCH /api/tasks/{id}/` - Update a task
- `DELETE /api/tasks/{id}/` - Delete a task
- `POST /api/tasks/{id}/dependencies/` - Add a dependency
- `GET /api/tasks/graph/` - Get graph data for visualization

## Usage

1. Create tasks using the form on the left
2. Update task status using the dropdown
3. Add dependencies by expanding the "Dependencies" section
4. View the interactive graph on the right
5. Click on nodes in the graph to highlight dependencies

## Key Features Implementation

### Circular Dependency Detection
Uses DFS algorithm to detect cycles when adding new dependencies.

### Automatic Status Updates
Tasks automatically update status based on dependency completion:
- If all dependencies completed → in_progress
- If any dependency blocked → blocked
- Otherwise → pending

### Graph Visualization
Custom SVG-based hierarchical layout with zoom and pan functionality.

## Project Structure

```
task-dependency-manager/
├── backend/
│   ├── config/
│   ├── tasks/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── services/
│   │   └── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── graph/
│   │   ├── api/
│   │   └── hooks/
│   └── package.json
└── README.md
```