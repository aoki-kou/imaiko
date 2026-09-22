# イマイコ Development Plan

## 1. アプリ概要

SNSやWebで見つけた「いつか行きたい場所」を都道府県ごとに保存し、
遠征・旅行・出張などで生まれた空き時間にすぐ見返せる場所ストックアプリ。

> 「いつか行きたい」を、「今日行こう」に変える。

保存項目は「場所名、都道府県、参照URL、メモ（任意）」とする。


## 2. MVP（完了）

### 実装済み機能

- ユーザー登録・ログイン・ログアウト
- 場所の登録
- 場所の一覧表示（都道府県ごと）
- 場所の編集
- 場所の削除
- 都道府県選択画面（一覧形式）


## 3. 本リリースに向けた開発

MVPで実装した場所ストック機能をベースに、
UI/UXの改善とイマイコ独自の体験を追加し、本リリースを目指す。

### 本リリースで実装する機能

- 日本地図を使用した都道府県選択UI
- アプリ全体のUI/デザイン刷新
- 「イマ → イコ」ロゴの導入
- スプラッシュ / トップ画面
- 設定画面
- レスポンシブ対応
- その他、本リリースに必要なUI/UX改善


## 4. 本リリースには含めない機能

- 検索機能
- カテゴリ管理・絞り込み
- ステータス管理（行きたい / 行った）
- SNS投稿の自動取り込み（OGP自動取得等）
- 写真アップロード
- 他ユーザーとの共有・フォロー等のSNS機能
- プッシュ通知・リマインダー
- 多言語対応
- モバイルアプリ化 / PWA


## 5. 将来的に検討する機能

- 現在地から保存済みの場所を探す機能
- 行った場所の記録
- 写真の保存
- カテゴリ・タグ
- 検索・絞り込み
- SNS投稿からの場所情報取得
- 他ユーザーとの共有

## 4. 認証方式

devise-jwtを採用する。

- React(フロントエンド)とRails API(バックエンド)をRender上で別オリジンとして公開する前提のため、セッションCookieではなくトークンベース(JWT)の認証方式とする
- devise-jwtの追加は承認済み

## 5. 想定ユーザーの利用フロー

1. SNS/Webで気になる場所を見つける
2. アプリにログインし、場所名・都道府県・参照URL・メモ(任意)を登録
3. 都道府県ごとに場所が蓄積されていく
4. 遠征/旅行/出張などで空き時間ができたとき、対象都道府県の一覧を開いて見返す
5. 不要になった場所は削除、内容が変わった場所は編集して整理する

## 6. 必要な画面一覧

- 会員登録画面
- ログイン画面
- 都道府県選択画面(一覧形式・トップ)
- 場所一覧画面(都道府県別)
- 場所登録画面
- 場所編集画面

## 7. 実装タスク一覧

| # | ブランチ名候補 | 目的 | 完了条件 | 依存 |
|---|---|---|---|---|
| 1 | `chore/setup-backend-environment` | ローカルで動作するRails API環境の土台を作る | モノレポ構成(`backend/`, `frontend/`)、`docker-compose up`でRails API + PostgreSQLが起動、ヘルスチェック用エンドポイントが200を返す、起動手順をREADME等に記載 | なし |
| 2 | `chore/setup-frontend-environment` | React開発環境を整え、バックエンドとの通信経路を確立する | `frontend/`にReactプロジェクトを作成しdocker-compose経由で起動、CORS設定済みでReactからバックエンドのヘルスチェックを呼び出し画面に表示できる | 1 |
| 3 | `feature/backend-auth-jwt` | 別オリジン構成でトークンベースのログイン状態管理を可能にする | Userモデル作成、devise + devise-jwt導入、会員登録/ログイン/ログアウト/現在ユーザー取得APIが動作、JWTがレスポンスで返却されBearer認証に使える、RSpec(モデル・request spec)を同タスク内で作成しpassする | 1 |
| 4 | `feature/frontend-auth` | ユーザーがアカウント作成・ログイン状態保持・ログアウトを行えるようにする | 登録/ログインフォームからAPIを呼び出しJWTを保持、ログアウトでトークン破棄、未ログイン時は保護ページアクセス時にログイン画面へリダイレクト、入力バリデーションエラー表示 | 2, 3 |
| 5 | `feature/backend-place-crud` | 場所データを保存・取得・更新・削除できるAPIを提供する | Placeモデル作成(name, prefecture, url, memo, user_id)、必須項目バリデーション、登録/一覧(都道府県フィルタ)/更新/削除APIがログインユーザーの認可付きで動作、RSpec(モデル・request spec)を同タスク内で作成しpassする | 3 |
| 6 | `feature/frontend-prefecture-list` | 都道府県を選び場所一覧画面へ遷移できるようにする | 47都道府県が一覧表示され、クリックで該当都道府県の場所一覧画面へ遷移する | 4 |
| 7 | `feature/frontend-place-list` | 保存した場所を都道府県ごとに見返し、不要な場所を削除できるようにする | 選択した都道府県の場所一覧がAPIから取得・表示(0件時の表示含む)、一覧からの削除操作が確認の上APIを呼び即時反映される | 5, 6 |
| 8 | `feature/frontend-place-form` | 場所の新規登録・既存情報の編集ができるようにする | 登録フォーム(場所名・都道府県・URL・メモ)から登録APIを呼び出し成功後一覧に反映、編集画面で既存データが初期表示され更新APIで変更反映、入力バリデーションエラー表示 | 5, 7 |
| 9 | `chore/deploy-render` | 本番環境でMVPを公開する | Render上でRails API + PostgreSQLが起動しヘルスチェックが応答、Render上でReactがビルド・公開され本番APIと別オリジンで疎通できる、DB接続情報・JWTシークレット等の環境変数をRenderで管理 | 1〜8の主要機能完成 |
| 10 | `feature/add_tailwind_css` | フロントエンドにTailwind CSSを導入し、今後のUI実装の基盤を整える | Tailwind CSSがReact環境に導入され、既存画面を壊さずスタイルを適用できることを確認、Lint・ビルドが成功する | 9 |
| 11 | `feature/common_ui_components` | 再利用可能な共通UIコンポーネントを整備し、画面間で一貫したUIを構築できるようにする | Button・Input・Card等、複数画面で使用する共通UIコンポーネントを実装し、主要画面から再利用できる状態にする | 10 |
| 12 | `feature/original_ui_design` | イマイコのコンセプトに合ったオリジナルUIを設計・実装し、アプリ全体の視認性と操作性を向上させる | ログイン・会員登録、都道府県一覧、場所一覧、場所登録・編集等の主要画面に統一したデザインを適用し、既存機能を維持したまま一連の操作が行える | 10, 11 |
| 13 | `feature/japan_map_ui` | 都道府県を日本地図から直感的に選択できるようにし、行きたい場所を探しやすくする | 日本地図UIを実装し、地図上から都道府県を選択すると、その都道府県の場所一覧へ正常に遷移できることを確認する | 12 |
| 14 | `feature/splash_screen` | アプリ起動時にイマイコのブランドや世界観を伝える導入画面を表示する | スプラッシュ画面を実装し、アプリ起動時に表示された後、適切な初期画面へ正常に遷移することを確認する | 12 |
| 15 | `feature/google_login` | Googleアカウントを利用して簡単にログインできるようにする | Googleログインを実装し、新規ユーザー・既存ユーザーともにGoogle認証後にログインでき、既存のメールアドレス・パスワード認証と併用できることを確認する | 12 |
| 16 | `feature/account_profile` | ユーザーが自身のプロフィール情報を確認・変更できるようにする | ユーザー名の登録・変更、Googleログインで取得したプロフィール画像等を利用したアカウントアイコン表示を実装し、ログイン中のユーザー自身の情報に正しく反映されることを確認する | 15 |
| 17 | `feature/account_deletion` | ユーザーが自身のアカウントを安全に削除できるようにする | アカウント削除機能を実装し、ログイン中のユーザー本人のみが削除を実行でき、関連するユーザーデータが設計どおりに処理されることを確認する | 16 |
| 18 | `feature/responsive_design` | PC・スマートフォンなど異なる画面サイズでも快適に利用できるようにする | 主要画面をレスポンシブ対応し、PC・スマートフォンの双方でレイアウト崩れや操作困難な箇所がないことを確認する | 13, 14, 15, 16, 17 |
| 19 | `feature/google_analytics` | 公開後の利用状況を把握し、今後の改善に活用できるようにGoogle Analyticsを導入する | Google Analyticsを本番環境に導入し、必要なページビューやユーザー数等を計測できることを確認する | 18 |
| 20 | `chore/deploy_enhancements` | UI改善・日本地図・認証・アカウント機能等の本リリース向け追加実装を本番環境へ反映する | #13〜19の変更がRender本番環境へ正常にデプロイされ、本番環境でフロントエンド・Rails API・Neon・Google関連機能が正常に連携することを確認する | 13〜19 |
| 21 | `test/final_check` | アプリ全体の完成条件を満たしているか最終確認し、公開版としての品質を確認する | RSpec・Lint・ビルド等の既存テストを実行し、本番環境で会員登録・ログイン・Googleログイン・都道府県選択・日本地図・場所CRUD・プロフィール・アカウント削除・ログアウト等の主要操作を一通り確認し、PC・スマートフォン双方で重大な問題がないことを確認する | 20 |

## 8. タスク進捗

## 8. タスク進捗

| # | タスク | 進捗 |
|---|---|---|
| 1 | バックエンド初期構築 | 完了 |
| 2 | フロントエンド初期構築+疎通確認 | 完了 |
| 3 | 認証(devise-jwt)導入+API実装+RSpec | 完了 |
| 4 | フロント 会員登録/ログイン/ログアウト | 完了 |
| 5 | Placeモデル+CRUD API+RSpec | 完了 |
| 6 | フロント 都道府県選択画面 | 完了 |
| 7 | フロント 場所一覧+削除 | 完了 |
| 8 | フロント 場所登録・編集 | 完了 |
| 9 | Renderデプロイ設定 | 完了 |
| 10 | Tailwind CSS導入 | 完了 |
| 11 | 共通UIコンポーネントの実装 | 完了 |
| 12 | オリジナルUIの設計・実装 | 完了 |
| 13 | 日本地図UIの実装 | 完了 |
| 14 | スプラッシュ画面の実装 | 未着手 |
| 15 | Googleログイン機能の追加 | 未着手 |
| 16 | プロフィール機能の追加 | 未着手 |
| 17 | アカウント削除機能の追加 | 未着手 |
| 18 | レスポンシブ対応 | 未着手 |
| 19 | Google Analytics導入 | 未着手 |
| 20 | 本番環境への反映 | 未着手 |
| 21 | 最終動作確認 | 未着手 |

## 9. 更新履歴

| 日付 | 内容 |
|---|---|
| 2026-08-05 | MVP範囲・タスク一覧を確定し、development-plan.mdを新規作成 |
| 2026-08-07 | タスク#1(バックエンド初期構築)完了。backend/にRails 8 API(Ruby 3.3.12)を構築、docker-compose.yml(backend + PostgreSQL)を追加、/upヘルスチェックで200を確認 |
| 2026-08-07 | タスク#2(フロントエンド初期構築+疎通確認)完了。frontend/にVite + React + TypeScriptプロジェクトを構築、docker-compose.ymlにfrontendサービス(ポート5173)を追加、backendにrack-corsを導入しlocalhost:5173からのアクセスを許可、React側からGET /upを呼び出し画面上に接続結果を表示することを確認 |
| 2026-08-07 | タスク#3(認証devise-jwt導入)完了。devise+devise-jwtを導入しUserモデル(email/encrypted_password/jti)を作成、JWT失効はJTIMatcher方式(jtiユニークインデックス)を採用、JWT署名鍵はsecret_key_baseと分離した専用のjwt_secret_keyをCredentialsで管理。POST /users(会員登録)・POST /users/sign_in(ログイン)・DELETE /users/sign_out(ログアウト)・GET /current_user(現在ユーザー取得)をJSON APIとして実装し、CORSでAuthorizationヘッダをexpose。RSpec(モデルspec6件+requestスペック7件、計13件)全てpass。curlによる実サーバでの会員登録→ログイン→current_user取得→ログアウト→トークン失効の一連フローも確認済み |
| 2026-08-09 | タスク#4(フロント 会員登録/ログイン/ログアウト)完了。react-router-domを追加し、AuthContext(React Context+localStorage)でJWTとログイン状態を管理。/register・/loginの公開画面、認証必須の保護ルート(未ログイン時は/loginへリダイレクト、ログイン中は/login・/registerから/へリダイレクト)、入力バリデーションエラー表示を実装。バックエンドAPI呼び出し時にAccept: application/jsonヘッダを付与し、Devise認証失敗時のエラーレスポンスがJSONで返るよう対応。ブラウザでの登録→自動ログイン→リロードでのセッション復元→ログアウト→未ログイン時リダイレクト→誤ったパスワードでのエラー表示→再ログインの一連の流れを確認済み |
| 2026-08-10 | タスク#5(Placeモデル+CRUD API+RSpec)完了。Placeモデル(name, prefecture, url, memo, user_id)を作成し、prefectureは47都道府県の定数によるinclusionバリデーション、urlは空欄許可・入力時はhttps形式のみ許可するバリデーションを実装。登録/一覧(都道府県フィルタ)/更新/削除APIを`current_user.places`起点でscopeし、他ユーザーのPlaceを指定した場合はApplicationControllerの共通rescue_fromにより404を返すよう対応。RSpec(モデルspec10件+requestスペック13件)を追加し、既存分と合わせて全36件pass。curlによる実サーバでの登録→不正な都道府県での422確認→都道府県フィルタ付き一覧取得の一連フローも確認済み |
| 2026-08-20 | タスク#6(フロント 都道府県選択画面)完了。47都道府県を`frontend/src/constants/prefectures.ts`に定数配列として切り出し(バックエンドのPlaceモデルのPREFECTURES定義に準拠した表記・順序)。トップ画面(`/`)を`PrefectureListPage`とし、都道府県一覧表示とログアウト機能(旧HomePageから統合)を実装、各都道府県クリックで`/places?prefecture=<都道府県名>`へ遷移するようにした。クエリパラメータの組み立てにはreact-router-domの`createSearchParams`を用い、手動encodeURIComponentによる二重エンコードを回避。遷移先の`/places`には最小限のプレースホルダー(`PlacesPage`)を追加し、クエリパラメータの都道府県名を表示するのみとした(一覧取得・表示はタスク#7で実装予定)。build(tsc + vite build)・lint(oxlint)ともに成功。ブラウザで未ログイン時のリダイレクト、会員登録→ログイン後のトップ画面表示、都道府県一覧の表示、リンクURLのエンコード内容、クリックによる遷移と表示、戻るリンクの動作を確認済み |
| 2026-08-30 | タスク#7(フロント 場所一覧+削除)完了。着手前に、mainへマージ済みだった`feature/backend_place_crud`(Place CRUD API)が本ブランチに未反映であることを確認し、mainをmergeして取り込み済み。`frontend/src/features/places/placesApi.ts`を新規追加し、`fetchPlaces`(`GET /places?prefecture=`、クエリ組み立てはURLSearchParamsを使用し手動エンコードは行わない)・`deletePlace`(`DELETE /places/:id`)・`PlacesApiError`を実装。`PlacesPage`のプレースホルダーを置き換え、都道府県別の一覧取得・表示、0件時の表示、都道府県未選択時の表示(読み込み中のまま止まらないよう分岐)、削除操作(`window.confirm`による確認、成功時は一覧から即時除外、失敗時は一覧を変更せずエラー表示)を実装。lint(oxlint)・build(tsc + vite build)ともに成功、フロントエンドの自動テストは未導入のため対象外。docker composeでバックエンド・フロントエンドを起動し、DBマイグレーション(Placeテーブル作成)を適用、テスト用ユーザーと東京都の場所2件を用いてブラウザで一覧表示(複数件・0件・都道府県未選択)を確認。削除操作は自動化環境の制約でネイティブ確認ダイアログを直接操作できないため、キャンセル時の非変化はブラウザで確認し、確認OK時の削除はAPIを直接呼び出し一覧への反映(再取得後に対象が消えること)を確認した |
| 2026-08-31 | タスク#8(フロント 場所登録・編集)完了。新規登録・編集フォームを`PlaceForm`コンポーネントとして共通化し、`PlaceNewPage`(`/places/new`)・`PlaceEditPage`(`/places/:id/edit`)を追加。編集画面での既存データ取得のため、backendに`GET /places/:id`(`show`アクション)を追加(REST資源として自然な追加であり、他ユーザーのPlaceは既存の共通`rescue_from`により404)。`placesApi.ts`に`fetchPlace`・`createPlace`・`updatePlace`を追加し、登録・更新成功後は対象都道府県の一覧(`/places?prefecture=`)へ遷移するようにした。バリデーションエラーは既存の会員登録/ログイン画面と同じ`{errors: string[]}`を`<ul>`表示するパターンに統一。`PlacesPage`に「新規登録」「編集」への導線を追加。backend側は`show`アクションのrequest specを追加しRSpec全39件pass、frontend側はlint(oxlint)・build(tsc + vite build)ともに成功。ブラウザで新規登録(都道府県の初期値反映・登録成功時の一覧反映)、編集(既存データの初期表示・更新成功時の一覧反映)、バリデーションエラー表示(不正なURL形式で422・エラーメッセージ表示)を確認した |
| 2026-09-02 | タスク#9(Renderデプロイ設定)完了。DBはRender管理Postgresではなく外部のNeon Postgresを使用し、`DATABASE_URL`はRenderダッシュボードで手動設定(render.yamlには秘密値を記載しない)する構成とした。`backend/config/initializers/cors.rb`を変更し、開発用の`http://localhost:5173`に加えて`ENV["FRONTEND_ORIGIN"]`(未設定時は`.compact`で除外)を許可オリジンに追加できるようにした。リポジトリルートに`render.yaml`を作成し、Render Blueprintの`projects → environments → services`構成で、`imaiko`プロジェクトの`Production`環境にbackend(Docker Web Service、`rootDir: backend`、`healthCheckPath: /up`)とfrontend(Static Site、`rootDir: frontend`、SPA用に`routes`で`/*`→`/index.html`のrewriteを設定)の2サービスを定義。`RAILS_MASTER_KEY`・`DATABASE_URL`は`sync: false`とし、秘密値をリポジトリに含めずRender上で設定した。Thrusterの待受ポート仕様(`HTTP_PORT`既定80、`PORT`は内部でPumaの`TARGET_PORT`用に上書きされる)とRenderのポート自動検出仕様を確認し、`PORT`環境変数は明示設定しない構成とした。cors.rb変更後のRSpecでは、`docker compose exec`が`RAILS_ENV=development`を引き継ぐことでHost Authorizationによりリクエストスペック23件が403となる事象を確認。原因を切り分け、`RAILS_ENV=test`を明示して再実行し全39件passを確認したため、以降のRSpec実行時は`RAILS_ENV=test`を明示する運用とした。RenderでBlueprint Instanceを作成し、Neonに本番用PostgreSQLプロジェクトを作成してConnection stringを`DATABASE_URL`として設定、`RAILS_MASTER_KEY`も設定した上でデプロイを実施。`imaiko-backend`・`imaiko-frontend`の両サービスが正常にDeployedとなることを確認し、本番frontendへアクセスして新規ユーザー登録・ログイン・主要機能・ログアウトまで一通り動作確認を行い、問題なく利用できることを確認。以上をもってタスク#9を完了とする。 |
| 2026-09-04 | タスク#10(Tailwind CSS導入)完了。Tailwind CSS v4系を採用し、PostCSS設定やtailwind.config.jsを追加せずViteプラグイン方式で導入。`frontend/package.json`のdevDependenciesに`tailwindcss`・`@tailwindcss/vite`を追加、`vite.config.ts`に`@tailwindcss/vite`プラグインを登録、`src/index.css`の先頭に`@import "tailwindcss";`を追加し既存のカスタムスタイル(`color-scheme`・`font-family`・`body { margin: 0 }`)は`@layer base`でラップした。`npm install`実行時、Tailwindとは無関係な既存の間接依存(vite→postcss→nanoid)に起因するnpm audit高深刻度の脆弱性1件を検出したが、`npm audit fix`では解消せず(解消にはviteのメジャーアップグレードが必要)、Tailwind導入の範囲外の既存課題のため今回は対応せず据え置いた。lint(oxlint)・build(tsc + vite build)ともに成功、ビルド後のCSSにTailwindのユーティリティが含まれていることを確認。ログイン画面の見出しに一時的にTailwindユーティリティクラス(`text-3xl font-bold text-red-500 underline`)を付与しdocker compose環境のブラウザで反映を確認した後、確認用コードは元に戻した。 |
| 2026-09-04 | タスク#10導入時にnpm auditで検出されたnanoidの脆弱性(GHSA-2v37-7h3g-55p8 / CVE-2026-67213、`vite→postcss→nanoid`の間接依存、影響バージョン`<3.3.18`)へ対応。Vite本体のメジャーアップグレードは行わず、`frontend/package.json`にnpmの`overrides`(`"nanoid": "^3.3.18"`)を追加し非破壊的に修正版へ固定。`npm install`実行後、`npm ls nanoid`で`nanoid@3.3.18 overridden`を確認、`npm audit`は0件(found 0 vulnerabilities)。lint(oxlint)・build(tsc + vite build)ともに成功し、ビルド出力(バンドルサイズ)は変更前と同一であることを確認した。 |
| 2026-09-06 | タスク#11(共通UIコンポーネントの実装)完了。#12でのオリジナルUI設計・実装に備え、独自デザインは作り込まずButton・Input・Cardの3つを再利用可能な基盤として`frontend/src/components/ui/`配下に新規実装した。Button(`variant?: 'primary' | 'danger'`、ネイティブ`<button>`属性を継承)、Input(`id`・`label`必須でlabel+input構造を1コンポーネント化、ネイティブ`<input>`属性を継承)、Card(枠のみの汎用コンテナ、ネイティブ`<div>`属性を継承)。`<select>`(都道府県)・`<textarea>`(メモ)は今回のスコープ外とし対応を見送った。既存画面をButton/Inputへ置き換え(LoginPage・RegisterPageの入力/送信、PrefectureListPageのログアウト、PlaceForm(登録・編集共通)の場所名/URL入力/送信、PlacesPageの削除ボタン(`variant="danger"`))、Cardは初回適用範囲をPlacesPageの場所一覧の各項目のみとした。lint(oxlint)・build(tsc + vite build)ともに成功。docker compose環境でブラウザ実動作確認を実施し、RegisterPage→PrefectureListPage→PlacesPage(0件)→PlaceNewPage(登録)→PlacesPage(1件、Card表示・danger Button表示)→PlaceEditPage(既存データ初期表示)→ログアウト→LoginPage(再ログイン)までの一連のフローで新UI部品の表示・動作に問題がないことを確認した(削除ボタンのクリックは`window.confirm`のネイティブダイアログ操作を避けるため見送り、表示のみ確認)。確認用に作成したテストデータ(場所1件)はAPI経由で削除済み。 |
| 2026-09-17 | タスク#12(オリジナルUIの設計・実装)完了。`docs/imaiko-ui.png`は見た目の参考資料、本ファイルの「4. 本リリースには含めない機能」「5. 将来的に検討する機能」を機能仕様の正として扱い、日本地図UI・スプラッシュ画面・設定画面等の新規画面は今回に含めず、既存4画面(ログイン・会員登録・都道府県選択・場所一覧・場所登録編集)への共通デザイン適用に留めた。`frontend/src/index.css`にTailwind v4の`@theme`でブランドカラー(プライマリグリーン`#2f6b4f`、生成り背景`#f7f3e8`等)とフォントをトークン化。タスク#11で実装したButton・Input・Cardの配色・角丸をブランドトークンベースに刷新(Buttonは`size`(`md`/`sm`)を追加)し、Select・Textarea・Logo・PageHeader・PageContainer・FormErrorsを`frontend/src/components/ui/`配下に新規追加して共通基盤を拡張。LoginPage・RegisterPage・PrefectureListPage・PlacesPage・PlaceNewPage・PlaceEditPage・PlaceForm(登録・編集共通)にこれらを適用し、既存の機能・ルーティング・API通信・バリデーション挙動は変更していない。PrefectureListPageは将来の日本地図UI移行を踏まえ、リスト形式のまま最小限の適用に留めた。lint(oxlint)・build(tsc + vite build)ともに成功。docker compose環境でブラウザ実動作確認を実施し、会員登録(重複メールでのバリデーションエラー表示確認)→自動ログイン→都道府県選択(東京都)→場所一覧(0件表示)→新規登録(Select/Textareaの動作、都道府県初期値の引き継ぎ)→一覧反映(Card表示)→編集画面(既存データ初期表示)→ログアウト→未ログイン時のログイン画面リダイレクトまでの一連のフローで問題がないことを確認した(削除操作はタスク#7・#11同様の理由でクリックによる確認は見送り、削除ボタンの表示のみ確認。確認用テストデータはbackendコンテナ内の`rails runner`で削除済み)。ブランドカラーは参考画像を目視した暫定値、Logoはロゴ画像アセット未提供のためテキスト表現。development-plan.mdの章番号(4・5)の重複、および本タスクの完了条件と「3. 本リリースに向けた開発」の記述との不整合は今回は変更せず据え置いた。 |
| 2026-09-21 | タスク順序の見直し(実装着手なし)。旧タスク#13(レスポンシブ対応)は、今後予定している日本地図UI・スプラッシュ画面・Googleログイン・プロフィール・アカウント削除等の画面/UI関連実装より先に着手すると、それらのUI変更後に再度レスポンシブ調整が必要になり二度手間になる懸念があったため、主要画面/UIの実装が一通り揃った後に行う位置へ移動した。新しいタスク順序は#13日本地図UI→#14スプラッシュ画面→#15Googleログイン→#16プロフィール機能→#17アカウント削除機能→#18レスポンシブ対応→#19Google Analytics導入→#20本番環境への反映→#21最終動作確認とし、依存関係も本移動に合わせて更新した(#13〜15は#12に依存、#16は#15に依存、#17は#16に依存、#18は#13〜17に依存、#19は#18に依存、#20・#21は従来どおり)。完了済みのタスク#1〜#12の内容・番号・進捗(8節)は変更していない。 |
| 2026-09-21 | タスク#13(日本地図UIの実装)着手前の調査を実施(依存パッケージのインストール・実装・コミットは未実施)。参考画像(`docs/imaiko-ui.png`)のホーム画面が地方ごとに色分けされた地理的に正確な都道府県形状の地図であり、日本地図が本リリースにおける都道府県選択の主要UIとなること、47都道府県分のSVGパスを自作するコストは避けたいことを踏まえ、Reactで使える日本地図ライブラリ/データを比較調査した。候補は次の4つ: (1) `react-svg-map` + `@svg-maps/japan`、(2) `@react-map/japan`、(3) `react-simple-maps` + 外部GeoJSON/TopoJSON、(4) 依存追加なしの自作デフォルメ(簡略化ブロック)地図。実際に`@svg-maps/japan`のSVG(47都道府県のpath、id はローマ字表記、ライセンスCC BY 4.0、データ出典はMapSVG)をブラウザでレンダリングして地理的な再現性を確認し、参考画像に近い認識可能な日本地図になることを確認した。`@react-map/japan`は`cityColors`による地方色分けを標準サポートするが、データ内に文字化けバグ(`"Hokkaido"`が破損した文字列になっている)を確認し、npm上の最終公開が約2年前で個人開発の小規模パッケージであることから、本リリース向けの採用は見送ることとした。`react-simple-maps`は成熟したライブラリだが、信頼できるJapan用地図データを別途選定・検証するコストが最も高いと判断した。自作デフォルメ地図は追加依存が不要な一方、参考画像ほどの地理的精度は得られない。<br>**決定事項**: (1)日本地図UIには`react-svg-map` + `@svg-maps/japan`を採用する、(2)`@svg-maps/japan`のローマ字id(例: `aichi`)と既存の`frontend/src/constants/prefectures.ts`の`PREFECTURES`(日本語表記)との対応付けは保守しやすいマッピングテーブルとして実装する、(3)都道府県をクリックすると該当都道府県の場所一覧(`/places?prefecture=...`)へ遷移する、(4)地方ごとに色分けする(`react-svg-map`の`locationClassName`を関数指定して実現予定)、(5)既存の都道府県一覧・場所一覧への遷移や既存機能を壊さない、(6)`@svg-maps/japan`はCC BY 4.0ライセンスのためアプリ内にクレジット表記を実装する、(7)依存パッケージのインストール前には実行コマンドを提示しユーザーの確認を取ってから実行する。現時点では依存パッケージのインストール・実装・コミット・push・PR作成は行っていない。詳細な引き継ぎ事項(次回確認すべきファイル、着手順、未コミットのGit状態)はClaude Codeのメモリ(project_japan_map_ui)にも記録済み。 |
| 2026-09-22 | タスク#13(日本地図UIの実装)で、前回決定した`react-svg-map` + `@svg-maps/japan`のうち`react-svg-map`の採用を取りやめ、`@svg-maps/japan`単体 + 自前Reactコンポーネント(`<svg>`/`<path>`を直接描画)に方針変更した。着手時に`docker compose exec frontend npm install react-svg-map @svg-maps/japan`を実行したところ、`react-svg-map@2.2.0`(2022年5月最終更新)の`peerDependencies`が`react: "^16.0.0"`のみを要求しており、本プロジェクトの`react@19.3.0`と競合しERESOLVEエラーで失敗することを確認した。`--legacy-peer-deps`での強制インストールも選択肢としたが、採用前に`react-svg-map`のソース(`src/svg-map.jsx`)と`@svg-maps/japan`(`index.js`/`index.d.ts`)を直接調査した結果、(1)`react-svg-map`は`map.locations`配列を`<path>`へmapするだけの50行弱の薄いラッパーであり自前実装で容易に代替可能、(2)`@svg-maps/japan`は`dependencies`/`peerDependencies`を持たない純粋なデータパッケージ(`{ label, viewBox, locations: [{ id, name, path }, ...] }`、47都道府県・ローマ字id・文字化けなし、2025-10-11更新)でReactバージョンに依存しない、(3)`@svg-maps/japan`の型定義(`index.d.ts`)をそのままTypeScriptで利用できる、ことを確認した。以上より、依存関係の競合を恒常的に抱える`--legacy-peer-deps`運用は避け、`@svg-maps/japan`のみを追加してクリック・地方ごとの色分け・レスポンシブ対応を自前コンポーネントで実装する方針とした。決定事項(2026-09-21付)のうち、地図ライブラリ選定を除く他の合意事項(idマッピングテーブル・遷移先・地方別色分け・クレジット表記・インストール前確認等)は変更していない。本行の時点では`@svg-maps/japan`のインストール・実装・コミットは未実施。 |
| 2026-09-22 | タスク#13(日本地図UIの実装)完了。`docker compose exec frontend npm install @svg-maps/japan`で`@svg-maps/japan`のみを追加(`react-svg-map`は不採用)。新規実装は次の通り: `frontend/src/constants/prefectureMap.ts`(`@svg-maps/japan`のローマ字id→`PREFECTURES`日本語表記の対応表、47件)、`frontend/src/constants/regions.ts`(都道府県→8地方区分(北海道/東北/関東/中部/近畿/中国/四国/九州・沖縄)の対応表と、地方ごとの塗りつぶしクラス定義)、`frontend/src/components/JapanMap.tsx`(`@svg-maps/japan`のデータを`<svg>`/`<path>`で直接描画する自前コンポーネント。クリックおよびキーボード操作(各`<path>`に`tabIndex=0`・`role="button"`・`aria-label`を付与し、Enter/Spaceキーでも選択可能、`focus-visible`時に視認可能なアウトラインを表示)の双方で都道府県選択に対応、地方ごとの色分けを適用、コンポーネント自体は選択された都道府県名を親に通知するのみで遷移処理は持たない設計とした)。`frontend/src/index.css`の`@theme`に地方区分ごとの配色トークン(`--color-region-*`、既存のブランドカラーと調和するパステル系8色、参考画像のホーム画面デザインを踏まえて選定)を追加。`frontend/src/pages/PrefectureListPage.tsx`の都道府県リスト表示を`JapanMap`に置き換え、選択時は既存の`createSearchParams`パターンを踏襲した`navigate`で`/places?prefecture=...`へ遷移するようにした(既存の`PlacesPage`側の実装は変更なし)。`@svg-maps/japan`の型定義が未公開パッケージ(`svg-maps__common`)を参照しており解決できない問題を確認し、実データ構造に基づく型を`JapanMap.tsx`内でローカルに定義して対応した(`tsconfig.app.json`の`skipLibCheck: true`により未解決の型参照自体はビルドを妨げないが、`Array.prototype.map`コールバック引数の暗黙anyを避けるため型を明示)。CC BY 4.0ライセンスに基づき、地図直下に著作者(Victor Cazanave)・リポジトリ(svg-maps)・ライセンス(CC BY 4.0)へのリンク付きクレジット表記を実装した(LICENSE.mdのSection 3(a)の要件を確認の上、作成者表示・ライセンス参照・素材へのリンクを満たす内容とした)。lint(oxlint)・build(tsc + vite build)ともに成功。docker compose環境でブラウザ実動作確認を実施し、テスト用アカウント(`japan-map-test@example.com`、確認後に`rails runner`で削除済み)でログイン後、地図上の地方ごとの色分け表示、マウスクリックによる都道府県選択→場所一覧(`/places?prefecture=...`)への遷移(茨城県で確認)、キーボード操作(Tabでの`<path>`へのフォーカス移動→Enterキーでの選択)による同様の遷移(青森県で確認)、クレジット表記の表示を確認した。バックエンドは変更していないが、念のためRSpec全39件のpassも確認した。 |
