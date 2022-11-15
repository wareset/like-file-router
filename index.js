/* eslint-disable */
Object.defineProperty(exports, "__esModule", {
    value: !0
});

const t = Object.create, e = JSON.stringify;

function r(t) {
    return t.replace(/^[/\\\s]+|[/\\\s]+$/g, "");
}

const s = t;

function n(...t) {
    return [].concat(...t).filter((t => "function" == typeof t));
}

function o(t) {
    return function(r, s, n) {
        s.statusCode = t, s.end(n ? e(n, null, 2) : "" + t);
    };
}

const l = RegExp;

function i(t) {
    return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function h(t) {
    const e = [];
    let r = !1, s = "";
    for (let n, o = 0; o < t.length; o++) if (n = t[o]) if ("[" !== n[0]) e.push(1e9), 
    s += i(n); else {
        let t, o = n.slice(1, -1), l = 1e6, i = !1;
        0 === o.indexOf("...") && (o = o.slice(3), r = i = !0, l = 1e3);
        let h = "[^/]+?";
        (t = o.indexOf("(")) > -1 && (l *= 10, h = o.slice(t + 1, -1), o = o.slice(0, t), 
        h = h.replace(/<(.)>/gi, "\\$1")), s += i ? `(?<${o}>(?:${h})(?:\\/(?:${h}))*)` : `(?<${o}>(?:${h}))`, 
        e.push(l);
    }
    return {
        id: e,
        spread: r,
        dirty: s
    };
}

function u(t) {
    let e = 0;
    for (let r = t.length; r-- > 0; ) e += t[r];
    return t.length < 2 && 1e9 === t[0] && (e += 1e15), 1e9 === t[t.length - 1] && (e += 1e11), 
    1e9 === t[0] && (e += 1e12), e;
}

const c = decodeURIComponent;

function a(t) {
    if (null != t && t.length > 0) {
        "string" != typeof t && (t = t[0] || "");
        const e = t.lastIndexOf(",");
        return e > -1 ? t.slice(e + 1).trim() : t.trim();
    }
    return null;
}

class ParsedUrl {
    constructor(t) {
        let e;
        this.raw = this._raw = t.url, this.path = this._raw, this.pathname = this._raw, 
        (e = this._raw.indexOf("?")) > -1 ? (this.pathname = this._raw.slice(0, e), this.query = this._raw.slice(e + 1), 
        this.search = "?" + this.query) : this.search = this.query = "";
        let s = r(this.pathname);
        if (s.indexOf("%") > -1) try {
            s = c(s);
        } catch (n) {}
        this._ = {
            encrypted: t.socket.encrypted || t.connection.encrypted,
            headers: t.headers,
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
        let t;
        return null != this._.hostname ? this._.hostname : this._.hostname = this.host ? (t = this._.host.indexOf(":")) > -1 ? this._.host.slice(0, t) : this._.host : "";
    }
    get port() {
        let t;
        return null != this._.port ? this._.port : this._.port = this.host && (t = this._.host.indexOf(":")) > -1 ? this._.host.slice(t + 1) : "";
    }
    get origin() {
        return this.protocol + "//" + this.host;
    }
    get href() {
        return this.origin + this._raw;
    }
}

const p = "get|head|post|put|delete|connect|options|trace|patch", d = p.split("|"), f = p.toUpperCase().split("|");

class Router {
    constructor(t, {baseUrl: e = "", use: l = [], errors: i = {}, errorsFactory: h = o} = {}) {
        this.server = t;
        const u = this;
        u._routes = s(null), u._baseUrl = r(e);
        const c = n(l), a = s(null);
        for (const r in i) +r == +r && (a[r] = i[r]);
        u._errors = i = a, u._errorsFactory = h;
        for (let r = d.length; r-- > 0; ) u[d[r]] = u.add.bind(u, f[r]);
        t.on("request", (function(t, e) {
            t.baseUrl = u._baseUrl, t.originalUrl = t.originalUrl || t.url, t.parsedUrl = t._parsedUrl = new ParsedUrl(t), 
            e.locals = e.locals || s(null);
            const r = t.method.toUpperCase(), n = t.parsedUrl._.routes.length;
            let o, l = null;
            t: if (r in u._routes) {
                if (n in u._routes[r]) for (let e = u._routes[r][n], s = 0, i = e.length; s < i; s++) if (null != (l = t.parsedUrl._.route.match((o = e[s]).regex))) break t;
                for (let e = n; e >= 0; e--) if (e in u._routes[r][-1]) for (let s = u._routes[r][-1][e], n = 0, i = s.length; n < i; n++) if (null != (l = t.parsedUrl._.route.match((o = s[n]).regex))) break t;
            }
            const h = [ c ];
            null != l ? (t.params = l.groups || s(null), h[1] = o.handlers) : t.params = s(null);
            let a = -1, p = 0;
            !function r(s) {
                if (null != s) {
                    const r = +s || +s.code || +s.status || +s.statusCode || 500;
                    (i[r] || (i[r] = u._errorsFactory(r)))(t, e, s);
                } else ++a in h[p] ? h[p][a](t, e, r) : ++p < h.length ? h[p][a = 0] ? h[p][a](t, e, r) : r() : r(h.length < 2 ? 404 : 500);
            }();
        }));
    }
    listen(...t) {
        return this.server.listen(...t);
    }
    add(t, e, ...o) {
        const i = this, c = function(t, e) {
            t = r(t);
            let s = 0;
            const n = [];
            let o = !1;
            const i = [];
            let c = "", a = [], p = !1, d = !1, f = 0, _ = !1, g = !1;
            for (let r, l, x = 0; x <= t.length; x++) r = t.charAt(x), f && f--, d && ("\\" === r ? f = 2 : "[" !== r || f ? "]" !== r || f || (_ = !1) : _ = !0), 
            p && !_ && (")" === r ? d = !1 : "(" === r && (d = !0)), d || _ || ("]" === r && p ? (p = !1, 
            g = !0) : "[" !== r || p || (p = !0, a.push(c), c = "")), r && (p || d || _ || "/" !== r && "\\" !== r) ? (c += r, 
            g && (g = !1, a.push(c), c = "")) : (c && (a.push(c), 1) || a.length) && (l = h(a), 
            c = "", a = [], s++, n.push(u(l.id)), o = o || l.spread, i.push(l.dirty));
            const m = `^${i.join("\\/")}\\/*$`;
            return {
                count: s,
                id: n,
                spread: o,
                route: t,
                regex: new l(m, "i"),
                handlers: e
            };
        }(i._baseUrl + "/" + e, n(...o));
        for (let r, n, l, h, u = function(t) {
            return [].concat(...[].concat(t).map((t => t.trim().toUpperCase().split(/[^-\w]+/))));
        }(t), a = 0; a < u.length; a++) {
            (r = u[a]) in i._routes || (i._routes[r] = s(null), i._routes[r][-1] = s(null)), 
            n = i._routes[r], l = c.spread ? c.count in n[-1] ? n[-1][c.count] : n[-1][c.count] = [] : c.count in n ? n[c.count] : n[c.count] = [], 
            h = 0;
            for (let t, e = c.id, r = 0; h < l.length; h++) {
                t = l[h].id;
                for (let s = 0; s < e.length && !(s > t.length || 0 != (r = e[s] - t[s])); s++) ;
                if ((0 !== r ? r : t.length - e.length) > 0) break;
            }
            l.splice(h, 0, c);
        }
        return i;
    }
}

exports.METHODS = d, exports.Router = Router, exports.createRouter = function(...t) {
    return new Router(...t);
}, exports.default = Router;
