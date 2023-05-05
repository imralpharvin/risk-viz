import Image from 'next/image';
import { Inter } from 'next/font/google';
import ClimateRiskRatingTable from './components/ClimateRiskRatingTable';
import { usePapaParse } from 'react-papaparse';
import ClimateRiskRatingMap from './components/ClimateRiskRatingMap';

const inter = Inter({ subsets: ['latin'] });

export default async function Home() {
  return (
    <>
      <ClimateRiskRatingMap />
      {/* <ClimateRiskRatingTable /> */}
    </>
  );
}
