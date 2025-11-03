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
        "inline-flex items-center gap-1 text-secondary/80 underline text-neutralHighlight",
        className,
      )}
    >
      {children}
      <LinkIcon size={12} weight="light" />
    </a>
  );
};
