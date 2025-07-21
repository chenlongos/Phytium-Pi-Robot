# 4.3 运动控制算法

### PID控制器实现

PID（比例-积分-微分）控制器是工业控制中最常用的算法，PID控制器用于精确控制：

```python
# car_cv.py - PID控制器
from simple_pid import PID

class CarCV:
    def __init__(self):
        # 添加PID控制器
        self.pid_distance = PID(Kp=1.0, Ki=0.1, Kd=0.05, setpoint=1)
        self.pid_distance.output_limits = (1.0, 5.0)  # 限制输出范围
        
        # 速度平滑参数
        self.current_speed = 0.0
        self.max_acceleration = 0.5  # 最大加速度
        self.max_speed = 25  # 最大速度
        self.min_speed = 6   # 最小速度
    
    def handle_target_found(self, x, y, ratio, current_time, node):
        """处理发现网球的情况"""
        # 使用PID控制器计算速度
        if ratio_proportion < 0.6:  # 目标比率阈值
            # 使用PID控制器计算速度调整量
            pid_output = self.pid_distance(ratio_proportion)
            # 使用非线性映射
            speed_factor = ((0.6 - ratio_proportion) / 0.6) ** 0.7
            # 基础速度 + 非线性调整的速度
            speed = self.min_speed + (self.max_speed - self.min_speed) * speed_factor * pid_output
            
            # 应用速度平滑处理
            time_delta = current_time - self.last_speed_update_time
            self.last_speed_update_time = current_time
            
            # 限制速度变化率
            max_speed_change = self.max_acceleration * time_delta
            speed_diff = speed - self.current_speed
            if abs(speed_diff) > max_speed_change:
                speed = self.current_speed + max_speed_change * (1 if speed_diff > 0 else -1)
            
            self.current_speed = speed
        
        # 确保速度在合理范围内
        speed = max(self.min_speed, min(speed, self.max_speed))
        
        # 根据位置偏移控制移动
        if abs(x_offset) > 50:  # 水平偏移较大
            if x_offset > 0:
                return turn_left(node, 8)  # 左转
            else:
                return turn_right(node, 8) # 右转
        elif ratio_proportion > 0.95:  # 非常接近目标
            return stop(node)  # 停止
        elif y_offset > 10:  # 目标在下方
            return back(node, int(speed))
        elif y_offset < -10:  # 目标在上方
            return advance(node, int(speed))
        else:
            return stop(node)
```


