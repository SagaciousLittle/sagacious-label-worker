const initConfig: Required<ScaleConfig> = {
  min: .2,
  max: 2,
  init: 1,
  factor: 1.1,
}

/**
 * 比例尺类，用于初始化缩放比例，解决频繁计算导致的性能损耗与精度丢失问题
 *
 * @export
 * @class Scale
 */
export default class Scale {
  private current: number
  private scaleUnits: number[] = []
  private $config: Required<ScaleConfig>
  constructor ({
    max = initConfig.max,
    min = initConfig.min,
    init = initConfig.init,
    factor = initConfig.factor,
  }: ScaleConfig = initConfig) {
    this.$config = { max, min, init, factor }
    this.current = this.initScaleUnits()
  }
  private initScaleUnits () {
    const {
      max,
      min,
      init,
      factor,
    } = this.$config
    let t = init
    while (t / factor >= min) {
      t = +(t / factor).toFixed(4)
      this.scaleUnits.unshift(t)
    }
    this.scaleUnits.push(init)
    t = init
    while (t * factor <= max) {
      t = +(t * factor).toFixed(4)
      this.scaleUnits.push(t)
    }
    return this.scaleUnits.findIndex(o => o === init)
  }
  val () {
    return this.scaleUnits[this.current]
  }
  add () {
    if (this.current < this.scaleUnits.length - 1) this.current++
  }
  subtract () {
    if (this.current > 0) this.current--
  }
}

interface ScaleConfig {
  // 最小值
  min?: number
  // 最大值
  max?: number
  // 初始倍数
  init?: number
  // 缩放系数
  factor?: number
}
