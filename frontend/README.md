# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Tailwind CSS

This frontend uses **Tailwind CSS v3** with PostCSS (compatible with Create React App 5, no eject required).

### Project files

| File | Purpose |
|------|---------|
| `tailwind.config.js` | Tailwind settings; **`content`** must include `./src/**/*.{js,jsx,ts,tsx}` so unused classes are purged in production. |
| `postcss.config.js` | Registers `tailwindcss` and `autoprefixer` for the CRA webpack pipeline. |
| `src/index.css` | Contains `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;` and optional `@layer base` overrides. |
| `src/index.js` | Imports `./index.css` so Tailwind runs for the whole app. |

### Using Tailwind in JSX

Put utility classes on `className`. Combine them with template literals or a helper when needed:

```jsx
<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
  <h2 className="text-lg font-semibold text-slate-900">Title</h2>
</div>
```

- **Responsive**: prefix utilities with `sm:`, `md:`, etc. (e.g. `sm:grid-cols-2`).
- **States**: `hover:`, `focus:`, `disabled:`, etc.
- **Customization**: edit `theme.extend` in `tailwind.config.js` for design tokens, or add `@layer components { ... }` in `index.css` for repeated patterns.

Official reference: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

### Install / upgrade

From this folder:

```bash
npm install
```

Tailwind-related packages are under `devDependencies` in `package.json`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
