interface Props {
  value: number | undefined;
  onChange: (v: number) => void;
  unit: string;
  min: number;
  max: number;
}

export function NumberInput({ value, onChange, unit, min, max }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="flex items-baseline gap-2">
        <input
          type="number"
          inputMode="numeric"
          value={value ?? ""}
          min={min}
          max={max}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isNaN(n)) onChange(n);
          }}
          placeholder="0"
          className="w-40 bg-transparent text-center text-6xl font-bold text-foreground glow-text outline-none placeholder:text-muted-foreground/30"
        />
        <span className="text-2xl font-medium text-muted-foreground">{unit}</span>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        {min} – {max} {unit}
      </p>
    </div>
  );
}
