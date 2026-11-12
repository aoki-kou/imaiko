import type { ReactNode } from 'react'
import { Card } from '../components/ui/Card'
import { PageContainer } from '../components/ui/PageContainer'
import { PageHeader } from '../components/ui/PageHeader'

const CONTACT_EMAIL = 'indieapps.support@gmail.com'
const ESTABLISHED_ON = '2026年11月12日'

type SectionProps = {
  title: string
  children: ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="space-y-2">
      <h2 className="font-bold text-brand-text">{title}</h2>
      {children}
    </section>
  )
}

const linkClassName = 'text-brand-primary underline'

export function PrivacyPolicyPage() {
  return (
    <PageContainer>
      {/* 未ログイン時に"/"へ戻った場合は既存のガードによりログイン画面へリダイレクトされる */}
      <PageHeader backTo="/" backLabel="トップへ戻る" title="プライバシーポリシー" />
      <Card className="space-y-6 text-sm leading-relaxed text-brand-text">
        <p>
          イマイコ(以下「本サービス」)の運営者(以下「運営者」)は、本サービスにおける利用者の情報の取り扱いについて、以下のとおり定めます。
        </p>

        <Section title="1. 取得する情報">
          <ul className="list-disc space-y-1 pl-5">
            <li>会員登録時: メールアドレス、パスワード(パスワードは復元できない形式に変換して保存しており、運営者も元のパスワードを知ることはできません)</li>
            <li>利用者が登録する情報: 場所名、都道府県、参照URL、メモ</li>
            <li>アクセス時に自動的に記録される情報: サーバーのアクセスログ(IPアドレス、アクセス日時、アクセスしたURL等)</li>
            <li>Google アナリティクスにより取得される情報(「5. アクセス解析ツールについて」参照)</li>
          </ul>
        </Section>

        <Section title="2. 利用目的">
          <ul className="list-disc space-y-1 pl-5">
            <li>本サービスの提供(ログイン状態の管理、登録した場所の保存・表示等)</li>
            <li>不具合の調査、不正利用の防止およびセキュリティの確保</li>
            <li>利用状況の把握と本サービスの改善</li>
            <li>お問い合わせへの対応</li>
          </ul>
        </Section>

        <Section title="3. 登録した場所やメモの取り扱い">
          <p>
            利用者が登録した場所やメモは、登録した本人のみが閲覧・編集できます。他の利用者に公開されることはありません。
            運営者は、障害対応や不正利用への対応など本サービスの運営に必要な場合を除き、これらの内容を閲覧しません。
          </p>
          <p>
            登録された情報は、本サービスが利用する外部のクラウドサービス(Render、Neon)上に保存されます。これらのサーバーは日本国外に所在する場合があります。
          </p>
          <p>運営者は、法令に基づく場合を除き、利用者の同意なく個人情報を第三者に提供しません。</p>
        </Section>

        <Section title="4. ブラウザに保存する情報">
          <p>
            ログイン状態を保持するため、認証用のトークンを利用者のブラウザ(localStorage)に保存します。このトークンはログアウト時に削除されます。
            また、起動画面の表示状態を記録するため、ブラウザのsessionStorageを利用します。
          </p>
        </Section>

        <Section title="5. アクセス解析ツールについて">
          <p>
            本サービスでは、利用状況を把握するため、Google LLCが提供するアクセス解析ツール「Google アナリティクス」を利用しています。
            Google アナリティクスはCookieを使用し、本サービスの閲覧時に次の情報をGoogle LLCへ送信します。
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>閲覧したページのURL(都道府県名や場所の識別番号が含まれる場合があります)、閲覧日時、参照元</li>
            <li>端末・ブラウザの種類、画面サイズ、言語設定、おおよその地域(IPアドレスから推定)</li>
            <li>Cookieに保存される識別子</li>
          </ul>
          <p>
            メールアドレス、パスワード、登録した場所名やメモの内容はGoogle アナリティクスに送信しません。
            これらの情報は個人を特定するものではなく、利用状況の把握と本サービスの改善のためにのみ利用します。
          </p>
          <p>
            Googleによる情報の取り扱いについては、
            <a href="https://policies.google.com/technologies/partner-sites?hl=ja" target="_blank" rel="noreferrer" className={linkClassName}>
              Googleのサービスを使用するサイトやアプリから収集した情報のGoogleによる使用
            </a>
            および
            <a href="https://policies.google.com/privacy?hl=ja" target="_blank" rel="noreferrer" className={linkClassName}>
              Googleプライバシーポリシー
            </a>
            をご確認ください。
          </p>
          <p>
            Google アナリティクスによる情報の収集は、ブラウザの設定でCookieを無効にするか、
            <a href="https://tools.google.com/dlpage/gaoptout?hl=ja" target="_blank" rel="noreferrer" className={linkClassName}>
              Google アナリティクス オプトアウト アドオン
            </a>
            を利用することで停止できます。
          </p>
        </Section>

        <Section title="6. 情報の管理・削除">
          <p>
            運営者は、通信の暗号化(HTTPS)等により、取得した情報の漏えい・紛失の防止に努めます。
          </p>
          <p>
            登録した場所やメモは、本サービス上でいつでも編集・削除できます。
            現在、本サービス上でアカウントを削除する機能は提供していません。アカウントの削除を希望される場合は、下記のお問い合わせ先までご連絡ください。
            アカウントを削除すると、そのアカウントで登録した場所やメモもあわせて削除されます。
            なお、削除した情報は、サービス運営上のバックアップ等に一定期間残る場合があります。
          </p>
        </Section>

        <Section title="7. プライバシーポリシーの変更">
          <p>運営者は、必要に応じて本ポリシーを変更することがあります。変更後の内容は本ページに掲載した時点から効力を生じます。</p>
        </Section>

        <Section title="8. お問い合わせ">
          <p>本ポリシーおよび情報の取り扱いに関するお問い合わせは、以下までご連絡ください。</p>
          <p>
            <a href={`mailto:${CONTACT_EMAIL}`} className={linkClassName}>
              {CONTACT_EMAIL}
            </a>
          </p>
        </Section>

        <p className="text-right text-brand-muted">制定日: {ESTABLISHED_ON}</p>
      </Card>
    </PageContainer>
  )
}
