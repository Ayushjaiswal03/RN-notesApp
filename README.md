Notes App – React Native (Expo)

A simple note-taking app built using React Native + Expo, featuring:

User authentication

Create, edit, delete notes

Add images to notes

Search + sort

Local persistent storage (AsyncStorage)

Cross-platform (Android/iOS/Web)


🚀 Setup Instructions
1. Clone the Repository
git clone https://github.com/Ayushjaiswal03/RN-notesApp
cd RN-notesApp

2. Install Dependencies
npm install

3. Start the Project
npx expo start


Expo Dev Tools will open automatically.

You can now run the app in:

📱 Android / iOS Device

Install Expo Go from App Store / Play Store

Scan the QR displayed in terminal or browser

🌐 Run on Web
npx expo start --web

📦 Libraries Used
Library	Purpose
expo-router	File-based navigation
zustand	State management for auth + notes
expo-image-picker	Pick images from device
AsyncStorage	Local persistent storage
react-native	Core UI framework
expo	Build + runtime platform


📱 Features
✔ Authentication

Local-storage–based login & registration.

✔ Notes Management

Create note

Edit note

Delete note

Add image to notes

Notes sorted by latest edited

✔ Search & Sort

Search by title/body

Sort by title or last updated date

⚠️ Known Issues / Limitations

Expo Go sometimes times out on iPhone (common WiFi/network issue).

All data is stored locally, no real backend.

iOS standalone builds require a paid Apple Developer account.

Image picker behaves differently on web because of browser sandboxing.