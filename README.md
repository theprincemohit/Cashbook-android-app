# React Native Material Design 3 App 👋

A modern React Native mobile application with Material Design 3 components built using Expo and React Native Paper.

## Features

- ✅ **Material Design 3 Components** - Full suite of MD3 components via React Native Paper
- ✅ **Dark/Light Theme Support** - Automatic theme switching based on device preferences
- ✅ **TypeScript** - Full type safety and better developer experience
- ✅ **Expo Router** - Modern file-based routing for navigation
- ✅ **Pre-built Components** - Material Button, Card, and Input components with examples

## Project Structure

```
mobile-app/
├── app/                    # Expo Router pages and layouts
│   ├── (tabs)/            # Tab-based navigation screens
│   ├── modal.tsx          # Modal screen example
│   └── _layout.tsx        # Root layout with Material Provider
├── components/            # Reusable Material Design components
│   ├── MaterialButton.tsx  # Customizable MD3 button
│   ├── MaterialCard.tsx    # MD3 card component
│   ├── MaterialInput.tsx   # MD3 text input
│   └── ui/                # Additional UI components
├── constants/             # App constants and theme colors
├── hooks/                 # Custom React hooks
├── assets/                # Images and static assets
└── package.json           # Dependencies and scripts
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional, will be installed via npx)

## Installation

1. Install dependencies

   ```bash
   npm install
   ```

## Getting Started

### Development

Start the development server:

```bash
npm start
# or
npx expo start
```

### Running on Different Platforms

**Web**
```bash
npm run web
```

**Android**
```bash
npm run android
```
*Requires Android Studio and emulator setup*

**iOS**
```bash
npm run ios
```
*macOS and Xcode required*

**Expo App (Easiest)**
- Install the Expo Go app on your phone
- Scan the QR code from the terminal

## Available Scripts

- `npm start` - Start the development server
- `npm run web` - Run on web browser
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run lint` - Run ESLint
- `npm run reset-project` - Reset to initial template state

## Material Design Components

### MaterialButton
Customizable Material Design button with multiple variants:

```tsx
import { MaterialButton } from '@/components/MaterialButton';

<MaterialButton 
  label="Click me" 
  onPress={() => alert('Pressed!')}
  mode="contained"
  icon="check"
/>
```

### MaterialCard
Material Design card component for displaying content:

```tsx
import { MaterialCard } from '@/components/MaterialCard';

<MaterialCard 
  title="Card Title"
  subtitle="Subtitle"
  onPress={() => alert('Card pressed')}
>
  <Text>Card content goes here</Text>
</MaterialCard>
```

### MaterialInput
Material Design text input field:

```tsx
import { MaterialInput } from '@/components/MaterialInput';

<MaterialInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter your email"
  mode="outlined"
/>
```

## Theming

The app uses Material Design 3 theming with automatic dark/light mode support. Customize theme colors in [app/_layout.tsx](app/_layout.tsx):

```tsx
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6750a4',
    // ... other colors
  },
};
```

## Dependencies

Key packages included:

- **expo** - Cross-platform React Native development platform
- **expo-router** - File-based routing for React Native
- **react-native-paper** - Material Design 3 component library
- **react-native-vector-icons** - Icon support
- **expo-font** - Font loading utilities

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Paper Docs](https://callstack.github.io/react-native-paper/)
- [Expo Router Guide](https://docs.expo.dev/routing/introduction/)
- [Material Design 3](https://m3.material.io/)

## Troubleshooting

### Icons not showing
Ensure fonts are properly loaded:
```bash
npm install expo-font react-native-vector-icons
```

### Build errors
Try clearing cache and reinstalling:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port already in use
The default port is 8081. To use a different port:
```bash
npx expo start --port 3000
```

## License

Created with ❤️ using Expo and React Native Paper


- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
