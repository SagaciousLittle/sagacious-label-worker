
/**
 * 加载图片
 *
 * @export
 * @param {*} [imgPath]
 * @returns {Promise<HTMLImageElement>}
 */
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

/**
 * 判断点是否在附近
 *
 * @export
 * @param {number} targetX
 * @param {number} targetY
 * @param {number} x
 * @param {number} y
 * @param {number} [radius=10]
 * @returns {boolean}
 */
export function isPointNearBy (targetX: number, targetY: number, x: number, y: number, radius: number = 10): boolean {
  const dis = Math.sqrt((targetX - x) * (targetX - x) + (targetY - y) * (targetY - y))
  return dis <= radius
}
