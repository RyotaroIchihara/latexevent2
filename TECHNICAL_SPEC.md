# 技術仕様書

## 1. プロジェクト概要

### 1.1 概要
汎用的な予約システムを提供するWebアプリケーション。異なるモデル、日付、時間枠に対応できる設計となっています。

### 1.2 主要機能
- イベント情報の表示
- 時間枠の空き状況表示
- 予約フォーム（名前、メール、SNS、備考）
- 管理画面（予約一覧表示）
- 売り切れ状態の自動判定

## 2. 技術スタック

### 2.1 フロントエンド
- **フレームワーク**: React 18.3.1
- **ビルドツール**: Vite 6.3.5
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: Radix UI
- **ルーティング**: React Router DOM 6.30.1

### 2.2 バックエンド
- **ランタイム**: Deno
- **フレームワーク**: Hono
- **データベース**: Supabase (PostgreSQL)
- **ストレージ**: Key-Value Store (KVS) パターン

### 2.3 インフラ
- **ホスティング**: Cloudflare Pages
- **データベース**: Supabase
- **バックエンドAPI**: Supabase Edge Functions

### 2.4 主要ライブラリ
- `@jsr/supabase__supabase-js`: Supabaseクライアント
- `@radix-ui/*`: UIコンポーネントライブラリ
- `react-hook-form`: フォーム管理
- `hono`: バックエンドAPIフレームワーク

## 3. アーキテクチャ

### 3.1 全体構成

```
┌─────────────────┐
│  Cloudflare     │
│  Pages          │
│  (Frontend)     │
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼────────┐
│  Supabase       │
│  Edge Functions │
│  (Backend API)  │
└────────┬────────┘
         │
         │ PostgreSQL
         │
┌────────▼────────┐
│  Supabase       │
│  Database       │
│  (PostgreSQL)   │
└─────────────────┘
```

### 3.2 データフロー

1. **フロントエンド** → Supabase Edge Functions → PostgreSQL
2. 環境変数で設定を管理
3. 日付ベースでデータを分離

## 4. データベース構造

### 4.1 テーブル構造

```sql
CREATE TABLE kv_store_6fda9f73 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

### 4.2 データ保存形式

#### キー構造
```
booking:{date}:{slotId}
```

例:
- `booking:2025-12-06:slot1`
- `booking:2025-12-06:slot2`
- `booking:2026-01-15:slot1` (別の日付)

#### 値（JSONB）構造
```json
{
  "name": "田中僚",
  "email": "example@email.com",
  "sns": "むきだんご",
  "timeSlot": "slot1",
  "notes": "",
  "date": "2025-12-06",
  "timestamp": "2025-12-01T10:30:00.000Z"
}
```

### 4.3 データ分離
- 日付をキーに含めることで、同じデータベース内で異なる日付のイベントを分離
- 値の中にも`date`フィールドを保存

## 5. API仕様

### 5.1 エンドポイント

#### ヘルスチェック
```
GET /make-server-6fda9f73/health
```

**レスポンス:**
```json
{
  "status": "ok"
}
```

#### 時間枠取得
```
GET /make-server-6fda9f73/slots/:date
```

**パラメータ:**
- `date`: YYYY-MM-DD形式の日付

**レスポンス:**
```json
{
  "success": true,
  "slots": [
    {
      "id": "slot1",
      "available": true
    },
    {
      "id": "slot2",
      "available": false
    }
  ]
}
```

#### 予約作成
```
POST /make-server-6fda9f73/bookings
```

**リクエストボディ:**
```json
{
  "name": "田中僚",
  "email": "example@email.com",
  "sns": "むきだんご",
  "timeSlot": "slot1",
  "notes": "",
  "date": "2025-12-06"
}
```

**レスポンス:**
```json
{
  "success": true,
  "booking": {
    "name": "田中僚",
    "email": "example@email.com",
    "sns": "むきだんご",
    "timeSlot": "slot1",
    "notes": "",
    "date": "2025-12-06",
    "timestamp": "2025-12-01T10:30:00.000Z"
  }
}
```

#### 予約一覧取得
```
GET /make-server-6fda9f73/bookings/:date
```

**パラメータ:**
- `date`: YYYY-MM-DD形式の日付

**レスポンス:**
```json
{
  "success": true,
  "bookings": [
    {
      "name": "田中僚",
      "email": "example@email.com",
      "sns": "むきだんご",
      "timeSlot": "slot1",
      "notes": "",
      "date": "2025-12-06",
      "timestamp": "2025-12-01T10:30:00.000Z"
    }
  ]
}
```

### 5.2 認証
- Public Anon Keyを使用
- AuthorizationヘッダーにBearerトークンを含める

## 6. 環境変数

### 6.1 フロントエンド環境変数（Vite）

#### 必須
- `VITE_ADMIN_PASSWORD`: 管理画面パスワード

#### イベント設定（オプション）
- `VITE_MODEL_NAME`: モデル名
- `VITE_SUBTITLE`: サブタイトル
- `VITE_EVENT_DATE`: イベント日付（YYYY-MM-DD形式）
- `VITE_EVENT_DATE_DISPLAY`: イベント日付の表示形式
- `VITE_TIME_SLOTS`: 時間枠設定（`slot1:15:00-15:45,slot2:16:00-16:45`形式）
- `VITE_DURATION`: 各枠の時間
- `VITE_PRICE`: 料金
- `VITE_OPTION`: オプション情報
- `VITE_LOCATION`: 場所
- `VITE_CAPACITY`: 定員
- `VITE_CONTACT_EMAIL`: 問い合わせ先メールアドレス
- `VITE_API_PATH`: バックエンドAPIパス

### 6.2 バックエンド環境変数（Supabase Functions）
- `TIME_SLOTS`: 時間枠のIDリスト（カンマ区切り、例: `slot1,slot2,slot3`）
- `SUPABASE_URL`: SupabaseプロジェクトURL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Service Role Key

## 7. ファイル構造

```
latexevent2/
├── src/
│   ├── components/          # Reactコンポーネント
│   │   ├── HeroSection.tsx
│   │   ├── EventInfoSection.tsx
│   │   ├── BookingFormSection.tsx
│   │   ├── AdminView.tsx
│   │   └── ui/              # UIコンポーネント
│   ├── config/
│   │   └── event.ts         # イベント設定ファイル
│   ├── supabase/
│   │   └── functions/
│   │       └── server/
│   │           ├── index.tsx    # APIエンドポイント
│   │           └── kv_store.tsx # KVS操作
│   ├── utils/
│   │   └── supabase/
│   │       └── info.tsx     # Supabase設定
│   ├── App.tsx              # メインアプリケーション
│   └── main.tsx             # エントリーポイント
├── public/                  # 静的ファイル
├── package.json
├── vite.config.ts
└── README.md
```

## 8. コンポーネント構成

### 8.1 主要コンポーネント

#### HeroSection
- ヒーロー画像とモデル名を表示
- 予約ボタン（売り切れ時は無効化）

#### EventInfoSection
- イベント情報（日付、時間枠、料金など）を表示
- 時間枠の空き状況を表示

#### BookingFormSection
- 予約フォーム
- 時間枠選択（ラジオボタン）
- 入力項目: 名前、メール、SNS、備考

#### AdminView
- 予約一覧表示
- 管理画面（パスワード保護）

### 8.2 設定管理

#### event.ts
- 環境変数から設定を読み込み
- デフォルト値の提供
- 時間枠のパース処理

## 9. デプロイメント

### 9.1 フロントエンド（Cloudflare Pages）

#### ビルド設定
- **Build command**: `npm run build`
- **Build output directory**: `build`
- **Node version**: 20.x（.nvmrcで指定）

#### 環境変数設定
- Cloudflare Dashboard → Pages → Settings → Environment variables
- フロントエンド環境変数（`VITE_*`）を設定

### 9.2 バックエンド（Supabase Edge Functions）

#### デプロイ方法
- Supabase CLIまたはDashboardからデプロイ
- `src/supabase/functions/server/` をデプロイ

#### 環境変数設定
- Supabase Dashboard → Settings → Edge Functions → Environment variables
- `TIME_SLOTS`、`SUPABASE_URL`、`SUPABASE_SERVICE_ROLE_KEY`を設定

## 10. セキュリティ

### 10.1 認証・認可
- 管理画面: 環境変数でパスワードを管理
- API: Public Anon Keyを使用（フロントエンドからアクセス可能）

### 10.2 データ保護
- 環境変数は`.gitignore`に含まれ、リポジトリにコミットされない
- 管理画面パスワードは環境変数で管理

### 10.3 CORS設定
- バックエンドAPIでCORSを有効化
- `origin: "*"`で全オリジンを許可（本番環境では適切に制限推奨）

## 11. パフォーマンス

### 11.1 最適化
- Viteによる高速ビルド
- React SWCによる高速トランスパイル
- 静的アセットの最適化

### 11.2 データ取得
- 時間枠情報は30秒ごとに自動更新
- プレフィックス検索で効率的にデータ取得

## 12. ブランチ戦略

### 12.1 ブランチ構成
- `main`: 本番環境用
- `feature/generic-booking-system`: 汎用テンプレート
- `feature/{model}-{date}`: 各イベント用ブランチ

### 12.2 デプロイ構成
- 各Cloudflare Pagesプロジェクトで異なるブランチを指定
- 環境変数で各イベントの設定を分離

## 13. トラブルシューティング

### 13.1 よくある問題

#### 環境変数が反映されない
- 開発サーバーを再起動
- `.env`ファイルの構文を確認
- `VITE_`プレフィックスが付いているか確認

#### 予約ができない
- Supabase Functionsの環境変数`TIME_SLOTS`を確認
- バックエンドログを確認
- データベース接続を確認

#### 管理画面にアクセスできない
- 環境変数`VITE_ADMIN_PASSWORD`を確認
- URLパラメータまたはパスワード入力画面で認証

## 14. 今後の拡張性

### 14.1 改善点
- 正規化されたRDBテーブル設計への移行
- トランザクションによる同時予約の競合防止
- より柔軟なクエリ機能
- 認証システムの強化

### 14.2 スケーラビリティ
- 現在のKVSパターンは小規模用途に適している
- 大規模な場合は正規化されたテーブル設計を推奨

## 15. バージョン情報

- **React**: 18.3.1
- **Vite**: 6.3.5
- **TypeScript**: 最新
- **Supabase JS**: 2.49.8
- **Hono**: 最新

---

最終更新日: 2025年1月

