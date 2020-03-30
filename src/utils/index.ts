export function loadImg (imgPath?: any): Promise<HTMLImageElement> {
  const res = new Image()
  if (typeof imgPath === 'string') {
    return new Promise(r => {
      res.onload = function () {
        r(res)
      }
      res.onerror = function () {
        r(res)
      }
      res.src = imgPath
    })
  } else {
    return Promise.resolve(res)
  }
}
