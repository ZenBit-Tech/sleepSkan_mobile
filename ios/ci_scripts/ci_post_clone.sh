#!/bin/sh
set -euo pipefail

# Resolve paths: script lives in ios/ci_scripts → we want ios/
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
IOS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$IOS_DIR"

echo "📁 Running from: $(pwd)"

# Sanity check
if [ ! -f "Podfile" ]; then
  echo "❌ Podfile not found at: $IOS_DIR"
  exit 1
fi

echo "📦 Installing CocoaPods (if needed)…"
# Ensure user gem bin is on PATH (helps in CI)
export GEM_HOME="$HOME/.gem"
export PATH="$GEM_HOME/bin:$PATH"

ruby -v || true
which gem  || true

# Install cocoapods (idempotent)
gem install cocoapods --user-install --no-document || true

# Locate pod executable (Xcode Cloud sometimes needs explicit path)
if command -v pod >/dev/null 2>&1; then
  POD_EXEC="$(command -v pod)"
else
  POD_EXEC="$(/usr/bin/find "$GEM_HOME" -name pod -type f | head -n 1 || true)"
fi

if [ -z "${POD_EXEC:-}" ]; then
  echo "❌ 'pod' CLI not found after gem install"
  exit 1
fi
echo "🛠 Using pod at: $POD_EXEC"

echo "🔧 Running pod install…"
"$POD_EXEC" install --verbose

echo "✅ Pods installed."

echo "🔎 Verifying generated Pod files (xcconfig/xcfilelist)…"
# List all xcfilelists; target folder names can vary
/usr/bin/find "Pods/Target Support Files" -maxdepth 2 -name "*.xcfilelist" -print || true
