# 2.4 目标识别核心算法
### 轮廓检测

```python
contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
```

- **原理**：在二值图像中查找连通区域边界
- **RETR_EXTERNAL**：只检测最外层轮廓
- **CHAIN_APPROX_SIMPLE**：压缩轮廓点，减少内存

### 轮廓分析

```python
for cnt in contours:
    area = cv2.contourArea(cnt)
    perimeter = cv2.arcLength(cnt, True)
    circularity = 4 * np.pi * area / (perimeter * perimeter)
```

- **面积过滤**：去除过小或过大的区域
- **圆形度计算**：判断轮廓接近圆形的程度
- **边界框**：获取目标位置和大小

### 位置计算

```python
# 计算网球中心坐标
center_x = x + w // 2
center_y = y + h // 2

# 计算网球在图像中的比例
ratio = (h / image_height) * (w / image_width)
```
