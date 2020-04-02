import {
  Node, KonvaEventListener,
} from 'konva/types/Node'
import {
  nanoid,
} from 'nanoid'

/**
 * 全局事件管理器
 *
 * @export
 * @class EventManager
 */
export default class EventManager {
  static $groups: EventGroup[] = []
  static register (...nodes: EventWrapNode[]) {
    const group = new EventGroup(nodes)
    this.$groups.push(group)
    return group.id
  }
  static get (gid: string) {
    return this.$groups.find(o => o.id === gid)
  }
}

/**
 * 事件包装节点组
 *
 * @class EventGroup
 */
class EventGroup {
  id = nanoid()
  constructor (public nodes: EventWrapNode[] = []) {
    nodes.forEach(o => o.init(this.id))
  }
  listener (listen: boolean) {
    this.nodes.forEach(n => n.listener(listen))
  }
  destroy () {
    this.nodes.forEach(n => n.destroy())
  }
}

/**
 * 事件包装节点类
 *
 * @export
 * @class EventWrapNode
 */
export class EventWrapNode {
  private $cache: Cache = {}
  id = nanoid()
  private gid = ''
  private listen = true
  constructor (public node: Node) {}
  on: Fn = (name, callback) => {
    const _this = this
    this.$cache[name] = this.$cache[name] || []
    if (!this.$cache[name]!.includes(callback)) this.$cache[name]!.push(callback)
    if (this.gid) this.node.on(name, function (e) {
      if (_this.listen) callback.call(this, e)
    })
    return this
  }
  off: Fn = (name, callback) => {
    const res = this.$cache[name]
    if (res) {
      const idx = res.findIndex((cb: any) => cb === callback)
      if (idx < 0) return this
      res.splice(idx, 1)
    }
    if (this.gid) this.off(name, callback)
    return this
  }
  init (gid: string) {
    const _this = this
    this.gid = gid
    for (let en in this.$cache) {
      const cbs = this.$cache[en as EventName]
      cbs?.forEach((cb: any) => {
        this.node.on(en, function (e) {
          if (_this.listen) cb.call(this, e)
        })
      })
    }
  }
  destroy () {
    for (let en in this.$cache) {
      const cbs = this.$cache[en as EventName]
      cbs?.forEach((cb: any) => {
        this.node.off(en, cb)
      })
    }
    this.$cache = {}
  }
  listener (listen: boolean) {
    this.listen = listen
  }
}

type EventName = keyof GlobalEventHandlersEventMap

type Fn = <K extends EventName>(evtStr: K, handler: KonvaEventListener<Node, GlobalEventHandlersEventMap[EventName]>) => EventWrapNode

type Cache = {
  [name in EventName]?: KonvaEventListener<Node, GlobalEventHandlersEventMap[name]>[]
}
