/* eslint-disable */
/*
dester builds:
__src__/utils.ts
__src__/createRoute.ts
__src__/ParsedUrl.ts
__src__/Router.ts
index.ts
*/
Object.defineProperty(exports, "__esModule", {
    value: !0
});

var t = t => t.replace(/^[/\\\s]+|[/\\\s]+$/g, ""), e = Object.create, r = (...t) => [].concat(...t).filter((t => "function" == typeof t)), s = t => (e, r, s) => {
    r.statusCode = t, r.end(s ? JSON.stringify(s, null, 2) : "" + t);
}, o = t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), i = t => {
    for (var e, r = [], s = !1, i = "", h = 0; h < t.length; h++) if (e = t[h]) if ("[" !== e[0]) r.push(1e9), 
    i += o(e); else {
        var a, n = e.slice(1, -1), l = 1e6, u = !1;
        0 === n.indexOf("...") && (n = n.slice(3), s = u = !0, l = 1e3);
        var d = "[^/]+?";
        (a = n.indexOf("(")) > -1 && (l *= 2, d = n.slice(a + 1, -1), n = n.slice(0, a), 
        d = d.replace(/<(.)>/gi, "\\$1")), i += u ? "(?<" + n + ">(?:" + d + ")(?:\\/(?:" + d + "))*)" : "(?<" + n + ">(?:" + d + "))", 
        r.push(l);
    }
    try {
        new RegExp(i);
    } catch (c) {
        console.error(c);
    }
    return {
        id: r,
        spread: s,
        dirty: i
    };
}, h = t => {
    for (var e = 0, r = t.length; r-- > 0; ) e += t[r];
    return t.length < 2 && 1e9 === t[0] && (e += 1e15), (1e9 === t[0] || 1e9 === t[t.length - 1] && e--) && (e += 1e12), 
    e;
}, a = t => {
    if (void 0 !== t && t.length > 0) {
        "string" != typeof t && (t = t[0] || "");
        var e = t.lastIndexOf(",");
        return e > -1 ? t.slice(e + 1).trim() : t.trim();
    }
    return null;
};

class ParsedUrl {
    constructor(e) {
        var r;
        if (this._ = void 0, this.path = void 0, this.pathname = void 0, this.search = void 0, 
        this.query = void 0, this.raw = void 0, this._raw = void 0, this._route = void 0, 
        this._routes = void 0, this._ = {
            headers: e.headers,
            encrypted: !(!e.socket.encrypted && !e.connection.encrypted),
            protocol: void 0,
            host: void 0,
            hostname: void 0,
            port: void 0
        }, this.raw = this._raw = e.url, this.path = this._raw, this.pathname = this._raw, 
        (r = this._raw.indexOf("?")) > -1 ? (this.pathname = this._raw.slice(0, r), this.query = this._raw.slice(r + 1), 
        this.search = "?" + this.query) : this.search = this.query = null, this._route = t(this.pathname), 
        this._route.indexOf("%") > -1) try {
            this._route = decodeURIComponent(this._route);
        } catch {}
        this._routes = this._route.length > 0 ? this._route.split("/") : [];
    }
    get protocol() {
        return void 0 !== this._.protocol ? this._.protocol : this._.protocol = a(this._.headers["x-forwarded-proto"]) || "http" + (this._.encrypted ? "s" : "");
    }
    get host() {
        return void 0 !== this._.host ? this._.host : this._.host = a(this._.headers["x-forwarded-host"]) || a(this._.headers.host) || a(this._.headers[":authority"]) || null;
    }
    get hostname() {
        var t;
        return void 0 !== this._.hostname ? this._.hostname : this._.hostname = this.host ? (t = this._.host.indexOf(":")) > -1 ? this._.host.slice(0, t) : this._.host : null;
    }
    get port() {
        var t;
        return void 0 !== this._.port ? this._.port : this._.port = this.host && (t = this._.host.indexOf(":")) > -1 ? this._.host.slice(t + 1) : null;
    }
}

var n = "get|head|post|put|delete|connect|options|trace|patch", l = n.split("|"), u = n.toUpperCase().split("|");

class Router {
    constructor(o, {baseUrl: i = "", use: h = [], errors: a = {}, errorsFactory: n = s} = {}) {
        this.server = void 0, this.server = o;
        var d = this;
        d._routes = e(null), d.baseUrl = t(i), h = r(h);
        var c = e(null);
        for (var p in a) +p == +p && (c[p] = a[p]);
        d._errors = a = c;
        for (var _ = [ 404, 500 ], v = _.length; v-- > 0; ) _[v] in a || (a[_[v]] = n(_[v]));
        for (var f = l.length; f-- > 0; ) d[l[f]] = d.add.bind(d, u[f]);
        o.on("request", ((t, r) => {
            t.baseUrl = d.baseUrl, t.originalUrl = t.originalUrl || t.url, t.parsedUrl = t._parsedUrl = new ParsedUrl(t), 
            r.locals = r.locals || e(null);
            var s, o = t.method.toUpperCase(), i = t.parsedUrl._routes.length, l = null;
            t: if (o in d._routes) {
                if (i in d._routes[o]) for (var u = d._routes[o][i], c = 0, p = u.length; c < p; c++) if (null != (l = t.parsedUrl._route.match((s = u[c]).regex))) break t;
                for (var _ = i; _ >= 0; _--) if (_ in d._routes[o][-1]) for (var v = d._routes[o][-1][_], f = 0, g = v.length; f < g; f++) if (null != (l = t.parsedUrl._route.match((s = v[f]).regex))) break t;
            }
            var y = [ h ];
            null != l ? (t.params = l.groups || e(null), y[1] = s.handlers) : t.params = e(null);
            var m = -1, x = 0, U = e => {
                if (null != e) {
                    var s = +e || +e.code || +e.status || +e.statusCode || 500;
                    (a[s] || (a[s] = n(s)))(t, r, e);
                } else ++m in y[x] ? y[x][m](t, r, U) : ++x < y.length ? y[x][m = 0] ? y[x][m](t, r, U) : U() : a[y.length < 2 ? 404 : 500](t, r);
            };
            U();
        })), d.listen = o.listen.bind(o);
    }
    add(s, o, ...a) {
        for (var n, l, u, d, c = this, p = ((e, r, s) => {
            e = t(e), s && (e = s + "/" + e);
            for (var o, a, n = 0, l = [], u = !1, d = [], c = "", p = [], _ = !1, v = !1, f = 0, g = !1, y = !1, m = 0; m <= e.length; m++) o = e.charAt(m), 
            f && f--, v && ("\\" === o ? f = 2 : "[" !== o || f ? "]" !== o || f || (g = !1) : g = !0), 
            _ && !g && (")" === o ? v = !1 : "(" === o && (v = !0)), v || g || ("]" === o && _ ? (_ = !1, 
            y = !0) : "[" !== o || _ || (_ = !0, p.push(c), c = "")), o && (_ || v || g || "/" !== o && "\\" !== o) ? (c += o, 
            y && (y = !1, p.push(c), c = "")) : (c && (p.push(c), 1) || p.length) && (a = i(p), 
            c = "", p = [], n++, l.push(h(a.id)), u = u || a.spread, d.push(a.dirty));
            var x, U = "^" + d.join("\\/") + "\\/*$";
            try {
                x = new RegExp(U);
            } catch (w) {
                x = /^error$/, console.error(w);
            }
            return {
                count: n,
                id: l,
                spread: u,
                route: e,
                regex: x,
                _dirty: U,
                handlers: r
            };
        })(o, r(...a), c.baseUrl), _ = (t => [].concat(...[].concat(t).map((t => t.trim().toUpperCase().split(/[^-\w]+/)))))(s), v = 0; v < _.length; v++) {
            (n = _[v]) in c._routes || (c._routes[n] = e(null), c._routes[n][-1] = e(null)), 
            l = c._routes[n], u = p.spread ? p.count in l[-1] ? l[-1][p.count] : l[-1][p.count] = [] : p.count in l ? l[p.count] : l[p.count] = [], 
            d = 0;
            for (var f, g = p.id, y = 0; d < u.length; d++) {
                f = u[d].id;
                for (var m = 0; m < g.length && !(m > f.length || 0 != (y = g[m] - f[m])); m++) ;
                if ((0 !== y ? y : f.length - g.length) > 0) break;
            }
            u.splice(d, 0, p);
        }
        return c;
    }
}

exports.METHODS = l, exports.Router = Router, exports.createRouter = (...t) => new Router(...t), 
exports.default = Router;
