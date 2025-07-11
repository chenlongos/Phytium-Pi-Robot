# 2.2 色彩空间与HSV原理
### RGB的局限性

RGB色彩空间对光照变化敏感，在网球识别中表现不佳。因此我们使用HSV色彩空间。

### HSV色彩空间

- **Hue(色调)**：颜色类型，0-180°（在OpenCV中）
- **Saturation(饱和度)**：颜色纯度，0-255
- **Value(明度)**：颜色亮度，0-255

HSV空间更接近人类对颜色的感知，对光照变化不敏感。

### 为什么选择HSV识别网球？

1. 色调(H)可以稳定表示网球颜色
2. 饱和度(S)帮助区分鲜艳的网球和背景
3. 明度(V)可以过滤过暗或过亮的区域

### HSV阈值设置

```python
# 网球HSV阈值范围
lower_tennis = np.array([30, 70, 80])   # 最低H,S,V值
upper_tennis = np.array([50, 255, 255]) # 最高H,S,V值

# 创建颜色掩膜
mask = cv2.inRange(hsv_image, lower_tennis, upper_tennis)
```
