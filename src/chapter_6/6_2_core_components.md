# 6.2 核心组件剖析

### 节点生命周期管理

在项目中，节点生命周期由框架管理：

```python
# car_cv.py中的节点生命周期
class CarCV:
    def __init__(self):
        # 初始化视觉检测器
        self.detector = ColorDetector(...)
        
    def run(self, node):
        for event in node:
            if event["type"] == "INPUT":
                if event["id"] == "data":
                    # 处理数据
                    self.process_data(Calculate.from_pa_array(event["value"]), node)
```

### 消息路由机制

Dora的消息路由系统采用**发布-订阅模式**：

1. **主题注册**：节点声明输入/输出主题
2. **路由表构建**：框架构建全局路由表
3. **数据分发**：基于路由表高效分发数据
4. **负载均衡**：支持多节点并行处理同一主题

在项目中，消息路由通过路由表实现：

```python
# car_cv.py中的消息发送
def send(node: Node, direction, speed) -> MoveData:
    data = MoveData(direction, speed).to_arrow_array()
    if node != None:
        node.send_output("move", data)
    return MoveData(direction, speed)

def advance(node: Node, speed=2) -> MoveData:
    return send(node, 1, speed)

def turn_left(node: Node, speed=20) -> MoveData:
    return send(node, 5, speed)
```

### 资源隔离技术

为确保系统稳定性，Dora实现了多级资源隔离：

1. **进程级隔离**：关键节点运行在独立进程
2. **内存隔离**：节点内存空间分离
3. **CPU隔离**：可绑定节点到特定CPU核心
4. **优先级控制**：实时任务优先级提升

在项目中，通过进程隔离实现资源隔离：

```python
# motor/Motor.py中的资源隔离
class ModbusMotor(MotorBase):
    def __init__(self, port):
        self.port = port
        self.running = True
        self.last_time = time.time()
        self.interval = 0.05  # 指令间隔限制
        self.enable_motor()  # 初始化硬件资源
```

