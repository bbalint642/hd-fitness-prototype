import { Button } from "@/components/ui/button"
import { Play, ArrowRight } from "lucide-react"

const videos = [
  {
    title: "Alapgyakorlatok technikája",
    duration: "15:32",
    thumbnail: "/gym-workout-squat-dark.jpg",
  },
  {
    title: "Otthoni edzés alapok",
    duration: "22:15",
    thumbnail: "/home-workout-fitness-dark.jpg",
  },
  {
    title: "Táplálkozási tippek",
    duration: "18:45",
    thumbnail: "/healthy-meal-prep-fitness-dark.jpg",
  },
]

export function VideoLibrarySection() {
  return (
    <section id="videok" className="py-20 md:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase font-serif">Videótár</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance font-serif uppercase">
              Exkluzív <span className="text-primary">videó tartalmak</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Hozzáférés a folyamatosan bővülő videótáramhoz, ahol részletes gyakorlatbemutatókat, edzéstippeket és
              táplálkozási tanácsokat találsz.
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Több mint 100+ edzésvideó
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Részletes technikamagyarázatok
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Heti új tartalmak
              </li>
            </ul>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              Videótár elérése
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            {videos.map((video, index) => (
              <div
                key={index}
                className="group relative flex gap-4 p-4 rounded-xl bg-secondary border border-border hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <Play className="h-8 w-8 text-white fill-white" />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors font-serif">
                    {video.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{video.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
