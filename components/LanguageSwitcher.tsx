import { Language } from '@/constants/translations';
import { useLanguageContext } from '@/context/LanguageContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Menu } from 'react-native-paper';

export const LanguageSwitcher: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const { language, setLanguage, t } = useLanguageContext();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: t('english') },
    { code: 'hi', label: t('hindi') },
  ];

  const handleLanguageChange = async (lang: Language) => {
    await setLanguage(lang);
    setVisible(false);
  };

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button
            icon="translate"
            onPress={() => setVisible(true)}
            mode="outlined"
            compact
          >
            {currentLanguage?.label}
          </Button>
        }
      >
        {languages.map((lang) => (
          <Menu.Item
            key={lang.code}
            onPress={() => handleLanguageChange(lang.code)}
            title={lang.label}
            leadingIcon={language === lang.code ? 'check' : undefined}
          />
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
