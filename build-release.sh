#!/usr/bin/env bash

# change platforms/android/app/build.gradle line: 229 with below setting
npm run build
cordova build android --release -- --keystore="phoenix.jks" --storePassword=bismillah --alias=phoenix
cp platforms/android/app/build/outputs/apk/release/app-release.apk ../sap-api/public/material-handling.apk
