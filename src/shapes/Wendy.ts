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
    this.on('mousedown', ({ evt }) => {
      const {
        offsetX,
        offsetY,
      } = evt
      const target = this.attrs.points.filter(([x, y]: [number, number]) => isPointNearBy(offsetX, offsetY, x + this.getAttr('x'), y + this.getAttr('y')))
      if (target.length > 0) this.fire('pointmousedown', {
        target: [target[0][0] + this.getAttr('x'), target[0][1] + this.getAttr('y')],
      })
    })
  }
  _sceneFunc (ctx: Context, shape: this) {
    ctx.beginPath()
    this.attrs.points.forEach(([x, y]: [number, number]) => {
      ctx.lineTo(x, y)
      ctx.moveTo(x + 10, y)
      ctx.arc(x, y, 10, 0, Math.PI * 2, true)
      ctx.moveTo(x, y)
    })
    ctx.closePath()
    ctx.fillStrokeShape(shape)
  }
  getPoints () {
    const { points, x, y } = this.attrs
    return points.map((arr: number[]) => [arr[0] + x, arr[1] + y])
  }
}

interface Config extends ShapeConfig {
  points: number[][]
  pointStyle: {

  }
}
