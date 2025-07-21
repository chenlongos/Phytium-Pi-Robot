# 3.2 轮廓分析与特征提取

### 轮廓检测实现

项目中通过轮廓检测识别网球区域：

```python
# mycv/color.py中的process方法
contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# 函数详解:
# cv2.findContours(image, mode, method) - 查找图像中的轮廓
# 参数:
#   image: 输入二值图像
#   mode: 轮廓检索模式（cv2.RETR_EXTERNAL只检测最外层轮廓）
#   method: 轮廓近似方法（cv2.CHAIN_APPROX_SIMPLE压缩轮廓点）
# 返回值:
#   contours: 检测到的轮廓列表
#   hierarchy: 轮廓层次信息（本项目未使用）
```

### 关键特征提取

项目中分析轮廓特征以识别网球：

```python
# mycv/color.py中的process方法
for cnt in contours:
    # 计算轮廓面积
    # cv2.contourArea(contour) - 计算轮廓面积
    # 参数: contour - 轮廓点集
    # 返回值: 轮廓面积（像素数）
    area = cv2.contourArea(cnt)
    
    # 计算轮廓周长
    # cv2.arcLength(curve, closed) - 计算轮廓周长
    # 参数:
    #   curve: 轮廓点集
    #   closed: 轮廓是否闭合
    # 返回值: 轮廓周长
    perimeter = cv2.arcLength(cnt, True)
    
    # 计算圆形度（圆度）
    # 公式: circularity = 4π * area / perimeter²
    # 完美圆形值为1，值越小越不规则
    if perimeter > 0:  # 避免除以零
        circularity = 4 * np.pi * area / (perimeter * perimeter)
    else:
        circularity = 0
    
    # 获取边界矩形
    # cv2.boundingRect(points) - 计算轮廓的边界矩形
    # 参数: points - 轮廓点集
    # 返回值: (x, y, w, h) - 矩形左上角坐标和宽高
    x, y, w, h = cv2.boundingRect(cnt)
    
    # 计算长宽比
    aspect_ratio = w / float(h)
```

### 网球识别条件

项目中设置过滤条件识别网球：

```python
# mycv/color.py中的process方法
# 过滤条件：面积、圆形度和长宽比
if (area > self.min_area and 
    area < self.max_area and 
    circularity > 0.8 and 
    0.8 < aspect_ratio < 1.2):
    # 识别为网球
    center_x = x + w // 2
    center_y = y + h // 2
    ratio = (h / frame.shape[0]) * (w / frame.shape[1])
    
    # 添加到检测结果
    data.append(Calculate(center_x, center_y, ratio))
```

