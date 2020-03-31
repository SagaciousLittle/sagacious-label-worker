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
import {
  BigNumber,
} from 'bignumber.js'
import Scale from './utils/Scale'

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
    // 初始化table，包含背景层 + 背景图
    const stage = new konva.Stage(merge({
      width,
      height,
    }, config))
    const layer = new konva.Layer({
      name: 'static',
    })
    this.$native.stage = stage
    stage.add(layer)
    if (!config.bkg) return
    config.bkg.image = await loadImg(config.bkg.image)
    const bkg = new konva.Image(merge<ImageConfig, ImageConfig>({
      image: undefined,
      x: 0,
      y: 0,
      width,
      height,
      draggable: true,
    }, config.bkg))
    layer.add(bkg)
    layer.draw()
    // 初始化缩放功能
    const scale = new Scale()
    const position = stage.position()
    stage.on('click', ({ evt }) => {
      console.log(evt.offsetX, evt.offsetY, scale.val())
    })
    stage.on('wheel', ({ evt }) => {
      stage.position({
        x: evt.offsetX,
        y: evt.offsetY,
      })
      stage.offset({
        x: evt.offsetX,
        y: evt.offsetY,
      })
      if (evt.deltaY < 0) {
        scale.add()
      } else {
        scale.subtract()
      }
      stage.scale({
        x: scale.val(),
        y: scale.val(),
      })
      stage.draw()
    })
  }
}

interface Native {
  stage?: Stage
}

interface TableConfig extends StageConfig {
  bkg?: ImageConfig
}
