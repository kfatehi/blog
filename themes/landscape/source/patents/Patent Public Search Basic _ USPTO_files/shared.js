function goToAdvancedApp(openInNewTab) {
  const hostName = window.location.hostname;

  let redirectURL = "";
  if (hostName.indexOf("localhost") >= 0) {
    redirectURL = "http://localhost:9000";
  } else {
    redirectURL = "/pubwebapp/";
  }

  if (openInNewTab) {
    window.open(redirectURL, "_blank");
  } else {
    window.location.href = redirectURL;
  }
}

function goToBasicSearchApp(openInNewTab) {
  const hostName = window.location.hostname;

  let redirectURL = "";
  if (hostName.indexOf("localhost") >= 0) {
    redirectURL = "http://localhost:9000";
  } else {
    redirectURL = "/pubwebapp";
  }

  if (openInNewTab) {
    window.open(redirectURL + "/static/pages/ppubsbasic.html", "_blank");
  } else {
    window.location.href = redirectURL + "/static/pages/ppubsbasic.html";
  }
}
//# sourceMappingURL=shared.js.map
