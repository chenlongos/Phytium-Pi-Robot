# 2.1 数字图像处理基础

### 什么是数字图像？

数字图像是由像素组成的二维矩阵，每个像素包含颜色信息。在我们的项目中，摄像头捕获的图像是640×480分辨率，即由307,200个像素点组成。

### 像素表示

- **RGB格式**：每个像素由红(Red)、绿(Green)、蓝(Blue)三个分量组成，每个分量取值范围0-255
- **BGR格式**：OpenCV默认使用BGR顺序而非RGB
- **灰度图**：单通道图像，每个像素只有一个亮度值(0-255)

### 项目中的图像获取与处理

在项目中，我们通过摄像头实时捕获图像帧进行处理：

```python
# 在color_detect.py中
def test():
    # 创建颜色检测器实例
    # 参数: lower_hsv - HSV下限阈值, upper_hsv - HSV上限阈值, min_area - 最小识别区域面积
    dector = ColorDetector([30, 70, 80], [50, 255, 255], min_area=300)
    
    # 打开默认摄像头（USB摄像头）
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("无法打开摄像头")
        exit()

    while True:
        # 读取一帧图像
        ret, frame = cap.read()
        
        if not ret:
            print("无法获取帧")
            break
        
        # 垂直翻转图像（根据摄像头安装方向）
        image = cv2.flip(frame, 0)
        
        # 处理当前帧
        processed_frame, mask, data = dector.process(image)
        
        # 显示原始图像和处理结果
        cv2.imshow("Camera Feed", image)
        cv2.imshow("Processed Frame", processed_frame)
        cv2.imshow("Mask", mask)
        
        # 检测按键输入
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    # 释放摄像头资源
    cap.release()
    cv2.destroyAllWindows()
```
