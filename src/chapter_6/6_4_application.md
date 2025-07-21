# 6.4 框架应用实践

### 节点开发规范

在项目中节点开发遵循统一接口：

```python
# mycv/color.py中的节点实现
class ColorDetector:
    def __init__(self, lower_hsv, upper_hsv, min_area=300):
        self.lower = np.array(lower_hsv)
        self.upper = np.array(upper_hsv)
        self.min_area = min_area

    def process(self, frame):
        # 图像处理逻辑
        return processed_frame, mask, data

def main():
    node = Node()
    dector = ColorDetector([30, 70, 80], [50, 255, 255], min_area=50)
    
    for event in node:
        if event["type"] == "INPUT" and event["id"] == "image":
            image = process_image(event["value"], event["metadata"])
            processed_frame, mask, data = dector.process(image)
            node.send_output("image", pa.array(processed_frame.ravel()), event["metadata"])
            node.send_output("mask", pa.array(mask.ravel()), event["metadata"])
            node.send_output("data", Calculate.to_pa_array(data))
```

### 数据流拓扑构建

在项目中，使用YAML定义数据流拓扑：

```yaml
# car_cv.yaml中的拓扑
nodes:
  - id: opencv-video-capture
    inputs: [tick]
    outputs: [image]
    
  - id: color
    inputs: [image]
    outputs: [image, data, mask]
    
  - id: car_cv
    inputs: [data]
    outputs: [task, move]
    
  - id: motor
    inputs: [move]
    outputs: []
```

### 性能优化技巧

在项目中，使用多种优化技术提升性能：

```python
# car_cv.py中的性能优化
class CarCV:
    def handle_target_found(self, x, y, ratio, current_time, node):
        # 低通滤波器平滑数据
        x_offset = self.low_pass_filter(x - self.center_x, self.last_x_offset)
        y_offset = self.low_pass_filter(y - self.center_y, self.last_y_offset)
        
        # PID控制器优化速度
        speed = self.pid_distance.compute(target_ratio, current_ratio, dt)
        
        # 限制速度变化率
        max_speed_change = self.max_acceleration * time_delta
        speed = self.current_speed + max_speed_change * sign
        
        # 确保速度在合理范围内
        speed = max(self.min_speed, min(speed, self.max_speed))
```

## 关键函数总结表

| 函数                        | 参数                              | 返回值                        | 功能描述         | 项目位置            |
| :-------------------------- | :-------------------------------- | :---------------------------- | :--------------- | :------------------ |
| `ColorDetector.process()`   | frame: ndarray                    | (processed_frame, mask, data) | 网球检测处理     | mycv/color.py       |
| `CarCV.process_data()`      | data: List[Calculate], node: Node | MoveData                      | 决策生成运动指令 | car_cv.py           |
| `ModbusMotor.Control()`     | data: MoveData                    | None                          | 电机控制         | motor/Motor.py      |
| `MoveData.to_arrow_array()` | 无                                | pa.Array                      | 序列化运动数据   | common/move_data.py |
| `Calculate.from_pa_array()` | pa_array: pa.Array                | List[Calculate]               | 反序列化检测数据 | common/calculate.py |
| `translate_image()`         | data, metadata                    | ndarray                       | 零拷贝图像处理   | untils/untils.py    |



