import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import FeaturedProducts from '@/components/FeaturedProducts';
import VirtualTryOn from '@/components/VirtualTryOn';
import WhyUs from '@/components/WhyUs';
import TrendingGallery from '@/components/TrendingGallery';
import Reviews from '@/components/Reviews';
import Newsletter from '@/components/Newsletter';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <VirtualTryOn />
      <WhyUs />
      <TrendingGallery />
      <Reviews />
      <Newsletter />
    </>
  );
}
