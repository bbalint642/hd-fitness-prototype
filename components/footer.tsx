import Link from "next/link"
import { Dumbbell, Instagram, Youtube, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Dumbbell className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                Hergert <span className="text-primary">Fitness</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Személyi edzés és online coaching. Segítek elérni a fitnesz céljaidat.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Navigáció</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#szolgaltatasok"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Szolgáltatások
                </Link>
              </li>
              <li>
                <Link href="#folyamat" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Hogyan működik
                </Link>
              </li>
              <li>
                <Link href="#videok" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Videótár
                </Link>
              </li>
              <li>
                <Link href="#kapcsolat" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Kapcsolat
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Szolgáltatások</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground text-sm">Személyi edzés</li>
              <li className="text-muted-foreground text-sm">Online coaching</li>
              <li className="text-muted-foreground text-sm">Étrendtervezés</li>
              <li className="text-muted-foreground text-sm">Edzésterv készítés</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Kapcsolat</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@hergertfitness.hu"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  info@hergertfitness.hu
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                >
                  <Instagram className="h-4 w-4" />
                  @hergertfitness
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                >
                  <Youtube className="h-4 w-4" />
                  Hergert Fitness
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">© 2025 Hergert Fitness. Minden jog fenntartva.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Adatvédelem
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              ÁSZF
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
