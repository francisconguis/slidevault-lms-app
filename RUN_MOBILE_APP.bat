@echo off
title SlideVault LMS - iOS and Android Mobile App Launcher (SDK 58)
echo ============================================================
echo   SlideVault LMS - Upgrading to Expo SDK 58.0.0 for iOS
echo ============================================================
echo.

set "PATH=%PATH%;C:\Windows\System32;C:\Windows\System32\WindowsPowerShell\v1.0;C:\Program Files\nodejs;%APPDATA%\npm"

echo [1/3] Installing Expo SDK 58...
call npm install expo@^58.0.0 --legacy-peer-deps

echo.
echo [2/3] Installing SDK 58 compatible React Native ^& Expo packages...
call npx expo install react react-native expo-status-bar @expo/vector-icons @react-native-async-storage/async-storage expo-document-picker expo-file-system expo-sharing

echo.
echo ============================================================
echo [3/3] Starting Expo SDK 58 Mobile Server!
echo   Scan the QR code below with your iPhone Camera app!
echo ============================================================
echo.

call npx expo start -c
pause
