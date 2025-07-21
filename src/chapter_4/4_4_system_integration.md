# 4.4 底盘控制系统集成

### 状态机实现

在项目中使用状态机管理底盘状态：

```python
# car_cv.py - 状态机实现
class CarCV:
    def __init__(self):
        self.lost_count = 20
        self.max_lost_frames = 20
        self.target_found = False
        self.search_direction = 1
        self.search_start_time = 0
    
    def process_data(self, data: List[Calculate], node=None) -> MoveData:
        """处理目标检测数据并生成运动指令"""
        current_time = time.time()
        
        if len(data) == 0:
            return self.handle_target_lost(current_time, node)
        else:
            return self.handle_target_found(
                data[0].x, data[0].y, data[0].ratio, current_time, node
            )
    
    def handle_target_lost(self, current_time, node):
        """处理目标丢失情况"""
        self.lost_count += 1
        self.target_found = False
        
        if self.lost_count >= self.max_lost_frames:
            self.search_start_time = current_time
            # 确定搜索方向
            if self.last_valid_position and self.last_valid_position[0] > 320:  # 屏幕宽度640
                self.search_direction = 1  # 向右搜索
            else:
                self.search_direction = -1  # 向左搜索
            
            search_time = current_time - self.search_start_time
            
            if self.search_direction > 0:
                return turn_left(node)
            else:
                return turn_right(node)
        else:
            return stop(node)
```

### 运动控制接口

```
# car_cv.py - 运动控制接口
from common.move_data import MoveData

def send(node: Node, direction, speed) -> MoveData:
    """发送运动数据"""
    data = MoveData(direction, speed).to_arrow_array()
    if node != None:
        node.send_output("move", data)
    return MoveData(direction, speed)

def stop(node: Node) -> MoveData:
    return send(node, 0, 0)

def advance(node: Node, speed=2) -> MoveData:
    return send(node, 1, speed)

def back(node: Node, speed=2) -> MoveData:
    return send(node, 2, speed)

def turn_left(node: Node, speed=20) -> MoveData:
    return send(node, 5, speed)

def turn_right(node: Node, speed=20) -> MoveData:
    return send(node, 6, speed)
```

### 性能优化技巧

```
# car_cv.py - 性能优化
class CarCV:
    def low_pass_filter(self, new_value, last_value):
        """低通滤波器"""
        alpha = 0.2  # 平滑因子
        return alpha * new_value + (1 - alpha) * last_value
    
    def handle_target_found(self, x, y, ratio, current_time, node):
        """处理发现网球的情况（优化版）"""
        # 应用低通滤波
        x_offset = self.low_pass_filter(x - self.center_x, self.last_x_offset)
        y_offset = self.low_pass_filter(y - self.center_y, self.last_y_offset)
        
        # 更新上一次的值
        self.last_x_offset = x_offset
        self.last_y_offset = y_offset
        
        # 简化计算
        ratio_proportion = ratio / 0.032  # 目标比率值
        
        # 使用查表法替代复杂计算
        speed = self.speed_lookup_table(ratio_proportion)
        
        # ...后续控制逻辑...
    
    def speed_lookup_table(self, ratio):
        """速度查表法优化"""
        if ratio > 0.9:
            return 0
        elif ratio > 0.7:
            return self.min_speed
        elif ratio > 0.5:
            return self.min_speed + 5
        else:
            return self.max_speed
```

### 关键函数总结

| 函数                          | 参数         | 返回值        | 功能描述     | 项目位置       |
| :---------------------------- | :----------- | :------------ | :----------- | :------------- |
| `PCA9685Motor.Control()`      | MoveData对象 | 无            | 控制电机运动 | motor/Motor.py |
| `PCA9685Motor.set_pwm()`      | 四个PWM值    | 无            | 设置电机PWM  | motor/Motor.py |
| `Odometry.update()`           | 左右轮距离   | (x, y, theta) | 更新位姿估计 | motor/main.py  |
| `CarCV.process_data()`        | 目标检测数据 | MoveData      | 生成运动指令 | car_cv.py      |
| `CarCV.handle_target_found()` | 目标位置数据 | MoveData      | 处理发现目标 | car_cv.py      |
| `send()`                      | 方向,速度    | MoveData      | 发送运动指令 | car_cv.py      |
| `low_pass_filter()`           | 新值,旧值    | 滤波后值      | 数据平滑处理 | car_cv.py      |

