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

