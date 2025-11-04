import { LinkIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type LinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export const Link = ({ href, children, className = "" }: LinkProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "inline-flex items-center gap-1 underline transition-colors text-foreground hover:text-foreground/80 dark:text-neutralHighlight dark:hover:text-neutralHighlight/80",
        className,
      )}
    >
      {children}
      <LinkIcon size={12} weight="light" />
    </a>
  );
};
