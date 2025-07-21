## 5.4 系统保护机制

### 超时保护

在抓取过程中添加超时保护：

```
# color_detect.py
def execute_cmd(cmd):
    # ...其他命令...
    elif cmd == 'catch':
        start_time = time.time()
        timeout = 20  # 20秒超时
        
        # 执行抓取动作
        motors.Stop()
        cap.release()
        ser.write(b'@u \n')
        
        # 等待上升完成，带超时检测
        while time.time() - start_time < 6:
            if time.time() - start_time > timeout:
                break
            time.sleep(0.1)
        
        # ...下降动作类似...
```

### 异常处理

添加串口通信异常处理：

```
# color_detect.py
def execute_cmd(cmd):
    global ser
    try:
        if cmd == 'catch':
            # ...抓取动作...
        # ...其他命令...
    except serial.SerialException as e:
        print(f"串口通信错误: {e}")
        # 尝试重新初始化串口
        try:
            ser = serial.Serial('/dev/ttyAMA2', 9600)
            print("串口重新初始化成功")
        except:
            print("串口重新初始化失败")
```

### 关键函数总结

| 函数                       | 参数       | 返回值         | 功能描述       | 项目位置        |
| :------------------------- | :--------- | :------------- | :------------- | :-------------- |
| `PCA9685Motor.set_servo()` | 通道, 角度 | 无             | 设置舵机角度   | motor/Motor.py  |
| `execute_cmd()`            | 命令字符串 | 无             | 执行机械臂命令 | color_detect.py |
| `ColorDetector.process()`  | 图像帧     | 处理后的帧数据 | 检测网球位置   | mycv/color.py   |
| `test()`                   | 无         | 无             | 主循环控制逻辑 | color_detect.py |
| `PCA9685Motor.set_pwm()`   | 四个PWM值  | 无             | 设置电机PWM    | motor/Motor.py  |

