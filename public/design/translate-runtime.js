(function () {
  var LANGS = { fr: 'fr', en: 'en', es: 'es', ar: 'ar', pt: 'pt', zh: 'zh-CN' };
  var currentLang = 'fr';
  var textOriginal = new WeakMap();
  var attrOriginal = new WeakMap();
  var cache = new Map();
  var debounceTimer = null;
  var applySeq = 0;

  function getSavedLang() {
    try {
      return (localStorage.getItem('site_lang') || 'fr').split('-')[0];
    } catch (e) {
      return 'fr';
    }
  }

  function saveLang(lang) {
    try {
      localStorage.setItem('site_lang', lang);
    } catch (e) {}
  }

  function langCode(lang) {
    return LANGS[lang] || 'fr';
  }

  function isExcludedElement(el) {
    if (!el) return true;
    if (el.closest('[translate="no"], .notranslate')) return true;
    var tag = el.tagName;
    return tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'IFRAME';
  }

  function collectTextNodes() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var p = node.parentElement;
        if (!p || isExcludedElement(p)) return NodeFilter.FILTER_REJECT;
        var txt = node.nodeValue;
        if (!txt || !txt.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var out = [];
    var n;
    while ((n = walker.nextNode())) {
      if (!textOriginal.has(n)) textOriginal.set(n, n.nodeValue);
      out.push(n);
    }
    return out;
  }

  function rememberAttr(el, attr, value) {
    var store = attrOriginal.get(el);
    if (!store) {
      store = {};
      attrOriginal.set(el, store);
    }
    if (!(attr in store)) store[attr] = value;
  }

  function collectAttributes() {
    var attrs = [];
    var selectors = ['[placeholder]', '[title]', '[aria-label]', 'input[value]', 'textarea[value]'];
    var nodes = document.querySelectorAll(selectors.join(','));

    nodes.forEach(function (el) {
      if (isExcludedElement(el)) return;
      ['placeholder', 'title', 'aria-label', 'value'].forEach(function (attr) {
        if (!el.hasAttribute(attr)) return;
        if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && attr === 'value') {
          var type = (el.getAttribute('type') || '').toLowerCase();
          if (type && !['button', 'submit', 'reset'].includes(type)) return;
        }
        var val = el.getAttribute(attr);
        if (!val || !val.trim()) return;
        rememberAttr(el, attr, val);
        attrs.push({ el: el, attr: attr, original: attrOriginal.get(el)[attr] });
      });
    });

    return attrs;
  }

  async function fetchTranslate(text, target) {
    var key = target + '|' + text;
    if (cache.has(key)) return cache.get(key);

    var url =
      'https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=' +
      encodeURIComponent(target) +
      '&dt=t&q=' +
      encodeURIComponent(text);

    var attempts = 0;
    while (attempts < 3) {
      attempts += 1;
      try {
        var res = await fetch(url);
        if (!res.ok) throw new Error('translate failed');
        var data = await res.json();
        var translated = text;
        if (Array.isArray(data) && Array.isArray(data[0])) {
          translated = data[0].map(function (seg) { return (seg && seg[0]) || ''; }).join('') || text;
        }
        cache.set(key, translated);
        return translated;
      } catch (e) {
        if (attempts >= 3) {
          cache.set(key, text);
          return text;
        }
      }
    }

    return text;
  }

  async function mapWithConcurrency(items, worker, concurrency) {
    var results = new Array(items.length);
    var idx = 0;

    async function run() {
      while (idx < items.length) {
        var current = idx;
        idx += 1;
        results[current] = await worker(items[current], current);
      }
    }

    var runners = [];
    for (var i = 0; i < Math.max(1, concurrency); i++) runners.push(run());
    await Promise.all(runners);
    return results;
  }

  async function applyLanguage(lang) {
    var seq = ++applySeq;
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    var nodes = collectTextNodes();
    var attrs = collectAttributes();

    if (lang === 'fr') {
      nodes.forEach(function (n) {
        var orig = textOriginal.get(n);
        if (typeof orig === 'string') n.nodeValue = orig;
      });
      attrs.forEach(function (a) {
        a.el.setAttribute(a.attr, a.original);
      });
      return;
    }

    var target = langCode(lang);

    await mapWithConcurrency(
      nodes,
      async function (node) {
        if (seq !== applySeq) return;
        var orig = textOriginal.get(node) || node.nodeValue;
        var translated = await fetchTranslate(orig, target);
        if (seq === applySeq) node.nodeValue = translated;
      },
      6
    );

    await mapWithConcurrency(
      attrs,
      async function (item) {
        if (seq !== applySeq) return;
        var translated = await fetchTranslate(item.original, target);
        if (seq === applySeq) item.el.setAttribute(item.attr, translated);
      },
      6
    );
  }

  function markLanguageUI(lang) {
    var top = document.getElementById('topLangSelect');
    if (top && top.value !== lang) top.value = lang;

    var btns = document.querySelectorAll('.footer-lang-btn');
    btns.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  function setSiteLanguage(lang) {
    saveLang(lang);
    markLanguageUI(lang);
    applyLanguage(lang).catch(function () {});
  }

  function bindLanguageUI() {
    var top = document.getElementById('topLangSelect');
    if (top && !top.dataset.boundTranslateRuntime) {
      top.dataset.boundTranslateRuntime = '1';
      top.addEventListener('change', function (e) {
        setSiteLanguage(e.target.value);
      });
    }

    var btns = document.querySelectorAll('.footer-lang-btn');
    btns.forEach(function (btn) {
      if (btn.dataset.boundTranslateRuntime) return;
      btn.dataset.boundTranslateRuntime = '1';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        setSiteLanguage(btn.getAttribute('data-lang') || 'fr');
      });
    });
  }

  function scheduleRefresh() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      bindLanguageUI();
      applyLanguage(currentLang).catch(function () {});
    }, 250);
  }

  window.setSiteLanguage = setSiteLanguage;

  document.addEventListener('DOMContentLoaded', function () {
    bindLanguageUI();

    var lang = getSavedLang();
    markLanguageUI(lang);
    applyLanguage(lang).catch(function () {});

    if (window.MutationObserver) {
      var obs = new MutationObserver(function () {
        scheduleRefresh();
      });
      obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    window.addEventListener('storage', function (e) {
      if (e.key === 'site_lang') {
        var l = getSavedLang();
        markLanguageUI(l);
        applyLanguage(l).catch(function () {});
      }
    });

    setInterval(bindLanguageUI, 1200);
  });
})();
