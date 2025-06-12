import HeroSection from '@/components/home/HeroSection';
import FeaturedSection from '@/components/home/FeaturedSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F5F5F5]">
      <HeroSection />
      <FeaturedSection />
    </main>
  );
}