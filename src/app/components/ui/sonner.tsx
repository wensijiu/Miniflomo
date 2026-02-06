"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-center"
      duration={1000}
      toastOptions={{
        classNames: {
          toast: 'bg-[#323232] text-white border-none shadow-lg',
          title: 'text-white text-sm',
          description: 'text-white/80',
          success: 'bg-[#323232] text-white',
          error: 'bg-[#323232] text-white',
          info: 'bg-[#323232] text-white',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };