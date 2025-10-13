#!/bin/zsh
set -e
set -u
set -o pipefail

# Script is invoked from ios/ci_scripts
SCRIPT_DIR="$(cd -- "$(dirname "$0")" && pwd)"
IOS_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"

PLIST_B64="${GOOGLE_SERVICE_INFO_BASE64:-}"
if [ -z "$PLIST_B64" ]; then
  echo "❌ GOOGLE_SERVICE_INFO_BASE64 is empty. Set it in the workflow Environment."
  exit 1
fi

TARGET_PLIST="$IOS_DIR/GoogleService-Info.plist"
echo "📝 Writing $TARGET_PLIST ..."

# Avoid logging secrets
set +x
# BSD base64 on macOS uses -D to decode
printf "%s" "$PLIST_B64" | /usr/bin/base64 -D > "$TARGET_PLIST"
set -x || true

/usr/bin/plutil -lint "$TARGET_PLIST"
echo "✅ Wrote $TARGET_PLIST"

# --- Versioning: set build number from Xcode Cloud
cd "$IOS_DIR"
: "${CI_BUILD_NUMBER:?CI_BUILD_NUMBER is not set by Xcode Cloud}"
/usr/bin/agvtool new-version -all "${CI_BUILD_NUMBER}"
echo "🔢 Updated build number to ${CI_BUILD_NUMBER}"