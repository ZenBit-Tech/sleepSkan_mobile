#!/bin/sh
set -e

echo "📁 Running from: $(pwd)"

# Sanity check: ensure we're really in ios/
if [ ! -f "Podfile" ]; then
  echo "❌ Podfile not found in $(pwd). ci_post_clone.sh must live in ios/ci_scripts/"
  exit 1
fi

echo "📦 Installing CocoaPods (if needed)…"
ruby -v
which gem

# Install CocoaPods to user gem path (idempotent)
gem install cocoapods --user-install || true

# Ensure 'pod' is available on PATH (Xcode Cloud sometimes needs the explicit path)
if ! command -v pod >/dev/null 2>&1; then
  POD_EXEC=$(find ~/.gem -name pod -type f | head -n 1)
  if [ -z "$POD_EXEC" ]; then
    echo "❌ 'pod' CLI not found after gem install"
    exit 1
  fi
else
  POD_EXEC=$(command -v pod)
fi

echo "🔧 Running pod install…"
"$POD_EXEC" install --verbose

echo "✅ Pods installed."
echo "📁 Verifying generated Pod files…"
ls -la "Pods/Target Support Files/Pods-SleepScan/" || echo "⚠️ Could not list Pods-SleepScan folder (double-check target name)"
