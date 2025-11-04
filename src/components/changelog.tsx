import { Button } from "./ui/button";

export const Changelog = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xs font-mono uppercase tracking-[0.32em] text-muted-foreground">
        Changelog
      </h2>
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground text-sm">
          Previous versions of this website
        </span>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-6" asChild>
            <a
              href="https://v3.polarzero.xyz"
              className="font-mono text-xs tracking-widest"
              target="_blank"
              rel="noreferrer"
            >
              n-3
            </a>
          </Button>
          <Button variant="outline" size="sm" className="h-6" asChild>
            <a
              href="https://v4.polarzero.xyz"
              className="font-mono text-xs tracking-widest"
              target="_blank"
              rel="noreferrer"
            >
              n-2
            </a>
          </Button>
          <Button variant="outline" size="sm" className="h-6" asChild>
            <a
              href="https://v5.polarzero.xyz"
              className="font-mono text-xs tracking-widest"
              target="_blank"
              rel="noreferrer"
            >
              n-1
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};
