/* eslint-disable */
/*
dester builds:
__src__/utils.ts
__src__/createRoute.ts
__src__/ParsedUrl.ts
__src__/Router.ts
index.ts
*/
var t = t => t.replace(/^[/\\\s]+|[/\\\s]+$/g, ""), r = Object.create, e = (...t) => [].concat(...t).filter((t => "function" == typeof t)), s = t => (r, e, s) => {
    e.statusCode = t, e.end(s ? JSON.stringify(s, null, 2) : "" + t);
}, o = t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), i = t => {
    for (var r, e = [], s = !1, i = "", h = 0; h < t.length; h++) if (r = t[h]) if ("[" !== r[0]) e.push(1e9), 
    i += o(r); else {
        var a, n = r.slice(1, -1), l = 1e6, u = !1;
        0 === n.indexOf("...") && (n = n.slice(3), s = u = !0, l = 1e3);
        var d = "[^/]+?";
        (a = n.indexOf("(")) > -1 && (l *= 2, d = n.slice(a + 1, -1), n = n.slice(0, a), 
        d = d.replace(/<(.)>/gi, "\\$1")), i += u ? "(?<" + n + ">(?:" + d + ")(?:\\/(?:" + d + "))*)" : "(?<" + n + ">(?:" + d + "))", 
        e.push(l);
    }
    try {
        new RegExp(i);
    } catch (c) {
        console.error(c);
    }
    return {
        id: e,
        spread: s,
        dirty: i
    };
}, h = t => {
    for (var r = 0, e = t.length; e-- > 0; ) r += t[e];
    return t.length < 2 && 1e9 === t[0] && (r += 1e15), (1e9 === t[0] || 1e9 === t[t.length - 1] && r--) && (r += 1e12), 
    r;
}, a = t => {
    if (void 0 !== t && t.length > 0) {
        "string" != typeof t && (t = t[0] || "");
        var r = t.lastIndexOf(",");
        return r > -1 ? t.slice(r + 1).trim() : t.trim();
    }
    return null;
};

class ParsedUrl {
    constructor(r) {
        var e;
        if (this._ = void 0, this.path = void 0, this.pathname = void 0, this.search = void 0, 
        this.query = void 0, this.raw = void 0, this._raw = void 0, this._route = void 0, 
        this._routes = void 0, this._ = {
            headers: r.headers,
            encrypted: !(!r.socket.encrypted && !r.connection.encrypted),
            protocol: void 0,
            host: void 0,
            hostname: void 0,
            port: void 0
        }, this.raw = this._raw = r.url, this.path = this._raw, this.pathname = this._raw, 
        (e = this._raw.indexOf("?")) > -1 ? (this.pathname = this._raw.slice(0, e), this.query = this._raw.slice(e + 1), 
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
        d._routes = r(null), d.baseUrl = t(i), h = e(h);
        var c = r(null);
        for (var p in a) +p == +p && (c[p] = a[p]);
        d._errors = a = c;
        for (var _ = [ 404, 500 ], v = _.length; v-- > 0; ) _[v] in a || (a[_[v]] = n(_[v]));
        for (var g = l.length; g-- > 0; ) d[l[g]] = d.add.bind(d, u[g]);
        o.on("request", ((t, e) => {
            t.baseUrl = d.baseUrl, t.originalUrl = t.originalUrl || t.url, t.parsedUrl = t._parsedUrl = new ParsedUrl(t), 
            e.locals = e.locals || r(null);
            var s, o = t.method.toUpperCase(), i = t.parsedUrl._routes.length, l = null;
            t: if (o in d._routes) {
                if (i in d._routes[o]) for (var u = d._routes[o][i], c = 0, p = u.length; c < p; c++) if (null != (l = t.parsedUrl._route.match((s = u[c]).regex))) break t;
                for (var _ = i; _ >= 0; _--) if (_ in d._routes[o][-1]) for (var v = d._routes[o][-1][_], g = 0, f = v.length; g < f; g++) if (null != (l = t.parsedUrl._route.match((s = v[g]).regex))) break t;
            }
            var m = [ h ];
            null != l ? (t.params = l.groups || r(null), m[1] = s.handlers) : t.params = r(null);
            var y = -1, U = 0, w = r => {
                if (null != r) {
                    var s = +r || +r.code || +r.status || +r.statusCode || 500;
                    (a[s] || (a[s] = n(s)))(t, e, r);
                } else ++y in m[U] ? m[U][y](t, e, w) : ++U < m.length ? m[U][y = 0] ? m[U][y](t, e, w) : w() : a[m.length < 2 ? 404 : 500](t, e);
            };
            w();
        })), d.listen = o.listen.bind(o);
    }
    add(s, o, ...a) {
        for (var n, l, u, d, c = this, p = ((r, e, s) => {
            r = t(r), s && (r = s + "/" + r);
            for (var o, a, n = 0, l = [], u = !1, d = [], c = "", p = [], _ = !1, v = !1, g = 0, f = !1, m = !1, y = 0; y <= r.length; y++) o = r.charAt(y), 
            g && g--, v && ("\\" === o ? g = 2 : "[" !== o || g ? "]" !== o || g || (f = !1) : f = !0), 
            _ && !f && (")" === o ? v = !1 : "(" === o && (v = !0)), v || f || ("]" === o && _ ? (_ = !1, 
            m = !0) : "[" !== o || _ || (_ = !0, p.push(c), c = "")), o && (_ || v || f || "/" !== o && "\\" !== o) ? (c += o, 
            m && (m = !1, p.push(c), c = "")) : (c && (p.push(c), 1) || p.length) && (a = i(p), 
            c = "", p = [], n++, l.push(h(a.id)), u = u || a.spread, d.push(a.dirty));
            var U, w = "^" + d.join("\\/") + "\\/*$";
            try {
                U = new RegExp(w);
            } catch (x) {
                U = /^error$/, console.error(x);
            }
            return {
                count: n,
                id: l,
                spread: u,
                route: r,
                regex: U,
                _dirty: w,
                handlers: e
            };
        })(o, e(...a), c.baseUrl), _ = (t => [].concat(...[].concat(t).map((t => t.trim().toUpperCase().split(/[^-\w]+/)))))(s), v = 0; v < _.length; v++) {
            (n = _[v]) in c._routes || (c._routes[n] = r(null), c._routes[n][-1] = r(null)), 
            l = c._routes[n], u = p.spread ? p.count in l[-1] ? l[-1][p.count] : l[-1][p.count] = [] : p.count in l ? l[p.count] : l[p.count] = [], 
            d = 0;
            for (var g, f = p.id, m = 0; d < u.length; d++) {
                g = u[d].id;
                for (var y = 0; y < f.length && !(y > g.length || 0 != (m = f[y] - g[y])); y++) ;
                if ((0 !== m ? m : g.length - f.length) > 0) break;
            }
            u.splice(d, 0, p);
        }
        return c;
    }
}

var d = (...t) => new Router(...t);

export { l as METHODS, Router, d as createRouter, Router as default };
