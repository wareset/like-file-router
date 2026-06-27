/* eslint-disable */
function trimSlashes(t) {
    return t.replace(/^[/\\\s]+|[/\\\s]+$/g, "");
}

var t = Object.create;

function getHandlers(...t) {
    return [].concat(...t).filter(t => "function" == typeof t);
}

function statusCodesFactory(t) {
    return function(e, r, s) {
        r.statusCode = t, r.end(s ? JSON.stringify(s, null, 2) : "" + t);
    };
}

function __esc__(t) {
    return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function __createRouteItem__(t) {
    for (var e, r = [], s = !1, n = "", o = 0; o < t.length; o++) if (e = t[o]) if ("[" !== e[0]) r.push(1e9), 
    n += __esc__(e); else {
        var a, i = e.slice(1, -1), l = 1e6, h = !1;
        0 === i.indexOf("...") && (i = i.slice(3), s = h = !0, l = 1e3);
        var u = "[^/]+?";
        (a = i.indexOf("(")) > -1 && (l *= 10, u = i.slice(a + 1, -1), i = i.slice(0, a), 
        u = u.replace(/<(.)>/gi, "\\$1")), n += h ? `(?<${i}>(?:${u})(?:\\/(?:${u}))*)` : `(?<${i}>(?:${u}))`, 
        r.push(l);
    }
    return {
        id: r,
        spread: s,
        dirty: n
    };
}

function medium(t) {
    for (var e = 0, r = t.length; r-- > 0; ) e += t[r];
    return t.length < 2 && 1e9 === t[0] && (e += 1e15), 1e9 === t[t.length - 1] && (e += 1e11), 
    1e9 === t[0] && (e += 1e12), e;
}

function getHeaderValue(t) {
    if (null != t && t.length > 0) {
        "string" != typeof t && (t = t[0] || "");
        var e = t.lastIndexOf(",");
        return e > -1 ? t.slice(e + 1).trim() : t.trim();
    }
    return null;
}

class ParsedUrl {
    constructor(t) {
        var e;
        this.raw = this._raw = t.url, this.path = this._raw, this.pathname = this._raw, 
        (e = this._raw.indexOf("?")) > -1 ? (this.pathname = this._raw.slice(0, e), this.query = this._raw.slice(e + 1), 
        this.search = "?" + this.query) : this.search = this.query = "";
        var r = trimSlashes(this.pathname);
        if (r.indexOf("%") > -1) try {
            r = decodeURIComponent(r);
        } catch (s) {}
        this._ = {
            encrypted: t.socket.encrypted || t.connection.encrypted,
            headers: t.headers,
            protocol: null,
            host: null,
            hostname: null,
            port: null,
            route: r,
            routes: r.length > 0 ? r.split("/") : []
        };
    }
    get protocol() {
        return null != this._.protocol ? this._.protocol : this._.protocol = getHeaderValue(this._.headers["x-forwarded-proto"]) || "http" + (this._.encrypted ? "s:" : ":");
    }
    get host() {
        return null != this._.host ? this._.host : this._.host = getHeaderValue(this._.headers["x-forwarded-host"]) || getHeaderValue(this._.headers.host) || getHeaderValue(this._.headers[":authority"]) || "";
    }
    get hostname() {
        var t;
        return null != this._.hostname ? this._.hostname : this._.hostname = this.host ? (t = this._.host.indexOf(":")) > -1 ? this._.host.slice(0, t) : this._.host : "";
    }
    get port() {
        var t;
        return null != this._.port ? this._.port : this._.port = this.host && (t = this._.host.indexOf(":")) > -1 ? this._.host.slice(t + 1) : "";
    }
    get origin() {
        return this.protocol + "//" + this.host;
    }
    get href() {
        return this.origin + this._raw;
    }
}

var e = "get|head|post|put|delete|connect|options|trace|patch", r = e.split("|"), s = e.toUpperCase().split("|");

class Router {
    constructor(e, {baseUrl: n = "", use: o = [], errors: a = {}, errorsFactory: i = statusCodesFactory} = {}) {
        this.server = e;
        var l = this;
        l._routes = t(null), l._baseUrl = trimSlashes(n);
        var h = getHandlers(o), u = t(null);
        for (var c in a) +c == +c && (u[c] = a[c]);
        l._errors = a = u, l._errorsFactory = i;
        for (var d = r.length; d-- > 0; ) l[r[d]] = l.add.bind(l, s[d]);
        e.on("request", function(e, r) {
            e.baseUrl = l._baseUrl, e.originalUrl = e.originalUrl || e.url, e.parsedUrl = e._parsedUrl = new ParsedUrl(e), 
            r.locals = r.locals || t(null);
            var s, n = e.method.toUpperCase(), o = e.parsedUrl._.routes.length, i = null;
            t: if (n in l._routes) {
                if (o in l._routes[n]) for (var u = l._routes[n][o], c = 0, d = u.length; c < d; c++) if (null != (i = e.parsedUrl._.route.match((s = u[c]).regex))) break t;
                for (var _ = o; _ >= 0; _--) if (_ in l._routes[n][-1]) for (var p = l._routes[n][-1][_], f = 0, g = p.length; f < g; f++) if (null != (i = e.parsedUrl._.route.match((s = p[f]).regex))) break t;
            }
            var v = [ h ];
            null != i ? (e.params = i.groups || t(null), v[1] = s.handlers) : e.params = t(null);
            var m = -1, x = 0;
            !function next(t) {
                if (null != t) {
                    var s = +t || +t.code || +t.status || +t.statusCode || 500;
                    (a[s] || (a[s] = l._errorsFactory(s)))(e, r, t);
                } else ++m in v[x] ? v[x][m](e, r, next) : ++x < v.length ? v[x][m = 0] ? v[x][m](e, r, next) : next() : next(v.length < 2 ? 404 : 500);
            }();
        });
    }
    listen(...t) {
        return this.server.listen(...t);
    }
    add(e, r, ...s) {
        for (var n, o, a, i, l = this, h = function createRoute(t, e) {
            t = trimSlashes(t);
            for (var r, s, n = 0, o = [], a = !1, i = [], l = "", h = [], u = !1, c = !1, d = 0, _ = !1, p = !1, f = 0; f <= t.length; f++) r = t.charAt(f), 
            d && d--, c && ("\\" === r ? d = 2 : "[" !== r || d ? "]" !== r || d || (_ = !1) : _ = !0), 
            u && !_ && (")" === r ? c = !1 : "(" === r && (c = !0)), c || _ || ("]" === r && u ? (u = !1, 
            p = !0) : "[" !== r || u || (u = !0, h.push(l), l = "")), r && (u || c || _ || "/" !== r && "\\" !== r) ? (l += r, 
            p && (p = !1, h.push(l), l = "")) : (l && (h.push(l), 1) || h.length) && (s = __createRouteItem__(h), 
            l = "", h = [], n++, o.push(medium(s.id)), a = a || s.spread, i.push(s.dirty));
            var g = `^${i.join("\\/")}\\/*$`;
            return {
                count: n,
                id: o,
                spread: a,
                route: t,
                regex: new RegExp(g, "i"),
                handlers: e
            };
        }(l._baseUrl + "/" + r, getHandlers(...s)), u = function getMethods(t) {
            return [].concat(...[].concat(t).map(t => t.trim().toUpperCase().split(/[^-\w]+/)));
        }(e), c = 0; c < u.length; c++) {
            (n = u[c]) in l._routes || (l._routes[n] = t(null), l._routes[n][-1] = t(null)), 
            o = l._routes[n], a = h.spread ? h.count in o[-1] ? o[-1][h.count] : o[-1][h.count] = [] : h.count in o ? o[h.count] : o[h.count] = [], 
            i = 0;
            for (var d, _ = h.id, p = 0; i < a.length; i++) {
                d = a[i].id;
                for (var f = 0; f < _.length && !(f > d.length || 0 !== (p = _[f] - d[f])); f++) ;
                if ((0 !== p ? p : d.length - _.length) > 0) break;
            }
            a.splice(i, 0, h);
        }
        return l;
    }
}

function createRouter(...t) {
    return new Router(...t);
}

export { r as METHODS, Router, createRouter, Router as default };
