Expense Tracker App
A simple and modern mobile app to track your income and expenses, built with React Native, Expo, and TypeScript.

Features
📊 Dashboard: View your total balance, income, and expenses at a glance.
📝 Add Transactions: Easily add income or expense transactions with categories, date, and notes.
🗂️ Categories: Predefined categories for both income and expenses.
📅 History: Browse and filter your transaction history.
📈 Reports: Visualize your spending and income trends.
💸 Rupee Support: All amounts are displayed in ₹ (Indian Rupees).
🔍 Search & Filter: Quickly find transactions by category, date, or note.
🎨 Theming: Clean and modern UI with light/dark mode support.

Getting Started
Prerequisites
1.Node.js
2.Expo CLI
3.Git
4.Expo Go app on your mobile device

Installation
1) Clone the repository:
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
2) Install dependencies:
   npm install
3) Start the Expo development server:
   npx expo start
   or expo start
4) Scan the QR code with the Expo Go app on your phone to run the app.
   
Project Structure
.
├── app/                # App entry points and navigation
├── components/         # Reusable UI components
├── context/            # React contexts (theme, transactions, etc.)
├── hooks/              # Custom React hooks
├── utils/              # Utility functions and constants
├── types/              # TypeScript types
└── ...

Customization
Currency: The app uses the Indian Rupee (₹) by default. You can change this in calculations.ts.
Categories: Default categories are defined in defaultData.ts.

Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

License
MIT
