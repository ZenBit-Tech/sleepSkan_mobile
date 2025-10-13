#!/bin/sh
set -euo pipefail

# cd to ios/ (script is executed from ios/ci_scripts)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
IOS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$IOS_DIR"

echo "📁 Running from: $(pwd)"

# --- Ensure Homebrew exists (Xcode Cloud runner has it) ---
if ! command -v brew >/dev/null 2>&1; then
  echo "❌ Homebrew not found on runner"
  exit 1
fi

BREW_PREFIX="$(brew --prefix || true)"
echo "🍺 Homebrew prefix: ${BREW_PREFIX:-unknown}"

# --- Install Node (and expose it on PATH) ---
if ! command -v node >/dev/null 2>&1; then
  echo "⚙️ Installing Node.js..."
  # Stable default (adjust if you need a specific major):
  brew install node
else
  echo "✅ Node already installed"
fi

# Add brew bins to PATH (covers both /opt/homebrew and /usr/local)
export PATH="$(brew --prefix)/bin:$(brew --prefix)/opt/node/bin:$PATH"
echo "🔎 node: $(command -v node || echo missing)"
node -v || { echo "❌ node still missing after install"; exit 1; }

# Optional: Yarn (some RN setups need it)
if ! command -v yarn >/dev/null 2>&1; then
  echo "⚙️ Enabling Corepack/Yarn..."
  if command -v corepack >/dev/null 2>&1; then
    corepack enable || true
    corepack prepare yarn@stable --activate || true
  else
    brew install yarn || true
  fi
  echo "🔎 yarn: $(command -v yarn || echo missing)"
fi

# --- CocoaPods ---
echo "📦 Ensuring CocoaPods is available…"
export GEM_HOME="$HOME/.gem"
export PATH="$GEM_HOME/bin:$PATH"
ruby -v || true
which gem  || true
gem install cocoapods --user-install --no-document || true

POD_EXEC="$(command -v pod || true)"
[ -z "${POD_EXEC}" ] && POD_EXEC="$(/usr/bin/find "$GEM_HOME" -name pod -type f | head -n 1 || true)"
[ -z "${POD_EXEC}" ] && { echo "❌ 'pod' CLI not found after install"; exit 1; }
echo "🛠 Using pod at: $POD_EXEC"

# --- Install Pods ---
if [ ! -f "Podfile" ]; then
  echo "❌ Podfile not found at: $(pwd)"
  exit 1
fi

echo "🔧 Running pod install…"
"$POD_EXEC" install --verbose

echo "✅ Pods installed."

# --- Verify generated Pod files (useful for earlier errors) ---
echo "🔎 Listing generated xcfilelist/xcconfig…"
/usr/bin/find "Pods/Target Support Files" -maxdepth 2 \( -name "*.xcfilelist" -o -name "*.xcconfig" \) -print || true
