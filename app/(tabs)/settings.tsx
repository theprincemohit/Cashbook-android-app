import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { List, Menu, Switch, Text, TouchableRipple, useTheme } from 'react-native-paper';

import { MaterialCard } from '@/components/MaterialCard';
import { TeamMemberManager } from '@/components/TeamMemberManager';
import { useTeamContext } from '@/context/TeamContext';
import { useLanguage } from '@/hooks/useLanguage';

export default function SettingsScreen() {
  const theme = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { currentUser } = useTeamContext();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [languageMenuVisible, setLanguageMenuVisible] = useState(false);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>
          Settings
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Manage your preferences
        </Text>
      </View>

      <MaterialCard title="Notifications" subtitle="Control notification preferences">
        <List.Item
          title="Push Notifications"
          description="Receive push notifications"
          left={(props) => <List.Icon {...props} icon="bell" />}
          right={() => <Switch value={notifications} onValueChange={setNotifications} />}
        />
        <List.Item
          title="Email Notifications"
          description="Receive email updates"
          left={(props) => <List.Icon {...props} icon="email" />}
          right={() => <Switch value={true} onValueChange={() => {}} />}
        />
      </MaterialCard>

      <MaterialCard title="Display" subtitle="Customize app appearance">
        <List.Item
          title="Dark Mode"
          description="Enable dark theme"
          left={(props) => <List.Icon {...props} icon="moon-new" />}
          right={() => <Switch value={darkMode} onValueChange={setDarkMode} />}
        />
        <List.Item
          title="Font Size"
          description="Adjust text size"
          left={(props) => <List.Icon {...props} icon="format-size" />}
          right={(props) => <Text {...props}>Normal</Text>}
        />
      </MaterialCard>

      <MaterialCard title="Security" subtitle="Privacy and security options">
        <List.Item
          title="Biometric Login"
          description="Use fingerprint to login"
          left={(props) => <List.Icon {...props} icon="fingerprint" />}
          right={() => <Switch value={biometric} onValueChange={setBiometric} />}
        />
        <List.Item
          title="Two-Factor Authentication"
          description="Enhanced account security"
          left={(props) => <List.Icon {...props} icon="shield-check" />}
          right={(props) => <Text {...props}>Disabled</Text>}
        />
      </MaterialCard>

      {currentUser?.role === 'admin' && (
        <TeamMemberManager />
      )}

      <MaterialCard title="About" subtitle="App information">
        <List.Item
          title="Version"
          description="1.0.0"
          left={(props) => <List.Icon {...props} icon="information" />}
        />
        <List.Item
          title="Build Number"
          description="2026.01"
          left={(props) => <List.Icon {...props} icon="package" />}
        />
      </MaterialCard>

      <MaterialCard title={t('language')} subtitle={t('selectLanguage')}>
        <Menu
          visible={languageMenuVisible}
          onDismiss={() => setLanguageMenuVisible(false)}
          anchor={
            <TouchableRipple
              onPress={() => setLanguageMenuVisible(true)}
              style={[styles.languageButton, { borderColor: theme.colors.outline }]}>
              <View style={styles.languageButtonContent}>
                <Text variant="bodyMedium" style={{ flex: 1 }}>
                  {language === 'en' ? t('english') : t('hindi')}
                </Text>
                <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 18 }}>
                  ▼
                </Text>
              </View>
            </TouchableRipple>
          }>
          <Menu.Item
            onPress={() => {
              setLanguage('en');
              setLanguageMenuVisible(false);
            }}
            title={t('english')}
            style={{
              backgroundColor: language === 'en' ? `${theme.colors.primary}20` : 'transparent',
            }}
          />
          <Menu.Item
            onPress={() => {
              setLanguage('hi');
              setLanguageMenuVisible(false);
            }}
            title={t('hindi')}
            style={{
              backgroundColor: language === 'hi' ? `${theme.colors.primary}20` : 'transparent',
            }}
          />
        </Menu>
      </MaterialCard>

      <View style={styles.spacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 8,
  },
  spacing: {
    height: 24,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  languageButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    gap: 8,
  },
});
