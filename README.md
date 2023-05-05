## Risk Thinking UI/UX Developer Take Home Project

Here's my processes on working on this project

### Problem 1: Implement a Map with Location Markers and Risk Indicators

Objective: Create an interactive map that displays the geographic locations from the provided dataset and highlights the relative risk levels using color-coded markers.

**Objective**: Create an interactive map that displays the geographic locations from the provided dataset and highlights the relative risk levels using color-coded markers.

### Tasks:

1. :white_check_mark: Set up a Next.js boilerplate app with the following command under Node v16 environment

   ```shell
   yarn create next-app risk-viz --ts --tailwind --eslint --src-dir --import-alias "@/*" --experimental-app
   ```

   _or_

   ```shell
   npx create-next-app@latest risk-viz --ts --tailwind --eslint --src-dir --import-alias "@/*" --experimental-app
   ```

2. :white_check_mark: Load and parse the sample datasets.

Package used: https://www.npmjs.com/package/react-papaparse

3. :white_check_mark: Integrate a mapping library (e.g., Mapbox, Leaflet, Google Maps).

Package used: https://react-leaflet.js.org/
Reference for styling: https://leaflet-extras.github.io/leaflet-providers/preview/

Note: Initially used Google Maps but having errors with InfoWindow

4. :white_check_mark: Implement a control for users to select different decades.

Used a `<select/>` input

5. :white_check_mark: Display the locations (Lat, Long) from the dataset as markers on the map of a given decade year.

Used `<Marker/>` component from Leaflet

6. :white_check_mark: Color-code the markers based on their Risk Rating (climate risk score) derived from the dataset.

Library used: https://gka.github.io/chroma.js/#installation

7. :white_check_mark: Add interactivity to the map, such as zooming and panning, and display a tooltip with the Asset Name and Business Category on marker hover.

Used `<Tooltip/>` from Leaflet

## Problem 2: Create a Data Table with Sorting and Filtering Capabilities

**Objective**: Display the climate risk data in a table format, allowing users to sort and filter the dataset.

### Tasks:

1. :white_check_mark: Create a data table component.

Packages used: https://www.npmjs.com/package/react-papaparse

2. :white_check_mark: Load and display the sample dataset with a given year selection (from Problem 1) in the table.

Used the select component from Problem 1

3. :white_check_mark: Implement sorting functionality on reasonable columns.

Guide used: https://www.smashingmagazine.com/2020/03/sortable-tables-react/

4. :white_check_mark: Implement filter functionality on reasonable columns, especially risk factors.

Packages used: https://www.npmjs.com/package/multiselect-react-dropdown

## Problem 3: Visualize Risk Over Time with Line Graphs

**Objective**: Create a line graph to visualize the changes in risk levels over time for a given location, Asset or Business Category.

### Tasks:

1. :white_check_mark: Set up a charting library (e.g., Chart.js, D3.js, Highcharts).

Used D3.js: https://d3js.org/

2. :white_check_mark: Implement a line graph component that displays the Risk Rating over time (Year) for a selected location (Lat, Long), Asset, or Business Category.

I initally have a line chart with lines but due to time constraint and TypeErrors when deploying, I had to comment out the line part. My chart still has the necessary plots, just without the line.

3. :x: Add interactivity to the graph, such as tooltips displaying Asset Name, Risk Rating, Risk Factors, and Year.

Due to time constraint, I did not have time to complete this section

4. :white_check_mark: Implement controls for selecting different locations, Assets, or Business Categories to visualize their risk levels over time.
   - You may need to perform some data aggregation in order to achieve this.

## Problem 4: Integrate Components and Optimize Performance

**Objective**: Combine the components from the previous problems into a cohesive web app, ensuring optimal performance and user experience.

### Tasks:

1. :white_check_mark: Design a user interface that integrates the map, data table, and line graph components.

See website

2. :white_check_mark: Implement state management to handle user interactions and data flow between components (e.g., selecting a location on the map updates the line graph and data table).

3. :x: Optimize the app's performance by implementing lazy loading for components and efficient data handling, such as pagination for the data table.
4. :x: (Bonus) Implement reasonable tests for utility functions, data flow hooks, and React components.

**Note**: Due to time constraint, this work was not my best. Regardless of that, it was still fun! :D. Open to feedbacks.

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

[http://localhost:3000/api/hello](http://localhost:3000/api/hello) is an endpoint that uses [Route Handlers](https://beta.nextjs.org/docs/routing/route-handlers). This endpoint can be edited in `app/api/hello/route.ts`.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
