# 4.1 底盘控制原理

### 差速转向模型

差速转向是轮式移动机器人最基础也是最常用的运动控制方式。在本项目中，我们采用四轮底盘结构，其中两个主动轮分别位于左右两侧。这种设计的核心原理在于通过控制左右轮的速度差来实现转向：当左右轮以相同速度转动时，小车直线前进；当左右轮速度不同时，小车会向速度较慢的一侧转向。

**运动学方程**：

```markdown
v = (v_left + v_right)/2  // 线速度
ω = (v_right - v_left)/L // 角速度
```

其中L为轮距（左右轮中心距离）。通过精确控制v_left和v_right，我们可以实现小车的任意轨迹运动。

### 坐标变换与位姿估计

小车在运动过程中需要实时估计自身位置和姿态（位姿）。我们采用基于编码器的航迹推算法（Odometry）：

```python
# 编码器计数转换为位移
left_distance = left_encoder_counts * encoder_resolution
right_distance = right_encoder_counts * encoder_resolution

# 计算位姿变化
delta_distance = (left_distance + right_distance) / 2
delta_theta = (right_distance - left_distance) / wheel_base

# 更新位姿
x += delta_distance * cos(theta + delta_theta/2)
y += delta_distance * sin(theta + delta_theta/2)
theta += delta_theta
```

这种方法虽然存在累积误差，但在短距离运动中精度足够，且计算量小，适合嵌入式平台。