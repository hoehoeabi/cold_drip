import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../shared/components/Button";
import { Input } from "../../shared/components/Input";
import { useMessage } from "../../shared/contexts/MessageContext";
import { supabase } from "../../shared/supabase/client";

/**
 * [AuthForm.jsx]
 */

export function AuthForm() {
  const { showMessage } = useMessage();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (authMode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      if (error) showMessage(error.message);
      else {
        showMessage("콜드드립 멤버십 가입 완료! 메일을 확인해 주세요.");
        navigate("/");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) showMessage(error.message);
      else {
        showMessage("반가워요! 카페에 입장하셨습니다.");
        navigate("/");
      }
    }
    setIsLoading(false);
  };

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 shadow-xl dark:shadow-2xl transition-colors duration-500">
      <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
        {authMode === "signup" ? "Welcome to Cold Drip ☕️" : "Coffee Time ☕️"}
      </h2>
      <form onSubmit={handleSubmit} className="grid gap-5">
        <Input
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="coffee@example.com"
        />
        <Input
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder="6자리 이상"
        />

        {authMode === "signup" && (
          <Input
            label="활동 닉네임"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="커피 한 잔 할까요?"
          />
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="mt-4 py-4 text-base"
        >
          {isLoading
            ? "준비 중..."
            : authMode === "signup"
              ? "콜드드립 멤버 되기"
              : "카페 입장하기"}
        </Button>
      </form>

      <button
        type="button"
        className="mt-6 w-full bg-transparent border-none text-slate-400 dark:text-slate-500 font-bold cursor-pointer p-0 text-xs hover:text-indigo-600 transition-colors uppercase tracking-widest"
        onClick={() =>
          setAuthMode((m) => (m === "signup" ? "signin" : "signup"))
        }
      >
        {authMode === "signup"
          ? "이미 멤버이신가요? 로그인"
          : "멤버십이 없으신가요? 회원가입"}
      </button>
    </section>
  );
}
