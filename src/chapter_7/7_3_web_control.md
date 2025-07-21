# 7.3 Web控制平台

### 实时视频流传输

在项目中，使用Flask实现MJPEG流：

```python
# control.py中的视频流实现
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

def generate_frames():
    cap = cv2.VideoCapture(0)
    while True:
        success, frame = cap.read()
        if not success:
            break
        # 处理帧（可选）
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
```

### 控制指令安全机制

在项目中，实现基于JWT的认证系统：

```python
# control.py中的简单认证
VALID_PASSWORD = "car123"

def requires_password(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get('Authorization')
        if not auth or auth != VALID_PASSWORD:
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/api/control')
@requires_password
def control_endpoint():
    # 处理控制指令
    return jsonify({"status": "success"})
```

