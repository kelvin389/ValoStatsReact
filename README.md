Port and more(?) complete version of my ValoStats app to Typescript using Express/React using [HenrikDev Unofficial Valorant API](https://github.com/Henrik-3/unofficial-valorant-api).

Simple app made for fun to view Valorant statistics, extensible to view any statistic that can be calculated using the data provided by the Valorant API. Eg. RWF, RLF, Eco frags are stats that are not available to view on sites like Tracker Network

Only tested running in dev mode, little to no error handling exists. Deathmatch and other gamemodes probably dont work either

## Tech

Client:

- React
  - [react-tooltip Component](https://www.npmjs.com/package/react-tooltip)
  - [Tanstack react-table Component](https://www.npmjs.com/package/@tanstack/react-table)
- Vite
- Tailwind
- [heatmap-ts](https://www.npmjs.com/package/heatmap-ts) which is a typescript translation of [heatmapjs](https://www.npmjs.com/package/heatmapjs)

Server:

- Express

Python scripts used for lazy method of updating data from [valorant-api.com](https://valorant-api.com/)

## Usage

1. Obtain api key ([HenrikDev Unofficial Valorant API](https://github.com/Henrik-3/unofficial-valorant-api) for more details)
1. Enter root directory. create `.env` file with contents
   ```
   API_KEY=your-api-key-here
   PORT=some-port              (optional)
   ```
1. install dependencies for client and server:

   ```
   npm run install-all
   ```

1. run:

   ```
   npm run dev
   ```

   alternatively, execute `npm run client` or `npm run server` to only run a specific component of the project

by default, the app is hosted at http://localhost:5173 and the api is hosted at http://localhost:5000/api/...

## Demo

Other peoples names censored for privacy

### Main search:

![demo gif 1](./demogifs/demo1.gif)

### Overlay Table and sorting

![demo gif 2](./demogifs/demo2.gif)

### Responsive Design

![demo gif 3](./demogifs/demo3.gif)
![demo gif 4](./demogifs/demo4.gif)
