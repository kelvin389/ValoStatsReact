port of my ValoStats app to Typescript using Express/React

Tech
---

Client:
- React
- Vite
- Tailwind

Server:
- Express

Usage
---
1. Enter root directory
2. create `.env` file with contents
```
API_KEY=your-api-key-here
PORT=some-port              (optional)
````
3. install dependencies:
```
npm run install-all
```

4. run:
```
npm run dev
```

alternatively, execute `npm run client` or `npm run server` to only run a specific half of the project

by default, the app is hosted at http://localhost:5173 and the api is hosted at http://localhost:5000/api/...
