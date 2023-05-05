import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { Rating } from '../types/Rating';
import { getAllUniqueValues } from '../utils/utils';

const MultiLineChart = ({
  ratings,
  years,
  selectedRating,
}: {
  ratings: Rating[];
  years: number[];
  selectedRating: Rating;
}) => {
  const data = ratings.map((rating) => {
    return [rating.year, rating.riskRating];
  });

  const averageData = years.map((year) => {
    const filteredRatings = ratings.filter((rating) => rating.year === year);
    const average =
      filteredRatings.reduce((total, rating) => total + rating.riskRating, 0) /
      filteredRatings.length;
    return [year, average];
  });

  const ref = useRef(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const margin = 50;

    const width = (svg.attr('width') as unknown as number) - margin;
    const height = (svg.attr('height') as unknown as number) - margin;
    const lineGraph = svg
      .append('g')
      // .attr('transform', `translate(${margin},${margin})`)
      .attr('width', width)
      .attr('height', height);

    let xScale = d3.scaleLinear().domain([2030, 2070]).range([0, width]);

    let yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);

    lineGraph
      .append('g')
      .attr('transform', `translate(${margin / 2},${height + margin / 2})`)
      .call(d3.axisBottom(xScale).ticks(5));

    lineGraph
      .append('g')
      .attr('transform', `translate(${margin / 2}, ${margin / 2})`)
      .call(d3.axisLeft(yScale));

    console.log(data);
    lineGraph
      .append('g')
      .selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', function (d) {
        return xScale(d[0]);
      })
      .attr('cy', function (d) {
        return yScale(d[1]);
      })
      .attr('r', 2)
      .attr('transform', `translate(${margin / 2}, ${margin / 2})`)
      .style('fill', 'black');

    console.log([selectedRating.year, selectedRating.riskRating]);
    lineGraph
      .append('g')
      .selectAll('dot')
      .data([selectedRating.year, selectedRating.riskRating])
      .enter()
      .append('circle')
      .attr('cx', function (d) {
        return xScale(selectedRating.year);
      })
      .attr('cy', function (d) {
        return yScale(selectedRating.riskRating);
      })
      .attr('r', 5)
      .attr('transform', `translate(${margin / 2}, ${margin / 2})`)
      .style('fill', 'green');

    lineGraph
      .append('g')
      .selectAll('dot')
      .data(averageData)
      .enter()
      .append('circle')
      .attr('cx', function (d) {
        return xScale(d[0]);
      })
      .attr('cy', function (d) {
        return yScale(d[1]);
      })
      .attr('r', 2)
      .attr('transform', `translate(${margin / 2}, ${margin / 2})`)
      .style('fill', 'red');

    var line = d3
      .line()
      .x(function (d) {
        return xScale(d[0]);
      })
      .y(function (d) {
        return yScale(d[1]);
      })
      .curve(d3.curveMonotoneX);

    svg
      .append('path')
      .datum(averageData)
      .attr('class', 'line')
      .attr('transform', `translate(${margin / 2}, ${margin / 2})`)
      .attr('d', line)
      .style('fill', 'none')
      .style('stroke', '#CC0000')
      .style('stroke-width', '2');
  }, [ratings]);
  return (
    <>
      <h1>Average Risk Rating Per Year</h1>
      <svg width='500' height='400' ref={ref} />
      X: Year, Y: Risk Rating, Red Line: Average Risk Rating Per Year, Green
      Dot: Selected Rating;
      <br />
      <hr />
      <br />
      <h3>
        <b>Selected Rating</b>
      </h3>
      <div>
        <b>Asset Name: </b>
        {selectedRating.assetName}
      </div>
      <div>
        <b>Location: </b>
        {`(${selectedRating.lat}, ${selectedRating.lng})`}
      </div>
      <div>
        <b>Business Category: </b>
        {selectedRating.businessCategory}
      </div>
      <div>
        <b>Risk Rating: </b>
        {selectedRating.riskRating}
      </div>
      <div>
        <b>Risk Factors: </b>
        {selectedRating.riskFactors.map((riskFactor, index) => {
          const [riskFactorName, riskRating] = riskFactor;

          return <>{`${riskFactorName}: ${riskRating}, `}</>;
        })}
      </div>
      <div>
        <b>Year: </b>
        {selectedRating.year}
      </div>
    </>
  );
};

export default MultiLineChart;
