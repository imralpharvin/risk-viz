import Image from 'next/image';
import { Inter } from 'next/font/google';
import ClimateRiskRatingMap from './components/ClimateRiskRatingMap';

const inter = Inter({ subsets: ['latin'] });

export default async function Home() {
  return (
    <>
      <ClimateRiskRatingMap />
    </>
  );
}
