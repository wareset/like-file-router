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
        var a, l = r.slice(1, -1), n = 1e6, u = !1;
        0 === l.indexOf("...") && (l = l.slice(3), s = u = !0, n = 1e3);
        var c = "[^/]+?";
        (a = l.indexOf("(")) > -1 && (n *= 10, c = l.slice(a + 1, -1), l = l.slice(0, a), 
        c = c.replace(/<(.)>/gi, "\\$1")), i += u ? "(?<" + l + ">(?:" + c + ")(?:\\/(?:" + c + "))*)" : "(?<" + l + ">(?:" + c + "))", 
        e.push(n);
    }
    return {
        id: e,
        spread: s,
        dirty: i
    };
}, h = t => {
    for (var r = 0, e = t.length; e-- > 0; ) r += t[e];
    return t.length < 2 && 1e9 === t[0] && (r += 1e15), 1e9 === t[t.length - 1] && (r += 1e11), 
    1e9 === t[0] && (r += 1e12), r;
}, a = t => {
    if (null != t && t.length > 0) {
        "string" != typeof t && (t = t[0] || "");
        var r = t.lastIndexOf(",");
        return r > -1 ? t.slice(r + 1).trim() : t.trim();
    }
    return null;
};

class ParsedUrl {
    constructor(r) {
        var e;
        this._ = void 0, this.path = void 0, this.pathname = void 0, this.search = void 0, 
        this.query = void 0, this._raw = void 0, this.raw = void 0, this.raw = this._raw = r.url, 
        this.path = this._raw, this.pathname = this._raw, (e = this._raw.indexOf("?")) > -1 ? (this.pathname = this._raw.slice(0, e), 
        this.query = this._raw.slice(e + 1), this.search = "?" + this.query) : this.search = this.query = "";
        var s = t(this.pathname);
        if (s.indexOf("%") > -1) try {
            s = decodeURIComponent(s);
        } catch {}
        this._ = {
            encrypted: r.socket.encrypted || r.connection.encrypted,
            headers: r.headers,
            protocol: null,
            host: null,
            hostname: null,
            port: null,
            route: s,
            routes: s.length > 0 ? s.split("/") : []
        };
    }
    get protocol() {
        return null != this._.protocol ? this._.protocol : this._.protocol = a(this._.headers["x-forwarded-proto"]) || "http" + (this._.encrypted ? "s:" : ":");
    }
    get host() {
        return null != this._.host ? this._.host : this._.host = a(this._.headers["x-forwarded-host"]) || a(this._.headers.host) || a(this._.headers[":authority"]) || "";
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

var l = "get|head|post|put|delete|connect|options|trace|patch", n = l.split("|"), u = l.toUpperCase().split("|");

class Router {
    constructor(o, {baseUrl: i = "", use: h = [], errors: a = {}, errorsFactory: l = s} = {}) {
        this.server = void 0, this.server = o;
        var c = this;
        c._routes = r(null), c._baseUrl = t(i);
        var p = e(h), d = r(null);
        for (var _ in a) +_ == +_ && (d[_] = a[_]);
        c._errors = a = d, c._errorsFactory = l;
        for (var g = n.length; g-- > 0; ) c[n[g]] = c.add.bind(c, u[g]);
        o.on("request", ((t, e) => {
            t.baseUrl = c._baseUrl, t.originalUrl = t.originalUrl || t.url, t.parsedUrl = t._parsedUrl = new ParsedUrl(t), 
            e.locals = e.locals || r(null);
            var s, o = t.method.toUpperCase(), i = t.parsedUrl._.routes.length, h = null;
            t: if (o in c._routes) {
                if (i in c._routes[o]) for (var l = c._routes[o][i], n = 0, u = l.length; n < u; n++) if (null != (h = t.parsedUrl._.route.match((s = l[n]).regex))) break t;
                for (var d = i; d >= 0; d--) if (d in c._routes[o][-1]) for (var _ = c._routes[o][-1][d], g = 0, v = _.length; g < v; g++) if (null != (h = t.parsedUrl._.route.match((s = _[g]).regex))) break t;
            }
            var f = [ p ];
            null != h ? (t.params = h.groups || r(null), f[1] = s.handlers) : t.params = r(null);
            var m = -1, y = 0, U = r => {
                if (null != r) {
                    var s = +r || +r.code || +r.status || +r.statusCode || 500;
                    (a[s] || (a[s] = c._errorsFactory(s)))(t, e, r);
                } else ++m in f[y] ? f[y][m](t, e, U) : ++y < f.length ? f[y][m = 0] ? f[y][m](t, e, U) : U() : U(f.length < 2 ? 404 : 500);
            };
            U();
        }));
    }
    listen(...t) {
        return this.server.listen(...t);
    }
    add(s, o, ...a) {
        for (var l, n, u, c, p = this, d = ((r, e) => {
            r = t(r);
            for (var s, o, a = 0, l = [], n = !1, u = [], c = "", p = [], d = !1, _ = !1, g = 0, v = !1, f = !1, m = 0; m <= r.length; m++) s = r.charAt(m), 
            g && g--, _ && ("\\" === s ? g = 2 : "[" !== s || g ? "]" !== s || g || (v = !1) : v = !0), 
            d && !v && (")" === s ? _ = !1 : "(" === s && (_ = !0)), _ || v || ("]" === s && d ? (d = !1, 
            f = !0) : "[" !== s || d || (d = !0, p.push(c), c = "")), s && (d || _ || v || "/" !== s && "\\" !== s) ? (c += s, 
            f && (f = !1, p.push(c), c = "")) : (c && (p.push(c), 1) || p.length) && (o = i(p), 
            c = "", p = [], a++, l.push(h(o.id)), n = n || o.spread, u.push(o.dirty));
            var y = "^" + u.join("\\/") + "\\/*$";
            return {
                count: a,
                id: l,
                spread: n,
                route: r,
                regex: new RegExp(y),
                handlers: e
            };
        })(p._baseUrl + "/" + o, e(...a)), _ = (t => [].concat(...[].concat(t).map((t => t.trim().toUpperCase().split(/[^-\w]+/)))))(s), g = 0; g < _.length; g++) {
            (l = _[g]) in p._routes || (p._routes[l] = r(null), p._routes[l][-1] = r(null)), 
            n = p._routes[l], u = d.spread ? d.count in n[-1] ? n[-1][d.count] : n[-1][d.count] = [] : d.count in n ? n[d.count] : n[d.count] = [], 
            c = 0;
            for (var v, f = d.id, m = 0; c < u.length; c++) {
                v = u[c].id;
                for (var y = 0; y < f.length && !(y > v.length || 0 != (m = f[y] - v[y])); y++) ;
                if ((0 !== m ? m : v.length - f.length) > 0) break;
            }
            u.splice(c, 0, d);
        }
        return p;
    }
}

var c = (...t) => new Router(...t);

export { n as METHODS, Router, c as createRouter, Router as default };
