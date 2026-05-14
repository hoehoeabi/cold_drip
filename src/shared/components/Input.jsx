/**
 * [Input.jsx] - 다크모드 대응 버전
 */

export function Input({ label, error, ...props }) {
  return (
    <label className="grid gap-2 text-sm w-full">
      <span className="font-bold text-slate-600 dark:text-slate-400 ml-1">{label}</span>
      <input 
        className="bg-slate-50 dark:bg-slate-800 border-2 border-transparent dark:text-white rounded-2xl px-4 py-3 font-medium w-full box-border outline-none transition-all focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-600" 
        {...props} 
      />
      {error && <span className="text-rose-500 dark:text-rose-400 text-xs font-medium ml-1">{error}</span>}
    </label>
  )
}

export function Textarea({ label, ...props }) {
  return (
    <label className="grid gap-2 text-sm w-full">
      <span className="font-bold text-slate-600 dark:text-slate-400 ml-1">{label}</span>
      <textarea 
        className="bg-slate-50 dark:bg-slate-800 border-2 border-transparent dark:text-white rounded-2xl px-4 py-3 font-medium w-full box-border outline-none transition-all focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none" 
        {...props} 
      />
    </label>
  )
}
