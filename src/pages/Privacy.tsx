import React from "react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-screen-lg mx-auto px-8 py-16 space-y-10">
        <header className="flex items-center justify-between">
          <h1 className="tracking-[0.2em] text-2xl">個人情報保護方針</h1>
          <Link to="/" className="text-sm tracking-[0.15em] underline">
            トップへ戻る
          </Link>
        </header>

        <div className="space-y-6 text-sm tracking-[0.08em] leading-7 text-gray-200">
          <p>
            お申込者の個人情報は、本イベント運営法人である、fatigue,Inc.が、イベント参加のために必要な情報提供の目的で使用し、モデル、ほかの参加者、外部に漏洩することはありません。
          </p>
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


