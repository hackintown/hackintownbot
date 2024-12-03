const spinWheel = () => {
  const outcomes = [10, 20, 30, 40]; // Random outcomes
  return outcomes[Math.floor(Math.random() * outcomes.length)];
};

const calculateTotalEarnings = (spins) =>
  spins.reduce((sum, spin) => sum + spin, 0);

module.exports = { spinWheel, calculateTotalEarnings };
