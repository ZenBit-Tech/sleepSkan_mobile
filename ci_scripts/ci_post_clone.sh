#!/bin/sh
set -e

cd "$CI_PRIMARY_REPOSITORY_PATH/ios"

gem install cocoapods --user-install || true

pod repo update || true

pod install
