export type Rating = {
  assetName: string;
  lat: number;
  lng: number;
  latOffset?: number;
  lngOffset?: number;
  businessCategory: string;
  riskRating: number;
  riskFactors: [string, number][];
  year: number;
};
