# 3.4 视觉处理流程优化

### 多级过滤策略

项目中采用的多级过滤策略：

1. **面积过滤**：300 < area < 10000 像素
2. **圆形度过滤**：circularity > 0.8
3. **位置稳定性过滤**：低通滤波平滑位置变化
4. **比例一致性检查**：连续多帧检测结果一致

### 实时性能优化

项目中使用的性能优化技术：

```
# 减少图像处理分辨率
frame = cv2.resize(frame, (320, 240))  # 降低分辨率提高处理速度

# 限制处理区域
roi = frame[100:400, 100:500]  # 只处理感兴趣区域

# 使用轻量级处理操作
# 如使用简单阈值代替复杂分割算法
```

### 错误处理与鲁棒性

项目中增强鲁棒性的措施：

```
try:
    # 图像处理代码
    processed_frame, mask, data = dector.process(image)
except Exception as e:
    print(f"图像处理错误: {e}")
    # 使用上一帧结果或默认值
    data = self.last_valid_data
    
# 检查数据有效性
if not data or len(data) == 0:
    # 处理目标丢失情况
    self.handle_target_lost(current_time)
```

## 关键函数应用总结

| 功能         | 函数                         | 参数说明                                          | 返回值       | 项目位置      |
| ------------ | ---------------------------- | ------------------------------------------------- | ------------ | ------------- |
| HSV阈值分割  | `cv2.inRange()`              | src: HSV图像, lowerb: 下界, upperb: 上界          | 二值掩膜     | mycv/color.py |
| 形态学开运算 | `cv2.morphologyEx()`         | src: 输入图像, op: 操作类型, kernel: 结构元素     | 处理后的图像 | mycv/color.py |
| 轮廓检测     | `cv2.findContours()`         | image: 二值图像, mode: 检索模式, method: 近似方法 | 轮廓列表     | mycv/color.py |
| 轮廓面积     | `cv2.contourArea()`          | contour: 轮廓点集                                 | 面积值       | mycv/color.py |
| 边界矩形     | `cv2.boundingRect()`         | points: 轮廓点集                                  | (x,y,w,h)    | mycv/color.py |
| 坐标转换     | `image_to_car_coordinates()` | image_x/y: 图像坐标, distance: 距离               | 机器人坐标   | car_cv.py     |
| 距离估计     | `estimate_distance()`        | size_ratio: 网球比例                              | 估计距离     | car_cv.py     |

