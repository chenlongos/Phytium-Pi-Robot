# 3.2 形态学处理技术应用
### 开闭运算组合

```python
# 开运算去除小噪点
mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
# 闭运算填充小孔洞
mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
```

### 结构元素选择

```python
# 椭圆结构元素更适合圆形目标
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
```

### 迭代次数优化

```python
# 多次迭代增强效果
mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=2)
mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=3)
```

### 形态学处理效果

1. **开运算**：消除小噪点，分离粘连物体
2. **闭运算**：填充内部空洞，平滑边界
3. **组合使用**：得到更完整的网球区域