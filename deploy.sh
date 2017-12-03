#!/bin/sh

setup_git() {
  git config --global user.email "er.sagarpanda@gmail.com"
  git config --global user.name "Sagar Panda"
}

upload_files() {
  git remote add origin-pages https://${GITHUB_TOKEN}@github.com/sagarpanda/music-box.git > /dev/null 2>&1
  git subtree split --branch gh-pages --prefix public
  git checkout gh-pages

  if [ -d "public" ]; then
    cd public
    cp -r . ../
    cd ..
    rm -rf public
  fi
  rm -rf node_modules
  git add -A
  git commit -m "Travis build: $TRAVIS_BUILD_NUMBER"

  git push -f origin-pages gh-pages:gh-pages
  git checkout master
  git branch -D gh-pages
}

setup_git
upload_files
