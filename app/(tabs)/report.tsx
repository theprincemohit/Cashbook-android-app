import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, Button, Text, useTheme } from 'react-native-paper';

import { getTransactionByPassbookId } from '@/api/transactionApi';
import { MaterialCard } from '@/components/MaterialCard';
import { useBusinessContext } from '@/context/BusinessContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { useProtectedRoute } from '@/hooks/useAuthRoute';
import { formatDateTime } from '@/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';

export default function ReportScreen() {
  useProtectedRoute();
  const theme = useTheme();
  const { t } = useLanguageContext();
  const { activePassbookId, businesses, activeBusinessId } = useBusinessContext();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [showStartDateDialog, setShowStartDateDialog] = useState(false);
  const [showEndDateDialog, setShowEndDateDialog] = useState(false);

  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // 30 days ago
  const [endDate, setEndDate] = useState(new Date());

  const loadTransactions = async () => {
    if (!activePassbookId) {
      Alert.alert('Error', 'Please select a passbook first');
      return;
    }

    setLoading(true);
    try {
      const { data, status } = await getTransactionByPassbookId(activePassbookId);
      if (status === 200) {
        // Filter transactions by date range
        const filteredTransactions = data.filter((transaction: any) => {
          const transactionDate = new Date(transaction.created_at);
          return transactionDate >= startDate && transactionDate <= endDate;
        });
        setTransactions(filteredTransactions);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      Alert.alert('Error', 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [activePassbookId, startDate, endDate]);

  const calculateSummary = () => {
    return transactions.reduce((accumulator, currentValue) => {
      if (currentValue.txn_type === 'credit') {
        accumulator.credit += currentValue.amount;
      } else {
        accumulator.debit += currentValue.amount;
      }
      return accumulator;
    }, { total: 0, credit: 0, debit: 0 });
  };

  const summary = calculateSummary();
  summary.total = summary.credit - summary.debit;

  const generatePDF = async () => {
    if (transactions.length === 0) {
      Alert.alert('No Data', 'No transactions found for the selected period');
      return;
    }

    setGeneratingPDF(true);
    try {
      const business = businesses.find(b => b.id === activeBusinessId?.toString());
      const businessName = business ? business.name : 'Business';

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Transaction Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #1976D2;
              margin: 0;
            }
            .header p {
              margin: 5px 0;
              color: #666;
            }
            .summary {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              background-color: #f5f5f5;
              padding: 15px;
              border-radius: 8px;
            }
            .summary-item {
              text-align: center;
              flex: 1;
            }
            .summary-item h3 {
              margin: 0;
              font-size: 18px;
            }
            .summary-item p {
              margin: 5px 0 0 0;
              font-size: 14px;
              color: #666;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #1976D2;
              color: white;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .credit {
              color: #4CAF50;
              font-weight: bold;
            }
            .debit {
              color: #FF6B6B;
              font-weight: bold;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Transaction Report</h1>
            <p><strong>Business:</strong> ${businessName}</p>
            <p><strong>Period:</strong> ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}</p>
            <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div class="summary">
            <div class="summary-item">
              <h3 class="credit">₹${summary.credit.toLocaleString()}</h3>
              <p>Total Credit</p>
            </div>
            <div class="summary-item">
              <h3 class="debit">₹${summary.debit.toLocaleString()}</h3>
              <p>Total Debit</p>
            </div>
            <div class="summary-item">
              <h3>₹${summary.total.toLocaleString()}</h3>
              <p>Net Balance</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(transaction => `
                <tr>
                  <td>${formatDateTime(transaction.created_at)}</td>
                  <td>${transaction.description}</td>
                  <td class="${transaction.txn_type}">${transaction.txn_type.toUpperCase()}</td>
                  <td class="${transaction.txn_type}">₹${transaction.amount.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Report generated by Cashbook App</p>
          </div>
        </body>
        </html>
      `;

      const { uri } = await printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      await shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf'
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF report');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const showDatePickerModal = (mode: 'start' | 'end') => {
    if (mode === 'start') {
      setShowStartDateDialog(true);
    } else {
      setShowEndDateDialog(true);
    }
  };

  const handleDateChange = (mode: 'start' | 'end', dateString: string) => {
    const selectedDate = new Date(dateString);
    if (mode === 'start') {
      setStartDate(selectedDate);
      setShowStartDateDialog(false);
    } else {
      setEndDate(selectedDate);
      setShowEndDateDialog(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#ecedee' }]}>
      <Appbar.Header dark={true} style={{ 
        backgroundColor: theme.colors.primary, 
        height: 30,
        marginTop: 2,
        paddingTop: 0,
        marginBottom: 8,

         }}>
        <Appbar.BackAction onPress={() => router.push('/transaction')} />
        <Appbar.Content title="Report" />
        
      </Appbar.Header>
    <ScrollView style={[styles.container, ]}>
     

      <MaterialCard title="Date Range" subtitle="Select the period for your report">
        <View style={styles.dateRow}>
          <Text>
          <Button
            mode="outlined"
            onPress={() => {
              showDatePickerModal('start')
            }}
            style={styles.dateButton}
          >
            From: {startDate.toLocaleDateString()}
          </Button>
          </Text>
          <Button
            mode="outlined"
            onPress={() => showDatePickerModal('end')}
            style={styles.dateButton}
          >
            To: {endDate.toLocaleDateString()}
          </Button>
        </View>
      </MaterialCard>

      <MaterialCard title="Summary" subtitle={`Transactions from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`}>
        {loading ? (
          <ActivityIndicator animating={true} />
        ) : (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Total Transactions
              </Text>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                {transactions.length}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Total Credit
              </Text>
              <Text variant="titleMedium" style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                ₹{summary.credit.toLocaleString()}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Total Debit
              </Text>
              <Text variant="titleMedium" style={{ color: '#FF6B6B', fontWeight: 'bold' }}>
                ₹{summary.debit.toLocaleString()}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Net Balance
              </Text>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                ₹{summary.total.toLocaleString()}
              </Text>
            </View>
          </View>
        )}
      </MaterialCard>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={generatePDF}
          loading={generatingPDF}
          disabled={loading || transactions.length === 0}
          style={styles.generateButton}
        >
          {generatingPDF ? 'Generating PDF...' : 'Generate & Share PDF Report'}
        </Button>
      </View>

      {showStartDateDialog && (
        <DateTimePicker
          testID="dateTimePicker"
          value={startDate}
          mode={'date'}
          is24Hour={true}
          onChange={(event, selectedDate) => {
            handleDateChange('start', selectedDate.toISOString().split('T')[0])
                 setShowStartDateDialog(false);
        }
            
          }
          // onDismiss={() => setShowStartDateDialog(false)}
        />
      )}

      {showEndDateDialog && (
       <DateTimePicker
          testID="dateTimePicker"
          value={endDate}
          mode={'date'}
          is24Hour={true}
          onChange={(event, selectedDate) => {
            handleDateChange('end', selectedDate.toISOString().split('T')[0])
                 setShowEndDateDialog(false);
        }
            
          }
          // onDismiss={() => setShowEndDateDialog(false)}
        />
      )}
    </ScrollView>
    </View>
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
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  dateButton: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  generateButton: {
    paddingVertical: 8,
  },
});