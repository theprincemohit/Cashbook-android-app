import { useCallback } from 'react';

export const translations = {
  // Navigation & Menu
  home: 'Home',
  businesses: 'Businesses',
  customers: 'Customers',
  passbook: 'Passbook',
  profile: 'Profile',
  settings: 'Settings',
  logout: 'Logout',
  appMenu: 'App Menu',
  welcomeUser: 'Welcome, User',

  // Home Screen
  materialDesign: 'Material Design 3',
  reactNativePaper: 'React Native Paper Components',
  inputComponents: 'Input Components',
  textInputExamples: 'Text input examples',
  buttonVariants: 'Button Variants',
  interactiveCard: 'Interactive Card',
  tapToInteract: 'Tap to interact',
  cardPressMessage: 'Card pressed!',
  containerLabel: 'container',

  // Login
  welcomeBack: 'Welcome Back',
  signInToAccount: 'Sign in to your account',
  login: 'Login',
  enterCredentials: 'Enter your credentials',
  email: 'Email',
  password: 'Password',
  signIn: 'Sign In',
  signingIn: 'Signing In...',
  demoCredentials: 'Demo Credentials:',
  invalidCredentials: 'Invalid email or password. Try admin@example.com / password123',
  pleaseEnterBoth: 'Please enter both email and password',
  loginError: 'Login Error',

  // Business Screen
  businessManagement: 'Businesses',
  manageBusinessAccounts: 'Manage your business accounts',
  noBusiness: 'No Businesses',
  getStartedBusiness: 'Get started by creating one',
  notCreatedBusiness: "You haven't created any businesses yet. Tap the + button to add one.",
  totalBusiness: 'Total',
  business: 'Business',
  businessPlural: 'Businesses',
  addBusiness: 'Add Business',
  createNewBusiness: 'Create New Business',
  editBusiness: 'Edit Business',
  businessName: 'Business Name',
  enterBusinessName: 'Enter business name',
  update: 'Update',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
  cancel: 'Cancel',
  deleteBusiness: 'Delete Business',
  areYouSureDelete: 'Are you sure you want to delete',
  error: 'Error',
  pleaseEnterName: 'Please enter a business name',

  // Customer Screen
  customerManagement: 'Customers',
  manageYourCustomers: 'Manage your customers',
  noCustomer: 'No Customers',
  getStartedCustomer: 'Get started by adding one',
  notAddedCustomer: "You haven't added any customers yet. Tap the + button to add one.",
  totalCustomer: 'Total',
  customer: 'Customer',
  customerPlural: 'Customers',
  addCustomer: 'Add Customer',
  addNewCustomer: 'Add New Customer',
  editCustomer: 'Edit Customer',
  customerNameLabel: 'Customer Name',
  enterCustomerName: 'Enter customer name',
  mobileNumber: 'Mobile Number',
  enterMobileNumber: 'Enter your mobile number',
  pleaseEnterAll: 'Please enter both name and mobile number',
  invalidMobileNumber: 'Please enter a valid mobile number',
  deleteCustomer: 'Delete Customer',

  // Passbook Screen
  trackTransactions: 'Track transactions',
  selectBusiness: 'Select Business',
  currentBalance: 'Current Balance',
  noTransactions: 'No Transactions',
  noTransactionsBusiness: 'No transactions yet for this business. Tap the + button to add one.',
  transactions: 'Transactions',
  addTransaction: 'Add Transaction',
  transactionType: 'Transaction Type',
  credit: 'Credit (+)',
  debit: 'Debit (-)',
  amount: 'Amount',
  description: 'Description',
  enterTransactionDescription: 'Enter transaction description',
  selectCustomer: 'Select Customer',
  add: 'Add',
  deleteTransaction: 'Delete Entry',
  balance: 'Balance',
  added: 'Added',
  bal: 'Bal',

  // Profile Screen
  profileInfo: 'Profile',
  personalInformation: 'Personal Information',
  userDetails: 'User details',
  fullName: 'Full Name',
  phone: 'Phone',
  memberSince: 'Member Since',
  accountStatus: 'Account Status',
  accountInformation: 'Account information',
  status: 'Status',
  active: 'Active',
  adminUser: 'Admin User',

  // Settings Screen
  settingsTitle: 'Settings',
  managePreferences: 'Manage your preferences',
  notifications: 'Notifications',
  controlNotifications: 'Control notification preferences',
  pushNotifications: 'Push Notifications',
  receivePushNotifications: 'Receive push notifications',
  emailNotifications: 'Email Notifications',
  receiveEmailUpdates: 'Receive email updates',
  display: 'Display',
  customizeAppearance: 'Customize app appearance',
  darkMode: 'Dark Mode',
  enableDarkTheme: 'Enable dark theme',
  fontSize: 'Font Size',
  adjustTextSize: 'Adjust text size',
  normal: 'Normal',
  security: 'Security',
  privacySecurity: 'Privacy and security options',
  biometricLogin: 'Biometric Login',
  useFingerprintLogin: 'Use fingerprint to login',
  twoFactorAuth: 'Two-Factor Authentication',
  enhancedSecurity: 'Enhanced account security',
  disabled: 'Disabled',
  about: 'About',
  appInformation: 'App information',
  version: 'Version',
  buildNumber: 'Build Number',

  // Buttons & Actions
  ok: 'OK',
  close: 'Close',
} as const;

export type TranslationKey = keyof typeof translations;

/**
 * Simple hook to access translations
 * @returns Object with t function for getting translation strings
 */
export const useTranslation = () => {
  const t = useCallback((key: TranslationKey): string => {
    return translations[key];
  }, []);

  return { t };
};
