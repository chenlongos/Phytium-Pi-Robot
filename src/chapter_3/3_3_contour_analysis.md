# 3.3 轮廓分析与特征提取
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

