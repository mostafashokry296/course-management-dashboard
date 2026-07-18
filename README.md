# Course Management Dashboard

A small Angular application for managing educational courses: list, search, filter, create, edit, delete, and view course details. The app supports English/Arabic (RTL) and Light/Dark mode.

## Technologies Used

- Angular 21 (Standalone Components)
- TypeScript
- Reactive Forms
- Angular Router (lazy-loaded feature routes)
- Angular Material (Table, Paginator, Form Fields, Select, Card, Buttons, Spinner, Icons)
- Tailwind CSS
- Font Awesome
- JSON Server (Mock API)
- Custom EN / AR i18n with RTL support
- Light / Dark theme (CSS variables + `localStorage`)

## Features Implemented

- View courses in a responsive Angular Material table or cards layout
- Search courses by name
- Filter courses by status (Active / Draft / Archived)
- Sort courses by name, price, or created date
- Angular Material pagination
- Add a new course
- Edit an existing course
- Delete a course with a confirmation modal
- View course details
- Reactive form validation with Material field error messages
- Loading skeleton / spinner, empty, and error states
- Toast notifications
- English / Arabic language toggle with RTL layout
- Light / Dark mode toggle from the header
- Theme preference persisted in `localStorage`
- Falls back to the system preferred color scheme when no saved theme exists

## How to Run the Project

### 1. Install dependencies

```bash
npm install
```

### 2. Start the Mock API

```bash
npm run mock-api
```

This starts JSON Server on `http://localhost:3000` using `db.json`.

### 3. Start the Angular app

In a second terminal:

```bash
npm start
```

Open `http://localhost:4200/`.

> Both servers must run together for full CRUD functionality.

## Mock API Explanation

The app uses **JSON Server** as a mock REST API.

- Data file: `db.json`
- Base URL: `http://localhost:3000/courses`
- Supported operations: `GET`, `POST`, `PUT`, `DELETE`

Make sure the mock API is running before using create / edit / delete / list features.

## Theme (Light / Dark Mode)

- Toggle the theme from the sun/moon button in the header
- The selected theme is saved in `localStorage` under `course-manager-theme`
- On first visit, the app uses the system preference (`prefers-color-scheme`)
- Theme colors are managed with CSS variables and applied across list, form, details, table, dialogs, and Material components

## Project Structure

```text
src/app/
  core/
    guards/               Shared guards (unsaved changes)
    services/             Toast, translation, theme, paginator i18n
  shared/
    components/           Header, toast, confirm dialog, data table
    pipes/                Translate pipe
  features/courses/
    guards/               Course exists guard
    resolvers/            Course data resolver
    models/               Course interfaces
    services/             Courses API service
    pages/                List, form, details pages
    courses.routes.ts     Feature routes (lazy-loaded)
```

## Bonus Features

- Angular Material pagination (with EN/AR labels)
- Sorting
- Confirmation modal
- Toast notifications
- Lazy-loaded courses feature
- Loading skeleton / spinner
- EN / AR i18n + RTL
- Reusable Angular Material table component (with cards/table view toggle)
- Route guards (`courseExistsGuard`, `unsavedChangesGuard`)
- Unit tests for services, guards, forms, list logic, and shared components
- Scalable feature-based folder structure
- Material UI across list, form, and details screens
- Light / Dark mode with CSS variables and Material `color-scheme` support

## Assumptions

- Course statuses are limited to: Active, Draft, Archived
- Created date is set automatically when adding a course
- Currency is displayed as EGP
- No authentication is required for this assignment

## Scripts

| Command | Description |
|---|---|
| `npm start` | Run Angular dev server |
| `npm run mock-api` | Run JSON Server on port 3000 |
| `npm run build` | Production build |
| `npm test` | Unit tests |
