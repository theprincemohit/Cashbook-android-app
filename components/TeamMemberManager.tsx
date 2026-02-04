import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    Button,
    Card,
    Dialog,
    Portal,
    Switch,
    Text,
    TextInput,
    useTheme
} from 'react-native-paper';

import { useLanguageContext } from '@/context/LanguageContext';
import { useTeamContext } from '@/context/TeamContext';
import { TeamMember } from '@/types/team';

export const TeamMemberManager: React.FC = () => {
  const theme = useTheme();
  const { t } = useLanguageContext();
  const { currentUser, teamMembers, addTeamMember, removeTeamMember } = useTeamContext();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [canAddTransactions, setCanAddTransactions] = useState(true);
  const [canAddCustomers, setCanAddCustomers] = useState(true);

  const isAdmin = currentUser?.role === 'admin';

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Text variant="bodyMedium" style={{ textAlign: 'center', padding: 16 }}>
          {t('admin')} only
        </Text>
      </View>
    );
  }

  const handleAddMember = () => {
    if (!memberName.trim() || !memberEmail.trim()) {
      Alert.alert(t('error'), t('pleaseEnterAllFields'));
      return;
    }

    addTeamMember({
      name: memberName.trim(),
      email: memberEmail.trim(),
      role: 'team_member',
      businessId: currentUser?.businessId || '',
      canAddTransactions,
      canAddCustomers,
      canEditOwnOnly: true,
    });

    setMemberName('');
    setMemberEmail('');
    setCanAddTransactions(true);
    setCanAddCustomers(true);
    setDialogVisible(false);
  };

  const handleDeleteMember = (memberId: string, name: string) => {
    Alert.alert(
      t('removeTeamMember'),
      t('removeFromTeam'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          onPress: () => removeTeamMember(memberId),
          style: 'destructive',
        },
      ]
    );
  };

  const renderMember = ({ item }: { item: TeamMember }) => (
    <Card style={[styles.memberCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.memberHeader}>
          <View style={styles.memberInfo}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              {item.name}
            </Text>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {item.email}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: theme.colors.error }]}
            onPress={() => handleDeleteMember(item.id, item.name)}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
              {t('delete')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.permissionsRow}>
          <View style={styles.permissionItem}>
            <Text variant="labelMedium">{t('canAddCustomers')}</Text>
            <Switch
              value={item.canAddCustomers}
              onValueChange={() => {}}
              disabled
            />
          </View>
          <View style={styles.permissionItem}>
            <Text variant="labelMedium">{t('canAddTransactions')}</Text>
            <Switch
              value={item.canAddTransactions}
              onValueChange={() => {}}
              disabled
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        {t('teamMembers')}
      </Text>

      {teamMembers.length === 0 ? (
        <Text variant="bodyMedium" style={styles.emptyText}>
          {t('noTeamMembers')}
        </Text>
      ) : (
        <FlatList
          data={teamMembers}
          renderItem={renderMember}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Button
        mode="contained"
        onPress={() => setDialogVisible(true)}
        style={styles.addButton}>
        {t('addTeamMember')}
      </Button>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>{t('addTeamMember')}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label={t('memberName')}
              value={memberName}
              onChangeText={setMemberName}
              mode="outlined"
              placeholder={t('enterMemberName')}
              style={styles.input}
            />
            <TextInput
              label={t('email')}
              value={memberEmail}
              onChangeText={setMemberEmail}
              mode="outlined"
              placeholder={t('email')}
              keyboardType="email-address"
              style={styles.input}
            />

            <View style={styles.permissionSection}>
              <Text variant="labelMedium" style={{ marginBottom: 12, fontWeight: 'bold' }}>
                {t('permissions')}
              </Text>
              <View style={styles.permissionItem}>
                <Text>{t('canAddCustomers')}</Text>
                <Switch
                  value={canAddCustomers}
                  onValueChange={setCanAddCustomers}
                />
              </View>
              <View style={styles.permissionItem}>
                <Text>{t('canAddTransactions')}</Text>
                <Switch
                  value={canAddTransactions}
                  onValueChange={setCanAddTransactions}
                />
              </View>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>{t('cancel')}</Button>
            <Button mode="contained" onPress={handleAddMember}>
              {t('add')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  listContent: {
    paddingVertical: 8,
  },
  memberCard: {
    borderRadius: 8,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberInfo: {
    flex: 1,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  permissionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  permissionItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    color: 'red',
  },
  permissionSection: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 24,
  },
  input: {
    marginTop: 8,
  },
  addButton: {
    marginTop: 12,
  },
});
