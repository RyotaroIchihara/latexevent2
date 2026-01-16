#!/bin/bash

# Cloudflare Pages環境変数設定ヘルパースクリプト
# .envファイルから環境変数を読み込んで、Cloudflare Pagesの環境変数設定用のコマンドを生成します

set -e

ENV_FILE=".env"
OUTPUT_FILE="cloudflare-env-vars.txt"

if [ ! -f "$ENV_FILE" ]; then
    echo "エラー: .envファイルが見つかりません"
    echo "まず、.env.exampleをコピーして.envファイルを作成してください"
    echo "  cp .env.example .env"
    exit 1
fi

echo "# Cloudflare Pages環境変数設定用"
echo "# 以下の内容をCloudflare Dashboardの環境変数設定にコピー＆ペーストしてください"
echo "#"
echo "# 手順:"
echo "# 1. Cloudflare Dashboard → Pages → プロジェクト選択"
echo "# 2. Settings → Environment variables"
echo "# 3. 以下の変数を追加（Production環境）"
echo ""
echo "============================================" > "$OUTPUT_FILE"
echo "Cloudflare Pages環境変数設定" >> "$OUTPUT_FILE"
echo "============================================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# .envファイルからVITE_で始まる環境変数を抽出
grep "^VITE_" "$ENV_FILE" | grep -v "^#" | while IFS='=' read -r key value; do
    # 値の前後の空白を削除
    value=$(echo "$value" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    # ダブルクォートで囲む（値にスペースが含まれる場合に対応）
    echo "$key=$value" >> "$OUTPUT_FILE"
done

echo "" >> "$OUTPUT_FILE"
echo "============================================" >> "$OUTPUT_FILE"
echo "設定完了後、以下のコマンドで確認できます:" >> "$OUTPUT_FILE"
echo "  cat $OUTPUT_FILE" >> "$OUTPUT_FILE"
echo "============================================" >> "$OUTPUT_FILE"

cat "$OUTPUT_FILE"
echo ""
echo "✅ 環境変数設定用のファイルを生成しました: $OUTPUT_FILE"
echo "   このファイルの内容をCloudflare Dashboardにコピー＆ペーストしてください"

