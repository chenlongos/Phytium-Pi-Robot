# 3.1 颜色阈值分割实战
### HSV阈值分割原理

颜色阈值分割是网球识别的核心步骤，通过定义HSV空间中的上下限阈值，提取网球区域：

```python
# 网球HSV阈值范围
lower_tennis = np.array([30, 70, 80])   # 最低H,S,V值
upper_tennis = np.array([50, 255, 255]) # 最高H,S,V值

# 创建颜色掩膜
mask = cv2.inRange(hsv_image, lower_tennis, upper_tennis)
```

### 参数调整技巧

1. **色调(H)**：30-50对应黄绿色范围
2. **饱和度(S)**：70以上确保颜色足够鲜艳
3. **明度(V)**：80以上避免过暗区域

### 实际应用中的挑战

- 光照变化：晴天和阴天需要不同阈值
- 场地反光：可能导致误识别
- 阴影影响：降低明度阈值可减少阴影影响

### 自适应阈值方法

```python
# 动态调整阈值
def adjust_thresholds(light_level):
    if light_level < 50:  # 低光照环境
        return np.array([25, 60, 60]), np.array([55, 255, 200])
    else:  # 正常光照
        return np.array([30, 70, 80]), np.array([50, 255, 255])
```
