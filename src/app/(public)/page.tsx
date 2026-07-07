// de-pee/src/app/(public)/page.tsx
import { HomeGetStartedSection } from '@/components/shared/get-started-section';
import HeroSection from '@/components/shared/hero-section';
import type { Locale } from '@/features/site/config';
import { getGitHubStars } from '@/features/site/github';
import { getLocale } from 'next-intl/server';

const HomePage = async () => {
  const [locale, githubStars] = await Promise.all([
    getLocale(),
    getGitHubStars(),
  ]);

  return (
    <div className="flex flex-col gap-12 lg:gap-16">
      <HeroSection locale={locale as Locale} />
      <HomeGetStartedSection githubStars={githubStars} />
    </div>
  );
};

export default HomePage;
