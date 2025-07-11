# 2.1 数字图像处理基础
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
