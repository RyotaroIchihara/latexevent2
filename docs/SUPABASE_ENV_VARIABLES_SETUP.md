# Supabase Edge Functions 環境変数設定ガイド

## 環境変数設定の場所

Supabase DashboardのUIが更新されている可能性があります。以下のいずれかの方法で環境変数を設定できます。

## 方法1: Edge Functionsページから設定（推奨）

1. **Edge Functionsページにアクセス**
   - https://supabase.com/dashboard/project/qjonbiccqqbmepxitjxs/functions

2. **`server` 関数をクリック**

3. **関数の詳細ページで以下を確認**
   - 「Settings」タブまたは「Configuration」タブ
   - 「Environment Variables」セクション
   - または「Secrets」セクション

## 方法2: Settings → Edge Functionsから設定

1. **Settingsページにアクセス**
   - https://supabase.com/dashboard/project/qjonbiccqqbmepxitjxs/settings/functions

2. **「Environment Variables」または「Secrets」セクションを探す**

3. **関数名 (`server`) を選択して環境変数を追加**

## 方法3: プロジェクト設定から

1. **Settings → General にアクセス**
   - https://supabase.com/dashboard/project/qjonbiccqqbmepxitjxs/settings/general

2. **左側メニューから「Edge Functions」を選択**

3. **「Environment Variables」セクションを探す**

## 設定する環境変数

### 必須の環境変数

```
TIME_SLOTS=slot1,slot2,slot3
```

### 推奨の環境変数

```
SUPABASE_URL=https://qjonbiccqqbmepxitjxs.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```

`SUPABASE_SERVICE_ROLE_KEY` の取得方法：
- Supabase Dashboard → Settings → API → service_role key をコピー

## UIが見つからない場合

### 確認事項

1. **プロジェクトが正しく選択されているか**
   - プロジェクトID: `qjonbiccqqbmepxitjxs`

2. **プロジェクトの状態**
   - プロジェクトが再開（resume）中でないか確認
   - プロビジョニングが完了しているか確認

3. **権限の確認**
   - プロジェクトのオーナーまたは管理者権限があるか確認

### 代替方法: Supabase CLIで設定

環境変数をCLIで設定することも可能です：

```bash
# 環境変数を設定
supabase secrets set TIME_SLOTS=slot1,slot2,slot3 --project-ref qjonbiccqqbmepxitjxs

# 複数の環境変数を設定
supabase secrets set SUPABASE_URL=https://qjonbiccqqbmepxitjxs.supabase.co --project-ref qjonbiccqqbmepxitjxs
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your_key> --project-ref qjonbiccqqbmepxitjxs
```

**注意**: `supabase secrets` コマンドは、環境変数ではなくSecretsとして設定されます。Edge Functionsでは、SecretsとEnvironment Variablesは異なる場合があります。

## 設定後の確認

環境変数を設定した後、数分待ってから以下を実行：

```bash
./scripts/check-supabase-functions.sh
```

すべてのエンドポイントが `200 OK` を返すことを確認してください。

## トラブルシューティング

### 環境変数が反映されない場合

1. **Functionsの再デプロイ**
   ```bash
   supabase functions deploy server --project-ref qjonbiccqqbmepxitjxs
   ```

2. **数分待つ**
   - 環境変数の変更が反映されるまで数分かかる場合があります

3. **ログの確認**
   - Supabase Dashboard → Edge Functions → `server` → Logs
   - エラーメッセージを確認
