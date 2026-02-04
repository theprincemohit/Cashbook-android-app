import { useLanguageContext } from '@/context/LanguageContext';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

/**
 * EXAMPLE 1: Using translations in a simple component
 */
export const SimpleExample = () => {
  const { t } = useLanguageContext();

  return (
    <View>
      <Text>{t('home')}</Text>
      <Text>{t('welcomeUser')}</Text>
      <Text>{t('business')}</Text>
    </View>
  );
};

/**
 * EXAMPLE 2: Using language switcher in settings
 */
export const LanguageSwitcherExample = () => {
  const { language, setLanguage, t } = useLanguageContext();

  return (
    <View style={styles.container}>
      <Text>{t('selectLanguage')}</Text>
      <Button
        onPress={() => setLanguage('en')}
        mode={language === 'en' ? 'contained' : 'outlined'}>
        {t('english')}
      </Button>
      <Button
        onPress={() => setLanguage('hi')}
        mode={language === 'hi' ? 'contained' : 'outlined'}>
        {t('hindi')}
      </Button>
    </View>
  );
};

/**
 * EXAMPLE 3: Conditional rendering based on language
 */
export const ConditionalExample = () => {
  const { language, t } = useLanguageContext();

  return (
    <View style={styles.container}>
      <Text>{t('language')}: {language}</Text>
      {language === 'hi' && <Text>यह हिंदी में है</Text>}
      {language === 'en' && <Text>This is in English</Text>}
    </View>
  );
};

/**
 * EXAMPLE 4: Using translations for dynamic content
 */
export const DynamicContentExample = () => {
  const { t } = useLanguageContext();

  const screenNames = [
    { key: 'home', label: t('home') },
    { key: 'businesses', label: t('businesses') },
    { key: 'customers', label: t('customers') },
    { key: 'passbook', label: t('passbook') },
    { key: 'profile', label: t('profile') },
    { key: 'settings', label: t('settings') },
  ];

  return (
    <View style={styles.container}>
      {screenNames.map((screen) => (
        <Text key={screen.key} style={styles.item}>
          {screen.label}
        </Text>
      ))}
    </View>
  );
};

/**
 * EXAMPLE 5: Using LanguageSwitcher component
 */
export const ComponentExample = () => {
  const { t } = useLanguageContext();
  const { LanguageSwitcher } = require('@/components/LanguageSwitcher');

  return (
    <View style={styles.container}>
      <Text variant="titleLarge">{t('settingsTitle')}</Text>
      <LanguageSwitcher />
    </View>
  );
};

/**
 * EXAMPLE 6: Using with async operations
 */
export const AsyncExample = () => {
  const { t, setLanguage } = useLanguageContext();

  const handleLanguageChange = async (lang: 'en' | 'hi') => {
    await setLanguage(lang);
    // After setting, all components using useLanguageContext will re-render
  };

  return (
    <View style={styles.container}>
      <Button onPress={() => handleLanguageChange('en')}>{t('english')}</Button>
      <Button onPress={() => handleLanguageChange('hi')}>{t('hindi')}</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  item: {
    paddingVertical: 8,
    fontSize: 16,
  },
});

/**
 * How to use these examples in your app:
 *
 * 1. Copy any component and paste it into your screen file
 * 2. Make sure the component is within the LanguageProvider hierarchy
 *    (all screens wrapped by root _layout.tsx are automatically included)
 * 3. Use the { t } function to access translated strings
 * 4. The component will automatically re-render when language changes
 *
 * Adding new translation keys:
 * 1. Add to constants/translations/en.ts: myKey: 'English text'
 * 2. Add to constants/translations/hi.ts: myKey: 'हिंदी पाठ'
 * 3. Use in component: const text = t('myKey');
 *
 * The translation key type is automatically updated!
 */
