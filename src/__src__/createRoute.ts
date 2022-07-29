import { TypeRoute, TypeHandler } from '.'
import { trimSlashes } from '.'

const __esc__ = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const __createRouteItem__ = (a: string[]) => {
  const id: number[] = []
  let spread = false

  let dirty = ''

  for (let s: string, i = 0; i < a.length; i++) {
    if (s = a[i]) {
      if (s[0] !== '[') {
        id.push(1e9)
        dirty += __esc__(s)
      } else {
        let idx: number
        let slug = s.slice(1, -1)

        let idLocal = 1e6
        let spreadLocal = false
        if (slug.indexOf('...') === 0) {
          slug = slug.slice(3), spread = spreadLocal = true, idLocal = 1e3
        }

        let regex = '[^/]+?'
        if ((idx = slug.indexOf('(')) > -1) {
          idLocal *= 2
          regex = slug.slice(idx + 1, -1), slug = slug.slice(0, idx)
          regex = regex.replace(/<(.)>/gi, '\\$1')
        }

        if (!spreadLocal) dirty += `(?<${slug}>(?:${regex}))`
        else dirty += `(?<${slug}>(?:${regex})(?:\\/(?:${regex}))*)`

        id.push(idLocal)
      }
    }
  }

  try {
    new RegExp(dirty)
  } catch (e) {
    console.error(e)
  }

  // for (let i = id.length; i-- > 0;) id[i] += id.length

  const res = {
    id,
    spread,
    dirty,
  }

  return res
}

const medium = (a: number[]): number => {
  let res = 0
  for (let i = a.length; i-- > 0;) res += a[i]
  if (a.length < 2 && a[0] === 1e9) res += 1e15
  if (a[0] === 1e9 || a[a.length - 1] === 1e9 && res--) res += 1e12
  return res
}

export const createRoute = (
  s: string, handlers: TypeHandler[], baseUrl: string
): TypeRoute => {
  s = trimSlashes(s)
  if (baseUrl) s = baseUrl + '/' + s

  let count = 0
  const id: number[] = []
  let spread = false
  const _dirtyArr: string[] = []

  let cur = ''
  let tmp: string[] = []
  let isBrakets = false
  let isRegex = false
  let slashed = 0
  let isRXD = false
  let needDlmtr = false
  for (let char: string, item: any, i = 0; i <= s.length; i++) {
    char = s.charAt(i)
    if (slashed) slashed--

    if (isRegex) {
      if (char === '\\') slashed = 2
      else if (char === '[' && !slashed) isRXD = true
      else if (char === ']' && !slashed) isRXD = false
    }

    if (isBrakets && !isRXD) {
      if (char === ')') isRegex = false
      else if (char === '(') isRegex = true
    }

    if (!isRegex && !isRXD) {
      if (char === ']' && isBrakets) isBrakets = false, needDlmtr = true
      else if (char === '[' && !isBrakets) isBrakets = true, tmp.push(cur), cur = ''
    }

    if (!char || !isBrakets && !isRegex && !isRXD && (char === '/' || char === '\\')) {
      if (cur && (tmp.push(cur), true) || tmp.length) {
        item = __createRouteItem__(tmp), cur = '', tmp = []
        count++
        id.push(medium(item.id))
        // id.push(...item.id)
        spread = spread || item.spread
        _dirtyArr.push(item.dirty)
      }
      continue
    }
    cur += char
    if (needDlmtr) needDlmtr = false, tmp.push(cur), cur = ''
  }

  const _dirty = `^${_dirtyArr.join('\\/')}\\/*$`

  let regex: RegExp
  try {
    regex = new RegExp(_dirty)
  } catch (e) {
    regex = /^error$/
    console.error(e)
  }

  const res = {
    count,
    id,
    spread,
    route: s,
    regex,
    _dirty,
    handlers
  }

  // console.log(s)
  // console.log(_dirtyArr)
  // console.log(_dirty)
  // console.log(regex)
  // console.log(res)

  return res
}
