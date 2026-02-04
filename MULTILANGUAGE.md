# Multilanguage Feature Documentation

## Overview
The Cashbook app now supports multiple languages (English and Hindi) with persistent language preference storage.

## Architecture

### Components

1. **Translation Files**
   - `constants/translations/en.ts` - English translations
   - `constants/translations/hi.ts` - Hindi translations
   - `constants/translations/index.ts` - Translation registry and types

2. **Language Context**
   - `context/LanguageContext.tsx` - React Context for managing language state
   - Persists language preference to AsyncStorage
   - Provides `t()` function for accessing translations

3. **UI Components**
   - `components/LanguageSwitcher.tsx` - Language selection dropdown menu

## Usage Guide

### Using the Translation Function

In any component, import and use the language context:

```typescript
import { useLanguageContext } from '@/context/LanguageContext';

export const MyComponent = () => {
  const { t, language } = useLanguageContext();

  return <Text>{t('home')}</Text>;
};
```

### Backward Compatibility

The legacy `useTranslation` hook is still available for backward compatibility:

```typescript
import { useTranslation } from '@/hooks/useLanguage';

export const MyComponent = () => {
  const { t } = useTranslation();
  return <Text>{t('home')}</Text>;
};
```

However, **new code should use `useLanguageContext`** instead.

### Adding Language Switcher to a Screen

```typescript
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguageContext } from '@/context/LanguageContext';

export const SettingsScreen = () => {
  const { t } = useLanguageContext();

  return (
    <View>
      <Text>{t('settingsManagement')}</Text>
      <LanguageSwitcher />
    </View>
  );
};
```

## Adding New Translations

To add new translation strings:

1. Add the key and English translation to `constants/translations/en.ts`:
   ```typescript
   export const englishTranslations = {
     // ... existing translations
     myNewKey: 'My English Text',
   };
   ```

2. Add the same key with Hindi translation to `constants/translations/hi.ts`:
   ```typescript
   export const hindiTranslations = {
     // ... existing translations
     myNewKey: 'मेरा हिंदी पाठ',
   };
   ```

3. The TypeScript type will automatically be updated via the `TranslationKey` type.

## Language Codes

- `'en'` - English
- `'hi'` - Hindi

## Persisted Storage

The selected language is automatically saved to device storage using AsyncStorage, so the user's preference is maintained across app sessions.

## Current Supported Languages

### English
- Full language code: `en`
- Default language

### Hindi
- Full language code: `hi`
- Full Unicode support with Devanagari script

## API Reference

### useLanguageContext()

Returns the language context with the following properties and methods:

```typescript
interface LanguageContextType {
  language: Language; // Current language ('en' or 'hi')
  setLanguage: (lang: Language) => Promise<void>; // Change language
  t: (key: TranslationKey) => string; // Get translation
}
```

**Example:**
```typescript
const { language, setLanguage, t } = useLanguageContext();

// Get translation
const homeLabel = t('home');

// Change language
await setLanguage('hi');

// Check current language
if (language === 'hi') {
  console.log('Currently using Hindi');
}
```

### LanguageSwitcher Component

A pre-built dropdown menu component for selecting languages.

**Props:** None (uses context internally)

**Example:**
```typescript
<LanguageSwitcher />
```

## Integration in Settings Screen

To fully integrate the language switcher, update your settings screen:

```typescript
import { View, StyleSheet } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguageContext } from '@/context/LanguageContext';

export default function SettingsScreen() {
  const { t } = useLanguageContext();

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">{t('settingsManagement')}</Text>
      <Divider style={styles.divider} />
      
      <Text variant="titleMedium">{t('language')}</Text>
      <LanguageSwitcher />
      
      {/* Other settings can go here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  divider: {
    marginVertical: 16,
  },
});
```

## Troubleshooting

### Translations not updating
- Ensure you're using `useLanguageContext()` in your component
- Check that the component is within the `<LanguageProvider>` (which should be in the root layout)

### Language not persisting
- Verify AsyncStorage is properly installed: `npm install @react-native-async-storage/async-storage`
- Check that there are no permission issues on the device

### Type errors for translation keys
- Make sure your key exists in both `en.ts` and `hi.ts` files
- Clear TypeScript cache if needed: `npm run lint`

## Future Enhancements

Possible additions for future versions:
- More languages (Gujarati, Marathi, Tamil, etc.)
- Right-to-left (RTL) language support
- Date/time localization
- Number formatting based on locale
- Pluralization support
