import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,border-color,color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-fg text-bg hover:opacity-90",
        secondary:
          "bg-elevated text-fg border border-border hover:border-accent/40",
        ghost:
          "bg-transparent text-muted hover:text-fg hover:bg-elevated",
        present:
          "bg-present/15 text-present border border-present/30 data-[active=true]:bg-present data-[active=true]:text-bg",
        excused:
          "bg-excused/15 text-excused border border-excused/30 data-[active=true]:bg-excused data-[active=true]:text-bg",
        unexcused:
          "bg-absent/15 text-absent border border-absent/30 data-[active=true]:bg-absent data-[active=true]:text-bg",
        danger:
          "bg-absent/15 text-absent border border-absent/30 hover:bg-absent/25",
      },
      size: {
        sm: "h-9 rounded-sm px-3 text-sm",
        md: "h-11 rounded-md px-4 text-sm",
        lg: "h-12 rounded-md px-5 text-base",
        icon: "size-11 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
