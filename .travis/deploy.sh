#!/bin/sh

setup_git() {
  git config --global user.email "${EMAIL}"
  git config --global user.name "Sagar Panda"
}

upload_files() {
  if [ -d "public" ]; then
    cp template.html public/index.html
    cd public
    git init
    git remote add origin-pages https://${GITHUB_TOKEN}@github.com/sagarpanda/music-box.git > /dev/null 2>&1
    git add -A
    git commit -m "Travis build: $TRAVIS_BUILD_NUMBER"
    git push -f origin-pages HEAD:gh-pages
  fi
}

setup_git
upload_files
