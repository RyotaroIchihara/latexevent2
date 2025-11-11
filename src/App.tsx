import { useState, useEffect } from "react";
import { HeroSection } from "./components/HeroSection";
import { EventInfoSection } from "./components/EventInfoSection";
import { BookingFormSection } from "./components/BookingFormSection";
import { NotesSection } from "./components/NotesSection";
import { Footer } from "./components/Footer";
import { AdminView } from "./components/AdminView";

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    // URLパラメータで管理画面を表示（例：?admin=secret_key_2025）
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const adminKey = params.get("admin");
      
      // セキュリティ：秘密キーで管理画面にアクセス
      if (adminKey === "natsu_admin_2025") {
        setShowAdmin(true);
      }
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 簡易パスワード認証
    if (password === "natsu_admin_2025") {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPassword("");
    }
  };

  if (showAdmin) {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="max-w-md w-full px-8">
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="tracking-[0.2em] text-2xl">ADMIN ACCESS</h1>
                <p className="text-sm tracking-[0.15em] text-gray-400">
                  管理者パスワードを入力してください
                </p>
              </div>
              
              <div className="space-y-3">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border border-white rounded-none text-white px-4 py-3 tracking-[0.1em] focus:outline-none focus:border-gray-400"
                  placeholder="パスワード"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-red-400 text-sm tracking-[0.1em]">
                    パスワードが正しくありません
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black py-3 rounded-none tracking-[0.2em] uppercase hover:bg-gray-200 transition-colors"
              >
                ログイン
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAdmin(false);
                  window.history.replaceState({}, "", window.location.pathname);
                }}
                className="w-full bg-transparent border border-white text-white py-3 rounded-none tracking-[0.2em] uppercase hover:bg-white/10 transition-colors"
              >
                戻る
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        <button
          onClick={() => {
            setShowAdmin(false);
            setIsAuthenticated(false);
            setPassword("");
            window.history.replaceState({}, "", window.location.pathname);
          }}
          className="fixed top-8 right-8 z-50 bg-white text-black px-6 py-2 rounded-none tracking-[0.15em] text-sm uppercase hover:bg-gray-200 transition-colors"
        >
          ログアウト
        </button>
        <AdminView />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection />
      <EventInfoSection />
      <NotesSection />
      <BookingFormSection />
      <Footer />
    </div>
  );
}
