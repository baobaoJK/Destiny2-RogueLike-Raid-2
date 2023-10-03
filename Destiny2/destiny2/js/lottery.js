// 抽奖函数
// -----------------------------------------------------------------------------------------------
// 抽奖函数
function lottery(options) {
    let totalWeight = 0;

    // 计算所有选项的总权重值
    for (let option of options) {
        totalWeight += option.weight;
    }

    // 随机生成一个权重值
    const randomWeight = Math.random() * totalWeight;

    let currentWeight = 0;
    
    // 根据随机生成的权重值进行抽奖
    for (let option of options) {
        currentWeight += option.weight;

        if (randomWeight <= currentWeight) {
            return option;
        }
    }
}

// 抽奖函数
function lotteryByCount(options) {
    let totalWeight = 0;

    // 计算所有选项的总权重值
    for (let option of options) {
        totalWeight += option.weight;
    }

    // 随机生成一个权重值
    const randomWeight = Math.random() * totalWeight;

    let currentWeight = 0;

    // 根据随机生成的权重值进行抽奖
    for (let option of options) {
        currentWeight += option.weight;

        if (randomWeight <= currentWeight && option.count != 0) {
            return option;
        }
    }
}