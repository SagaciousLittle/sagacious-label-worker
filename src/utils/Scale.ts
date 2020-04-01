const initConfig: Required<ScaleConfig> = {
  min: .2,
  max: 2,
  init: 1,
  factor: 0.9,
  reverseFactor: 0,
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
    if (min > init || min > max || init > max) throw new Error('错误的初始化值')
    if (factor >= 1 || factor <= 0) throw new Error('系数应在0到1之间')
    this.$config = { max, min, init, factor, reverseFactor: 1 / factor }
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
    while (t * factor >= min) {
      t = t * factor
      this.scaleUnits.unshift(t)
    }
    this.scaleUnits.push(init)
    t = init
    while (t / factor <= max) {
      t = t / factor
      this.scaleUnits.push(t)
    }
    return this.scaleUnits.findIndex(o => o === init)
  }
  // 当前刻度
  val () {
    return this.scaleUnits[this.current]
  }
  // 增加刻度，返回变化系数
  add () {
    if (this.current < this.scaleUnits.length - 1) {
      this.current++
      return this.$config.reverseFactor
    }
    return 0
  }
  // 减少刻度，返回变化系数
  subtract () {
    if (this.current > 0) {
      this.current--
      return this.$config.factor
    }
    return 0
  }
  // 获取配置
  getConf (k: keyof ScaleConfig) {
    return this.$config[k]
  }
}

interface ScaleConfig {
  // 最小值
  min?: number
  // 最大值
  max?: number
  // 初始倍数
  init?: number
  // 系数
  factor?: number
  // 反系数
  reverseFactor?: number
}
