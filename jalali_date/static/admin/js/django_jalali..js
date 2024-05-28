function mod(e, t) {
  return e - t * Math.floor(e / t);
}
function leap_gregorian(e) {
  return e % 4 == 0 && !(e % 100 == 0 && e % 400 != 0);
}
function gregorian_to_jd(e, t, n) {
  return (
    GREGORIAN_EPOCH -
    1 +
    365 * (e - 1) +
    Math.floor((e - 1) / 4) +
    -Math.floor((e - 1) / 100) +
    Math.floor((e - 1) / 400) +
    Math.floor(
      (367 * t - 362) / 12 + (t <= 2 ? 0 : leap_gregorian(e) ? -1 : -2) + n
    )
  );
}
function jd_to_gregorian(e) {
  var t, n, i, r, a, s, o, l, u, c, d, p;
  return (
    (t = Math.floor(e - 0.5) + 0.5),
    (n = t - GREGORIAN_EPOCH),
    (i = Math.floor(n / 146097)),
    (r = mod(n, 146097)),
    (a = Math.floor(r / 36524)),
    (s = mod(r, 36524)),
    (o = Math.floor(s / 1461)),
    (l = mod(s, 1461)),
    (u = Math.floor(l / 365)),
    (c = 400 * i + 100 * a + 4 * o + u),
    4 != a && 4 != u && c++,
    (d = t - gregorian_to_jd(c, 1, 1)),
    (p = t < gregorian_to_jd(c, 3, 1) ? 0 : leap_gregorian(c) ? 1 : 2),
    (month = Math.floor((12 * (d + p) + 373) / 367)),
    (day = t - gregorian_to_jd(c, month, 1) + 1),
    new Array(c, month, day)
  );
}
function leap_islamic(e) {
  return (11 * e + 14) % 30 < 11;
}
function islamic_to_jd(e, t, n) {
  return (
    n +
    Math.ceil(29.5 * (t - 1)) +
    354 * (e - 1) +
    Math.floor((3 + 11 * e) / 30) +
    ISLAMIC_EPOCH -
    1
  );
}
function jd_to_islamic(e) {
  var t, n, i;
  return (
    (e = Math.floor(e) + 0.5),
    (t = Math.floor((30 * (e - ISLAMIC_EPOCH) + 10646) / 10631)),
    (n = Math.min(
      12,
      Math.ceil((e - (29 + islamic_to_jd(t, 1, 1))) / 29.5) + 1
    )),
    (i = e - islamic_to_jd(t, n, 1) + 1),
    new Array(t, n, i)
  );
}
function leap_persian(e) {
  return (682 * (((e - (e > 0 ? 474 : 473)) % 2820) + 474 + 38)) % 2816 < 682;
}
function persian_to_jd(e, t, n) {
  var i, r;
  return (
    (i = e - (e >= 0 ? 474 : 473)),
    (r = 474 + mod(i, 2820)),
    n +
      (t <= 7 ? 31 * (t - 1) : 30 * (t - 1) + 6) +
      Math.floor((682 * r - 110) / 2816) +
      365 * (r - 1) +
      1029983 * Math.floor(i / 2820) +
      (PERSIAN_EPOCH - 1)
  );
}
function jd_to_persian(e) {
  var t, n, i, r, a, s, o, l, u, c;
  return (
    (e = Math.floor(e) + 0.5),
    (r = e - persian_to_jd(475, 1, 1)),
    (a = Math.floor(r / 1029983)),
    (s = mod(r, 1029983)),
    1029982 == s
      ? (o = 2820)
      : ((l = Math.floor(s / 366)),
        (u = mod(s, 366)),
        (o = Math.floor((2134 * l + 2816 * u + 2815) / 1028522) + l + 1)),
    (t = o + 2820 * a + 474) <= 0 && t--,
    (c = e - persian_to_jd(t, 1, 1) + 1),
    (n = c <= 186 ? Math.ceil(c / 31) : Math.ceil((c - 6) / 30)),
    (i = e - persian_to_jd(t, n, 1) + 1),
    new Array(t, n, i)
  );
}
function JalaliDate(e, t, n) {
  function i(e) {
    var t = 0;
    e[1] < 0 && ((t = leap_persian(e[0] - 1) ? 30 : 29), e[1]++);
    var n = jd_to_gregorian(persian_to_jd(e[0], e[1] + 1, e[2]) - t);
    return n[1]--, n;
  }
  function r(e) {
    var t = jd_to_persian(gregorian_to_jd(e[0], e[1] + 1, e[2]));
    return t[1]--, t;
  }
  function a(e) {
    return (
      e && e.getGregorianDate && (e = e.getGregorianDate()),
      (s = new Date(e)).setHours(s.getHours() > 12 ? s.getHours() + 2 : 0),
      (s && "Invalid Date" != s && !isNaN(s || !s.getDate())) ||
        (s = new Date()),
      (o = r([s.getFullYear(), s.getMonth(), s.getDate()])),
      this
    );
  }
  var s, o;
  if (isNaN(parseInt(e)) || isNaN(parseInt(t)) || isNaN(parseInt(n))) a(e);
  else {
    var l = i([parseInt(e, 10), parseInt(t, 10), parseInt(n, 10)]);
    a(new Date(l[0], l[1], l[2]));
  }
  (this.getGregorianDate = function () {
    return s;
  }),
    (this.setFullDate = a),
    (this.setMonth = function (e) {
      o[1] = e;
      var t = i(o);
      (s = new Date(t[0], t[1], t[2])), (o = r([t[0], t[1], t[2]]));
    }),
    (this.setDate = function (e) {
      o[2] = e;
      var t = i(o);
      (s = new Date(t[0], t[1], t[2])), (o = r([t[0], t[1], t[2]]));
    }),
    (this.getFullYear = function () {
      return o[0];
    }),
    (this.getMonth = function () {
      return o[1];
    }),
    (this.getDate = function () {
      return o[2];
    }),
    (this.toString = function () {
      return o.join(",").toString();
    }),
    (this.getDay = function () {
      return s.getDay();
    }),
    (this.getHours = function () {
      return s.getHours();
    }),
    (this.getMinutes = function () {
      return s.getMinutes();
    }),
    (this.getSeconds = function () {
      return s.getSeconds();
    }),
    (this.getTime = function () {
      return s.getTime();
    }),
    (this.getTimeZoneOffset = function () {
      return s.getTimeZoneOffset();
    }),
    (this.getYear = function () {
      return o[0] % 100;
    }),
    (this.setHours = function (e) {
      s.setHours(e);
    }),
    (this.setMinutes = function (e) {
      s.setMinutes(e);
    }),
    (this.setSeconds = function (e) {
      s.setSeconds(e);
    }),
    (this.setMilliseconds = function (e) {
      s.setMilliseconds(e);
    });
}
!(function (e, t) {
  function n(e) {
    var t = e.length,
      n = ue.type(e);
    return (
      !ue.isWindow(e) &&
      (!(1 !== e.nodeType || !t) ||
        "array" === n ||
        ("function" !== n &&
          (0 === t || ("number" == typeof t && t > 0 && t - 1 in e))))
    );
  }
  function i(e) {
    var t = (we[e] = {});
    return (
      ue.each(e.match(de) || [], function (e, n) {
        t[n] = !0;
      }),
      t
    );
  }
  function r(e, n, i, r) {
    if (ue.acceptData(e)) {
      var a,
        s,
        o = ue.expando,
        l = e.nodeType,
        u = l ? ue.cache : e,
        c = l ? e[o] : e[o] && o;
      if ((c && u[c] && (r || u[c].data)) || i !== t || "string" != typeof n)
        return (
          c || (c = l ? (e[o] = ee.pop() || ue.guid++) : o),
          u[c] || (u[c] = l ? {} : { toJSON: ue.noop }),
          ("object" == typeof n || "function" == typeof n) &&
            (r
              ? (u[c] = ue.extend(u[c], n))
              : (u[c].data = ue.extend(u[c].data, n))),
          (s = u[c]),
          r || (s.data || (s.data = {}), (s = s.data)),
          i !== t && (s[ue.camelCase(n)] = i),
          "string" == typeof n
            ? null == (a = s[n]) && (a = s[ue.camelCase(n)])
            : (a = s),
          a
        );
    }
  }
  function a(e, t, n) {
    if (ue.acceptData(e)) {
      var i,
        r,
        a = e.nodeType,
        s = a ? ue.cache : e,
        l = a ? e[ue.expando] : ue.expando;
      if (s[l]) {
        if (t && (i = n ? s[l] : s[l].data)) {
          ue.isArray(t)
            ? (t = t.concat(ue.map(t, ue.camelCase)))
            : t in i
            ? (t = [t])
            : ((t = ue.camelCase(t)), (t = t in i ? [t] : t.split(" "))),
            (r = t.length);
          for (; r--; ) delete i[t[r]];
          if (n ? !o(i) : !ue.isEmptyObject(i)) return;
        }
        (n || (delete s[l].data, o(s[l]))) &&
          (a
            ? ue.cleanData([e], !0)
            : ue.support.deleteExpando || s != s.window
            ? delete s[l]
            : (s[l] = null));
      }
    }
  }
  function s(e, n, i) {
    if (i === t && 1 === e.nodeType) {
      var r = "data-" + n.replace(Te, "-$1").toLowerCase();
      if ("string" == typeof (i = e.getAttribute(r))) {
        try {
          i =
            "true" === i ||
            ("false" !== i &&
              ("null" === i
                ? null
                : +i + "" === i
                ? +i
                : Ce.test(i)
                ? ue.parseJSON(i)
                : i));
        } catch (e) {}
        ue.data(e, n, i);
      } else i = t;
    }
    return i;
  }
  function o(e) {
    var t;
    for (t in e)
      if (("data" !== t || !ue.isEmptyObject(e[t])) && "toJSON" !== t)
        return !1;
    return !0;
  }
  function l() {
    return !0;
  }
  function u() {
    return !1;
  }
  function c() {
    try {
      return G.activeElement;
    } catch (e) {}
  }
  function d(e, t) {
    do {
      e = e[t];
    } while (e && 1 !== e.nodeType);
    return e;
  }
  function p(e, t, n) {
    if (ue.isFunction(t))
      return ue.grep(e, function (e, i) {
        return !!t.call(e, i, e) !== n;
      });
    if (t.nodeType)
      return ue.grep(e, function (e) {
        return (e === t) !== n;
      });
    if ("string" == typeof t) {
      if (Ye.test(t)) return ue.filter(t, e, n);
      t = ue.filter(t, e);
    }
    return ue.grep(e, function (e) {
      return ue.inArray(e, t) >= 0 !== n;
    });
  }
  function h(e) {
    var t = ze.split("|"),
      n = e.createDocumentFragment();
    if (n.createElement) for (; t.length; ) n.createElement(t.pop());
    return n;
  }
  function f(e, t) {
    return ue.nodeName(e, "table") &&
      ue.nodeName(1 === t.nodeType ? t : t.firstChild, "tr")
      ? e.getElementsByTagName("tbody")[0] ||
          e.appendChild(e.ownerDocument.createElement("tbody"))
      : e;
  }
  function g(e) {
    return (e.type = (null !== ue.find.attr(e, "type")) + "/" + e.type), e;
  }
  function m(e) {
    var t = it.exec(e.type);
    return t ? (e.type = t[1]) : e.removeAttribute("type"), e;
  }
  function y(e, t) {
    for (var n, i = 0; null != (n = e[i]); i++)
      ue._data(n, "globalEval", !t || ue._data(t[i], "globalEval"));
  }
  function v(e, t) {
    if (1 === t.nodeType && ue.hasData(e)) {
      var n,
        i,
        r,
        a = ue._data(e),
        s = ue._data(t, a),
        o = a.events;
      if (o) {
        delete s.handle, (s.events = {});
        for (n in o)
          for (i = 0, r = o[n].length; r > i; i++) ue.event.add(t, n, o[n][i]);
      }
      s.data && (s.data = ue.extend({}, s.data));
    }
  }
  function b(e, t) {
    var n, i, r;
    if (1 === t.nodeType) {
      if (
        ((n = t.nodeName.toLowerCase()),
        !ue.support.noCloneEvent && t[ue.expando])
      ) {
        r = ue._data(t);
        for (i in r.events) ue.removeEvent(t, i, r.handle);
        t.removeAttribute(ue.expando);
      }
      "script" === n && t.text !== e.text
        ? ((g(t).text = e.text), m(t))
        : "object" === n
        ? (t.parentNode && (t.outerHTML = e.outerHTML),
          ue.support.html5Clone &&
            e.innerHTML &&
            !ue.trim(t.innerHTML) &&
            (t.innerHTML = e.innerHTML))
        : "input" === n && et.test(e.type)
        ? ((t.defaultChecked = t.checked = e.checked),
          t.value !== e.value && (t.value = e.value))
        : "option" === n
        ? (t.defaultSelected = t.selected = e.defaultSelected)
        : ("input" === n || "textarea" === n) &&
          (t.defaultValue = e.defaultValue);
    }
  }
  function _(e, n) {
    var i,
      r,
      a = 0,
      s =
        typeof e.getElementsByTagName !== U
          ? e.getElementsByTagName(n || "*")
          : typeof e.querySelectorAll !== U
          ? e.querySelectorAll(n || "*")
          : t;
    if (!s)
      for (s = [], i = e.childNodes || e; null != (r = i[a]); a++)
        !n || ue.nodeName(r, n) ? s.push(r) : ue.merge(s, _(r, n));
    return n === t || (n && ue.nodeName(e, n)) ? ue.merge([e], s) : s;
  }
  function x(e) {
    et.test(e.type) && (e.defaultChecked = e.checked);
  }
  function k(e, t) {
    if (t in e) return t;
    for (
      var n = t.charAt(0).toUpperCase() + t.slice(1), i = t, r = kt.length;
      r--;

    )
      if ((t = kt[r] + n) in e) return t;
    return i;
  }
  function D(e, t) {
    return (
      (e = t || e),
      "none" === ue.css(e, "display") || !ue.contains(e.ownerDocument, e)
    );
  }
  function w(e, t) {
    for (var n, i, r, a = [], s = 0, o = e.length; o > s; s++)
      (i = e[s]).style &&
        ((a[s] = ue._data(i, "olddisplay")),
        (n = i.style.display),
        t
          ? (a[s] || "none" !== n || (i.style.display = ""),
            "" === i.style.display &&
              D(i) &&
              (a[s] = ue._data(i, "olddisplay", M(i.nodeName))))
          : a[s] ||
            ((r = D(i)),
            ((n && "none" !== n) || !r) &&
              ue._data(i, "olddisplay", r ? n : ue.css(i, "display"))));
    for (s = 0; o > s; s++)
      (i = e[s]).style &&
        ((t && "none" !== i.style.display && "" !== i.style.display) ||
          (i.style.display = t ? a[s] || "" : "none"));
    return e;
  }
  function C(e, t, n) {
    var i = gt.exec(t);
    return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || "px") : t;
  }
  function T(e, t, n, i, r) {
    for (
      var a = n === (i ? "border" : "content") ? 4 : "width" === t ? 1 : 0,
        s = 0;
      4 > a;
      a += 2
    )
      "margin" === n && (s += ue.css(e, n + xt[a], !0, r)),
        i
          ? ("content" === n && (s -= ue.css(e, "padding" + xt[a], !0, r)),
            "margin" !== n &&
              (s -= ue.css(e, "border" + xt[a] + "Width", !0, r)))
          : ((s += ue.css(e, "padding" + xt[a], !0, r)),
            "padding" !== n &&
              (s += ue.css(e, "border" + xt[a] + "Width", !0, r)));
    return s;
  }
  function N(e, t, n) {
    var i = !0,
      r = "width" === t ? e.offsetWidth : e.offsetHeight,
      a = lt(e),
      s =
        ue.support.boxSizing && "border-box" === ue.css(e, "boxSizing", !1, a);
    if (0 >= r || null == r) {
      if (
        ((0 > (r = ut(e, t, a)) || null == r) && (r = e.style[t]), mt.test(r))
      )
        return r;
      (i = s && (ue.support.boxSizingReliable || r === e.style[t])),
        (r = parseFloat(r) || 0);
    }
    return r + T(e, t, n || (s ? "border" : "content"), i, a) + "px";
  }
  function M(e) {
    var t = G,
      n = vt[e];
    return (
      n ||
        (("none" !== (n = S(e, t)) && n) ||
          ((ot = (
            ot ||
            ue("<iframe frameborder='0' width='0' height='0'/>").css(
              "cssText",
              "display:block !important"
            )
          ).appendTo(t.documentElement)),
          (t = (ot[0].contentWindow || ot[0].contentDocument).document).write(
            "<!doctype html><html><body>"
          ),
          t.close(),
          (n = S(e, t)),
          ot.detach()),
        (vt[e] = n)),
      n
    );
  }
  function S(e, t) {
    var n = ue(t.createElement(e)).appendTo(t.body),
      i = ue.css(n[0], "display");
    return n.remove(), i;
  }
  function $(e, t, n, i) {
    var r;
    if (ue.isArray(t))
      ue.each(t, function (t, r) {
        n || wt.test(e)
          ? i(e, r)
          : $(e + "[" + ("object" == typeof r ? t : "") + "]", r, n, i);
      });
    else if (n || "object" !== ue.type(t)) i(e, t);
    else for (r in t) $(e + "[" + r + "]", t[r], n, i);
  }
  function A(e) {
    return function (t, n) {
      "string" != typeof t && ((n = t), (t = "*"));
      var i,
        r = 0,
        a = t.toLowerCase().match(de) || [];
      if (ue.isFunction(n))
        for (; (i = a[r++]); )
          "+" === i[0]
            ? ((i = i.slice(1) || "*"), (e[i] = e[i] || []).unshift(n))
            : (e[i] = e[i] || []).push(n);
    };
  }
  function E(e, n, i, r) {
    function a(l) {
      var u;
      return (
        (s[l] = !0),
        ue.each(e[l] || [], function (e, l) {
          var c = l(n, i, r);
          return "string" != typeof c || o || s[c]
            ? o
              ? !(u = c)
              : t
            : (n.dataTypes.unshift(c), a(c), !1);
        }),
        u
      );
    }
    var s = {},
      o = e === Yt;
    return a(n.dataTypes[0]) || (!s["*"] && a("*"));
  }
  function j(e, n) {
    var i,
      r,
      a = ue.ajaxSettings.flatOptions || {};
    for (r in n) n[r] !== t && ((a[r] ? e : i || (i = {}))[r] = n[r]);
    return i && ue.extend(!0, e, i), e;
  }
  function I(e, n, i) {
    for (var r, a, s, o, l = e.contents, u = e.dataTypes; "*" === u[0]; )
      u.shift(),
        a === t && (a = e.mimeType || n.getResponseHeader("Content-Type"));
    if (a)
      for (o in l)
        if (l[o] && l[o].test(a)) {
          u.unshift(o);
          break;
        }
    if (u[0] in i) s = u[0];
    else {
      for (o in i) {
        if (!u[0] || e.converters[o + " " + u[0]]) {
          s = o;
          break;
        }
        r || (r = o);
      }
      s = s || r;
    }
    return s ? (s !== u[0] && u.unshift(s), i[s]) : t;
  }
  function F(e, t, n, i) {
    var r,
      a,
      s,
      o,
      l,
      u = {},
      c = e.dataTypes.slice();
    if (c[1]) for (s in e.converters) u[s.toLowerCase()] = e.converters[s];
    for (a = c.shift(); a; )
      if (
        (e.responseFields[a] && (n[e.responseFields[a]] = t),
        !l && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
        (l = a),
        (a = c.shift()))
      )
        if ("*" === a) a = l;
        else if ("*" !== l && l !== a) {
          if (!(s = u[l + " " + a] || u["* " + a]))
            for (r in u)
              if (
                (o = r.split(" "))[1] === a &&
                (s = u[l + " " + o[0]] || u["* " + o[0]])
              ) {
                !0 === s
                  ? (s = u[r])
                  : !0 !== u[r] && ((a = o[0]), c.unshift(o[1]));
                break;
              }
          if (!0 !== s)
            if (s && e.throws) t = s(t);
            else
              try {
                t = s(t);
              } catch (e) {
                return {
                  state: "parsererror",
                  error: s ? e : "No conversion from " + l + " to " + a,
                };
              }
        }
    return { state: "success", data: t };
  }
  function L() {
    try {
      return new e.XMLHttpRequest();
    } catch (e) {}
  }
  function H() {
    try {
      return new e.ActiveXObject("Microsoft.XMLHTTP");
    } catch (e) {}
  }
  function O() {
    return (
      setTimeout(function () {
        Gt = t;
      }),
      (Gt = ue.now())
    );
  }
  function P(e, t, n) {
    for (
      var i, r = (tn[t] || []).concat(tn["*"]), a = 0, s = r.length;
      s > a;
      a++
    )
      if ((i = r[a].call(n, t, e))) return i;
  }
  function R(e, t, n) {
    var i,
      r,
      a = 0,
      s = en.length,
      o = ue.Deferred().always(function () {
        delete l.elem;
      }),
      l = function () {
        if (r) return !1;
        for (
          var t = Gt || O(),
            n = Math.max(0, u.startTime + u.duration - t),
            i = 1 - (n / u.duration || 0),
            a = 0,
            s = u.tweens.length;
          s > a;
          a++
        )
          u.tweens[a].run(i);
        return (
          o.notifyWith(e, [u, i, n]),
          1 > i && s ? n : (o.resolveWith(e, [u]), !1)
        );
      },
      u = o.promise({
        elem: e,
        props: ue.extend({}, t),
        opts: ue.extend(!0, { specialEasing: {} }, n),
        originalProperties: t,
        originalOptions: n,
        startTime: Gt || O(),
        duration: n.duration,
        tweens: [],
        createTween: function (t, n) {
          var i = ue.Tween(
            e,
            u.opts,
            t,
            n,
            u.opts.specialEasing[t] || u.opts.easing
          );
          return u.tweens.push(i), i;
        },
        stop: function (t) {
          var n = 0,
            i = t ? u.tweens.length : 0;
          if (r) return this;
          for (r = !0; i > n; n++) u.tweens[n].run(1);
          return t ? o.resolveWith(e, [u, t]) : o.rejectWith(e, [u, t]), this;
        },
      }),
      c = u.props;
    for (Y(c, u.opts.specialEasing); s > a; a++)
      if ((i = en[a].call(u, e, c, u.opts))) return i;
    return (
      ue.map(c, P, u),
      ue.isFunction(u.opts.start) && u.opts.start.call(e, u),
      ue.fx.timer(ue.extend(l, { elem: e, anim: u, queue: u.opts.queue })),
      u
        .progress(u.opts.progress)
        .done(u.opts.done, u.opts.complete)
        .fail(u.opts.fail)
        .always(u.opts.always)
    );
  }
  function Y(e, t) {
    var n, i, r, a, s;
    for (n in e)
      if (
        ((i = ue.camelCase(n)),
        (r = t[i]),
        (a = e[n]),
        ue.isArray(a) && ((r = a[1]), (a = e[n] = a[0])),
        n !== i && ((e[i] = a), delete e[n]),
        (s = ue.cssHooks[i]) && "expand" in s)
      ) {
        (a = s.expand(a)), delete e[i];
        for (n in a) n in e || ((e[n] = a[n]), (t[n] = r));
      } else t[i] = r;
  }
  function q(e, t, n, i, r) {
    return new q.prototype.init(e, t, n, i, r);
  }
  function W(e, t) {
    var n,
      i = { height: e },
      r = 0;
    for (t = t ? 1 : 0; 4 > r; r += 2 - t)
      (n = xt[r]), (i["margin" + n] = i["padding" + n] = e);
    return t && (i.opacity = i.width = e), i;
  }
  function B(e) {
    return ue.isWindow(e)
      ? e
      : 9 === e.nodeType && (e.defaultView || e.parentWindow);
  }
  var z,
    K,
    U = typeof t,
    X = e.location,
    G = e.document,
    V = G.documentElement,
    J = e.jQuery,
    Q = e.$,
    Z = {},
    ee = [],
    te = "1.10.2",
    ne = ee.concat,
    ie = ee.push,
    re = ee.slice,
    ae = ee.indexOf,
    se = Z.toString,
    oe = Z.hasOwnProperty,
    le = te.trim,
    ue = function (e, t) {
      return new ue.fn.init(e, t, K);
    },
    ce = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
    de = /\S+/g,
    pe = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    he = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
    fe = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    ge = /^[\],:{}\s]*$/,
    me = /(?:^|:|,)(?:\s*\[)+/g,
    ye = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
    ve = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
    be = /^-ms-/,
    _e = /-([\da-z])/gi,
    xe = function (e, t) {
      return t.toUpperCase();
    },
    ke = function (e) {
      (G.addEventListener ||
        "load" === e.type ||
        "complete" === G.readyState) &&
        (De(), ue.ready());
    },
    De = function () {
      G.addEventListener
        ? (G.removeEventListener("DOMContentLoaded", ke, !1),
          e.removeEventListener("load", ke, !1))
        : (G.detachEvent("onreadystatechange", ke),
          e.detachEvent("onload", ke));
    };
  (ue.fn = ue.prototype =
    {
      jquery: te,
      constructor: ue,
      init: function (e, n, i) {
        var r, a;
        if (!e) return this;
        if ("string" == typeof e) {
          if (
            !(r =
              "<" === e.charAt(0) &&
              ">" === e.charAt(e.length - 1) &&
              e.length >= 3
                ? [null, e, null]
                : he.exec(e)) ||
            (!r[1] && n)
          )
            return !n || n.jquery
              ? (n || i).find(e)
              : this.constructor(n).find(e);
          if (r[1]) {
            if (
              ((n = n instanceof ue ? n[0] : n),
              ue.merge(
                this,
                ue.parseHTML(
                  r[1],
                  n && n.nodeType ? n.ownerDocument || n : G,
                  !0
                )
              ),
              fe.test(r[1]) && ue.isPlainObject(n))
            )
              for (r in n)
                ue.isFunction(this[r]) ? this[r](n[r]) : this.attr(r, n[r]);
            return this;
          }
          if ((a = G.getElementById(r[2])) && a.parentNode) {
            if (a.id !== r[2]) return i.find(e);
            (this.length = 1), (this[0] = a);
          }
          return (this.context = G), (this.selector = e), this;
        }
        return e.nodeType
          ? ((this.context = this[0] = e), (this.length = 1), this)
          : ue.isFunction(e)
          ? i.ready(e)
          : (e.selector !== t &&
              ((this.selector = e.selector), (this.context = e.context)),
            ue.makeArray(e, this));
      },
      selector: "",
      length: 0,
      toArray: function () {
        return re.call(this);
      },
      get: function (e) {
        return null == e
          ? this.toArray()
          : 0 > e
          ? this[this.length + e]
          : this[e];
      },
      pushStack: function (e) {
        var t = ue.merge(this.constructor(), e);
        return (t.prevObject = this), (t.context = this.context), t;
      },
      each: function (e, t) {
        return ue.each(this, e, t);
      },
      ready: function (e) {
        return ue.ready.promise().done(e), this;
      },
      slice: function () {
        return this.pushStack(re.apply(this, arguments));
      },
      first: function () {
        return this.eq(0);
      },
      last: function () {
        return this.eq(-1);
      },
      eq: function (e) {
        var t = this.length,
          n = +e + (0 > e ? t : 0);
        return this.pushStack(n >= 0 && t > n ? [this[n]] : []);
      },
      map: function (e) {
        return this.pushStack(
          ue.map(this, function (t, n) {
            return e.call(t, n, t);
          })
        );
      },
      end: function () {
        return this.prevObject || this.constructor(null);
      },
      push: ie,
      sort: [].sort,
      splice: [].splice,
    }),
    (ue.fn.init.prototype = ue.fn),
    (ue.extend = ue.fn.extend =
      function () {
        var e,
          n,
          i,
          r,
          a,
          s,
          o = arguments[0] || {},
          l = 1,
          u = arguments.length,
          c = !1;
        for (
          "boolean" == typeof o && ((c = o), (o = arguments[1] || {}), (l = 2)),
            "object" == typeof o || ue.isFunction(o) || (o = {}),
            u === l && ((o = this), --l);
          u > l;
          l++
        )
          if (null != (a = arguments[l]))
            for (r in a)
              (e = o[r]),
                (i = a[r]),
                o !== i &&
                  (c && i && (ue.isPlainObject(i) || (n = ue.isArray(i)))
                    ? (n
                        ? ((n = !1), (s = e && ue.isArray(e) ? e : []))
                        : (s = e && ue.isPlainObject(e) ? e : {}),
                      (o[r] = ue.extend(c, s, i)))
                    : i !== t && (o[r] = i));
        return o;
      }),
    ue.extend({
      expando: "jQuery" + (te + Math.random()).replace(/\D/g, ""),
      noConflict: function (t) {
        return (
          e.$ === ue && (e.$ = Q), t && e.jQuery === ue && (e.jQuery = J), ue
        );
      },
      isReady: !1,
      readyWait: 1,
      holdReady: function (e) {
        e ? ue.readyWait++ : ue.ready(!0);
      },
      ready: function (e) {
        if (!0 === e ? !--ue.readyWait : !ue.isReady) {
          if (!G.body) return setTimeout(ue.ready);
          (ue.isReady = !0),
            (!0 !== e && --ue.readyWait > 0) ||
              (z.resolveWith(G, [ue]),
              ue.fn.trigger && ue(G).trigger("ready").off("ready"));
        }
      },
      isFunction: function (e) {
        return "function" === ue.type(e);
      },
      isArray:
        Array.isArray ||
        function (e) {
          return "array" === ue.type(e);
        },
      isWindow: function (e) {
        return null != e && e == e.window;
      },
      isNumeric: function (e) {
        return !isNaN(parseFloat(e)) && isFinite(e);
      },
      type: function (e) {
        return null == e
          ? e + ""
          : "object" == typeof e || "function" == typeof e
          ? Z[se.call(e)] || "object"
          : typeof e;
      },
      isPlainObject: function (e) {
        var n;
        if (!e || "object" !== ue.type(e) || e.nodeType || ue.isWindow(e))
          return !1;
        try {
          if (
            e.constructor &&
            !oe.call(e, "constructor") &&
            !oe.call(e.constructor.prototype, "isPrototypeOf")
          )
            return !1;
        } catch (e) {
          return !1;
        }
        if (ue.support.ownLast) for (n in e) return oe.call(e, n);
        for (n in e);
        return n === t || oe.call(e, n);
      },
      isEmptyObject: function (e) {
        var t;
        for (t in e) return !1;
        return !0;
      },
      error: function (e) {
        throw Error(e);
      },
      parseHTML: function (e, t, n) {
        if (!e || "string" != typeof e) return null;
        "boolean" == typeof t && ((n = t), (t = !1)), (t = t || G);
        var i = fe.exec(e),
          r = !n && [];
        return i
          ? [t.createElement(i[1])]
          : ((i = ue.buildFragment([e], t, r)),
            r && ue(r).remove(),
            ue.merge([], i.childNodes));
      },
      parseJSON: function (n) {
        return e.JSON && e.JSON.parse
          ? e.JSON.parse(n)
          : null === n
          ? n
          : "string" == typeof n &&
            (n = ue.trim(n)) &&
            ge.test(n.replace(ye, "@").replace(ve, "]").replace(me, ""))
          ? Function("return " + n)()
          : (ue.error("Invalid JSON: " + n), t);
      },
      parseXML: function (n) {
        var i, r;
        if (!n || "string" != typeof n) return null;
        try {
          e.DOMParser
            ? ((r = new DOMParser()), (i = r.parseFromString(n, "text/xml")))
            : ((i = new ActiveXObject("Microsoft.XMLDOM")),
              (i.async = "false"),
              i.loadXML(n));
        } catch (e) {
          i = t;
        }
        return (
          (i &&
            i.documentElement &&
            !i.getElementsByTagName("parsererror").length) ||
            ue.error("Invalid XML: " + n),
          i
        );
      },
      noop: function () {},
      globalEval: function (t) {
        t &&
          ue.trim(t) &&
          (
            e.execScript ||
            function (t) {
              e.eval.call(e, t);
            }
          )(t);
      },
      camelCase: function (e) {
        return e.replace(be, "ms-").replace(_e, xe);
      },
      nodeName: function (e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
      },
      each: function (e, t, i) {
        var r = 0,
          a = e.length,
          s = n(e);
        if (i) {
          if (s) for (; a > r && !1 !== t.apply(e[r], i); r++);
          else for (r in e) if (!1 === t.apply(e[r], i)) break;
        } else if (s) for (; a > r && !1 !== t.call(e[r], r, e[r]); r++);
        else for (r in e) if (!1 === t.call(e[r], r, e[r])) break;
        return e;
      },
      trim:
        le && !le.call("\ufeff ")
          ? function (e) {
              return null == e ? "" : le.call(e);
            }
          : function (e) {
              return null == e ? "" : (e + "").replace(pe, "");
            },
      makeArray: function (e, t) {
        var i = t || [];
        return (
          null != e &&
            (n(Object(e))
              ? ue.merge(i, "string" == typeof e ? [e] : e)
              : ie.call(i, e)),
          i
        );
      },
      inArray: function (e, t, n) {
        var i;
        if (t) {
          if (ae) return ae.call(t, e, n);
          for (
            i = t.length, n = n ? (0 > n ? Math.max(0, i + n) : n) : 0;
            i > n;
            n++
          )
            if (n in t && t[n] === e) return n;
        }
        return -1;
      },
      merge: function (e, n) {
        var i = n.length,
          r = e.length,
          a = 0;
        if ("number" == typeof i) for (; i > a; a++) e[r++] = n[a];
        else for (; n[a] !== t; ) e[r++] = n[a++];
        return (e.length = r), e;
      },
      grep: function (e, t, n) {
        var i,
          r = [],
          a = 0,
          s = e.length;
        for (n = !!n; s > a; a++) (i = !!t(e[a], a)), n !== i && r.push(e[a]);
        return r;
      },
      map: function (e, t, i) {
        var r,
          a = 0,
          s = e.length,
          o = [];
        if (n(e))
          for (; s > a; a++) null != (r = t(e[a], a, i)) && (o[o.length] = r);
        else for (a in e) null != (r = t(e[a], a, i)) && (o[o.length] = r);
        return ne.apply([], o);
      },
      guid: 1,
      proxy: function (e, n) {
        var i, r, a;
        return (
          "string" == typeof n && ((a = e[n]), (n = e), (e = a)),
          ue.isFunction(e)
            ? ((i = re.call(arguments, 2)),
              (r = function () {
                return e.apply(n || this, i.concat(re.call(arguments)));
              }),
              (r.guid = e.guid = e.guid || ue.guid++),
              r)
            : t
        );
      },
      access: function (e, n, i, r, a, s, o) {
        var l = 0,
          u = e.length,
          c = null == i;
        if ("object" === ue.type(i)) {
          a = !0;
          for (l in i) ue.access(e, n, l, i[l], !0, s, o);
        } else if (
          r !== t &&
          ((a = !0),
          ue.isFunction(r) || (o = !0),
          c &&
            (o
              ? (n.call(e, r), (n = null))
              : ((c = n),
                (n = function (e, t, n) {
                  return c.call(ue(e), n);
                }))),
          n)
        )
          for (; u > l; l++) n(e[l], i, o ? r : r.call(e[l], l, n(e[l], i)));
        return a ? e : c ? n.call(e) : u ? n(e[0], i) : s;
      },
      now: function () {
        return new Date().getTime();
      },
      swap: function (e, t, n, i) {
        var r,
          a,
          s = {};
        for (a in t) (s[a] = e.style[a]), (e.style[a] = t[a]);
        r = n.apply(e, i || []);
        for (a in t) e.style[a] = s[a];
        return r;
      },
    }),
    (ue.ready.promise = function (t) {
      if (!z)
        if (((z = ue.Deferred()), "complete" === G.readyState))
          setTimeout(ue.ready);
        else if (G.addEventListener)
          G.addEventListener("DOMContentLoaded", ke, !1),
            e.addEventListener("load", ke, !1);
        else {
          G.attachEvent("onreadystatechange", ke), e.attachEvent("onload", ke);
          var n = !1;
          try {
            n = null == e.frameElement && G.documentElement;
          } catch (e) {}
          n &&
            n.doScroll &&
            (function e() {
              if (!ue.isReady) {
                try {
                  n.doScroll("left");
                } catch (t) {
                  return setTimeout(e, 50);
                }
                De(), ue.ready();
              }
            })();
        }
      return z.promise(t);
    }),
    ue.each(
      "Boolean Number String Function Array Date RegExp Object Error".split(
        " "
      ),
      function (e, t) {
        Z["[object " + t + "]"] = t.toLowerCase();
      }
    ),
    (K = ue(G)),
    (function (e, t) {
      function n(e, t, n, i) {
        var r, a, s, o, l, u, p, h, f, g;
        if (
          ((t ? t.ownerDocument || t : O) !== $ && S(t),
          (t = t || $),
          (n = n || []),
          !e || "string" != typeof e)
        )
          return n;
        if (1 !== (o = t.nodeType) && 9 !== o) return [];
        if (E && !i) {
          if ((r = ye.exec(e)))
            if ((s = r[1])) {
              if (9 === o) {
                if (!(a = t.getElementById(s)) || !a.parentNode) return n;
                if (a.id === s) return n.push(a), n;
              } else if (
                t.ownerDocument &&
                (a = t.ownerDocument.getElementById(s)) &&
                L(t, a) &&
                a.id === s
              )
                return n.push(a), n;
            } else {
              if (r[2]) return Q.apply(n, t.getElementsByTagName(e)), n;
              if (
                (s = r[3]) &&
                x.getElementsByClassName &&
                t.getElementsByClassName
              )
                return Q.apply(n, t.getElementsByClassName(s)), n;
            }
          if (x.qsa && (!j || !j.test(e))) {
            if (
              ((h = p = H),
              (f = t),
              (g = 9 === o && e),
              1 === o && "object" !== t.nodeName.toLowerCase())
            ) {
              for (
                u = c(e),
                  (p = t.getAttribute("id"))
                    ? (h = p.replace(_e, "\\$&"))
                    : t.setAttribute("id", h),
                  h = "[id='" + h + "'] ",
                  l = u.length;
                l--;

              )
                u[l] = h + d(u[l]);
              (f = (de.test(e) && t.parentNode) || t), (g = u.join(","));
            }
            if (g)
              try {
                return Q.apply(n, f.querySelectorAll(g)), n;
              } catch (e) {
              } finally {
                p || t.removeAttribute("id");
              }
          }
        }
        return b(e.replace(oe, "$1"), t, n, i);
      }
      function i() {
        function e(n, i) {
          return (
            t.push((n += " ")) > D.cacheLength && delete e[t.shift()],
            (e[n] = i)
          );
        }
        var t = [];
        return e;
      }
      function r(e) {
        return (e[H] = !0), e;
      }
      function a(e) {
        var t = $.createElement("div");
        try {
          return !!e(t);
        } catch (e) {
          return !1;
        } finally {
          t.parentNode && t.parentNode.removeChild(t), (t = null);
        }
      }
      function s(e, t) {
        for (var n = e.split("|"), i = e.length; i--; ) D.attrHandle[n[i]] = t;
      }
      function o(e, t) {
        var n = t && e,
          i =
            n &&
            1 === e.nodeType &&
            1 === t.nodeType &&
            (~t.sourceIndex || U) - (~e.sourceIndex || U);
        if (i) return i;
        if (n) for (; (n = n.nextSibling); ) if (n === t) return -1;
        return e ? 1 : -1;
      }
      function l(e) {
        return r(function (t) {
          return (
            (t = +t),
            r(function (n, i) {
              for (var r, a = e([], n.length, t), s = a.length; s--; )
                n[(r = a[s])] && (n[r] = !(i[r] = n[r]));
            })
          );
        });
      }
      function u() {}
      function c(e, t) {
        var i,
          r,
          a,
          s,
          o,
          l,
          u,
          c = q[e + " "];
        if (c) return t ? 0 : c.slice(0);
        for (o = e, l = [], u = D.preFilter; o; ) {
          (!i || (r = le.exec(o))) &&
            (r && (o = o.slice(r[0].length) || o), l.push((a = []))),
            (i = !1),
            (r = ce.exec(o)) &&
              ((i = r.shift()),
              a.push({ value: i, type: r[0].replace(oe, " ") }),
              (o = o.slice(i.length)));
          for (s in D.filter)
            !(r = ge[s].exec(o)) ||
              (u[s] && !(r = u[s](r))) ||
              ((i = r.shift()),
              a.push({ value: i, type: s, matches: r }),
              (o = o.slice(i.length)));
          if (!i) break;
        }
        return t ? o.length : o ? n.error(e) : q(e, l).slice(0);
      }
      function d(e) {
        for (var t = 0, n = e.length, i = ""; n > t; t++) i += e[t].value;
        return i;
      }
      function p(e, t, n) {
        var i = t.dir,
          r = n && "parentNode" === i,
          a = R++;
        return t.first
          ? function (t, n, a) {
              for (; (t = t[i]); ) if (1 === t.nodeType || r) return e(t, n, a);
            }
          : function (t, n, s) {
              var o,
                l,
                u,
                c = P + " " + a;
              if (s) {
                for (; (t = t[i]); )
                  if ((1 === t.nodeType || r) && e(t, n, s)) return !0;
              } else
                for (; (t = t[i]); )
                  if (1 === t.nodeType || r)
                    if (((u = t[H] || (t[H] = {})), (l = u[i]) && l[0] === c)) {
                      if (!0 === (o = l[1]) || o === k) return !0 === o;
                    } else if (
                      ((l = u[i] = [c]), (l[1] = e(t, n, s) || k), !0 === l[1])
                    )
                      return !0;
            };
      }
      function h(e) {
        return e.length > 1
          ? function (t, n, i) {
              for (var r = e.length; r--; ) if (!e[r](t, n, i)) return !1;
              return !0;
            }
          : e[0];
      }
      function f(e, t, n, i, r) {
        for (var a, s = [], o = 0, l = e.length, u = null != t; l > o; o++)
          (a = e[o]) && (!n || n(a, i, r)) && (s.push(a), u && t.push(o));
        return s;
      }
      function g(e, t, n, i, a, s) {
        return (
          i && !i[H] && (i = g(i)),
          a && !a[H] && (a = g(a, s)),
          r(function (r, s, o, l) {
            var u,
              c,
              d,
              p = [],
              h = [],
              g = s.length,
              m = r || v(t || "*", o.nodeType ? [o] : o, []),
              y = !e || (!r && t) ? m : f(m, p, e, o, l),
              b = n ? (a || (r ? e : g || i) ? [] : s) : y;
            if ((n && n(y, b, o, l), i))
              for (u = f(b, h), i(u, [], o, l), c = u.length; c--; )
                (d = u[c]) && (b[h[c]] = !(y[h[c]] = d));
            if (r) {
              if (a || e) {
                if (a) {
                  for (u = [], c = b.length; c--; )
                    (d = b[c]) && u.push((y[c] = d));
                  a(null, (b = []), u, l);
                }
                for (c = b.length; c--; )
                  (d = b[c]) &&
                    (u = a ? ee.call(r, d) : p[c]) > -1 &&
                    (r[u] = !(s[u] = d));
              }
            } else (b = f(b === s ? b.splice(g, b.length) : b)), a ? a(null, s, b, l) : Q.apply(s, b);
          })
        );
      }
      function m(e) {
        for (
          var t,
            n,
            i,
            r = e.length,
            a = D.relative[e[0].type],
            s = a || D.relative[" "],
            o = a ? 1 : 0,
            l = p(
              function (e) {
                return e === t;
              },
              s,
              !0
            ),
            u = p(
              function (e) {
                return ee.call(t, e) > -1;
              },
              s,
              !0
            ),
            c = [
              function (e, n, i) {
                return (
                  (!a && (i || n !== N)) ||
                  ((t = n).nodeType ? l(e, n, i) : u(e, n, i))
                );
              },
            ];
          r > o;
          o++
        )
          if ((n = D.relative[e[o].type])) c = [p(h(c), n)];
          else {
            if ((n = D.filter[e[o].type].apply(null, e[o].matches))[H]) {
              for (i = ++o; r > i && !D.relative[e[i].type]; i++);
              return g(
                o > 1 && h(c),
                o > 1 &&
                  d(
                    e
                      .slice(0, o - 1)
                      .concat({ value: " " === e[o - 2].type ? "*" : "" })
                  ).replace(oe, "$1"),
                n,
                i > o && m(e.slice(o, i)),
                r > i && m((e = e.slice(i))),
                r > i && d(e)
              );
            }
            c.push(n);
          }
        return h(c);
      }
      function y(e, t) {
        var i = 0,
          a = t.length > 0,
          s = e.length > 0,
          o = function (r, o, l, u, c) {
            var d,
              p,
              h,
              g = [],
              m = 0,
              y = "0",
              v = r && [],
              b = null != c,
              _ = N,
              x = r || (s && D.find.TAG("*", (c && o.parentNode) || o)),
              w = (P += null == _ ? 1 : Math.random() || 0.1);
            for (b && ((N = o !== $ && o), (k = i)); null != (d = x[y]); y++) {
              if (s && d) {
                for (p = 0; (h = e[p++]); )
                  if (h(d, o, l)) {
                    u.push(d);
                    break;
                  }
                b && ((P = w), (k = ++i));
              }
              a && ((d = !h && d) && m--, r && v.push(d));
            }
            if (((m += y), a && y !== m)) {
              for (p = 0; (h = t[p++]); ) h(v, g, o, l);
              if (r) {
                if (m > 0) for (; y--; ) v[y] || g[y] || (g[y] = V.call(u));
                g = f(g);
              }
              Q.apply(u, g),
                b && !r && g.length > 0 && m + t.length > 1 && n.uniqueSort(u);
            }
            return b && ((P = w), (N = _)), v;
          };
        return a ? r(o) : o;
      }
      function v(e, t, i) {
        for (var r = 0, a = t.length; a > r; r++) n(e, t[r], i);
        return i;
      }
      function b(e, t, n, i) {
        var r,
          a,
          s,
          o,
          l,
          u = c(e);
        if (!i && 1 === u.length) {
          if (
            (a = u[0] = u[0].slice(0)).length > 2 &&
            "ID" === (s = a[0]).type &&
            x.getById &&
            9 === t.nodeType &&
            E &&
            D.relative[a[1].type]
          ) {
            if (!(t = (D.find.ID(s.matches[0].replace(xe, ke), t) || [])[0]))
              return n;
            e = e.slice(a.shift().value.length);
          }
          for (
            r = ge.needsContext.test(e) ? 0 : a.length;
            r-- && ((s = a[r]), !D.relative[(o = s.type)]);

          )
            if (
              (l = D.find[o]) &&
              (i = l(
                s.matches[0].replace(xe, ke),
                (de.test(a[0].type) && t.parentNode) || t
              ))
            ) {
              if ((a.splice(r, 1), !(e = i.length && d(a))))
                return Q.apply(n, i), n;
              break;
            }
        }
        return T(e, u)(i, t, !E, n, de.test(e)), n;
      }
      var _,
        x,
        k,
        D,
        w,
        C,
        T,
        N,
        M,
        S,
        $,
        A,
        E,
        j,
        I,
        F,
        L,
        H = "sizzle" + -new Date(),
        O = e.document,
        P = 0,
        R = 0,
        Y = i(),
        q = i(),
        W = i(),
        B = !1,
        z = function (e, t) {
          return e === t ? ((B = !0), 0) : 0;
        },
        K = typeof t,
        U = 1 << 31,
        X = {}.hasOwnProperty,
        G = [],
        V = G.pop,
        J = G.push,
        Q = G.push,
        Z = G.slice,
        ee =
          G.indexOf ||
          function (e) {
            for (var t = 0, n = this.length; n > t; t++)
              if (this[t] === e) return t;
            return -1;
          },
        te =
          "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
        ne = "[\\x20\\t\\r\\n\\f]",
        ie = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
        re = ie.replace("w", "w#"),
        ae =
          "\\[" +
          ne +
          "*(" +
          ie +
          ")" +
          ne +
          "*(?:([*^$|!~]?=)" +
          ne +
          "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" +
          re +
          ")|)|)" +
          ne +
          "*\\]",
        se =
          ":(" +
          ie +
          ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" +
          ae.replace(3, 8) +
          ")*)|.*)\\)|)",
        oe = RegExp("^" + ne + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ne + "+$", "g"),
        le = RegExp("^" + ne + "*," + ne + "*"),
        ce = RegExp("^" + ne + "*([>+~]|" + ne + ")" + ne + "*"),
        de = RegExp(ne + "*[+~]"),
        pe = RegExp("=" + ne + "*([^\\]'\"]*)" + ne + "*\\]", "g"),
        he = RegExp(se),
        fe = RegExp("^" + re + "$"),
        ge = {
          ID: RegExp("^#(" + ie + ")"),
          CLASS: RegExp("^\\.(" + ie + ")"),
          TAG: RegExp("^(" + ie.replace("w", "w*") + ")"),
          ATTR: RegExp("^" + ae),
          PSEUDO: RegExp("^" + se),
          CHILD: RegExp(
            "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
              ne +
              "*(even|odd|(([+-]|)(\\d*)n|)" +
              ne +
              "*(?:([+-]|)" +
              ne +
              "*(\\d+)|))" +
              ne +
              "*\\)|)",
            "i"
          ),
          bool: RegExp("^(?:" + te + ")$", "i"),
          needsContext: RegExp(
            "^" +
              ne +
              "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
              ne +
              "*((?:-\\d)?\\d*)" +
              ne +
              "*\\)|)(?=[^-]|$)",
            "i"
          ),
        },
        me = /^[^{]+\{\s*\[native \w/,
        ye = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        ve = /^(?:input|select|textarea|button)$/i,
        be = /^h\d$/i,
        _e = /'|\\/g,
        xe = RegExp("\\\\([\\da-f]{1,6}" + ne + "?|(" + ne + ")|.)", "ig"),
        ke = function (e, t, n) {
          var i = "0x" + t - 65536;
          return i !== i || n
            ? t
            : 0 > i
            ? String.fromCharCode(i + 65536)
            : String.fromCharCode(55296 | (i >> 10), 56320 | (1023 & i));
        };
      try {
        Q.apply((G = Z.call(O.childNodes)), O.childNodes),
          G[O.childNodes.length].nodeType;
      } catch (e) {
        Q = {
          apply: G.length
            ? function (e, t) {
                J.apply(e, Z.call(t));
              }
            : function (e, t) {
                for (var n = e.length, i = 0; (e[n++] = t[i++]); );
                e.length = n - 1;
              },
        };
      }
      (C = n.isXML =
        function (e) {
          var t = e && (e.ownerDocument || e).documentElement;
          return !!t && "HTML" !== t.nodeName;
        }),
        (x = n.support = {}),
        (S = n.setDocument =
          function (e) {
            var n = e ? e.ownerDocument || e : O,
              i = n.defaultView;
            return n !== $ && 9 === n.nodeType && n.documentElement
              ? (($ = n),
                (A = n.documentElement),
                (E = !C(n)),
                i &&
                  i.attachEvent &&
                  i !== i.top &&
                  i.attachEvent("onbeforeunload", function () {
                    S();
                  }),
                (x.attributes = a(function (e) {
                  return (e.className = "i"), !e.getAttribute("className");
                })),
                (x.getElementsByTagName = a(function (e) {
                  return (
                    e.appendChild(n.createComment("")),
                    !e.getElementsByTagName("*").length
                  );
                })),
                (x.getElementsByClassName = a(function (e) {
                  return (
                    (e.innerHTML =
                      "<div class='a'></div><div class='a i'></div>"),
                    (e.firstChild.className = "i"),
                    2 === e.getElementsByClassName("i").length
                  );
                })),
                (x.getById = a(function (e) {
                  return (
                    (A.appendChild(e).id = H),
                    !n.getElementsByName || !n.getElementsByName(H).length
                  );
                })),
                x.getById
                  ? ((D.find.ID = function (e, t) {
                      if (typeof t.getElementById !== K && E) {
                        var n = t.getElementById(e);
                        return n && n.parentNode ? [n] : [];
                      }
                    }),
                    (D.filter.ID = function (e) {
                      var t = e.replace(xe, ke);
                      return function (e) {
                        return e.getAttribute("id") === t;
                      };
                    }))
                  : (delete D.find.ID,
                    (D.filter.ID = function (e) {
                      var t = e.replace(xe, ke);
                      return function (e) {
                        var n =
                          typeof e.getAttributeNode !== K &&
                          e.getAttributeNode("id");
                        return n && n.value === t;
                      };
                    })),
                (D.find.TAG = x.getElementsByTagName
                  ? function (e, n) {
                      return typeof n.getElementsByTagName !== K
                        ? n.getElementsByTagName(e)
                        : t;
                    }
                  : function (e, t) {
                      var n,
                        i = [],
                        r = 0,
                        a = t.getElementsByTagName(e);
                      if ("*" === e) {
                        for (; (n = a[r++]); ) 1 === n.nodeType && i.push(n);
                        return i;
                      }
                      return a;
                    }),
                (D.find.CLASS =
                  x.getElementsByClassName &&
                  function (e, n) {
                    return typeof n.getElementsByClassName !== K && E
                      ? n.getElementsByClassName(e)
                      : t;
                  }),
                (I = []),
                (j = []),
                (x.qsa = me.test(n.querySelectorAll)) &&
                  (a(function (e) {
                    (e.innerHTML =
                      "<select><option selected=''></option></select>"),
                      e.querySelectorAll("[selected]").length ||
                        j.push("\\[" + ne + "*(?:value|" + te + ")"),
                      e.querySelectorAll(":checked").length ||
                        j.push(":checked");
                  }),
                  a(function (e) {
                    var t = n.createElement("input");
                    t.setAttribute("type", "hidden"),
                      e.appendChild(t).setAttribute("t", ""),
                      e.querySelectorAll("[t^='']").length &&
                        j.push("[*^$]=" + ne + "*(?:''|\"\")"),
                      e.querySelectorAll(":enabled").length ||
                        j.push(":enabled", ":disabled"),
                      e.querySelectorAll("*,:x"),
                      j.push(",.*:");
                  })),
                (x.matchesSelector = me.test(
                  (F =
                    A.webkitMatchesSelector ||
                    A.mozMatchesSelector ||
                    A.oMatchesSelector ||
                    A.msMatchesSelector)
                )) &&
                  a(function (e) {
                    (x.disconnectedMatch = F.call(e, "div")),
                      F.call(e, "[s!='']:x"),
                      I.push("!=", se);
                  }),
                (j = j.length && RegExp(j.join("|"))),
                (I = I.length && RegExp(I.join("|"))),
                (L =
                  me.test(A.contains) || A.compareDocumentPosition
                    ? function (e, t) {
                        var n = 9 === e.nodeType ? e.documentElement : e,
                          i = t && t.parentNode;
                        return (
                          e === i ||
                          !(
                            !i ||
                            1 !== i.nodeType ||
                            !(n.contains
                              ? n.contains(i)
                              : e.compareDocumentPosition &&
                                16 & e.compareDocumentPosition(i))
                          )
                        );
                      }
                    : function (e, t) {
                        if (t)
                          for (; (t = t.parentNode); ) if (t === e) return !0;
                        return !1;
                      }),
                (z = A.compareDocumentPosition
                  ? function (e, t) {
                      if (e === t) return (B = !0), 0;
                      var i =
                        t.compareDocumentPosition &&
                        e.compareDocumentPosition &&
                        e.compareDocumentPosition(t);
                      return i
                        ? 1 & i ||
                          (!x.sortDetached &&
                            t.compareDocumentPosition(e) === i)
                          ? e === n || L(O, e)
                            ? -1
                            : t === n || L(O, t)
                            ? 1
                            : M
                            ? ee.call(M, e) - ee.call(M, t)
                            : 0
                          : 4 & i
                          ? -1
                          : 1
                        : e.compareDocumentPosition
                        ? -1
                        : 1;
                    }
                  : function (e, t) {
                      var i,
                        r = 0,
                        a = e.parentNode,
                        s = t.parentNode,
                        l = [e],
                        u = [t];
                      if (e === t) return (B = !0), 0;
                      if (!a || !s)
                        return e === n
                          ? -1
                          : t === n
                          ? 1
                          : a
                          ? -1
                          : s
                          ? 1
                          : M
                          ? ee.call(M, e) - ee.call(M, t)
                          : 0;
                      if (a === s) return o(e, t);
                      for (i = e; (i = i.parentNode); ) l.unshift(i);
                      for (i = t; (i = i.parentNode); ) u.unshift(i);
                      for (; l[r] === u[r]; ) r++;
                      return r
                        ? o(l[r], u[r])
                        : l[r] === O
                        ? -1
                        : u[r] === O
                        ? 1
                        : 0;
                    }),
                n)
              : $;
          }),
        (n.matches = function (e, t) {
          return n(e, null, null, t);
        }),
        (n.matchesSelector = function (e, t) {
          if (
            ((e.ownerDocument || e) !== $ && S(e),
            (t = t.replace(pe, "='$1']")),
            !(!x.matchesSelector || !E || (I && I.test(t)) || (j && j.test(t))))
          )
            try {
              var i = F.call(e, t);
              if (
                i ||
                x.disconnectedMatch ||
                (e.document && 11 !== e.document.nodeType)
              )
                return i;
            } catch (e) {}
          return n(t, $, null, [e]).length > 0;
        }),
        (n.contains = function (e, t) {
          return (e.ownerDocument || e) !== $ && S(e), L(e, t);
        }),
        (n.attr = function (e, n) {
          (e.ownerDocument || e) !== $ && S(e);
          var i = D.attrHandle[n.toLowerCase()],
            r = i && X.call(D.attrHandle, n.toLowerCase()) ? i(e, n, !E) : t;
          return r === t
            ? x.attributes || !E
              ? e.getAttribute(n)
              : (r = e.getAttributeNode(n)) && r.specified
              ? r.value
              : null
            : r;
        }),
        (n.error = function (e) {
          throw Error("Syntax error, unrecognized expression: " + e);
        }),
        (n.uniqueSort = function (e) {
          var t,
            n = [],
            i = 0,
            r = 0;
          if (
            ((B = !x.detectDuplicates),
            (M = !x.sortStable && e.slice(0)),
            e.sort(z),
            B)
          ) {
            for (; (t = e[r++]); ) t === e[r] && (i = n.push(r));
            for (; i--; ) e.splice(n[i], 1);
          }
          return e;
        }),
        (w = n.getText =
          function (e) {
            var t,
              n = "",
              i = 0,
              r = e.nodeType;
            if (r) {
              if (1 === r || 9 === r || 11 === r) {
                if ("string" == typeof e.textContent) return e.textContent;
                for (e = e.firstChild; e; e = e.nextSibling) n += w(e);
              } else if (3 === r || 4 === r) return e.nodeValue;
            } else for (; (t = e[i]); i++) n += w(t);
            return n;
          }),
        ((D = n.selectors =
          {
            cacheLength: 50,
            createPseudo: r,
            match: ge,
            attrHandle: {},
            find: {},
            relative: {
              ">": { dir: "parentNode", first: !0 },
              " ": { dir: "parentNode" },
              "+": { dir: "previousSibling", first: !0 },
              "~": { dir: "previousSibling" },
            },
            preFilter: {
              ATTR: function (e) {
                return (
                  (e[1] = e[1].replace(xe, ke)),
                  (e[3] = (e[4] || e[5] || "").replace(xe, ke)),
                  "~=" === e[2] && (e[3] = " " + e[3] + " "),
                  e.slice(0, 4)
                );
              },
              CHILD: function (e) {
                return (
                  (e[1] = e[1].toLowerCase()),
                  "nth" === e[1].slice(0, 3)
                    ? (e[3] || n.error(e[0]),
                      (e[4] = +(e[4]
                        ? e[5] + (e[6] || 1)
                        : 2 * ("even" === e[3] || "odd" === e[3]))),
                      (e[5] = +(e[7] + e[8] || "odd" === e[3])))
                    : e[3] && n.error(e[0]),
                  e
                );
              },
              PSEUDO: function (e) {
                var n,
                  i = !e[5] && e[2];
                return ge.CHILD.test(e[0])
                  ? null
                  : (e[3] && e[4] !== t
                      ? (e[2] = e[4])
                      : i &&
                        he.test(i) &&
                        (n = c(i, !0)) &&
                        (n = i.indexOf(")", i.length - n) - i.length) &&
                        ((e[0] = e[0].slice(0, n)), (e[2] = i.slice(0, n))),
                    e.slice(0, 3));
              },
            },
            filter: {
              TAG: function (e) {
                var t = e.replace(xe, ke).toLowerCase();
                return "*" === e
                  ? function () {
                      return !0;
                    }
                  : function (e) {
                      return e.nodeName && e.nodeName.toLowerCase() === t;
                    };
              },
              CLASS: function (e) {
                var t = Y[e + " "];
                return (
                  t ||
                  ((t = RegExp("(^|" + ne + ")" + e + "(" + ne + "|$)")) &&
                    Y(e, function (e) {
                      return t.test(
                        ("string" == typeof e.className && e.className) ||
                          (typeof e.getAttribute !== K &&
                            e.getAttribute("class")) ||
                          ""
                      );
                    }))
                );
              },
              ATTR: function (e, t, i) {
                return function (r) {
                  var a = n.attr(r, e);
                  return null == a
                    ? "!=" === t
                    : !t ||
                        ((a += ""),
                        "=" === t
                          ? a === i
                          : "!=" === t
                          ? a !== i
                          : "^=" === t
                          ? i && 0 === a.indexOf(i)
                          : "*=" === t
                          ? i && a.indexOf(i) > -1
                          : "$=" === t
                          ? i && a.slice(-i.length) === i
                          : "~=" === t
                          ? (" " + a + " ").indexOf(i) > -1
                          : "|=" === t &&
                            (a === i || a.slice(0, i.length + 1) === i + "-"));
                };
              },
              CHILD: function (e, t, n, i, r) {
                var a = "nth" !== e.slice(0, 3),
                  s = "last" !== e.slice(-4),
                  o = "of-type" === t;
                return 1 === i && 0 === r
                  ? function (e) {
                      return !!e.parentNode;
                    }
                  : function (t, n, l) {
                      var u,
                        c,
                        d,
                        p,
                        h,
                        f,
                        g = a !== s ? "nextSibling" : "previousSibling",
                        m = t.parentNode,
                        y = o && t.nodeName.toLowerCase(),
                        v = !l && !o;
                      if (m) {
                        if (a) {
                          for (; g; ) {
                            for (d = t; (d = d[g]); )
                              if (
                                o
                                  ? d.nodeName.toLowerCase() === y
                                  : 1 === d.nodeType
                              )
                                return !1;
                            f = g = "only" === e && !f && "nextSibling";
                          }
                          return !0;
                        }
                        if (((f = [s ? m.firstChild : m.lastChild]), s && v)) {
                          for (
                            h =
                              (u = (c = m[H] || (m[H] = {}))[e] || [])[0] ===
                                P && u[1],
                              p = u[0] === P && u[2],
                              d = h && m.childNodes[h];
                            (d = (++h && d && d[g]) || (p = h = 0) || f.pop());

                          )
                            if (1 === d.nodeType && ++p && d === t) {
                              c[e] = [P, h, p];
                              break;
                            }
                        } else if (
                          v &&
                          (u = (t[H] || (t[H] = {}))[e]) &&
                          u[0] === P
                        )
                          p = u[1];
                        else
                          for (
                            ;
                            (d =
                              (++h && d && d[g]) || (p = h = 0) || f.pop()) &&
                            ((o
                              ? d.nodeName.toLowerCase() !== y
                              : 1 !== d.nodeType) ||
                              !++p ||
                              (v && ((d[H] || (d[H] = {}))[e] = [P, p]),
                              d !== t));

                          );
                        return (p -= r) === i || (0 == p % i && p / i >= 0);
                      }
                    };
              },
              PSEUDO: function (e, t) {
                var i,
                  a =
                    D.pseudos[e] ||
                    D.setFilters[e.toLowerCase()] ||
                    n.error("unsupported pseudo: " + e);
                return a[H]
                  ? a(t)
                  : a.length > 1
                  ? ((i = [e, e, "", t]),
                    D.setFilters.hasOwnProperty(e.toLowerCase())
                      ? r(function (e, n) {
                          for (var i, r = a(e, t), s = r.length; s--; )
                            (i = ee.call(e, r[s])), (e[i] = !(n[i] = r[s]));
                        })
                      : function (e) {
                          return a(e, 0, i);
                        })
                  : a;
              },
            },
            pseudos: {
              not: r(function (e) {
                var t = [],
                  n = [],
                  i = T(e.replace(oe, "$1"));
                return i[H]
                  ? r(function (e, t, n, r) {
                      for (var a, s = i(e, null, r, []), o = e.length; o--; )
                        (a = s[o]) && (e[o] = !(t[o] = a));
                    })
                  : function (e, r, a) {
                      return (t[0] = e), i(t, null, a, n), !n.pop();
                    };
              }),
              has: r(function (e) {
                return function (t) {
                  return n(e, t).length > 0;
                };
              }),
              contains: r(function (e) {
                return function (t) {
                  return (t.textContent || t.innerText || w(t)).indexOf(e) > -1;
                };
              }),
              lang: r(function (e) {
                return (
                  fe.test(e || "") || n.error("unsupported lang: " + e),
                  (e = e.replace(xe, ke).toLowerCase()),
                  function (t) {
                    var n;
                    do {
                      if (
                        (n = E
                          ? t.lang
                          : t.getAttribute("xml:lang") ||
                            t.getAttribute("lang"))
                      )
                        return (
                          (n = n.toLowerCase()) === e ||
                          0 === n.indexOf(e + "-")
                        );
                    } while ((t = t.parentNode) && 1 === t.nodeType);
                    return !1;
                  }
                );
              }),
              target: function (t) {
                var n = e.location && e.location.hash;
                return n && n.slice(1) === t.id;
              },
              root: function (e) {
                return e === A;
              },
              focus: function (e) {
                return (
                  e === $.activeElement &&
                  (!$.hasFocus || $.hasFocus()) &&
                  !!(e.type || e.href || ~e.tabIndex)
                );
              },
              enabled: function (e) {
                return !1 === e.disabled;
              },
              disabled: function (e) {
                return !0 === e.disabled;
              },
              checked: function (e) {
                var t = e.nodeName.toLowerCase();
                return (
                  ("input" === t && !!e.checked) ||
                  ("option" === t && !!e.selected)
                );
              },
              selected: function (e) {
                return (
                  e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
                );
              },
              empty: function (e) {
                for (e = e.firstChild; e; e = e.nextSibling)
                  if (e.nodeName > "@" || 3 === e.nodeType || 4 === e.nodeType)
                    return !1;
                return !0;
              },
              parent: function (e) {
                return !D.pseudos.empty(e);
              },
              header: function (e) {
                return be.test(e.nodeName);
              },
              input: function (e) {
                return ve.test(e.nodeName);
              },
              button: function (e) {
                var t = e.nodeName.toLowerCase();
                return ("input" === t && "button" === e.type) || "button" === t;
              },
              text: function (e) {
                var t;
                return (
                  "input" === e.nodeName.toLowerCase() &&
                  "text" === e.type &&
                  (null == (t = e.getAttribute("type")) ||
                    t.toLowerCase() === e.type)
                );
              },
              first: l(function () {
                return [0];
              }),
              last: l(function (e, t) {
                return [t - 1];
              }),
              eq: l(function (e, t, n) {
                return [0 > n ? n + t : n];
              }),
              even: l(function (e, t) {
                for (var n = 0; t > n; n += 2) e.push(n);
                return e;
              }),
              odd: l(function (e, t) {
                for (var n = 1; t > n; n += 2) e.push(n);
                return e;
              }),
              lt: l(function (e, t, n) {
                for (var i = 0 > n ? n + t : n; --i >= 0; ) e.push(i);
                return e;
              }),
              gt: l(function (e, t, n) {
                for (var i = 0 > n ? n + t : n; t > ++i; ) e.push(i);
                return e;
              }),
            },
          }).pseudos.nth = D.pseudos.eq);
      for (_ in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 })
        D.pseudos[_] = (function (e) {
          return function (t) {
            return "input" === t.nodeName.toLowerCase() && t.type === e;
          };
        })(_);
      for (_ in { submit: !0, reset: !0 })
        D.pseudos[_] = (function (e) {
          return function (t) {
            var n = t.nodeName.toLowerCase();
            return ("input" === n || "button" === n) && t.type === e;
          };
        })(_);
      (u.prototype = D.filters = D.pseudos),
        (D.setFilters = new u()),
        (T = n.compile =
          function (e, t) {
            var n,
              i = [],
              r = [],
              a = W[e + " "];
            if (!a) {
              for (t || (t = c(e)), n = t.length; n--; )
                (a = m(t[n])), a[H] ? i.push(a) : r.push(a);
              a = W(e, y(r, i));
            }
            return a;
          }),
        (x.sortStable = H.split("").sort(z).join("") === H),
        (x.detectDuplicates = B),
        S(),
        (x.sortDetached = a(function (e) {
          return 1 & e.compareDocumentPosition($.createElement("div"));
        })),
        a(function (e) {
          return (
            (e.innerHTML = "<a href='#'></a>"),
            "#" === e.firstChild.getAttribute("href")
          );
        }) ||
          s("type|href|height|width", function (e, n, i) {
            return i
              ? t
              : e.getAttribute(n, "type" === n.toLowerCase() ? 1 : 2);
          }),
        (x.attributes &&
          a(function (e) {
            return (
              (e.innerHTML = "<input/>"),
              e.firstChild.setAttribute("value", ""),
              "" === e.firstChild.getAttribute("value")
            );
          })) ||
          s("value", function (e, n, i) {
            return i || "input" !== e.nodeName.toLowerCase()
              ? t
              : e.defaultValue;
          }),
        a(function (e) {
          return null == e.getAttribute("disabled");
        }) ||
          s(te, function (e, n, i) {
            var r;
            return i
              ? t
              : (r = e.getAttributeNode(n)) && r.specified
              ? r.value
              : !0 === e[n]
              ? n.toLowerCase()
              : null;
          }),
        (ue.find = n),
        (ue.expr = n.selectors),
        (ue.expr[":"] = ue.expr.pseudos),
        (ue.unique = n.uniqueSort),
        (ue.text = n.getText),
        (ue.isXMLDoc = n.isXML),
        (ue.contains = n.contains);
    })(e);
  var we = {};
  (ue.Callbacks = function (e) {
    var n,
      r,
      a,
      s,
      o,
      l,
      u = [],
      c =
        !(e = "string" == typeof e ? we[e] || i(e) : ue.extend({}, e)).once &&
        [],
      d = function (t) {
        for (
          r = e.memory && t, a = !0, o = l || 0, l = 0, s = u.length, n = !0;
          u && s > o;
          o++
        )
          if (!1 === u[o].apply(t[0], t[1]) && e.stopOnFalse) {
            r = !1;
            break;
          }
        (n = !1),
          u && (c ? c.length && d(c.shift()) : r ? (u = []) : p.disable());
      },
      p = {
        add: function () {
          if (u) {
            var t = u.length;
            (function t(n) {
              ue.each(n, function (n, i) {
                var r = ue.type(i);
                "function" === r
                  ? (e.unique && p.has(i)) || u.push(i)
                  : i && i.length && "string" !== r && t(i);
              });
            })(arguments),
              n ? (s = u.length) : r && ((l = t), d(r));
          }
          return this;
        },
        remove: function () {
          return (
            u &&
              ue.each(arguments, function (e, t) {
                for (var i; (i = ue.inArray(t, u, i)) > -1; )
                  u.splice(i, 1), n && (s >= i && s--, o >= i && o--);
              }),
            this
          );
        },
        has: function (e) {
          return e ? ue.inArray(e, u) > -1 : !(!u || !u.length);
        },
        empty: function () {
          return (u = []), (s = 0), this;
        },
        disable: function () {
          return (u = c = r = t), this;
        },
        disabled: function () {
          return !u;
        },
        lock: function () {
          return (c = t), r || p.disable(), this;
        },
        locked: function () {
          return !c;
        },
        fireWith: function (e, t) {
          return (
            !u ||
              (a && !c) ||
              ((t = t || []),
              (t = [e, t.slice ? t.slice() : t]),
              n ? c.push(t) : d(t)),
            this
          );
        },
        fire: function () {
          return p.fireWith(this, arguments), this;
        },
        fired: function () {
          return !!a;
        },
      };
    return p;
  }),
    ue.extend({
      Deferred: function (e) {
        var t = [
            ["resolve", "done", ue.Callbacks("once memory"), "resolved"],
            ["reject", "fail", ue.Callbacks("once memory"), "rejected"],
            ["notify", "progress", ue.Callbacks("memory")],
          ],
          n = "pending",
          i = {
            state: function () {
              return n;
            },
            always: function () {
              return r.done(arguments).fail(arguments), this;
            },
            then: function () {
              var e = arguments;
              return ue
                .Deferred(function (n) {
                  ue.each(t, function (t, a) {
                    var s = a[0],
                      o = ue.isFunction(e[t]) && e[t];
                    r[a[1]](function () {
                      var e = o && o.apply(this, arguments);
                      e && ue.isFunction(e.promise)
                        ? e
                            .promise()
                            .done(n.resolve)
                            .fail(n.reject)
                            .progress(n.notify)
                        : n[s + "With"](
                            this === i ? n.promise() : this,
                            o ? [e] : arguments
                          );
                    });
                  }),
                    (e = null);
                })
                .promise();
            },
            promise: function (e) {
              return null != e ? ue.extend(e, i) : i;
            },
          },
          r = {};
        return (
          (i.pipe = i.then),
          ue.each(t, function (e, a) {
            var s = a[2],
              o = a[3];
            (i[a[1]] = s.add),
              o &&
                s.add(
                  function () {
                    n = o;
                  },
                  t[1 ^ e][2].disable,
                  t[2][2].lock
                ),
              (r[a[0]] = function () {
                return r[a[0] + "With"](this === r ? i : this, arguments), this;
              }),
              (r[a[0] + "With"] = s.fireWith);
          }),
          i.promise(r),
          e && e.call(r, r),
          r
        );
      },
      when: function (e) {
        var t,
          n,
          i,
          r = 0,
          a = re.call(arguments),
          s = a.length,
          o = 1 !== s || (e && ue.isFunction(e.promise)) ? s : 0,
          l = 1 === o ? e : ue.Deferred(),
          u = function (e, n, i) {
            return function (r) {
              (n[e] = this),
                (i[e] = arguments.length > 1 ? re.call(arguments) : r),
                i === t ? l.notifyWith(n, i) : --o || l.resolveWith(n, i);
            };
          };
        if (s > 1)
          for (t = Array(s), n = Array(s), i = Array(s); s > r; r++)
            a[r] && ue.isFunction(a[r].promise)
              ? a[r]
                  .promise()
                  .done(u(r, i, a))
                  .fail(l.reject)
                  .progress(u(r, n, t))
              : --o;
        return o || l.resolveWith(i, a), l.promise();
      },
    }),
    (ue.support = (function (t) {
      var n,
        i,
        r,
        a,
        s,
        o,
        l,
        u,
        c,
        d = G.createElement("div");
      if (
        (d.setAttribute("className", "t"),
        (d.innerHTML =
          "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>"),
        (n = d.getElementsByTagName("*") || []),
        !(i = d.getElementsByTagName("a")[0]) || !i.style || !n.length)
      )
        return t;
      (o = (a = G.createElement("select")).appendChild(
        G.createElement("option")
      )),
        (r = d.getElementsByTagName("input")[0]),
        (i.style.cssText = "top:1px;float:left;opacity:.5"),
        (t.getSetAttribute = "t" !== d.className),
        (t.leadingWhitespace = 3 === d.firstChild.nodeType),
        (t.tbody = !d.getElementsByTagName("tbody").length),
        (t.htmlSerialize = !!d.getElementsByTagName("link").length),
        (t.style = /top/.test(i.getAttribute("style"))),
        (t.hrefNormalized = "/a" === i.getAttribute("href")),
        (t.opacity = /^0.5/.test(i.style.opacity)),
        (t.cssFloat = !!i.style.cssFloat),
        (t.checkOn = !!r.value),
        (t.optSelected = o.selected),
        (t.enctype = !!G.createElement("form").enctype),
        (t.html5Clone =
          "<:nav></:nav>" !== G.createElement("nav").cloneNode(!0).outerHTML),
        (t.inlineBlockNeedsLayout = !1),
        (t.shrinkWrapBlocks = !1),
        (t.pixelPosition = !1),
        (t.deleteExpando = !0),
        (t.noCloneEvent = !0),
        (t.reliableMarginRight = !0),
        (t.boxSizingReliable = !0),
        (r.checked = !0),
        (t.noCloneChecked = r.cloneNode(!0).checked),
        (a.disabled = !0),
        (t.optDisabled = !o.disabled);
      try {
        delete d.test;
      } catch (e) {
        t.deleteExpando = !1;
      }
      (r = G.createElement("input")).setAttribute("value", ""),
        (t.input = "" === r.getAttribute("value")),
        (r.value = "t"),
        r.setAttribute("type", "radio"),
        (t.radioValue = "t" === r.value),
        r.setAttribute("checked", "t"),
        r.setAttribute("name", "t"),
        (s = G.createDocumentFragment()).appendChild(r),
        (t.appendChecked = r.checked),
        (t.checkClone = s.cloneNode(!0).cloneNode(!0).lastChild.checked),
        d.attachEvent &&
          (d.attachEvent("onclick", function () {
            t.noCloneEvent = !1;
          }),
          d.cloneNode(!0).click());
      for (c in { submit: !0, change: !0, focusin: !0 })
        d.setAttribute((l = "on" + c), "t"),
          (t[c + "Bubbles"] = l in e || !1 === d.attributes[l].expando);
      (d.style.backgroundClip = "content-box"),
        (d.cloneNode(!0).style.backgroundClip = ""),
        (t.clearCloneStyle = "content-box" === d.style.backgroundClip);
      for (c in ue(t)) break;
      return (
        (t.ownLast = "0" !== c),
        ue(function () {
          var n,
            i,
            r,
            a =
              "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
            s = G.getElementsByTagName("body")[0];
          s &&
            ((n = G.createElement("div")),
            (n.style.cssText =
              "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px"),
            s.appendChild(n).appendChild(d),
            (d.innerHTML = "<table><tr><td></td><td>t</td></tr></table>"),
            (r = d.getElementsByTagName("td")),
            (r[0].style.cssText = "padding:0;margin:0;border:0;display:none"),
            (u = 0 === r[0].offsetHeight),
            (r[0].style.display = ""),
            (r[1].style.display = "none"),
            (t.reliableHiddenOffsets = u && 0 === r[0].offsetHeight),
            (d.innerHTML = ""),
            (d.style.cssText =
              "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;"),
            ue.swap(s, null != s.style.zoom ? { zoom: 1 } : {}, function () {
              t.boxSizing = 4 === d.offsetWidth;
            }),
            e.getComputedStyle &&
              ((t.pixelPosition =
                "1%" !== (e.getComputedStyle(d, null) || {}).top),
              (t.boxSizingReliable =
                "4px" ===
                (e.getComputedStyle(d, null) || { width: "4px" }).width),
              (i = d.appendChild(G.createElement("div"))),
              (i.style.cssText = d.style.cssText = a),
              (i.style.marginRight = i.style.width = "0"),
              (d.style.width = "1px"),
              (t.reliableMarginRight = !parseFloat(
                (e.getComputedStyle(i, null) || {}).marginRight
              ))),
            typeof d.style.zoom !== U &&
              ((d.innerHTML = ""),
              (d.style.cssText =
                a + "width:1px;padding:1px;display:inline;zoom:1"),
              (t.inlineBlockNeedsLayout = 3 === d.offsetWidth),
              (d.style.display = "block"),
              (d.innerHTML = "<div></div>"),
              (d.firstChild.style.width = "5px"),
              (t.shrinkWrapBlocks = 3 !== d.offsetWidth),
              t.inlineBlockNeedsLayout && (s.style.zoom = 1)),
            s.removeChild(n),
            (n = d = r = i = null));
        }),
        (n = a = s = o = i = r = null),
        t
      );
    })({}));
  var Ce = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
    Te = /([A-Z])/g;
  ue.extend({
    cache: {},
    noData: {
      applet: !0,
      embed: !0,
      object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
    },
    hasData: function (e) {
      return (
        !!(e = e.nodeType ? ue.cache[e[ue.expando]] : e[ue.expando]) && !o(e)
      );
    },
    data: function (e, t, n) {
      return r(e, t, n);
    },
    removeData: function (e, t) {
      return a(e, t);
    },
    _data: function (e, t, n) {
      return r(e, t, n, !0);
    },
    _removeData: function (e, t) {
      return a(e, t, !0);
    },
    acceptData: function (e) {
      if (e.nodeType && 1 !== e.nodeType && 9 !== e.nodeType) return !1;
      var t = e.nodeName && ue.noData[e.nodeName.toLowerCase()];
      return !t || (!0 !== t && e.getAttribute("classid") === t);
    },
  }),
    ue.fn.extend({
      data: function (e, n) {
        var i,
          r,
          a = null,
          o = 0,
          l = this[0];
        if (e === t) {
          if (
            this.length &&
            ((a = ue.data(l)), 1 === l.nodeType && !ue._data(l, "parsedAttrs"))
          ) {
            for (i = l.attributes; i.length > o; o++)
              0 === (r = i[o].name).indexOf("data-") &&
                ((r = ue.camelCase(r.slice(5))), s(l, r, a[r]));
            ue._data(l, "parsedAttrs", !0);
          }
          return a;
        }
        return "object" == typeof e
          ? this.each(function () {
              ue.data(this, e);
            })
          : arguments.length > 1
          ? this.each(function () {
              ue.data(this, e, n);
            })
          : l
          ? s(l, e, ue.data(l, e))
          : null;
      },
      removeData: function (e) {
        return this.each(function () {
          ue.removeData(this, e);
        });
      },
    }),
    ue.extend({
      queue: function (e, n, i) {
        var r;
        return e
          ? ((n = (n || "fx") + "queue"),
            (r = ue._data(e, n)),
            i &&
              (!r || ue.isArray(i)
                ? (r = ue._data(e, n, ue.makeArray(i)))
                : r.push(i)),
            r || [])
          : t;
      },
      dequeue: function (e, t) {
        t = t || "fx";
        var n = ue.queue(e, t),
          i = n.length,
          r = n.shift(),
          a = ue._queueHooks(e, t);
        "inprogress" === r && ((r = n.shift()), i--),
          r &&
            ("fx" === t && n.unshift("inprogress"),
            delete a.stop,
            r.call(
              e,
              function () {
                ue.dequeue(e, t);
              },
              a
            )),
          !i && a && a.empty.fire();
      },
      _queueHooks: function (e, t) {
        var n = t + "queueHooks";
        return (
          ue._data(e, n) ||
          ue._data(e, n, {
            empty: ue.Callbacks("once memory").add(function () {
              ue._removeData(e, t + "queue"), ue._removeData(e, n);
            }),
          })
        );
      },
    }),
    ue.fn.extend({
      queue: function (e, n) {
        var i = 2;
        return (
          "string" != typeof e && ((n = e), (e = "fx"), i--),
          i > arguments.length
            ? ue.queue(this[0], e)
            : n === t
            ? this
            : this.each(function () {
                var t = ue.queue(this, e, n);
                ue._queueHooks(this, e),
                  "fx" === e && "inprogress" !== t[0] && ue.dequeue(this, e);
              })
        );
      },
      dequeue: function (e) {
        return this.each(function () {
          ue.dequeue(this, e);
        });
      },
      delay: function (e, t) {
        return (
          (e = ue.fx ? ue.fx.speeds[e] || e : e),
          (t = t || "fx"),
          this.queue(t, function (t, n) {
            var i = setTimeout(t, e);
            n.stop = function () {
              clearTimeout(i);
            };
          })
        );
      },
      clearQueue: function (e) {
        return this.queue(e || "fx", []);
      },
      promise: function (e, n) {
        var i,
          r = 1,
          a = ue.Deferred(),
          s = this,
          o = this.length,
          l = function () {
            --r || a.resolveWith(s, [s]);
          };
        for ("string" != typeof e && ((n = e), (e = t)), e = e || "fx"; o--; )
          (i = ue._data(s[o], e + "queueHooks")) &&
            i.empty &&
            (r++, i.empty.add(l));
        return l(), a.promise(n);
      },
    });
  var Ne,
    Me,
    Se = /[\t\r\n\f]/g,
    $e = /\r/g,
    Ae = /^(?:input|select|textarea|button|object)$/i,
    Ee = /^(?:a|area)$/i,
    je = /^(?:checked|selected)$/i,
    Ie = ue.support.getSetAttribute,
    Fe = ue.support.input;
  ue.fn.extend({
    attr: function (e, t) {
      return ue.access(this, ue.attr, e, t, arguments.length > 1);
    },
    removeAttr: function (e) {
      return this.each(function () {
        ue.removeAttr(this, e);
      });
    },
    prop: function (e, t) {
      return ue.access(this, ue.prop, e, t, arguments.length > 1);
    },
    removeProp: function (e) {
      return (
        (e = ue.propFix[e] || e),
        this.each(function () {
          try {
            (this[e] = t), delete this[e];
          } catch (e) {}
        })
      );
    },
    addClass: function (e) {
      var t,
        n,
        i,
        r,
        a,
        s = 0,
        o = this.length,
        l = "string" == typeof e && e;
      if (ue.isFunction(e))
        return this.each(function (t) {
          ue(this).addClass(e.call(this, t, this.className));
        });
      if (l)
        for (t = (e || "").match(de) || []; o > s; s++)
          if (
            ((n = this[s]),
            (i =
              1 === n.nodeType &&
              (n.className ? (" " + n.className + " ").replace(Se, " ") : " ")))
          ) {
            for (a = 0; (r = t[a++]); )
              0 > i.indexOf(" " + r + " ") && (i += r + " ");
            n.className = ue.trim(i);
          }
      return this;
    },
    removeClass: function (e) {
      var t,
        n,
        i,
        r,
        a,
        s = 0,
        o = this.length,
        l = 0 === arguments.length || ("string" == typeof e && e);
      if (ue.isFunction(e))
        return this.each(function (t) {
          ue(this).removeClass(e.call(this, t, this.className));
        });
      if (l)
        for (t = (e || "").match(de) || []; o > s; s++)
          if (
            ((n = this[s]),
            (i =
              1 === n.nodeType &&
              (n.className ? (" " + n.className + " ").replace(Se, " ") : "")))
          ) {
            for (a = 0; (r = t[a++]); )
              for (; i.indexOf(" " + r + " ") >= 0; )
                i = i.replace(" " + r + " ", " ");
            n.className = e ? ue.trim(i) : "";
          }
      return this;
    },
    toggleClass: function (e, t) {
      var n = typeof e;
      return "boolean" == typeof t && "string" === n
        ? t
          ? this.addClass(e)
          : this.removeClass(e)
        : ue.isFunction(e)
        ? this.each(function (n) {
            ue(this).toggleClass(e.call(this, n, this.className, t), t);
          })
        : this.each(function () {
            if ("string" === n)
              for (
                var t, i = 0, r = ue(this), a = e.match(de) || [];
                (t = a[i++]);

              )
                r.hasClass(t) ? r.removeClass(t) : r.addClass(t);
            else
              (n === U || "boolean" === n) &&
                (this.className &&
                  ue._data(this, "__className__", this.className),
                (this.className =
                  this.className || !1 === e
                    ? ""
                    : ue._data(this, "__className__") || ""));
          });
    },
    hasClass: function (e) {
      for (var t = " " + e + " ", n = 0, i = this.length; i > n; n++)
        if (
          1 === this[n].nodeType &&
          (" " + this[n].className + " ").replace(Se, " ").indexOf(t) >= 0
        )
          return !0;
      return !1;
    },
    val: function (e) {
      var n,
        i,
        r,
        a = this[0];
      return arguments.length
        ? ((r = ue.isFunction(e)),
          this.each(function (n) {
            var a;
            1 === this.nodeType &&
              ((a = r ? e.call(this, n, ue(this).val()) : e),
              null == a
                ? (a = "")
                : "number" == typeof a
                ? (a += "")
                : ue.isArray(a) &&
                  (a = ue.map(a, function (e) {
                    return null == e ? "" : e + "";
                  })),
              ((i =
                ue.valHooks[this.type] ||
                ue.valHooks[this.nodeName.toLowerCase()]) &&
                "set" in i &&
                i.set(this, a, "value") !== t) ||
                (this.value = a));
          }))
        : a
        ? ((i = ue.valHooks[a.type] || ue.valHooks[a.nodeName.toLowerCase()]),
          i && "get" in i && (n = i.get(a, "value")) !== t
            ? n
            : ((n = a.value),
              "string" == typeof n ? n.replace($e, "") : null == n ? "" : n))
        : void 0;
    },
  }),
    ue.extend({
      valHooks: {
        option: {
          get: function (e) {
            var t = ue.find.attr(e, "value");
            return null != t ? t : e.text;
          },
        },
        select: {
          get: function (e) {
            for (
              var t,
                n,
                i = e.options,
                r = e.selectedIndex,
                a = "select-one" === e.type || 0 > r,
                s = a ? null : [],
                o = a ? r + 1 : i.length,
                l = 0 > r ? o : a ? r : 0;
              o > l;
              l++
            )
              if (
                !(
                  (!(n = i[l]).selected && l !== r) ||
                  (ue.support.optDisabled
                    ? n.disabled
                    : null !== n.getAttribute("disabled")) ||
                  (n.parentNode.disabled &&
                    ue.nodeName(n.parentNode, "optgroup"))
                )
              ) {
                if (((t = ue(n).val()), a)) return t;
                s.push(t);
              }
            return s;
          },
          set: function (e, t) {
            for (
              var n, i, r = e.options, a = ue.makeArray(t), s = r.length;
              s--;

            )
              (i = r[s]),
                (i.selected = ue.inArray(ue(i).val(), a) >= 0) && (n = !0);
            return n || (e.selectedIndex = -1), a;
          },
        },
      },
      attr: function (e, n, i) {
        var r,
          a,
          s = e.nodeType;
        if (e && 3 !== s && 8 !== s && 2 !== s)
          return typeof e.getAttribute === U
            ? ue.prop(e, n, i)
            : ((1 === s && ue.isXMLDoc(e)) ||
                ((n = n.toLowerCase()),
                (r =
                  ue.attrHooks[n] || (ue.expr.match.bool.test(n) ? Me : Ne))),
              i === t
                ? r && "get" in r && null !== (a = r.get(e, n))
                  ? a
                  : ((a = ue.find.attr(e, n)), null == a ? t : a)
                : null !== i
                ? r && "set" in r && (a = r.set(e, i, n)) !== t
                  ? a
                  : (e.setAttribute(n, i + ""), i)
                : (ue.removeAttr(e, n), t));
      },
      removeAttr: function (e, t) {
        var n,
          i,
          r = 0,
          a = t && t.match(de);
        if (a && 1 === e.nodeType)
          for (; (n = a[r++]); )
            (i = ue.propFix[n] || n),
              ue.expr.match.bool.test(n)
                ? (Fe && Ie) || !je.test(n)
                  ? (e[i] = !1)
                  : (e[ue.camelCase("default-" + n)] = e[i] = !1)
                : ue.attr(e, n, ""),
              e.removeAttribute(Ie ? n : i);
      },
      attrHooks: {
        type: {
          set: function (e, t) {
            if (
              !ue.support.radioValue &&
              "radio" === t &&
              ue.nodeName(e, "input")
            ) {
              var n = e.value;
              return e.setAttribute("type", t), n && (e.value = n), t;
            }
          },
        },
      },
      propFix: { for: "htmlFor", class: "className" },
      prop: function (e, n, i) {
        var r,
          a,
          s = e.nodeType;
        if (e && 3 !== s && 8 !== s && 2 !== s)
          return (
            (1 !== s || !ue.isXMLDoc(e)) &&
              ((n = ue.propFix[n] || n), (a = ue.propHooks[n])),
            i !== t
              ? a && "set" in a && (r = a.set(e, i, n)) !== t
                ? r
                : (e[n] = i)
              : a && "get" in a && null !== (r = a.get(e, n))
              ? r
              : e[n]
          );
      },
      propHooks: {
        tabIndex: {
          get: function (e) {
            var t = ue.find.attr(e, "tabindex");
            return t
              ? parseInt(t, 10)
              : Ae.test(e.nodeName) || (Ee.test(e.nodeName) && e.href)
              ? 0
              : -1;
          },
        },
      },
    }),
    (Me = {
      set: function (e, t, n) {
        return (
          !1 === t
            ? ue.removeAttr(e, n)
            : (Fe && Ie) || !je.test(n)
            ? e.setAttribute((!Ie && ue.propFix[n]) || n, n)
            : (e[ue.camelCase("default-" + n)] = e[n] = !0),
          n
        );
      },
    }),
    ue.each(ue.expr.match.bool.source.match(/\w+/g), function (e, n) {
      var i = ue.expr.attrHandle[n] || ue.find.attr;
      ue.expr.attrHandle[n] =
        (Fe && Ie) || !je.test(n)
          ? function (e, n, r) {
              var a = ue.expr.attrHandle[n],
                s = r
                  ? t
                  : (ue.expr.attrHandle[n] = t) != i(e, n, r)
                  ? n.toLowerCase()
                  : null;
              return (ue.expr.attrHandle[n] = a), s;
            }
          : function (e, n, i) {
              return i
                ? t
                : e[ue.camelCase("default-" + n)]
                ? n.toLowerCase()
                : null;
            };
    }),
    (Fe && Ie) ||
      (ue.attrHooks.value = {
        set: function (e, n, i) {
          return ue.nodeName(e, "input")
            ? ((e.defaultValue = n), t)
            : Ne && Ne.set(e, n, i);
        },
      }),
    Ie ||
      ((Ne = {
        set: function (e, n, i) {
          var r = e.getAttributeNode(i);
          return (
            r || e.setAttributeNode((r = e.ownerDocument.createAttribute(i))),
            (r.value = n += ""),
            "value" === i || n === e.getAttribute(i) ? n : t
          );
        },
      }),
      (ue.expr.attrHandle.id =
        ue.expr.attrHandle.name =
        ue.expr.attrHandle.coords =
          function (e, n, i) {
            var r;
            return i
              ? t
              : (r = e.getAttributeNode(n)) && "" !== r.value
              ? r.value
              : null;
          }),
      (ue.valHooks.button = {
        get: function (e, n) {
          var i = e.getAttributeNode(n);
          return i && i.specified ? i.value : t;
        },
        set: Ne.set,
      }),
      (ue.attrHooks.contenteditable = {
        set: function (e, t, n) {
          Ne.set(e, "" !== t && t, n);
        },
      }),
      ue.each(["width", "height"], function (e, n) {
        ue.attrHooks[n] = {
          set: function (e, i) {
            return "" === i ? (e.setAttribute(n, "auto"), i) : t;
          },
        };
      })),
    ue.support.hrefNormalized ||
      ue.each(["href", "src"], function (e, t) {
        ue.propHooks[t] = {
          get: function (e) {
            return e.getAttribute(t, 4);
          },
        };
      }),
    ue.support.style ||
      (ue.attrHooks.style = {
        get: function (e) {
          return e.style.cssText || t;
        },
        set: function (e, t) {
          return (e.style.cssText = t + "");
        },
      }),
    ue.support.optSelected ||
      (ue.propHooks.selected = {
        get: function (e) {
          var t = e.parentNode;
          return (
            t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex),
            null
          );
        },
      }),
    ue.each(
      [
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable",
      ],
      function () {
        ue.propFix[this.toLowerCase()] = this;
      }
    ),
    ue.support.enctype || (ue.propFix.enctype = "encoding"),
    ue.each(["radio", "checkbox"], function () {
      (ue.valHooks[this] = {
        set: function (e, n) {
          return ue.isArray(n)
            ? (e.checked = ue.inArray(ue(e).val(), n) >= 0)
            : t;
        },
      }),
        ue.support.checkOn ||
          (ue.valHooks[this].get = function (e) {
            return null === e.getAttribute("value") ? "on" : e.value;
          });
    });
  var Le = /^(?:input|select|textarea)$/i,
    He = /^key/,
    Oe = /^(?:mouse|contextmenu)|click/,
    Pe = /^(?:focusinfocus|focusoutblur)$/,
    Re = /^([^.]*)(?:\.(.+)|)$/;
  (ue.event = {
    global: {},
    add: function (e, n, i, r, a) {
      var s,
        o,
        l,
        u,
        c,
        d,
        p,
        h,
        f,
        g,
        m,
        y = ue._data(e);
      if (y) {
        for (
          i.handler && ((u = i), (i = u.handler), (a = u.selector)),
            i.guid || (i.guid = ue.guid++),
            (o = y.events) || (o = y.events = {}),
            (d = y.handle) ||
              ((d = y.handle =
                function (e) {
                  return typeof ue === U || (e && ue.event.triggered === e.type)
                    ? t
                    : ue.event.dispatch.apply(d.elem, arguments);
                }),
              (d.elem = e)),
            l = (n = (n || "").match(de) || [""]).length;
          l--;

        )
          (s = Re.exec(n[l]) || []),
            (f = m = s[1]),
            (g = (s[2] || "").split(".").sort()),
            f &&
              ((c = ue.event.special[f] || {}),
              (f = (a ? c.delegateType : c.bindType) || f),
              (c = ue.event.special[f] || {}),
              (p = ue.extend(
                {
                  type: f,
                  origType: m,
                  data: r,
                  handler: i,
                  guid: i.guid,
                  selector: a,
                  needsContext: a && ue.expr.match.needsContext.test(a),
                  namespace: g.join("."),
                },
                u
              )),
              (h = o[f]) ||
                ((h = o[f] = []),
                (h.delegateCount = 0),
                (c.setup && !1 !== c.setup.call(e, r, g, d)) ||
                  (e.addEventListener
                    ? e.addEventListener(f, d, !1)
                    : e.attachEvent && e.attachEvent("on" + f, d))),
              c.add &&
                (c.add.call(e, p), p.handler.guid || (p.handler.guid = i.guid)),
              a ? h.splice(h.delegateCount++, 0, p) : h.push(p),
              (ue.event.global[f] = !0));
        e = null;
      }
    },
    remove: function (e, t, n, i, r) {
      var a,
        s,
        o,
        l,
        u,
        c,
        d,
        p,
        h,
        f,
        g,
        m = ue.hasData(e) && ue._data(e);
      if (m && (c = m.events)) {
        for (u = (t = (t || "").match(de) || [""]).length; u--; )
          if (
            ((o = Re.exec(t[u]) || []),
            (h = g = o[1]),
            (f = (o[2] || "").split(".").sort()),
            h)
          ) {
            for (
              d = ue.event.special[h] || {},
                p = c[(h = (i ? d.delegateType : d.bindType) || h)] || [],
                o =
                  o[2] &&
                  RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                l = a = p.length;
              a--;

            )
              (s = p[a]),
                (!r && g !== s.origType) ||
                  (n && n.guid !== s.guid) ||
                  (o && !o.test(s.namespace)) ||
                  (i && i !== s.selector && ("**" !== i || !s.selector)) ||
                  (p.splice(a, 1),
                  s.selector && p.delegateCount--,
                  d.remove && d.remove.call(e, s));
            l &&
              !p.length &&
              ((d.teardown && !1 !== d.teardown.call(e, f, m.handle)) ||
                ue.removeEvent(e, h, m.handle),
              delete c[h]);
          } else for (h in c) ue.event.remove(e, h + t[u], n, i, !0);
        ue.isEmptyObject(c) && (delete m.handle, ue._removeData(e, "events"));
      }
    },
    trigger: function (n, i, r, a) {
      var s,
        o,
        l,
        u,
        c,
        d,
        p,
        h = [r || G],
        f = oe.call(n, "type") ? n.type : n,
        g = oe.call(n, "namespace") ? n.namespace.split(".") : [];
      if (
        ((l = d = r = r || G),
        3 !== r.nodeType &&
          8 !== r.nodeType &&
          !Pe.test(f + ue.event.triggered) &&
          (f.indexOf(".") >= 0 &&
            ((g = f.split(".")), (f = g.shift()), g.sort()),
          (o = 0 > f.indexOf(":") && "on" + f),
          (n = n[ue.expando] ? n : new ue.Event(f, "object" == typeof n && n)),
          (n.isTrigger = a ? 2 : 3),
          (n.namespace = g.join(".")),
          (n.namespace_re = n.namespace
            ? RegExp("(^|\\.)" + g.join("\\.(?:.*\\.|)") + "(\\.|$)")
            : null),
          (n.result = t),
          n.target || (n.target = r),
          (i = null == i ? [n] : ue.makeArray(i, [n])),
          (c = ue.event.special[f] || {}),
          a || !c.trigger || !1 !== c.trigger.apply(r, i)))
      ) {
        if (!a && !c.noBubble && !ue.isWindow(r)) {
          for (
            u = c.delegateType || f, Pe.test(u + f) || (l = l.parentNode);
            l;
            l = l.parentNode
          )
            h.push(l), (d = l);
          d === (r.ownerDocument || G) &&
            h.push(d.defaultView || d.parentWindow || e);
        }
        for (p = 0; (l = h[p++]) && !n.isPropagationStopped(); )
          (n.type = p > 1 ? u : c.bindType || f),
            (s =
              (ue._data(l, "events") || {})[n.type] && ue._data(l, "handle")) &&
              s.apply(l, i),
            (s = o && l[o]) &&
              ue.acceptData(l) &&
              s.apply &&
              !1 === s.apply(l, i) &&
              n.preventDefault();
        if (
          ((n.type = f),
          !a &&
            !n.isDefaultPrevented() &&
            (!c._default || !1 === c._default.apply(h.pop(), i)) &&
            ue.acceptData(r) &&
            o &&
            r[f] &&
            !ue.isWindow(r))
        ) {
          (d = r[o]) && (r[o] = null), (ue.event.triggered = f);
          try {
            r[f]();
          } catch (e) {}
          (ue.event.triggered = t), d && (r[o] = d);
        }
        return n.result;
      }
    },
    dispatch: function (e) {
      e = ue.event.fix(e);
      var n,
        i,
        r,
        a,
        s,
        o = [],
        l = re.call(arguments),
        u = (ue._data(this, "events") || {})[e.type] || [],
        c = ue.event.special[e.type] || {};
      if (
        ((l[0] = e),
        (e.delegateTarget = this),
        !c.preDispatch || !1 !== c.preDispatch.call(this, e))
      ) {
        for (
          o = ue.event.handlers.call(this, e, u), n = 0;
          (a = o[n++]) && !e.isPropagationStopped();

        )
          for (
            e.currentTarget = a.elem, s = 0;
            (r = a.handlers[s++]) && !e.isImmediatePropagationStopped();

          )
            (!e.namespace_re || e.namespace_re.test(r.namespace)) &&
              ((e.handleObj = r),
              (e.data = r.data),
              (i = (
                (ue.event.special[r.origType] || {}).handle || r.handler
              ).apply(a.elem, l)) !== t &&
                !1 === (e.result = i) &&
                (e.preventDefault(), e.stopPropagation()));
        return c.postDispatch && c.postDispatch.call(this, e), e.result;
      }
    },
    handlers: function (e, n) {
      var i,
        r,
        a,
        s,
        o = [],
        l = n.delegateCount,
        u = e.target;
      if (l && u.nodeType && (!e.button || "click" !== e.type))
        for (; u != this; u = u.parentNode || this)
          if (1 === u.nodeType && (!0 !== u.disabled || "click" !== e.type)) {
            for (a = [], s = 0; l > s; s++)
              (r = n[s]),
                (i = r.selector + " "),
                a[i] === t &&
                  (a[i] = r.needsContext
                    ? ue(i, this).index(u) >= 0
                    : ue.find(i, this, null, [u]).length),
                a[i] && a.push(r);
            a.length && o.push({ elem: u, handlers: a });
          }
      return n.length > l && o.push({ elem: this, handlers: n.slice(l) }), o;
    },
    fix: function (e) {
      if (e[ue.expando]) return e;
      var t,
        n,
        i,
        r = e.type,
        a = e,
        s = this.fixHooks[r];
      for (
        s ||
          (this.fixHooks[r] = s =
            Oe.test(r) ? this.mouseHooks : He.test(r) ? this.keyHooks : {}),
          i = s.props ? this.props.concat(s.props) : this.props,
          e = new ue.Event(a),
          t = i.length;
        t--;

      )
        (n = i[t]), (e[n] = a[n]);
      return (
        e.target || (e.target = a.srcElement || G),
        3 === e.target.nodeType && (e.target = e.target.parentNode),
        (e.metaKey = !!e.metaKey),
        s.filter ? s.filter(e, a) : e
      );
    },
    props:
      "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(
        " "
      ),
    fixHooks: {},
    keyHooks: {
      props: "char charCode key keyCode".split(" "),
      filter: function (e, t) {
        return (
          null == e.which &&
            (e.which = null != t.charCode ? t.charCode : t.keyCode),
          e
        );
      },
    },
    mouseHooks: {
      props:
        "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(
          " "
        ),
      filter: function (e, n) {
        var i,
          r,
          a,
          s = n.button,
          o = n.fromElement;
        return (
          null == e.pageX &&
            null != n.clientX &&
            ((r = e.target.ownerDocument || G),
            (a = r.documentElement),
            (i = r.body),
            (e.pageX =
              n.clientX +
              ((a && a.scrollLeft) || (i && i.scrollLeft) || 0) -
              ((a && a.clientLeft) || (i && i.clientLeft) || 0)),
            (e.pageY =
              n.clientY +
              ((a && a.scrollTop) || (i && i.scrollTop) || 0) -
              ((a && a.clientTop) || (i && i.clientTop) || 0))),
          !e.relatedTarget &&
            o &&
            (e.relatedTarget = o === e.target ? n.toElement : o),
          e.which ||
            s === t ||
            (e.which = 1 & s ? 1 : 2 & s ? 3 : 4 & s ? 2 : 0),
          e
        );
      },
    },
    special: {
      load: { noBubble: !0 },
      focus: {
        trigger: function () {
          if (this !== c() && this.focus)
            try {
              return this.focus(), !1;
            } catch (e) {}
        },
        delegateType: "focusin",
      },
      blur: {
        trigger: function () {
          return this === c() && this.blur ? (this.blur(), !1) : t;
        },
        delegateType: "focusout",
      },
      click: {
        trigger: function () {
          return ue.nodeName(this, "input") &&
            "checkbox" === this.type &&
            this.click
            ? (this.click(), !1)
            : t;
        },
        _default: function (e) {
          return ue.nodeName(e.target, "a");
        },
      },
      beforeunload: {
        postDispatch: function (e) {
          e.result !== t && (e.originalEvent.returnValue = e.result);
        },
      },
    },
    simulate: function (e, t, n, i) {
      var r = ue.extend(new ue.Event(), n, {
        type: e,
        isSimulated: !0,
        originalEvent: {},
      });
      i ? ue.event.trigger(r, null, t) : ue.event.dispatch.call(t, r),
        r.isDefaultPrevented() && n.preventDefault();
    },
  }),
    (ue.removeEvent = G.removeEventListener
      ? function (e, t, n) {
          e.removeEventListener && e.removeEventListener(t, n, !1);
        }
      : function (e, t, n) {
          var i = "on" + t;
          e.detachEvent &&
            (typeof e[i] === U && (e[i] = null), e.detachEvent(i, n));
        }),
    (ue.Event = function (e, n) {
      return this instanceof ue.Event
        ? (e && e.type
            ? ((this.originalEvent = e),
              (this.type = e.type),
              (this.isDefaultPrevented =
                e.defaultPrevented ||
                !1 === e.returnValue ||
                (e.getPreventDefault && e.getPreventDefault())
                  ? l
                  : u))
            : (this.type = e),
          n && ue.extend(this, n),
          (this.timeStamp = (e && e.timeStamp) || ue.now()),
          (this[ue.expando] = !0),
          t)
        : new ue.Event(e, n);
    }),
    (ue.Event.prototype = {
      isDefaultPrevented: u,
      isPropagationStopped: u,
      isImmediatePropagationStopped: u,
      preventDefault: function () {
        var e = this.originalEvent;
        (this.isDefaultPrevented = l),
          e && (e.preventDefault ? e.preventDefault() : (e.returnValue = !1));
      },
      stopPropagation: function () {
        var e = this.originalEvent;
        (this.isPropagationStopped = l),
          e &&
            (e.stopPropagation && e.stopPropagation(), (e.cancelBubble = !0));
      },
      stopImmediatePropagation: function () {
        (this.isImmediatePropagationStopped = l), this.stopPropagation();
      },
    }),
    ue.each(
      { mouseenter: "mouseover", mouseleave: "mouseout" },
      function (e, t) {
        ue.event.special[e] = {
          delegateType: t,
          bindType: t,
          handle: function (e) {
            var n,
              i = this,
              r = e.relatedTarget,
              a = e.handleObj;
            return (
              (!r || (r !== i && !ue.contains(i, r))) &&
                ((e.type = a.origType),
                (n = a.handler.apply(this, arguments)),
                (e.type = t)),
              n
            );
          },
        };
      }
    ),
    ue.support.submitBubbles ||
      (ue.event.special.submit = {
        setup: function () {
          return (
            !ue.nodeName(this, "form") &&
            (ue.event.add(this, "click._submit keypress._submit", function (e) {
              var n = e.target,
                i =
                  ue.nodeName(n, "input") || ue.nodeName(n, "button")
                    ? n.form
                    : t;
              i &&
                !ue._data(i, "submitBubbles") &&
                (ue.event.add(i, "submit._submit", function (e) {
                  e._submit_bubble = !0;
                }),
                ue._data(i, "submitBubbles", !0));
            }),
            t)
          );
        },
        postDispatch: function (e) {
          e._submit_bubble &&
            (delete e._submit_bubble,
            this.parentNode &&
              !e.isTrigger &&
              ue.event.simulate("submit", this.parentNode, e, !0));
        },
        teardown: function () {
          return (
            !ue.nodeName(this, "form") && (ue.event.remove(this, "._submit"), t)
          );
        },
      }),
    ue.support.changeBubbles ||
      (ue.event.special.change = {
        setup: function () {
          return Le.test(this.nodeName)
            ? (("checkbox" === this.type || "radio" === this.type) &&
                (ue.event.add(this, "propertychange._change", function (e) {
                  "checked" === e.originalEvent.propertyName &&
                    (this._just_changed = !0);
                }),
                ue.event.add(this, "click._change", function (e) {
                  this._just_changed &&
                    !e.isTrigger &&
                    (this._just_changed = !1),
                    ue.event.simulate("change", this, e, !0);
                })),
              !1)
            : (ue.event.add(this, "beforeactivate._change", function (e) {
                var t = e.target;
                Le.test(t.nodeName) &&
                  !ue._data(t, "changeBubbles") &&
                  (ue.event.add(t, "change._change", function (e) {
                    !this.parentNode ||
                      e.isSimulated ||
                      e.isTrigger ||
                      ue.event.simulate("change", this.parentNode, e, !0);
                  }),
                  ue._data(t, "changeBubbles", !0));
              }),
              t);
        },
        handle: function (e) {
          var n = e.target;
          return this !== n ||
            e.isSimulated ||
            e.isTrigger ||
            ("radio" !== n.type && "checkbox" !== n.type)
            ? e.handleObj.handler.apply(this, arguments)
            : t;
        },
        teardown: function () {
          return ue.event.remove(this, "._change"), !Le.test(this.nodeName);
        },
      }),
    ue.support.focusinBubbles ||
      ue.each({ focus: "focusin", blur: "focusout" }, function (e, t) {
        var n = 0,
          i = function (e) {
            ue.event.simulate(t, e.target, ue.event.fix(e), !0);
          };
        ue.event.special[t] = {
          setup: function () {
            0 == n++ && G.addEventListener(e, i, !0);
          },
          teardown: function () {
            0 == --n && G.removeEventListener(e, i, !0);
          },
        };
      }),
    ue.fn.extend({
      on: function (e, n, i, r, a) {
        var s, o;
        if ("object" == typeof e) {
          "string" != typeof n && ((i = i || n), (n = t));
          for (s in e) this.on(s, n, i, e[s], a);
          return this;
        }
        if (
          (null == i && null == r
            ? ((r = n), (i = n = t))
            : null == r &&
              ("string" == typeof n
                ? ((r = i), (i = t))
                : ((r = i), (i = n), (n = t))),
          !1 === r)
        )
          r = u;
        else if (!r) return this;
        return (
          1 === a &&
            ((o = r),
            (r = function (e) {
              return ue().off(e), o.apply(this, arguments);
            }),
            (r.guid = o.guid || (o.guid = ue.guid++))),
          this.each(function () {
            ue.event.add(this, e, r, i, n);
          })
        );
      },
      one: function (e, t, n, i) {
        return this.on(e, t, n, i, 1);
      },
      off: function (e, n, i) {
        var r, a;
        if (e && e.preventDefault && e.handleObj)
          return (
            (r = e.handleObj),
            ue(e.delegateTarget).off(
              r.namespace ? r.origType + "." + r.namespace : r.origType,
              r.selector,
              r.handler
            ),
            this
          );
        if ("object" == typeof e) {
          for (a in e) this.off(a, n, e[a]);
          return this;
        }
        return (
          (!1 === n || "function" == typeof n) && ((i = n), (n = t)),
          !1 === i && (i = u),
          this.each(function () {
            ue.event.remove(this, e, i, n);
          })
        );
      },
      trigger: function (e, t) {
        return this.each(function () {
          ue.event.trigger(e, t, this);
        });
      },
      triggerHandler: function (e, n) {
        var i = this[0];
        return i ? ue.event.trigger(e, n, i, !0) : t;
      },
    });
  var Ye = /^.[^:#\[\.,]*$/,
    qe = /^(?:parents|prev(?:Until|All))/,
    We = ue.expr.match.needsContext,
    Be = { children: !0, contents: !0, next: !0, prev: !0 };
  ue.fn.extend({
    find: function (e) {
      var t,
        n = [],
        i = this,
        r = i.length;
      if ("string" != typeof e)
        return this.pushStack(
          ue(e).filter(function () {
            for (t = 0; r > t; t++) if (ue.contains(i[t], this)) return !0;
          })
        );
      for (t = 0; r > t; t++) ue.find(e, i[t], n);
      return (
        (n = this.pushStack(r > 1 ? ue.unique(n) : n)),
        (n.selector = this.selector ? this.selector + " " + e : e),
        n
      );
    },
    has: function (e) {
      var t,
        n = ue(e, this),
        i = n.length;
      return this.filter(function () {
        for (t = 0; i > t; t++) if (ue.contains(this, n[t])) return !0;
      });
    },
    not: function (e) {
      return this.pushStack(p(this, e || [], !0));
    },
    filter: function (e) {
      return this.pushStack(p(this, e || [], !1));
    },
    is: function (e) {
      return !!p(this, "string" == typeof e && We.test(e) ? ue(e) : e || [], !1)
        .length;
    },
    closest: function (e, t) {
      for (
        var n,
          i = 0,
          r = this.length,
          a = [],
          s = We.test(e) || "string" != typeof e ? ue(e, t || this.context) : 0;
        r > i;
        i++
      )
        for (n = this[i]; n && n !== t; n = n.parentNode)
          if (
            11 > n.nodeType &&
            (s
              ? s.index(n) > -1
              : 1 === n.nodeType && ue.find.matchesSelector(n, e))
          ) {
            n = a.push(n);
            break;
          }
      return this.pushStack(a.length > 1 ? ue.unique(a) : a);
    },
    index: function (e) {
      return e
        ? "string" == typeof e
          ? ue.inArray(this[0], ue(e))
          : ue.inArray(e.jquery ? e[0] : e, this)
        : this[0] && this[0].parentNode
        ? this.first().prevAll().length
        : -1;
    },
    add: function (e, t) {
      var n =
          "string" == typeof e
            ? ue(e, t)
            : ue.makeArray(e && e.nodeType ? [e] : e),
        i = ue.merge(this.get(), n);
      return this.pushStack(ue.unique(i));
    },
    addBack: function (e) {
      return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
    },
  }),
    ue.each(
      {
        parent: function (e) {
          var t = e.parentNode;
          return t && 11 !== t.nodeType ? t : null;
        },
        parents: function (e) {
          return ue.dir(e, "parentNode");
        },
        parentsUntil: function (e, t, n) {
          return ue.dir(e, "parentNode", n);
        },
        next: function (e) {
          return d(e, "nextSibling");
        },
        prev: function (e) {
          return d(e, "previousSibling");
        },
        nextAll: function (e) {
          return ue.dir(e, "nextSibling");
        },
        prevAll: function (e) {
          return ue.dir(e, "previousSibling");
        },
        nextUntil: function (e, t, n) {
          return ue.dir(e, "nextSibling", n);
        },
        prevUntil: function (e, t, n) {
          return ue.dir(e, "previousSibling", n);
        },
        siblings: function (e) {
          return ue.sibling((e.parentNode || {}).firstChild, e);
        },
        children: function (e) {
          return ue.sibling(e.firstChild);
        },
        contents: function (e) {
          return ue.nodeName(e, "iframe")
            ? e.contentDocument || e.contentWindow.document
            : ue.merge([], e.childNodes);
        },
      },
      function (e, t) {
        ue.fn[e] = function (n, i) {
          var r = ue.map(this, t, n);
          return (
            "Until" !== e.slice(-5) && (i = n),
            i && "string" == typeof i && (r = ue.filter(i, r)),
            this.length > 1 &&
              (Be[e] || (r = ue.unique(r)), qe.test(e) && (r = r.reverse())),
            this.pushStack(r)
          );
        };
      }
    ),
    ue.extend({
      filter: function (e, t, n) {
        var i = t[0];
        return (
          n && (e = ":not(" + e + ")"),
          1 === t.length && 1 === i.nodeType
            ? ue.find.matchesSelector(i, e)
              ? [i]
              : []
            : ue.find.matches(
                e,
                ue.grep(t, function (e) {
                  return 1 === e.nodeType;
                })
              )
        );
      },
      dir: function (e, n, i) {
        for (
          var r = [], a = e[n];
          a &&
          9 !== a.nodeType &&
          (i === t || 1 !== a.nodeType || !ue(a).is(i));

        )
          1 === a.nodeType && r.push(a), (a = a[n]);
        return r;
      },
      sibling: function (e, t) {
        for (var n = []; e; e = e.nextSibling)
          1 === e.nodeType && e !== t && n.push(e);
        return n;
      },
    });
  var ze =
      "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
    Ke = / jQuery\d+="(?:null|\d+)"/g,
    Ue = RegExp("<(?:" + ze + ")[\\s/>]", "i"),
    Xe = /^\s+/,
    Ge =
      /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    Ve = /<([\w:]+)/,
    Je = /<tbody/i,
    Qe = /<|&#?\w+;/,
    Ze = /<(?:script|style|link)/i,
    et = /^(?:checkbox|radio)$/i,
    tt = /checked\s*(?:[^=]|=\s*.checked.)/i,
    nt = /^$|\/(?:java|ecma)script/i,
    it = /^true\/(.*)/,
    rt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
    at = {
      option: [1, "<select multiple='multiple'>", "</select>"],
      legend: [1, "<fieldset>", "</fieldset>"],
      area: [1, "<map>", "</map>"],
      param: [1, "<object>", "</object>"],
      thead: [1, "<table>", "</table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      _default: ue.support.htmlSerialize
        ? [0, "", ""]
        : [1, "X<div>", "</div>"],
    },
    st = h(G).appendChild(G.createElement("div"));
  (at.optgroup = at.option),
    (at.tbody = at.tfoot = at.colgroup = at.caption = at.thead),
    (at.th = at.td),
    ue.fn.extend({
      text: function (e) {
        return ue.access(
          this,
          function (e) {
            return e === t
              ? ue.text(this)
              : this.empty().append(
                  ((this[0] && this[0].ownerDocument) || G).createTextNode(e)
                );
          },
          null,
          e,
          arguments.length
        );
      },
      append: function () {
        return this.domManip(arguments, function (e) {
          (1 !== this.nodeType &&
            11 !== this.nodeType &&
            9 !== this.nodeType) ||
            f(this, e).appendChild(e);
        });
      },
      prepend: function () {
        return this.domManip(arguments, function (e) {
          if (
            1 === this.nodeType ||
            11 === this.nodeType ||
            9 === this.nodeType
          ) {
            var t = f(this, e);
            t.insertBefore(e, t.firstChild);
          }
        });
      },
      before: function () {
        return this.domManip(arguments, function (e) {
          this.parentNode && this.parentNode.insertBefore(e, this);
        });
      },
      after: function () {
        return this.domManip(arguments, function (e) {
          this.parentNode && this.parentNode.insertBefore(e, this.nextSibling);
        });
      },
      remove: function (e, t) {
        for (
          var n, i = e ? ue.filter(e, this) : this, r = 0;
          null != (n = i[r]);
          r++
        )
          t || 1 !== n.nodeType || ue.cleanData(_(n)),
            n.parentNode &&
              (t && ue.contains(n.ownerDocument, n) && y(_(n, "script")),
              n.parentNode.removeChild(n));
        return this;
      },
      empty: function () {
        for (var e, t = 0; null != (e = this[t]); t++) {
          for (1 === e.nodeType && ue.cleanData(_(e, !1)); e.firstChild; )
            e.removeChild(e.firstChild);
          e.options && ue.nodeName(e, "select") && (e.options.length = 0);
        }
        return this;
      },
      clone: function (e, t) {
        return (
          (e = null != e && e),
          (t = null == t ? e : t),
          this.map(function () {
            return ue.clone(this, e, t);
          })
        );
      },
      html: function (e) {
        return ue.access(
          this,
          function (e) {
            var n = this[0] || {},
              i = 0,
              r = this.length;
            if (e === t)
              return 1 === n.nodeType ? n.innerHTML.replace(Ke, "") : t;
            if (
              !(
                "string" != typeof e ||
                Ze.test(e) ||
                (!ue.support.htmlSerialize && Ue.test(e)) ||
                (!ue.support.leadingWhitespace && Xe.test(e)) ||
                at[(Ve.exec(e) || ["", ""])[1].toLowerCase()]
              )
            ) {
              e = e.replace(Ge, "<$1></$2>");
              try {
                for (; r > i; i++)
                  1 === (n = this[i] || {}).nodeType &&
                    (ue.cleanData(_(n, !1)), (n.innerHTML = e));
                n = 0;
              } catch (e) {}
            }
            n && this.empty().append(e);
          },
          null,
          e,
          arguments.length
        );
      },
      replaceWith: function () {
        var e = ue.map(this, function (e) {
            return [e.nextSibling, e.parentNode];
          }),
          t = 0;
        return (
          this.domManip(
            arguments,
            function (n) {
              var i = e[t++],
                r = e[t++];
              r &&
                (i && i.parentNode !== r && (i = this.nextSibling),
                ue(this).remove(),
                r.insertBefore(n, i));
            },
            !0
          ),
          t ? this : this.remove()
        );
      },
      detach: function (e) {
        return this.remove(e, !0);
      },
      domManip: function (e, t, n) {
        e = ne.apply([], e);
        var i,
          r,
          a,
          s,
          o,
          l,
          u = 0,
          c = this.length,
          d = this,
          p = c - 1,
          h = e[0],
          f = ue.isFunction(h);
        if (
          f ||
          (!(1 >= c || "string" != typeof h || ue.support.checkClone) &&
            tt.test(h))
        )
          return this.each(function (i) {
            var r = d.eq(i);
            f && (e[0] = h.call(this, i, r.html())), r.domManip(e, t, n);
          });
        if (
          c &&
          ((l = ue.buildFragment(e, this[0].ownerDocument, !1, !n && this)),
          (i = l.firstChild),
          1 === l.childNodes.length && (l = i),
          i)
        ) {
          for (a = (s = ue.map(_(l, "script"), g)).length; c > u; u++)
            (r = l),
              u !== p &&
                ((r = ue.clone(r, !0, !0)), a && ue.merge(s, _(r, "script"))),
              t.call(this[u], r, u);
          if (a)
            for (
              o = s[s.length - 1].ownerDocument, ue.map(s, m), u = 0;
              a > u;
              u++
            )
              (r = s[u]),
                nt.test(r.type || "") &&
                  !ue._data(r, "globalEval") &&
                  ue.contains(o, r) &&
                  (r.src
                    ? ue._evalUrl(r.src)
                    : ue.globalEval(
                        (r.text || r.textContent || r.innerHTML || "").replace(
                          rt,
                          ""
                        )
                      ));
          l = i = null;
        }
        return this;
      },
    }),
    ue.each(
      {
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith",
      },
      function (e, t) {
        ue.fn[e] = function (e) {
          for (var n, i = 0, r = [], a = ue(e), s = a.length - 1; s >= i; i++)
            (n = i === s ? this : this.clone(!0)),
              ue(a[i])[t](n),
              ie.apply(r, n.get());
          return this.pushStack(r);
        };
      }
    ),
    ue.extend({
      clone: function (e, t, n) {
        var i,
          r,
          a,
          s,
          o,
          l = ue.contains(e.ownerDocument, e);
        if (
          (ue.support.html5Clone ||
          ue.isXMLDoc(e) ||
          !Ue.test("<" + e.nodeName + ">")
            ? (a = e.cloneNode(!0))
            : ((st.innerHTML = e.outerHTML),
              st.removeChild((a = st.firstChild))),
          !(
            (ue.support.noCloneEvent && ue.support.noCloneChecked) ||
            (1 !== e.nodeType && 11 !== e.nodeType) ||
            ue.isXMLDoc(e)
          ))
        )
          for (i = _(a), o = _(e), s = 0; null != (r = o[s]); ++s)
            i[s] && b(r, i[s]);
        if (t)
          if (n)
            for (o = o || _(e), i = i || _(a), s = 0; null != (r = o[s]); s++)
              v(r, i[s]);
          else v(e, a);
        return (
          (i = _(a, "script")).length > 0 && y(i, !l && _(e, "script")),
          (i = o = r = null),
          a
        );
      },
      buildFragment: function (e, t, n, i) {
        for (
          var r, a, s, o, l, u, c, d = e.length, p = h(t), f = [], g = 0;
          d > g;
          g++
        )
          if ((a = e[g]) || 0 === a)
            if ("object" === ue.type(a)) ue.merge(f, a.nodeType ? [a] : a);
            else if (Qe.test(a)) {
              for (
                o = o || p.appendChild(t.createElement("div")),
                  l = (Ve.exec(a) || ["", ""])[1].toLowerCase(),
                  c = at[l] || at._default,
                  o.innerHTML = c[1] + a.replace(Ge, "<$1></$2>") + c[2],
                  r = c[0];
                r--;

              )
                o = o.lastChild;
              if (
                (!ue.support.leadingWhitespace &&
                  Xe.test(a) &&
                  f.push(t.createTextNode(Xe.exec(a)[0])),
                !ue.support.tbody)
              )
                for (
                  r =
                    (a =
                      "table" !== l || Je.test(a)
                        ? "<table>" !== c[1] || Je.test(a)
                          ? 0
                          : o
                        : o.firstChild) && a.childNodes.length;
                  r--;

                )
                  ue.nodeName((u = a.childNodes[r]), "tbody") &&
                    !u.childNodes.length &&
                    a.removeChild(u);
              for (
                ue.merge(f, o.childNodes), o.textContent = "";
                o.firstChild;

              )
                o.removeChild(o.firstChild);
              o = p.lastChild;
            } else f.push(t.createTextNode(a));
        for (
          o && p.removeChild(o),
            ue.support.appendChecked || ue.grep(_(f, "input"), x),
            g = 0;
          (a = f[g++]);

        )
          if (
            (!i || -1 === ue.inArray(a, i)) &&
            ((s = ue.contains(a.ownerDocument, a)),
            (o = _(p.appendChild(a), "script")),
            s && y(o),
            n)
          )
            for (r = 0; (a = o[r++]); ) nt.test(a.type || "") && n.push(a);
        return (o = null), p;
      },
      cleanData: function (e, t) {
        for (
          var n,
            i,
            r,
            a,
            s = 0,
            o = ue.expando,
            l = ue.cache,
            u = ue.support.deleteExpando,
            c = ue.event.special;
          null != (n = e[s]);
          s++
        )
          if ((t || ue.acceptData(n)) && ((r = n[o]), (a = r && l[r]))) {
            if (a.events)
              for (i in a.events)
                c[i] ? ue.event.remove(n, i) : ue.removeEvent(n, i, a.handle);
            l[r] &&
              (delete l[r],
              u
                ? delete n[o]
                : typeof n.removeAttribute !== U
                ? n.removeAttribute(o)
                : (n[o] = null),
              ee.push(r));
          }
      },
      _evalUrl: function (e) {
        return ue.ajax({
          url: e,
          type: "GET",
          dataType: "script",
          async: !1,
          global: !1,
          throws: !0,
        });
      },
    }),
    ue.fn.extend({
      wrapAll: function (e) {
        if (ue.isFunction(e))
          return this.each(function (t) {
            ue(this).wrapAll(e.call(this, t));
          });
        if (this[0]) {
          var t = ue(e, this[0].ownerDocument).eq(0).clone(!0);
          this[0].parentNode && t.insertBefore(this[0]),
            t
              .map(function () {
                for (
                  var e = this;
                  e.firstChild && 1 === e.firstChild.nodeType;

                )
                  e = e.firstChild;
                return e;
              })
              .append(this);
        }
        return this;
      },
      wrapInner: function (e) {
        return ue.isFunction(e)
          ? this.each(function (t) {
              ue(this).wrapInner(e.call(this, t));
            })
          : this.each(function () {
              var t = ue(this),
                n = t.contents();
              n.length ? n.wrapAll(e) : t.append(e);
            });
      },
      wrap: function (e) {
        var t = ue.isFunction(e);
        return this.each(function (n) {
          ue(this).wrapAll(t ? e.call(this, n) : e);
        });
      },
      unwrap: function () {
        return this.parent()
          .each(function () {
            ue.nodeName(this, "body") || ue(this).replaceWith(this.childNodes);
          })
          .end();
      },
    });
  var ot,
    lt,
    ut,
    ct = /alpha\([^)]*\)/i,
    dt = /opacity\s*=\s*([^)]*)/,
    pt = /^(top|right|bottom|left)$/,
    ht = /^(none|table(?!-c[ea]).+)/,
    ft = /^margin/,
    gt = RegExp("^(" + ce + ")(.*)$", "i"),
    mt = RegExp("^(" + ce + ")(?!px)[a-z%]+$", "i"),
    yt = RegExp("^([+-])=(" + ce + ")", "i"),
    vt = { BODY: "block" },
    bt = { position: "absolute", visibility: "hidden", display: "block" },
    _t = { letterSpacing: 0, fontWeight: 400 },
    xt = ["Top", "Right", "Bottom", "Left"],
    kt = ["Webkit", "O", "Moz", "ms"];
  ue.fn.extend({
    css: function (e, n) {
      return ue.access(
        this,
        function (e, n, i) {
          var r,
            a,
            s = {},
            o = 0;
          if (ue.isArray(n)) {
            for (a = lt(e), r = n.length; r > o; o++)
              s[n[o]] = ue.css(e, n[o], !1, a);
            return s;
          }
          return i !== t ? ue.style(e, n, i) : ue.css(e, n);
        },
        e,
        n,
        arguments.length > 1
      );
    },
    show: function () {
      return w(this, !0);
    },
    hide: function () {
      return w(this);
    },
    toggle: function (e) {
      return "boolean" == typeof e
        ? e
          ? this.show()
          : this.hide()
        : this.each(function () {
            D(this) ? ue(this).show() : ue(this).hide();
          });
    },
  }),
    ue.extend({
      cssHooks: {
        opacity: {
          get: function (e, t) {
            if (t) {
              var n = ut(e, "opacity");
              return "" === n ? "1" : n;
            }
          },
        },
      },
      cssNumber: {
        columnCount: !0,
        fillOpacity: !0,
        fontWeight: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0,
      },
      cssProps: { float: ue.support.cssFloat ? "cssFloat" : "styleFloat" },
      style: function (e, n, i, r) {
        if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
          var a,
            s,
            o,
            l = ue.camelCase(n),
            u = e.style;
          if (
            ((n = ue.cssProps[l] || (ue.cssProps[l] = k(u, l))),
            (o = ue.cssHooks[n] || ue.cssHooks[l]),
            i === t)
          )
            return o && "get" in o && (a = o.get(e, !1, r)) !== t ? a : u[n];
          if (
            ("string" === (s = typeof i) &&
              (a = yt.exec(i)) &&
              ((i = (a[1] + 1) * a[2] + parseFloat(ue.css(e, n))),
              (s = "number")),
            !(
              null == i ||
              ("number" === s && isNaN(i)) ||
              ("number" !== s || ue.cssNumber[l] || (i += "px"),
              ue.support.clearCloneStyle ||
                "" !== i ||
                0 !== n.indexOf("background") ||
                (u[n] = "inherit"),
              o && "set" in o && (i = o.set(e, i, r)) === t)
            ))
          )
            try {
              u[n] = i;
            } catch (e) {}
        }
      },
      css: function (e, n, i, r) {
        var a,
          s,
          o,
          l = ue.camelCase(n);
        return (
          (n = ue.cssProps[l] || (ue.cssProps[l] = k(e.style, l))),
          (o = ue.cssHooks[n] || ue.cssHooks[l]) &&
            "get" in o &&
            (s = o.get(e, !0, i)),
          s === t && (s = ut(e, n, r)),
          "normal" === s && n in _t && (s = _t[n]),
          "" === i || i
            ? ((a = parseFloat(s)), !0 === i || ue.isNumeric(a) ? a || 0 : s)
            : s
        );
      },
    }),
    e.getComputedStyle
      ? ((lt = function (t) {
          return e.getComputedStyle(t, null);
        }),
        (ut = function (e, n, i) {
          var r,
            a,
            s,
            o = i || lt(e),
            l = o ? o.getPropertyValue(n) || o[n] : t,
            u = e.style;
          return (
            o &&
              ("" !== l ||
                ue.contains(e.ownerDocument, e) ||
                (l = ue.style(e, n)),
              mt.test(l) &&
                ft.test(n) &&
                ((r = u.width),
                (a = u.minWidth),
                (s = u.maxWidth),
                (u.minWidth = u.maxWidth = u.width = l),
                (l = o.width),
                (u.width = r),
                (u.minWidth = a),
                (u.maxWidth = s))),
            l
          );
        }))
      : G.documentElement.currentStyle &&
        ((lt = function (e) {
          return e.currentStyle;
        }),
        (ut = function (e, n, i) {
          var r,
            a,
            s,
            o = i || lt(e),
            l = o ? o[n] : t,
            u = e.style;
          return (
            null == l && u && u[n] && (l = u[n]),
            mt.test(l) &&
              !pt.test(n) &&
              ((r = u.left),
              (a = e.runtimeStyle),
              (s = a && a.left) && (a.left = e.currentStyle.left),
              (u.left = "fontSize" === n ? "1em" : l),
              (l = u.pixelLeft + "px"),
              (u.left = r),
              s && (a.left = s)),
            "" === l ? "auto" : l
          );
        })),
    ue.each(["height", "width"], function (e, n) {
      ue.cssHooks[n] = {
        get: function (e, i, r) {
          return i
            ? 0 === e.offsetWidth && ht.test(ue.css(e, "display"))
              ? ue.swap(e, bt, function () {
                  return N(e, n, r);
                })
              : N(e, n, r)
            : t;
        },
        set: function (e, t, i) {
          var r = i && lt(e);
          return C(
            e,
            t,
            i
              ? T(
                  e,
                  n,
                  i,
                  ue.support.boxSizing &&
                    "border-box" === ue.css(e, "boxSizing", !1, r),
                  r
                )
              : 0
          );
        },
      };
    }),
    ue.support.opacity ||
      (ue.cssHooks.opacity = {
        get: function (e, t) {
          return dt.test(
            (t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || ""
          )
            ? 0.01 * parseFloat(RegExp.$1) + ""
            : t
            ? "1"
            : "";
        },
        set: function (e, t) {
          var n = e.style,
            i = e.currentStyle,
            r = ue.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
            a = (i && i.filter) || n.filter || "";
          (n.zoom = 1),
            ((t >= 1 || "" === t) &&
              "" === ue.trim(a.replace(ct, "")) &&
              n.removeAttribute &&
              (n.removeAttribute("filter"), "" === t || (i && !i.filter))) ||
              (n.filter = ct.test(a) ? a.replace(ct, r) : a + " " + r);
        },
      }),
    ue(function () {
      ue.support.reliableMarginRight ||
        (ue.cssHooks.marginRight = {
          get: function (e, n) {
            return n
              ? ue.swap(e, { display: "inline-block" }, ut, [e, "marginRight"])
              : t;
          },
        }),
        !ue.support.pixelPosition &&
          ue.fn.position &&
          ue.each(["top", "left"], function (e, n) {
            ue.cssHooks[n] = {
              get: function (e, i) {
                return i
                  ? ((i = ut(e, n)),
                    mt.test(i) ? ue(e).position()[n] + "px" : i)
                  : t;
              },
            };
          });
    }),
    ue.expr &&
      ue.expr.filters &&
      ((ue.expr.filters.hidden = function (e) {
        return (
          (0 >= e.offsetWidth && 0 >= e.offsetHeight) ||
          (!ue.support.reliableHiddenOffsets &&
            "none" === ((e.style && e.style.display) || ue.css(e, "display")))
        );
      }),
      (ue.expr.filters.visible = function (e) {
        return !ue.expr.filters.hidden(e);
      })),
    ue.each({ margin: "", padding: "", border: "Width" }, function (e, t) {
      (ue.cssHooks[e + t] = {
        expand: function (n) {
          for (
            var i = 0, r = {}, a = "string" == typeof n ? n.split(" ") : [n];
            4 > i;
            i++
          )
            r[e + xt[i] + t] = a[i] || a[i - 2] || a[0];
          return r;
        },
      }),
        ft.test(e) || (ue.cssHooks[e + t].set = C);
    });
  var Dt = /%20/g,
    wt = /\[\]$/,
    Ct = /\r?\n/g,
    Tt = /^(?:submit|button|image|reset|file)$/i,
    Nt = /^(?:input|select|textarea|keygen)/i;
  ue.fn.extend({
    serialize: function () {
      return ue.param(this.serializeArray());
    },
    serializeArray: function () {
      return this.map(function () {
        var e = ue.prop(this, "elements");
        return e ? ue.makeArray(e) : this;
      })
        .filter(function () {
          var e = this.type;
          return (
            this.name &&
            !ue(this).is(":disabled") &&
            Nt.test(this.nodeName) &&
            !Tt.test(e) &&
            (this.checked || !et.test(e))
          );
        })
        .map(function (e, t) {
          var n = ue(this).val();
          return null == n
            ? null
            : ue.isArray(n)
            ? ue.map(n, function (e) {
                return { name: t.name, value: e.replace(Ct, "\r\n") };
              })
            : { name: t.name, value: n.replace(Ct, "\r\n") };
        })
        .get();
    },
  }),
    (ue.param = function (e, n) {
      var i,
        r = [],
        a = function (e, t) {
          (t = ue.isFunction(t) ? t() : null == t ? "" : t),
            (r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t));
        };
      if (
        (n === t && (n = ue.ajaxSettings && ue.ajaxSettings.traditional),
        ue.isArray(e) || (e.jquery && !ue.isPlainObject(e)))
      )
        ue.each(e, function () {
          a(this.name, this.value);
        });
      else for (i in e) $(i, e[i], n, a);
      return r.join("&").replace(Dt, "+");
    }),
    ue.each(
      "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(
        " "
      ),
      function (e, t) {
        ue.fn[t] = function (e, n) {
          return arguments.length > 0
            ? this.on(t, null, e, n)
            : this.trigger(t);
        };
      }
    ),
    ue.fn.extend({
      hover: function (e, t) {
        return this.mouseenter(e).mouseleave(t || e);
      },
      bind: function (e, t, n) {
        return this.on(e, null, t, n);
      },
      unbind: function (e, t) {
        return this.off(e, null, t);
      },
      delegate: function (e, t, n, i) {
        return this.on(t, e, n, i);
      },
      undelegate: function (e, t, n) {
        return 1 === arguments.length
          ? this.off(e, "**")
          : this.off(t, e || "**", n);
      },
    });
  var Mt,
    St,
    $t = ue.now(),
    At = /\?/,
    Et = /#.*$/,
    jt = /([?&])_=[^&]*/,
    It = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
    Ft = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    Lt = /^(?:GET|HEAD)$/,
    Ht = /^\/\//,
    Ot = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
    Pt = ue.fn.load,
    Rt = {},
    Yt = {},
    qt = "*/".concat("*");
  try {
    St = X.href;
  } catch (e) {
    ((St = G.createElement("a")).href = ""), (St = St.href);
  }
  (Mt = Ot.exec(St.toLowerCase()) || []),
    (ue.fn.load = function (e, n, i) {
      if ("string" != typeof e && Pt) return Pt.apply(this, arguments);
      var r,
        a,
        s,
        o = this,
        l = e.indexOf(" ");
      return (
        l >= 0 && ((r = e.slice(l, e.length)), (e = e.slice(0, l))),
        ue.isFunction(n)
          ? ((i = n), (n = t))
          : n && "object" == typeof n && (s = "POST"),
        o.length > 0 &&
          ue
            .ajax({ url: e, type: s, dataType: "html", data: n })
            .done(function (e) {
              (a = arguments),
                o.html(r ? ue("<div>").append(ue.parseHTML(e)).find(r) : e);
            })
            .complete(
              i &&
                function (e, t) {
                  o.each(i, a || [e.responseText, t, e]);
                }
            ),
        this
      );
    }),
    ue.each(
      [
        "ajaxStart",
        "ajaxStop",
        "ajaxComplete",
        "ajaxError",
        "ajaxSuccess",
        "ajaxSend",
      ],
      function (e, t) {
        ue.fn[t] = function (e) {
          return this.on(t, e);
        };
      }
    ),
    ue.extend({
      active: 0,
      lastModified: {},
      etag: {},
      ajaxSettings: {
        url: St,
        type: "GET",
        isLocal: Ft.test(Mt[1]),
        global: !0,
        processData: !0,
        async: !0,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        accepts: {
          "*": qt,
          text: "text/plain",
          html: "text/html",
          xml: "application/xml, text/xml",
          json: "application/json, text/javascript",
        },
        contents: { xml: /xml/, html: /html/, json: /json/ },
        responseFields: {
          xml: "responseXML",
          text: "responseText",
          json: "responseJSON",
        },
        converters: {
          "* text": String,
          "text html": !0,
          "text json": ue.parseJSON,
          "text xml": ue.parseXML,
        },
        flatOptions: { url: !0, context: !0 },
      },
      ajaxSetup: function (e, t) {
        return t ? j(j(e, ue.ajaxSettings), t) : j(ue.ajaxSettings, e);
      },
      ajaxPrefilter: A(Rt),
      ajaxTransport: A(Yt),
      ajax: function (e, n) {
        function i(e, n, i, r) {
          var a,
            d,
            v,
            b,
            x,
            D = n;
          2 !== _ &&
            ((_ = 2),
            l && clearTimeout(l),
            (c = t),
            (o = r || ""),
            (k.readyState = e > 0 ? 4 : 0),
            (a = (e >= 200 && 300 > e) || 304 === e),
            i && (b = I(p, k, i)),
            (b = F(p, b, k, a)),
            a
              ? (p.ifModified &&
                  ((x = k.getResponseHeader("Last-Modified")) &&
                    (ue.lastModified[s] = x),
                  (x = k.getResponseHeader("etag")) && (ue.etag[s] = x)),
                204 === e || "HEAD" === p.type
                  ? (D = "nocontent")
                  : 304 === e
                  ? (D = "notmodified")
                  : ((D = b.state), (d = b.data), (v = b.error), (a = !v)))
              : ((v = D), (e || !D) && ((D = "error"), 0 > e && (e = 0))),
            (k.status = e),
            (k.statusText = (n || D) + ""),
            a ? g.resolveWith(h, [d, D, k]) : g.rejectWith(h, [k, D, v]),
            k.statusCode(y),
            (y = t),
            u && f.trigger(a ? "ajaxSuccess" : "ajaxError", [k, p, a ? d : v]),
            m.fireWith(h, [k, D]),
            u &&
              (f.trigger("ajaxComplete", [k, p]),
              --ue.active || ue.event.trigger("ajaxStop")));
        }
        "object" == typeof e && ((n = e), (e = t)), (n = n || {});
        var r,
          a,
          s,
          o,
          l,
          u,
          c,
          d,
          p = ue.ajaxSetup({}, n),
          h = p.context || p,
          f = p.context && (h.nodeType || h.jquery) ? ue(h) : ue.event,
          g = ue.Deferred(),
          m = ue.Callbacks("once memory"),
          y = p.statusCode || {},
          v = {},
          b = {},
          _ = 0,
          x = "canceled",
          k = {
            readyState: 0,
            getResponseHeader: function (e) {
              var t;
              if (2 === _) {
                if (!d)
                  for (d = {}; (t = It.exec(o)); ) d[t[1].toLowerCase()] = t[2];
                t = d[e.toLowerCase()];
              }
              return null == t ? null : t;
            },
            getAllResponseHeaders: function () {
              return 2 === _ ? o : null;
            },
            setRequestHeader: function (e, t) {
              var n = e.toLowerCase();
              return _ || ((e = b[n] = b[n] || e), (v[e] = t)), this;
            },
            overrideMimeType: function (e) {
              return _ || (p.mimeType = e), this;
            },
            statusCode: function (e) {
              var t;
              if (e)
                if (2 > _) for (t in e) y[t] = [y[t], e[t]];
                else k.always(e[k.status]);
              return this;
            },
            abort: function (e) {
              var t = e || x;
              return c && c.abort(t), i(0, t), this;
            },
          };
        if (
          ((g.promise(k).complete = m.add),
          (k.success = k.done),
          (k.error = k.fail),
          (p.url = ((e || p.url || St) + "")
            .replace(Et, "")
            .replace(Ht, Mt[1] + "//")),
          (p.type = n.method || n.type || p.method || p.type),
          (p.dataTypes = ue
            .trim(p.dataType || "*")
            .toLowerCase()
            .match(de) || [""]),
          null == p.crossDomain &&
            ((r = Ot.exec(p.url.toLowerCase())),
            (p.crossDomain = !(
              !r ||
              (r[1] === Mt[1] &&
                r[2] === Mt[2] &&
                (r[3] || ("http:" === r[1] ? "80" : "443")) ===
                  (Mt[3] || ("http:" === Mt[1] ? "80" : "443")))
            ))),
          p.data &&
            p.processData &&
            "string" != typeof p.data &&
            (p.data = ue.param(p.data, p.traditional)),
          E(Rt, p, n, k),
          2 === _)
        )
          return k;
        (u = p.global) && 0 == ue.active++ && ue.event.trigger("ajaxStart"),
          (p.type = p.type.toUpperCase()),
          (p.hasContent = !Lt.test(p.type)),
          (s = p.url),
          p.hasContent ||
            (p.data &&
              ((s = p.url += (At.test(s) ? "&" : "?") + p.data), delete p.data),
            !1 === p.cache &&
              (p.url = jt.test(s)
                ? s.replace(jt, "$1_=" + $t++)
                : s + (At.test(s) ? "&" : "?") + "_=" + $t++)),
          p.ifModified &&
            (ue.lastModified[s] &&
              k.setRequestHeader("If-Modified-Since", ue.lastModified[s]),
            ue.etag[s] && k.setRequestHeader("If-None-Match", ue.etag[s])),
          ((p.data && p.hasContent && !1 !== p.contentType) || n.contentType) &&
            k.setRequestHeader("Content-Type", p.contentType),
          k.setRequestHeader(
            "Accept",
            p.dataTypes[0] && p.accepts[p.dataTypes[0]]
              ? p.accepts[p.dataTypes[0]] +
                  ("*" !== p.dataTypes[0] ? ", " + qt + "; q=0.01" : "")
              : p.accepts["*"]
          );
        for (a in p.headers) k.setRequestHeader(a, p.headers[a]);
        if (p.beforeSend && (!1 === p.beforeSend.call(h, k, p) || 2 === _))
          return k.abort();
        x = "abort";
        for (a in { success: 1, error: 1, complete: 1 }) k[a](p[a]);
        if ((c = E(Yt, p, n, k))) {
          (k.readyState = 1),
            u && f.trigger("ajaxSend", [k, p]),
            p.async &&
              p.timeout > 0 &&
              (l = setTimeout(function () {
                k.abort("timeout");
              }, p.timeout));
          try {
            (_ = 1), c.send(v, i);
          } catch (e) {
            if (!(2 > _)) throw e;
            i(-1, e);
          }
        } else i(-1, "No Transport");
        return k;
      },
      getJSON: function (e, t, n) {
        return ue.get(e, t, n, "json");
      },
      getScript: function (e, n) {
        return ue.get(e, t, n, "script");
      },
    }),
    ue.each(["get", "post"], function (e, n) {
      ue[n] = function (e, i, r, a) {
        return (
          ue.isFunction(i) && ((a = a || r), (r = i), (i = t)),
          ue.ajax({ url: e, type: n, dataType: a, data: i, success: r })
        );
      };
    }),
    ue.ajaxSetup({
      accepts: {
        script:
          "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
      },
      contents: { script: /(?:java|ecma)script/ },
      converters: {
        "text script": function (e) {
          return ue.globalEval(e), e;
        },
      },
    }),
    ue.ajaxPrefilter("script", function (e) {
      e.cache === t && (e.cache = !1),
        e.crossDomain && ((e.type = "GET"), (e.global = !1));
    }),
    ue.ajaxTransport("script", function (e) {
      if (e.crossDomain) {
        var n,
          i = G.head || ue("head")[0] || G.documentElement;
        return {
          send: function (t, r) {
            ((n = G.createElement("script")).async = !0),
              e.scriptCharset && (n.charset = e.scriptCharset),
              (n.src = e.url),
              (n.onload = n.onreadystatechange =
                function (e, t) {
                  (t ||
                    !n.readyState ||
                    /loaded|complete/.test(n.readyState)) &&
                    ((n.onload = n.onreadystatechange = null),
                    n.parentNode && n.parentNode.removeChild(n),
                    (n = null),
                    t || r(200, "success"));
                }),
              i.insertBefore(n, i.firstChild);
          },
          abort: function () {
            n && n.onload(t, !0);
          },
        };
      }
    });
  var Wt = [],
    Bt = /(=)\?(?=&|$)|\?\?/;
  ue.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function () {
      var e = Wt.pop() || ue.expando + "_" + $t++;
      return (this[e] = !0), e;
    },
  }),
    ue.ajaxPrefilter("json jsonp", function (n, i, r) {
      var a,
        s,
        o,
        l =
          !1 !== n.jsonp &&
          (Bt.test(n.url)
            ? "url"
            : "string" == typeof n.data &&
              !(n.contentType || "").indexOf(
                "application/x-www-form-urlencoded"
              ) &&
              Bt.test(n.data) &&
              "data");
      return l || "jsonp" === n.dataTypes[0]
        ? ((a = n.jsonpCallback =
            ue.isFunction(n.jsonpCallback)
              ? n.jsonpCallback()
              : n.jsonpCallback),
          l
            ? (n[l] = n[l].replace(Bt, "$1" + a))
            : !1 !== n.jsonp &&
              (n.url += (At.test(n.url) ? "&" : "?") + n.jsonp + "=" + a),
          (n.converters["script json"] = function () {
            return o || ue.error(a + " was not called"), o[0];
          }),
          (n.dataTypes[0] = "json"),
          (s = e[a]),
          (e[a] = function () {
            o = arguments;
          }),
          r.always(function () {
            (e[a] = s),
              n[a] && ((n.jsonpCallback = i.jsonpCallback), Wt.push(a)),
              o && ue.isFunction(s) && s(o[0]),
              (o = s = t);
          }),
          "script")
        : t;
    });
  var zt,
    Kt,
    Ut = 0,
    Xt =
      e.ActiveXObject &&
      function () {
        var e;
        for (e in zt) zt[e](t, !0);
      };
  (ue.ajaxSettings.xhr = e.ActiveXObject
    ? function () {
        return (!this.isLocal && L()) || H();
      }
    : L),
    (Kt = ue.ajaxSettings.xhr()),
    (ue.support.cors = !!Kt && "withCredentials" in Kt),
    (Kt = ue.support.ajax = !!Kt) &&
      ue.ajaxTransport(function (n) {
        if (!n.crossDomain || ue.support.cors) {
          var i;
          return {
            send: function (r, a) {
              var s,
                o,
                l = n.xhr();
              if (
                (n.username
                  ? l.open(n.type, n.url, n.async, n.username, n.password)
                  : l.open(n.type, n.url, n.async),
                n.xhrFields)
              )
                for (o in n.xhrFields) l[o] = n.xhrFields[o];
              n.mimeType &&
                l.overrideMimeType &&
                l.overrideMimeType(n.mimeType),
                n.crossDomain ||
                  r["X-Requested-With"] ||
                  (r["X-Requested-With"] = "XMLHttpRequest");
              try {
                for (o in r) l.setRequestHeader(o, r[o]);
              } catch (e) {}
              l.send((n.hasContent && n.data) || null),
                (i = function (e, r) {
                  var o, u, c, d;
                  try {
                    if (i && (r || 4 === l.readyState))
                      if (
                        ((i = t),
                        s &&
                          ((l.onreadystatechange = ue.noop),
                          Xt && delete zt[s]),
                        r)
                      )
                        4 !== l.readyState && l.abort();
                      else {
                        (d = {}),
                          (o = l.status),
                          (u = l.getAllResponseHeaders()),
                          "string" == typeof l.responseText &&
                            (d.text = l.responseText);
                        try {
                          c = l.statusText;
                        } catch (e) {
                          c = "";
                        }
                        o || !n.isLocal || n.crossDomain
                          ? 1223 === o && (o = 204)
                          : (o = d.text ? 200 : 404);
                      }
                  } catch (e) {
                    r || a(-1, e);
                  }
                  d && a(o, c, d, u);
                }),
                n.async
                  ? 4 === l.readyState
                    ? setTimeout(i)
                    : ((s = ++Ut),
                      Xt && (zt || ((zt = {}), ue(e).unload(Xt)), (zt[s] = i)),
                      (l.onreadystatechange = i))
                  : i();
            },
            abort: function () {
              i && i(t, !0);
            },
          };
        }
      });
  var Gt,
    Vt,
    Jt = /^(?:toggle|show|hide)$/,
    Qt = RegExp("^(?:([+-])=|)(" + ce + ")([a-z%]*)$", "i"),
    Zt = /queueHooks$/,
    en = [
      function (e, t, n) {
        var i,
          r,
          a,
          s,
          o,
          l,
          u = this,
          c = {},
          d = e.style,
          p = e.nodeType && D(e),
          h = ue._data(e, "fxshow");
        n.queue ||
          (null == (o = ue._queueHooks(e, "fx")).unqueued &&
            ((o.unqueued = 0),
            (l = o.empty.fire),
            (o.empty.fire = function () {
              o.unqueued || l();
            })),
          o.unqueued++,
          u.always(function () {
            u.always(function () {
              o.unqueued--, ue.queue(e, "fx").length || o.empty.fire();
            });
          })),
          1 === e.nodeType &&
            ("height" in t || "width" in t) &&
            ((n.overflow = [d.overflow, d.overflowX, d.overflowY]),
            "inline" === ue.css(e, "display") &&
              "none" === ue.css(e, "float") &&
              (ue.support.inlineBlockNeedsLayout && "inline" !== M(e.nodeName)
                ? (d.zoom = 1)
                : (d.display = "inline-block"))),
          n.overflow &&
            ((d.overflow = "hidden"),
            ue.support.shrinkWrapBlocks ||
              u.always(function () {
                (d.overflow = n.overflow[0]),
                  (d.overflowX = n.overflow[1]),
                  (d.overflowY = n.overflow[2]);
              }));
        for (i in t)
          if (((r = t[i]), Jt.exec(r))) {
            if (
              (delete t[i],
              (a = a || "toggle" === r),
              r === (p ? "hide" : "show"))
            )
              continue;
            c[i] = (h && h[i]) || ue.style(e, i);
          }
        if (!ue.isEmptyObject(c)) {
          h ? "hidden" in h && (p = h.hidden) : (h = ue._data(e, "fxshow", {})),
            a && (h.hidden = !p),
            p
              ? ue(e).show()
              : u.done(function () {
                  ue(e).hide();
                }),
            u.done(function () {
              var t;
              ue._removeData(e, "fxshow");
              for (t in c) ue.style(e, t, c[t]);
            });
          for (i in c)
            (s = P(p ? h[i] : 0, i, u)),
              i in h ||
                ((h[i] = s.start),
                p &&
                  ((s.end = s.start),
                  (s.start = "width" === i || "height" === i ? 1 : 0)));
        }
      },
    ],
    tn = {
      "*": [
        function (e, t) {
          var n = this.createTween(e, t),
            i = n.cur(),
            r = Qt.exec(t),
            a = (r && r[3]) || (ue.cssNumber[e] ? "" : "px"),
            s =
              (ue.cssNumber[e] || ("px" !== a && +i)) &&
              Qt.exec(ue.css(n.elem, e)),
            o = 1,
            l = 20;
          if (s && s[3] !== a) {
            (a = a || s[3]), (r = r || []), (s = +i || 1);
            do {
              (o = o || ".5"), (s /= o), ue.style(n.elem, e, s + a);
            } while (o !== (o = n.cur() / i) && 1 !== o && --l);
          }
          return (
            r &&
              ((s = n.start = +s || +i || 0),
              (n.unit = a),
              (n.end = r[1] ? s + (r[1] + 1) * r[2] : +r[2])),
            n
          );
        },
      ],
    };
  (ue.Animation = ue.extend(R, {
    tweener: function (e, t) {
      ue.isFunction(e) ? ((t = e), (e = ["*"])) : (e = e.split(" "));
      for (var n, i = 0, r = e.length; r > i; i++)
        (n = e[i]), (tn[n] = tn[n] || []), tn[n].unshift(t);
    },
    prefilter: function (e, t) {
      t ? en.unshift(e) : en.push(e);
    },
  })),
    (ue.Tween = q),
    (q.prototype = {
      constructor: q,
      init: function (e, t, n, i, r, a) {
        (this.elem = e),
          (this.prop = n),
          (this.easing = r || "swing"),
          (this.options = t),
          (this.start = this.now = this.cur()),
          (this.end = i),
          (this.unit = a || (ue.cssNumber[n] ? "" : "px"));
      },
      cur: function () {
        var e = q.propHooks[this.prop];
        return e && e.get ? e.get(this) : q.propHooks._default.get(this);
      },
      run: function (e) {
        var t,
          n = q.propHooks[this.prop];
        return (
          (this.pos = t =
            this.options.duration
              ? ue.easing[this.easing](
                  e,
                  this.options.duration * e,
                  0,
                  1,
                  this.options.duration
                )
              : e),
          (this.now = (this.end - this.start) * t + this.start),
          this.options.step &&
            this.options.step.call(this.elem, this.now, this),
          n && n.set ? n.set(this) : q.propHooks._default.set(this),
          this
        );
      },
    }),
    (q.prototype.init.prototype = q.prototype),
    (q.propHooks = {
      _default: {
        get: function (e) {
          var t;
          return null == e.elem[e.prop] ||
            (e.elem.style && null != e.elem.style[e.prop])
            ? ((t = ue.css(e.elem, e.prop, "")), t && "auto" !== t ? t : 0)
            : e.elem[e.prop];
        },
        set: function (e) {
          ue.fx.step[e.prop]
            ? ue.fx.step[e.prop](e)
            : e.elem.style &&
              (null != e.elem.style[ue.cssProps[e.prop]] || ue.cssHooks[e.prop])
            ? ue.style(e.elem, e.prop, e.now + e.unit)
            : (e.elem[e.prop] = e.now);
        },
      },
    }),
    (q.propHooks.scrollTop = q.propHooks.scrollLeft =
      {
        set: function (e) {
          e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
        },
      }),
    ue.each(["toggle", "show", "hide"], function (e, t) {
      var n = ue.fn[t];
      ue.fn[t] = function (e, i, r) {
        return null == e || "boolean" == typeof e
          ? n.apply(this, arguments)
          : this.animate(W(t, !0), e, i, r);
      };
    }),
    ue.fn.extend({
      fadeTo: function (e, t, n, i) {
        return this.filter(D)
          .css("opacity", 0)
          .show()
          .end()
          .animate({ opacity: t }, e, n, i);
      },
      animate: function (e, t, n, i) {
        var r = ue.isEmptyObject(e),
          a = ue.speed(t, n, i),
          s = function () {
            var t = R(this, ue.extend({}, e), a);
            (r || ue._data(this, "finish")) && t.stop(!0);
          };
        return (
          (s.finish = s),
          r || !1 === a.queue ? this.each(s) : this.queue(a.queue, s)
        );
      },
      stop: function (e, n, i) {
        var r = function (e) {
          var t = e.stop;
          delete e.stop, t(i);
        };
        return (
          "string" != typeof e && ((i = n), (n = e), (e = t)),
          n && !1 !== e && this.queue(e || "fx", []),
          this.each(function () {
            var t = !0,
              n = null != e && e + "queueHooks",
              a = ue.timers,
              s = ue._data(this);
            if (n) s[n] && s[n].stop && r(s[n]);
            else for (n in s) s[n] && s[n].stop && Zt.test(n) && r(s[n]);
            for (n = a.length; n--; )
              a[n].elem !== this ||
                (null != e && a[n].queue !== e) ||
                (a[n].anim.stop(i), (t = !1), a.splice(n, 1));
            (t || !i) && ue.dequeue(this, e);
          })
        );
      },
      finish: function (e) {
        return (
          !1 !== e && (e = e || "fx"),
          this.each(function () {
            var t,
              n = ue._data(this),
              i = n[e + "queue"],
              r = n[e + "queueHooks"],
              a = ue.timers,
              s = i ? i.length : 0;
            for (
              n.finish = !0,
                ue.queue(this, e, []),
                r && r.stop && r.stop.call(this, !0),
                t = a.length;
              t--;

            )
              a[t].elem === this &&
                a[t].queue === e &&
                (a[t].anim.stop(!0), a.splice(t, 1));
            for (t = 0; s > t; t++)
              i[t] && i[t].finish && i[t].finish.call(this);
            delete n.finish;
          })
        );
      },
    }),
    ue.each(
      {
        slideDown: W("show"),
        slideUp: W("hide"),
        slideToggle: W("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" },
      },
      function (e, t) {
        ue.fn[e] = function (e, n, i) {
          return this.animate(t, e, n, i);
        };
      }
    ),
    (ue.speed = function (e, t, n) {
      var i =
        e && "object" == typeof e
          ? ue.extend({}, e)
          : {
              complete: n || (!n && t) || (ue.isFunction(e) && e),
              duration: e,
              easing: (n && t) || (t && !ue.isFunction(t) && t),
            };
      return (
        (i.duration = ue.fx.off
          ? 0
          : "number" == typeof i.duration
          ? i.duration
          : i.duration in ue.fx.speeds
          ? ue.fx.speeds[i.duration]
          : ue.fx.speeds._default),
        (null == i.queue || !0 === i.queue) && (i.queue = "fx"),
        (i.old = i.complete),
        (i.complete = function () {
          ue.isFunction(i.old) && i.old.call(this),
            i.queue && ue.dequeue(this, i.queue);
        }),
        i
      );
    }),
    (ue.easing = {
      linear: function (e) {
        return e;
      },
      swing: function (e) {
        return 0.5 - Math.cos(e * Math.PI) / 2;
      },
    }),
    (ue.timers = []),
    (ue.fx = q.prototype.init),
    (ue.fx.tick = function () {
      var e,
        n = ue.timers,
        i = 0;
      for (Gt = ue.now(); n.length > i; i++)
        (e = n[i])() || n[i] !== e || n.splice(i--, 1);
      n.length || ue.fx.stop(), (Gt = t);
    }),
    (ue.fx.timer = function (e) {
      e() && ue.timers.push(e) && ue.fx.start();
    }),
    (ue.fx.interval = 13),
    (ue.fx.start = function () {
      Vt || (Vt = setInterval(ue.fx.tick, ue.fx.interval));
    }),
    (ue.fx.stop = function () {
      clearInterval(Vt), (Vt = null);
    }),
    (ue.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
    (ue.fx.step = {}),
    ue.expr &&
      ue.expr.filters &&
      (ue.expr.filters.animated = function (e) {
        return ue.grep(ue.timers, function (t) {
          return e === t.elem;
        }).length;
      }),
    (ue.fn.offset = function (e) {
      if (arguments.length)
        return e === t
          ? this
          : this.each(function (t) {
              ue.offset.setOffset(this, e, t);
            });
      var n,
        i,
        r = { top: 0, left: 0 },
        a = this[0],
        s = a && a.ownerDocument;
      return s
        ? ((n = s.documentElement),
          ue.contains(n, a)
            ? (typeof a.getBoundingClientRect !== U &&
                (r = a.getBoundingClientRect()),
              (i = B(s)),
              {
                top:
                  r.top + (i.pageYOffset || n.scrollTop) - (n.clientTop || 0),
                left:
                  r.left +
                  (i.pageXOffset || n.scrollLeft) -
                  (n.clientLeft || 0),
              })
            : r)
        : void 0;
    }),
    (ue.offset = {
      setOffset: function (e, t, n) {
        var i = ue.css(e, "position");
        "static" === i && (e.style.position = "relative");
        var r,
          a,
          s = ue(e),
          o = s.offset(),
          l = ue.css(e, "top"),
          u = ue.css(e, "left"),
          c = {},
          d = {};
        ("absolute" === i || "fixed" === i) && ue.inArray("auto", [l, u]) > -1
          ? ((d = s.position()), (r = d.top), (a = d.left))
          : ((r = parseFloat(l) || 0), (a = parseFloat(u) || 0)),
          ue.isFunction(t) && (t = t.call(e, n, o)),
          null != t.top && (c.top = t.top - o.top + r),
          null != t.left && (c.left = t.left - o.left + a),
          "using" in t ? t.using.call(e, c) : s.css(c);
      },
    }),
    ue.fn.extend({
      position: function () {
        if (this[0]) {
          var e,
            t,
            n = { top: 0, left: 0 },
            i = this[0];
          return (
            "fixed" === ue.css(i, "position")
              ? (t = i.getBoundingClientRect())
              : ((e = this.offsetParent()),
                (t = this.offset()),
                ue.nodeName(e[0], "html") || (n = e.offset()),
                (n.top += ue.css(e[0], "borderTopWidth", !0)),
                (n.left += ue.css(e[0], "borderLeftWidth", !0))),
            {
              top: t.top - n.top - ue.css(i, "marginTop", !0),
              left: t.left - n.left - ue.css(i, "marginLeft", !0),
            }
          );
        }
      },
      offsetParent: function () {
        return this.map(function () {
          for (
            var e = this.offsetParent || V;
            e && !ue.nodeName(e, "html") && "static" === ue.css(e, "position");

          )
            e = e.offsetParent;
          return e || V;
        });
      },
    }),
    ue.each(
      { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" },
      function (e, n) {
        var i = /Y/.test(n);
        ue.fn[e] = function (r) {
          return ue.access(
            this,
            function (e, r, a) {
              var s = B(e);
              return a === t
                ? s
                  ? n in s
                    ? s[n]
                    : s.document.documentElement[r]
                  : e[r]
                : (s
                    ? s.scrollTo(
                        i ? ue(s).scrollLeft() : a,
                        i ? a : ue(s).scrollTop()
                      )
                    : (e[r] = a),
                  t);
            },
            e,
            r,
            arguments.length,
            null
          );
        };
      }
    ),
    ue.each({ Height: "height", Width: "width" }, function (e, n) {
      ue.each(
        { padding: "inner" + e, content: n, "": "outer" + e },
        function (i, r) {
          ue.fn[r] = function (r, a) {
            var s = arguments.length && (i || "boolean" != typeof r),
              o = i || (!0 === r || !0 === a ? "margin" : "border");
            return ue.access(
              this,
              function (n, i, r) {
                var a;
                return ue.isWindow(n)
                  ? n.document.documentElement["client" + e]
                  : 9 === n.nodeType
                  ? ((a = n.documentElement),
                    Math.max(
                      n.body["scroll" + e],
                      a["scroll" + e],
                      n.body["offset" + e],
                      a["offset" + e],
                      a["client" + e]
                    ))
                  : r === t
                  ? ue.css(n, i, o)
                  : ue.style(n, i, r, o);
              },
              n,
              s ? r : t,
              s,
              null
            );
          };
        }
      );
    }),
    (ue.fn.size = function () {
      return this.length;
    }),
    (ue.fn.andSelf = ue.fn.addBack),
    "object" == typeof module && module && "object" == typeof module.exports
      ? (module.exports = ue)
      : ((e.jQuery = e.$ = ue),
        "function" == typeof define &&
          define.amd &&
          define("jquery", [], function () {
            return ue;
          }));
})(window),
  (function (e, t) {
    function n(t, n) {
      var r,
        a,
        s,
        o = t.nodeName.toLowerCase();
      return "area" === o
        ? ((r = t.parentNode),
          (a = r.name),
          !(!t.href || !a || "map" !== r.nodeName.toLowerCase()) &&
            !!(s = e("img[usemap=#" + a + "]")[0]) &&
            i(s))
        : (/input|select|textarea|button|object/.test(o)
            ? !t.disabled
            : "a" === o
            ? t.href || n
            : n) && i(t);
    }
    function i(t) {
      return (
        e.expr.filters.visible(t) &&
        !e(t)
          .parents()
          .addBack()
          .filter(function () {
            return "hidden" === e.css(this, "visibility");
          }).length
      );
    }
    var r = 0,
      a = /^ui-id-\d+$/;
    (e.ui = e.ui || {}),
      e.extend(e.ui, {
        version: "1.10.3",
        keyCode: {
          BACKSPACE: 8,
          COMMA: 188,
          DELETE: 46,
          DOWN: 40,
          END: 35,
          ENTER: 13,
          ESCAPE: 27,
          HOME: 36,
          LEFT: 37,
          NUMPAD_ADD: 107,
          NUMPAD_DECIMAL: 110,
          NUMPAD_DIVIDE: 111,
          NUMPAD_ENTER: 108,
          NUMPAD_MULTIPLY: 106,
          NUMPAD_SUBTRACT: 109,
          PAGE_DOWN: 34,
          PAGE_UP: 33,
          PERIOD: 190,
          RIGHT: 39,
          SPACE: 32,
          TAB: 9,
          UP: 38,
        },
      }),
      e.fn.extend({
        focus: (function (t) {
          return function (n, i) {
            return "number" == typeof n
              ? this.each(function () {
                  var t = this;
                  setTimeout(function () {
                    e(t).focus(), i && i.call(t);
                  }, n);
                })
              : t.apply(this, arguments);
          };
        })(e.fn.focus),
        scrollParent: function () {
          var t;
          return (
            (t =
              (e.ui.ie && /(static|relative)/.test(this.css("position"))) ||
              /absolute/.test(this.css("position"))
                ? this.parents()
                    .filter(function () {
                      return (
                        /(relative|absolute|fixed)/.test(
                          e.css(this, "position")
                        ) &&
                        /(auto|scroll)/.test(
                          e.css(this, "overflow") +
                            e.css(this, "overflow-y") +
                            e.css(this, "overflow-x")
                        )
                      );
                    })
                    .eq(0)
                : this.parents()
                    .filter(function () {
                      return /(auto|scroll)/.test(
                        e.css(this, "overflow") +
                          e.css(this, "overflow-y") +
                          e.css(this, "overflow-x")
                      );
                    })
                    .eq(0)),
            /fixed/.test(this.css("position")) || !t.length ? e(document) : t
          );
        },
        zIndex: function (t) {
          if (void 0 !== t) return this.css("zIndex", t);
          if (this.length)
            for (var n, i, r = e(this[0]); r.length && r[0] !== document; ) {
              if (
                ("absolute" === (n = r.css("position")) ||
                  "relative" === n ||
                  "fixed" === n) &&
                ((i = parseInt(r.css("zIndex"), 10)), !isNaN(i) && 0 !== i)
              )
                return i;
              r = r.parent();
            }
          return 0;
        },
        uniqueId: function () {
          return this.each(function () {
            this.id || (this.id = "ui-id-" + ++r);
          });
        },
        removeUniqueId: function () {
          return this.each(function () {
            a.test(this.id) && e(this).removeAttr("id");
          });
        },
      }),
      e.extend(e.expr[":"], {
        data: e.expr.createPseudo
          ? e.expr.createPseudo(function (t) {
              return function (n) {
                return !!e.data(n, t);
              };
            })
          : function (t, n, i) {
              return !!e.data(t, i[3]);
            },
        focusable: function (t) {
          return n(t, !isNaN(e.attr(t, "tabindex")));
        },
        tabbable: function (t) {
          var i = e.attr(t, "tabindex"),
            r = isNaN(i);
          return (r || i >= 0) && n(t, !r);
        },
      }),
      e("<a>").outerWidth(1).jquery ||
        e.each(["Width", "Height"], function (t, n) {
          function i(t, n, i, a) {
            return (
              e.each(r, function () {
                (n -= parseFloat(e.css(t, "padding" + this)) || 0),
                  i &&
                    (n -= parseFloat(e.css(t, "border" + this + "Width")) || 0),
                  a && (n -= parseFloat(e.css(t, "margin" + this)) || 0);
              }),
              n
            );
          }
          var r = "Width" === n ? ["Left", "Right"] : ["Top", "Bottom"],
            a = n.toLowerCase(),
            s = {
              innerWidth: e.fn.innerWidth,
              innerHeight: e.fn.innerHeight,
              outerWidth: e.fn.outerWidth,
              outerHeight: e.fn.outerHeight,
            };
          (e.fn["inner" + n] = function (t) {
            return void 0 === t
              ? s["inner" + n].call(this)
              : this.each(function () {
                  e(this).css(a, i(this, t) + "px");
                });
          }),
            (e.fn["outer" + n] = function (t, r) {
              return "number" != typeof t
                ? s["outer" + n].call(this, t)
                : this.each(function () {
                    e(this).css(a, i(this, t, !0, r) + "px");
                  });
            });
        }),
      e.fn.addBack ||
        (e.fn.addBack = function (e) {
          return this.add(
            null == e ? this.prevObject : this.prevObject.filter(e)
          );
        }),
      e("<a>").data("a-b", "a").removeData("a-b").data("a-b") &&
        (e.fn.removeData = (function (t) {
          return function (n) {
            return arguments.length
              ? t.call(this, e.camelCase(n))
              : t.call(this);
          };
        })(e.fn.removeData)),
      (e.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase())),
      (e.support.selectstart =
        "onselectstart" in document.createElement("div")),
      e.fn.extend({
        disableSelection: function () {
          return this.bind(
            (e.support.selectstart ? "selectstart" : "mousedown") +
              ".ui-disableSelection",
            function (e) {
              e.preventDefault();
            }
          );
        },
        enableSelection: function () {
          return this.unbind(".ui-disableSelection");
        },
      }),
      e.extend(e.ui, {
        plugin: {
          add: function (t, n, i) {
            var r,
              a = e.ui[t].prototype;
            for (r in i)
              (a.plugins[r] = a.plugins[r] || []), a.plugins[r].push([n, i[r]]);
          },
          call: function (e, t, n) {
            var i,
              r = e.plugins[t];
            if (
              r &&
              e.element[0].parentNode &&
              11 !== e.element[0].parentNode.nodeType
            )
              for (i = 0; i < r.length; i++)
                e.options[r[i][0]] && r[i][1].apply(e.element, n);
          },
        },
        hasScroll: function (t, n) {
          if ("hidden" === e(t).css("overflow")) return !1;
          var i = n && "left" === n ? "scrollLeft" : "scrollTop",
            r = !1;
          return t[i] > 0 || ((t[i] = 1), (r = t[i] > 0), (t[i] = 0), r);
        },
      });
  })(jQuery);
var GREGORIAN_EPOCH = 1721425.5,
  ISLAMIC_EPOCH = 1948439.5,
  PERSIAN_EPOCH = 1948320.5;
!(function ($, undefined) {
  function Datepicker() {
    (this._curInst = null),
      (this._keyEvent = !1),
      (this._disabledInputs = []),
      (this._datepickerShowing = !1),
      (this._inDialog = !1),
      (this._mainDivId = "ui-datepicker-div"),
      (this._inlineClass = "ui-datepicker-inline"),
      (this._appendClass = "ui-datepicker-append"),
      (this._triggerClass = "ui-datepicker-trigger"),
      (this._dialogClass = "ui-datepicker-dialog"),
      (this._disableClass = "ui-datepicker-disabled"),
      (this._unselectableClass = "ui-datepicker-unselectable"),
      (this._currentClass = "ui-datepicker-current-day"),
      (this._dayOverClass = "ui-datepicker-days-cell-over"),
      (this.regional = []),
      (this.regional[""] = {
        closeText: "Done",
        prevText: "Prev",
        nextText: "Next",
        currentText: "Today",
        monthNames: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        monthNamesShort: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        dayNames: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        weekHeader: "Wk",
        dateFormat: "mm/dd/yy",
        firstDay: 0,
        isRTL: !1,
        showMonthAfterYear: !1,
        yearSuffix: "",
      }),
      (this._defaults = {
        showOn: "focus",
        showAnim: "fadeIn",
        showOptions: {},
        defaultDate: null,
        appendText: "",
        buttonText: "...",
        buttonImage: "",
        buttonImageOnly: !1,
        hideIfNoPrevNext: !1,
        navigationAsDateFormat: !1,
        gotoCurrent: !1,
        changeMonth: !1,
        changeYear: !1,
        yearRange: "c-10:c+10",
        showOtherMonths: !1,
        selectOtherMonths: !1,
        showWeek: !1,
        calculateWeek: this.iso8601Week,
        shortYearCutoff: "+10",
        minDate: null,
        maxDate: null,
        duration: "fast",
        beforeShowDay: null,
        beforeShow: null,
        onSelect: null,
        onChangeMonthYear: null,
        onClose: null,
        numberOfMonths: 1,
        showCurrentAtPos: 0,
        stepMonths: 1,
        stepBigMonths: 12,
        altField: "",
        altFormat: "",
        constrainInput: !0,
        showButtonPanel: !1,
        autoSize: !1,
        disabled: !1,
      }),
      $.extend(this._defaults, this.regional[""]),
      (this.dpDiv = bindHover(
        $(
          "<div id='" +
            this._mainDivId +
            "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"
        )
      ));
  }
  function bindHover(e) {
    var t =
      "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
    return e
      .delegate(t, "mouseout", function () {
        $(this).removeClass("ui-state-hover"),
          -1 !== this.className.indexOf("ui-datepicker-prev") &&
            $(this).removeClass("ui-datepicker-prev-hover"),
          -1 !== this.className.indexOf("ui-datepicker-next") &&
            $(this).removeClass("ui-datepicker-next-hover");
      })
      .delegate(t, "mouseover", function () {
        $.datepicker._isDisabledDatepicker(
          instActive.inline ? e.parent()[0] : instActive.input[0]
        ) ||
          ($(this)
            .parents(".ui-datepicker-calendar")
            .find("a")
            .removeClass("ui-state-hover"),
          $(this).addClass("ui-state-hover"),
          -1 !== this.className.indexOf("ui-datepicker-prev") &&
            $(this).addClass("ui-datepicker-prev-hover"),
          -1 !== this.className.indexOf("ui-datepicker-next") &&
            $(this).addClass("ui-datepicker-next-hover"));
      });
  }
  function extendRemove(e, t) {
    $.extend(e, t);
    for (var n in t) null == t[n] && (e[n] = t[n]);
    return e;
  }
  $.extend($.ui, { datepicker: { version: "1.10.3" } });
  var PROP_NAME = "datepicker",
    instActive;
  $.extend(Datepicker.prototype, {
    markerClassName: "hasDatepicker",
    maxRows: 4,
    _widgetDatepicker: function () {
      return this.dpDiv;
    },
    setDefaults: function (e) {
      return extendRemove(this._defaults, e || {}), this;
    },
    _attachDatepicker: function (target, settings) {
      var inlineSettings = null;
      for (var attrName in this._defaults) {
        var attrValue = target.getAttribute("date:" + attrName);
        if (attrValue) {
          inlineSettings = inlineSettings || {};
          try {
            inlineSettings[attrName] = eval(attrValue);
          } catch (e) {
            inlineSettings[attrName] = attrValue;
          }
        }
      }
      var nodeName = target.nodeName.toLowerCase(),
        inline = "div" == nodeName || "span" == nodeName;
      target.id || ((this.uuid += 1), (target.id = "dp" + this.uuid));
      var inst = this._newInst($(target), inline),
        regional = $.extend(
          {},
          (settings && this.regional[settings.regional]) || {}
        );
      (inst.settings = $.extend(
        regional,
        settings || {},
        inlineSettings || {}
      )),
        (inst.settings = $.extend({}, settings || {}, inlineSettings || {})),
        "input" == nodeName
          ? this._connectDatepicker(target, inst)
          : inline && this._inlineDatepicker(target, inst);
    },
    _newInst: function (e, t) {
      return {
        id: e[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"),
        input: e,
        selectedDay: 0,
        selectedMonth: 0,
        selectedYear: 0,
        drawMonth: 0,
        drawYear: 0,
        inline: t,
        dpDiv: t
          ? bindHover(
              $(
                "<div class='" +
                  this._inlineClass +
                  " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"
              )
            )
          : this.dpDiv,
      };
    },
    _connectDatepicker: function (e, t) {
      var n = $(e);
      (t.append = $([])),
        (t.trigger = $([])),
        n.hasClass(this.markerClassName) ||
          (this._attachments(n, t),
          n
            .addClass(this.markerClassName)
            .keydown(this._doKeyDown)
            .keypress(this._doKeyPress)
            .keyup(this._doKeyUp),
          this._autoSize(t),
          $.data(e, PROP_NAME, t),
          t.settings.disabled && this._disableDatepicker(e));
    },
    _attachments: function (e, t) {
      var n,
        i,
        r,
        a = this._get(t, "appendText"),
        s = this._get(t, "isRTL");
      t.append && t.append.remove(),
        a &&
          ((t.append = $(
            "<span class='" + this._appendClass + "'>" + a + "</span>"
          )),
          e[s ? "before" : "after"](t.append)),
        e.unbind("focus", this._showDatepicker),
        t.trigger && t.trigger.remove(),
        ("focus" !== (n = this._get(t, "showOn")) && "both" !== n) ||
          e.focus(this._showDatepicker),
        ("button" !== n && "both" !== n) ||
          ((i = this._get(t, "buttonText")),
          (r = this._get(t, "buttonImage")),
          (t.trigger = $(
            this._get(t, "buttonImageOnly")
              ? $("<img/>")
                  .addClass(this._triggerClass)
                  .attr({ src: r, alt: i, title: i })
              : $("<button type='button'></button>")
                  .addClass(this._triggerClass)
                  .html(r ? $("<img/>").attr({ src: r, alt: i, title: i }) : i)
          )),
          e[s ? "before" : "after"](t.trigger),
          t.trigger.click(function () {
            return (
              $.datepicker._datepickerShowing &&
              $.datepicker._lastInput === e[0]
                ? $.datepicker._hideDatepicker()
                : $.datepicker._datepickerShowing &&
                  $.datepicker._lastInput !== e[0]
                ? ($.datepicker._hideDatepicker(),
                  $.datepicker._showDatepicker(e[0]))
                : $.datepicker._showDatepicker(e[0]),
              !1
            );
          }));
    },
    _autoSize: function (e) {
      if (this._get(e, "autoSize") && !e.inline) {
        var t,
          n,
          i,
          r,
          a = new Date(2009, 11, 20),
          s = this._get(e, "dateFormat");
        s.match(/[DM]/) &&
          ((t = function (e) {
            for (n = 0, i = 0, r = 0; r < e.length; r++)
              e[r].length > n && ((n = e[r].length), (i = r));
            return i;
          }),
          a.setMonth(
            t(this._get(e, s.match(/MM/) ? "monthNames" : "monthNamesShort"))
          ),
          a.setDate(
            t(this._get(e, s.match(/DD/) ? "dayNames" : "dayNamesShort")) +
              20 -
              a.getDay()
          )),
          e.input.attr("size", this._formatDate(e, a).length);
      }
    },
    _inlineDatepicker: function (e, t) {
      var n = $(e);
      n.hasClass(this.markerClassName) ||
        (n.addClass(this.markerClassName).append(t.dpDiv),
        $.data(e, PROP_NAME, t),
        this._setDate(t, this._getDefaultDate(t), !0),
        this._updateDatepicker(t),
        this._updateAlternate(t),
        t.settings.disabled && this._disableDatepicker(e),
        t.dpDiv.css("display", "block"));
    },
    _dialogDatepicker: function (e, t, n, i, r) {
      var a,
        s,
        o,
        l,
        u,
        c = this._dialogInst;
      return (
        c ||
          ((this.uuid += 1),
          (a = "dp" + this.uuid),
          (this._dialogInput = $(
            "<input type='text' id='" +
              a +
              "' style='position: absolute; top: -100px; width: 0px;'/>"
          )),
          this._dialogInput.keydown(this._doKeyDown),
          $("body").append(this._dialogInput),
          ((c = this._dialogInst =
            this._newInst(this._dialogInput, !1)).settings = {}),
          $.data(this._dialogInput[0], PROP_NAME, c)),
        extendRemove(c.settings, i || {}),
        (t = t && t.constructor === Date ? this._formatDate(c, t) : t),
        this._dialogInput.val(t),
        (this._pos = r ? (r.length ? r : [r.pageX, r.pageY]) : null),
        this._pos ||
          ((s = document.documentElement.clientWidth),
          (o = document.documentElement.clientHeight),
          (l = document.documentElement.scrollLeft || document.body.scrollLeft),
          (u = document.documentElement.scrollTop || document.body.scrollTop),
          (this._pos = [s / 2 - 100 + l, o / 2 - 150 + u])),
        this._dialogInput
          .css("left", this._pos[0] + 20 + "px")
          .css("top", this._pos[1] + "px"),
        (c.settings.onSelect = n),
        (this._inDialog = !0),
        this.dpDiv.addClass(this._dialogClass),
        this._showDatepicker(this._dialogInput[0]),
        $.blockUI && $.blockUI(this.dpDiv),
        $.data(this._dialogInput[0], PROP_NAME, c),
        this
      );
    },
    _destroyDatepicker: function (e) {
      var t,
        n = $(e),
        i = $.data(e, PROP_NAME);
      n.hasClass(this.markerClassName) &&
        ((t = e.nodeName.toLowerCase()),
        $.removeData(e, PROP_NAME),
        "input" === t
          ? (i.append.remove(),
            i.trigger.remove(),
            n
              .removeClass(this.markerClassName)
              .unbind("focus", this._showDatepicker)
              .unbind("keydown", this._doKeyDown)
              .unbind("keypress", this._doKeyPress)
              .unbind("keyup", this._doKeyUp))
          : ("div" !== t && "span" !== t) ||
            n.removeClass(this.markerClassName).empty());
    },
    _enableDatepicker: function (e) {
      var t,
        n,
        i = $(e),
        r = $.data(e, PROP_NAME);
      i.hasClass(this.markerClassName) &&
        ("input" === (t = e.nodeName.toLowerCase())
          ? ((e.disabled = !1),
            r.trigger
              .filter("button")
              .each(function () {
                this.disabled = !1;
              })
              .end()
              .filter("img")
              .css({ opacity: "1.0", cursor: "" }))
          : ("div" !== t && "span" !== t) ||
            ((n = i.children("." + this._inlineClass))
              .children()
              .removeClass("ui-state-disabled"),
            n
              .find("select.ui-datepicker-month, select.ui-datepicker-year")
              .prop("disabled", !1)),
        (this._disabledInputs = $.map(this._disabledInputs, function (t) {
          return t === e ? null : t;
        })));
    },
    _disableDatepicker: function (e) {
      var t,
        n,
        i = $(e),
        r = $.data(e, PROP_NAME);
      i.hasClass(this.markerClassName) &&
        ("input" === (t = e.nodeName.toLowerCase())
          ? ((e.disabled = !0),
            r.trigger
              .filter("button")
              .each(function () {
                this.disabled = !0;
              })
              .end()
              .filter("img")
              .css({ opacity: "0.5", cursor: "default" }))
          : ("div" !== t && "span" !== t) ||
            ((n = i.children("." + this._inlineClass))
              .children()
              .addClass("ui-state-disabled"),
            n
              .find("select.ui-datepicker-month, select.ui-datepicker-year")
              .prop("disabled", !0)),
        (this._disabledInputs = $.map(this._disabledInputs, function (t) {
          return t === e ? null : t;
        })),
        (this._disabledInputs[this._disabledInputs.length] = e));
    },
    _isDisabledDatepicker: function (e) {
      if (!e) return !1;
      for (var t = 0; t < this._disabledInputs.length; t++)
        if (this._disabledInputs[t] === e) return !0;
      return !1;
    },
    _getInst: function (e) {
      try {
        return $.data(e, PROP_NAME);
      } catch (e) {
        throw "Missing instance data for this datepicker";
      }
    },
    _optionDatepicker: function (e, t, n) {
      var i,
        r,
        a,
        s,
        o = this._getInst(e);
      if (2 === arguments.length && "string" == typeof t)
        return "defaults" === t
          ? $.extend({}, $.datepicker._defaults)
          : o
          ? "all" === t
            ? $.extend({}, o.settings)
            : this._get(o, t)
          : null;
      (i = t || {}),
        "string" == typeof t && ((i = {})[t] = n),
        o &&
          (this._curInst === o && this._hideDatepicker(),
          (r = this._getDateDatepicker(e, !0)),
          (a = this._getMinMaxDate(o, "min")),
          (s = this._getMinMaxDate(o, "max")),
          extendRemove(o.settings, i),
          null !== a &&
            i.dateFormat !== undefined &&
            i.minDate === undefined &&
            (o.settings.minDate = this._formatDate(o, a)),
          null !== s &&
            i.dateFormat !== undefined &&
            i.maxDate === undefined &&
            (o.settings.maxDate = this._formatDate(o, s)),
          "disabled" in i &&
            (i.disabled
              ? this._disableDatepicker(e)
              : this._enableDatepicker(e)),
          this._attachments($(e), o),
          this._autoSize(o),
          this._setDate(o, r),
          this._updateAlternate(o),
          this._updateDatepicker(o));
    },
    _changeDatepicker: function (e, t, n) {
      this._optionDatepicker(e, t, n);
    },
    _refreshDatepicker: function (e) {
      var t = this._getInst(e);
      t && this._updateDatepicker(t);
    },
    _setDateDatepicker: function (e, t) {
      var n = this._getInst(e);
      n &&
        (this._setDate(n, t),
        this._updateDatepicker(n),
        this._updateAlternate(n));
    },
    _getDateDatepicker: function (e, t) {
      var n = this._getInst(e);
      return (
        n && !n.inline && this._setDateFromField(n, t),
        n ? this._getDate(n) : null
      );
    },
    _doKeyDown: function (e) {
      var t,
        n,
        i,
        r = $.datepicker._getInst(e.target),
        a = !0,
        s = r.dpDiv.is(".ui-datepicker-rtl");
      if (((r._keyEvent = !0), $.datepicker._datepickerShowing))
        switch (e.keyCode) {
          case 9:
            $.datepicker._hideDatepicker(), (a = !1);
            break;
          case 13:
            return (
              (i = $(
                "td." +
                  $.datepicker._dayOverClass +
                  ":not(." +
                  $.datepicker._currentClass +
                  ")",
                r.dpDiv
              ))[0] &&
                $.datepicker._selectDay(
                  e.target,
                  r.selectedMonth,
                  r.selectedYear,
                  i[0]
                ),
              (t = $.datepicker._get(r, "onSelect")),
              t
                ? ((n = $.datepicker._formatDate(r)),
                  t.apply(r.input ? r.input[0] : null, [n, r]))
                : $.datepicker._hideDatepicker(),
              !1
            );
          case 27:
            $.datepicker._hideDatepicker();
            break;
          case 33:
            $.datepicker._adjustDate(
              e.target,
              e.ctrlKey
                ? -$.datepicker._get(r, "stepBigMonths")
                : -$.datepicker._get(r, "stepMonths"),
              "M"
            );
            break;
          case 34:
            $.datepicker._adjustDate(
              e.target,
              e.ctrlKey
                ? +$.datepicker._get(r, "stepBigMonths")
                : +$.datepicker._get(r, "stepMonths"),
              "M"
            );
            break;
          case 35:
            (e.ctrlKey || e.metaKey) && $.datepicker._clearDate(e.target),
              (a = e.ctrlKey || e.metaKey);
            break;
          case 36:
            (e.ctrlKey || e.metaKey) && $.datepicker._gotoToday(e.target),
              (a = e.ctrlKey || e.metaKey);
            break;
          case 37:
            (e.ctrlKey || e.metaKey) &&
              $.datepicker._adjustDate(e.target, s ? 1 : -1, "D"),
              (a = e.ctrlKey || e.metaKey),
              e.originalEvent.altKey &&
                $.datepicker._adjustDate(
                  e.target,
                  e.ctrlKey
                    ? -$.datepicker._get(r, "stepBigMonths")
                    : -$.datepicker._get(r, "stepMonths"),
                  "M"
                );
            break;
          case 38:
            (e.ctrlKey || e.metaKey) &&
              $.datepicker._adjustDate(e.target, -7, "D"),
              (a = e.ctrlKey || e.metaKey);
            break;
          case 39:
            (e.ctrlKey || e.metaKey) &&
              $.datepicker._adjustDate(e.target, s ? -1 : 1, "D"),
              (a = e.ctrlKey || e.metaKey),
              e.originalEvent.altKey &&
                $.datepicker._adjustDate(
                  e.target,
                  e.ctrlKey
                    ? +$.datepicker._get(r, "stepBigMonths")
                    : +$.datepicker._get(r, "stepMonths"),
                  "M"
                );
            break;
          case 40:
            (e.ctrlKey || e.metaKey) &&
              $.datepicker._adjustDate(e.target, 7, "D"),
              (a = e.ctrlKey || e.metaKey);
            break;
          default:
            a = !1;
        }
      else
        36 === e.keyCode && e.ctrlKey
          ? $.datepicker._showDatepicker(this)
          : (a = !1);
      a && (e.preventDefault(), e.stopPropagation());
    },
    _doKeyPress: function (e) {
      var t,
        n,
        i = $.datepicker._getInst(e.target);
      if ($.datepicker._get(i, "constrainInput"))
        return (
          (t = $.datepicker._possibleChars($.datepicker._get(i, "dateFormat"))),
          (n = String.fromCharCode(
            null == e.charCode ? e.keyCode : e.charCode
          )),
          e.ctrlKey || e.metaKey || n < " " || !t || t.indexOf(n) > -1
        );
    },
    _doKeyUp: function (e) {
      var t = $.datepicker._getInst(e.target);
      if (t.input.val() !== t.lastVal)
        try {
          $.datepicker.parseDate(
            $.datepicker._get(t, "dateFormat"),
            t.input ? t.input.val() : null,
            $.datepicker._getFormatConfig(t)
          ) &&
            ($.datepicker._setDateFromField(t),
            $.datepicker._updateAlternate(t),
            $.datepicker._updateDatepicker(t));
        } catch (e) {}
      return !0;
    },
    _showDatepicker: function (e) {
      if (
        ("input" !== (e = e.target || e).nodeName.toLowerCase() &&
          (e = $("input", e.parentNode)[0]),
        !$.datepicker._isDisabledDatepicker(e) && $.datepicker._lastInput !== e)
      ) {
        var t, n, i, r, a, s, o;
        (t = $.datepicker._getInst(e)),
          $.datepicker._curInst &&
            $.datepicker._curInst !== t &&
            ($.datepicker._curInst.dpDiv.stop(!0, !0),
            t &&
              $.datepicker._datepickerShowing &&
              $.datepicker._hideDatepicker($.datepicker._curInst.input[0])),
          !1 !==
            (i = (n = $.datepicker._get(t, "beforeShow"))
              ? n.apply(e, [e, t])
              : {}) &&
            (extendRemove(t.settings, i),
            (t.lastVal = null),
            ($.datepicker._lastInput = e),
            $.datepicker._setDateFromField(t),
            $.datepicker._inDialog && (e.value = ""),
            $.datepicker._pos ||
              (($.datepicker._pos = $.datepicker._findPos(e)),
              ($.datepicker._pos[1] += e.offsetHeight)),
            (r = !1),
            $(e)
              .parents()
              .each(function () {
                return !(r |= "fixed" === $(this).css("position"));
              }),
            (a = { left: $.datepicker._pos[0], top: $.datepicker._pos[1] }),
            ($.datepicker._pos = null),
            t.dpDiv.empty(),
            t.dpDiv.css({
              position: "absolute",
              display: "block",
              top: "-1000px",
            }),
            $.datepicker._updateDatepicker(t),
            (a = $.datepicker._checkOffset(t, a, r)),
            t.dpDiv.css({
              position:
                $.datepicker._inDialog && $.blockUI
                  ? "static"
                  : r
                  ? "fixed"
                  : "absolute",
              display: "none",
              left: a.left + "px",
              top: a.top + "px",
            }),
            t.inline ||
              ((s = $.datepicker._get(t, "showAnim")),
              (o = $.datepicker._get(t, "duration")),
              t.dpDiv.zIndex($(e).zIndex() + 1),
              ($.datepicker._datepickerShowing = !0),
              $.effects && $.effects.effect[s]
                ? t.dpDiv.show(s, $.datepicker._get(t, "showOptions"), o)
                : t.dpDiv[s || "show"](s ? o : null),
              $.datepicker._shouldFocusInput(t) && t.input.focus(),
              ($.datepicker._curInst = t)));
      }
    },
    _updateDatepicker: function (e) {
      (this.maxRows = 4),
        (instActive = e),
        e.dpDiv.empty().append(this._generateHTML(e)),
        this._attachHandlers(e),
        e.dpDiv.find("." + this._dayOverClass + " a").mouseover();
      var t,
        n = this._getNumberOfMonths(e),
        i = n[1];
      e.dpDiv
        .removeClass(
          "ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4"
        )
        .width(""),
        i > 1 &&
          e.dpDiv
            .addClass("ui-datepicker-multi-" + i)
            .css("width", 17 * i + "em"),
        e.dpDiv[(1 !== n[0] || 1 !== n[1] ? "add" : "remove") + "Class"](
          "ui-datepicker-multi"
        ),
        e.dpDiv[(this._get(e, "isRTL") ? "add" : "remove") + "Class"](
          "ui-datepicker-rtl"
        ),
        e === $.datepicker._curInst &&
          $.datepicker._datepickerShowing &&
          $.datepicker._shouldFocusInput(e) &&
          e.input.focus(),
        e.yearshtml &&
          ((t = e.yearshtml),
          setTimeout(function () {
            t === e.yearshtml &&
              e.yearshtml &&
              e.dpDiv
                .find("select.ui-datepicker-year:first")
                .replaceWith(e.yearshtml),
              (t = e.yearshtml = null);
          }, 0));
    },
    _shouldFocusInput: function (e) {
      return (
        e.input &&
        e.input.is(":visible") &&
        !e.input.is(":disabled") &&
        !e.input.is(":focus")
      );
    },
    _checkOffset: function (e, t, n) {
      var i = e.dpDiv.outerWidth(),
        r = e.dpDiv.outerHeight(),
        a = e.input ? e.input.outerWidth() : 0,
        s = e.input ? e.input.outerHeight() : 0,
        o =
          document.documentElement.clientWidth +
          (n ? 0 : $(document).scrollLeft()),
        l =
          document.documentElement.clientHeight +
          (n ? 0 : $(document).scrollTop());
      return (
        (t.left -= this._get(e, "isRTL") ? i - a : 0),
        (t.left -=
          n && t.left === e.input.offset().left ? $(document).scrollLeft() : 0),
        (t.top -=
          n && t.top === e.input.offset().top + s
            ? $(document).scrollTop()
            : 0),
        (t.left -= Math.min(
          t.left,
          t.left + i > o && o > i ? Math.abs(t.left + i - o) : 0
        )),
        (t.top -= Math.min(
          t.top,
          t.top + r > l && l > r ? Math.abs(r + s) : 0
        )),
        t
      );
    },
    _findPos: function (e) {
      for (
        var t, n = this._getInst(e), i = this._get(n, "isRTL");
        e &&
        ("hidden" === e.type || 1 !== e.nodeType || $.expr.filters.hidden(e));

      )
        e = e[i ? "previousSibling" : "nextSibling"];
      return (t = $(e).offset()), [t.left, t.top];
    },
    _hideDatepicker: function (e) {
      var t,
        n,
        i,
        r,
        a = this._curInst;
      !a ||
        (e && a !== $.data(e, PROP_NAME)) ||
        (this._datepickerShowing &&
          ((t = this._get(a, "showAnim")),
          (n = this._get(a, "duration")),
          (i = function () {
            $.datepicker._tidyDialog(a);
          }),
          $.effects && ($.effects.effect[t] || $.effects[t])
            ? a.dpDiv.hide(t, $.datepicker._get(a, "showOptions"), n, i)
            : a.dpDiv[
                "slideDown" === t
                  ? "slideUp"
                  : "fadeIn" === t
                  ? "fadeOut"
                  : "hide"
              ](t ? n : null, i),
          t || i(),
          (this._datepickerShowing = !1),
          (r = this._get(a, "onClose")) &&
            r.apply(a.input ? a.input[0] : null, [
              a.input ? a.input.val() : "",
              a,
            ]),
          (this._lastInput = null),
          this._inDialog &&
            (this._dialogInput.css({
              position: "absolute",
              left: "0",
              top: "-100px",
            }),
            $.blockUI && ($.unblockUI(), $("body").append(this.dpDiv))),
          (this._inDialog = !1)));
    },
    _tidyDialog: function (e) {
      e.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar");
    },
    _checkExternalClick: function (e) {
      if ($.datepicker._curInst) {
        var t = $(e.target),
          n = $.datepicker._getInst(t[0]);
        ((t[0].id === $.datepicker._mainDivId ||
          0 !== t.parents("#" + $.datepicker._mainDivId).length ||
          t.hasClass($.datepicker.markerClassName) ||
          t.closest("." + $.datepicker._triggerClass).length ||
          !$.datepicker._datepickerShowing ||
          ($.datepicker._inDialog && $.blockUI)) &&
          (!t.hasClass($.datepicker.markerClassName) ||
            $.datepicker._curInst === n)) ||
          $.datepicker._hideDatepicker();
      }
    },
    _adjustDate: function (e, t, n) {
      var i = $(e),
        r = this._getInst(i[0]);
      this._isDisabledDatepicker(i[0]) ||
        (this._adjustInstDate(
          r,
          t + ("M" === n ? this._get(r, "showCurrentAtPos") : 0),
          n
        ),
        this._updateDatepicker(r));
    },
    _gotoToday: function (e) {
      var t,
        n = $(e),
        i = this._getInst(n[0]);
      this._get(i, "gotoCurrent") && i.currentDay
        ? ((i.selectedDay = i.currentDay),
          (i.drawMonth = i.selectedMonth = i.currentMonth),
          (i.drawYear = i.selectedYear = i.currentYear))
        : ((t = new Date()),
          (i.selectedDay = t.getDate()),
          (i.drawMonth = i.selectedMonth = t.getMonth()),
          (i.drawYear = i.selectedYear = t.getFullYear())),
        this._notifyChange(i),
        this._adjustDate(n);
    },
    _selectMonthYear: function (e, t, n) {
      var i = $(e),
        r = this._getInst(i[0]);
      (r["selected" + ("M" === n ? "Month" : "Year")] = r[
        "draw" + ("M" === n ? "Month" : "Year")
      ] =
        parseInt(t.options[t.selectedIndex].value, 10)),
        this._notifyChange(r),
        this._adjustDate(i);
    },
    _selectDay: function (e, t, n, i) {
      var r,
        a = $(e);
      $(i).hasClass(this._unselectableClass) ||
        this._isDisabledDatepicker(a[0]) ||
        (((r = this._getInst(a[0])).selectedDay = r.currentDay =
          $("a", i).html()),
        (r.selectedMonth = r.currentMonth = t),
        (r.selectedYear = r.currentYear = n),
        this._selectDate(
          e,
          this._formatDate(r, r.currentDay, r.currentMonth, r.currentYear)
        ));
    },
    _clearDate: function (e) {
      var t = $(e);
      this._selectDate(t, "");
    },
    _selectDate: function (e, t) {
      var n,
        i = $(e),
        r = this._getInst(i[0]);
      (t = null != t ? t : this._formatDate(r)),
        r.input && r.input.val(t),
        this._updateAlternate(r),
        (n = this._get(r, "onSelect"))
          ? n.apply(r.input ? r.input[0] : null, [t, r])
          : r.input && r.input.trigger("change"),
        r.inline
          ? this._updateDatepicker(r)
          : (this._hideDatepicker(),
            (this._lastInput = r.input[0]),
            "object" != typeof r.input[0] && r.input.focus(),
            (this._lastInput = null));
    },
    _updateAlternate: function (e) {
      var t,
        n,
        i,
        r = this._get(e, "altField");
      r &&
        ((t = this._get(e, "altFormat") || this._get(e, "dateFormat")),
        (n = this._getDate(e)),
        (i = this.formatDate(t, n, this._getFormatConfig(e))),
        $(r).each(function () {
          $(this).val(i);
        }));
    },
    noWeekends: function (e) {
      var t = e.getDay();
      return [t > 0 && t < 6, ""];
    },
    iso8601Week: function (e) {
      var t,
        n = new Date(e.getTime());
      return (
        n.setDate(n.getDate() + 4 - (n.getDay() || 7)),
        (t = n.getTime()),
        n.setMonth(0),
        n.setDate(1),
        Math.floor(Math.round((t - n) / 864e5) / 7) + 1
      );
    },
    parseDate: function (e, t, n) {
      if (null == e || null == t) throw "Invalid arguments";
      if ("" === (t = "object" == typeof t ? t.toString() : t + ""))
        return null;
      var i,
        r,
        a,
        s,
        o = 0,
        l = (n ? n.shortYearCutoff : null) || this._defaults.shortYearCutoff,
        u =
          "string" != typeof l
            ? l
            : (new this.CDate().getFullYear() % 100) + parseInt(l, 10),
        c = (n ? n.dayNamesShort : null) || this._defaults.dayNamesShort,
        d = (n ? n.dayNames : null) || this._defaults.dayNames,
        p = (n ? n.monthNamesShort : null) || this._defaults.monthNamesShort,
        h = (n ? n.monthNames : null) || this._defaults.monthNames,
        f = -1,
        g = -1,
        m = -1,
        y = -1,
        v = !1,
        b = function (t) {
          var n = i + 1 < e.length && e.charAt(i + 1) === t;
          return n && i++, n;
        },
        _ = function (e) {
          var n = b(e),
            i =
              "@" === e
                ? 14
                : "!" === e
                ? 20
                : "y" === e && n
                ? 4
                : "o" === e
                ? 3
                : 2,
            r = new RegExp("^\\d{1," + i + "}"),
            a = t.substring(o).match(r);
          if (!a) throw "Missing number at position " + o;
          return (o += a[0].length), parseInt(a[0], 10);
        },
        x = function (e, n, i) {
          var r = -1,
            a = $.map(b(e) ? i : n, function (e, t) {
              return [[t, e]];
            }).sort(function (e, t) {
              return -(e[1].length - t[1].length);
            });
          if (
            ($.each(a, function (e, n) {
              var i = n[1];
              if (t.substr(o, i.length).toLowerCase() === i.toLowerCase())
                return (r = n[0]), (o += i.length), !1;
            }),
            -1 !== r)
          )
            return r + 1;
          throw "Unknown name at position " + o;
        },
        k = function () {
          if (t.charAt(o) !== e.charAt(i))
            throw "Unexpected literal at position " + o;
          o++;
        };
      for (i = 0; i < e.length; i++)
        if (v) "'" !== e.charAt(i) || b("'") ? k() : (v = !1);
        else
          switch (e.charAt(i)) {
            case "d":
              m = _("d");
              break;
            case "D":
              x("D", c, d);
              break;
            case "o":
              y = _("o");
              break;
            case "m":
              g = _("m");
              break;
            case "M":
              g = x("M", p, h);
              break;
            case "y":
              f = _("y");
              break;
            case "@":
              (f = (s = new this.CDate(_("@"))).getFullYear()),
                (g = s.getMonth() + 1),
                (m = s.getDate());
              break;
            case "!":
              (f = (s = new Date(
                (_("!") - this._ticksTo1970) / 1e4
              )).getFullYear()),
                (g = s.getMonth() + 1),
                (m = s.getDate());
              break;
            case "'":
              b("'") ? k() : (v = !0);
              break;
            default:
              k();
          }
      if (o < t.length && ((a = t.substr(o)), !/^\s+/.test(a)))
        throw "Extra/unparsed characters found in date: " + a;
      if (
        (-1 === f
          ? (f = new this.CDate().getFullYear())
          : f < 100 &&
            (f +=
              new this.CDate().getFullYear() -
              (new this.CDate().getFullYear() % 100) +
              (f <= u ? 0 : -100)),
        y > -1)
      )
        for (g = 1, m = y; ; ) {
          if (((r = this._getDaysInMonth(f, g - 1)), m <= r)) break;
          g++, (m -= r);
        }
      if (
        (s = this._daylightSavingAdjust(
          new this.CDate(f, g - 1, m)
        )).getFullYear() !== f ||
        s.getMonth() + 1 !== g ||
        s.getDate() !== m
      )
        throw "Invalid date";
      return s;
    },
    ATOM: "yy-mm-dd",
    COOKIE: "D, dd M yy",
    ISO_8601: "yy-mm-dd",
    RFC_822: "D, d M y",
    RFC_850: "DD, dd-M-y",
    RFC_1036: "D, d M y",
    RFC_1123: "D, d M yy",
    RFC_2822: "D, d M yy",
    RSS: "D, d M y",
    TICKS: "!",
    TIMESTAMP: "@",
    W3C: "yy-mm-dd",
    _ticksTo1970:
      24 *
      (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)) *
      60 *
      60 *
      1e7,
    formatDate: function (e, t, n) {
      if (!t) return "";
      var i,
        r = (n ? n.dayNamesShort : null) || this._defaults.dayNamesShort,
        a = (n ? n.dayNames : null) || this._defaults.dayNames,
        s = (n ? n.monthNamesShort : null) || this._defaults.monthNamesShort,
        o = (n ? n.monthNames : null) || this._defaults.monthNames,
        l = function (t) {
          var n = i + 1 < e.length && e.charAt(i + 1) === t;
          return n && i++, n;
        },
        u = function (e, t, n) {
          var i = "" + t;
          if (l(e)) for (; i.length < n; ) i = "0" + i;
          return i;
        },
        c = function (e, t, n, i) {
          return l(e) ? i[t] : n[t];
        },
        d = "",
        p = !1;
      if (t)
        for (i = 0; i < e.length; i++)
          if (p) "'" !== e.charAt(i) || l("'") ? (d += e.charAt(i)) : (p = !1);
          else
            switch (e.charAt(i)) {
              case "d":
                d += u("d", t.getDate(), 2);
                break;
              case "D":
                d += c("D", t.getDay(), r, a);
                break;
              case "o":
                d += u(
                  "o",
                  Math.round(
                    (new Date(
                      t.getFullYear(),
                      t.getMonth(),
                      t.getDate()
                    ).getTime() -
                      new Date(t.getFullYear(), 0, 0).getTime()) /
                      864e5
                  ),
                  3
                );
                break;
              case "m":
                d += u("m", t.getMonth() + 1, 2);
                break;
              case "M":
                d += c("M", t.getMonth(), s, o);
                break;
              case "y":
                d += l("y")
                  ? t.getFullYear()
                  : (t.getYear() % 100 < 10 ? "0" : "") + (t.getYear() % 100);
                break;
              case "@":
                d += t.getTime();
                break;
              case "!":
                d += 1e4 * t.getTime() + this._ticksTo1970;
                break;
              case "'":
                l("'") ? (d += "'") : (p = !0);
                break;
              default:
                d += e.charAt(i);
            }
      return d;
    },
    _possibleChars: function (e) {
      var t,
        n = "",
        i = !1,
        r = function (n) {
          var i = t + 1 < e.length && e.charAt(t + 1) === n;
          return i && t++, i;
        };
      for (t = 0; t < e.length; t++)
        if (i) "'" !== e.charAt(t) || r("'") ? (n += e.charAt(t)) : (i = !1);
        else
          switch (e.charAt(t)) {
            case "d":
            case "m":
            case "y":
            case "@":
              n += "0123456789";
              break;
            case "D":
            case "M":
              return null;
            case "'":
              r("'") ? (n += "'") : (i = !0);
              break;
            default:
              n += e.charAt(t);
          }
      return n;
    },
    _get: function (e, t) {
      return e.settings[t] !== undefined ? e.settings[t] : this._defaults[t];
    },
    _setDateFromField: function (e, t) {
      if (e.input.val() !== e.lastVal) {
        var n = this._get(e, "dateFormat"),
          i = (e.lastVal = e.input ? e.input.val() : null),
          r = this._getDefaultDate(e),
          a = r,
          s = this._getFormatConfig(e);
        try {
          a = this.parseDate(n, i, s) || r;
        } catch (e) {
          i = t ? "" : i;
        }
        (e.selectedDay = a.getDate()),
          (e.drawMonth = e.selectedMonth = a.getMonth()),
          (e.drawYear = e.selectedYear = a.getFullYear()),
          (e.currentDay = i ? a.getDate() : 0),
          (e.currentMonth = i ? a.getMonth() : 0),
          (e.currentYear = i ? a.getFullYear() : 0),
          this._adjustInstDate(e);
      }
    },
    _getDefaultDate: function (e) {
      return (
        (this.CDate = this._get(e, "calendar")),
        this._restrictMinMax(
          e,
          this._determineDate(e, this._get(e, "defaultDate"), new this.CDate())
        )
      );
    },
    _determineDate: function (e, t, n) {
      var i =
        null == t || "" === t
          ? n
          : "string" == typeof t
          ? (function (t) {
              try {
                return $.datepicker.parseDate(
                  $.datepicker._get(e, "dateFormat"),
                  t,
                  $.datepicker._getFormatConfig(e)
                );
              } catch (e) {}
              for (
                var n =
                    (t.toLowerCase().match(/^c/)
                      ? $.datepicker._getDate(e)
                      : null) || new Date(),
                  i = n.getFullYear(),
                  r = n.getMonth(),
                  a = n.getDate(),
                  s = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
                  o = s.exec(t);
                o;

              ) {
                switch (o[2] || "d") {
                  case "d":
                  case "D":
                    a += parseInt(o[1], 10);
                    break;
                  case "w":
                  case "W":
                    a += 7 * parseInt(o[1], 10);
                    break;
                  case "m":
                  case "M":
                    (r += parseInt(o[1], 10)),
                      (a = Math.min(a, $.datepicker._getDaysInMonth(i, r)));
                    break;
                  case "y":
                  case "Y":
                    (i += parseInt(o[1], 10)),
                      (a = Math.min(a, $.datepicker._getDaysInMonth(i, r)));
                }
                o = s.exec(t);
              }
              return new Date(i, r, a);
            })(t)
          : "number" == typeof t
          ? isNaN(t)
            ? n
            : (function (e) {
                this.CDate;
                return t.setDate(t.getDate() + e), t;
              })(t)
          : new Date(t.getTime());
      return (
        (i = i && "Invalid Date" === i.toString() ? n : i) &&
          (i.setHours(0),
          i.setMinutes(0),
          i.setSeconds(0),
          i.setMilliseconds(0)),
        this._daylightSavingAdjust(i)
      );
    },
    _daylightSavingAdjust: function (e) {
      return e
        ? (e.setHours(e.getHours() > 12 ? e.getHours() + 2 : 0), e)
        : null;
    },
    _setDate: function (e, t, n) {
      this.CDate = this._get(e, "calendar");
      var i = !t,
        r = e.selectedMonth,
        a = e.selectedYear,
        s = this._restrictMinMax(
          e,
          this._determineDate(e, t, new this.CDate())
        );
      (e.selectedDay = e.currentDay = s.getDate()),
        (e.drawMonth = e.selectedMonth = e.currentMonth = s.getMonth()),
        (e.drawYear = e.selectedYear = e.currentYear = s.getFullYear()),
        (r === e.selectedMonth && a === e.selectedYear) ||
          n ||
          this._notifyChange(e),
        this._adjustInstDate(e),
        e.input && e.input.val(i ? "" : this._formatDate(e));
    },
    _getDate: function (e) {
      return (
        (this.CDate = this._get(e, "calendar")),
        !e.currentYear || (e.input && "" === e.input.val())
          ? null
          : this._daylightSavingAdjust(
              new this.CDate(e.currentYear, e.currentMonth, e.currentDay)
            )
      );
    },
    _attachHandlers: function (e) {
      var t = this._get(e, "stepMonths"),
        n = "#" + e.id.replace(/\\\\/g, "\\");
      e.dpDiv.find("[data-handler]").map(function () {
        var e = {
          prev: function () {
            $.datepicker._adjustDate(n, -t, "M");
          },
          next: function () {
            $.datepicker._adjustDate(n, +t, "M");
          },
          hide: function () {
            $.datepicker._hideDatepicker();
          },
          today: function () {
            $.datepicker._gotoToday(n);
          },
          selectDay: function () {
            return (
              $.datepicker._selectDay(
                n,
                +this.getAttribute("data-month"),
                +this.getAttribute("data-year"),
                this
              ),
              !1
            );
          },
          selectMonth: function () {
            return $.datepicker._selectMonthYear(n, this, "M"), !1;
          },
          selectYear: function () {
            return $.datepicker._selectMonthYear(n, this, "Y"), !1;
          },
        };
        $(this).bind(
          this.getAttribute("data-event"),
          e[this.getAttribute("data-handler")]
        );
      });
    },
    _generateHTML: function (e) {
      var t,
        n,
        i,
        r,
        a,
        s,
        o,
        l,
        u,
        c,
        d,
        p,
        h,
        f,
        g,
        m,
        y,
        v,
        b,
        _,
        x,
        k,
        D,
        w,
        C,
        T,
        N,
        M,
        S,
        $,
        A,
        E,
        j,
        I,
        F,
        L,
        H,
        O,
        P = new this.CDate(),
        R = new Date(),
        P = this._daylightSavingAdjust(
          new this.CDate(R.getFullYear(), R.getMonth(), R.getDate())
        ),
        Y = this._get(e, "isRTL"),
        q = this._get(e, "showButtonPanel"),
        W = this._get(e, "hideIfNoPrevNext"),
        B = this._get(e, "navigationAsDateFormat"),
        z = this._getNumberOfMonths(e),
        K = this._get(e, "showCurrentAtPos"),
        U = this._get(e, "stepMonths"),
        X = 1 !== z[0] || 1 !== z[1],
        G = this._daylightSavingAdjust(
          e.currentDay
            ? new this.CDate(e.currentYear, e.currentMonth, e.currentDay)
            : new Date(9999, 9, 9)
        ),
        V = this._getMinMaxDate(e, "min"),
        J = this._getMinMaxDate(e, "max"),
        Q = e.drawMonth - K,
        Z = e.drawYear;
      if ((Q < 0 && ((Q += 12), Z--), J))
        for (
          t = this._daylightSavingAdjust(
            new this.CDate(
              J.getFullYear(),
              J.getMonth() - z[0] * z[1] + 1,
              J.getDate()
            )
          ),
            t = V && t < V ? V : t;
          this._daylightSavingAdjust(new this.CDate(Z, Q, 1)) > t;

        )
          --Q < 0 && ((Q = 11), Z--);
      for (
        e.drawMonth = Q,
          e.drawYear = Z,
          n = this._get(e, "prevText"),
          n = B
            ? this.formatDate(
                n,
                this._daylightSavingAdjust(new this.CDate(Z, Q - U, 1)),
                this._getFormatConfig(e)
              )
            : n,
          i = this._canAdjustMonth(e, -1, Z, Q)
            ? "<a  style=\"direction:ltr\" class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='" +
              n +
              "'><span class='ui-icon ui-icon-circle-triangle-" +
              (Y ? "e" : "w") +
              "'>" +
              n +
              "</span></a>"
            : W
            ? ""
            : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" +
              n +
              "'><span class='ui-icon ui-icon-circle-triangle-" +
              (Y ? "e" : "w") +
              "'>" +
              n +
              "</span></a>",
          r = this._get(e, "nextText"),
          r = B
            ? this.formatDate(
                r,
                this._daylightSavingAdjust(new this.CDate(Z, Q + U, 1)),
                this._getFormatConfig(e)
              )
            : r,
          a = this._canAdjustMonth(e, 1, Z, Q)
            ? "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='" +
              r +
              "'><span class='ui-icon ui-icon-circle-triangle-" +
              (Y ? "w" : "e") +
              "'>" +
              r +
              "</span></a>"
            : W
            ? ""
            : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" +
              r +
              "'><span class='ui-icon ui-icon-circle-triangle-" +
              (Y ? "w" : "e") +
              "'>" +
              r +
              "</span></a>",
          s = this._get(e, "currentText"),
          o = this._get(e, "gotoCurrent") && e.currentDay ? G : P,
          s = B ? this.formatDate(s, o, this._getFormatConfig(e)) : s,
          l = e.inline
            ? ""
            : "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" +
              this._get(e, "closeText") +
              "</button>",
          u = q
            ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" +
              (Y ? l : "") +
              (this._isInRange(e, o)
                ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>" +
                  s +
                  "</button>"
                : "") +
              (Y ? "" : l) +
              "</div>"
            : "",
          c = parseInt(this._get(e, "firstDay"), 10),
          c = isNaN(c) ? 0 : c,
          d = this._get(e, "showWeek"),
          p = this._get(e, "dayNames"),
          h = this._get(e, "dayNamesMin"),
          f = this._get(e, "monthNames"),
          g = this._get(e, "monthNamesShort"),
          m = this._get(e, "beforeShowDay"),
          y = this._get(e, "showOtherMonths"),
          v = this._get(e, "selectOtherMonths"),
          b = this._getDefaultDate(e),
          _ = "",
          k = 0;
        k < z[0];
        k++
      ) {
        for (D = "", this.maxRows = 4, w = 0; w < z[1]; w++) {
          if (
            ((C = this._daylightSavingAdjust(
              new this.CDate(Z, Q, e.selectedDay)
            )),
            (T = " ui-corner-all"),
            (N = ""),
            X)
          ) {
            if (((N += "<div class='ui-datepicker-group"), z[1] > 1))
              switch (w) {
                case 0:
                  (N += " ui-datepicker-group-first"),
                    (T = " ui-corner-" + (Y ? "right" : "left"));
                  break;
                case z[1] - 1:
                  (N += " ui-datepicker-group-last"),
                    (T = " ui-corner-" + (Y ? "left" : "right"));
                  break;
                default:
                  (N += " ui-datepicker-group-middle"), (T = "");
              }
            N += "'>";
          }
          for (
            N +=
              "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" +
              T +
              "'>" +
              (/all|left/.test(T) && 0 === k ? (Y ? a : i) : "") +
              (/all|right/.test(T) && 0 === k ? (Y ? i : a) : "") +
              this._generateMonthYearHeader(
                e,
                Q,
                Z,
                V,
                J,
                k > 0 || w > 0,
                f,
                g
              ) +
              "</div><table class='ui-datepicker-calendar'><thead><tr>",
              M = d
                ? "<th class='ui-datepicker-week-col'>" +
                  this._get(e, "weekHeader") +
                  "</th>"
                : "",
              x = 0;
            x < 7;
            x++
          )
            (S = (x + c) % 7),
              (M +=
                "<th" +
                ((x + c + 6) % 7 >= 5
                  ? " class='ui-datepicker-week-end'"
                  : "") +
                "><span title='" +
                p[S] +
                "'>" +
                h[S] +
                "</span></th>");
          for (
            N += M + "</tr></thead><tbody>",
              $ = this._getDaysInMonth(Z, Q),
              Z === e.selectedYear &&
                Q === e.selectedMonth &&
                (e.selectedDay = Math.min(e.selectedDay, $)),
              A = (this._getFirstDayOfMonth(Z, Q) - c + 7) % 7,
              E = Math.ceil((A + $) / 7),
              j = X && this.maxRows > E ? this.maxRows : E,
              this.maxRows = j,
              I = this._daylightSavingAdjust(new this.CDate(Z, Q, 1 - A)),
              F = 0;
            F < j;
            F++
          ) {
            for (
              N += "<tr>",
                L = d
                  ? "<td class='ui-datepicker-week-col'>" +
                    this._get(e, "calculateWeek")(I) +
                    "</td>"
                  : "",
                x = 0;
              x < 7;
              x++
            ) {
              H = m ? m.apply(e.input ? e.input[0] : null, [I]) : [!0, ""];
              var ee =
                ((O = I.getMonth() !== Q) && !v) ||
                !H[0] ||
                (V && this._compareDate(I, "<", V)) ||
                (J && this._compareDate(I, ">", J));
              (L +=
                "<td class='" +
                ((x + c + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") +
                (O ? " ui-datepicker-other-month" : "") +
                ((I.getTime() === C.getTime() &&
                  Q === e.selectedMonth &&
                  e._keyEvent) ||
                (b.getTime() === I.getTime() && b.getTime() === C.getTime())
                  ? " " + this._dayOverClass
                  : "") +
                (ee
                  ? " " + this._unselectableClass + " ui-state-disabled"
                  : "") +
                (O && !y
                  ? ""
                  : " " +
                    H[1] +
                    (I.getTime() === G.getTime()
                      ? " " + this._currentClass
                      : "") +
                    (I.getTime() === P.getTime()
                      ? " ui-datepicker-today"
                      : "")) +
                "'" +
                ((O && !y) || !H[2]
                  ? ""
                  : " title='" + H[2].replace(/'/g, "&#39;") + "'") +
                (ee
                  ? ""
                  : " data-handler='selectDay' data-event='click' data-month='" +
                    I.getMonth() +
                    "' data-year='" +
                    I.getFullYear() +
                    "'") +
                ">" +
                (O && !y
                  ? "&#xa0;"
                  : ee
                  ? "<span class='ui-state-default'>" + I.getDate() + "</span>"
                  : "<a class='ui-state-default" +
                    (I.getTime() === P.getTime() ? " ui-state-highlight" : "") +
                    (I.getTime() === G.getTime() ? " ui-state-active" : "") +
                    (O ? " ui-priority-secondary" : "") +
                    "' href='#'>" +
                    I.getDate() +
                    "</a>") +
                "</td>"),
                I.setDate(I.getDate() + 1),
                (I = this._daylightSavingAdjust(I));
            }
            N += L + "</tr>";
          }
          ++Q > 11 && ((Q = 0), Z++),
            (D += N +=
              "</tbody></table>" +
              (X
                ? "</div>" +
                  (z[0] > 0 && w === z[1] - 1
                    ? "<div class='ui-datepicker-row-break'></div>"
                    : "")
                : ""));
        }
        _ += D;
      }
      return (_ += u), (e._keyEvent = !1), _;
    },
    _generateMonthYearHeader: function (e, t, n, i, r, a, s, o) {
      var l,
        u,
        c,
        d,
        p,
        h,
        f,
        g,
        m = this._get(e, "changeMonth"),
        y = this._get(e, "changeYear"),
        v = this._get(e, "showMonthAfterYear"),
        b = "<div class='ui-datepicker-title'>",
        _ = "";
      if (a || !m) _ += "<span class='ui-datepicker-month'>" + s[t] + "</span>";
      else {
        for (
          l = i && i.getFullYear() === n,
            u = r && r.getFullYear() === n,
            _ +=
              "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>",
            c = 0;
          c < 12;
          c++
        )
          (!l || c >= i.getMonth()) &&
            (!u || c <= r.getMonth()) &&
            (_ +=
              "<option value='" +
              c +
              "'" +
              (c === t ? " selected='selected'" : "") +
              ">" +
              o[c] +
              "</option>");
        _ += "</select>";
      }
      if ((v || (b += _ + (!a && m && y ? "" : "&#xa0;")), !e.yearshtml))
        if (((e.yearshtml = ""), a || !y))
          b += "<span class='ui-datepicker-year'>" + n + "</span>";
        else {
          for (
            d = this._get(e, "yearRange").split(":"),
              p = new this.CDate().getFullYear(),
              f = (h = function (e) {
                var t = e.match(/c[+\-].*/)
                  ? n + parseInt(e.substring(1), 10)
                  : e.match(/[+\-].*/)
                  ? p + parseInt(e, 10)
                  : parseInt(e, 10);
                return isNaN(t) ? p : t;
              })(d[0]),
              g = Math.max(f, h(d[1] || "")),
              f = i ? Math.max(f, i.getFullYear()) : f,
              g = r ? Math.min(g, r.getFullYear()) : g,
              e.yearshtml +=
                "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
            f <= g;
            f++
          )
            e.yearshtml +=
              "<option value='" +
              f +
              "'" +
              (f === n ? " selected='selected'" : "") +
              ">" +
              f +
              "</option>";
          (e.yearshtml += "</select>"),
            (b += e.yearshtml),
            (e.yearshtml = null);
        }
      return (
        (b += this._get(e, "yearSuffix")),
        v && (b += (!a && m && y ? "" : "&#xa0;") + _),
        (b += "</div>")
      );
    },
    _adjustInstDate: function (e, t, n) {
      var i = e.drawYear + ("Y" === n ? t : 0),
        r = e.drawMonth + ("M" === n ? t : 0),
        a =
          Math.min(e.selectedDay, this._getDaysInMonth(i, r)) +
          ("D" === n ? t : 0),
        s = this._restrictMinMax(
          e,
          this._daylightSavingAdjust(new this.CDate(i, r, a))
        );
      (e.selectedDay = s.getDate()),
        (e.drawMonth = e.selectedMonth = s.getMonth()),
        (e.drawYear = e.selectedYear = s.getFullYear()),
        ("M" !== n && "Y" !== n) || this._notifyChange(e);
    },
    _restrictMinMax: function (e, t) {
      var n = this._getMinMaxDate(e, "min"),
        i = this._getMinMaxDate(e, "max"),
        r = n && this._compareDate(t, "<", n) ? n : t;
      return i && this._compareDate(r, ">", i) ? i : r;
    },
    _notifyChange: function (e) {
      var t = this._get(e, "onChangeMonthYear");
      t &&
        t.apply(e.input ? e.input[0] : null, [
          e.selectedYear,
          e.selectedMonth + 1,
          e,
        ]);
    },
    _getNumberOfMonths: function (e) {
      var t = this._get(e, "numberOfMonths");
      return null == t ? [1, 1] : "number" == typeof t ? [1, t] : t;
    },
    _getMinMaxDate: function (e, t) {
      return this._determineDate(e, this._get(e, t + "Date"), null);
    },
    _getDaysInMonth: function (e, t) {
      return (
        32 - this._daylightSavingAdjust(new this.CDate(e, t, 32)).getDate()
      );
    },
    _getFirstDayOfMonth: function (e, t) {
      return new this.CDate(e, t, 1).getDay();
    },
    _canAdjustMonth: function (e, t, n, i) {
      var r = this._getNumberOfMonths(e),
        a = this._daylightSavingAdjust(
          new this.CDate(n, i + (t < 0 ? t : r[0] * r[1]), 1)
        );
      return (
        t < 0 && a.setDate(this._getDaysInMonth(a.getFullYear(), a.getMonth())),
        this._isInRange(e, a)
      );
    },
    _isInRange: function (e, t) {
      var n,
        i,
        r = this._getMinMaxDate(e, "min"),
        a = this._getMinMaxDate(e, "max"),
        s = null,
        o = null,
        l = this._get(e, "yearRange");
      return (
        l &&
          ((n = l.split(":")),
          (i = new Date().getFullYear()),
          (s = parseInt(n[0], 10)),
          (o = parseInt(n[1], 10)),
          n[0].match(/[+\-].*/) && (s += i),
          n[1].match(/[+\-].*/) && (o += i)),
        (!r || t.getTime() >= r.getTime()) &&
          (!a || t.getTime() <= a.getTime()) &&
          (!s || t.getFullYear() >= s) &&
          (!o || t.getFullYear() <= o)
      );
    },
    _getFormatConfig: function (e) {
      var t = this._get(e, "shortYearCutoff");
      return (
        (this.CDate = this._get(e, "calendar")),
        (t =
          "string" != typeof t
            ? t
            : (new this.CDate().getFullYear() % 100) + parseInt(t, 10)),
        {
          shortYearCutoff: t,
          dayNamesShort: this._get(e, "dayNamesShort"),
          dayNames: this._get(e, "dayNames"),
          monthNamesShort: this._get(e, "monthNamesShort"),
          monthNames: this._get(e, "monthNames"),
        }
      );
    },
    _formatDate: function (e, t, n, i) {
      t ||
        ((e.currentDay = e.selectedDay),
        (e.currentMonth = e.selectedMonth),
        (e.currentYear = e.selectedYear));
      var r = t
        ? "object" == typeof t
          ? t
          : this._daylightSavingAdjust(new this.CDate(i, n, t))
        : this._daylightSavingAdjust(
            new this.CDate(e.currentYear, e.currentMonth, e.currentDay)
          );
      return this.formatDate(
        this._get(e, "dateFormat"),
        r,
        this._getFormatConfig(e)
      );
    },
    _compareDate: function (e, t, n) {
      return e && n
        ? (e.getGregorianDate && (e = e.getGregorianDate()),
          n.getGregorianDate && (n = n.getGregorianDate()),
          "<" == t ? e < n : e > n)
        : null;
    },
  }),
    ($.fn.datepicker = function (e) {
      if (!this.length) return this;
      $.datepicker.initialized ||
        ($(document).mousedown($.datepicker._checkExternalClick),
        ($.datepicker.initialized = !0)),
        0 === $("#" + $.datepicker._mainDivId).length &&
          $("body").append($.datepicker.dpDiv);
      var t = Array.prototype.slice.call(arguments, 1);
      return "string" != typeof e ||
        ("isDisabled" !== e && "getDate" !== e && "widget" !== e)
        ? "option" === e &&
          2 === arguments.length &&
          "string" == typeof arguments[1]
          ? $.datepicker["_" + e + "Datepicker"].apply(
              $.datepicker,
              [this[0]].concat(t)
            )
          : this.each(function () {
              "string" == typeof e
                ? $.datepicker["_" + e + "Datepicker"].apply(
                    $.datepicker,
                    [this].concat(t)
                  )
                : $.datepicker._attachDatepicker(this, e);
            })
        : $.datepicker["_" + e + "Datepicker"].apply(
            $.datepicker,
            [this[0]].concat(t)
          );
    }),
    ($.datepicker = new Datepicker()),
    ($.datepicker.initialized = !1),
    ($.datepicker.uuid = new Date().getTime()),
    ($.datepicker.version = "1.10.3");
})(jQuery),
  jQuery(function (e) {
    (e.datepicker.regional.fa = {
      calendar: JalaliDate,
      closeText: "بستن",
      prevText: "قبل",
      nextText: "بعد",
      currentText: "امروز",
      monthNames: [
        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند",
      ],
      monthNamesShort: [
        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند",
      ],
      dayNames: [
        "یکشنبه",
        "دوشنبه",
        "سه شنبه",
        "چهارشنبه",
        "پنجشنبه",
        "جمعه",
        "شنبه",
      ],
      dayNamesShort: ["یک", "دو", "سه", "چهار", "پنج", "جمعه", "شنبه"],
      dayNamesMin: ["ی", "د", "س", "چ", "پ", "ج", "ش"],
      weekHeader: "ه",
      dateFormat: "dd/mm/yy",
      firstDay: 6,
      isRTL: !0,
      showMonthAfterYear: !1,
      yearSuffix: "",
      calculateWeek: function (e) {
        var t = new JalaliDate(
          e.getFullYear(),
          e.getMonth(),
          e.getDate() + (e.getDay() || 7) - 3
        );
        return (
          Math.floor(
            Math.round(
              (t.getTime() - new JalaliDate(t.getFullYear(), 0, 1).getTime()) /
                864e5
            ) / 7
          ) + 1
        );
      },
    }),
      e.datepicker.setDefaults(e.datepicker.regional.fa);
  }),
  $(document).ready(function () {
    let JQ = jQuery || {};
    if (typeof django !== "undefined") {
      JQ = django.jQuery;
    }
    JQ(".jalali_date-date").datepicker({
      dateFormat: "yy-mm-dd",
      changeMonth: !0,
      changeYear: !0,
      yearRange: "c-70:c+10",
    });
    $('.add-row').click(function () {
        let JQ = jQuery || {};
        if (typeof django !== "undefined") {
          JQ = django.jQuery;
        }
        // set delay to verify thats the new row was successfully created
        setTimeout(function(){
          console.log('add-row')
          JQ(".jalali_date-date").datepicker({
           dateFormat: "yy-mm-dd",
           changeMonth: !0,
           changeYear: !0,
           yearRange: "c-70:c+10",
         });
       }, 300)
    })
  });
