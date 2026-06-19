# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "feedparser",
#     "markdownify",
#     "beautifulsoup4",
#     "requests",
#     "python-dateutil",
# ]
# ///

import os
import re
import urllib.parse
from datetime import datetime
import feedparser
from bs4 import BeautifulSoup
from markdownify import markdownify as md
import requests
from dateutil import parser as date_parser

RSS_URL = "https://nem6ishi.hatenablog.com/rss"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOG_DATA_DIR = os.path.join(BASE_DIR, "blog", "data")
IMAGES_DIR = os.path.join(BASE_DIR, "images", "blog")

def download_image(url, save_path):
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    if os.path.exists(save_path):
        return
    print(f"Downloading {url} to {save_path}")
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(save_path, 'wb') as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)
    else:
        print(f"Failed to download image {url}")

def clean_filename(title):
    # ファイル名として無効な文字を置換
    title = re.sub(r'[\\/*?:"<>|]', "", title)
    title = title.replace(" ", "_").replace("　", "_")
    return title

def process_entry(entry):
    title = entry.title
    pub_date = date_parser.parse(entry.published)
    year_str = pub_date.strftime("%Y")
    date_str = pub_date.strftime("%Y-%m-%d")
    date_prefix = pub_date.strftime("%Y%m%d")
    
    tags = []
    if 'tags' in entry:
        tags = [t.term for t in entry.tags]
    
    content_html = entry.description
    
    soup = BeautifulSoup(content_html, 'html.parser')
    
    # 画像のダウンロードとURLの置換
    for img in soup.find_all('img'):
        src = img.get('src')
        if src and src.startswith('http'):
            parsed_url = urllib.parse.urlparse(src)
            img_filename = os.path.basename(parsed_url.path)
            if not img_filename or img_filename == "0" or "." not in img_filename:
                # 拡張子やファイル名がない場合のフォールバック
                img_filename = urllib.parse.quote_plus(src.split('/')[-1]) + ".jpg"
                
            local_img_rel_path = f"{year_str}/{date_prefix}_{img_filename}"
            local_img_path = os.path.join(IMAGES_DIR, local_img_rel_path)
            
            download_image(src, local_img_path)
            
            # Markdown内は絶対パスとして扱う
            img['src'] = f"/images/blog/{local_img_rel_path}"
    
    # はてなのキーワードリンクを解除（テキストのみ残す）
    for a in soup.find_all('a', class_='keyword'):
        a.unwrap()
        
    markdown_content = md(str(soup), heading_style="ATX")
    
    # フロントマターの作成
    tags_str = ", ".join(tags)
    frontmatter = f"""---
title: {title}
date: {date_str}
updatedAt: {date_str}
tags: {tags_str}
---
"""
    full_content = frontmatter + markdown_content
    
    # ファイル保存
    file_title = clean_filename(title)
    file_name = f"{date_prefix}_{file_title}.md"
    file_path = os.path.join(BLOG_DATA_DIR, year_str, file_name)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(full_content)
    
    print(f"Created {file_path}")

def main():
    print(f"Fetching RSS from {RSS_URL}")
    feed = feedparser.parse(RSS_URL)
    for entry in feed.entries:
        process_entry(entry)
    print("Migration complete!")

if __name__ == "__main__":
    main()
