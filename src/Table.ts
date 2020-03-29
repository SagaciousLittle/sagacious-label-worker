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
    this.$native.stage = new konva.Stage(config)
    const layer = new konva.Layer({
      name: 'static',
    })
    this.$native.stage.add(layer)
    if (!config.bkg) return
    const res = await loadImg(config.bkg.image)
  }
}

interface Native {
  stage?: Stage
}

interface TableConfig extends StageConfig {
  bkg?: ImageConfig
}
