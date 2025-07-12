# 7.3 Web控制平台

### 实时视频流传输

使用MJPEG流实现低延迟视频传输：

```python
def generate_frames():
    while True:
        ret, frame = camera.read()
        if not ret:
            break
        # 压缩为JPEG
        ret, jpeg = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')
```

### 控制指令安全机制

确保控制指令安全可靠：

```python
# 指令验证装饰器
def validate_command(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not current_user.is_authenticated:
            return "Unauthorized", 401
        if system_state != "MANUAL":
            return "Auto mode active", 403
        return f(*args, **kwargs)
    return decorated

@app.route('/control/forward')
@validate_command
def control_forward():
    chassis.forward()
    return "OK"
```

### 响应式界面设计

使用Bootstrap实现响应式界面：

```html
<div class="container-fluid">
  <div class="row">
    <!-- 视频区域 -->
    <div class="col-lg-8">
      <img src="/video_feed" class="img-fluid">
    </div>
    
    <!-- 控制区域 -->
    <div class="col-lg-4">
      <div class="control-panel">
        <button class="btn btn-primary" onclick="sendCommand('forward')">
          <i class="bi bi-arrow-up"></i>
        </button>
        <!-- 其他控制按钮 -->
      </div>
      
      <!-- 状态显示 -->
      <div class="status-card">
        <h5>系统状态</h5>
        <div id="system-state">SEARCHING</div>
        <div id="battery-level">12.4V (78%)</div>
      </div>
    </div>
  </div>
</div>
```

