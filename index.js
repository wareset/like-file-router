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
        var a, l = e.slice(1, -1), n = 1e6, u = !1;
        0 === l.indexOf("...") && (l = l.slice(3), s = u = !0, n = 1e3);
        var p = "[^/]+?";
        (a = l.indexOf("(")) > -1 && (n *= 10, p = l.slice(a + 1, -1), l = l.slice(0, a), 
        p = p.replace(/<(.)>/gi, "\\$1")), i += u ? "(?<" + l + ">(?:" + p + ")(?:\\/(?:" + p + "))*)" : "(?<" + l + ">(?:" + p + "))", 
        r.push(n);
    }
    return {
        id: r,
        spread: s,
        dirty: i
    };
}, h = t => {
    for (var e = 0, r = t.length; r-- > 0; ) e += t[r];
    return t.length < 2 && 1e9 === t[0] && (e += 1e15), 1e9 === t[t.length - 1] && (e += 1e11), 
    1e9 === t[0] && (e += 1e12), e;
}, a = t => {
    if (null != t && t.length > 0) {
        "string" != typeof t && (t = t[0] || "");
        var e = t.lastIndexOf(",");
        return e > -1 ? t.slice(e + 1).trim() : t.trim();
    }
    return null;
};

class ParsedUrl {
    constructor(e) {
        var r;
        this._ = void 0, this.path = void 0, this.pathname = void 0, this.search = void 0, 
        this.query = void 0, this._raw = void 0, this.raw = void 0, this.raw = this._raw = e.url, 
        this.path = this._raw, this.pathname = this._raw, (r = this._raw.indexOf("?")) > -1 ? (this.pathname = this._raw.slice(0, r), 
        this.query = this._raw.slice(r + 1), this.search = "?" + this.query) : this.search = this.query = "";
        var s = t(this.pathname);
        if (s.indexOf("%") > -1) try {
            s = decodeURIComponent(s);
        } catch {}
        this._ = {
            encrypted: e.socket.encrypted || e.connection.encrypted,
            headers: e.headers,
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
        var p = this;
        p._routes = e(null), p._baseUrl = t(i);
        var c = r(h), d = e(null);
        for (var _ in a) +_ == +_ && (d[_] = a[_]);
        p._errors = a = d, p._errorsFactory = l;
        for (var g = n.length; g-- > 0; ) p[n[g]] = p.add.bind(p, u[g]);
        o.on("request", ((t, r) => {
            t.baseUrl = p._baseUrl, t.originalUrl = t.originalUrl || t.url, t.parsedUrl = t._parsedUrl = new ParsedUrl(t), 
            r.locals = r.locals || e(null);
            var s, o = t.method.toUpperCase(), i = t.parsedUrl._.routes.length, h = null;
            t: if (o in p._routes) {
                if (i in p._routes[o]) for (var l = p._routes[o][i], n = 0, u = l.length; n < u; n++) if (null != (h = t.parsedUrl._.route.match((s = l[n]).regex))) break t;
                for (var d = i; d >= 0; d--) if (d in p._routes[o][-1]) for (var _ = p._routes[o][-1][d], g = 0, f = _.length; g < f; g++) if (null != (h = t.parsedUrl._.route.match((s = _[g]).regex))) break t;
            }
            var v = [ c ];
            null != h ? (t.params = h.groups || e(null), v[1] = s.handlers) : t.params = e(null);
            var m = -1, y = 0, x = e => {
                if (null != e) {
                    var s = +e || +e.code || +e.status || +e.statusCode || 500;
                    (a[s] || (a[s] = p._errorsFactory(s)))(t, r, e);
                } else ++m in v[y] ? v[y][m](t, r, x) : ++y < v.length ? v[y][m = 0] ? v[y][m](t, r, x) : x() : x(v.length < 2 ? 404 : 500);
            };
            x();
        })), p.listen = o.listen.bind(o);
    }
    add(s, o, ...a) {
        for (var l, n, u, p, c = this, d = ((e, r) => {
            e = t(e);
            for (var s, o, a = 0, l = [], n = !1, u = [], p = "", c = [], d = !1, _ = !1, g = 0, f = !1, v = !1, m = 0; m <= e.length; m++) s = e.charAt(m), 
            g && g--, _ && ("\\" === s ? g = 2 : "[" !== s || g ? "]" !== s || g || (f = !1) : f = !0), 
            d && !f && (")" === s ? _ = !1 : "(" === s && (_ = !0)), _ || f || ("]" === s && d ? (d = !1, 
            v = !0) : "[" !== s || d || (d = !0, c.push(p), p = "")), s && (d || _ || f || "/" !== s && "\\" !== s) ? (p += s, 
            v && (v = !1, c.push(p), p = "")) : (p && (c.push(p), 1) || c.length) && (o = i(c), 
            p = "", c = [], a++, l.push(h(o.id)), n = n || o.spread, u.push(o.dirty));
            var y = "^" + u.join("\\/") + "\\/*$";
            return {
                count: a,
                id: l,
                spread: n,
                route: e,
                regex: new RegExp(y),
                handlers: r
            };
        })(c._baseUrl + "/" + o, r(...a)), _ = (t => [].concat(...[].concat(t).map((t => t.trim().toUpperCase().split(/[^-\w]+/)))))(s), g = 0; g < _.length; g++) {
            (l = _[g]) in c._routes || (c._routes[l] = e(null), c._routes[l][-1] = e(null)), 
            n = c._routes[l], u = d.spread ? d.count in n[-1] ? n[-1][d.count] : n[-1][d.count] = [] : d.count in n ? n[d.count] : n[d.count] = [], 
            p = 0;
            for (var f, v = d.id, m = 0; p < u.length; p++) {
                f = u[p].id;
                for (var y = 0; y < v.length && !(y > f.length || 0 != (m = v[y] - f[y])); y++) ;
                if ((0 !== m ? m : f.length - v.length) > 0) break;
            }
            u.splice(p, 0, d);
        }
        return c;
    }
}

exports.METHODS = n, exports.Router = Router, exports.createRouter = (...t) => new Router(...t), 
exports.default = Router;
