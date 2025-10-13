#!/bin/sh
set -e

echo "📦 Installing CocoaPods..."

gem install cocoapods --user-install || true

# Optional: remove old Pods first
rm -rf Pods

pod install

echo "✅ Pods installed."

echo "📁 Verifying generated Pod files..."
ls -l Pods/Target\ Support\ Files/Pods-SleepScan/

