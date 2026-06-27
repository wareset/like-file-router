/* eslint-disable */
function trimSlashes(e) {
    return e.replace(/^[/\\\s]+|[/\\\s]+$/g, "");
}

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var e = Object.create;

function getHandlers(...e) {
    return [].concat(...e).filter(e => "function" == typeof e);
}

function statusCodesFactory(e) {
    return function(t, r, s) {
        r.statusCode = e, r.end(s ? JSON.stringify(s, null, 2) : "" + e);
    };
}

function __esc__(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function __createRouteItem__(e) {
    for (var t, r = [], s = !1, n = "", o = 0; o < e.length; o++) if (t = e[o]) if ("[" !== t[0]) r.push(1e9), 
    n += __esc__(t); else {
        var a, i = t.slice(1, -1), l = 1e6, h = !1;
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

function medium(e) {
    for (var t = 0, r = e.length; r-- > 0; ) t += e[r];
    return e.length < 2 && 1e9 === e[0] && (t += 1e15), 1e9 === e[e.length - 1] && (t += 1e11), 
    1e9 === e[0] && (t += 1e12), t;
}

function getHeaderValue(e) {
    if (null != e && e.length > 0) {
        "string" != typeof e && (e = e[0] || "");
        var t = e.lastIndexOf(",");
        return t > -1 ? e.slice(t + 1).trim() : e.trim();
    }
    return null;
}

class ParsedUrl {
    constructor(e) {
        var t;
        this.raw = this._raw = e.url, this.path = this._raw, this.pathname = this._raw, 
        (t = this._raw.indexOf("?")) > -1 ? (this.pathname = this._raw.slice(0, t), this.query = this._raw.slice(t + 1), 
        this.search = "?" + this.query) : this.search = this.query = "";
        var r = trimSlashes(this.pathname);
        if (r.indexOf("%") > -1) try {
            r = decodeURIComponent(r);
        } catch (s) {}
        this._ = {
            encrypted: e.socket.encrypted || e.connection.encrypted,
            headers: e.headers,
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
        var e;
        return null != this._.hostname ? this._.hostname : this._.hostname = this.host ? (e = this._.host.indexOf(":")) > -1 ? this._.host.slice(0, e) : this._.host : "";
    }
    get port() {
        var e;
        return null != this._.port ? this._.port : this._.port = this.host && (e = this._.host.indexOf(":")) > -1 ? this._.host.slice(e + 1) : "";
    }
    get origin() {
        return this.protocol + "//" + this.host;
    }
    get href() {
        return this.origin + this._raw;
    }
}

var t = "get|head|post|put|delete|connect|options|trace|patch", r = t.split("|"), s = t.toUpperCase().split("|");

class Router {
    constructor(t, {baseUrl: n = "", use: o = [], errors: a = {}, errorsFactory: i = statusCodesFactory} = {}) {
        this.server = t;
        var l = this;
        l._routes = e(null), l._baseUrl = trimSlashes(n);
        var h = getHandlers(o), u = e(null);
        for (var c in a) +c == +c && (u[c] = a[c]);
        l._errors = a = u, l._errorsFactory = i;
        for (var d = r.length; d-- > 0; ) l[r[d]] = l.add.bind(l, s[d]);
        t.on("request", function(t, r) {
            t.baseUrl = l._baseUrl, t.originalUrl = t.originalUrl || t.url, t.parsedUrl = t._parsedUrl = new ParsedUrl(t), 
            r.locals = r.locals || e(null);
            var s, n = t.method.toUpperCase(), o = t.parsedUrl._.routes.length, i = null;
            e: if (n in l._routes) {
                if (o in l._routes[n]) for (var u = l._routes[n][o], c = 0, d = u.length; c < d; c++) if (null != (i = t.parsedUrl._.route.match((s = u[c]).regex))) break e;
                for (var p = o; p >= 0; p--) if (p in l._routes[n][-1]) for (var _ = l._routes[n][-1][p], f = 0, g = _.length; f < g; f++) if (null != (i = t.parsedUrl._.route.match((s = _[f]).regex))) break e;
            }
            var v = [ h ];
            null != i ? (t.params = i.groups || e(null), v[1] = s.handlers) : t.params = e(null);
            var m = -1, x = 0;
            !function next(e) {
                if (null != e) {
                    var s = +e || +e.code || +e.status || +e.statusCode || 500;
                    (a[s] || (a[s] = l._errorsFactory(s)))(t, r, e);
                } else ++m in v[x] ? v[x][m](t, r, next) : ++x < v.length ? v[x][m = 0] ? v[x][m](t, r, next) : next() : next(v.length < 2 ? 404 : 500);
            }();
        });
    }
    listen(...e) {
        return this.server.listen(...e);
    }
    add(t, r, ...s) {
        for (var n, o, a, i, l = this, h = function createRoute(e, t) {
            e = trimSlashes(e);
            for (var r, s, n = 0, o = [], a = !1, i = [], l = "", h = [], u = !1, c = !1, d = 0, p = !1, _ = !1, f = 0; f <= e.length; f++) r = e.charAt(f), 
            d && d--, c && ("\\" === r ? d = 2 : "[" !== r || d ? "]" !== r || d || (p = !1) : p = !0), 
            u && !p && (")" === r ? c = !1 : "(" === r && (c = !0)), c || p || ("]" === r && u ? (u = !1, 
            _ = !0) : "[" !== r || u || (u = !0, h.push(l), l = "")), r && (u || c || p || "/" !== r && "\\" !== r) ? (l += r, 
            _ && (_ = !1, h.push(l), l = "")) : (l && (h.push(l), 1) || h.length) && (s = __createRouteItem__(h), 
            l = "", h = [], n++, o.push(medium(s.id)), a = a || s.spread, i.push(s.dirty));
            var g = `^${i.join("\\/")}\\/*$`;
            return {
                count: n,
                id: o,
                spread: a,
                route: e,
                regex: new RegExp(g, "i"),
                handlers: t
            };
        }(l._baseUrl + "/" + r, getHandlers(...s)), u = function getMethods(e) {
            return [].concat(...[].concat(e).map(e => e.trim().toUpperCase().split(/[^-\w]+/)));
        }(t), c = 0; c < u.length; c++) {
            (n = u[c]) in l._routes || (l._routes[n] = e(null), l._routes[n][-1] = e(null)), 
            o = l._routes[n], a = h.spread ? h.count in o[-1] ? o[-1][h.count] : o[-1][h.count] = [] : h.count in o ? o[h.count] : o[h.count] = [], 
            i = 0;
            for (var d, p = h.id, _ = 0; i < a.length; i++) {
                d = a[i].id;
                for (var f = 0; f < p.length && !(f > d.length || 0 !== (_ = p[f] - d[f])); f++) ;
                if ((0 !== _ ? _ : d.length - p.length) > 0) break;
            }
            a.splice(i, 0, h);
        }
        return l;
    }
}

exports.METHODS = r, exports.Router = Router, exports.createRouter = function createRouter(...e) {
    return new Router(...e);
}, exports.default = Router;
