import { ReactNode } from "react";

interface AnimatedButtonProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  text: string;
  icon: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  fullWidth?: boolean;
}

export default function AnimatedButton({
  onClick,
  type = "button",
  text,
  icon,
  variant = "primary",
  className = "",
  fullWidth = false,
}: AnimatedButtonProps) {
  const baseStyles =
    "overflow-hidden rounded-md py-2 px-4 font-medium transition-colors";
  
  const variantStyles = {
    primary: "bg-blue-400 hover:bg-blue-500 text-white",
    secondary: "bg-white hover:bg-blue-400 text-black",
  };

  const widthStyles = fullWidth ? "w-full" : "w-fit";

  return (
    <div className={`relative group inline-block ${fullWidth ? "w-full" : ""} my-2`}>
      <button
        type={type}
        onClick={onClick}
        className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
      >
        <div className="relative h-6">
          {/* Text slides out to the right on hover */}
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:translate-x-full tracking-tight">
            {text}
          </span>

          {/* Icon slides in from the left on hover */}
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-500 -translate-x-full group-hover:translate-x-0">
            {icon}
          </span>
        </div>
      </button>
    </div>
  );
}
