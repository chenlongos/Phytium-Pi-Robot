# 1.4 项目目录结构解析
### 项目目录结构

```
Phytium-Car-STM32-Arm-onPi/
│
├── car.service              # 系统服务配置文件（用于设置小车作为系统服务启动）
├── car.sh                   # 启动脚本（用于启动小车程序）
├── car_cv.py                # 小车视觉控制主逻辑（处理视觉数据并生成控制指令）
├── car_cv.yaml              # Dora框架配置文件（定义节点和输入输出关系）
├── car_stop.py              # 停止小车脚本（用于停止电机）
├── color_detect.py          # 颜色检测启动文件（主入口）
├── control.py               # 控制模块（提供Web控制界面和Socket.IO通信）
├── index.html               # Web控制界面HTML文件
├── move.py                  # 运动控制模块（封装运动指令发送）
├── README.md                # 项目说明文件
│
├── common/                  # 公共模块（数据结构和工具类）
│   ├── calculate.py         # 计算类（处理目标检测结果的数据结构）
│   ├── move_data.py         # 运动数据结构（用于节点间通信）
│   ├── test_move_data.py    # 运动数据结构测试
│   ├── view.py              # 视图数据类（用于Web显示）
│   └── __init__.py          # 包初始化文件
│
├── frame/                   # 存储摄像头捕获的原始帧图像
│
├── mask/                    # 存储掩膜图像
│
├── motor/                   # 电机控制模块
│   ├── main.py              # 电机控制主程序（接收运动指令并控制电机）
│   ├── Motor.py             # 电机控制基类和实现（PCA9685和Modbus）
│   ├── pyproject.toml       # 电机控制模块项目配置
│   └── test.py              # 电机控制测试脚本
│
├── mycv/                    # 计算机视觉模块
│   ├── color.py             # 颜色检测器类（识别网球）
│   ├── README.md            # 模块说明
│   └── __init__.py          # 包初始化文件
│
├── process/                 # 存储处理后的图像
│
├── templates/               # Web模板目录
│   └── index.html           # Web控制界面HTML模板
│
└── untils/                  # 工具模块
    ├── untils.py            # 工具函数（图像处理、方向转换等）
    └── __init__.py          # 包初始化文件
```



