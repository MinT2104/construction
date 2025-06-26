import { ChevronLeft, ChevronRight, MoreHorizontal } from "@/lib/icons";
import * as React from "react";
import { cn } from "@/lib/utils";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

interface PaginationLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean;
}

const PaginationLink = ({
  className,
  isActive,
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors",
      isActive
        ? "bg-primary text-primary-foreground hover:bg-primary/90"
        : "hover:bg-accent hover:text-accent-foreground",
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<"a">) => (
  <a
    aria-label="Go to previous page"
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
      "gap-1 pl-2.5",
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Trước</span>
  </a>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }: React.ComponentProps<"a">) => (
  <a
    aria-label="Go to next page"
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
      "gap-1 pr-2.5",
      className
    )}
    {...props}
  >
    <span>Sau</span>
    <ChevronRight className="h-4 w-4" />
  </a>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
