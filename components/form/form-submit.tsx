"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormSubmitButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "primary";
}

export const FormSubmitButton = ({
  children,
  disabled,
  className,
  variant = "primary",
}: FormSubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending || disabled}
      variant={variant}
      className={cn(className)}
    >
      {children}
    </Button>
  );
};
