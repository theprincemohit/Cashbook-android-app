# Multilanguage Feature - Quick Reference

## 🎯 Most Important: How to Use

### In Any Component:
```typescript
import { useLanguageContext } from '@/context/LanguageContext';

export const MyComponent = () => {
  const { t } = useLanguageContext();
  
  return <Text>{t('home')}</Text>;
};
```

That's it! The component will automatically support both English and Hindi.

---

## 📝 Translate a New String

### Step 1: Add English translation
File: `constants/translations/en.ts`
```typescript
myFeature: 'My Feature Name',
```

### Step 2: Add Hindi translation
File: `constants/translations/hi.ts`
```typescript
myFeature: 'मेरी फीचर का नाम',
```

### Step 3: Use in component
```typescript
<Text>{t('myFeature')}</Text>
```

---

## 🔄 Current Language Features

| Feature | Status |
|---------|--------|
| English | ✅ Complete (100+ keys) |
| Hindi | ✅ Complete (100+ keys) |
| Language Switcher | ✅ In Settings |
| Persistent Storage | ✅ Auto-saved |
| Type Safety | ✅ TypeScript |

---

## 🗂️ File Structure

```
project/
├── constants/
│   ├── translations/
│   │   ├── en.ts          ← English strings
│   │   ├── hi.ts          ← Hindi strings
│   │   └── index.ts       ← Registry
│   └── EXAMPLES.tsx       ← Code examples
├── context/
│   └── LanguageContext.tsx ← State management
├── components/
│   └── LanguageSwitcher.tsx ← UI selector
└── app/
    ├── _layout.tsx        ← Provider wrapper
    └── (tabs)/
        └── settings.tsx   ← Language selector
```

---

## 🎨 Available Languages

| Code | Name | Flag |
|------|------|------|
| `en` | English | 🇺🇸 |
| `hi` | हिंदी | 🇮🇳 |

---

## 💾 How Persistence Works

1. User selects language in Settings
2. Choice saved automatically to device storage
3. On app restart → language preference restored
4. No additional code needed!

---

## 🧪 Test the Feature

1. Go to **Settings** → Scroll down → See language selector
2. Try switching between English and Hindi
3. Content updates instantly
4. Close and reopen app → language persists ✅

---

## ⚡ Common Tasks

### Display current language
```typescript
const { language } = useLanguageContext();
console.log(language); // 'en' or 'hi'
```

### Change language programmatically
```typescript
const { setLanguage } = useLanguageContext();
await setLanguage('hi'); // Instantly updates all screens
```

### Conditional rendering by language
```typescript
const { language, t } = useLanguageContext();

if (language === 'hi') {
  return <Text>हिंदी मोड</Text>;
}
```

---

## 📖 All Available Translation Keys

Navigation:
- `home`, `businesses`, `customers`, `passbook`, `profile`, `settings`, `logout`, `appMenu`, `welcomeUser`

Business Management:
- `businessManagement`, `addBusiness`, `businessName`, `deleteBusiness`, etc.

Customer Management:
- `customerManagement`, `addCustomer`, `customerName`, `deleteCustomer`, etc.

Passbook & Transactions:
- `passbookManagement`, `addEntry`, `balance`, `totalDebit`, `totalCredit`, etc.

Settings & General:
- `language`, `selectLanguage`, `english`, `hindi`, `theme`, `darkMode`, `lightMode`, etc.

Buttons & Actions:
- `ok`, `close`, `cancel`, `save`, `delete`, `edit`, `add`, `done`, etc.

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Translations show key name | Restart app or check key spelling |
| Language doesn't persist | Check AsyncStorage installation |
| Type error for key | Add key to both en.ts and hi.ts |
| Settings screen empty | Ensure LanguageProvider in _layout.tsx |

---

## 📚 Documentation

- **MULTILANGUAGE.md** - Detailed documentation
- **MULTILANGUAGE_IMPLEMENTATION.md** - Implementation details
- **constants/EXAMPLES.tsx** - Code examples
- This file - Quick reference

---

## ✅ What's Ready

- ✅ 100+ translation keys
- ✅ English language pack
- ✅ Hindi language pack
- ✅ Language context & hooks
- ✅ UI language switcher
- ✅ Persistent storage
- ✅ Settings integration
- ✅ Type safety (TypeScript)
- ✅ Documentation & examples

## 🚀 You're All Set!

The multilanguage feature is fully implemented and ready to use. Start with the Settings screen to test it out!
