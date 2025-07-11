# 第二章 视觉处理基础理论
## 2.1 数字图像处理基础

### 什么是数字图像？

数字图像是由像素组成的二维矩阵，每个像素包含颜色信息。在我们的项目中，摄像头捕获的图像是640×480分辨率，即由307,200个像素点组成。

### 像素表示

- **RGB格式**：每个像素由红(Red)、绿(Green)、蓝(Blue)三个分量组成，每个分量取值范围0-255
- **BGR格式**：OpenCV默认使用BGR顺序而非RGB
- **灰度图**：单通道图像，每个像素只有一个亮度值(0-255)

### 图像处理基本操作

```python
# 读取图像
image = cv2.imread("image.jpg")

# 转换为灰度图
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# 调整大小
resized = cv2.resize(image, (320, 240))

# 旋转图像
rotated = cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)
```

## 2.2 色彩空间与HSV原理

### RGB的局限性

RGB色彩空间对光照变化敏感，在网球识别中表现不佳。因此我们使用HSV色彩空间。

### HSV色彩空间

- **Hue(色调)**：颜色类型，0-180°（在OpenCV中）
- **Saturation(饱和度)**：颜色纯度，0-255
- **Value(明度)**：颜色亮度，0-255

HSV空间更接近人类对颜色的感知，对光照变化不敏感。

### 为什么选择HSV识别网球？

1. 色调(H)可以稳定表示网球颜色
2. 饱和度(S)帮助区分鲜艳的网球和背景
3. 明度(V)可以过滤过暗或过亮的区域

### HSV阈值设置

```python
# 网球HSV阈值范围
lower_tennis = np.array([30, 70, 80])   # 最低H,S,V值
upper_tennis = np.array([50, 255, 255]) # 最高H,S,V值

# 创建颜色掩膜
mask = cv2.inRange(hsv_image, lower_tennis, upper_tennis)
```

## 2.3 图像预处理技术详解

### 高斯模糊降噪

```python
blurred = cv2.GaussianBlur(image, (5, 5), 0)
```

- **原理**：使用高斯函数计算邻域像素的加权平均值
- **作用**：减少图像噪声，平滑细节
- **参数说明**：(5,5)是核大小，0是标准差(自动计算)

### 中值滤波

```python
median = cv2.medianBlur(image, 5)
```

- **原理**：取邻域像素的中值作为中心像素值
- **作用**：有效去除椒盐噪声
- **与高斯模糊区别**：更擅长处理脉冲噪声，但计算量更大

### 形态学操作

```python
kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
opened = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
```

- **开运算**：先腐蚀后膨胀，去除小噪点
- **闭运算**：先膨胀后腐蚀，填充小孔洞
- **结构元素**：定义操作形状和大小的核

## 2.4 目标识别核心算法

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

