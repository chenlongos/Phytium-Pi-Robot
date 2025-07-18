# 1.2 硬件组成清单
### 核心硬件

实际项目可能因具体版本有所调整，根据需求选择

| 部件         | 规格               | 功能说明             |
| ------------ | ------------------ | -------------------- |
| 主控板       | 飞腾派开发板       | 国产高性能嵌入式平台 |
| STM32控制器  | STM32F4系列开发板  | 实时运动控制         |
| 摄像头       | OV5647模块         | 500万像素，支持720P  |
| 电机驱动     | L298N双H桥驱动模块 | 直流电机控制         |
| 直流减速电机 | 12V/300RPM带编码器 | 四轮驱动             |
| 机械臂       | 4自由度串口舵机臂  | 支持角度控制         |

### 连接说明

1. 飞腾派通过USB串口连接STM32
2. STM32通过GPIO控制L298N
3. 摄像头直接连接到飞腾派CSI接口