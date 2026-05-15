import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { FeedPage } from "./pages/FeedPage";
import { LoginPage } from "./pages/LoginPage";
import { MyPage } from "./pages/MyPage";
import { UploadPage } from "./pages/UploadPage";
import { Button } from "./shared/components/Button";
import { useAuth } from "./shared/contexts/AuthContext";
import { useMessage } from "./shared/contexts/MessageContext";

/**
 * [App.jsx] - 리디자인 버전
 * 전체 배경색을 깔고, 헤더를 공중에 떠 있는 것처럼 스타일링했습니다.
 */

function App() {
  const { user, signOut, loading } = useAuth();
  const { message } = useMessage();
  const navigate = useNavigate();

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-bounce text-indigo-600 font-black text-4xl">
          학원 문 여는 중...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <main className="max-w-[1024px] mx-auto p-6 pb-20">
        <header className="flex justify-between items-center py-6 mb-8">
          <Link to="/" className="group no-underline">
            <div className="flex flex-col">
              <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 group-hover:scale-105 transition-transform duration-300">
                제목학원
              </h1>
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-0.5">
                Title Academy
              </span>
            </div>
          </Link>

          <div className="flex gap-3 items-center">
            {user ? (
              <>
                <Button
                  onClick={() => navigate("/upload")}
                  className="shadow-indigo-200 shadow-lg"
                >
                  글쓰기
                </Button>
                <Button onClick={() => navigate("/mypage")} variant="outline">
                  내 정보
                </Button>
                <button
                  onClick={() => {
                    signOut();
                    navigate("/");
                  }}
                  className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors ml-2 uppercase tracking-tight"
                >
                  Logout
                </button>
              </>
            ) : (
              <Button onClick={() => navigate("/login")}>로그인</Button>
            )}
          </div>
        </header>

        {/* 알림 메시지 디자인 업그레이드 */}
        {message && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
            <p className="m-0 text-sm font-bold flex items-center gap-2">
              <span className="text-indigo-400 text-lg">✦</span> {message}
            </p>
          </div>
        )}

        {/* 페이지 본문 영역 */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
          <Routes>
            <Route path="/" element={<FeedPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/mypage" element={<MyPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
