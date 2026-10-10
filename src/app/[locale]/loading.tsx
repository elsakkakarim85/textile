export default function Loading() {
  return (
    <div className="container mx-auto py-10 px-4 space-y-8 animate-pulse">
      <div className="space-y-4">
        <div className="h-10 w-[250px] bg-slate-200 rounded"></div>
        <div className="h-4 w-[400px] bg-slate-200 rounded"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col space-y-3">
            <div className="h-[125px] w-full rounded-xl bg-slate-200"></div>
            <div className="space-y-2">
              <div className="h-4 w-[250px] bg-slate-200 rounded"></div>
              <div className="h-4 w-[200px] bg-slate-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
