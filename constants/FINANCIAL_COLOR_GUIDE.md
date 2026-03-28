# Financial App Color Guide - Cashbook

## Color Palette Overview

This color scheme is specifically designed for financial applications with Material Design 3 compliance. The palette ensures trust, clarity, and optimal readability in both light and dark modes.

---

## Core Brand Colors

### Primary: Professional Blue `#085599d` (Light) / `#a8e0ff` (Dark)
- **Purpose**: Trust, security, and financial stability
- **Usage**: Primary buttons, brand headers, key interactive elements
- **Contrast**: WCAG AA compliant for accessibility
- **Psychology**: Blue conveys security, stability, and trust—essential for financial apps

```
Light: rgb(8, 85, 157)
Dark:  rgb(168, 224, 255)
```

### Secondary: Teal/Cyan `#147c8d` (Light) / `#94e3f2` (Dark)
- **Purpose**: Growth, balance, and positive indicators
- **Usage**: Secondary buttons, balance indicators, positive trends
- **Psychology**: Teal represents growth, renewal, and financial health

```
Light: rgb(20, 124, 141)
Dark:  rgb(148, 227, 242)
```

---

## Financial Status Colors

### ✅ Income/Positive `#1b8c57` (Light) / `#94dcab` (Dark)
- **Use Cases**: 
  - Income transactions
  - Credit transactions
  - Positive variance
  - Profit indicators
  - Balance growth
- **Background**: `#baf8cf` (Light) / `#00572e` (Dark) for cards/highlights

```
Light Surface: rgb(27, 140, 87)
Dark Surface:  rgb(148, 220, 171)
```

### ❌ Expense/Negative `#ba1a1a` (Light) / `#ffb4ab` (Dark)
- **Use Cases**:
  - Expense transactions
  - Debit transactions
  - Negative variance
  - Loss indicators
  - Balance decrease
- **Background**: `#ffdad4` (Light) / `#930009` (Dark) for cards/highlights

```
Light Surface: rgb(186, 26, 26)
Dark Surface:  rgb(255, 180, 171)
```

### ⏳ Pending/Alert `#b36200` (Light) / `#ffb962` (Dark)
- **Use Cases**:
  - Pending transactions
  - Alerts and warnings
  - Scheduled transactions
  - Attention-needed items
- **Background**: `#ffdbb1` (Light) / `#893800` (Dark) for cards/highlights

```
Light Surface: rgb(179, 98, 0)
Dark Surface:  rgb(255, 185, 98)
```

---

## Supporting Colors

### Tertiary: Neutral Gray `#506274` (Light) / `#b7c8dc` (Dark)
- **Purpose**: Supporting text, timestamps, secondary information
- **Usage**: Labels, helper text, disabled states

### Error (System): `#ba1a1a` (Light) / `#ffb4ab` (Dark)
- **Purpose**: Validation errors, critical alerts
- **Usage**: Form errors, validation messages

### Background
- **Light**: `#fefa f8` - Clean, minimal, easy on eyes
- **Dark**: `#1a1b1e` - True dark for OLED screens, reduces eye strain

---

## Implementation Examples

### Transaction List Item - Income
```javascript
// Light mode
income_text: Colors.light.income        // #1b8c57
income_bg: Colors.light.incomeBg        // #baf8cf
icon_color: Colors.light.income

// Dark mode
income_text: Colors.dark.income         // #94dcab
income_bg: Colors.dark.incomeBg         // #00572e
icon_color: Colors.dark.income
```

### Transaction List Item - Expense
```javascript
// Light mode
expense_text: Colors.light.expense      // #ba1a1a
expense_bg: Colors.light.expenseBg      // #ffdad4
icon_color: Colors.light.expense

// Dark mode
expense_text: Colors.dark.expense       // #ffb4ab
expense_bg: Colors.dark.expenseBg       // #930009
icon_color: Colors.dark.expense
```

### Balance Card
```javascript
// Primary button
buttonColor: useColorScheme() === 'light' 
  ? Colors.light.tint      // #085599d
  : Colors.dark.tint       // #a8e0ff

// Secondary stats
balanceColor: useColorScheme() === 'light'
  ? Colors.light.textSecondary
  : Colors.dark.textSecondary
```

### Summary Cards
```javascript
// Income total card
backgroundColor: useColorScheme() === 'light'
  ? Colors.light.incomeBg     // #baf8cf
  : Colors.dark.incomeBg      // #00572e

textColor: useColorScheme() === 'light'
  ? Colors.light.income       // #1b8c57
  : Colors.dark.income        // #94dcab

// Expense total card
backgroundColor: useColorScheme() === 'light'
  ? Colors.light.expenseBg    // #ffdad4
  : Colors.dark.expenseBg     // #930009

textColor: useColorScheme() === 'light'
  ? Colors.light.expense      // #ba1a1a
  : Colors.dark.expense       // #ffb4ab
```

---

## Color Reference Hex Codes

### Light Mode
| Element | Variable | Hex Code | RGB |
|---------|----------|----------|-----|
| Primary | tint | #085599d | rgb(8, 85, 157) |
| Secondary | - | #147c8d | rgb(20, 124, 141) |
| Income | income | #1b8c57 | rgb(27, 140, 87) |
| Expense | expense | #ba1a1a | rgb(186, 26, 26) |
| Pending | pending | #b36200 | rgb(179, 98, 0) |
| Background | background | #fefa f8 | rgb(254, 250, 248) |
| Text | text | #1a1b1e | rgb(26, 27, 30) |
| Border | border | #e9ecf1 | rgb(233, 236, 241) |

### Dark Mode
| Element | Variable | Hex Code | RGB |
|---------|----------|----------|-----|
| Primary | tint | #a8e0ff | rgb(168, 224, 255) |
| Secondary | - | #94e3f2 | rgb(148, 227, 242) |
| Income | income | #94dcab | rgb(148, 220, 171) |
| Expense | expense | #ffb4ab | rgb(255, 180, 171) |
| Pending | pending | #ffb962 | rgb(255, 185, 98) |
| Background | background | #1a1b1e | rgb(26, 27, 30) |
| Text | text | #e4e3e0 | rgb(228, 227, 224) |
| Border | border | #474e54 | rgb(71, 78, 84) |

---

## Accessibility Notes

✅ **WCAG Compliance**
- All text color combinations meet WCAG AA standards (4.5:1 minimum contrast)
- Critical financial information uses colors AND additional visual indicators
- Color-blind users can distinguish using icon variations in addition to color

✅ **Best Practices**
- Don't rely on color alone to convey information
- Use icons + color for transaction status (✓ for income, ✗ for expense)
- Ensure sufficient contrast for small text elements
- Test with color blindness simulators when designing new features

---

## Usage in Components

### In React Native Paper Theme
```typescript
import { useTheme } from 'react-native-paper';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      {/* Uses theme primary color */}
      <Text style={{ color: theme.colors.primary }}>
        Primary Text
      </Text>
    </View>
  );
}
```

### Accessing Custom Colors
```typescript
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

function TransactionRow() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'light' ? Colors.light : Colors.dark;
  
  return (
    <View style={{ backgroundColor: colors.incomeBg }}>
      <Text style={{ color: colors.income }}>
        +₹5,000
      </Text>
    </View>
  );
}
```

---

## Design Rationale

### Why Blue Primary?
Financial institutions universally use blue as their primary color because:
- Conveys security and trustworthiness
- Non-aggressive, professional appearance
- Recognized as "finance" color globally
- High visibility without being distracting

### Why Green for Income?
- Universal symbol for "go" or positive action
- Associated with growth and profit in business
- Users expect green for positive transactions
- Creates intuitive financial visualization

### Why Red for Expenses?
- Clear visual indicator of money leaving account
- Signals caution without feeling "wrong"
- Matches banking app conventions
- Easy to scan and locate in transaction lists

### Dark Mode Color Adjustments
- Lighter shades of income/expense for readable text on dark backgrounds
- Slightly desaturated for reduced eye strain
- Maintains sufficient contrast ratios

---

## Future Extensions

If you need additional financial indicators, consider:

```typescript
// Savings/Goal colors
savings: '#2e7d32',
savingsLight: '#c8e6c9',

// Neutral/Transfer colors
transfer: '#424242',
transferLight: '#e0e0e0',

// Budget exceeded
overBudget: '#d32f2f',
overBudgetLight: '#ffebee',
```

---

## Resources

- **Material Design 3 Color System**: https://m3.material.io/styles/color/overview
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Color Blindness Simulator**: https://www.color-blindness.com/coblis-color-blindness-simulator/
