
  # Event Announcement Page Design

  This is a code bundle for Event Announcement Page Design. The original project is available at https://www.figma.com/design/OKZBSU03A609M6sCwkiqqX/Event-Announcement-Page-Design.

  ## 汎用的な予約システム

  このブランチ（`feature/generic-booking-system`）では、異なるモデル、日付、時間枠に対応できる汎用的な予約システムとして実装されています。

  ## 環境変数の設定

  ### 1. ローカル開発環境の設定

  プロジェクトルートに `.env` ファイルを作成し、環境変数を設定してください：

  ```bash
  # .env.exampleをコピーして.envファイルを作成
  cp .env.example .env
  
  # .envファイルを編集して実際の値を設定
  # （エディタで開いて各項目の値を設定してください）
  ```

  `.env.example`ファイルには、すべての環境変数のテンプレートが含まれています。

  ### 2. Cloudflare Pages環境変数の設定（簡単な方法）

  `.env`ファイルを設定したら、以下のスクリプトを実行してCloudflare Pages用の環境変数設定ファイルを生成できます：

  ```bash
  # スクリプトを実行
  ./scripts/generate-cloudflare-env.sh
  
  # 生成されたファイルを確認
  cat cloudflare-env-vars.txt
  ```

  生成された`cloudflare-env-vars.txt`ファイルの内容を、Cloudflare Dashboardの環境変数設定にコピー＆ペーストしてください。

  **手順:**
  1. Cloudflare Dashboard → Pages → プロジェクト選択
  2. Settings → Environment variables
  3. `cloudflare-env-vars.txt`の内容をコピー＆ペースト（Production環境）

  ### 3. バックエンド環境変数（Supabase Functions）

  Supabase Functionsの環境変数として以下を設定してください：

  ```
  # 時間枠のIDリスト（カンマ区切り）
  TIME_SLOTS=slot1,slot2,slot3
  ```

  **設定場所:**
  - Supabase Dashboard → Settings → Edge Functions → Environment variables

  **重要**: 
  - `.env` ファイルは `.gitignore` に含まれているため、Gitリポジトリにはコミットされません
  - `.env.example`はテンプレートとしてリポジトリに含まれています
  - `cloudflare-env-vars.txt`も`.gitignore`に含まれています

  ## 使用方法

  1. **ローカル開発環境の設定**
     - `.env.example`をコピーして`.env`ファイルを作成
     - `.env`ファイルを編集して実際の値を設定

  2. **Cloudflare Pages環境変数の設定**
     - `./scripts/generate-cloudflare-env.sh`を実行
     - 生成された`cloudflare-env-vars.txt`の内容をCloudflare Dashboardにコピー＆ペースト

  3. **バックエンドの環境変数設定**
     - Supabase Functionsの環境変数を設定（`TIME_SLOTS`など）

  4. **開発サーバーを起動**
     - `npm run dev`でローカル開発サーバーを起動

  ## 動作の仕組み

  1. **ローカル開発環境**
     - `.env`ファイルに環境変数を設定
     - Viteは起動時に`.env`ファイルを読み込みます
     - 環境変数が設定されていない場合は、デフォルト値が使用されます

  2. **本番環境（Cloudflare Pages）**
     - `.env`ファイルから`./scripts/generate-cloudflare-env.sh`を実行
     - 生成された`cloudflare-env-vars.txt`の内容をCloudflare Dashboardにコピー＆ペースト
     - これにより、`.env`ファイルとCloudflare Pagesの環境変数を同期できます

  3. **設定の反映**
     - `src/config/event.ts`が環境変数を読み込みます
     - 各コンポーネントが`eventConfig`を使用して表示内容を決定します

  **注意**: 
  - 環境変数を変更した場合は、開発サーバーを再起動する必要があります
  - Cloudflare Pagesの環境変数を変更した場合は、再デプロイが必要です

  ## 新しいイベント用のウェブページを作成する方法

  ### 推奨される構成

  #### 1. GitHubリポジトリ
  - 同じリポジトリ（`latexevent2`）を使用
  - 各イベント用に新しいブランチを作成

  #### 2. Cloudflare Pages
  - 各イベントごとに別のプロジェクトを作成
  - 各プロジェクトで異なるブランチを指定

  ### 具体的な手順

  #### 新しいイベント用のブランチを作成

  ```bash
  # 汎用ブランチから新しいブランチを作成
  git checkout feature/generic-booking-system
  git checkout -b feature/model-b-2026-01-15

  # 環境変数を設定（.envファイル）
  cp .env.example .env
  # .envファイルを編集して実際の値を設定
  # VITE_MODEL_NAME=Model B
  # VITE_EVENT_DATE=2026-01-15
  # VITE_EVENT_DATE_DISPLAY=1/15（金）
  # ... その他の設定

  # Cloudflare Pages用の環境変数ファイルを生成
  ./scripts/generate-cloudflare-env.sh

  # コミット・プッシュ
  git add .
  git commit -m "Model B イベント用設定"
  git push origin feature/model-b-2026-01-15
  ```

  #### Cloudflare Pagesで新しいプロジェクトを作成

  1. Cloudflare Dashboard → Pages → 「Create a project」
  2. GitHubリポジトリを選択: `RyotaroIchihara/latexevent2`
  3. ブランチを指定: `feature/model-b-2026-01-15`
  4. ビルド設定:
     - Build command: `npm run build`
     - Build output directory: `build`
  5. 環境変数を設定:
     - `cloudflare-env-vars.txt`ファイルの内容をコピー＆ペースト
     - または、`.env`ファイルの内容を手動で設定

  #### 構成のイメージ

  ```
  GitHubリポジトリ: latexevent2
  ├── main (本番環境用)
  ├── feature/generic-booking-system (汎用テンプレート)
  ├── feature/model-a-2025-12-06 (イベントA用)
  └── feature/model-b-2026-01-15 (イベントB用)

  Cloudflare Pagesプロジェクト:
  ├── latexevent2-production (mainブランチ)
  ├── model-a-event (feature/model-a-2025-12-06ブランチ)
  └── model-b-event (feature/model-b-2026-01-15ブランチ)
  ```

  #### メリット

  1. **1つのリポジトリで管理** - すべてのイベントを1つのリポジトリで管理できます
  2. **ブランチごとに独立** - 各ブランチが独立したデプロイとして機能します
  3. **環境変数で分離** - 各イベントの設定を環境変数で管理できます
  4. **簡単に作成可能** - 汎用ブランチから新しいイベントを簡単に作成できます

  #### 注意点

  - 各Cloudflare Pagesプロジェクトで環境変数を個別に設定してください
  - Supabase Functionsの環境変数も各イベント用に設定してください（必要に応じて）
  - 同じSupabaseプロジェクトを使う場合、日付でデータを分離できます（既に実装済み）

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  