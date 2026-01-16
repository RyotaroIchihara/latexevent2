# Supabase Functions 環境変数設定リマインダー

## 現在の状況

Supabase Functions (`server`) のデプロイは完了しましたが、環境変数の設定が必要です。

## 必須の環境変数設定

以下の環境変数をSupabase Dashboardで設定してください：

### 設定手順

1. **Supabase Dashboardにアクセス**
   - https://supabase.com/dashboard/project/qjonbiccqqbmepxitjxs/settings/functions

2. **Environment variablesセクションを開く**

3. **以下の環境変数を追加**

#### 必須の環境変数

```
TIME_SLOTS=slot1,slot2,slot3
```

#### 推奨の環境変数

```
SUPABASE_URL=https://qjonbiccqqbmepxitjxs.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```

`SUPABASE_SERVICE_ROLE_KEY` の取得方法：
- Supabase Dashboard → Settings → API → service_role key をコピー

## 設定後の確認

環境変数を設定した後、数分待ってから以下を実行：

```bash
./scripts/check-supabase-functions.sh
```

すべてのエンドポイントが `200 OK` を返すことを確認してください。

## 注意事項

- 環境変数を設定した後、Functionsが再起動されるまで数分かかる場合があります
- 環境変数が設定されていない場合、Functionsはデフォルト値を使用しますが、一部の機能が正常に動作しない可能性があります
