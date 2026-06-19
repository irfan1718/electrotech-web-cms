interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function FormInput({ label, ...props }: FormInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-black">{label}</label>

      <input
        {...props}
        className="h-12 w-full rounded-2xl border border-neutral-200 bg-white px-4 text-sm outline-none transition focus:border-[#c0152a] placeholder-shown:text-neutral-400 text-black"
      />
    </div>
  );
}
