/* eslint-disable */
/*
dester builds:
__src__/utils.ts
__src__/createRoute.ts
__src__/ParsedUrl.ts
__src__/Router.ts
index.ts
*/
var t = t => t.replace(/^[/\\\s]+|[/\\\s]+$/g, ""), e = Object.create, r = (...t) => [].concat(...t).filter((t => "function" == typeof t)), s = t => (e, r, s) => {
    r.statusCode = t, r.end(s ? JSON.stringify(s, null, 2) : "" + t);
}, i = t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), o = t => {
    for (var e, r = [], s = !1, o = "", h = 0; h < t.length; h++) if (e = t[h]) if ("[" !== e[0]) r.push(1e9), 
    o += i(e); else {
        var a, n = e.slice(1, -1), l = 1e6, u = !1;
        0 === n.indexOf("...") && (n = n.slice(3), s = u = !0, l = 1e3);
        var d = "[^/]+?";
        (a = n.indexOf("(")) > -1 && (l *= 10, d = n.slice(a + 1, -1), n = n.slice(0, a), 
        d = d.replace(/<(.)>/gi, "\\$1")), o += u ? "(?<" + n + ">(?:" + d + ")(?:\\/(?:" + d + "))*)" : "(?<" + n + ">(?:" + d + "))", 
        r.push(l);
    }
    return {
        id: r,
        spread: s,
        dirty: o
    };
}, h = t => {
    for (var e = 0, r = t.length; r-- > 0; ) e += t[r];
    return t.length < 2 && 1e9 === t[0] && (e += 1e15), 1e9 === t[t.length - 1] && (e += 1e11), 
    1e9 === t[0] && (e += 1e12), e;
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
    constructor(i, {baseUrl: o = "", use: h = [], errors: a = {}, errorsFactory: n = s} = {}) {
        this.server = void 0, this.server = i;
        var d = this;
        d._routes = e(null), d.baseUrl = t(o), h = r(h);
        var p = e(null);
        for (var c in a) +c == +c && (p[c] = a[c]);
        d._errors = a = p;
        for (var _ = [ 404, 500 ], v = _.length; v-- > 0; ) _[v] in a || (a[_[v]] = n(_[v]));
        for (var f = l.length; f-- > 0; ) d[l[f]] = d.add.bind(d, u[f]);
        i.on("request", ((t, r) => {
            t.baseUrl = d.baseUrl, t.originalUrl = t.originalUrl || t.url, t.parsedUrl = t._parsedUrl = new ParsedUrl(t), 
            r.locals = r.locals || e(null);
            var s, i = t.method.toUpperCase(), o = t.parsedUrl._routes.length, l = null;
            t: if (i in d._routes) {
                if (o in d._routes[i]) for (var u = d._routes[i][o], p = 0, c = u.length; p < c; p++) if (null != (l = t.parsedUrl._route.match((s = u[p]).regex))) break t;
                for (var _ = o; _ >= 0; _--) if (_ in d._routes[i][-1]) for (var v = d._routes[i][-1][_], f = 0, g = v.length; f < g; f++) if (null != (l = t.parsedUrl._route.match((s = v[f]).regex))) break t;
            }
            var m = [ h ];
            null != l ? (t.params = l.groups || e(null), m[1] = s.handlers) : t.params = e(null);
            var U = -1, y = 0, w = e => {
                if (null != e) {
                    var s = +e || +e.code || +e.status || +e.statusCode || 500;
                    (a[s] || (a[s] = n(s)))(t, r, e);
                } else ++U in m[y] ? m[y][U](t, r, w) : ++y < m.length ? m[y][U = 0] ? m[y][U](t, r, w) : w() : a[m.length < 2 ? 404 : 500](t, r);
            };
            w();
        })), d.listen = i.listen.bind(i);
    }
    add(s, i, ...a) {
        for (var n, l, u, d, p = this, c = ((e, r) => {
            e = t(e);
            for (var s, i, a = 0, n = [], l = !1, u = [], d = "", p = [], c = !1, _ = !1, v = 0, f = !1, g = !1, m = 0; m <= e.length; m++) s = e.charAt(m), 
            v && v--, _ && ("\\" === s ? v = 2 : "[" !== s || v ? "]" !== s || v || (f = !1) : f = !0), 
            c && !f && (")" === s ? _ = !1 : "(" === s && (_ = !0)), _ || f || ("]" === s && c ? (c = !1, 
            g = !0) : "[" !== s || c || (c = !0, p.push(d), d = "")), s && (c || _ || f || "/" !== s && "\\" !== s) ? (d += s, 
            g && (g = !1, p.push(d), d = "")) : (d && (p.push(d), 1) || p.length) && (i = o(p), 
            d = "", p = [], a++, n.push(h(i.id)), l = l || i.spread, u.push(i.dirty));
            var U = "^" + u.join("\\/") + "\\/*$";
            return {
                count: a,
                id: n,
                spread: l,
                route: e,
                regex: new RegExp(U),
                _dirty: U,
                handlers: r
            };
        })(p.baseUrl + "/" + i, r(...a)), _ = (t => [].concat(...[].concat(t).map((t => t.trim().toUpperCase().split(/[^-\w]+/)))))(s), v = 0; v < _.length; v++) {
            (n = _[v]) in p._routes || (p._routes[n] = e(null), p._routes[n][-1] = e(null)), 
            l = p._routes[n], u = c.spread ? c.count in l[-1] ? l[-1][c.count] : l[-1][c.count] = [] : c.count in l ? l[c.count] : l[c.count] = [], 
            d = 0;
            for (var f, g = c.id, m = 0; d < u.length; d++) {
                f = u[d].id;
                for (var U = 0; U < g.length && !(U > f.length || 0 != (m = g[U] - f[U])); U++) ;
                if ((0 !== m ? m : f.length - g.length) > 0) break;
            }
            u.splice(d, 0, c);
        }
        return p;
    }
}

var d = (...t) => new Router(...t);

export { l as METHODS, Router, d as createRouter, Router as default };
