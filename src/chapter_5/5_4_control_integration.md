# 5.4 机械臂控制系统集成

### 串口指令集设计

机械臂控制器通过串口接收指令，指令格式如下：

```markdown
指令格式：@[命令][参数1],[参数2],...[参数n]\n
```

常用指令示例：

| 指令 | 参数           | 功能         |
| ---- | -------------- | ------------ |
| @M   | J1,J2,J3,J4    | 设置关节角度 |
| @G   | F              | 设置抓握力   |
| @P   | X,Y,Z,RX,RY,RZ | 设置末端位姿 |
| @S   | -              | 停止运动     |
| @H   | -              | 回零位       |

### 动作序列编排

复杂动作通过预定义动作序列实现：

```python
ACTION_SEQUENCES = {
    "PICK_UP": [
        ("move_joints", [0, 45, 90, 0]),
        ("set_gripper", 30),  # 30%开度
        ("move_cartesian", [0.2, 0.0, 0.15, 0, 0, 0]),
        ("close_gripper", 3.5),  # 3.5N抓握力
        ("move_cartesian", [0.2, 0.0, 0.25, 0, 0, 0]),
        ("move_joints", [90, 60, 60, 0]),
        ("open_gripper", 100)
    ]
}

def execute_sequence(sequence_name):
    for action in ACTION_SEQUENCES[sequence_name]:
        cmd, args = action[0], action[1:]
        if cmd == "move_joints":
            move_to_joints(*args)
        elif cmd == "set_gripper":
            set_gripper_percent(*args)
        # ...其他动作处理
```

### 视觉引导控制接口

机械臂与视觉系统通过共享内存通信：

```python
# 视觉系统写入网球位置
def update_ball_position(position):
    with shared_memory_lock:
        shared_memory['ball_position'] = position

# 机械臂控制器读取位置
def get_ball_position():
    with shared_memory_lock:
        return shared_memory.get('ball_position', None)
```

## 安全保护机制

1. **碰撞检测**：电流监测检测异常负载
2. **超限保护**：关节角度和速度限制
3. **紧急停止**：硬件和软件双重急停
4. **自检程序**：启动时自动检测机械状态

## 小结

机械臂控制系统是网球捡拾小车的核心执行机构。本章详细介绍了机械臂结构设计、抓取机构力学分析、轨迹规划算法以及系统集成方案。通过精确的控制和合理的动作规划，机械臂能够可靠地完成网球抓取任务。

> **关键技术创新**：
>
> 1. 自适应抓取机构设计，适应不同网球尺寸
> 2. 混合轨迹规划策略，兼顾效率和精度
> 3. 视觉-机械臂协同控制接口
> 4. 多重安全保护机制确保操作安全