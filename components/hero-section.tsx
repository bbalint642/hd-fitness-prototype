import { ArrowRight, Sparkles } from "lucide-react"
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text"
import { AuroraText } from "@/components/magicui/aurora-text"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { BlurReveal } from "@/components/ui/blur-reveal"
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern"
import { LearnMoreCta } from "@/components/learn-more-cta"
import { cn } from "@/lib/utils"

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-screen flex-col overflow-hidden pt-20 md:pt-24"
    >
      {/* Interactive grid background with 3D perspective */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden [perspective:1200px] [perspective-origin:50%_40%]">
        <InteractiveGridPattern
          width={44}
          height={44}
          squares={[60, 44]}
          className={cn(
            "absolute left-1/2 top-1/2 h-[180%] w-[160%]",
            "[transform:translate(-50%,-50%)_rotateX(32deg)_skewY(10deg)]",
            "[transform-style:preserve-3d]",
            "[mask-image:radial-gradient(ellipse_55%_65%_at_50%_50%,black_15%,transparent_80%)]",
            "[-webkit-mask-image:radial-gradient(ellipse_55%_65%_at_50%_50%,black_15%,transparent_80%)]",
            "border-0",
          )}
          squaresClassName={cn(
            "stroke-primary/12 transition-colors duration-300 ease-out",
            "[&:hover]:fill-primary/22 [&:hover]:stroke-primary/38",
            "pointer-events-auto",
          )}
        />
      </div>

      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-40 -left-20 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[160px]" />

      {/* Main content area: two columns on desktop */}
      <div className="relative z-10 flex flex-1 items-center">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 pt-10 pb-16 sm:px-6 md:grid-cols-12 md:gap-6 md:pt-0 md:pb-24 lg:px-8">
          {/* Left: Content */}
          <div className="relative z-10 md:col-span-6 lg:col-span-7">
            {/* Shiny badge / small label */}
            <BlurReveal delay={0.05} className="mb-6">
              <span className="group inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 backdrop-blur-sm transition-colors hover:bg-primary/10">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <AnimatedShinyText className="mx-0 max-w-none text-xs font-medium uppercase tracking-[0.2em] text-primary/90">
                  Online Coaching & Személyi Edzés
                </AnimatedShinyText>
              </span>
            </BlurReveal>

            {/* Headline */}
            <h1 className="font-serif text-5xl font-bold uppercase leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
              <BlurReveal delay={0.15}>
                Építsd fel a{" "}
                <AuroraText
                  colors={["#ffbf00", "#ffd966", "#ff9500", "#ffe066", "#ffbf00"]}
                  speed={0.8}
                >
                  legjobb
                </AuroraText>{" "}
                <br className="hidden sm:inline" />
                verziódat.
              </BlurReveal>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              <BlurReveal delay={0.3}>
                Személyre szabott edzéstervek, étrendtervezés és folyamatos támogatás.
                Szálkásítás vagy tömegelés — együtt{" "}
                <span className="font-medium text-foreground">garantált</span> eredményt hozunk.
              </BlurReveal>
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
              <BlurReveal delay={0.45}>
                <ShimmerButton
                  shimmerColor="#fff8dc"
                  background="linear-gradient(135deg, #ffbf00 0%, #ffd966 50%, #ff9500 100%)"
                  borderRadius="0.625rem"
                  shimmerDuration="2.5s"
                  className="h-auto min-h-10 gap-2 px-4 py-2.5 text-base font-semibold text-black shadow-[0_10px_40px_-5px_rgba(255,191,0,0.5)] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-5"
                >
                  <span className="flex items-center gap-2">
                    Ingyenes konzultáció
                    <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </ShimmerButton>
              </BlurReveal>

              <BlurReveal delay={0.55}>
                <LearnMoreCta />
              </BlurReveal>
            </div>
          </div>

          {/* Right: Trainer image */}
          <div className="relative md:col-span-6 lg:col-span-5">
            {/* Mobile: soft background image behind content */}
            <div
              className="pointer-events-none absolute inset-x-0 -top-[110%] bottom-auto -z-10 h-[110%] md:hidden"
              aria-hidden="true"
            >
              <img
                src="/trainer.png"
                alt=""
                className="absolute bottom-0 right-0 h-full w-auto max-w-none select-none object-contain opacity-[0.12]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
            </div>

            {/* Desktop: focused figure on right */}
            <div className="relative hidden md:block">
              {/* Golden backdrop glow */}
              <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-[120px]" />
              </div>

              <BlurReveal delay={0.2} duration={1.2} className="block">
                <img
                  src="/trainer.png"
                  alt="Hergert Fitness - Személyi edző"
                  className="mx-auto h-[480px] w-auto max-w-none select-none object-contain object-bottom lg:h-[560px] xl:h-[640px]"
                />
              </BlurReveal>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent strip with stats */}
      <div className="relative z-10 mt-auto bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6 lg:px-8">
          <BlurReveal delay={0.6} className="flex min-w-0 flex-1 justify-center">
            <Stat value={50} suffix="+" label="Elégedett ügyfél" />
          </BlurReveal>
          <Divider />
          <BlurReveal delay={0.7} className="flex min-w-0 flex-1 justify-center">
            <Stat value={5} suffix="+" label="Év tapasztalat" />
          </BlurReveal>
          <Divider />
          <BlurReveal delay={0.8} className="flex min-w-0 flex-1 justify-center">
            <Stat value={100} suffix="%" label="egyénre szabott edzéstervek" />
          </BlurReveal>
        </div>
      </div>
    </section>
  )
}

function Stat({
  value,
  suffix,
  label,
}: {
  value: number
  suffix: string
  label: string
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 text-center sm:gap-2">
      <p className="flex min-h-[1.15em] items-baseline justify-center font-serif text-2xl font-extrabold uppercase tabular-nums leading-none text-primary-foreground sm:text-3xl lg:text-4xl">
        <NumberTicker value={value} className="text-primary-foreground" />
        <span className="translate-y-px">{suffix}</span>
      </p>
      <p className="max-w-[min(100%,12rem)] text-balance text-[10px] font-semibold uppercase leading-snug tracking-wider text-primary-foreground/85 sm:max-w-[14rem] sm:text-xs lg:text-sm">
        {label}
      </p>
    </div>
  )
}

function Divider() {
  return (
    <div className="flex items-center justify-center">
      <span className="h-8 w-px bg-primary-foreground/20 sm:h-10" />
    </div>
  )
}
