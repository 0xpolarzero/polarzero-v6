import { ListIcon, XIcon } from "@phosphor-icons/react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV } from "@/data/nav";

interface NavigationIslandProps {
  mobileNavOpen: boolean;
  onMobileNavChange: (open: boolean) => void;
  onNavigate: () => void;
}

export const NavigationIsland = ({
  mobileNavOpen,
  onMobileNavChange,
  onNavigate,
}: NavigationIslandProps) => {
  return (
    <>
      <div className="fixed top-6 z-40 hidden items-center rounded-xs border border-white/12 bg-white/[0.05] backdrop-blur-md transition-all duration-300 ease-out md:flex left-1/2 -translate-x-1/2">
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="group relative whitespace-nowrap rounded-xs px-4 py-2 text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground transition-colors duration-150 hover:bg-white/[0.12] hover:text-neutralHighlight focus-visible:bg-white/[0.12] focus-visible:text-neutralHighlight"
          >
            <span className="after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-neutralHighlight after:transition-transform after:duration-150 group-hover:after:scale-x-100">
              {item.label}
            </span>
          </a>
        ))}
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={onMobileNavChange}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={mobileNavOpen}
            className="fixed right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-xs border border-white/10 bg-white/[0.08] text-muted-foreground backdrop-blur-sm transition hover:text-neutralHighlight md:hidden"
          >
            {mobileNavOpen ? (
              <XIcon size={18} weight="light" />
            ) : (
              <ListIcon size={18} weight="light" />
            )}
          </button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full max-w-xs border border-white/10 bg-white/[0.08] text-foreground backdrop-blur-xl"
        >
          <nav className="space-y-3">
            {NAV.map((item) => (
              <SheetClose key={item.href} asChild onClick={() => onNavigate()}>
                <a
                  href={item.href}
                  className="block rounded-xs px-3 py-2 text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground transition-colors duration-150 hover:bg-white/[0.12] hover:text-neutralHighlight focus-visible:bg-white/[0.12] focus-visible:text-neutralHighlight"
                >
                  {item.label}
                </a>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
};
