import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add global styles for fonts
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --font-headline: 'Playfair Display', serif;
    --font-body: 'Source Sans Pro', sans-serif;
    --font-ui: 'Montserrat', sans-serif;
  }

  body {
    font-family: var(--font-body);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-headline);
  }

  button, .font-ui, .font-medium, .font-semibold, .font-bold {
    font-family: var(--font-ui);
  }

  @keyframes tickerAnimation {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`;

createRoot(document.getElementById("root")!).render(
  <>
    <GlobalStyle />
    <App />
  </>
);
