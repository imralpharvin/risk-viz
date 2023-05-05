'use client';

import { useState, useEffect } from 'react';
import { usePapaParse } from 'react-papaparse';
import { useTable, useSortBy } from 'react-table';

const ClimateRiskRatingTable = () => {
  const [headers, setHeaders] = useState<any[] | null>(null);
  const [ratings, setRatings] = useState<any[] | null>(null);

  const table = useTable({ columns, data }, useSortBy);

  useEffect(() => {
    const fetchData = async () => {
      const { readString } = usePapaParse();
      const res = await fetch('/assets/climateRiskRating.csv');
      const csvData = await res.text();
      readString(csvData, {
        worker: true,
        complete: (results: any) => {
          const resultsData = results.data;
          setHeaders(resultsData.shift());
          setRatings(resultsData);
        },
      });
    };

    fetchData();
  }, []);

  //   if (!data) return <p>No profile data</p>;

  return (
    <table>
      <thead>
        <tr>
          {headers?.map((header: string, index: number) => {
            return <th key={index}>{header}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {ratings?.map((rating, index) => {
          return (
            <tr key={index}>
              {rating?.map((item: string, index: number) => {
                return <td key={index}>{item}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ClimateRiskRatingTable;
