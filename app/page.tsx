import { Navbar } from "@/components/navbar"
import { ScrollToTopButton } from "@/components/scroll-to-top-button"
import { HeroSection } from "@/components/hero-section"
import { SuccessCarouselSection } from "@/components/success-carousel-section"
import { ServicesSection } from "@/components/services-section"
import { ProcessSection } from "@/components/process-section"
import { VideoLibrarySection } from "@/components/video-library-section"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SuccessCarouselSection />
      <ServicesSection />
      <ProcessSection />
      <VideoLibrarySection />
      <CtaSection />
      <Footer />
      <ScrollToTopButton />
    </main>
  )
}
