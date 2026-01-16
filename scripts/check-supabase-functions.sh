#!/bin/bash

# Supabase Functionsの確認スクリプト
# このスクリプトは、Supabase Functionsが正しくデプロイされているか確認します

set -e

# プロジェクトIDとPublic Anon Keyを設定
PROJECT_ID="qjonbiccqqbmepxitjxs"
PUBLIC_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqb25iaWNjcXFibWVweGl0anhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMzc1ODMsImV4cCI6MjA3NzgxMzU4M30.ghl4qUqKI5W7sry5qoBO6H_JAovl_Sm8hXWzkQzcaEE"

# 関数名とAPIパス
FUNCTION_NAME="server"
API_PATH="make-server-6fda9f73"
EVENT_DATE="2026-02-07"

# ベースURL
BASE_URL="https://${PROJECT_ID}.supabase.co/functions/v1/${FUNCTION_NAME}/${API_PATH}"

echo "============================================"
echo "Supabase Functions 確認スクリプト"
echo "============================================"
echo ""
echo "プロジェクトID: ${PROJECT_ID}"
echo "関数名: ${FUNCTION_NAME}"
echo "API Path: ${API_PATH}"
echo "イベント日付: ${EVENT_DATE}"
echo ""

# 1. ヘルスチェックエンドポイント
echo "1. ヘルスチェックエンドポイントをテスト..."
HEALTH_URL="${BASE_URL}/health"
echo "URL: ${HEALTH_URL}"
echo ""

HEALTH_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -H "Authorization: Bearer ${PUBLIC_ANON_KEY}" \
  "${HEALTH_URL}" 2>&1) || true

HTTP_STATUS=$(echo "${HEALTH_RESPONSE}" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "${HEALTH_RESPONSE}" | sed '/HTTP_STATUS/d')

if [ "${HTTP_STATUS}" = "200" ]; then
  echo "✅ ヘルスチェック成功"
  echo "レスポンス: ${BODY}"
else
  echo "❌ ヘルスチェック失敗"
  echo "HTTPステータス: ${HTTP_STATUS}"
  echo "レスポンス: ${BODY}"
fi
echo ""

# 2. スロット取得エンドポイント
echo "2. スロット取得エンドポイントをテスト..."
SLOTS_URL="${BASE_URL}/slots/${EVENT_DATE}"
echo "URL: ${SLOTS_URL}"
echo ""

SLOTS_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -H "Authorization: Bearer ${PUBLIC_ANON_KEY}" \
  "${SLOTS_URL}" 2>&1) || true

HTTP_STATUS=$(echo "${SLOTS_RESPONSE}" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "${SLOTS_RESPONSE}" | sed '/HTTP_STATUS/d')

if [ "${HTTP_STATUS}" = "200" ]; then
  echo "✅ スロット取得成功"
  echo "レスポンス: ${BODY}"
else
  echo "❌ スロット取得失敗"
  echo "HTTPステータス: ${HTTP_STATUS}"
  echo "レスポンス: ${BODY}"
  
  # エラーの詳細を表示
  if echo "${BODY}" | grep -q "ERR_NAME_NOT_RESOLVED\|Failed to fetch"; then
    echo ""
    echo "⚠️  DNS解決エラーが発生しています。"
    echo "   考えられる原因:"
    echo "   - Supabase Functionsがデプロイされていない"
    echo "   - 関数名が間違っている（現在: ${FUNCTION_NAME}）"
    echo "   - プロジェクトIDが間違っている（現在: ${PROJECT_ID}）"
  fi
fi
echo ""

# 3. 予約一覧取得エンドポイント
echo "3. 予約一覧取得エンドポイントをテスト..."
BOOKINGS_URL="${BASE_URL}/bookings/${EVENT_DATE}"
echo "URL: ${BOOKINGS_URL}"
echo ""

BOOKINGS_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -H "Authorization: Bearer ${PUBLIC_ANON_KEY}" \
  "${BOOKINGS_URL}" 2>&1) || true

HTTP_STATUS=$(echo "${BOOKINGS_RESPONSE}" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "${BOOKINGS_RESPONSE}" | sed '/HTTP_STATUS/d')

if [ "${HTTP_STATUS}" = "200" ]; then
  echo "✅ 予約一覧取得成功"
  echo "レスポンス: ${BODY}"
else
  echo "❌ 予約一覧取得失敗"
  echo "HTTPステータス: ${HTTP_STATUS}"
  echo "レスポンス: ${BODY}"
fi
echo ""

echo "============================================"
echo "確認完了"
echo "============================================"
echo ""
echo "次のステップ:"
echo "1. Supabase DashboardでFunctionsがデプロイされているか確認"
echo "   https://supabase.com/dashboard/project/${PROJECT_ID}/functions"
echo ""
echo "2. デプロイされていない場合は、以下のコマンドでデプロイ:"
echo "   supabase functions deploy server --project-ref ${PROJECT_ID}"
echo ""
echo "3. 環境変数が設定されているか確認:"
echo "   Supabase Dashboard → Settings → Edge Functions → Environment variables"
echo "   - TIME_SLOTS"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
