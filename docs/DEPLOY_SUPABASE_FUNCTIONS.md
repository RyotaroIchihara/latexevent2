# Supabase Functions デプロイガイド

## 現在のエラー

```
404 NOT_FOUND
"Requested function was not found"
```

このエラーは、`server` という名前のSupabase Functionがデプロイされていないことを示しています。

## デプロイ手順

### 前提条件

1. **Supabase CLIのインストール**

```bash
# npmでインストール
npm install -g supabase

# または、Homebrewでインストール（macOS）
brew install supabase/tap/supabase
```

2. **Supabase CLIのバージョン確認**

```bash
supabase --version
```

### デプロイ手順

#### ステップ1: Supabaseにログイン

```bash
supabase login
```

ブラウザが開き、Supabaseアカウントでログインします。

#### ステップ2: プロジェクトにリンク

```bash
supabase link --project-ref qjonbiccqqbmepxitjxs
```

プロジェクトIDを入力するか、対話形式で選択します。

#### ステップ3: 関数のデプロイ

```bash
supabase functions deploy server --project-ref qjonbiccqqbmepxitjxs
```

**注意**: 関数のソースコードは `src/supabase/functions/server/` ディレクトリにあります。

#### ステップ4: 環境変数の設定

Supabase Dashboardで環境変数を設定：

1. https://supabase.com/dashboard/project/qjonbiccqqbmepxitjxs/settings/functions にアクセス
2. 「Environment variables」セクションで以下を追加：

**必須の環境変数:**

```
TIME_SLOTS=slot1,slot2,slot3
```

**推奨の環境変数:**

```
SUPABASE_URL=https://qjonbiccqqbmepxitjxs.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```

`SUPABASE_SERVICE_ROLE_KEY` は以下で確認：
- Supabase Dashboard → Settings → API → service_role key

#### ステップ5: デプロイの確認

```bash
./scripts/check-supabase-functions.sh
```

すべてのエンドポイントが `200 OK` を返すことを確認してください。

## トラブルシューティング

### エラー: "Project not found"

```bash
# プロジェクトIDを確認
supabase projects list

# 正しいプロジェクトIDでリンク
supabase link --project-ref qjonbiccqqbmepxitjxs
```

### エラー: "Function not found" が続く場合

1. **Supabase Dashboardで確認**
   - https://supabase.com/dashboard/project/qjonbiccqqbmepxitjxs/functions
   - `server` 関数が表示されているか確認

2. **関数名の確認**
   - 関数名は `server` である必要があります
   - `src/supabase/functions/server/` ディレクトリが存在することを確認

3. **デプロイログの確認**
   - デプロイ時にエラーメッセージがないか確認
   - Supabase Dashboard → Edge Functions → Logs でエラーを確認

### プロビジョニングが完了していない場合

プロジェクトが再開（resume）中の場合は、プロビジョニングが完了するまで待つ必要があります。

確認方法：
- Supabase Dashboardでプロジェクトの状態を確認
- 左側メニューが表示され、Edge Functionsが利用可能になれば完了

## デプロイ後の確認

### 1. ヘルスチェック

```bash
curl -X GET \
  "https://qjonbiccqqbmepxitjxs.supabase.co/functions/v1/server/make-server-6fda9f73/health" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqb25iaWNjcXFibWVweGl0anhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMzc1ODMsImV4cCI6MjA3NzgxMzU4M30.ghl4qUqKI5W7sry5qoBO6H_JAovl_Sm8hXWzkQzcaEE"
```

期待されるレスポンス:
```json
{"status":"ok"}
```

### 2. スロット取得

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

## 参考情報

- Supabase Functions ドキュメント: https://supabase.com/docs/guides/functions
- Supabase CLI ドキュメント: https://supabase.com/docs/reference/cli
