# 2.3 图像预处理技术详解
### 高斯模糊降噪

```python
blurred = cv2.GaussianBlur(image, (5, 5), 0)
```

- **原理**：使用高斯函数计算邻域像素的加权平均值
- **作用**：减少图像噪声，平滑细节
- **参数说明**：(5,5)是核大小，0是标准差(自动计算)

### 中值滤波

```python
median = cv2.medianBlur(image, 5)
```

- **原理**：取邻域像素的中值作为中心像素值
- **作用**：有效去除椒盐噪声
- **与高斯模糊区别**：更擅长处理脉冲噪声，但计算量更大

### 形态学操作

```python
kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
opened = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
```

- **开运算**：先腐蚀后膨胀，去除小噪点
- **闭运算**：先膨胀后腐蚀，填充小孔洞
- **结构元素**：定义操作形状和大小的核