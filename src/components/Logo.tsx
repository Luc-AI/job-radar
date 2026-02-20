import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  linkTo?: string;
  variant?: "dark" | "light";
}

export function Logo({ size = "md", linkTo = "/", variant = "dark" }: LogoProps) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const textColor = variant === "dark" ? "text-foreground" : "text-background";

  const content = (
    <span className={`font-semibold tracking-tight ${textColor} ${sizes[size]}`}>
      Jobfishing
    </span>
  );

  if (linkTo) {
    return (
      <Link href={linkTo} className="hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
