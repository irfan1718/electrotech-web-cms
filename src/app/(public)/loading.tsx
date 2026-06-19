export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-neutral-200 border-t-[#C0152A]" />
        </div>
        <p className="text-[13px] font-medium text-neutral-400">Loading...</p>
      </div>
    </div>
  );
}
