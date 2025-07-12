# 5.3 轨迹规划技术

### 关节空间轨迹规划

关节空间规划直接控制各关节角度，计算简单但路径不可预测：

```python
def joint_space_move(target_angles, duration):
    start_angles = get_current_angles()
    steps = int(duration * 100)  # 100Hz控制频率
    
    for i in range(steps):
        # 线性插值
        ratios = [i/steps for _ in range(4)]
        current_angles = [
            start + ratio * (target - start)
            for start, target, ratio in zip(start_angles, target_angles, ratios)
        ]
        
        set_joint_angles(current_angles)
        time.sleep(0.01)
```

### 笛卡尔空间轨迹规划

笛卡尔空间规划控制末端执行器位置，路径可预测但计算复杂：

```python
def cartesian_space_move(target_pose, duration):
    start_pose = get_current_pose()
    steps = int(duration * 100)
    
    for i in range(steps):
        ratio = i / steps
        # 线性插值位置
        current_position = [
            start + ratio * (target - start)
            for start, target in zip(start_pose[:3], target_pose[:3])
        ]
        
        # 球面线性插值姿态
        current_orientation = slerp(start_pose[3:], target_pose[3:], ratio)
        
        # 逆运动学求解关节角度
        joint_angles = inverse_kinematics(current_position + current_orientation)
        
        set_joint_angles(joint_angles)
        time.sleep(0.01)
```

### 避奇异点策略

机械臂在奇异点附近会出现运动不稳定问题，我们采用以下策略：

1. **速度限制**：接近奇异点时降低运动速度
2. **路径优化**：规划绕过奇异点的路径
3. **关节限位**：设置关节运动范围避开奇异区域