(function () {
  var SESSION_KEY = 'siteUnlocked';
  var HASH = '80421e0021c50527f28a00a856c834752d5ce3d3071e2c02a00479301975b81b';

  if (sessionStorage.getItem(SESSION_KEY) === 'yes') return;

  document.documentElement.style.visibility = 'hidden';

  function sha256(text) {
    var data = new TextEncoder().encode(text);
    return crypto.subtle.digest('SHA-256', data).then(function (buf) {
      return Array.prototype.map
        .call(new Uint8Array(buf), function (b) {
          return b.toString(16).padStart(2, '0');
        })
        .join('');
    });
  }

  function showGate() {
    document.documentElement.style.visibility = '';

    var overlay = document.createElement('div');
    overlay.id = 'pw-gate-overlay';
    overlay.innerHTML =
      '<form id="pw-gate-form">' +
      '<label for="pw-gate-input">This site is password protected</label>' +
      '<input id="pw-gate-input" type="password" autocomplete="current-password" autofocus />' +
      '<button type="submit">Enter</button>' +
      '<p id="pw-gate-error">Incorrect password.</p>' +
      '<p id="pw-gate-hint">Need access? Request the password via email at ' +
      '<a href="mailto:jeffbessa@gmail.com">jeffbessa@gmail.com</a>.</p>' +
      '</form>';

    var style = document.createElement('style');
    style.textContent =
      '#pw-gate-overlay{position:fixed;inset:0;z-index:2147483647;background:#fff;' +
      'display:flex;align-items:center;justify-content:center;font-family:sans-serif;}' +
      '#pw-gate-form{display:flex;flex-direction:column;gap:12px;width:260px;text-align:center;}' +
      '#pw-gate-form label{font-size:15px;color:#222;}' +
      '#pw-gate-form input{padding:10px 12px;font-size:15px;border:1px solid #ccc;border-radius:6px;}' +
      '#pw-gate-hint{font-size:13px;color:#666;margin:0;}' +
      '#pw-gate-hint a{color:#111;}' +
      '#pw-gate-form button{padding:10px 12px;font-size:15px;border:none;border-radius:6px;' +
      'background:#111;color:#fff;cursor:pointer;}' +
      '#pw-gate-error{display:none;color:#c0392b;font-size:13px;margin:0;}';

    document.head.appendChild(style);
    document.body.style.overflow = 'hidden';
    document.body.appendChild(overlay);

    var form = document.getElementById('pw-gate-form');
    var input = document.getElementById('pw-gate-input');
    var error = document.getElementById('pw-gate-error');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      sha256(input.value).then(function (hash) {
        if (hash === HASH) {
          sessionStorage.setItem(SESSION_KEY, 'yes');
          document.body.style.overflow = '';
          overlay.remove();
        } else {
          error.style.display = 'block';
          input.value = '';
          input.focus();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showGate);
  } else {
    showGate();
  }
})();
