# 7.4 系统性能优化

### 资源监控工具

项目中实现资源监控功能：

```python
# 在control.py中添加资源监控
@app.route('/api/system_status')
def system_status():
    import psutil
    cpu_percent = psutil.cpu_percent()
    memory = psutil.virtual_memory()
    return jsonify({
        "cpu": cpu_percent,
        "memory": memory.percent,
        "memory_used": memory.used // (1024 * 1024),  # MB
        "memory_total": memory.total // (1024 * 1024)  # MB
    })
```

### 关键路径优化

识别并优化关键路径：

```python
# mycv/color.py中的性能优化
class ColorDetector:
    def process(self, frame):
        # 1. 降低分辨率
        small_frame = cv2.resize(frame, (320, 240))
        
        # 2. 限定处理区域 (ROI)
        h, w = small_frame.shape[:2]
        roi = small_frame[h//4:3*h//4, w//4:3*w//4]
        
        # 3. 简化处理流程
        hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
        mask = cv2.inRange(hsv, self.lower, self.upper)
        
        # 4. 优化形态学操作
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
        
        # 5. 快速轮廓查找
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # 后续处理...
```

### 实时性提升策略

在项目中，实现实时性保障措施：

```python
# color_detect.py中的实时性优化
def test():
    # 设置进程优先级
    os.nice(-10)  # 提高进程优先级
    
    # 主循环
    while True:
        start_time = time.time()
        
        # 处理帧
        # ...
        
        # 控制处理频率
        elapsed = time.time() - start_time
        if elapsed < 0.05:  # 20fps
            time.sleep(0.05 - elapsed)
```

### 关键函数总结表

| 函数                           | 参数       | 返回值                  | 功能描述       | 项目位置            |
| :----------------------------- | :--------- | :---------------------- | :------------- | :------------------ |
| `CarCV.process_data()`         | data, node | MoveData                | 状态机决策     | car_cv.py           |
| `MoveData.to_arrow_array()`    | 无         | pa.Array                | 序列化运动指令 | common/move_data.py |
| `SerialManager.send_command()` | command    | 无                      | 安全串口通信   | color_detect.py     |
| `setup_logger()`               | 无         | logger                  | 日志系统初始化 | color_detect.py     |
| `generate_frames()`            | 无         | 生成器                  | 视频流生成     | control.py          |
| `ColorDetector.process()`      | frame      | (processed, mask, data) | 优化网球检测   | mycv/color.py       |
| `system_status()`              | 无         | JSON                    | 系统资源监控   | control.py          |

