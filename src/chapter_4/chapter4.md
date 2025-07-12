# 第四章 小车运动控制
## 4.1 底盘控制原理

### 差速转向模型

差速转向是轮式移动机器人最基础也是最常用的运动控制方式。在本项目中，我们采用四轮底盘结构，其中两个主动轮分别位于左右两侧。这种设计的核心原理在于通过控制左右轮的速度差来实现转向：当左右轮以相同速度转动时，小车直线前进；当左右轮速度不同时，小车会向速度较慢的一侧转向。

**运动学方程**：

```markdown
v = (v_left + v_right)/2  // 线速度
ω = (v_right - v_left)/L // 角速度
```

其中L为轮距（左右轮中心距离）。通过精确控制v_left和v_right，我们可以实现小车的任意轨迹运动。

### 坐标变换与位姿估计

小车在运动过程中需要实时估计自身位置和姿态（位姿）。我们采用基于编码器的航迹推算法（Odometry）：

```python
# 编码器计数转换为位移
left_distance = left_encoder_counts * encoder_resolution
right_distance = right_encoder_counts * encoder_resolution

# 计算位姿变化
delta_distance = (left_distance + right_distance) / 2
delta_theta = (right_distance - left_distance) / wheel_base

# 更新位姿
x += delta_distance * cos(theta + delta_theta/2)
y += delta_distance * sin(theta + delta_theta/2)
theta += delta_theta
```

这种方法虽然存在累积误差，但在短距离运动中精度足够，且计算量小，适合嵌入式平台。

## 4.2 驱动电路设计

### H桥驱动原理

H桥电路是直流电机控制的核心，它由四个开关元件（MOSFET或晶体管）组成H形结构：

```markdown
   Vcc
    |
 Q1   Q3
  |   |
  M - M  ← 电机
  |   |
 Q2   Q4
    |
   GND
```

通过控制四个开关的状态，可以实现电机的正反转和制动：

- Q1、Q4导通：电机正转
- Q2、Q3导通：电机反转
- Q1、Q3导通：电机制动
- Q2、Q4导通：电机制动

### L298N驱动模块应用

本项目采用广泛使用的L298N双H桥驱动模块：

```python
# 引脚定义
IN1 = 11  # 控制电机A方向
IN2 = 13  # 控制电机A方向
IN3 = 15  # 控制电机B方向
IN4 = 16  # 控制电机B方向
ENA = 12  # 电机A使能/PWM
ENB = 14  # 电机B使能/PWM

# 前进控制
GPIO.output(IN1, GPIO.HIGH)
GPIO.output(IN2, GPIO.LOW)
GPIO.output(IN3, GPIO.HIGH)
GPIO.output(IN4, GPIO.LOW)
pwmA.ChangeDutyCycle(speed)  # 设置PWM占空比控制速度
pwmB.ChangeDutyCycle(speed)
```

### 保护电路设计

为确保系统安全，我们实现了多重保护机制：

1. **过流保护**：在电源输入端串联自恢复保险丝
2. **电压监测**：实时检测电池电压，低于阈值时自动停止
3. **温度保护**：驱动芯片温度超过85℃时降低输出功率
4. **软件保护**：在代码中添加互锁逻辑，防止同侧上下管同时导通

## 4.3 运动控制算法

### PID控制器实现

PID（比例-积分-微分）控制器是工业控制中最常用的算法：

```python
class PIDController:
    def __init__(self, Kp, Ki, Kd, setpoint):
        self.Kp = Kp
        self.Ki = Ki
        self.Kd = Kd
        self.setpoint = setpoint
        self.prev_error = 0
        self.integral = 0
        
    def compute(self, measured_value):
        error = self.setpoint - measured_value
        self.integral += error
        derivative = error - self.prev_error
        output = self.Kp * error + self.Ki * self.integral + self.Kd * derivative
        self.prev_error = error
        return output
```

### 双闭环控制系统

我们采用速度环+位置环的双闭环控制结构：

```markdown
位置指令 → 位置PID → 速度指令 → 速度PID → 电机驱动
      ↑位置反馈          ↑速度反馈
```

- **位置环**：控制小车到达目标位置
- **速度环**：控制电机达到指定转速

### 轨迹跟踪算法

对于网球捡拾任务，我们实现了简单的轨迹跟踪：

```python
def follow_trajectory(current_pos, target_pos):
    # 计算位置偏差
    dx = target_pos[0] - current_pos[0]
    dy = target_pos[1] - current_pos[1]
    
    # 计算目标方向
    target_angle = atan2(dy, dx)
    
    # 角度偏差
    angle_error = target_angle - current_pos[2]
    
    # 距离目标距离
    distance = sqrt(dx*dx + dy*dy)
    
    # 双PID控制
    angle_output = angle_pid.compute(angle_error)
    speed_output = speed_pid.compute(distance)
    
    # 转换为左右轮速
    left_speed = speed_output - angle_output
    right_speed = speed_output + angle_output
    
    return left_speed, right_speed
```

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

