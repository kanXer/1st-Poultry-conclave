"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/AuthProvider"
import {
  X,
  KeyRound,
  UserCog,
  Loader,
  UserPlus,
  Pencil,
  Trash2,
  ShieldCheck,
  Check,
  AlertTriangle,
} from "lucide-react"

export default function AdminUserSettings({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth()
  const isSuper = !!user?.isSuperAdmin

  const [tab, setTab] = useState<"password" | "admins">("password")

  // Change password
  const [cp, setCp] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [cpMsg, setCpMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [cpBusy, setCpBusy] = useState(false)

  // Admin list
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [listMsg, setListMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Add admin
  const [add, setAdd] = useState({ email: "", name: "", password: "" })
  const [addBusy, setAddBusy] = useState(false)

  // Edit admin
  const [editing, setEditing] = useState<any | null>(null)
  const [edit, setEdit] = useState({ name: "", password: "" })
  const [editBusy, setEditBusy] = useState(false)

  // Delete confirm
  const [deleting, setDeleting] = useState<any | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  const loadAdmins = async () => {
    setLoading(true)
    setListMsg(null)
    try {
      const res = await fetch("/api/admin/users")
      const data = await res.json()
      if (!res.ok) {
        setListMsg({ type: "error", text: data.error || "Could not load admin users" })
        setAdmins([])
      } else {
        setAdmins(data.users || [])
      }
    } catch {
      setListMsg({ type: "error", text: "Could not load admin users" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && isSuper && tab === "admins") loadAdmins()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isSuper, tab])

  useEffect(() => {
    if (open) {
      setTab("password")
      setCp({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setCpMsg(null)
      setListMsg(null)
      setEditing(null)
      setDeleting(null)
    }
  }, [open])

  if (!open) return null

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setCpMsg(null)
    if (cp.newPassword !== cp.confirmPassword) {
      setCpMsg({ type: "error", text: "New password and confirm password do not match." })
      return
    }
    setCpBusy(true)
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: cp.currentPassword, newPassword: cp.newPassword }),
      })
      const data = await res.json()
      setCpMsg({ type: res.ok ? "success" : "error", text: data.error || data.message || (res.ok ? "Password updated." : "Something went wrong.") })
      if (res.ok) setCp({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch {
      setCpMsg({ type: "error", text: "Something went wrong." })
    } finally {
      setCpBusy(false)
    }
  }

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setListMsg(null)
    setAddBusy(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(add),
      })
      const data = await res.json()
      setListMsg({ type: res.ok ? "success" : "error", text: data.error || data.message })
      if (res.ok) {
        setAdd({ email: "", name: "", password: "" })
        loadAdmins()
      }
    } catch {
      setListMsg({ type: "error", text: "Something went wrong." })
    } finally {
      setAddBusy(false)
    }
  }

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setListMsg(null)
    setEditBusy(true)
    try {
      const body: any = { id: editing.id }
      if (edit.name.trim()) body.name = edit.name.trim()
      if (edit.password) body.password = edit.password
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      setListMsg({ type: res.ok ? "success" : "error", text: data.error || data.message })
      if (res.ok) {
        setEditing(null)
        setEdit({ name: "", password: "" })
        loadAdmins()
      }
    } catch {
      setListMsg({ type: "error", text: "Something went wrong." })
    } finally {
      setEditBusy(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    setDeleteBusy(true)
    setListMsg(null)
    try {
      const res = await fetch(`/api/admin/users?id=${deleting.id}`, { method: "DELETE" })
      const data = await res.json()
      setListMsg({ type: res.ok ? "success" : "error", text: data.error || data.message })
      if (res.ok) {
        setDeleting(null)
        loadAdmins()
      }
    } catch {
      setListMsg({ type: "error", text: "Something went wrong." })
    } finally {
      setDeleteBusy(false)
    }
  }

  const inputCls =
    "w-full px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-600/60 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"

  const labelCls = "block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5"

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-white dark:bg-navy-900 rounded-t-3xl sm:rounded-3xl shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-brand-700 to-accent-700 px-5 py-4 rounded-t-3xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white">
            {isSuper ? <ShieldCheck size={20} /> : <UserCog size={20} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-bold text-sm truncate">{user?.name}</p>
            <p className="text-brand-100/80 text-xs truncate">{user?.email}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 pt-4">
          <div className="flex gap-1.5 bg-slate-100 dark:bg-navy-800 p-1 rounded-2xl">
            <button
              onClick={() => setTab("password")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                tab === "password"
                  ? "bg-white dark:bg-navy-700 text-brand-700 dark:text-brand-300 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}>
              <KeyRound size={14} /> Change Password
            </button>
            {isSuper && (
              <button
                onClick={() => { setTab("admins"); loadAdmins() }}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  tab === "admins"
                    ? "bg-white dark:bg-navy-700 text-brand-700 dark:text-brand-300 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}>
                <UserCog size={14} /> Manage Admins
              </button>
            )}
          </div>
        </div>

        <div className="p-5">
          {tab === "password" && (
            <form onSubmit={submitPassword} className="space-y-3">
              <div>
                <label className={labelCls}>Current Password</label>
                <input type="password" required value={cp.currentPassword} onChange={e => setCp({ ...cp, currentPassword: e.target.value })} className={inputCls} placeholder="••••••••" />
              </div>
              <div>
                <label className={labelCls}>New Password</label>
                <input type="password" required value={cp.newPassword} onChange={e => setCp({ ...cp, newPassword: e.target.value })} className={inputCls} placeholder="Min 6 characters" />
              </div>
              <div>
                <label className={labelCls}>Confirm New Password</label>
                <input type="password" required value={cp.confirmPassword} onChange={e => setCp({ ...cp, confirmPassword: e.target.value })} className={inputCls} placeholder="Retype new password" />
              </div>

              {cpMsg && (
                <p className={`text-xs font-medium flex items-center gap-1.5 ${cpMsg.type === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  {cpMsg.type === "success" ? <Check size={14} /> : <AlertTriangle size={14} />}
                  {cpMsg.text}
                </p>
              )}

              <button type="submit" disabled={cpBusy}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-900/20">
                {cpBusy ? <Loader size={16} className="animate-spin" /> : <KeyRound size={16} />}
                Save New Password
              </button>
            </form>
          )}

          {tab === "admins" && isSuper && (
            <div className="space-y-5">
              {/* Add admin */}
              <form onSubmit={submitAdd} className="space-y-3 bg-slate-50 dark:bg-navy-800/60 border border-slate-100 dark:border-navy-700/60 rounded-2xl p-4">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <UserPlus size={14} className="text-brand-600" /> Add New Admin
                </p>
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" required value={add.email} onChange={e => setAdd({ ...add, email: e.target.value })} className={inputCls} placeholder="admin@example.com" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Name</label>
                    <input type="text" value={add.name} onChange={e => setAdd({ ...add, name: e.target.value })} className={inputCls} placeholder="Full name" />
                  </div>
                  <div>
                    <label className={labelCls}>Password</label>
                    <input type="password" required value={add.password} onChange={e => setAdd({ ...add, password: e.target.value })} className={inputCls} placeholder="Min 6 characters" />
                  </div>
                </div>
                <button type="submit" disabled={addBusy}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all">
                  {addBusy ? <Loader size={15} className="animate-spin" /> : <UserPlus size={15} />}
                  Add Admin
                </button>
              </form>

              {listMsg && (
                <p className={`text-xs font-medium flex items-center gap-1.5 ${listMsg.type === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  {listMsg.type === "success" ? <Check size={14} /> : <AlertTriangle size={14} />}
                  {listMsg.text}
                </p>
              )}

              {/* Admin list */}
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2.5">All Admins</p>
                {loading ? (
                  <div className="flex justify-center py-6"><Loader size={20} className="animate-spin text-brand-600" /></div>
                ) : admins.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-navy-800/60 rounded-xl px-4 py-5 text-center">No admin users yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {admins.map(a => (
                      <li key={a.id} className="flex items-center gap-3 bg-slate-50 dark:bg-navy-800/60 border border-slate-100 dark:border-navy-700/60 rounded-xl px-3.5 py-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${a.isSuperAdmin ? "bg-gradient-to-br from-brand-500 to-accent-600" : "bg-slate-400"}`}>
                          {(a.name || a.email[0]).slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate flex items-center gap-1.5">
                            {a.name}
                            {a.isSuperAdmin && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wide text-white bg-gradient-to-r from-brand-600 to-accent-600 px-1.5 py-0.5 rounded-full">
                                <ShieldCheck size={9} /> Owner
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{a.email}</p>
                        </div>
                        {!a.isSuperAdmin && a.id !== user?.id && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => { setEditing(a); setEdit({ name: a.name, password: "" }) }} title="Edit"
                              className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all">
                              <Pencil size={15} />
                            </button>
                            <button onClick={() => setDeleting(a)} title="Delete"
                              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        )}
                        {a.id === user?.id && !a.isSuperAdmin && (
                          <span className="text-[10px] text-slate-400 shrink-0">(you)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Edit modal */}
              {editing && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)} />
                  <form onSubmit={submitEdit} className="relative w-full max-w-sm bg-white dark:bg-navy-900 rounded-2xl shadow-2xl p-5 space-y-3 animate-fade-in">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Edit Admin</p>
                    <div>
                      <label className={labelCls}>Name</label>
                      <input type="text" value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>New Password <span className="text-slate-400 font-normal">(leave blank to keep)</span></label>
                      <input type="password" value={edit.password} onChange={e => setEdit({ ...edit, password: e.target.value })} className={inputCls} placeholder="Min 6 characters" />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button type="button" onClick={() => setEditing(null)}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 transition-all">
                        Cancel
                      </button>
                      <button type="submit" disabled={editBusy}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 disabled:opacity-60 transition-all">
                        {editBusy ? <Loader size={15} className="animate-spin" /> : <Check size={15} />}
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Delete confirm */}
              {deleting && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleting(null)} />
                  <div className="relative w-full max-w-sm bg-white dark:bg-navy-900 rounded-2xl shadow-2xl p-5 space-y-4 animate-fade-in">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-600">
                      <Trash2 size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">Remove this admin?</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="font-semibold">{deleting.email}</span> will no longer be able to login to the admin panel.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setDeleting(null)}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 transition-all">
                        Cancel
                      </button>
                      <button onClick={confirmDelete} disabled={deleteBusy}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-500 disabled:opacity-60 transition-all">
                        {deleteBusy ? <Loader size={15} className="animate-spin" /> : <Trash2 size={15} />}
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
