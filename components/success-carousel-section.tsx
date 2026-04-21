"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import { motion } from "motion/react"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { BlurReveal } from "@/components/ui/blur-reveal"
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text"
import { cn } from "@/lib/utils"

type SuccessStory = {
  id: string
  image: string
  alt: string
  label: string
  duration: string
}

const successStories: SuccessStory[] = [
  {
    id: "01",
    image: "/success1.jpg",
    alt: "Transzformáció 1 - Sikeres izomépítés",
    label: "Szálkásítás",
    duration: "6 hónap",
  },
  {
    id: "02",
    image: "/success2.jpg",
    alt: "Transzformáció 2 - Testi változás",
    label: "Izomépítés",
    duration: "4 hónap",
  },
  {
    id: "03",
    image: "/success3.jpg",
    alt: "Transzformáció 3 - Hátizom fejlesztés",
    label: "Látványos fejlődés",
    duration: "5 hónap",
  },
  {
    id: "04",
    image: "/success4.jpg",
    alt: "Transzformáció 4 - Női testépítés",
    label: "Alakformálás",
    duration: "8 hónap",
  },
  {
    id: "05",
    image: "/success5.jpg",
    alt: "Transzformáció 5 - Látványos változás",
    label: "Teljes átalakulás",
    duration: "7 hónap",
  },
]

const AUTO_PLAY_DURATION = 5000

export function SuccessCarouselSection() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)

  React.useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    const onSelect = () => setCurrent(api.selectedScrollSnap())
    api.on("select", onSelect)
    api.on("reInit", onSelect)

    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api])

  React.useEffect(() => {
    if (!api || isPaused || count === 0) return
    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0)
      }
    }, AUTO_PLAY_DURATION)
    return () => clearInterval(interval)
  }, [api, isPaused, current, count])

  return (
    <section
      id="eredmenyek"
      className="relative overflow-hidden py-20 md:py-32"
    >
      {/* Ambient glows — a Hero / Services szekcióval koherens */}
      <div className="pointer-events-none absolute -top-40 left-1/4 -z-10 h-[460px] w-[460px] rounded-full bg-primary/[0.07] blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[420px] w-[420px] rounded-full bg-primary/[0.05] blur-[160px]" />

      {/* Halvány felső elválasztó vonal — mint a Services */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Szekció fejléc */}
        <div className="mx-auto mb-14 max-w-3xl text-center md:mb-16">
          <BlurReveal delay={0.05} className="mb-5 inline-block">
            <span className="group inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <AnimatedShinyText className="mx-0 max-w-none text-xs font-medium uppercase tracking-[0.2em] text-primary/90">
                Valódi eredmények
              </AnimatedShinyText>
            </span>
          </BlurReveal>

          <h2 className="text-balance font-serif text-3xl font-bold uppercase text-foreground md:text-4xl lg:text-5xl">
            <BlurReveal delay={0.15}>
              Sikeres <span className="text-primary">ügyfelek</span>
            </BlurReveal>
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            <BlurReveal delay={0.25}>
              Nézd meg ügyfeleink lenyűgöző átalakulását — kitartás, tudatosság
              és személyre szabott edzésterv eredményeként.
            </BlurReveal>
          </p>
        </div>

        {/* Carousel */}
        <BlurReveal delay={0.3} className="block">
          <div
            className="group/carousel relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Finom arany glow a carousel mögött */}
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-primary/[0.06] opacity-70 blur-3xl" />

            <Carousel
              setApi={setApi}
              opts={{ align: "start", loop: true }}
              className="w-full"
            >
              <CarouselContent className="-ml-4 md:-ml-6">
                {successStories.map((story) => (
                  <CarouselItem
                    key={story.id}
                    className="pl-4 sm:basis-1/2 md:pl-6 lg:basis-1/3"
                  >
                    <SuccessCard story={story} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Vezérlősor: index + progress + nyilak — mint a Services */}
            <div className="mt-8 flex items-center justify-between gap-6 px-1">
              {/* Index */}
              <span className="font-serif text-xs font-semibold uppercase tabular-nums tracking-[0.3em] text-muted-foreground md:text-sm">
                {String(current + 1).padStart(2, "0")}{" "}
                <span className="text-muted-foreground/50">
                  / {String(count).padStart(2, "0")}
                </span>
              </span>

              {/* Progress-sáv + pont jelzők */}
              <div className="flex flex-1 items-center justify-center gap-2 md:gap-3">
                {Array.from({ length: count }).map((_, index) => {
                  const isActive = index === current
                  return (
                    <button
                      key={index}
                      onClick={() => api?.scrollTo(index)}
                      className={cn(
                        "relative h-1 overflow-hidden rounded-full transition-all duration-500",
                        isActive
                          ? "w-10 bg-primary/20 md:w-14"
                          : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50",
                      )}
                      aria-label={`Ugrás a ${index + 1}. kártyához`}
                    >
                      {isActive && !isPaused && (
                        <motion.span
                          key={`progress-${current}`}
                          className="absolute inset-y-0 left-0 block bg-primary"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{
                            duration: AUTO_PLAY_DURATION / 1000,
                            ease: "linear",
                          }}
                        />
                      )}
                      {isActive && isPaused && (
                        <span className="absolute inset-0 bg-primary" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Navigációs gombok — azonos stílus a Services szekcióval */}
              <div className="flex gap-2 md:gap-3">
                <button
                  onClick={() => api?.scrollPrev()}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground backdrop-blur-md transition-all hover:border-primary/50 hover:bg-background hover:text-primary active:scale-90 md:h-12 md:w-12"
                  aria-label="Előző"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => api?.scrollNext()}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground backdrop-blur-md transition-all hover:border-primary/50 hover:bg-background hover:text-primary active:scale-90 md:h-12 md:w-12"
                  aria-label="Következő"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </BlurReveal>
      </div>
    </section>
  )
}

function SuccessCard({ story }: { story: SuccessStory }) {
  return (
    <div className="group/card relative aspect-[3/4] overflow-hidden rounded-3xl border border-border/60 bg-muted/30 transition-all duration-500 hover:border-primary/40 hover:shadow-[0_20px_60px_-20px_rgba(255,191,0,0.25)]">
      <img
        src={story.image || "/placeholder.svg"}
        alt={story.alt}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover/card:scale-[1.06]"
        draggable={false}
      />

      {/* Alsó sötétülés a kontrasztért — mint a Services képeken */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

      {/* Alsó cím overlay */}
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <span className="font-serif text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
          {story.duration}
        </span>
        <h3 className="mt-1.5 font-serif text-lg font-bold uppercase leading-tight text-white md:text-xl lg:text-2xl">
          {story.label}
        </h3>

        {/* Arany accent vonal — az overlay alján */}
        <div className="mt-3 h-px w-10 bg-gradient-to-r from-primary to-primary/0 transition-all duration-500 group-hover/card:w-16" />
      </div>
    </div>
  )
}
