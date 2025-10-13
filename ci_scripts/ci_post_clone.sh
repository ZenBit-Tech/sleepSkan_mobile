#!/bin/sh
set -e

echo "📦 Installing CocoaPods dependencies..."

# Fallback to current dir if not in Xcode Cloud
REPO_PATH="${CI_PRIMARY_REPOSITORY_PATH:-$(pwd)}"
cd "$REPO_PATH/ios"

gem install cocoapods --user-install || true
pod install

echo "✅ Pods installed successfully."
