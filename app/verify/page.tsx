import { Suspense } from "react"
import { getRegistrationByRegId } from "@/lib/storage"
import { CheckCircle, XCircle, User, Briefcase, MapPin } from "lucide-react"

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function VerifyPage(props: PageProps) {
  const searchParams = await props.searchParams
  const regId = typeof searchParams.id === "string" ? searchParams.id : undefined

  if (!regId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Request</h1>
          <p className="text-slate-500">No Registration ID provided in URL.</p>
        </div>
      </div>
    )
  }

  const reg = await getRegistrationByRegId(regId)

  if (!reg) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Not Found</h1>
          <p className="text-slate-500">The Registration ID <span className="font-mono font-bold text-slate-800">{regId}</span> is invalid or does not exist in our system.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border-t-8 border-[#c98a2f]">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Verified Attendee</h1>
          <p className="text-slate-500 text-sm">Valid registration for the 1st Poultry Conclave Gorakhpur.</p>
        </div>

        <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Attendee Name</p>
              <p className="text-slate-900 font-bold text-lg leading-tight uppercase">{reg.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Category</p>
              <p className="text-slate-900 font-bold uppercase">{reg.occupation}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Registration ID</p>
              <p className="text-slate-900 font-mono font-bold text-lg">{reg.regId}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-400">
          Scanned on {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  )
}
