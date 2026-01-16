# Git/GitHub/Cloudflare Pages 状態整理

## 現在の状態（確認日時: 2025年1月）

### ローカルリポジトリ

**現在のブランチ**: `feature/generic-booking-system`

**ブランチ一覧**:
- `feature/generic-booking-system` (現在のブランチ) - 汎用的な予約システム
- `main` - メインブランチ

**未コミットの変更**:
- `.gitignore` (変更)
- `README.md` (変更)
- `src/components/AdminView.tsx` (変更)
- `src/components/BookingFormSection.tsx` (変更)
- `src/components/EventInfoSection.tsx` (変更)
- `src/components/HeroSection.tsx` (変更)
- `.env.example` (新規)
- `TECHNICAL_SPEC.md` (新規)
- `docs/` (新規ディレクトリ)
- `scripts/` (新規ディレクトリ)

### GitHubリポジトリ

**リモート**: `origin` → `https://github.com/RyotaroIchihara/latexevent2.git`

**ブランチ状態**:
- `origin/main` - メインブランチ（GitHub上）
- `origin/feature/generic-booking-system` - 汎用予約システムブランチ（存在する場合）

### Cloudflare Pages

**プロダクション環境**: `main` ブランチをデプロイ

## 問題点

1. **ローカルとGitHubの同期が取れていない**
   - ローカルの `main` は GitHub の `origin/main` より進んでいる
   - `feature/generic-booking-system` ブランチの変更が GitHub にプッシュされていない可能性

2. **Cloudflare Pagesの設定**
   - プロダクション環境は `main` ブランチをデプロイしている
   - 現在作業中の `feature/generic-booking-system` ブランチはデプロイされていない

## 推奨される対応

### オプション1: feature/generic-booking-system をメインにマージ

汎用的な予約システムを本番環境に反映する場合:

```bash
# 1. 現在の変更をコミット
git add .
git commit -m "Supabase FunctionsのURL修正とエラーハンドリング改善"

# 2. feature/generic-booking-system を GitHub にプッシュ
git push origin feature/generic-booking-system

# 3. main ブランチに切り替え
git checkout main

# 4. feature/generic-booking-system をマージ
git merge feature/generic-booking-system

# 5. main を GitHub にプッシュ
git push origin main

# 6. Cloudflare Pages が自動的に再デプロイ（main ブランチを監視しているため）
```

### オプション2: feature/generic-booking-system を別環境としてデプロイ

汎用的な予約システムを別のCloudflare Pagesプロジェクトとしてデプロイする場合:

```bash
# 1. 現在の変更をコミット
git add .
git commit -m "Supabase FunctionsのURL修正とエラーハンドリング改善"

# 2. feature/generic-booking-system を GitHub にプッシュ
git push origin feature/generic-booking-system

# 3. Cloudflare Pages で新しいプロジェクトを作成
#    - ブランチ: feature/generic-booking-system
#    - 環境変数を設定（.env ファイルの内容をコピー）
```

### オプション3: 現在の状態を確認してから判断

```bash
# 1. GitHub のブランチ状態を確認
git fetch origin
git branch -r

# 2. ローカルとリモートの差分を確認
git log main..origin/main
git log origin/main..main
git log feature/generic-booking-system..origin/feature/generic-booking-system
```

## ブランチ戦略の推奨

### 現在の構成

```
main (本番環境)
  └─ Cloudflare Pages プロダクション環境

feature/generic-booking-system (開発中)
  └─ 汎用的な予約システム
```

### 推奨される構成

```
main (本番環境)
  └─ Cloudflare Pages プロダクション環境

feature/generic-booking-system (開発ブランチ)
  └─ 汎用的な予約システム（テンプレート）

feature/{model}-{date} (各イベント用)
  └─ 各イベントごとのブランチ
  └─ Cloudflare Pages で別プロジェクトとしてデプロイ
```

## 次のステップ

1. **現在の変更をコミット**
   ```bash
   git add .
   git commit -m "Supabase FunctionsのURL修正とエラーハンドリング改善、確認スクリプト追加"
   ```

2. **GitHub の状態を確認**
   - https://github.com/RyotaroIchihara/latexevent2 でブランチ一覧を確認

3. **Cloudflare Pages の設定を確認**
   - Cloudflare Dashboard → Pages → プロジェクト設定
   - どのブランチをデプロイしているか確認

4. **方針を決定**
   - オプション1: メインにマージして本番環境に反映
   - オプション2: 別環境としてデプロイ
   - オプション3: 現状維持（開発継続）
