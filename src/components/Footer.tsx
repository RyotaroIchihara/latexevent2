import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t border-white/20">
      <div className="max-w-screen-xl mx-auto px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-xs tracking-[0.15em] text-gray-400">
          <div className="flex items-center gap-6">
            <Link to="/terms" className="underline hover:text-white transition-colors">
              利用規約
            </Link>
            <span className="text-gray-500">|</span>
            <Link to="/privacy" className="underline hover:text-white transition-colors">
              個人情報保護方針
            </Link>
          </div>
          <span>© 2025 Fatigue,Inc.</span>
        </div>
      </div>
    </footer>
  );
}

