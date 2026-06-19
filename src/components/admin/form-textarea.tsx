interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export default function FormTextarea({ label, ...props }: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-black">{label}</label>

      <textarea
        {...props}
        className="min-h-[140px] w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c0152a] placeholder-shown:text-neutral-400 text-black"
      />
    </div>
  );
}
