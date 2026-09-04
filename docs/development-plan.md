# イマイコ(仮) 開発計画

## 1. MVP概要

SNSやWebで見つけた「いつか行きたい場所」を都道府県ごとに保存し、遠征・旅行・出張などで生まれた空き時間にすぐ見返せる場所ストックアプリ。

MVPでは以下のコア体験のみに機能を絞る。

> いつか行きたい場所を都道府県ごとに保存し、空き時間にすぐ見返せる

保持項目は「場所名、都道府県、参照URL、メモ(任意)」とする。

## 2. MVPに含む機能

- ユーザー登録・ログイン・ログアウト
- 場所の登録
- 場所の一覧表示(都道府県ごと)
- 場所の編集
- 場所の削除
- 都道府県選択画面(一覧形式)

## 3. MVPに含まない機能

- 検索機能
- カテゴリ管理・絞り込み
- ステータス管理(行きたい/行った)
- SNS投稿の自動取り込み(OGP自動取得等)
- 写真アップロード
- 他ユーザーとの共有・フォロー等のSNS的機能
- プッシュ通知・リマインダー
- 日本地図UI(都道府県選択の追加機能として将来検討)
- 多言語対応
- モバイルアプリ化/PWA

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
| 13 | `feature/responsive_design` | PC・スマートフォンなど異なる画面サイズでも快適に利用できるようにする | 主要画面をレスポンシブ対応し、PC・スマートフォンの双方でレイアウト崩れや操作困難な箇所がないことを確認する | 12 |
| 14 | `feature/google_analytics` | 公開後の利用状況を把握できるようにGoogle Analyticsを導入する | Google Analyticsを本番環境に導入し、主要ページのPVやユーザー数等を計測できることを確認する | 13 |
| 15 | `feature/google_login` | Googleアカウントを利用して簡単にログインできるようにする | Googleログインを実装し、新規ユーザー・既存ユーザーともにGoogle認証後にログインでき、既存のメールアドレス・パスワード認証と併用できることを確認する | 13 |
| 16 | `feature/account_settings` | ユーザーが自身のプロフィールやアカウントを管理できるようにする | ユーザー名の登録・変更、Googleログインで取得したプロフィール画像のアカウントアイコン表示、アカウント削除を実装し、各操作がログイン中のユーザー自身のアカウントにのみ反映されることを確認する | 15 |
| 17 | `chore/deploy_enhancements` | UI改善・認証・アカウント機能等の追加実装を本番環境へ反映する | #10〜16の変更がRender本番環境へ正常にデプロイされ、本番環境でフロントエンド・Rails API・Neon・Google関連機能が正常に連携することを確認する | 10〜16 |
| 18 | `test/final_check` | アプリ全体の完成条件を満たしているか最終確認し、公開版としての品質を確認する | RSpec・Lint・ビルド等の既存テストを実行し、本番環境で会員登録・ログイン・Googleログイン・場所CRUD・都道府県別一覧・アカウント設定・ログアウト等の主要操作を一通り確認し、PC・スマートフォン双方で重大な問題がない | 17 |

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
| 11 | 共通UIコンポーネントの実装 | 未着手 |
| 12 | オリジナルUIの設計・実装 | 未着手 |
| 13 | レスポンシブ対応 | 未着手 |
| 14 | Google Analytics導入 | 未着手 |
| 15 | Googleログイン機能の追加 | 未着手 |
| 16 | アカウント設定機能の追加 | 未着手 |
| 17 | 本番環境への反映 | 未着手 |
| 18 | 最終動作確認 | 未着手 |

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
