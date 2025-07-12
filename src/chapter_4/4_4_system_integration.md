## 4.4 底盘控制系统集成

### 串口通信协议

底盘控制器（STM32）与主控板（飞腾派）通过串口通信：

```markdown
协议格式：<STX> [CMD] [LEN] [DATA] [CHK] <ETX>
- STX: 起始字节(0xAA)
- CMD: 命令字节
- LEN: 数据长度
- DATA: 数据内容
- CHK: 校验和
- ETX: 结束字节(0x55)
```

### 状态机实现

底盘控制采用有限状态机模型：

```python
class ChassisStateMachine:
    STATES = {
        'IDLE': 0,
        'MOVING': 1,
        'ROTATING': 2,
        'EMERGENCY': 3
    }
    
    def __init__(self):
        self.state = self.STATES['IDLE']
        
    def handle_event(self, event):
        if self.state == self.STATES['IDLE']:
            if event == 'START_MOVE':
                self.start_moving()
            elif event == 'START_ROTATE':
                self.start_rotating()
                
        elif self.state == self.STATES['MOVING']:
            if event == 'TARGET_REACHED':
                self.stop()
            elif event == 'OBSTACLE_DETECTED':
                self.emergency_stop()
                
        # ...其他状态转换
```

### 安全保护机制

1. **超时保护**：指令执行超过设定时间自动停止
2. **碰撞检测**：通过电流突变检测碰撞
3. **边界限制**：设置运动范围边界
4. **紧急停止按钮**：硬件级急停开关

### 性能优化技巧

1. **指令缓冲**：使用队列缓存指令，避免丢失
2. **速度斜坡**：限制加速度，使运动更平滑
3. **预测控制**：基于当前状态预测未来位置
4. **动态参数调整**：根据负载自动调整PID参数

## 小结

底盘运动控制是网球捡拾小车的核心子系统。本章详细介绍了差速转向原理、驱动电路设计、PID控制算法实现以及系统集成方案。通过精确的运动控制，小车能够准确移动到网球位置，为后续的捡拾操作奠定基础。

> **关键要点回顾**：
>
> 1. 差速转向模型是轮式机器人的基础运动原理
> 2. H桥电路实现了电机的正反转和调速控制
> 3. PID控制器提供了精确的速度和位置控制
> 4. 状态机模型使控制系统更加可靠和安全

