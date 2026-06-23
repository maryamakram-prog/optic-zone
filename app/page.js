import Hero from '@/components/Hero';
import ShopByFaceShape from '@/components/ShopByFaceShape';
import NewArrivals from '@/components/NewArrivals';
import TrendingProducts from '@/components/TrendingProducts';
import Categories from '@/components/Categories';
import FeaturedProducts from '@/components/FeaturedProducts';
import VirtualTryOn from '@/components/VirtualTryOn';
import WhyUs from '@/components/WhyUs';
import TrendingGallery from '@/components/TrendingGallery';
import Reviews from '@/components/Reviews';
import FaqSection from '@/components/FaqSection';
import Newsletter from '@/components/Newsletter';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ShopByFaceShape />
      <NewArrivals />
      <Categories />
      <TrendingProducts />
      <FeaturedProducts />
      <VirtualTryOn />
      <WhyUs />
      <TrendingGallery />
      <Reviews />
      <FaqSection />
      <Newsletter />
    </>
  );
}
