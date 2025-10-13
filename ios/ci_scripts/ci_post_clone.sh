#!/bin/zsh
set -euo pipefail

# Resolve paths (script is invoked from ios/ci_scripts by Xcode Cloud)
SCRIPT_DIR="$(cd -- "$(dirname "$0")" && pwd)"
IOS_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"        # .../repository/ios
ROOT_DIR="$(cd -- "$IOS_DIR/.." && pwd)"          # .../repository

echo "📁 Script dir: $SCRIPT_DIR"
echo "📁 iOS dir:    $IOS_DIR"
echo "📁 Repo root:  $ROOT_DIR"

export HOMEBREW_NO_INSTALL_CLEANUP=1

# --- Node 20 (keg-only: add to PATH explicitly) ---
if ! command -v brew >/dev/null 2>&1; then
  echo "❌ Homebrew not found on runner"; exit 1
fi
if ! brew list --versions node@20 >/dev/null 2>&1; then
  brew install node@20
fi
NODE_PREFIX="$(brew --prefix node@20)"
export PATH="$NODE_PREFIX/bin:$(brew --prefix)/bin:$PATH"
rehash  # zsh: refresh command cache
echo "🔎 node: $(command -v node)"; node -v || { echo "❌ node not on PATH"; exit 1; }

# --- Yarn Classic (avoid Corepack/Yarn 4 surprises) ---
if ! command -v yarn >/dev/null 2>&1; then
  brew install yarn || true   # installs 1.22.x
fi
echo "🔎 yarn: $(command -v yarn)"; yarn -v || true

# --- JS deps (run at repo root!) ---
cd "$ROOT_DIR"
if [ -f "yarn.lock" ]; then
  echo "📦 Installing JS deps via Yarn…"
  # Try strict; if lockfile is stale, fall back to update to unblock CI
  if ! yarn install --frozen-lockfile; then
    echo "⚠️  yarn.lock out of sync; updating lockfile in CI to unblock."
    yarn install
  fi
else
  echo "📦 No yarn.lock → using npm"
  if [ -f "package-lock.json" ]; then npm ci; else npm install; fi
fi

# Verify RN helper required by your Podfile
RN_PODS_RB="$ROOT_DIR/node_modules/react-native/scripts/react_native_pods.rb"
if [ ! -f "$RN_PODS_RB" ]; then
  echo "❌ Missing $RN_PODS_RB after JS install"; exit 1
fi

# --- CocoaPods (run in ios/) ---
cd "$IOS_DIR"
echo "📦 Ensuring CocoaPods…"
if ! command -v pod >/dev/null 2>&1; then
  export GEM_HOME="$HOME/.gem"
  export PATH="$GEM_HOME/bin:$PATH"
  gem install cocoapods --user-install --no-document || true
  rehash
fi
echo "🛠 pod: $(command -v pod)"

[ -f "Podfile" ] || { echo "❌ Podfile not found in $IOS_DIR"; exit 1; }

echo "🔧 pod install…"
pod install --verbose

echo "✅ Pods installed."
echo "🔎 Generated xcfilelist/xcconfig:"
/usr/bin/find "Pods/Target Support Files" -maxdepth 2 \( -name "*.xcfilelist" -o -name "*.xcconfig" \) -print || true
