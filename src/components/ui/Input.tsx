import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Define as variantes do input
const inputVariants = cva(
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-gray-300 text-gray-900 placeholder:text-gray-400",
        outline: "border-gray-400 focus:border-blue-500",
        filled: "bg-gray-100 text-gray-900 placeholder:text-gray-400",
      },
      size: {
        default: "h-9",
        sm: "h-8 rounded-md px-2 text-xs",
        lg: "h-10 rounded-md px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Define a interface para as propriedades do Input
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  asChild?: boolean;
}

// Componente Input
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "input";
    return (
      <Comp
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };