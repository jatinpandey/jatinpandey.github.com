// Google Analytics 4 loader.
// Paste your Measurement ID from the GA dashboard below (looks like G-XXXXXXXXXX).
// Until a real ID is set, this file does nothing — no requests, no tracking.
(function () {
  var GA_MEASUREMENT_ID = 'G-6GMD2P2ZLJ';

  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.indexOf('XXXX') !== -1) {
    return;
  }

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
})();
