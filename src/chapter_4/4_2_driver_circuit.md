# 4.2 驱动电路设计

### H桥驱动原理

H桥电路是直流电机控制的核心，它由四个开关元件（MOSFET或晶体管）组成H形结构：

```markdown
   Vcc
    |
 Q1   Q3
  |   |
  M - M  ← 电机
  |   |
 Q2   Q4
    |
   GND
```

通过控制四个开关的状态，可以实现电机的正反转和制动：

- Q1、Q4导通：电机正转
- Q2、Q3导通：电机反转
- Q1、Q3导通：电机制动
- Q2、Q4导通：电机制动

### L298N驱动模块应用

本项目采用广泛使用的L298N双H桥驱动模块：

```python
# 引脚定义
IN1 = 11  # 控制电机A方向
IN2 = 13  # 控制电机A方向
IN3 = 15  # 控制电机B方向
IN4 = 16  # 控制电机B方向
ENA = 12  # 电机A使能/PWM
ENB = 14  # 电机B使能/PWM

# 前进控制
GPIO.output(IN1, GPIO.HIGH)
GPIO.output(IN2, GPIO.LOW)
GPIO.output(IN3, GPIO.HIGH)
GPIO.output(IN4, GPIO.LOW)
pwmA.ChangeDutyCycle(speed)  # 设置PWM占空比控制速度
pwmB.ChangeDutyCycle(speed)
```

### 保护电路设计

为确保系统安全，我们实现了多重保护机制：

1. **过流保护**：在电源输入端串联自恢复保险丝
2. **电压监测**：实时检测电池电压，低于阈值时自动停止
3. **温度保护**：驱动芯片温度超过85℃时降低输出功率
4. **软件保护**：在代码中添加互锁逻辑，防止同侧上下管同时导通