# Cloudflare Pages 環境変数設定ガイド

## 現在の状況

ローカルの `.env` ファイルは設定済みですが、Cloudflare Pages では環境変数を手動で設定する必要があります。

## 設定手順

### 1. 環境変数設定ファイルの確認

以下のコマンドで、Cloudflare Pages用の環境変数設定ファイルを確認できます：

```bash
cat cloudflare-env-vars.txt
```

### 2. Cloudflare Dashboard での設定

#### ステップ1: Cloudflare Dashboard にアクセス

1. https://dash.cloudflare.com/ にログイン
2. 左側メニューから「Workers & Pages」をクリック
3. 「Pages」を選択
4. プロジェクトを選択

#### ステップ2: 環境変数設定ページを開く

1. プロジェクトの「Settings」タブをクリック
2. 左側メニューから「Environment variables」をクリック

#### ステップ3: 環境変数を追加

1. 「Add variable」ボタンをクリック
2. 以下の環境変数を1つずつ追加：

**Production環境に設定する変数:**

```
VITE_ADMIN_PASSWORD=***（機密情報のため非表示）
VITE_MODEL_NAME=Natsu Ameya
VITE_SUBTITLE=Latex Beauty 2.
VITE_EVENT_DATE=2026-02-07
VITE_EVENT_DATE_DISPLAY=2/7（土）
VITE_TIME_SLOTS=slot1:15:00-15:45,slot2:16:00-16:45,slot3:17:00-17:45
VITE_DURATION=45分 / 各枠
VITE_PRICE=¥13,000 / 一枠
VITE_OPTION=ハーネス、コルセット、マスクなど +¥2,000 / アイテム
VITE_LOCATION=都内スタジオ
VITE_CAPACITY=1名 / 各枠
VITE_CONTACT_EMAIL=contact@alt-fetish.com
VITE_API_PATH=make-server-6fda9f73
```

**注意事項:**
- 各環境変数の「Variable name」と「Value」を正確に入力
- 「Environment」で「Production」を選択（必要に応じて「Preview」も設定可能）
- 「Save」をクリックして保存

#### ステップ4: 一括設定（推奨）

Cloudflare Dashboardでは、環境変数を1つずつ追加する必要があります。以下の手順で効率的に設定できます：

1. `cloudflare-env-vars.txt` ファイルを開く
2. 各行をコピーして、Cloudflare Dashboardで「Add variable」をクリック
3. 「Variable name」に変数名（例: `VITE_ADMIN_PASSWORD`）を入力
4. 「Value」に値（例: `***（機密情報のため非表示）`）を入力
5. 「Environment」で「Production」を選択
6. 「Save」をクリック
7. 次の環境変数に進む

### 3. デプロイの再実行

環境変数を設定した後、以下のいずれかの方法で再デプロイを実行：

#### 方法1: 自動再デプロイ

環境変数を保存すると、自動的に再デプロイが開始される場合があります。

#### 方法2: 手動で再デプロイ

1. Cloudflare Dashboard → Pages → プロジェクト
2. 「Deployments」タブを開く
3. 最新のデプロイメントの「...」メニューをクリック
4. 「Retry deployment」を選択

#### 方法3: 新しいコミットでトリガー

```bash
# 何か小さな変更をコミット（例: READMEの更新）
git commit --allow-empty -m "Trigger Cloudflare Pages redeploy"
git push origin main
```

## 環境変数の確認

### デプロイ後の確認

1. Cloudflare Dashboard → Pages → プロジェクト → 「Deployments」
2. 最新のデプロイメントの「View build log」をクリック
3. ビルドログで環境変数が読み込まれているか確認

### アプリケーションでの確認

デプロイ後、ブラウザの開発者ツール（F12）のコンソールで以下を確認：

```javascript
// 環境変数が正しく読み込まれているか確認
console.log(import.meta.env.VITE_MODEL_NAME);
console.log(import.meta.env.VITE_EVENT_DATE);
console.log(import.meta.env.VITE_API_PATH);
```

## トラブルシューティング

### 環境変数が反映されない場合

1. **環境変数名の確認**
   - `VITE_` プレフィックスが付いているか確認
   - 大文字・小文字が正確か確認

2. **再デプロイの確認**
   - 環境変数を設定した後、再デプロイが実行されているか確認
   - 再デプロイが完了するまで数分かかる場合があります

3. **ビルドログの確認**
   - Cloudflare Dashboard → Pages → プロジェクト → 「Deployments」
   - 最新のデプロイメントの「View build log」でエラーがないか確認

4. **キャッシュのクリア**
   - ブラウザのキャッシュをクリア（Ctrl+Shift+Delete）
   - または、シークレットモードでアクセス

### 環境変数の更新方法

環境変数を更新する場合：

1. Cloudflare Dashboard → Pages → プロジェクト → Settings → Environment variables
2. 更新したい環境変数をクリック
3. 値を編集して「Save」をクリック
4. 再デプロイが自動的に開始されます

## 参考情報

- Cloudflare Pages 環境変数ドキュメント: https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables
- 生成された環境変数ファイル: `cloudflare-env-vars.txt`
