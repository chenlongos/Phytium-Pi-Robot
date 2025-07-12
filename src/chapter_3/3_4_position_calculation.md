# 3.4 位置计算与坐标转换
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

