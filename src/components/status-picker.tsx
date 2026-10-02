import { Button } from "@/components/ui/button";
import type { AttendanceStatus } from "@/lib/store";

const OPTIONS: { id: AttendanceStatus; label: string; variant: "present" | "excused" | "unexcused" }[] =
  [
    { id: "present", label: "İştirak etdi", variant: "present" },
    { id: "excused", label: "Üzürlü", variant: "excused" },
    { id: "unexcused", label: "Üzürsüz", variant: "unexcused" },
  ];

type StatusPickerProps = {
  value: AttendanceStatus | null;
  disabled?: boolean;
  onChange: (next: AttendanceStatus | null) => void;
};

export function StatusPicker({ value, disabled, onChange }: StatusPickerProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      {OPTIONS.map((opt) => (
        <Button
          key={opt.id}
          type="button"
          variant={opt.variant}
          size="md"
          disabled={disabled}
          data-active={value === opt.id}
          aria-pressed={value === opt.id}
          className="flex-1"
          onClick={() => onChange(value === opt.id ? null : opt.id)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
