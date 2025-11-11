import React from "react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-screen-lg mx-auto px-8 py-16 space-y-10">
        <header className="flex items-center justify-between">
          <h1 className="tracking-[0.2em] text-2xl">利用規約</h1>
          <Link to="/" className="text-sm tracking-[0.15em] underline">
            トップへ戻る
          </Link>
        </header>

        <div className="space-y-6 text-sm tracking-[0.08em] leading-7 text-gray-200">
          <p>
            本イベントは、運営法人Fatigue.Inc.（以下、弊社）がすべての事務連絡を執り行います。
          </p>
          <p>
            イベントについてのご質問は、弊社に対してのみ、なさっていただけます。弊社以外の方への問合せをされても、その回答について、弊社は責任を負いません。
          </p>
          <p>
            また、このイベントをきっかけに何らかのトラブルが生じても弊社は一切の賠償責任を免責させていただきます。
          </p>
          <p>
            お申し込みいただいた方を精査し問題ないと確認できた場合、参加資格成立のご案内メールをお送りします。そのメールののち、当日の詳細な参加概要書類を、ご自宅宛て郵送します。
          </p>
          <p>
            参加資格を得られても、郵送物がイベント当日までに届かない場合は参加できません。その場合は、お電話でお問い合わせください。お問い合わせ電話番号　070-5087-9619
          </p>
          <p>
            1申込み単位あたり、1名の方が、参加できます。
          </p>
          <p>
            支払いは当日現金払いもしくはクレジットカード、各種QRコード決済をご利用いただけます。
          </p>
          <p>
            このサイトは、イベント終了もしくは、予約枠が埋まった時点で速やかに削除されます。
          </p>

          <div className="mt-10 space-y-2">
            <h2 className="text-base tracking-[0.15em]">会社法人情報</h2>
            <p>運営法人名：ファティーグ</p>
            <p>住所：東京都小金井市梶野町1-4-4</p>
            <p>連絡先：070-5087-9619</p>
          </div>
        </div>

        <footer className="pt-10 border-t border-white/20">
          <div className="flex items-center justify-between text-xs text-gray-400 tracking-[0.15em]">
            <span>© 2025 Fatigue.Inc.</span>
            <nav className="space-x-6">
              <Link to="/terms" className="underline">
                利用規約
              </Link>
              <Link to="/privacy" className="underline">
                個人情報保護方針
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}


