# イマイコ（仮）

## 概要

SNSやWebで見つけた「いつか行きたい場所」を都道府県ごとに保存し、ライブ遠征や旅行、出張などで生まれた空き時間に、すぐ行き先を見つけられる場所ストックアプリです。

「いつか行きたい」を「今日行こう」に変えることをコンセプトとしています。

## 使用技術

- Ruby on Rails（API）
- React
- PostgreSQL
- Devise
- Docker
- Render
- RSpec

## ディレクトリ構成

- `backend/` : Ruby on Rails API
- `frontend/` : React（未着手）

## ローカル開発環境の起動方法

前提: Docker / Docker Compose がインストールされていること。

```bash
# バックエンド(Rails API) + PostgreSQLを起動
docker compose up backend

# 初回のみ: DBを作成
docker compose run --rm backend bin/rails db:create db:migrate
```

起動後、以下のヘルスチェックエンドポイントで疎通確認ができる。

```bash
curl http://localhost:3000/up
# => HTTP 200
```

停止する場合:

```bash
docker compose down
```

## 開発状況

現在開発中