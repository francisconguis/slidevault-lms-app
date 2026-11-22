# SlideVault LMS — iOS & Android Mobile App (React Native / Expo)

A cross-platform **iOS & Android** Learning Management System (LMS) mobile application built with **React Native** and **Expo (SDK 58)** for uploading, storing, organizing, and sharing **Presentation Files (`.ppt`, `.pptx`, `.pdf`)** and **Course Exercises / Worksheets**.

---

## Key Features
- **Upload of PPT Presentations**:
  - Pick `.ppt`, `.pptx`, or `.pdf` lecture slides directly from your phone storage (iOS Files / iCloud Drive / Android Files) using `expo-document-picker`, or attach a built-in sample `.pptx` with one tap for quick testing.
  - Organize by Course/Subject, specify estimated slide count, lecture overview, and slide-by-slide outline.
  - Open, download, or share stored presentation files natively on iOS and Android via `expo-sharing`.
- **Upload of Exercises & Student Submissions**:
  - **Instructors** can upload lab exercises and activity worksheets (`.pdf`, `.docx`, `.pptx`, `.zip`), set due dates, maximum points, and instructions.
  - **Students** can open exercise instructions, download the attached worksheet, and **upload their completed exercise answer files** directly from their phone.
- **Instructor & Student Role Switcher**:
  - Instantly switch between **Instructor** and **Student** modes using the badge at the top right of the app header.
- **Course / Subject Folders & Local Persistence**:
  - Filter PPTs and exercises by course, search by keyword, and create custom course folders with color themes.
  - All courses, uploaded PPTs, exercises, and student submissions are saved persistently on the device using `@react-native-async-storage/async-storage`.

---

## How to Run the App on Your Phone (iPhone / iOS & Android)

### Step 1: Install **Expo Go** on Your Mobile Phone
- **iPhone (iOS)**: Open the Apple **App Store**, search for **Expo Go**, and install it.
- **Android**: Open the **Google Play Store**, search for **Expo Go**, and install it.

### Step 2: Start the App Server on Your Computer

#### Option A: One-Click Windows Launcher
Double-click [`RUN_MOBILE_APP.bat`](./RUN_MOBILE_APP.bat) or run it in PowerShell:
```powershell
.\RUN_MOBILE_APP.bat
```
*(This automatically checks/installs Node.js, installs all Expo SDK 58 dependencies, and starts the server with a QR code).*

#### Option B: Standard Terminal Commands (after cloning from GitHub)
```bash
git clone https://github.com/francisconguis/slidevault-lms-app.git
cd slidevault-lms-app
npm install
npx expo start
```

### Step 3: Scan the QR Code to Open on Your Phone
Make sure your phone and computer are connected to the **same Wi-Fi network** *(or run `npx expo start --tunnel` if on different networks)*:
- **On iPhone (iOS)**: Open your iPhone's built-in **Camera** app, point it at the QR code in the terminal, and tap **"Open in Expo Go"**.
- **On Android**: Open the **Expo Go** app, tap **"Scan QR code"**, and scan the QR code shown in the terminal.

---

## How to Use the App on Your Phone (User Guide)

### 1. Switching Between Instructor & Student Views
- Tap the **`Instructor` / `Student`** pill button at the top-right corner of the header to toggle roles at any time.

### 2. Uploading a Presentation File (PPT / PPTX)
1. Tap the orange **`+ Upload PPT`** button at the top of the screen (or go to the **PPT Files** tab).
2. Choose a **Course / Subject** chip (e.g., *IT 301 - Mobile Application Development*).
3. Tap **"Tap to Browse Device for PPT / PPTX File"** to pick a real `.ppt`, `.pptx`, or `.pdf` file from your phone's storage — or tap **"Quick Test: Attach Sample .PPTX File"** for an instant demo file.
4. Enter the **Presentation Title**, **Estimated Slides**, **Description**, and optional **Slide Outline**.
5. Tap **"Save & Upload PPT"**. Your presentation will immediately appear in the LMS storage list.

### 3. Viewing & Opening a Stored PPT Presentation
1. Tap any **PPT Presentation Card** on the **Home** or **PPT Files** tab.
2. View the presentation summary, slide count, and numbered **Slide Deck Contents / Outline**.
3. Tap the blue **"Open"** button on the attached file card to open or share the presentation file on your phone using the native iOS Share Sheet / Android file viewer.

### 4. Uploading a Course Exercise / Activity
1. Tap the teal **`+ Upload Exercise`** button at the top of the screen (or go to the **Exercises** tab).
2. Select the target **Course / Subject**.
3. Tap **"Tap to Attach Exercise File from Device"** to attach a worksheet (`.pdf`, `.docx`, `.zip`, etc.) — or tap **"Quick Test: Attach Sample Exercise Worksheet"**.
4. Enter the **Exercise Title**, **Due Date**, **Max Points**, and **Exercise Instructions**.
5. Tap **"Upload Exercise"** to publish the activity.

### 5. Submitting Completed Exercise Work (Student Workflow)
1. Tap any **Exercise Card** from the **Home** or **Exercises** tab to open its details.
2. Read the instructions and tap **"Open"** on the attached worksheet if you need to view/download the problem file.
3. Scroll down to the **"Upload Exercise Submission"** section:
   - Enter your **Student Name**.
   - Tap **"Select Completed Exercise File from Phone"** to pick your answer file (or tap **"+ Or Attach Sample Answer File"**).
   - Add an optional note for the instructor.
   - Tap **"Submit Exercise File"**.
4. Your submission is immediately recorded with a timestamp and **`Submitted`** badge under *Submitted Exercise Files*.

### 6. Managing Courses & Storage
- **Filter by Course**: Tap any course chip (`All Courses`, `IT 301`, `CS 204`, `IT 208`) below the search bar to filter PPTs and exercises.
- **Create a New Course Folder**: Tap **`+ New Course`** on the filter bar (or go to the **Courses** bottom tab and tap **`+ Add Course`**), enter the Course Code, Course Name, Instructor, and pick a folder color theme.
- **Search**: Use the search bar at the top to search across all PPT titles, exercise instructions, and file names.
- **Reset Sample Data**: Go to the **Courses** tab at the bottom and tap **"Reset Sample LMS Data"** anytime to restore the default demo courses, PPTs, and exercises.

---

## Project Structure
```text
project2/
├── App.js                              # Main app layout, tabs, search, course filters & state
├── index.js                            # Expo root component entry point
├── app.json                            # Expo iOS & Android configuration
├── package.json                        # Dependencies (Expo SDK 58 & React Native)
├── RUN_MOBILE_APP.bat                  # 1-click Windows setup & Expo server launcher
└── src/
    ├── components/
    │   ├── Header.js                   # Top app bar & Instructor/Student role switcher
    │   ├── UploadPptModal.js           # Modal for uploading .ppt/.pptx presentation files
    │   ├── UploadExerciseModal.js      # Modal for uploading course exercises & worksheets
    │   ├── ResourceDetailModal.js      # Modal for viewing PPTs, opening files & submitting exercises
    │   └── AddCourseModal.js           # Modal for creating new LMS course folders
    ├── data/
    │   └── initialData.js              # Preloaded sample courses, PPT decks & exercises
    └── storage/
        └── lmsStorage.js               # Persistent device storage helper (AsyncStorage)
```
