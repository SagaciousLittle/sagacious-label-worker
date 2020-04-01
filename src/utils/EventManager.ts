import { Node, KonvaEventListener, NodeConfig } from "konva/types/Node";

/**
 * 事件管理器
 *
 * @export
 * @class EventManager
 */
export default class EventManager {
  constructor (private target: Node, private $bus: Bus = {}) {}
  install: fn = (name, callback) => {
    if (!this.$bus[name]) this.$bus[name] = []
    const cbs = this.$bus[name]!
    if (cbs.includes(callback)) return this
    this.target.on(name, callback)
    cbs.push(callback)
    return this
  }
  uninstall: fn = (name, callback) => {
    if (!name || !this.$bus[name]) return this
    this.target.off(name, callback)
    this.$bus[name] = this.$bus[name]!.filter(fn => fn !== callback)
    return this
  }
}

type EventName = keyof GlobalEventHandlersEventMap

type Bus = Partial<Record<EventName, KonvaEventListener<Node<NodeConfig>, GlobalEventHandlersEventMap[EventName]>[]>>

type fn = <K extends EventName> (name: K, callback: KonvaEventListener<Node<NodeConfig>, GlobalEventHandlersEventMap[EventName]>) => EventManager