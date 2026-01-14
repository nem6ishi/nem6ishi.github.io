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

## ページ構成

- `index.html` - プロフィールページ（職歴、学歴、出版物）
- `hobbies.html` - 趣味ページ
- `hobbies/travel.html` - 海外旅行記録
- `blog.html` - ブログページ（準備中）
- `common.css` - 共通スタイルシート

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