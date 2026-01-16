# nem6ishi.github.io

根石将人（Masato NEISHI）の個人ポートフォリオサイトです。

## 概要

このサイトは、私のプロフィール、出版物、趣味などを紹介する個人ウェブサイトです。GitHub Pagesでホスティングされており、静的HTMLとTailwind CSSで構成されています。

## 技術スタック

- **HTML5**: セマンティックHTMLによる構造化
- **CSS3**: カスタムスタイルとTailwind CSS
- **Tailwind CSS**: ユーティリティファーストのCSSフレームワーク
- **Google Fonts**: Interフォントを使用
- **GitHub Pages**: ホスティング

## 機能

- **レスポンシブデザイン**: モバイル、タブレット、デスクトップに対応
- **アクセシビリティ**: ARIA属性、スキップリンク、キーボードナビゲーション対応
- **SEO最適化**: meta description、Open Graphタグ、Twitter Cardタグ
- **パフォーマンス**: 最適化されたフォント読み込み
- **Markdownブログ**: Marked.jsによるMarkdown→HTML変換、Front Matter対応
- **動的記事管理**: JSONファイルで記事メタデータを一元管理

## ページ構成

- `index.html` - プロフィールページ（職歴、学歴、出版物）
- `hobbies.html` - 趣味ページ
- `hobbies/travel.html` - 海外旅行記録
- `blog.html` - ブログ記事一覧
- `blog/article.html` - 個別記事表示ページ（Markdown対応）
- `blog/data/` - 記事データ（Markdownファイル）
- `blog/data/articles.json` - 記事メタデータ
- `common.css` - 共通スタイルシート

## ブログ記事の追加方法

1. **Markdownファイルを作成**

`blog/data/YYYY/YYYYMMDD_XX.md`の形式でファイルを作成：

```markdown
---
title: 記事タイトル
date: 2025-06-15
---

# 見出し

記事の本文をMarkdownで記述します。
```

2. **articles.jsonに登録**

`blog/data/articles.json`に記事情報を追加：

```json
{
  "id": "2025/20250615_01",
  "title": "記事タイトル",
  "date": "2025-06-15",
  "excerpt": "記事の概要を100文字程度で記述",
  "tags": ["タグ1", "タグ2"]
}
```

3. **ローカルで確認後、デプロイ**



## ローカル開発

このサイトは静的HTMLで構成されているため、特別なビルドプロセスは不要です。

```bash
# リポジトリをクローン
git clone https://github.com/nem6ishi/nem6ishi.github.io.git
cd nem6ishi.github.io

# 任意のHTTPサーバーで起動（例: Pythonの場合）
python -m http.server 8000

# ブラウザで http://localhost:8000 を開く
```

### 推奨開発ツール

- ブラウザの開発者ツールでレスポンシブデザインをテスト
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)でパフォーマンスとSEOをチェック

## デプロイ

このサイトはGitHub Pagesで自動的にデプロイされます。`main`ブランチにプッシュすると、自動的に本番環境に反映されます。

```bash
git add .
git commit -m "Update content"
git push origin main
```

## ライセンス

このリポジトリのコードはMITライセンスの下で公開されています。コンテンツ（テキスト、画像など）は著作権で保護されています。

## 連絡先

- GitHub: [@nem6ishi](https://github.com/nem6ishi)
- Email: （プロフィールページを参照）

---

© 2025 Masato NEISHI. All rights reserved.