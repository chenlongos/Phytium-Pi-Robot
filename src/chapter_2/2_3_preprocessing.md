# 2.3 图像预处理技术详解
**处理过程**

```
在color_detect.py中，ColorDetector类的process方法包含以下步骤：

1. 高斯模糊降噪：使用cv2.GaussianBlur(frame, (5, 5), 0)
2. 中值滤波：使用cv2.medianBlur(blurred_img, 5)
3. 转换到HSV颜色空间
4. 创建颜色掩膜：cv2.inRange
5. 形态学操作（开运算、闭运算等）：

开运算：cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
闭运算：cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=3)
 再次开运算：cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=2)
 高斯模糊：cv2.GaussianBlur(mask, (5, 5), 0)
 
 另外，在掩膜处理之后，又使用了一次高斯模糊（在掩膜图像上），这也可以看作是一种降噪或平滑处理。
```

### 高斯模糊降噪

在项目中，我们使用高斯模糊减少图像噪声：

```python
# 在mycv/color.py中
blurred_img = cv2.GaussianBlur(frame, (5, 5), 0)
```

- **函数**: `cv2.GaussianBlur(src, ksize, sigmaX)`
- 参数:
  - `src`: 输入图像
  - `ksize`: 高斯核大小 (宽度, 高度)，必须是正奇数
  - `sigmaX`: X方向标准差，0表示自动计算
- **返回值**: 模糊后的图像
- **作用**: 减少图像噪声，平滑细节

### 中值滤波

项目中进一步使用中值滤波去除噪声：

```python
median_blur = cv2.medianBlur(blurred_img, 5)
```

- **函数**: `cv2.medianBlur(src, ksize)`
- 参数:
  - `src`: 输入图像
  - `ksize`: 滤波孔径大小，必须是大于1的奇数
- **返回值**: 滤波后的图像
- **作用**: 有效去除椒盐噪声

### 形态学操作

项目中应用形态学操作优化掩膜：

```python
# 开运算去除小噪点
mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, self.kernel, iterations=1)

# 闭运算填充孔洞
mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, self.kernel, iterations=3)

# 二次开运算平滑边缘
mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, self.kernel, iterations=2)
```

- **操作序列**：开-闭-开组合优化掩膜质量
- **迭代次数**：闭运算3次确保填充网球内部空洞
