#!/bin/sh
set -euo pipefail

# Paths: script runs in ios/ci_scripts → we want ios/ and repo root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
IOS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ROOT_DIR="$(cd "$IOS_DIR/.." && pwd)"

echo "📁 Script dir: $SCRIPT_DIR"
echo "📁 iOS dir:    $IOS_DIR"
echo "📁 Repo root:  $ROOT_DIR"

# --- Homebrew & Node ---
if ! command -v brew >/dev/null 2>&1; then
  echo "❌ Homebrew not found on runner"; exit 1
fi

# Prefer Node LTS (often safer for RN). Uncomment these 3 lines to pin to Node 20:
# if ! brew list --versions node@20 >/dev/null 2>&1; then brew install node@20; fi
# brew link --overwrite --force node@20
# export PATH="$(brew --prefix node@20)/bin:$(brew --prefix)/bin:$PATH"

# Otherwise use current Homebrew node:
if ! command -v node >/dev/null 2>&1; then
  echo "⚙️ Installing Node..."
  brew install node
fi
export PATH="$(brew --prefix)/bin:$(brew --prefix)/opt/node/bin:$PATH"
echo "🔎 node: $(command -v node)"; node -v

# --- JS dependencies (install at repo ROOT) ---
cd "$ROOT_DIR"
if [ -f "yarn.lock" ]; then
  # Yarn (classic or berry)
  if ! command -v yarn >/dev/null 2>&1; then
    if command -v corepack >/dev/null 2>&1; then
      corepack enable || true
      corepack prepare yarn@stable --activate || true
    else
      brew install yarn || true
    fi
  fi
  echo "📦 Installing JS deps via Yarn…"
  yarn --version
  # Use frozen for Yarn Classic, immutable for Berry; try both gracefully
  yarn install --frozen-lockfile || yarn install --immutable
else
  echo "📦 Installing JS deps via npm…"
  if [ -f "package-lock.json" ]; then
    npm ci
  else
    npm install
  fi
fi

# Verify the RN helper exists now
if [ ! -f "$ROOT_DIR/node_modules/react-native/scripts/react_native_pods.rb" ]; then
  echo "❌ Missing react_native_pods.rb after installing JS deps:"
  echo "   $ROOT_DIR/node_modules/react-native/scripts/react_native_pods.rb"
  exit 1
fi

# --- CocoaPods (run in ios/) ---
cd "$IOS_DIR"
echo "📦 Ensuring CocoaPods…"
export GEM_HOME="$HOME/.gem"
export PATH="$GEM_HOME/bin:$PATH"
gem install cocoapods --user-install --no-document || true

POD_EXEC="$(command -v pod || true)"
[ -z "${POD_EXEC}" ] && POD_EXEC="$(/usr/bin/find "$GEM_HOME" -name pod -type f | head -n 1 || true)"
[ -z "${POD_EXEC}" ] && { echo "❌ 'pod' CLI not found after install"; exit 1; }
echo "🛠 Using pod at: $POD_EXEC"

echo "🔧 pod install…"
"$POD_EXEC" install --verbose

echo "✅ Pods installed."
echo "🔎 Generated xcfilelist/xcconfig:"
/usr/bin/find "Pods/Target Support Files" -maxdepth 2 \( -name "*.xcfilelist" -o -name "*.xcconfig" \) -print || true
