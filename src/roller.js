'use strict';

const { range, randomInt } = require('./util');

const d6 = () => randomInt(1, 6);
const roll = dice => range(dice).map(d6).sort();

function challengeRoll(dice, skill = 0) {
  if (dice < 1) {
    return null;
  }

  const rolls = roll(dice);
  const totals = range(6).map(() => 0);
  rolls.forEach(roll => (totals[roll - 1] += roll));

  const { diceResult, bestFace } = totals.reduce(
    (result, total, index) => (total < result.diceResult ? result : { diceResult: total, bestFace: index + 1 }),
    { diceResult: 0, bestFace: 0 },
  );

  return {
    dice: rolls,
    bestFace,
    result: diceResult,
    total: diceResult + skill,
  };
}

function damageRoll(dice, cap = 6) {
  if (dice < 1 || cap < 1 || cap > 6) {
    return null;
  }

  const rolls = roll(dice);
  let sum = 0;
  let total = 0;
  rolls.forEach(roll => {
    sum += roll;
    total += roll <= cap ? roll : 0;
  });

  return {
    dice: rolls,
    beforeCap: sum,
    total,
  };
}

module.exports = {
  d6,
  roll,
  challengeRoll,
  damageRoll,
};
