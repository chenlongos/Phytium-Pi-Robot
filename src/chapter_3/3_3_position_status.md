# 3.3 位置计算与状态处理

### 中心点计算与偏移量

```
# car_cv.py中的CarCV类
class CarCV:
    def __init__(self):
        # ...
        self.center_x = 278  # 图像中心X
        self.center_y = 298  # 图像中心Y
        self.width = 640     # 图像宽度
        self.height = 480    # 图像高度
        self.alpha = 0.2     # 低通滤波系数
        self.last_x_offset = 0
        self.last_y_offset = 0
        
    def handle_target_found(self, x, y, ratio, current_time):
        # 计算原始偏移
        raw_x_offset = x - self.center_x
        raw_y_offset = y - self.center_y
        
        # 应用低通滤波平滑位置变化
        x_offset = self.low_pass_filter(raw_x_offset, self.last_x_offset)
        y_offset = self.low_pass_filter(raw_y_offset, self.last_y_offset)
        
        # 更新上一次的偏移值
        self.last_x_offset = x_offset
        self.last_y_offset = y_offset
        
        return x_offset, y_offset
```

### 低通滤波实现

低通滤波平滑位置变化：

```
def low_pass_filter(self, new_value, last_value):
    """低通滤波器"""
    return self.alpha * new_value + (1 - self.alpha) * last_value
```



### 目标丢失处理

目标丢失处理逻辑：

```
def handle_target_lost(self, current_time):
    self.lost_count += 1
    self.target_found = False
    
    if self.lost_count >= self.max_lost_frames:
        # 进入搜索模式
        self.search_start_time = current_time
        # 根据最后有效位置确定搜索方向
        if self.last_valid_position and self.last_valid_position[0] > self.width / 2:
            self.search_direction = 1  # 向右搜索
        else:
            self.search_direction = -1  # 向左搜索
            
        print("进入搜索模式，方向：", "右" if self.search_direction > 0 else "左")
        return True  # 需要搜索
        
    return False  # 不需要搜索
```

### 距离估计

根据网球比例估计距离：

```python
# 在car_cv.py中添加距离估计
def estimate_distance(size_ratio, reference_size=0.05):
    """
    估计网球到摄像头的距离
    参数:
        size_ratio: 网球在图像中的比例
        reference_size: 网球大小参考值
    返回值: 估计距离（米）
    """
    # 经验公式：距离 ∝ 1 / √(图像比例)
    if size_ratio > 0:
        # 参考距离计算：当网球在图像中比例为reference_size时，距离为1米
        distance = 1.0 / math.sqrt(size_ratio / reference_size)
        return distance
    return 0
```

### 坐标转换到机器人坐标系

实现图像坐标到机器人坐标的转换：

```python
# 在car_cv.py中添加坐标转换
def image_to_car_coordinates(image_x, image_y, distance, image_width, image_height, fov=60):
    """
    将图像坐标转换为机器人坐标系
    参数:
        image_x: 图像x坐标
        image_y: 图像y坐标
        distance: 估计距离（米）
        image_width: 图像宽度
        image_height: 图像高度
        fov: 摄像头视野角度（度）
    返回值: (car_x, car_y) - 机器人坐标系中的位置
    """
    # 计算焦距（像素）
    focal_length = image_width / (2 * math.tan(math.radians(fov / 2)))
    
    # 计算中心偏移（米）
    center_x = image_width / 2
    center_y = image_height / 2
    
    # 转换为机器人坐标系
    car_x = (image_x - center_x) * distance / focal_length
    car_y = (image_y - center_y) * distance / focal_length
    
    return car_x, car_y
```
