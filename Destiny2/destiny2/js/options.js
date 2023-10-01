// 步骤条
var bar = document.querySelector(".bar");

// 步骤
var steps = document.querySelectorAll(".step");

// 下一步按钮
var next = document.querySelector("#next");

// 步骤数
var stepNum = 1;

// 步骤条每一步长度
var stepWidth = (100 / (steps.length - 1));

// 下一步按钮事件
next.addEventListener("click", () => {
    if (stepNum < steps.length) {
        stepNum++;
        update();
    }
});

// 更新进度条样式
function update() {
    // 设置步骤条样式
    steps.forEach((step, idx) => {
        if (idx < stepNum) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    bar.setAttribute("style", "width:" + stepWidth * (stepNum - 1) + "%");

    // // 按钮样式
    // if (stepNum == 1) {
    //     prev.setAttribute("disabled", "disabled");
    // }
    // else if (stepNum == steps.length) {
    //     next.setAttribute("disabled", "disabled");
    // }
    // else {
    //     next.removeAttribute("disabled");
    //     prev.removeAttribute("disabled");
    // }
}