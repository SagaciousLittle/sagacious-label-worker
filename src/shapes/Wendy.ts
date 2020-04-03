import konva from 'konva'
import {
  ShapeConfig,
} from 'konva/types/Shape'
import {
  Context, 
} from 'konva/types/Context'
import {
  isPointNearBy,
} from '../utils/Function'

export default class Wendy extends konva.Shape<Config> {
  constructor (config: Config) {
    super(config)
    this.init()
  }
  _sceneFunc (ctx: Context, shape: this) {
    ctx.beginPath()
    this.attrs.points.forEach(([x, y]: Point) => {
      ctx.lineTo(x, y)
    })
    if (this.attrs.closure) {
      const [[x, y]] = this.attrs.points
      ctx.lineTo(x, y)
    }
    ctx.closePath()
    this.attrs.points.forEach(([x, y]: Point) => {
      ctx.moveTo(x + 10, y)
      ctx.arc(x, y, 10, 0, Math.PI * 2, true)
    })
    ctx.fillStrokeShape(shape)
  }
  getPoints () {
    const { points, x, y } = this.attrs
    return points.map((arr: number[]) => [arr[0] + x, arr[1] + y])
  }
  setPoints (points: Point[]) {
    if (this.attrs.closure && this.attrs.points.length !== points.length) return console.log('已经闭合了')
    const { x, y } = this.attrs
    this.attrs.points = points.map(([px, py]) => [px - x, py - y])
  }
  init () {
    if (!(this.attrs.points instanceof Array)) this.attrs.points = []
    this.on('mousedown', ({ evt }) => {
      console.log(123)
      const {
        offsetX,
        offsetY,
      } = evt
      const i = this.attrs.points.findIndex(([x, y]: Point) => isPointNearBy(offsetX, offsetY, x + this.getAttr('x'), y + this.getAttr('y')))
      if (i > -1) this.fire('pointmousedown', {
        points: this.getAttr('points'),
        i,
      })
    })
  }
}

interface Config extends ShapeConfig {
  points: Point[]
  pointStyle: {}
  // 是否闭合
  closure: boolean
}

type Point = [number, number]
