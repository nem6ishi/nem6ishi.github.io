#!/usr/bin/env python3
"""
generate_sitemap.py
-------------------
サイト全体の sitemap.xml を生成するスクリプト。
uv run python scripts/generate_sitemap.py で実行可能。
"""

import json
import os
import subprocess
import urllib.parse
from datetime import datetime
from pathlib import Path
import xml.sax.saxutils as saxutils

BASE_URL = "https://nem6ishi.github.io"
REPO_ROOT = Path(__file__).resolve().parent.parent

# 固定ページ一覧 (相対パス, priority, changefreq)
STATIC_PAGES = [
    ("", 1.0, "weekly"),                 # トップページ (index.html)
    ("blog.html", 0.8, "daily"),
    ("hobbies.html", 0.8, "weekly"),
    ("hobbies/cooking.html", 0.7, "monthly"),
    ("hobbies/sweets.html", 0.7, "monthly"),
    ("hobbies/recipe.html", 0.7, "monthly"),
    ("hobbies/okinawa.html", 0.7, "monthly"),
    ("hobbies/travel.html", 0.7, "monthly"),
    ("hobbies/fishing.html", 0.7, "monthly"),
    ("hobbies/fishing/squid.html", 0.7, "monthly"),
]


def get_git_last_modified(file_path: Path) -> str:
    """Gitコミット履歴からファイルの最終更新日 (YYYY-MM-DD) を取得。失敗時はmtimeを使用"""
    if file_path.exists():
        try:
            res = subprocess.run(
                ["git", "log", "-1", "--format=%cs", str(file_path)],
                cwd=REPO_ROOT,
                capture_output=True,
                text=True,
                check=True,
            )
            date_str = res.stdout.strip()
            if date_str:
                return date_str
        except Exception:
            pass
        mtime = file_path.stat().st_mtime
        return datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")
    return datetime.today().strftime("%Y-%m-%d")


def build_sitemap() -> str:
    xml_entries = []

    # 1. 静的ページ
    for rel_path, priority, changefreq in STATIC_PAGES:
        file_to_check = REPO_ROOT / ("index.html" if rel_path == "" else rel_path)
        lastmod = get_git_last_modified(file_to_check)
        url = f"{BASE_URL}/{rel_path}" if rel_path else f"{BASE_URL}/"

        xml_entries.append(
            f"""  <url>
    <loc>{saxutils.escape(url)}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>{changefreq}</changefreq>
    <priority>{priority:.1f}</priority>
  </url>"""
        )

    # 2. ブログ記事 (data/blog/articles.json より)
    articles_json_path = REPO_ROOT / "data" / "blog" / "articles.json"
    if articles_json_path.exists():
        with open(articles_json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            articles = data.get("articles", [])

        for article in articles:
            article_id = article.get("id")
            if not article_id:
                continue
            # 日付
            lastmod = article.get("updatedAt") or article.get("date") or datetime.today().strftime("%Y-%m-%d")
            # クエリパラメータ付きURL
            quoted_id = urllib.parse.quote(article_id, safe="/")
            url = f"{BASE_URL}/blog/article.html?id={quoted_id}"

            xml_entries.append(
                f"""  <url>
    <loc>{saxutils.escape(url)}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>"""
            )

    body = "\n".join(xml_entries)
    sitemap_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{body}
</urlset>
"""
    return sitemap_content


def main():
    sitemap_xml = build_sitemap()
    sitemap_path = REPO_ROOT / "sitemap.xml"
    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write(sitemap_xml)
    print(f"Generated {sitemap_path} successfully ({len(sitemap_xml.splitlines())} lines).")


if __name__ == "__main__":
    main()
