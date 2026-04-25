import HeroSection from "../components/home/HeroSection";
import LiveUpdatesTicker from "../components/home/LiveUpdatesTicker";
import NewsSection from "../components/home/NewsSection";
import HomeProgramSection from "../components/home/HomeProgramSection";
import UpcomingEvents from "../components/home/UpcomingEvents";
import DonationSection from "../components/home/DonationSection";
import YouTubePromo from "../components/home/YouTubePromo";
import SEO from "../components/SEO";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Shri Baba Chhotu Nath Temple | Official Website"
        description="Experience the divine grace of Baba Chhotu Nath Sarkar at Badesra, Bhiwani. Official website of the temple with live updates, event schedules, and spiritual services."
      />
      <HeroSection />
      <LiveUpdatesTicker />
      <NewsSection />

      <div className="space-y-0">
        <HomeProgramSection />

        <YouTubePromo />


      </div>
    </div>
  );
}
