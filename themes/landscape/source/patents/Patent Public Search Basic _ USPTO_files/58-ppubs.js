// PPUBS GTM Google Analytics
// Id = $Id: 58-ppubs.js 6671 2021-11-24 11:55:50Z jgilvary $
// URL = $URL: https://dev-wbm-svn.dev.uspto.gov/repos/live/assets-content/trunk/production/common/html/js/ais/58-ppubs.js $
//
// ppubs.uspto.gov
//

// Declare dataLayer for GTM use later
var dataLayer = window.dataLayer || [];

// Send to both properties
dataLayer.push({'enableRollup': true, 'enableSiteSpecific': true});

// Set the global variable for this ais property
var ais_prop_id='UA-21265023-58';

// Set up the GTM code for the default container
// Google Tag Manager 

// Doesn't participate in DAP
var enableDAP=true;

(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5D5BBD');

// End Google Tag Manager
