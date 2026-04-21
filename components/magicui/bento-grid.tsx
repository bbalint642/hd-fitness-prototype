import { type ComponentPropsWithoutRef, type ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className?: string
  background?: ReactNode
  Icon: React.ElementType
  description: string
  href?: string
  cta?: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[20rem] grid-cols-1 gap-4 md:grid-cols-3 md:gap-5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    className={cn(
      "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl",
      "border border-border/60 bg-card/60 backdrop-blur-sm",
      "transition-[transform,border-color,box-shadow] duration-300 ease-out",
      "hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_20px_60px_-20px_rgba(255,191,0,0.25)]",
      className,
    )}
    {...props}
  >
    {/* background decoration layer */}
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">{background}</div>

    {/* subtle top gradient accent */}
    <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

    <div className="relative z-10 p-6">
      <div
        className={cn(
          "flex transform-gpu flex-col gap-2 transition-all duration-300",
          cta ? "lg:group-hover:-translate-y-8" : "",
        )}
      >
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 group-hover:scale-110 group-hover:border-primary/40 group-hover:bg-primary/15">
          <Icon className="h-6 w-6" aria-hidden />
        </div>
        <h3 className="mt-3 font-serif text-xl font-semibold uppercase tracking-wide text-foreground">
          {name}
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>

    {cta && href && (
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-10 flex translate-y-4 items-center p-6 opacity-0",
          "transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
        )}
      >
        <Button
          asChild
          variant="link"
          size="sm"
          className="pointer-events-auto h-auto p-0 text-primary hover:text-primary/80"
        >
          <Link href={href} className="inline-flex items-center">
            {cta}
            <ArrowRight className="ms-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </Button>
      </div>
    )}

    {/* hover overlay */}
    <div className="pointer-events-none absolute inset-0 transform-gpu rounded-2xl bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 transition-all duration-300 group-hover:from-primary/[0.04] group-hover:via-primary/[0.02] group-hover:to-transparent" />
  </div>
)

export { BentoCard, BentoGrid }
