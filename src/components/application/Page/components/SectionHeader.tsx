import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  variant?: "primary" | "centered" | "left" | "gradient";
  withDecoration?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  className = "",
  variant = "primary",
  withDecoration = true,
}) => {
  // Define variant styles
  const styles = {
    primary: {
      container: "mb-10",
      title: "text-3xl md:text-4xl font-bold text-primary relative z-10",
      subtitle: "text-muted-foreground text-lg mt-3 max-w-2xl",
    },
    centered: {
      container: "text-center mb-12",
      title: "text-3xl md:text-4xl font-bold text-gray-900 relative z-10",
      subtitle: "text-muted-foreground text-lg mt-3 mx-auto max-w-2xl",
    },
    left: {
      container: "mb-8",
      title: "text-3xl md:text-4xl font-bold text-gray-900 relative z-10",
      subtitle: "text-muted-foreground text-lg mt-2 max-w-2xl",
    },
    gradient: {
      container: "mb-10",
      title:
        "text-3xl md:text-4xl font-bold relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600",
      subtitle: "text-muted-foreground text-lg mt-3 max-w-2xl",
    },
  };

  const selectedStyle = styles[variant];

  return (
    <div className={`relative ${selectedStyle.container} ${className}`}>
      {/* Decorative elements that can be toggled */}
      {withDecoration && (
        <>
          {variant === "primary" && (
            <>
              <div className="absolute top-0 left-0 w-16 h-16 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
            </>
          )}

          {variant === "centered" && (
            <>
              <div className="flex items-center justify-center mb-3">
                <div className="h-1 w-10 bg-primary rounded-full mr-2"></div>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
              </div>
            </>
          )}

          {variant === "gradient" && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-lg -z-10"></div>
          )}
        </>
      )}

      {/* Title with appropriate styles */}
      <h2 className={selectedStyle.title}>{title}</h2>

      {/* Optional underline for primary variant */}
      {variant === "primary" && withDecoration && (
        <div className="w-24 h-1 bg-primary mt-4 rounded-full"></div>
      )}

      {/* Optional subtitle */}
      {subtitle && <p className={selectedStyle.subtitle}>{subtitle}</p>}

      {/* Centered variant decoration below title */}
      {variant === "centered" && withDecoration && (
        <div className="flex items-center justify-center mt-6">
          <div className="h-0.5 bg-primary w-16"></div>
          <div className="w-3 h-3 bg-primary mx-2 rounded-full"></div>
          <div className="h-0.5 bg-primary w-16"></div>
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
