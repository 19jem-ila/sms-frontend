import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from "react-redux";
import {store} from "./store/store.js"
import App from './App'
import "./index.css"

import favicon from "./assets/sms-fav-con.png"
const setFavicon = (iconPath, sizes = '100x100') => {
  try {
    // Remove existing favicons
    const existingFavicons = document.querySelectorAll("link[rel*='icon']");
    existingFavicons.forEach(link => link.remove());

    // Create new favicon link
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.sizes = sizes;
    link.href = iconPath;
    
    // Add error handling
    link.onerror = () => {
      console.warn('Favicon failed to load, using default');
      // You could set a default favicon here
    };
    
    document.head.appendChild(link);
    console.log(`Favicon set with size: ${sizes}`);
  } catch (error) {
    console.error('Error setting favicon:', error);
  }
};

// Set your favicon with desired size
setFavicon(favicon, '100x100'); // Change to '16x16' for smaller size

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   
      <BrowserRouter>
       <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
   
  </React.StrictMode>
)