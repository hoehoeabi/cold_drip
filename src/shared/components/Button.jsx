/**
 * [Button.jsx] - 다크모드 대응 버전
 */

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = "px-6 py-2.5 rounded-2xl font-bold transition-all duration-300 cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm hover:shadow-md"
  
  const variants = {
    // 인디고 그라데이션 (다크모드에서도 잘 어울림)
    primary: "bg-gradient-to-tr from-indigo-600 to-violet-500 text-white border-none hover:from-indigo-700 hover:to-violet-600 shadow-indigo-200 dark:shadow-indigo-900/20",
    
    // 로즈/레드 (다크모드에서 배경색 조정)
    delete: "bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white border border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50 dark:hover:bg-rose-600",
    
    // 슬레이트 (다크모드 대응)
    cancel: "bg-slate-100 text-slate-600 hover:bg-slate-200 border-none dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700",
    
    // 아웃라인 (다크모드 대응)
    outline: "bg-white/50 backdrop-blur-sm text-indigo-600 border-2 border-indigo-100 hover:border-indigo-600 hover:bg-indigo-50 dark:bg-slate-900/50 dark:text-indigo-400 dark:border-indigo-900/50 dark:hover:border-indigo-500",
    
    // 수정용 앰버 (다크모드 대응)
    edit: "bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white border border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50 dark:hover:bg-amber-600"
  }

  const variantStyle = variants[variant] || variants.primary

  return (
    <button 
      className={`${baseStyles} ${variantStyle} ${className}`} 
      {...props}
    >
      {children}
    </button>
  )
}
