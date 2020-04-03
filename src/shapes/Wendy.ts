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
      ctx.closePath()
    }
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
    if (this.attrs.closure && points.length !== this.attrs.points.length) return
    const { x, y } = this.attrs
    this.attrs.points = points.map(([px, py]) => [px - x, py - y])
  }
  init () {
    if (!(this.attrs.points instanceof Array)) this.attrs.points = []
    // pointmousedown：是否点击某个点
    this.on('mousedown', ({ evt }) => {
      const {
        offsetX,
        offsetY,
      } = evt
      const i = this.attrs.points.findIndex(([x, y]: Point) => isPointNearBy(offsetX, offsetY, x + this.getAttr('x'), y + this.getAttr('y')))
      if (i < 0) return
      this.fire('pointmousedown', {
        points: this.getAttr('points'),
        i,
        evt,
      })
    })
    // pointmouseenter：是否进入某个点
    // pointmouseleave：是否离开某个点
    let inner = -1
    let lastInner = -1
    this.on('mousemove mouseenter mouseleave', ({ evt }) => {
      const {
        offsetX,
        offsetY,
      } = evt
      const i = this.attrs.points.findIndex(([x, y]: Point) => isPointNearBy(offsetX, offsetY, x + this.getAttr('x'), y + this.getAttr('y')))
      lastInner = inner
      inner = i
      if (lastInner === inner) return
      this.fire(inner > -1 ? 'pointmouseenter' : 'pointmouseleave', {
        points: this.getAttr('points'),
        i: inner > -1 ? i : lastInner,
        evt,
      })
    })

  }
  _fill (shape: any) {
    console.log(shape)
  }
}

interface Config extends ShapeConfig {
  points: Point[]
  pointStyle: {}
  // 是否闭合
  closure: boolean
  // 选中点
  activePoint: Point
}

type Point = [number, number]
