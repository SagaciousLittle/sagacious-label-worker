import Brush from './Brush'
import konva from 'konva'
import {
  StageConfig, Stage, 
} from 'konva/types/Stage'
import {
  loadImg, 
} from './utils'
import {
  ImageConfig, 
} from 'konva/types/shapes/Image'
import {
  merge, 
} from 'lodash-es'

export default class Table {
  $native: Native = {}
  $brushes: Brush[] = []
  constructor (config: TableConfig) {
    this.init(config)
  }
  public registBrush (brush: Brush) {
    this.$brushes.push(brush)
  }
  private async init (config: TableConfig) {
    // 获取初始化参数
    let { container } = config
    if (!(container instanceof Element)) container = document.querySelector(container) as HTMLDivElement
    const {
      width,
      height,
    } = container.getBoundingClientRect()
    this.$native.stage = new konva.Stage(merge({
      width,
      height,
    }, config))
    const layer = new konva.Layer({
      name: 'static',
    })
    this.$native.stage.add(layer)
    if (!config.bkg) return
    const image = await loadImg(config.bkg.image)
    const bkg = new konva.Image({
      image,
      x: 0,
      y: 0,
      width,
      height,
    })
    layer.add(bkg)
    layer.draw()
  }
}

interface Native {
  stage?: Stage
}

interface TableConfig extends StageConfig {
  bkg?: ImageConfig
}
