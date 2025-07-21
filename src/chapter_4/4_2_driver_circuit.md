## 4.2 驱动电路设计

### PCA9685控制器详解

PCA9685用于控制电机驱动：

```python
# motor/Motor.py - PCA9685控制实现
class PCA9685Motor:
    def set_pwm_frequency(self, freq):
        """设置PWM频率"""
        # 计算预分频值
        prescale_val = int(25000000.0 / (4096 * freq) * 0.98 - 1 + 0.5)
        
        # 进入睡眠模式
        old_mode = self.bus.read_byte_data(self.PCA9685_ADDRESS, self.MODE1)
        new_mode = (old_mode & 0x7F) | 0x10  # 设置SLEEP位
        self.bus.write_byte_data(self.PCA9685_ADDRESS, self.MODE1, new_mode)
        
        # 设置预分频值
        self.bus.write_byte_data(self.PCA9685_ADDRESS, self.PRE_SCALE, prescale_val)
        
        # 退出睡眠模式
        self.bus.write_byte_data(self.PCA9685_ADDRESS, self.MODE1, old_mode)
        time.sleep(0.001)
        
        # 重启设备
        self.bus.write_byte_data(self.PCA9685_ADDRESS, self.MODE1, old_mode | 0x80)
    
    def set_pwm(self, ch1, ch2, ch3, ch4):
        """设置四个通道的PWM值"""
        # 限制占空比在0-4095范围内
        ch1 = max(0, min(4095, ch1))
        ch2 = max(0, min(4095, ch2))
        ch3 = max(0, min(4095, ch3))
        ch4 = max(0, min(4095, ch4))
        
        # 设置通道PWM值
        self.set_channel_pwm(0, ch1)
        self.set_channel_pwm(5, ch2)
        self.set_channel_pwm(6, ch3)
        self.set_channel_pwm(11, ch4)
    
    def set_channel_pwm(self, channel, duty):
        """设置单个通道的PWM值"""
        reg_base = self.LED0_ON_L + 4 * channel
        # ON时间设置为0，OFF时间设置为duty
        self.bus.write_byte_data(self.PCA9685_ADDRESS, reg_base, 0 & 0xFF)
        self.bus.write_byte_data(self.PCA9685_ADDRESS, reg_base + 1, 0 >> 8)
        self.bus.write_byte_data(self.PCA9685_ADDRESS, reg_base + 2, duty & 0xFF)
        self.bus.write_byte_data(self.PCA9685_ADDRESS, reg_base + 3, duty >> 8)
```

### 保护机制实现

在项目中，实现了多重保护机制：

1. **过流保护**：在电源输入端串联自恢复保险丝
2. **电压监测**：实时检测电池电压，低于阈值时自动停止
3. **温度保护**：驱动芯片温度超过85℃时降低输出功率
4. **软件保护**：在代码中添加互锁逻辑，防止同侧上下管同时导通

```python
# motor/Motor.py - 安全保护
class PCA9685Motor:
    def __init__(self, d1, d2, d3, d4):
        # ...初始化代码...
        self.max_current = 2.0  # 最大允许电流(A)
        self.current_sense_pin = 0  # 电流检测ADC通道
    
    def periodic_check(self):
        """周期性安全检查"""
        self.check_current()
        self.check_temperature()
    
    def check_current(self):
        """检查电流是否超过阈值"""
        # 读取电流检测ADC值
        adc_value = self.read_adc(self.current_sense_pin)
        current = adc_value * 0.1  # 假设电流检测电路：电流 = ADC值 * 0.1（A）
        
        if current > self.max_current:
            self.emergency_stop()
            print(f"电流过大: {current}A > {self.max_current}A")
    
    def check_temperature(self):
        """检查温度是否超过阈值"""
        temp = self.read_temperature()
        if temp > 85:  # 85℃阈值
            self.emergency_stop()
            print(f"温度过高: {temp}℃")
    
    def emergency_stop(self):
        """紧急停止所有电机"""
        self.Stop()
        self.set_pwm(0, 0, 0, 0)  # 设置所有PWM为0
```

