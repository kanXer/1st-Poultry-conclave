"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { CheckCircle, XCircle, X } from "lucide-react"

interface Toast {
  id: number
  message: string
  type: "success" | "error"
}

interface ToastCtx {
  toast: (message: string, type?: "success" | "error") => void
}

const Ctx = createContext<ToastCtx>({ toast: () => {} })

export function useToast() {
  return useContext(Ctx)
}

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = nextId++
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const remove = (id: number) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <Ctx.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map(t => (
          <div key={t.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-sm text-sm font-medium animate-slide-up ${
              t.type === "success"
                ? "bg-emerald-600/95 border-emerald-500 text-white"
                : "bg-red-600/95 border-red-500 text-white"
            }`}>
            {t.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 shrink-0 mt-0.5" />}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => remove(t.id)} className="p-0.5 rounded hover:bg-white/20 transition-colors shrink-0"><X className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
