"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type CollapsibleContextValue = {
  isOpen: boolean;
  toggle: () => void;
  contentRef: React.RefObject<HTMLDivElement | null>;
};

const CollapsibleContext = React.createContext<
  CollapsibleContextValue | undefined
>(undefined);

export interface CollapsibleProps {
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function Collapsible({
  defaultOpen = false,
  children,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const value = React.useMemo(
    () => ({
      isOpen,
      toggle,
      contentRef,
    }),
    [isOpen, toggle, contentRef]
  );

  return (
    <CollapsibleContext.Provider value={value}>
      {children}
    </CollapsibleContext.Provider>
  );
}

export interface CollapsibleTriggerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CollapsibleTrigger({
  children,
  className,
  ...props
}: CollapsibleTriggerProps) {
  const context = React.useContext(CollapsibleContext);

  if (!context) {
    throw new Error(
      "CollapsibleTrigger must be used within a Collapsible component"
    );
  }

  const handleClick = () => {
    context.toggle();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      context.toggle();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={context.isOpen}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn("w-full text-left cursor-pointer", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CollapsibleContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CollapsibleContent({
  children,
  className,
}: CollapsibleContentProps) {
  const context = React.useContext(CollapsibleContext);
  const [height, setHeight] = React.useState<string | number>("auto");

  if (!context) {
    throw new Error(
      "CollapsibleContent must be used within a Collapsible component"
    );
  }

  React.useEffect(() => {
    if (context.contentRef.current) {
      if (context.isOpen) {
        // Set to auto initially to calculate the actual height
        setHeight("auto");
        // Then set to the scrollHeight for the animation
        const scrollHeight = context.contentRef.current.scrollHeight;
        // Need a slight delay for the browser to register 'auto'
        requestAnimationFrame(() => {
          setHeight(scrollHeight);
        });
      } else {
        // Set to scrollHeight initially before animating to 0
        const scrollHeight = context.contentRef.current.scrollHeight;
        setHeight(scrollHeight);
        requestAnimationFrame(() => {
          setHeight(0);
        });
      }
    }
  }, [context.isOpen, context.contentRef]);

  // Set initial height based on defaultOpen state
  React.useEffect(() => {
    if (!context.isOpen) {
      setHeight(0);
    }
  }, []); // Run only once on mount

  return (
    <div
      ref={context.contentRef}
      style={{ height: height }}
      className={cn(
        "overflow-hidden transition-[height] duration-300 ease-in-out",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CollapsibleProvider({
  children,
  isOpen,
  onOpenChange,
}: {
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  const [open, setOpen] = React.useState(isOpen || false);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const toggle = React.useCallback(() => {
    const newOpenState = !open;
    setOpen(newOpenState);
    onOpenChange?.(newOpenState);
  }, [open, onOpenChange]);

  const value = {
    isOpen: open,
    toggle,
    contentRef,
  };

  return (
    <CollapsibleContext.Provider value={value}>
      {children}
    </CollapsibleContext.Provider>
  );
}
