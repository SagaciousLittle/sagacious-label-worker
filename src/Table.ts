import Brush from './Brush'
import konva from 'konva'
import {
  StageConfig, Stage, 
} from 'konva/types/Stage'
import {
  loadImg, 
} from './utils/Function'
import {
  ImageConfig,
} from 'konva/types/shapes/Image'
import {
  merge,
} from 'lodash-es'
import Scale from './utils/Scale'
import EventManager, {
  EventWrapNode, 
} from './utils/EventManager'

export default class Table {
  $native: Native = {
    eventManager: EventManager,
  }
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
      name: 'callout',
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
    this.initEvent()
  }
  private initEvent () {
    const { stage } = this.$native
    if (!stage) return
    const wrapperStage = new EventWrapNode(stage)
    // 缩放
    const scale = new Scale()
    wrapperStage.on('wheel', ({ evt }) => {
      evt.preventDefault()
      let factor = 0
      if (evt.deltaY < 0) factor = scale.add()
      else factor = scale.subtract()
      if (!factor) return
      const { x, y } = stage.getPointerPosition() || { x: 0, y: 0 }
      const position = {
        x: stage.x() + (x - stage.x()) * (1 - factor),
        y: stage.y() + (y - stage.y()) * (1 - factor),
      }
      stage.scale({ x: scale.val(), y: scale.val() })
      stage.position(position)
      stage.batchDraw()
    })
    EventManager.regist(wrapperStage)
  }
}

interface Native {
  stage?: Stage
  eventManager: typeof EventManager
}

interface TableConfig extends StageConfig {
  bkg?: ImageConfig
}
