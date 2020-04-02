# EventManager

## API

```typescript
/**
 * 全局事件管理器
 *
 * @export
 * @class EventManager
 */
declare class EventManager {
  // 所有组实例
  static $groups: EventGroup[];
  // 注册组，返回组ID
  static register(...nodes: EventWrapNode[]): EventGroup;
  // 销毁组
  static unregist(...groups: EventGroup[]): void;
  // 根据ID获取组
  static get(gid: string): EventGroup | undefined;
}

/**
 * 事件包装节点组
 *
 * @class EventGroup
 */
declare class EventGroup {
  // 组内所有事件包装节点
  nodes: EventWrapNode[];
  id: string;
  constructor(nodes?: EventWrapNode[]);
  // 控制组事件是否可用
  listener(listen: boolean): void;
  // 销毁组
  destroy(removeFromManager?: boolean): void;
  // 新增节点
  push(...nodes: EventWrapNode[]): void;
  // 销毁节点
  remove(...nodes: EventWrapNode[]): void;
}

/**
 * 事件包装节点类
 *
 * @export
 * @class EventWrapNode
 */
declare class EventWrapNode {
    node: Node;
    id: string;
    private $cache;
    private gid;
    private listen;
    constructor(node: Node);
    // 绑定事件
    on: Fn;
    // 解绑事件
    off: Fn;
    // 控制节点事件是否可用
    listener(listen: boolean): void;
    destroy(removeFromGroup?: boolean): void;
    init(gid: string): void;
}

type EventName = keyof GlobalEventHandlersEventMap;
type Fn = <K extends EventName>(evtStr: K, handler: KonvaEventListener<Node, GlobalEventHandlersEventMap[EventName]>) => EventWrapNode;

```
## 案例

```typescript
const layer = new konva.Layer()
// 假如有个新的rect
const rect = new konva.Rect({
  x: 0,
  y: 0,
  width: 10,
  height: 10,
})
layer.add(rect)
// 先调用包装类注册事件（支持链式）
// 注：未注册时，事件只是缓存，并未生效
const wrapperRect = new EventWrapNode(rect)
  .on('click', () => {
    console.log('rect click')
  })
  .on('mousemove', () => {
    console.log('rect mousemove')
  })
const wrapperLayer = new EventWrapNode(layer)
  .on('keyup', () => {
    console.log('layer keyup')
  })
// 注册到事件管理器后绑定事件生效
const eventGroup = EventManager.register(wrapperRect, wrapperLayer)
// 现在可以通过控制group来批量操作组内数据
// 比如通过listener暂时屏蔽监听器
eventGroup.listener(false)
// 注册节点到组
eventGroup.push(node1, node2)
// 注销组节点
eventGroup.remove(node1, node2)
```