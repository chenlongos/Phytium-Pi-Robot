# 第三章 网球检测系统实现
## 3.1 颜色阈值分割实战

### HSV阈值分割原理

颜色阈值分割是网球识别的核心步骤，通过定义HSV空间中的上下限阈值，提取网球区域：

```python
# 网球HSV阈值范围
lower_tennis = np.array([30, 70, 80])   # 最低H,S,V值
upper_tennis = np.array([50, 255, 255]) # 最高H,S,V值

# 创建颜色掩膜
mask = cv2.inRange(hsv_image, lower_tennis, upper_tennis)
```

### 参数调整技巧

1. **色调(H)**：30-50对应黄绿色范围
2. **饱和度(S)**：70以上确保颜色足够鲜艳
3. **明度(V)**：80以上避免过暗区域

### 实际应用中的挑战

- 光照变化：晴天和阴天需要不同阈值
- 场地反光：可能导致误识别
- 阴影影响：降低明度阈值可减少阴影影响

### 自适应阈值方法

```python
# 动态调整阈值
def adjust_thresholds(light_level):
    if light_level < 50:  # 低光照环境
        return np.array([25, 60, 60]), np.array([55, 255, 200])
    else:  # 正常光照
        return np.array([30, 70, 80]), np.array([50, 255, 255])
```

## 3.2 形态学处理技术应用

### 开闭运算组合

```python
# 开运算去除小噪点
mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
# 闭运算填充小孔洞
mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
```

### 结构元素选择

```python
# 椭圆结构元素更适合圆形目标
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
```

### 迭代次数优化

```python
# 多次迭代增强效果
mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=2)
mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=3)
```

### 形态学处理效果

1. **开运算**：消除小噪点，分离粘连物体
2. **闭运算**：填充内部空洞，平滑边界
3. **组合使用**：得到更完整的网球区域

## 3.3 轮廓分析与特征提取

### 轮廓检测实现

```python
contours, _ = cv2.findContours(
    mask, 
    cv2.RETR_EXTERNAL,  # 只检测最外层轮廓
    cv2.CHAIN_APPROX_SIMPLE  # 压缩水平、垂直和对角线段
)
```

### 关键特征提取

```python
for cnt in contours:
    # 计算轮廓面积
    area = cv2.contourArea(cnt)
    
    # 计算轮廓周长
    perimeter = cv2.arcLength(cnt, True)
    
    # 计算圆形度（1表示完美圆形）
    circularity = 4 * np.pi * area / (perimeter * perimeter)
    
    # 获取边界矩形
    x, y, w, h = cv2.boundingRect(cnt)
    
    # 计算长宽比
    aspect_ratio = w / float(h)
```

### 网球识别条件

```python
if (area > min_area and area < max_area and 
    circularity > 0.8 and 
    0.8 < aspect_ratio < 1.2):
    # 识别为网球
```

## 3.4 位置计算与坐标转换

### 中心点计算

```python
center_x = x + w // 2
center_y = y + h // 2
```

### 相对位置计算

```python
# 计算与图像中心的偏移
offset_x = center_x - image_center_x
offset_y = center_y - image_center_y

# 标准化偏移量
normalized_x = offset_x / (image_width / 2)
normalized_y = offset_y / (image_height / 2)
```

### 尺寸比例计算

```python
# 网球在图像中的比例
size_ratio = (w * h) / (image_width * image_height)

# 距离估计（经验公式）
distance = 1.0 / (size_ratio ** 0.5)
```

### 坐标转换到小车坐标系

```python
# 假设摄像头安装高度为H，俯仰角为θ
def image_to_world(x, y, size_ratio):
    # 计算深度
    Z = H / (size_ratio * math.tan(math.radians(θ)))
    
    # 计算世界坐标
    world_x = (x - image_center_x) * Z / focal_length
    world_y = (y - image_center_y) * Z / focal_length
    
    return world_x, world_y, Z
```

