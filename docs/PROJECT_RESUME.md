# Supabase プロジェクト再開（Resume）について

## 現在の状況

Supabase Freeプランでしばらく使用していなかった場合、プロジェクトが自動的に一時停止されます。現在、プロジェクトが再開（resume）中です。

## プロビジョニング中の表示

```
Setting up project
We are provisioning your database and API endpoints

This may take a few minutes
```

この表示が出ている間は、以下が利用できません：
- データベース
- APIエンドポイント
- Edge Functions

## 完了までの待機時間

通常、プロビジョニングには **5〜10分程度** かかります。

## 完了の確認方法

### 方法1: Supabase Dashboardで確認

1. Dashboardをリロード（F5）
2. プロジェクトの状態を確認
3. 左側メニューが表示され、以下の項目が利用可能になれば完了：
   - Database
   - Edge Functions
   - API

### 方法2: 確認スクリプトを実行

プロビジョニングが完了したら、以下のコマンドで確認：

```bash
./scripts/check-supabase-functions.sh
```

成功すれば、以下のようなレスポンスが返ってきます：

```
✅ ヘルスチェック成功
レスポンス: {"status":"ok"}

✅ スロット取得成功
レスポンス: {"success":true,"slots":[...]}
```

## プロビジョニング完了後の手順

### 1. Edge Functionsの確認

1. Supabase Dashboard → Edge Functions を開く
2. `server` という関数が存在するか確認

### 2. Functionsがデプロイされていない場合

以下のコマンドでデプロイ：

```bash
# Supabase CLIがインストールされていることを確認
supabase --version

# ログイン（必要に応じて）
supabase login

# プロジェクトにリンク
supabase link --project-ref qjonbiccqqbmepxitjxs

# 関数をデプロイ
supabase functions deploy server --project-ref qjonbiccqqbmepxitjxs
```

### 3. 環境変数の設定

Supabase Dashboard → Settings → Edge Functions → Environment variables で以下を設定：

- `TIME_SLOTS`: `slot1,slot2,slot3`
- `SUPABASE_URL`: `https://qjonbiccqqbmepxitjxs.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY`: (Dashboard → Settings → API → service_role key)

### 4. 動作確認

確認スクリプトを実行して、すべてのエンドポイントが正常に動作することを確認：

```bash
./scripts/check-supabase-functions.sh
```

## トラブルシューティング

### プロビジョニングが長時間かかる場合

- 10分以上かかる場合は、Supabaseのサポートに問い合わせることを検討
- または、プロジェクトを削除して新規作成することも可能（データは失われます）

### ERR_NAME_NOT_RESOLVED エラーが続く場合

1. プロビジョニングが完了しているか確認
2. Edge Functionsがデプロイされているか確認
3. 環境変数が正しく設定されているか確認

## 参考情報

- Supabase Freeプランの制限: https://supabase.com/docs/guides/platform/org-based-billing#free-tier
- プロジェクトの一時停止について: https://supabase.com/docs/guides/platform/org-based-billing#pausing-projects
