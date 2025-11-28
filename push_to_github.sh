#!/bin/bash

# Ask for the repository URL
echo "GitHubのリポジトリURLを入力してください (例: https://github.com/username/simple-bbs.git):"
read REPO_URL

if [ -z "$REPO_URL" ]; then
  echo "URLが入力されませんでした。"
  exit 1
fi

# Add remote and push
git remote add origin "$REPO_URL"
git branch -M main
git push -u origin main

echo "完了しました！"
