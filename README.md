
  # Event Announcement Page Design

  This is a code bundle for Event Announcement Page Design. The original project is available at https://www.figma.com/design/OKZBSU03A609M6sCwkiqqX/Event-Announcement-Page-Design.

  ## 汎用的な予約システム

  このブランチ（`feature/generic-booking-system`）では、異なるモデル、日付、時間枠に対応できる汎用的な予約システムとして実装されています。

  ## 環境変数の設定

  プロジェクトルートに `.env` ファイルを作成し、以下の環境変数を設定してください：

  ### 必須設定

  ```
  # 管理画面パスワード
  VITE_ADMIN_PASSWORD=your_admin_password_here
  ```

  ### イベント設定（オプション - デフォルト値が使用されます）

  ```
  # モデル名
  VITE_MODEL_NAME=Natsu Ameya
  
  # サブタイトル（オプション）
  VITE_SUBTITLE=Latex Beauty.
  
  # イベント日付（YYYY-MM-DD形式）
  VITE_EVENT_DATE=2025-12-06
  
  # イベント日付の表示形式
  VITE_EVENT_DATE_DISPLAY=12/6（土）
  
  # 時間枠設定（カンマ区切り、ID:時間の形式）
  # 例: slot1:15:00-15:45,slot2:16:00-16:45,slot3:17:00-17:45
  VITE_TIME_SLOTS=slot1:15:00-15:45,slot2:16:00-16:45,slot3:17:00-17:45
  
  # 各枠の時間
  VITE_DURATION=45分 / 各枠
  
  # 料金
  VITE_PRICE=¥13,000 / 一枠
  
  # オプション（オプション）
  VITE_OPTION=ハーネス、コルセット、マスクなど +¥2,000 / アイテム
  
  # 場所
  VITE_LOCATION=都内スタジオ
  
  # 定員
  VITE_CAPACITY=1名 / 各枠
  
  # 問い合わせ先メールアドレス
  VITE_CONTACT_EMAIL=altfetish.com@gmail.com
  
  # バックエンドAPIパス
  VITE_API_PATH=make-server-6fda9f73
  ```

  ### バックエンド環境変数（Supabase Functions）

  Supabase Functionsの環境変数として以下を設定してください：

  ```
  # 時間枠のIDリスト（カンマ区切り）
  TIME_SLOTS=slot1,slot2,slot3
  ```

  **重要**: 
  - `.env` ファイルは `.gitignore` に含まれているため、Gitリポジトリにはコミットされません
  - 本番環境（Cloudflare Pages）では、環境変数をCloudflare Dashboardで設定してください
  - Supabase Functionsの環境変数は、Supabase Dashboardの「Settings」→「Edge Functions」→「Environment variables」で設定してください

  ## 使用方法

  1. 環境変数を設定（`.env`ファイルまたはCloudflare Pagesの環境変数）
  2. バックエンドの環境変数も設定（Supabase Functions）
  3. 開発サーバーを起動

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  