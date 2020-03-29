export function loadImg (imgPath?: any): Promise<HTMLImageElement> {
  const res = new Image()
  if (typeof imgPath === 'string') {
    res.onload = function () {
      return new Promise(r => r(res))
    }
    res.onerror = function () {
      return new Promise(r => r(res))
    }
    res.src = imgPath
  }
  return Promise.resolve(res)
}
