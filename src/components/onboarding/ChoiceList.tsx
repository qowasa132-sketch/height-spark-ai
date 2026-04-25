interface Option {
  value: string;
  label: string;
}

interface Props {
  value: string | undefined;
  onChange: (v: string) => void;
  options: Option[];
}

export function ChoiceList({ value, onChange, options }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`w-full rounded-2xl border-2 px-5 py-4 text-start text-base font-medium transition-smooth ${
              selected
                ? "border-primary bg-primary/10 text-foreground shadow-glow"
                : "border-border bg-card text-foreground hover:border-primary/50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
