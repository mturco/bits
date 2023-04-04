interface FormFieldProps {
  children: React.ReactNode;
  error?: string;
  hint?: string;
  inline?: boolean;
  label: string;
}

export function FormField({
  children,
  error,
  hint,
  inline = false,
  label,
}: FormFieldProps) {
  const flexClasses = inline ? "inline-flex items-start" : "flex";
  return (
    <label className={`${flexClasses} flex-col gap-1`}>
      <p className="font-medium">{label}</p>
      {children}
      {hint ? <p className="text-sm text-ayu-500">{hint}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </label>
  );
}
