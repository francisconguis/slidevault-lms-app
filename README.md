# SlideVault LMS — iOS & Android Mobile App (React Native / Expo)

A native cross-platform **iOS & Android** Learning Management System (LMS) mobile app built with **React Native & Expo** ([App.js](file:///c:/Users/thunderobot%20i7/Desktop/project2/App.js)).

## Features (iOS & Android)
- **Upload of PPT Presentations**:
  - Uses native mobile file picker (`expo-document-picker`) to select `.ppt`, `.pptx`, or `.pdf` presentation files from iPhone (iOS Files) or Android storage.
  - Organize by Course/Subject, add slide counts, descriptions, and slide outlines.
  - Open and share stored PPT files natively via iOS Share Sheet / Android Intent (`expo-sharing`).
- **Upload of Exercises & Student Submissions**:
  - Instructors can upload exercise worksheets (`.pdf`, `.docx`, `.zip`), instructions, due dates, and points.
  - Students can view exercises, open attached worksheets, and upload their completed exercise files from their phone.
- **Persistent Mobile Storage**:
  - Uses `@react-native-async-storage/async-storage` to store courses, PPT presentations, exercises, and student submissions on the device.

---

## How to Open on Your iPhone (iOS) & Android Phone

### Step 1: Install "Expo Go" on Your Phone
- **iPhone (iOS)**: Open the **App Store** and install **Expo Go**.
- **Android**: Open the **Google Play Store** and install **Expo Go**.

### Step 2: Run the 1-Click Setup & Launcher on Your PC
Since Node.js (`npm`) was not installed on this PC yet, run the automated launcher script [RUN_MOBILE_APP.bat](file:///c:/Users/thunderobot%20i7/Desktop/project2/RUN_MOBILE_APP.bat) in your terminal:

```powershell
.\RUN_MOBILE_APP.bat
```

What `RUN_MOBILE_APP.bat` does automatically:
1. Installs **Node.js LTS** automatically (if not installed yet) and adds `npm` to your PATH.
2. Runs `npm install` to download all React Native iOS/Android packages.
3. Runs `npx expo start` and displays a **QR Code** in your terminal.

### Step 3: Scan the QR Code with Your Phone
- **On iPhone**: Open the built-in **Camera** app, point it at the QR code in the terminal, and tap **"Open in Expo Go"**.
- **On Android**: Open the **Expo Go** app, tap **"Scan QR code"**, and scan the QR code in the terminal.
*(Make sure your phone and PC are connected to the same Wi-Fi network, or run `npx expo start --tunnel` if on different networks).*
