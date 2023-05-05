import { Rating } from '../types/Rating';
import { UniqueValue } from '../types/UniqueValue';

export const getPropertyNameByHeader = (header: string) => {
  switch (header) {
    case 'Asset Name': {
      return 'assetName';
    }
    case 'Lat': {
      return 'lat';
    }
    case 'Long': {
      return 'lng';
    }
    case 'Business Category': {
      return 'businessCategory';
    }
    case 'Risk Rating': {
      return 'riskRating';
    }
    case 'Risk Factors': {
      return 'riskFactors';
    }
    case 'Year': {
      return 'year';
    }
    default: {
      return '';
    }
  }
};

export const getHeaderByPropertyName = (propertyName: string) => {
  switch (propertyName) {
    case 'assetName': {
      return 'Asset Name';
    }
    case 'lat': {
      return 'Lat';
    }
    case 'lng': {
      return 'Long';
    }
    case 'businessCategory': {
      return 'Business Category';
    }
    case 'riskRating': {
      return 'Risk Rating';
    }
    case 'riskFactors': {
      return 'Risk Factors';
    }
    case 'year': {
      return 'Year';
    }
    default: {
      return '';
    }
  }
};

export const getRandom = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const sortArrayByProperty = (array: [], property: any) => {
  return array.sort((a, b) => a[property] - b[property]);
};

export const getRatingsByYear = (ratings: Rating[], year: number) => {
  return ratings.filter((rating) => {
    return rating.year === year;
  });
};

export const convertLocationStringToObject = (location: string) => {
  let formatString = location.substring(1);
  formatString = formatString.substring(0, formatString.length - 1);
};

export const getRatingsByFilters = (
  ratings: Rating[],
  filters: UniqueValue[]
) => {
  return ratings.filter((rating) => {
    if (
      (!filters.some((filter) => filter.category === 'Asset Name') ||
        filters.find((filter) => filter.value === rating.assetName)) &&
      (!filters.some((filter) => filter.category === 'Location') ||
        filters.find(
          (filter) => filter.value === `(${rating.lat}, ${rating.lng})`
        )) &&
      (!filters.some((filter) => filter.category === 'Business Category') ||
        filters.find((filter) => filter.value === rating.businessCategory)) &&
      (!filters.some((filter) => filter.category === 'Risk Factor') ||
        rating.riskFactors.some((riskFactor) => {
          const [riskFactorName] = riskFactor;

          return filters.find((filter) => filter.value === riskFactorName);
        })) &&
      (!filters.some((filter) => filter.category === 'Year') ||
        filters.find((filter) => filter.value === rating.year))
    ) {
      return true;
    }

    return false;
    // return rating.riskFactors.some((riskFactor) => {
    //   const [riskFactorName] = riskFactor;

    //   return filters.includes(riskFactorName);
    // });
  });
};

export const getRatingsByAssetName = (
  ratings: Rating[],
  assetName: string
): Rating[] => {
  return ratings.filter((rating) => {
    return rating.assetName === assetName;
  });
};

export const getAllUniqueValues = (ratings: Rating[]) => {
  const uniqueValues: UniqueValue[] = [];

  ratings.map((rating) => {
    const location = `(${rating.lat}, ${rating.lng})`;
    // uniqueValues.map((uniqueValue) => console.log(uniqueValue));

    if (
      !uniqueValues.find(
        (uniqueValue) =>
          uniqueValue.category === 'Asset Name' &&
          uniqueValue.value === rating.assetName
      )
    ) {
      uniqueValues.push({ category: 'Asset Name', value: rating.assetName });
    }
    if (
      !uniqueValues.find(
        (uniqueValue) =>
          uniqueValue.category === 'Business Category' &&
          uniqueValue.value === rating.businessCategory
      )
    ) {
      uniqueValues.push({
        category: 'Business Category',
        value: rating.businessCategory,
      });
    }
    if (
      !uniqueValues.find(
        (uniqueValue) =>
          uniqueValue.category === 'Location' && uniqueValue.value === location
      )
    ) {
      uniqueValues.push({
        category: 'Location',
        value: location,
      });
    }

    rating.riskFactors.map((riskFactor) => {
      const [riskFactorName] = riskFactor;
      if (
        !uniqueValues.find(
          (uniqueValue) =>
            uniqueValue.category === 'Risk Factor' &&
            uniqueValue.value === riskFactorName
        )
      ) {
        uniqueValues.push({
          category: 'Risk Factor',
          value: riskFactorName,
        });
      }
    });

    if (
      !uniqueValues.find(
        (uniqueValue) =>
          uniqueValue?.category === 'Year' && uniqueValue?.value === rating.year
      )
    ) {
      uniqueValues.push({
        category: 'Year',
        value: rating.year,
      });
    }
  });

  return uniqueValues;
};

export const compareUniqueValues = (a: UniqueValue, b: UniqueValue) =>
  a.value > b.value ? 1 : b.value > a.value ? -1 : 0;
