import { Phone, MessageSquare, Rocket } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Phone,
    title: "Felfedező hívás",
    description:
      "Jelentkezz egy ingyenes konzultációra, ahol mesélhetsz magadról, a céljaidról, az akadályokról és arról, milyen sportokat szeretsz.",
  },
  {
    number: "02",
    icon: MessageSquare,
    title: "Személyre szabott terv",
    description:
      "Áttekintem a helyzetedet és részletesen elmondom, mikben és hogyan tudok segíteni. Megbeszéljük, hogyan fog működni a közös munka.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Közös munka kezdete",
    description:
      "Elkészítem a személyre szabott edzés- és étrendtervedet, és elkezdjük a közös munkát. Végig melletted leszek az úton.",
  },
]

export function ProcessSection() {
  return (
    <section id="folyamat" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-sm font-semibold tracking-wider uppercase font-serif">Hogyan működik</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-foreground text-balance font-serif uppercase">
            A közös munka <span className="text-primary">folyamata</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Egyszerű és átlátható folyamat, amely az első lépéstől a céljaid eléréséig vezet.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" />

          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center font-serif">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground font-serif">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
