# 7.2 服务化部署方案

### 系统服务配置

将小车系统部署为Linux系统服务：

```ini
# /etc/systemd/system/car.service
[Unit]
Description=Tennis Ball Collecting Car Service
After=network.target

[Service]
User=pi
WorkingDirectory=/home/pi/tennis-car
ExecStart=/usr/bin/python3 main.py
Restart=on-failure
RestartSec=5
Environment="DISPLAY=:0"

[Install]
WantedBy=multi-user.target
```

### 日志管理系统

实现多级日志记录：

```python
import logging
from logging.handlers import RotatingFileHandler

# 创建日志器
logger = logging.getLogger("tennis_car")
logger.setLevel(logging.DEBUG)

# 文件日志 - 自动轮转
file_handler = RotatingFileHandler(
    "/var/log/tennis_car.log", 
    maxBytes=10 * 1024 * 1024,  # 10MB
    backupCount=5
)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
))

# 控制台日志
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

logger.addHandler(file_handler)
logger.addHandler(console_handler)
```

### 远程监控接口

通过HTTP接口提供系统状态：

```python
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/status')
def system_status():
    return jsonify({
        "state": state_machine.state,
        "battery": battery_monitor.voltage,
        "position": position_estimator.position,
        "balls_collected": ball_counter.count
    })

@app.route('/logs')
def system_logs():
    with open("/var/log/tennis_car.log", "r") as f:
        return f.read()
```

