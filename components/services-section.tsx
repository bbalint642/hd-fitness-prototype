"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const services = [
  {
    id: "01",
    title: "Részletes edzésterv",
    description:
      "Személyre szabott edzésprogram, amely figyelembe veszi a céljaidat, a tapasztalataidat és az időbeosztásodat.",
    image: "/gym-workout-squat-dark.jpg",
  },
  {
    id: "02",
    title: "Reális célkitűzés",
    description:
      "Elérhető, mérhető célok — lépésről lépésre, hogy tényleg látható eredményt érj el.",
    image: "/home-workout-fitness-dark.jpg",
  },
  {
    id: "03",
    title: "Étrendtervezés",
    description:
      "Szálkásítás vagy tömegelés? Testreszabott étrend, ami támogatja az edzéseidet és az életmódodat.",
    image: "/healthy-meal-prep-fitness-dark.jpg",
  },
  {
    id: "04",
    title: "Folyamatos támogatás",
    description:
      "Nem maradsz egyedül. Rendszeres egyeztetés, motiváció és a terv finomhangolása szükség szerint.",
    image: "/muscular-personal-trainer-in-gym-dark-lighting.jpg",
  },
]

const AUTO_PLAY_DURATION = 6000

export function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const handleNext = useCallback(() => {
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % services.length)
  }, [])

  const handlePrev = useCallback(() => {
    setDirection(-1)
    setActiveIndex((prev) => (prev - 1 + services.length) % services.length)
  }, [])

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
    setIsPaused(false)
  }

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      handleNext()
    }, AUTO_PLAY_DURATION)
    return () => clearInterval(interval)
  }, [activeIndex, isPaused, handleNext])

  const variants = {
    enter: (dir: number) => ({
      y: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      y: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  }

  return (
    <section id="szolgaltatasok" className="relative py-20 md:py-32 bg-card">
      {/* soft ambient glow — a jelenlegi dizájn megtartása */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Szekció fejléc — megegyezik a korábbi stílussal */}
        <div className="mx-auto mb-14 max-w-3xl text-center md:mb-16">
          <span className="font-serif text-sm font-semibold uppercase tracking-wider text-primary">
            Szolgáltatások
          </span>
          <h2 className="mt-4 text-balance font-serif text-3xl font-bold uppercase text-foreground md:text-4xl lg:text-5xl">
            Miben segíthetek <span className="text-primary">neked?</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Komplex megközelítés az eredményekért: edzés, táplálkozás és mentális támogatás egy kézben.
          </p>
        </div>

        {/* Vertical tabs layout */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Bal oldal: tabok */}
          <div className="order-2 flex flex-col justify-center pt-4 lg:order-1 lg:col-span-5">
            <div className="flex flex-col">
              {services.map((service, index) => {
                const isActive = activeIndex === index
                return (
                  <button
                    key={service.id}
                    onClick={() => handleTabClick(index)}
                    className={cn(
                      "group relative flex items-start gap-4 border-t border-border/60 py-6 text-left transition-all duration-500 first:border-0 md:py-8",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground/70 hover:text-foreground",
                    )}
                  >
                    {/* Bal oldali progress sáv */}
                    <div className="absolute left-[-16px] top-0 bottom-0 w-[2px] bg-border md:left-[-24px]">
                      {isActive && (
                        <motion.div
                          key={`progress-${index}-${isPaused}`}
                          className="absolute left-0 top-0 w-full origin-top bg-primary"
                          initial={{ height: "0%" }}
                          animate={isPaused ? { height: "0%" } : { height: "100%" }}
                          transition={{
                            duration: AUTO_PLAY_DURATION / 1000,
                            ease: "linear",
                          }}
                        />
                      )}
                    </div>

                    <span
                      className={cn(
                        "mt-2 font-serif text-[11px] font-semibold uppercase tabular-nums tracking-[0.3em] transition-colors duration-500 md:text-xs",
                        isActive ? "text-primary" : "text-muted-foreground/50",
                      )}
                    >
                      /{service.id}
                    </span>

                    <div className="flex flex-1 flex-col gap-2">
                      <span
                        className={cn(
                          "font-serif text-2xl font-bold uppercase tracking-tight transition-colors duration-500 md:text-3xl lg:text-4xl",
                          isActive ? "text-foreground" : "",
                        )}
                      >
                        {service.title}
                      </span>

                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{
                              duration: 0.35,
                              ease: [0.23, 1, 0.32, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <p className="max-w-md pb-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                              {service.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Jobb oldal: galéria */}
          <div className="order-1 flex h-full flex-col justify-end lg:order-2 lg:col-span-7">
            <div
              className="group/gallery relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/60 bg-muted/30 md:aspect-[4/3] md:rounded-[2rem] lg:aspect-[16/11]">
                {/* Finom arany glow a kép mögött */}
                <div className="pointer-events-none absolute -inset-2 -z-10 rounded-[2.5rem] bg-primary/10 opacity-60 blur-3xl" />

                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      y: { type: "spring", stiffness: 260, damping: 32 },
                      opacity: { duration: 0.4 },
                    }}
                    className="absolute inset-0 h-full w-full cursor-pointer"
                    onClick={handleNext}
                  >
                    <Image
                      src={services[activeIndex].image}
                      alt={services[activeIndex].title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover transition-transform duration-700 group-hover/gallery:scale-[1.03]"
                      priority={activeIndex === 0}
                    />

                    {/* Alsó sötétülés a kontrasztért */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Cím overlay a képen */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <span className="font-serif text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                        / {services[activeIndex].id}
                      </span>
                      <h3 className="mt-2 font-serif text-2xl font-bold uppercase leading-tight text-white md:text-3xl lg:text-4xl">
                        {services[activeIndex].title}
                      </h3>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigációs gombok */}
                <div className="absolute bottom-6 right-6 z-20 flex gap-2 md:bottom-8 md:right-8 md:gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePrev()
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground backdrop-blur-md transition-all hover:border-primary/50 hover:bg-background hover:text-primary active:scale-90 md:h-12 md:w-12"
                    aria-label="Előző"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNext()
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground backdrop-blur-md transition-all hover:border-primary/50 hover:bg-background hover:text-primary active:scale-90 md:h-12 md:w-12"
                    aria-label="Következő"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Index jelző (mobil + desktop) */}
              <div className="mt-5 flex items-center justify-between px-1">
                <span className="font-serif text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  {String(activeIndex + 1).padStart(2, "0")}{" "}
                  <span className="text-muted-foreground/50">
                    / {String(services.length).padStart(2, "0")}
                  </span>
                </span>
                <span className="hidden font-serif text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground md:block">
                  Komplex szolgáltatáscsomag
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
