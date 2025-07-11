# 1.3 软件环境配置指南
### 基础环境

```bash
sudo apt update
sudo apt install python3.11 python3.11-venv
```

### 创建虚拟环境

 为什么需要虚拟环境？：依赖隔离，版本控制，权限管理等

`pyproject.toml`中指定`requires-python = ">=3.8"`

```bash
python3.11 -m venv venv
source venv/bin/activate
```

### 安装核心依赖

```bash
pip install opencv-python==4.8.0.76
pip install numpy==1.24.3
pip install dora-rs==0.3.10
pip install pyarrow==12.0.1
pip install flask==2.3.2
pip install python-socketio==5.8.0
```

### 硬件驱动安装

```bash
# 安装I2C工具
sudo apt install i2c-tools

# 检测连接的I2C设备
sudo i2cdetect -y 1

# 安装串口工具
sudo apt install minicom
```
