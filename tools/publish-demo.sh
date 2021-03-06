#!/bin/bash

set -o errexit -o nounset

if [ "$TRAVIS_BRANCH" != "master" ]
then
  echo "This commit was made against the $TRAVIS_BRANCH and not the master! No deploy!"
  exit 0
fi

rev=$(git rev-parse --short HEAD)

# Directory of Generated Files
cd dist-demo

git init
git config user.name "yogeshgadge"
git config user.email "yogeshgadge@gmail.com"

git remote add upstream "https://$GITHUB_TOKEN@github.com/US-CBP/ngx-cbp-theme.git"
git fetch upstream
git reset upstream/gh-pages

touch .


#git add -A .
#git commit -m "rebuild pages at ${rev}"
#git push -q upstream HEAD:gh-pages
