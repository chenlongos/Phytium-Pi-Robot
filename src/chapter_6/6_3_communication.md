# 6.3 通信机制实现

### 进程间通信(IPC)

Dora提供多种IPC机制适应不同场景：

| 通信方式     | 适用场景   | 性能 | 特点               |
| ------------ | ---------- | ---- | ------------------ |
| 共享内存     | 大数据传输 | 极高 | 零拷贝，需同步机制 |
| Unix域套接字 | 控制指令   | 高   | 低延迟，可靠       |
| TCP/IP       | 分布式节点 | 中   | 跨机器通信         |
| 消息队列     | 异步处理   | 中高 | 解耦生产消费       |

项目IPC机制：

```python
# motor/main.py中的IPC处理
for event in node:
    if event["type"] == "INPUT" and event["id"] == "move":
        # 将pyarrow Array转换为MoveData对象
        data = event["value"]
        move_data = MoveData.from_arrow_array(data)
        # 控制电机
        car_controller.Control(move_data)
```

### 共享内存优化

共享内存传输实现零拷贝：

```python
# untils/untils.py中的图像处理优化
def translate_image(data, metadata):
    np_array = data.to_numpy()
    if metadata["encoding"] in ["jpeg", "png"]:
        # 避免复制大型图像数据
        byte_data = np_array.tobytes()
        return cv2.imdecode(np.frombuffer(byte_data, np.uint8), cv2.IMREAD_COLOR)
    elif encoding in ["uint8"]:
        height = metadata["height"]
        width = metadata["width"]
        image = np_array.reshape((height, width))
    else:
        return None
    return image
```

### 分布式部署方案

Dora支持分布式部署，关键特性包括：

1. **节点发现**：基于mDNS自动发现局域网节点
2. **数据路由**：跨机器数据自动路由
3. **负载均衡**：动态分配计算任务
4. **容错机制**：节点故障自动恢复

在项目中支持分布式节点部署：

```python
# control.py中的WebSocket通信
@socketio.on("control")
def handle_control(data):
    direction = data.get("direction")
    if direction in ["advance", "back", "turn_left", "turn_right"]:
        if global_flag:
            emit("response", {"status": "Moving " + direction})
```

