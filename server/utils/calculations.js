function calculateItemStats(item, projectTimelineProgress = 0) {
  const scope = item.scopeQuantity || 0;
  const executed = item.executedQuantity || 0;
  const weightage = item.weightageFactor || 0;

  const balance = Math.max(0, scope - executed);
  const percentProgress = scope > 0 ? (executed / scope) * 100 : 0;
  const earnedProgress = percentProgress * weightage;

  const lagPercentage = projectTimelineProgress - percentProgress;
  const isLagging = lagPercentage > 15;

  return {
    ...(item.toObject ? item.toObject() : item),
    balanceQuantity: Number(balance.toFixed(2)),
    percentProgress: Number(percentProgress.toFixed(2)),
    earnedProgress: Number(earnedProgress.toFixed(4)),
    lagPercentage: Number(lagPercentage.toFixed(2)),
    isLagging,
  };
}

module.exports = {
  calculateItemStats,
};
