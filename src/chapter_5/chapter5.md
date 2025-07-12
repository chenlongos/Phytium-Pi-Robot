# 第五章 机械臂控制系统

## 5.1 机械臂结构分析

### 4自由度机械臂设计

本系统采用4自由度机械臂结构，这种设计在灵活性和复杂度之间取得了良好平衡。机械臂的四个自由度分别为：

1. **基座旋转关节**（0-180°）：控制整个机械臂的水平旋转
2. **肩关节**（0-90°）：控制大臂的俯仰运动
3. **肘关节**（0-120°）：控制小臂的俯仰运动
4. **腕关节**（0-180°）：控制末端执行器的方向

**工作空间分析**：
 机械臂的工作空间是一个半球形区域，半径约30cm，高度范围15-45cm。这种设计特别适合地面网球捡拾任务，能够覆盖小车周围的大部分区域。

### 舵机选型与扭矩计算

机械臂采用数字舵机驱动，选型基于负载分析和运动需求：

| 关节位置 | 型号   | 扭矩     | 速度      | 特点             |
| -------- | ------ | -------- | --------- | ---------------- |
| 基座     | MG996R | 15kg·cm  | 0.17s/60° | 金属齿轮，高扭矩 |
| 肩关节   | MG946R | 25kg·cm  | 0.20s/60° | 双轴承，抗冲击   |
| 肘关节   | MG995  | 13kg·cm  | 0.16s/60° | 性价比高         |
| 腕关节   | SG90   | 1.8kg·cm | 0.12s/60° | 轻量化设计       |

**扭矩计算示例（肩关节）**：

```markdown
所需扭矩 = (臂长 × 负载重量) + (关节重量 × 臂长/2)
          = (0.2m × 0.2kg) + (0.15kg × 0.1m)
          = 0.04Nm + 0.015Nm = 0.055Nm ≈ 5.6kg·cm
```

选择25kg·cm舵机提供足够的安全裕度。

## 5.2 抓取机构设计

### 夹持机构力学分析

网球抓取机构采用双指平行夹持设计，具有以下特点：

- **自适应抓取**：弹簧预紧机构使夹爪能适应不同尺寸网球
- **力控制**：通过限位开关实现抓握力控制
- **防滑设计**：夹爪内侧采用硅胶垫增加摩擦力

**力学模型**：

```markdown
抓握力F = k × Δx
其中：
k - 弹簧刚度系数
Δx - 弹簧压缩量
```

通过调整弹簧预压缩量，可以控制抓握力在2-5N范围内，既能牢固抓取网球，又不会造成损坏。

### 物体稳定性控制

为确保网球在移动过程中不脱落，我们采用多阶段抓取策略：

1. **预抓取阶段**：夹爪以较小力度接触网球
2. **稳定抓取**：增加抓握力至安全阈值
3. **提升阶段**：缓慢提升机械臂
4. **运输阶段**：保持恒定抓握力

```python
def grab_tennis_ball():
    # 接近网球
    move_to_position(ball_position)
    
    # 预抓取
    set_gripper_force(2.0)  # 2N抓握力
    close_gripper()
    
    # 稳定抓取
    if gripper_contact_detected():
        set_gripper_force(3.5)  # 增加到3.5N
        time.sleep(0.5)
    
    # 提升
    lift_arm(100)  # 提升10cm
    
    # 运输到收集箱
    move_to_position(collection_box)
    
    # 释放网球
    open_gripper()
```

## 5.3 轨迹规划技术

### 关节空间轨迹规划

关节空间规划直接控制各关节角度，计算简单但路径不可预测：

```python
def joint_space_move(target_angles, duration):
    start_angles = get_current_angles()
    steps = int(duration * 100)  # 100Hz控制频率
    
    for i in range(steps):
        # 线性插值
        ratios = [i/steps for _ in range(4)]
        current_angles = [
            start + ratio * (target - start)
            for start, target, ratio in zip(start_angles, target_angles, ratios)
        ]
        
        set_joint_angles(current_angles)
        time.sleep(0.01)
```

### 笛卡尔空间轨迹规划

笛卡尔空间规划控制末端执行器位置，路径可预测但计算复杂：

```python
def cartesian_space_move(target_pose, duration):
    start_pose = get_current_pose()
    steps = int(duration * 100)
    
    for i in range(steps):
        ratio = i / steps
        # 线性插值位置
        current_position = [
            start + ratio * (target - start)
            for start, target in zip(start_pose[:3], target_pose[:3])
        ]
        
        # 球面线性插值姿态
        current_orientation = slerp(start_pose[3:], target_pose[3:], ratio)
        
        # 逆运动学求解关节角度
        joint_angles = inverse_kinematics(current_position + current_orientation)
        
        set_joint_angles(joint_angles)
        time.sleep(0.01)
```

### 避奇异点策略

机械臂在奇异点附近会出现运动不稳定问题，我们采用以下策略：

1. **速度限制**：接近奇异点时降低运动速度
2. **路径优化**：规划绕过奇异点的路径
3. **关节限位**：设置关节运动范围避开奇异区域

## 5.4 机械臂控制系统集成

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

