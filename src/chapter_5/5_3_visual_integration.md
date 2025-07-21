# 5.3 与视觉系统集成

### 网球定位

在项目中，通过颜色检测定位网球位置：

```
# mycv/color.py
class ColorDetector:
    def process(self, frame):
        # ...图像处理...
        for cnt in contours:
            # ...轮廓分析...
            if area > self.min_area and area < self.max_area and circularity > 0.8:
                # 计算网球中心位置
                center_x = x + w // 2
                center_y = y + h // 2
                
                # 保存检测结果
                data.append([x, y, w, h])
        
        return processed_frame, mask, data
```

### 位置判断逻辑

在抓取决策中，使用网球在图像中的位置和大小进行判断：

```
# color_detect.py
def test():
    # ...初始化...
    IMGW = 640   # 图像宽度
    IMGH = 480   # 图像高度
    WIDTH_THRESHOLD = 150  # 目标宽度阈值
    EDGE_DEVIATION = 40    # 边缘偏移容差
    
    while True:
        # ...获取检测数据...
        for xywh in data[:1]:
            leftEdge = int(xywh[0])
            rightEdge = IMGW - int(xywh[2]) - int(xywh[0])
            width = int(xywh[2])
            
            # 计算位置偏移
            difference = leftEdge - rightEdge
            
            # 根据位置和大小判断动作
            if difference < -1 * EDGE_DEVIATION:
                cmd = 'turn_right'  # 需要右转
            elif difference > EDGE_DEVIATION:
                cmd = 'turn_left'   # 需要左转
            elif width < WIDTH_THRESHOLD - WIDTH_DEVIATION:
                cmd = 'advance'     # 需要前进
            elif width > WIDTH_THRESHOLD + WIDTH_DEVIATION:
                cmd = 'back'        # 需要后退
            else:
                cmd = 'stop'        # 满足抓取条件
```

