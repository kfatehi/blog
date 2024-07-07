
/* Google Analytics script */
const googleAnalytics = function () {
  let timer;
  const func = function () {
    if (window.jQuery !== undefined && window.jQuery !== {}) {
      if (timer) {
        clearInterval(timer);
      }

      const env = (window.environment || "").toUpperCase();
      if (env === 'AWSDEV' || env === 'AWSTEST' || env === 'AWSSTAGING') {
        var el = document.createElement('script');
        el.setAttribute('src', 'https://itw-components.etc.uspto.gov/js/ais/58-ppubs.js');
        document.body.appendChild(el);
      } else if (env === 'AWSPROD') {
        var el = document.createElement('script');
        el.setAttribute('src', 'https://components.uspto.gov/js/ais/58-ppubs.js');
        document.body.appendChild(el);
      }
    }
  };
  timer = setInterval(func, 5000);
}();
/* end Google Analytics script */
//# sourceMappingURL=googleAnalytics.js.map
