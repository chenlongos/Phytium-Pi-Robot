# 2.4 目标识别核心算法

### 轮廓检测

项目中通过轮廓检测识别网球：

```python
contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
```

- **函数**: `cv2.findContours(image, mode, method)`
- 参数:
  - `image`: 输入二值图像
  - `mode`: 轮廓检索模式（`cv2.RETR_EXTERNAL`只检测最外层轮廓）
  - `method`: 轮廓近似方法（`cv2.CHAIN_APPROX_SIMPLE`压缩轮廓点）
- 返回值:
  - `contours`: 检测到的轮廓列表
  - `hierarchy`: 轮廓层次信息

### 轮廓分析

分析轮廓特征以识别网球：

```python
# 计算关键特征
area = cv2.contourArea(cnt)
perimeter = cv2.arcLength(cnt, True)
circularity = 4 * np.pi * area / (perimeter * perimeter) if perimeter > 0 else 0
x, y, w, h = cv2.boundingRect(cnt)

# 过滤非网球区域
if area > self.min_area and area < self.max_area and circularity > 0.8:
    # 识别为网球
```

- **面积范围**：300-10000像素过滤小噪点和大面积区域
- **圆形度阈值**：>0.8确保接近圆形

### 位置计算

计算网球位置和比例：

```python
center_x = x + w // 2
center_y = y + h // 2
ratio = (h / frame.shape[0]) * (w / frame.shape[1])
```

- 逻辑:
  - 中心坐标 = 边界矩形左上角坐标 + 宽度/高度的一半
  - 比例 = (高度/图像高度) × (宽度/图像宽度)
- 应用:
  - 中心坐标用于定位网球位置
  - 比例用于估计网球距离和大小

## 关键函数总结表

| 函数                 | 参数                | 返回值                | 功能描述         | 项目应用位置    |
| -------------------- | ------------------- | --------------------- | ---------------- | --------------- |
| `cv2.VideoCapture()` | index               | VideoCapture对象      | 打开摄像头       | color_detect.py |
| `cap.read()`         | 无                  | (ret, frame)          | 读取一帧图像     | color_detect.py |
| `cv2.cvtColor()`     | src, code           | 转换后图像            | 颜色空间转换     | mycv/color.py   |
| `cv2.inRange()`      | src, lowerb, upperb | 二值掩膜              | 创建颜色掩膜     | mycv/color.py   |
| `cv2.GaussianBlur()` | src, ksize, sigmaX  | 模糊后图像            | 高斯模糊降噪     | mycv/color.py   |
| `cv2.findContours()` | image, mode, method | (contours, hierarchy) | 检测图像轮廓     | mycv/color.py   |
| `cv2.contourArea()`  | contour             | 面积值                | 计算轮廓面积     | mycv/color.py   |
| `cv2.boundingRect()` | points              | (x,y,w,h)             | 获取轮廓边界矩形 | mycv/color.py   |
| `cv2.morphologyEx()` | src, op, kernel     | 处理后的图像          | 形态学操作       | mycv/color.py   |
| `cv2.imshow()`       | winname, mat        | 无                    | 显示图像         | color_detect.py |

