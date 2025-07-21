# 7.2 服务化部署方案

### 系统服务配置

管理机器人服务：

```bash
# car.service
[Unit]
Description=Car Service
After=network.target

[Service]
User=user
WorkingDirectory=/home/user/code/Phytium-Car-STM32-Arm
ExecStart=python3.11 color_detect.py
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### 日志管理系统

在项目中，实现多级日志记录系统：

```python
# color_detect.py中的日志实现
import logging
import os

def setup_logger():
    logger = logging.getLogger('tennis_car')
    logger.setLevel(logging.DEBUG)
    
    # 创建日志目录
    log_dir = "logs"
    os.makedirs(log_dir, exist_ok=True)
    
    # 文件处理器
    file_handler = logging.FileHandler(os.path.join(log_dir, "car.log"))
    file_handler.setLevel(logging.DEBUG)
    
    # 控制台处理器
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    
    # 日志格式
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)
    
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    return logger

logger = setup_logger()
```



