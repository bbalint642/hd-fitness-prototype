import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar } from "lucide-react"

export function CtaSection() {
  return (
    <section id="kapcsolat" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center space-y-8">
          <span className="text-primary text-sm font-semibold tracking-wider uppercase font-serif">Kezdd el most</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance font-serif uppercase">
            Készen állsz a <span className="text-primary">változásra?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Jelentkezz egy ingyenes felfedező hívásra, és beszéljük meg, hogyan érhetjük el együtt a céljaidat. Nincs
            elköteleződés, csak egy őszinte beszélgetés a lehetőségekről.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="cursor-pointer bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Ingyenes konzultációt kérek
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            ✓ Ingyenes és kötelezettségmentes ✓ 30 perces személyes beszélgetés
          </p>
        </div>
      </div>
    </section>
  )
}
