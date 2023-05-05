'use client';

import { useState, useEffect, useMemo } from 'react';
// import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { usePapaParse } from 'react-papaparse';
import chroma from 'chroma-js';
import { useSortableData } from '../hooks/useSortableData';
import { Rating } from '../types/Rating';
import {
  compareUniqueValues,
  getAllUniqueValues,
  getPropertyNameByHeader,
  getRandom,
  getRatingsByAssetName,
  getRatingsByFilters,
  getRatingsByYear,
  sortArrayByProperty,
} from '../utils/utils';
import Multiselect from 'multiselect-react-dropdown';
import MultiLineChart from './MultiLineChart';
import { UniqueValue } from '../types/UniqueValue';
import { unique } from 'next/dist/build/utils';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import L, { Icon } from 'leaflet';
import CustomMarker from './CustomMarker';
import MarkerClusterGroup from 'react-leaflet-cluster';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import { CloseIcon } from './CloseIcon';

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

const ClimateRiskRatingMap = () => {
  /* ---------------------------------- Hooks --------------------------------- */
  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  // });

  const [columns, setColumns] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [allUniqueValues, setAllUniqueValues] = useState<
    { category: string; value: string | number }[]
  >([]);

  const [assetNames, setAssetNames] = useState<UniqueValue[]>([]);
  const [selectedAssetNames, setSelectedAssetNames] = useState<UniqueValue[]>(
    []
  );
  const [locations, setLocations] = useState<UniqueValue[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<UniqueValue[]>([]);
  const [businessCategories, setBusinessCategories] = useState<UniqueValue[]>(
    []
  );
  const [selectedBusinessCategories, setSelectedBusinessCategories] = useState<
    UniqueValue[]
  >([]);
  const [riskFactors, setRiskFactors] = useState<UniqueValue[]>([]);
  const [selectedRiskFactors, setSelectedRiskFactors] = useState<UniqueValue[]>(
    []
  );
  const [years, setYears] = useState<UniqueValue[]>([]);
  const [selectedYear, setSelectedYear] = useState<UniqueValue>();
  const [filteredRatings, setFilteredRatings] = useState<Rating[]>([]);

  const [selectedMarker, setSelectedMarker] = useState<Rating>();
  const [selectedCategory, setSelectedCategory] =
    useState<string>('Asset Name');
  const [isBottomPaneOpen, setIsBottomPaneOpen] = useState<boolean>(false);
  const [isLeftPaneOpen, setIsLeftPaneOpen] = useState<boolean>(false);
  const [isRightPaneOpen, setIsRightPaneOpen] = useState<boolean>(false);
  const { items: sortedRatings, requestSort } =
    useSortableData(filteredRatings);

  let riskRatingColor = chroma.scale(['red', 'yellow', 'green']);

  /* ------------------------------- useEffects ------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      // Parse csv file
      const { readString } = usePapaParse();
      const res = await fetch('/assets/climateRiskRating.csv');
      const csvData = await res.text();
      readString(csvData, {
        worker: true,
        complete: (results: any) => {
          const resultsData = results.data;

          // Set columns
          const columns = resultsData.shift();
          setColumns(columns);

          // Set ratings
          const ratings = resultsData.map((item: string[]) => {
            const rating: Rating = {
              assetName: item[0],
              lat: Number(item[1]),
              lng: Number(item[2]),
              latOffset: getRandom(0.000001, 0.000099),
              lngOffset: getRandom(0.000001, 0.000099),
              businessCategory: item[3],
              riskRating: Number(item[4]),
              riskFactors: Object.entries(JSON.parse(item[5])) as [
                string,
                number
              ][],
              year: Number(item[6]),
            };

            return rating;
          });

          setRatings(ratings);

          const uniqueValues = getAllUniqueValues(ratings);

          setAllUniqueValues(uniqueValues);

          const assetNames = uniqueValues
            .filter((uniqueValue) => uniqueValue.category === 'Asset Name')
            .sort(compareUniqueValues);

          const locations = uniqueValues
            .filter((uniqueValue) => uniqueValue.category === 'Location')
            .sort(compareUniqueValues);

          const businessCategories = uniqueValues
            .filter(
              (uniqueValue) => uniqueValue.category === 'Business Category'
            )
            .sort(compareUniqueValues);

          const riskFactors = uniqueValues
            .filter((uniqueValue) => uniqueValue.category === 'Risk Factor')
            .sort(compareUniqueValues);

          const years = uniqueValues
            .filter((uniqueValue) => uniqueValue.category === 'Year')
            .sort(compareUniqueValues);

          setAssetNames(assetNames);
          setLocations(locations);
          setBusinessCategories(businessCategories);
          setRiskFactors(riskFactors);
          setYears(years);

          const firstYear = years[0];

          setSelectedYear(firstYear);
          setFilteredRatings(getRatingsByFilters([...ratings], [firstYear]));
        },
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (
      selectedAssetNames.length +
        selectedBusinessCategories.length +
        selectedLocations.length +
        selectedRiskFactors.length ===
      0
    ) {
      setFilteredRatings(
        getRatingsByFilters([...ratings], [selectedYear as UniqueValue])
      );
    } else {
      setFilteredRatings(
        getRatingsByFilters(
          [...ratings],
          [
            ...selectedAssetNames,
            ...selectedLocations,
            ...selectedBusinessCategories,
            ...selectedRiskFactors,
            selectedYear as UniqueValue,
          ]
        )
      );
    }
  }, [
    selectedAssetNames,
    selectedLocations,
    selectedBusinessCategories,
    selectedRiskFactors,
    selectedYear,
  ]);

  /* ---------------------------- Event handlers ---------------------------- */

  const selectedAssetNamesOnChange = (selectedList: UniqueValue[]) => {
    setSelectedAssetNames([...selectedList]);
  };

  const selectedLocationsOnChange = (selectedList: UniqueValue[]) => {
    setSelectedLocations([...selectedList]);
  };

  const selectedBusinessCategoriesOnChange = (selectedList: UniqueValue[]) => {
    setSelectedBusinessCategories([...selectedList]);
  };

  const selectedRiskFactorsOnChange = (selectedList: UniqueValue[]) => {
    setSelectedRiskFactors([...selectedList]);
  };

  const selectedYearOnChange = (e: any) => {
    setSelectedYear({ category: 'Year', value: Number(e.target.value) });
  };

  const onClickMarker = (rating: any) => {
    setSelectedMarker(rating);
  };

  const center = useMemo(() => ({ lat: 44, lng: -80 }), []);

  /* ---------------------------- Render Component ---------------------------- */

  return (
    <>
      <MapContainer
        center={[44, -80]}
        zoom={4}
        scrollWheelZoom={false}
        className=''
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
        />
        {filteredRatings?.map((rating: any, index: any) => {
          return (
            <CustomMarker
              key={index}
              position={[
                rating.lat + rating.latOffset,
                rating.lng + rating.lngOffset,
              ]}
              color={(riskRatingColor(rating.riskRating) as any)
                .darken(1)
                .hex()}
              assetName={rating.assetName}
              businessCategory={rating.businessCategory}
              onClick={() => {
                console.log('CLICKED');
                setSelectedMarker(rating);
                setIsRightPaneOpen(true);
              }}
            />
          );
        })}
      </MapContainer>
      <select
        className='selectYear'
        name='years'
        id='years'
        value={selectedYear?.value ?? ''}
        onChange={selectedYearOnChange}
      >
        {years.map((year: UniqueValue) => {
          return (
            <option
              className='selectYearOption'
              value={year.value}
              key={year.value}
            >
              {year.value}
            </option>
          );
        })}
      </select>

      <div style={{ display: 'flex', justifyContent: 'center' }}></div>
      {sortedRatings.length}
      <SlidingPane
        isOpen={isBottomPaneOpen}
        onRequestClose={() => {
          setIsBottomPaneOpen(false);
        }}
        from='bottom'
        width='100%'
        closeIcon={<CloseIcon />}
        title='Climate Risk Rating'
      >
        <table>
          <thead>
            <tr>
              {columns?.map((header: any, index: number) => {
                return (
                  <th key={index}>
                    <button
                      type='button'
                      onClick={() =>
                        requestSort(getPropertyNameByHeader(header))
                      }
                    >
                      {header}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedRatings?.map((rating: Rating, index: any) => {
              return (
                <tr key={index}>
                  <td>{rating.assetName}</td>
                  <td>{rating.lat}</td>
                  <td>{rating.lng}</td>
                  <td>{rating.businessCategory}</td>
                  <td>{rating.riskRating}</td>

                  <td>
                    {rating.riskFactors.map((riskFactor) => {
                      const [riskFactorName, riskRating] = riskFactor;
                      if (
                        selectedRiskFactors.length === 0 ||
                        (selectedRiskFactors.length > 0 &&
                          selectedRiskFactors.find(
                            (selectedRiskFactor) =>
                              selectedRiskFactor.value === riskFactorName
                          ))
                      )
                        return (
                          <div
                            key={index}
                          >{`${riskFactorName}: ${riskRating}`}</div>
                        );
                    })}
                  </td>
                  <td>{rating.year}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SlidingPane>
      <SlidingPane
        isOpen={isLeftPaneOpen}
        onRequestClose={() => {
          setIsLeftPaneOpen(false);
        }}
        from='left'
        width='25%'
        closeIcon={<CloseIcon />}
        title='Filters'
      >
        <div>Asset Name</div>
        <Multiselect
          displayValue='value'
          options={assetNames}
          selectedValues={selectedAssetNames}
          onSelect={selectedAssetNamesOnChange}
          onRemove={selectedAssetNamesOnChange}
          showCheckbox={true}
        />
        <div>Location</div>
        <Multiselect
          displayValue='value'
          options={locations}
          selectedValues={selectedLocations}
          onSelect={selectedLocationsOnChange}
          onRemove={selectedLocationsOnChange}
          showCheckbox={true}
        />
        <div>Business Category</div>
        <Multiselect
          displayValue='value'
          options={businessCategories}
          selectedValues={selectedBusinessCategories}
          onSelect={selectedBusinessCategoriesOnChange}
          onRemove={selectedBusinessCategoriesOnChange}
          showCheckbox={true}
        />
        <div>Risk Factors</div>
        <Multiselect
          displayValue='value'
          options={riskFactors}
          selectedValues={selectedRiskFactors}
          onSelect={selectedRiskFactorsOnChange}
          onRemove={selectedRiskFactorsOnChange}
          showCheckbox={true}
        />
      </SlidingPane>
      <SlidingPane
        isOpen={isRightPaneOpen}
        onRequestClose={() => {
          setIsRightPaneOpen(false);
        }}
        from='right'
        width='550px'
        closeIcon={<CloseIcon />}
        title='Line Chart'
      >
        {selectedMarker ? (
          <>
            Filter By Category:
            <select
              name='category'
              id='category'
              value={selectedCategory ?? ''}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
              }}
            >
              <option value={'Asset Name'}>Asset Name</option>
              <option value={'Business Category'}>Business Category</option>
            </select>
            <MultiLineChart
              ratings={getRatingsByFilters(
                [...ratings],
                [
                  {
                    category: selectedCategory as string,
                    value:
                      selectedMarker[
                        getPropertyNameByHeader(selectedCategory) as string
                      ],
                  },
                ]
              )}
              years={years.map((year) => year.value as number)}
              selectedRating={selectedMarker}
            />
          </>
        ) : (
          'Click a marker'
        )}
      </SlidingPane>
      <button
        className='bottomPaneButton'
        onClick={() => {
          setIsBottomPaneOpen(true);
        }}
      >
        <svg
          fill='white'
          width='2rem'
          height='2rem'
          viewBox='0 0 200 200'
          data-name='Layer 1'
          id='Layer_1'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
          <g
            id='SVGRepo_tracerCarrier'
            strokeLinecap='round'
            strokeLinejoin='round'
          ></g>
          <g id='SVGRepo_iconCarrier'>
            <title></title>
            <path d='M114,74.5a19.92,19.92,0,0,0-28.5,0L57,103a9.9,9.9,0,0,0,14,14L99.5,88.5,128,117a9.9,9.9,0,0,0,14-14Z'></path>
            <path d='M100,15a85,85,0,1,0,85,85A84.93,84.93,0,0,0,100,15Zm0,150a65,65,0,1,1,65-65A64.87,64.87,0,0,1,100,165Z'></path>
          </g>
        </svg>
      </button>
      <button
        className='leftPaneButton'
        onClick={() => {
          setIsLeftPaneOpen(true);
        }}
      >
        <svg
          fill='white'
          width='2rem'
          height='2rem'
          viewBox='0 0 200 200'
          data-name='Layer 1'
          id='Layer_1'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
          <g
            id='SVGRepo_tracerCarrier'
            strokeLinecap='round'
            strokeLinejoin='round'
          ></g>
          <g id='SVGRepo_iconCarrier'>
            <title></title>
            <path d='M100,15a85,85,0,1,0,85,85A84.93,84.93,0,0,0,100,15Zm0,150a65,65,0,1,1,65-65A64.87,64.87,0,0,1,100,165ZM97.5,57.5a9.9,9.9,0,0,0-14,14L112,100,83.5,128.5a9.9,9.9,0,0,0,14,14L126,114a19.92,19.92,0,0,0,0-28.5Z'></path>
          </g>
        </svg>
      </button>
      <button
        className='rightPaneButton'
        onClick={() => {
          setIsRightPaneOpen(true);
        }}
      >
        <svg
          fill='white'
          width='2rem'
          height='2rem'
          viewBox='0 0 200 200'
          data-name='Layer 1'
          id='Layer_1'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
          <g
            id='SVGRepo_tracerCarrier'
            strokeLinecap='round'
            strokeLinejoin='round'
          ></g>
          <g id='SVGRepo_iconCarrier'>
            <title></title>
            <path d='M100,15a85,85,0,1,0,85,85A84.93,84.93,0,0,0,100,15Zm0,150a65,65,0,1,1,65-65A64.87,64.87,0,0,1,100,165ZM116.5,57.5a9.67,9.67,0,0,0-14,0L74,86a19.92,19.92,0,0,0,0,28.5L102.5,143a9.9,9.9,0,0,0,14-14l-28-29L117,71.5C120.5,68,120.5,61.5,116.5,57.5Z'></path>
          </g>
        </svg>
      </button>
    </>
  );
};

export default ClimateRiskRatingMap;
