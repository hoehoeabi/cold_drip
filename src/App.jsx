import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { AuthorProfilePage } from "./pages/AuthorProfilePage";
import { FeedPage } from "./pages/FeedPage";
import { LoginPage } from "./pages/LoginPage";
import { MyPage } from "./pages/MyPage";
import { UploadPage } from "./pages/UploadPage";
import { Button } from "./shared/components/Button";
import { useAuth } from "./shared/contexts/AuthContext";
import { useMessage } from "./shared/contexts/MessageContext";
import { useTheme } from "./shared/contexts/ThemeContext";

/**
 * [App.jsx]
 */

function App() {
  const { user, signOut, loading } = useAuth();
  const { message } = useMessage();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-500">
        <div className="animate-bounce text-indigo-600 dark:text-indigo-400 font-black text-4xl italic tracking-tighter">
          콜드드립 내리는 중... ☕️
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-500">
      <main className="max-w-[1024px] mx-auto p-6 pb-20">
        <header className="flex justify-between items-center py-6 mb-8">
          <Link to="/" className="group no-underline">
            <div className="flex flex-col">
              <h1 className="text-4xl font-black tracking-tighter group-hover:scale-105 transition-transform duration-300 flex items-center gap-1">
                <span className="text-slate-900 dark:text-white">🧊</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                  콜드드립
                </span>
                <span className="text-slate-900 dark:text-white">☕️</span>
              </h1>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase ml-0.5 italic">
                Cold Drip • Keep Calm
              </span>
            </div>
          </Link>

          <div className="flex gap-3 items-center">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 mr-2"
              title={isDark ? "라이트모드로 전환" : "다크모드로 전환"}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            {user ? (
              <>
                <Button
                  onClick={() => navigate("/upload")}
                  className="shadow-indigo-200 dark:shadow-none"
                >
                  드립 붓기
                </Button>
                <Button onClick={() => navigate("/mypage")} variant="outline">
                  내 카페
                </Button>
                <button
                  onClick={async () => {
                    await signOut();
                    navigate("/");
                  }}
                  className="text-xs font-bold text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors ml-2 uppercase tracking-tight"
                >
                  Leave
                </button>
              </>
            ) : (
              <Button onClick={() => navigate("/login")}>로그인</Button>
            )}
          </div>
        </header>

        {message && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
            <p className="m-0 text-sm font-bold flex items-center gap-2">
              <span className="text-indigo-400 dark:text-white text-lg">
                ☕️
              </span>{" "}
              {message}
            </p>
          </div>
        )}

        <div className="animate-in fade-in slide-in-from-top-2 duration-700">
          <Routes>
            <Route path="/" element={<FeedPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/profile/:userId" element={<AuthorProfilePage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
