# Product Catalog App

A modern React Native mobile application built with Expo for managing and browsing a product catalog. Features user authentication, product management, advanced filtering, and a beautiful custom UI with floating action buttons.

## 📱 Project Overview

This app provides a complete solution for product catalog management with features like:
- **User Authentication**: Secure login/signup with form validation
- **Product Management**: Add, edit, delete, and view products
- **Advanced Search & Filtering**: Find products quickly with multiple filter options
- **Custom UI**: Beautiful design with custom tab bar and floating action button
- **Responsive Design**: Works seamlessly across different device sizes

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (v6 or higher)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd test.mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Install the **Expo Go** app on your phone
   - Scan the QR code displayed in the terminal
   - Or press `a` for Android emulator or `i` for iOS simulator

### Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Start on Android emulator
npm run ios        # Start on iOS simulator
npm run web        # Start web version
npm test           # Run tests
```

## 🏗️ Project Architecture

### Directory Structure

```
test.mobile/
├── App.tsx                 # Main app entry point
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── assets/                # Images, fonts, and static files
├── components/            # Reusable UI components
│   ├── ErrorMessage.tsx   # Error display component
│   ├── FormInput.tsx      # Form input component
│   ├── LoadingSpinner.tsx # Loading indicator
│   ├── ProductItem.tsx    # Product card component
│   └── ...
├── contexts/              # React Context providers
│   ├── AuthContext.tsx    # Authentication state management
│   └── ProductContext.tsx # Product data management
├── hooks/                 # Custom React hooks
├── navigation/            # Navigation configuration
│   └── RootNavigator.tsx  # Main navigation setup
├── screens/               # App screens
│   ├── LoginScreen.tsx    # User authentication
│   ├── HomeScreen.tsx     # Product catalog
│   ├── AddProductScreen.tsx # Product creation
│   └── ...
├── services/              # API and external services
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
│   ├── validation.ts      # Form validation
│   └── errorHandling.ts   # Error handling utilities
└── constants/             # App constants and themes
```

### Key Technologies

- **React Native 0.79.4** - Cross-platform mobile development
- **Expo SDK 53** - Development platform and tools
- **TypeScript 5.8** - Type-safe JavaScript
- **React Navigation 7** - Navigation library
- **React Context** - State management
- **React Native Elements** - UI component library

## ✨ Key Features

### 🔐 Authentication System
- **Secure Login/Signup**: Email and password authentication
- **Form Validation**: Real-time validation with user-friendly error messages
- **Session Management**: Persistent login state with AsyncStorage
- **Auto-redirect**: Automatic navigation based on authentication status

### 📦 Product Management
- **CRUD Operations**: Create, read, update, and delete products
- **Product Details**: Rich product information with status badges
- **Image Support**: Product image handling with Expo Image Picker
- **User-specific Products**: Products are associated with authenticated users

### 🔍 Search & Filtering
- **Advanced Search**: Search by product name, description, category, or seller
- **Filter Modal**: Multiple filter options (category, price range, status)
- **Pagination**: Efficient loading of large product lists
- **Real-time Results**: Instant search results as you type

### 🎨 Custom UI Components
- **Floating Action Button**: Quick access to add new products
- **Custom Tab Bar**: Beautiful tab navigation with central notch design
- **Status Badges**: Visual indicators for product status
- **Loading States**: Smooth loading indicators throughout the app
- **Error Handling**: User-friendly error messages and recovery

### 📱 Responsive Design
- **Cross-platform**: Works on iOS, Android, and Web
- **Safe Area Support**: Proper handling of device notches and status bars
- **Adaptive Layout**: Responsive design for different screen sizes
- **Touch-friendly**: Optimized for mobile interaction

## 🛠️ Technical Decisions

### Why Expo?
- **Rapid Development**: Quick setup and development workflow
- **Cross-platform**: Single codebase for iOS, Android, and Web
- **Rich Ecosystem**: Access to native device features through Expo SDK
- **Easy Deployment**: Simple build and deployment process
- **Over-the-air Updates**: Update app without app store approval

### Why React Context over Redux?
- **Simplicity**: Easier to understand and implement for smaller apps
- **Built-in**: No additional dependencies required
- **Performance**: Sufficient for the app's state management needs
- **TypeScript Support**: Excellent TypeScript integration
- **Learning Curve**: Easier for developers new to state management

### Why React Navigation?
- **Native Performance**: Uses native navigation components
- **Type Safety**: Excellent TypeScript support
- **Flexibility**: Supports complex navigation patterns
- **Active Development**: Well-maintained with regular updates
- **Community**: Large community and extensive documentation

### Why TypeScript?
- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Enhanced autocomplete and refactoring
- **Documentation**: Types serve as inline documentation
- **Maintainability**: Easier to maintain and refactor code
- **Team Collaboration**: Better code understanding across team members

## 🧩 Major Components

### Authentication Components

#### `AuthContext.tsx`
Manages user authentication state and provides login/logout functionality.

```typescript
// Key features:
- User session management
- AsyncStorage persistence
- Loading and error states
- Form validation integration
```

#### `LoginScreen.tsx` & `SignupScreen.tsx`
User authentication screens with comprehensive form validation and error handling.

```typescript
// Features:
- Real-time form validation
- User-friendly error messages
- Loading states during authentication
- Automatic redirection after login
```

### Product Management Components

#### `ProductContext.tsx`
Centralized product data management with CRUD operations and user-specific filtering.

```typescript
// Key methods:
- fetchProducts(): Load all products
- addProduct(): Create new product
- updateProduct(): Modify existing product
- deleteProduct(): Remove product
- getUserProducts(): Filter by user
- searchProducts(): Search functionality
```

#### `ProductItem.tsx`
Reusable product card component with status badges and action buttons.

```typescript
// Features:
- Product image display
- Status badge indicators
- Action buttons (edit/delete)
- Responsive layout
- Touch feedback
```

#### `ProductDetailScreen.tsx`
Detailed product view with full information and editing capabilities.

```typescript
// Features:
- Complete product information
- Image gallery support
- Edit/delete actions
- Status management
- User-specific actions
```

### UI Components

#### `CustomTabBar`
Custom bottom tab navigation with floating action button and central notch design.

```typescript
// Features:
- Floating action button for quick add
- Custom SVG notch design
- Smooth animations
- Platform-specific styling
```

#### `FilterModal.tsx`
Advanced filtering interface with multiple filter options.

```typescript
// Filter options:
- Category selection
- Price range slider
- Status filters
- Search integration
- Reset functionality
```

#### `ErrorMessage.tsx`
Reusable error display component with different message types.

```typescript
// Message types:
- Error (red)
- Warning (orange)
- Info (blue)
- Auto-dismiss functionality
```

## 📱 Testing the App

### Physical Device Testing

1. **Install Expo Go**
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Connect to Development Server**
   ```bash
   npx expo start
   ```

3. **Scan QR Code**
   - iOS: Use Camera app
   - Android: Use Expo Go app

### Emulator Testing

#### Android Emulator
```bash
# Start Android emulator first, then:
npx expo start --android
```

#### iOS Simulator (macOS only)
```bash
# Start iOS simulator first, then:
npx expo start --ios
```

### Web Testing
```bash
npx expo start --web
```

## 🔧 Development Workflow

### Code Structure Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Use TypeScript interfaces for props
   - Implement proper error boundaries

2. **State Management**
   - Use Context for global state
   - Local state for component-specific data
   - Proper loading and error states

3. **Navigation**
   - Type-safe navigation with TypeScript
   - Proper screen organization
   - Authentication guards

4. **Error Handling**
   - Comprehensive error boundaries
   - User-friendly error messages
   - Proper error logging

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Jest**: Unit testing framework
- **Prettier**: Code formatting

## 🚀 Future Improvements

### Planned Features

- [ ] **Push Notifications**: Real-time product updates
- [ ] **Offline Support**: Offline-first architecture with sync
- [ ] **Image Optimization**: Lazy loading and compression
- [ ] **Advanced Analytics**: User behavior tracking
- [ ] **Social Features**: Product sharing and comments
- [ ] **Payment Integration**: In-app purchases
- [ ] **Multi-language Support**: Internationalization
- [ ] **Dark Mode**: Theme switching capability

### Technical Enhancements

- [ ] **Performance Optimization**: React.memo and useMemo usage
- [ ] **Testing Coverage**: Comprehensive unit and integration tests
- [ ] **CI/CD Pipeline**: Automated testing and deployment
- [ ] **Code Splitting**: Lazy loading of screens
- [ ] **Bundle Optimization**: Reduced app size
- [ ] **Accessibility**: Screen reader support

### Architecture Improvements

- [ ] **API Integration**: Replace mock data with real backend
- [ ] **Caching Strategy**: Implement proper data caching
- [ ] **State Persistence**: Enhanced offline capabilities
- [ ] **Error Monitoring**: Crash reporting and analytics
- [ ] **Performance Monitoring**: App performance tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the 0BSD License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the [Expo documentation](https://docs.expo.dev/)
- Review [React Native documentation](https://reactnative.dev/)

---

**Built with ❤️ using React Native and Expo** 