'use strict';

const range = length => [...Array(length).keys()];
const randomInt = (min, max) => Math.floor(min + (Math.random() * (max - min + 1)));

module.exports = {
  range,
  randomInt,
};
