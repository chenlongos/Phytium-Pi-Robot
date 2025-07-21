# 3.1 颜色阈值分割实战

### HSV阈值分割原理

在项目中，颜色阈值分割是网球识别的核心步骤，通过定义HSV空间中的上下限阈值来提取网球区域：

```python
# mycv/color.py 中的ColorDetector类
class ColorDetector:
    def __init__(self, lower_hsv, upper_hsv, min_area=300, max_area=10000):
        """
        初始化颜色检测器
        参数:
            lower_hsv: HSV下限阈值 [H_min, S_min, V_min]
            upper_hsv: HSV上限阈值 [H_max, S_max, V_max]
            min_area: 最小识别区域面积
            max_area: 最大识别区域面积
        """
        # 将阈值转换为NumPy数组
        self.lower = np.array(lower_hsv)
        self.upper = np.array(upper_hsv)
        self.min_area = min_area
        self.max_area = max_area
        self.h = 480  # 图像高度
        self.w = 640  # 图像宽度
        
    def process(self, frame):
        # 预处理 - 高斯模糊减少噪声
        blurred_img = cv2.GaussianBlur(frame, (5, 5), 0)
        
        # 中值滤波进一步减少噪声
        median_blur = cv2.medianBlur(blurred_img, 5)
        
        # 转换为HSV颜色空间
        hsv = cv2.cvtColor(median_blur, cv2.COLOR_BGR2HSV)
        
        # 创建颜色掩膜
        mask = cv2.inRange(hsv, self.lower, self.upper)
        
        # 形态学操作（消除噪声）
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=3)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=2)
        mask = cv2.GaussianBlur(mask, (5, 5), 0)
        
        # 查找轮廓
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        data = []
        processed_frame = frame.copy()
        
        # 处理每个轮廓
        for cnt in contours:
            x, y, w, h = cv2.boundingRect(cnt)
            area = cv2.contourArea(cnt)
            perimeter = cv2.arcLength(cnt, True)
            if perimeter == 0:
                continue
            circularity = 4 * np.pi * area / (perimeter * perimeter)
            
            # 网球识别条件
            if (area > self.min_area and 
                area < self.max_area and 
                circularity > 0.8):
                
                center_x = x + w // 2
                center_y = y + h // 2
                ratio = (h / self.h) * (w / self.w)
                
                # 绘制识别结果
                cv2.rectangle(processed_frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                cv2.circle(processed_frame, (center_x, center_y), 5, (0, 0, 255), -1)
                data.append([center_x, center_y, ratio])
                
        return processed_frame, mask, data
```

### 参数调整技巧

我们使用以下HSV阈值范围识别网球：

```python
# color_detect.py中的测试代码
dector = ColorDetector([30, 70, 80], [50, 255, 255], min_area=300)
```

- **色调(H)**：30-50对应黄绿色范围（网球典型颜色）
- **饱和度(S)**：70以上确保颜色足够鲜艳（过滤灰暗背景）
- **明度(V)**：80以上避免过暗区域（排除阴影）

### 光照变化

通过以下方式应对光照变化：

```python
# mycv/color.py中的预处理流程
blurred_img = cv2.GaussianBlur(frame, (5, 5), 0)  # 高斯模糊
median_blur = cv2.medianBlur(blurred_img, 5)      # 中值滤波
hsv = cv2.cvtColor(median_blur, cv2.COLOR_BGR2HSV) # 转HSV空间
```


