// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="index.html">Introduction</a></li><li class="chapter-item expanded "><a href="chapter_1/chapter1.html">第一章 项目概述与环境搭建</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapter_1/1_1_project_goals.html">1.1 项目目标与应用场景</a></li><li class="chapter-item expanded "><a href="chapter_1/1_2_hardware_components.html">1.2 硬件组成清单</a></li><li class="chapter-item expanded "><a href="chapter_1/1_3_software_setup.html">1.3 软件环境配置指南</a></li><li class="chapter-item expanded "><a href="chapter_1/1_4_directory_structure.html">1.4 项目目录结构解析</a></li><li class="chapter-item expanded "><a href="chapter_1/1_5_system_architecture.html">系统架构与原理</a></li></ol></li><li class="chapter-item expanded "><a href="chapter_2/chapter2.html">第二章 视觉处理基础理论</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapter_2/2_1_image_processing.html">2.1 数字图像处理基础</a></li><li class="chapter-item expanded "><a href="chapter_2/2_2_hsv_color.html">2.2 色彩空间与HSV原理</a></li><li class="chapter-item expanded "><a href="chapter_2/2_3_preprocessing.html">2.3 图像预处理技术详解</a></li><li class="chapter-item expanded "><a href="chapter_2/2_4_target_recognition.html">2.4 目标识别核心算法</a></li></ol></li><li class="chapter-item expanded "><a href="chapter_3/chapter3.html">第三章 网球检测系统实现</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapter_3/3_1_color_thresholding.html">3.1 颜色阈值分割实战</a></li><li class="chapter-item expanded "><a href="chapter_3/3_2_morphological_processing.html">3.2 形态学处理技术应用</a></li><li class="chapter-item expanded "><a href="chapter_3/3_3_contour_analysis.html">3.3 轮廓分析与特征提取</a></li><li class="chapter-item expanded "><a href="chapter_3/3_4_position_calculation.html">3.4 位置计算与坐标转换</a></li></ol></li><li class="chapter-item expanded "><a href="chapter_4/chapter4.html">第四章 小车运动控制</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapter_4/4_1_chassis_control.html">4.1 底盘控制原理</a></li><li class="chapter-item expanded "><a href="chapter_4/4_2_driver_circuit.html">4.2 驱动电路设计</a></li><li class="chapter-item expanded "><a href="chapter_4/4_3_control_algorithm.html">4.3 运动控制算法</a></li><li class="chapter-item expanded "><a href="chapter_4/4_4_system_integration.html">4.4 底盘控制系统集成</a></li></ol></li><li class="chapter-item expanded "><a href="chapter_5/chapter5.html">第五章 机械臂控制系统</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapter_5/5_1_arm_structure.html">5.1 机械臂结构分析</a></li><li class="chapter-item expanded "><a href="chapter_5/5_2_gripper_design.html">5.2 抓取机构设计</a></li><li class="chapter-item expanded "><a href="chapter_5/5_3_trajectory_planning.html">5.3 轨迹规划技术</a></li><li class="chapter-item expanded "><a href="chapter_5/5_4_control_integration.html">5.4 机械臂控制系统集成</a></li></ol></li><li class="chapter-item expanded "><a href="chapter_6/chapter6.html">第六章 Dora-RS框架解析</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapter_6/6_1_framework_design.html">6.1 框架设计理念</a></li><li class="chapter-item expanded "><a href="chapter_6/6_2_core_components.html">6.2 核心组件剖析</a></li><li class="chapter-item expanded "><a href="chapter_6/6_3_communication.html">6.3 通信机制实现</a></li><li class="chapter-item expanded "><a href="chapter_6/6_4_application.html">6.4 框架应用实践</a></li></ol></li><li class="chapter-item expanded "><a href="chapter_7/chapter7.html">第七章 系统集成与优化</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapter_7/7_1_module_coordination.html">7.1 多模块协同架构</a></li><li class="chapter-item expanded "><a href="chapter_7/7_2_deployment.html">7.2 服务化部署方案</a></li><li class="chapter-item expanded "><a href="chapter_7/7_3_web_control.html">7.3 Web控制平台</a></li><li class="chapter-item expanded "><a href="chapter_7/7_4_optimization.html">7.4 系统性能优化</a></li></ol></li><li class="chapter-item expanded "><a href="chapter_8/chapter8.html">第八章 总结与扩展方向</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapter_8/8_1_summary.html">8.1 项目成果总结</a></li><li class="chapter-item expanded "><a href="chapter_8/8_2_industrial.html">8.2 工业级扩展方案</a></li><li class="chapter-item expanded "><a href="chapter_8/8_3_intelligence.html">8.3 智能化升级方向</a></li><li class="chapter-item expanded "><a href="chapter_8/8_4_resources.html">8.4 学习资源与社区</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
