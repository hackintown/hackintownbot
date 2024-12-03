const spinWheel = () => {
  const outcomes = [20, 25, 30, 35]; // Will result in 75-90 INR total for 3 spins
  const randomIndex = Math.floor(Math.random() * outcomes.length);
  return outcomes[randomIndex];
};

const checkWithdrawEligibility = (totalEarnings) => {
  return totalEarnings >= 100;
};

module.exports = { spinWheel, checkWithdrawEligibility };
