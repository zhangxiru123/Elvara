export default function Dashboard({ user }) {
  const displayName = user?.nickName || user?.username || 'there'

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-6 py-7 md:flex">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#0A2540] text-sm font-semibold text-white">
            E
          </div>
          <span className="text-base font-semibold tracking-[-0.02em] text-[#0A2540]">Elvara</span>
        </div>

        <nav className="mt-10 space-y-2 text-sm">
          <div className="rounded-lg bg-slate-100 px-3 py-2.5 font-medium text-slate-900">Workspace</div>
          <div className="rounded-lg px-3 py-2.5 text-slate-500">Messages</div>
          <div className="rounded-lg px-3 py-2.5 text-slate-500">Contacts</div>
        </nav>

        <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">Signed in as</p>
          <p className="mt-1 truncate text-sm font-semibold text-slate-900">{displayName}</p>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-6">
          <span className="text-sm font-medium text-slate-500">Elvara workspace</span>
        </header>

        <div className="flex flex-1 items-center justify-center p-6">
          <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_16px_50px_rgba(10,37,64,0.06)]">
            <p className="text-sm font-medium text-blue-600">Welcome back, {displayName}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#0A2540]">
              Your workspace is ready.
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
              Elvara has prepared a clean entry point for your chats, contacts and AI collaboration tools.
            </p>
            <div className="mt-7 h-px w-full bg-slate-100" />
            <p className="mt-5 text-xs text-slate-400">Chat workspace coming next.</p>
          </section>
        </div>
      </main>
    </div>
  )
}