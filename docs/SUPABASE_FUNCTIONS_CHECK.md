# Supabase Functions 確認ガイド

このドキュメントでは、Supabase Functionsが正しくデプロイされているか確認する方法を説明します。

## 確認方法

### 方法1: Supabase Dashboardで確認（推奨）

1. **Supabase Dashboardにアクセス**
   - https://supabase.com/dashboard にログイン
   - プロジェクト `qjonbiccqqbmepxitjxs` を選択

2. **Edge Functionsページを開く**
   - 左側メニューから「Edge Functions」をクリック
   - または直接: https://supabase.com/dashboard/project/qjonbiccqqbmepxitjxs/functions

3. **関数の確認**
   - `server` という名前の関数が表示されているか確認
   - 関数が存在する場合、デプロイ済みです
   - 関数が存在しない場合、デプロイが必要です

4. **ログの確認**
   - 関数をクリックして詳細を表示
   - 「Logs」タブで実行ログを確認
   - エラーがないか確認

### 方法2: 確認スクリプトを使用

プロジェクトルートで以下のコマンドを実行:

```bash
# スクリプトに実行権限を付与
chmod +x scripts/check-supabase-functions.sh

# スクリプトを実行
./scripts/check-supabase-functions.sh
```

このスクリプトは以下をテストします:
- ヘルスチェックエンドポイント (`/make-server-6fda9f73/health`)
- スロット取得エンドポイント (`/make-server-6fda9f73/slots/:date`)
- 予約一覧取得エンドポイント (`/make-server-6fda9f73/bookings/:date`)

### 方法3: curlコマンドで直接テスト

#### ヘルスチェック

```bash
curl -X GET \
  "https://qjonbiccqqbmepxitjxs.supabase.co/functions/v1/server/make-server-6fda9f73/health" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqb25iaWNjcXFibWVweGl0anhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMzc1ODMsImV4cCI6MjA3NzgxMzU4M30.ghl4qUqKI5W7sry5qoBO6H_JAovl_Sm8hXWzkQzcaEE"
```

期待されるレスポンス:
```json
{"status":"ok"}
```

#### スロット取得

```bash
curl -X GET \
  "https://qjonbiccqqbmepxitjxs.supabase.co/functions/v1/server/make-server-6fda9f73/slots/2026-02-07" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqb25iaWNjcXFibWVweGl0anhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMzc1ODMsImV4cCI6MjA3NzgxMzU4M30.ghl4qUqKI5W7sry5qoBO6H_JAovl_Sm8hXWzkQzcaEE"
```

期待されるレスポンス:
```json
{
  "success": true,
  "slots": [
    {"id": "slot1", "available": true},
    {"id": "slot2", "available": true},
    {"id": "slot3", "available": true}
  ]
}
```

### 方法4: ブラウザで確認

ブラウザの開発者ツール（F12）のNetworkタブで、以下のURLにアクセス:

```
https://qjonbiccqqbmepxitjxs.supabase.co/functions/v1/server/make-server-6fda9f73/health
```

**注意**: ブラウザで直接アクセスする場合は、Authorizationヘッダーが必要なため、通常はエラーになります。curlやスクリプトを使用することを推奨します。

## デプロイ方法

Functionsがデプロイされていない場合、以下の手順でデプロイします。

### 前提条件

1. **Supabase CLIのインストール**
   ```bash
   npm install -g supabase
   ```

2. **Supabaseにログイン**
   ```bash
   supabase login
   ```

3. **プロジェクトにリンク**
   ```bash
   supabase link --project-ref qjonbiccqqbmepxitjxs
   ```

### デプロイ手順

1. **関数のデプロイ**
   ```bash
   supabase functions deploy server --project-ref qjonbiccqqbmepxitjxs
   ```

2. **環境変数の設定**
   Supabase Dashboard → Settings → Edge Functions → Environment variables で以下を設定:
   - `TIME_SLOTS`: `slot1,slot2,slot3` (またはカスタム値)
   - `SUPABASE_URL`: `https://qjonbiccqqbmepxitjxs.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: (Supabase Dashboard → Settings → API → service_role key)

3. **デプロイの確認**
   上記の確認方法で、エンドポイントが正しく動作するか確認

## トラブルシューティング

### ERR_NAME_NOT_RESOLVED エラー

このエラーは、DNS解決に失敗していることを示します。

**原因:**
- Supabase Functionsがデプロイされていない
- 関数名が間違っている
- プロジェクトIDが間違っている

**解決方法:**
1. Supabase DashboardでFunctionsがデプロイされているか確認
2. 関数名が `server` であることを確認
3. プロジェクトIDが `qjonbiccqqbmepxitjxs` であることを確認

### 404 Not Found エラー

**原因:**
- エンドポイントのパスが間違っている
- 関数内のルーティングが間違っている

**解決方法:**
1. 正しいURL構造を確認:
   ```
   https://{project-id}.supabase.co/functions/v1/{function-name}/{api-path}/{endpoint}
   ```
2. `src/supabase/functions/server/index.tsx` のルーティングを確認

### 500 Internal Server Error

**原因:**
- 環境変数が設定されていない
- データベース接続エラー
- コード内のエラー

**解決方法:**
1. Supabase Dashboard → Edge Functions → Logs でエラーログを確認
2. 環境変数が正しく設定されているか確認
3. データベース接続を確認

## 参考情報

- Supabase Functions ドキュメント: https://supabase.com/docs/guides/functions
- Supabase CLI ドキュメント: https://supabase.com/docs/reference/cli
