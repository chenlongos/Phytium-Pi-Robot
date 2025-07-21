# 5.2 抓取机构设计

### 串口控制协议

机械臂通过串口指令控制：

```
# color_detect.py
def execute_cmd(cmd):
    global ser
    # ...其他命令处理...
    elif cmd == 'catch':  # 抓取指令
        global cap
        motors.Stop()  # 停止底盘运动
        cap.release()  # 释放摄像头资源
        ser.write(b'@u \n')  # 发送上升指令
        time.sleep(6)   # 等待上升完成
        ser.write(b'@d \n')  # 发送下降指令
        time.sleep(8)   # 等待下降完成
        cap = cv2.VideoCapture(0)  # 重新打开摄像头
```

### 夹持机构力学分析

{夹爪图片.jpg}

在项目中，夹爪采用双指平行夹持设计，具有以下特点：

- **自适应抓取**：弹簧预紧机构使夹爪能适应不同尺寸网球
- **力控制**：通过限位开关实现抓握力控制
- **防滑设计**：夹爪内侧采用硅胶垫增加摩擦力

**力学模型**：

```markdown
抓握力F = k × Δx
其中：
k - 弹簧刚度系数
Δx - 弹簧压缩量
```

抓取动作在`test()`函数中实现：

```python
抓取动作序列
抓取动作在test()函数中实现：

python
# color_detect.py
def test():
    # ...初始化代码...
    ball_count = 0
    times_count = 0
    WIDTH_THRESHOLD = 150  # 抓取触发宽度阈值
    WIDTH_DEVIATION = 10   # 宽度容差
    
    while True:
        # ...图像处理...
        for xywh in data[:1]:  # 只处理第一个检测到的网球
            width = int(xywh[2])
            
            # 判断是否满足抓取条件
            if abs(width - WIDTH_THRESHOLD) <= WIDTH_DEVIATION:
                ball_count += 1
                if times_count == 0:
                    times_count = 1
        
        # 当满足条件次数达到阈值时触发抓取
        if times_count > 0:
            times_count += 1
            if times_count >= 100:  # 100帧计数
                if ball_count >= 70:  # 70%以上帧数满足条件
                    execute_cmd('catch')  # 执行抓取
                # 重置计数器
                ball_count = 0
                times_count = 0
```

