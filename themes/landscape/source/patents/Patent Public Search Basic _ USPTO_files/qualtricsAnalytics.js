
/*BEGIN QUALTRICS WEBSITE FEEDBACK SNIPPET*/
const qualtricsAnalytics = function () {
  // if environment is LOCAL or undefined, do nothing
  const env = (window.environment || '').toUpperCase();
  if ('LOCAL' === env || '' === env) {
    return;
  }

  const div = document.createElement('div');
  const comment = document.createComment('DO NOT REMOVE-CONTENTS PLACED HERE');
  const tkn = 'ZN_eVW77vrSLSsx6qG';
  const url = 'https://znevw77vrslssx6qg-uspto.gov1.siteintercept.qualtrics.com/SIE/?Q_ZID=' + tkn;

  div.setAttribute('id', tkn);
  div.appendChild(comment);
  document.body.append(div);

  const analytics = function (length, char, id, url) {
    this.get = function (a) {for (var a = a + "=", c = document.cookie.split(";"), b = 0, e = c.length; b < e; b++) {for (var d = c[b]; " " == d.charAt(0);) d = d.substring(1, d.length);if (0 == d.indexOf(a)) return d.substring(a.length, d.length);}return null;};
    this.set = function (a, c) {var b = "",b = new Date();b.setTime(b.getTime() + 6048E5);b = "; expires=" + b.toGMTString();document.cookie = a + "=" + c + b + "; path=/; ";};
    this.check = function () {var a = this.get(id);if (a) a = a.split(":");else if (100 != length) "v" == char && (length = Math.random() >= length / 100 ? 0 : 100), a = [char, length, 0], this.set(id, a.join(":"));else return !0;var c = a[1];if (100 == c) return !0;switch (a[0]) {case "v":return !1;case "r":return c = a[2] % Math.floor(100 / c), a[2]++, this.set(id, a.join(":")), !c;}return !0;};
    this.go = function () {if (this.check()) {var a = document.createElement("script");a.type = "text/javascript";a.src = url;document.body && document.body.appendChild(a);}};
    this.start = function () {var t = this;"complete" !== document.readyState ? window.addEventListener ? window.addEventListener("load", function () {t.go();}, !1) : window.attachEvent && window.attachEvent("onload", function () {t.go();}) : t.go();};
  };
  try {
    new analytics(100, "r", "QSI_S_" + tkn, url).start();
  } catch (i) {}
}();
/*<!--END WEBSITE FEEDBACK SNIPPET-->*/
//# sourceMappingURL=qualtricsAnalytics.js.map
