import Image from 'next/image';
import { Inter } from 'next/font/google';

import dynamic from 'next/dynamic';

const ClimateRiskRatingMap = dynamic(
  () => import('./components/ClimateRiskRatingMap'),
  {
    ssr: false,
  }
);

const inter = Inter({ subsets: ['latin'] });

export default async function Home() {
  return (
    <>
      <ClimateRiskRatingMap />
    </>
  );
}
