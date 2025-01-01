# ベースイメージとして node を使用
FROM node:18

# 作業ディレクトリを指定
WORKDIR /app

# 必要なファイルをコピー
COPY package.json yarn.lock ./

# 依存関係をインストール
RUN yarn install

# アプリケーションコードをすべてコピー
COPY . .

# Expo サーバーをデフォルトで起動
CMD ["yarn", "start"]
