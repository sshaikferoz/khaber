# KHABER Chatbot - Component Structure

A React-based AI-powered procurement and service classification chatbot with organized, reusable components.

## 📁 Project Structure

```
src/
├── KhaberChatbot.js           # Main component
├── App.js                     # Application entry point
├── components/
│   ├── index.js              # Component exports
│   ├── Skeletons.js          # Loading skeleton components
│   ├── ResponseViews.js      # API response display components
│   ├── Modals.js             # Modal dialogs
│   ├── UI/
│   │   └── index.js          # UI utility components
│   └── Chat/
│       └── index.js          # Chat-related components
├── utils/
│   ├── storage.js            # Storage utilities
│   ├── mockApi.js            # Mock API functions
│   └── constants.js          # Application constants
└── package.json              # Dependencies
```

## 🧩 Component Breakdown

### Core Components

#### `KhaberChatbot.js`

Main component that orchestrates the entire application:

- State management
- API workflow execution
- Chat thread management
- PDF processing
- Component coordination

### UI Components (`components/UI/index.js`)

#### `ExistingServicesCarousel`

Displays existing services with navigation controls.

#### `SelectedItemsCard`

Expandable card showing selected service items with summary.

#### `VersionSelector`

Allows switching between different result variants.

#### `SelectionHelpCard`

Provides guidance when no selections are made.

#### `ChainOfThoughtStep`

Individual step display in the AI processing pipeline.

### Chat Components (`components/Chat/index.js`)

#### `ChatThreadSidebar`

- Manages multiple chat conversations
- Thread creation, deletion, selection
- Pipeline history indicators

#### `CompactPipelineHistory`

- Displays generation history
- Expandable details view
- Timestamp and query information

#### `ServiceClassTable`

- Main results display table
- Service selection interface
- Radio buttons for matching/new choices
- Carousel integration

#### `ReviewScreen`

- Final review before submission
- Selected items summary
- Confirmation interface

### Response Views (`components/ResponseViews.js`)

#### `CategoriesView`

Displays predicted service categories with status.

#### `TypesView`

Shows service types with reasoning and associated classes.

#### `ClassesView`

Detailed service class information in grid format.

#### `TextGenerationView`

Generated text results with existing services comparison.

### Modals (`components/Modals.js`)

#### `ResponseDetailsModal`

Detailed view of API responses with step-specific rendering.

#### `ServiceClassInfoDialog`

Comprehensive service class information with carousel details.

### Skeleton Components (`components/Skeletons.js`)

Loading states for various UI elements:

- `SkeletonRow`, `SkeletonTable`
- `ItemSkeletonRow`
- `LoadingSpinner`

### Utilities

#### `storage.js`

Session storage management:

- Chat threads persistence
- Current chat state
- Variants storage
- Pipeline history

#### `mockApi.js`

Mock API functions:

- Service prediction endpoints
- Response generation
- Duplicate removal utilities

#### `constants.js`

Application-wide constants:

- Storage keys
- Chain steps configuration
- UI configurations
- Color schemes

## 🚀 Usage

```jsx
import KhaberChatbot from "./KhaberChatbot";

function App() {
  return (
    <div className="App">
      <KhaberChatbot />
    </div>
  );
}
```

## 🎯 Key Features

### Chat Management

- Multiple conversation threads
- Persistent chat history
- Thread switching and deletion

### AI Processing Pipeline

- Step-by-step service classification
- Visual progress indicators
- Detailed response viewing

### Service Selection

- Interactive service table
- Existing vs new service options
- Carousel for service alternatives

### File Processing

- PDF text extraction
- Multi-file attachment support
- Content integration

### Version Control

- Multiple result variants
- Version switching
- Historical comparisons

## 🛠️ Development Notes

### State Management

The main component uses React hooks for state management:

- Chat threads and current selection
- API responses and processing steps
- Service selections and review data
- UI states (modals, expandables, loading)

### Storage Strategy

Uses sessionStorage for persistence:

- Chat threads maintain conversation history
- Variants allow result versioning
- Current chat ID for session continuity

### Component Communication

Props-based communication with clear interfaces:

- Event handlers passed down
- State lifted to main component
- Modular component design

### Styling

Tailwind CSS classes for:

- Responsive design
- Component styling
- Animations and transitions
- Color theming

## 📋 Dependencies

- React 18.2.0
- lucide-react 0.263.1 (icons)
- tailwindcss 3.3.0 (styling)

## 🔧 Customization

### Adding New Components

1. Create component in appropriate folder
2. Export from index.js
3. Import in main component
4. Add to component hierarchy

### Extending API

1. Add new endpoints in `mockApi.js`
2. Update chain steps in `constants.js`
3. Create corresponding response views
4. Update main workflow logic

### Styling Changes

- Modify Tailwind classes
- Update color constants
- Adjust responsive breakpoints
- Customize animations

This modular structure ensures maintainability, reusability, and clear separation of concerns while preserving all original functionality.
