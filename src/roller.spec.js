jest.mock('./util', () => {
  const util = jest.requireActual('./util');

  return {
    ...util,
    randomInt: jest.fn(),
  };
});

const { challengeRoll, damageRoll } = require('./roller');
const { randomInt } = require('./util');
const { arrayContaining } = expect;

describe('roller', () => {
  beforeEach(() => {
    randomInt.mockRestore();
  });

  const setupRolls = values => {
    if (!Array.isArray(values)) {
      values = [values];
    }

    let index = 0;

    randomInt.mockImplementation(() => values[index++]);
  };

  describe('challengeRoll', () => {
    it('should return null if given zero dice.', async () => {
      expect(challengeRoll(0)).toBeNull();
    });

    it('should return null if given negative dice.', async () => {
      expect(challengeRoll(-1)).toBeNull();
    });

    it.each`
      rolls                                            | expectedResult | expectedBestFace
      ${[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6]} | ${13}          | ${1}
      ${[1, 1, 1, 1, 2]}                               | ${4}           | ${1}
      ${[2, 2, 2, 4, 5]}                               | ${6}           | ${2}
      ${[3, 3, 3, 5, 6]}                               | ${9}           | ${3}
      ${[2, 4, 4, 5, 6]}                               | ${8}           | ${4}
      ${[5, 5, 5, 6, 6]}                               | ${15}          | ${5}
      ${[3, 3, 3, 6, 6]}                               | ${12}          | ${6}
    `(
      'should get (best face: $expectedBestFace | result: $expectedResult) with rolls of $rolls.',
      async ({ rolls, expectedResult, expectedBestFace }) => {
        const testSkill = 2;
        setupRolls(rolls);

        const result = challengeRoll(rolls.length, testSkill);

        expect(result).toBeDefined();
        expect(result.dice).toEqual(arrayContaining(rolls));
        expect(result.bestFace).toBe(expectedBestFace);
        expect(result.result).toBe(expectedResult);
        expect(result.total).toBe(expectedResult + testSkill);
      },
    );
  });

  describe('damageRoll', () => {
    it('should return null if given zero dice.', async () => {
      expect(damageRoll(0)).toBeNull();
    });

    it('should return null if given negative dice.', async () => {
      expect(damageRoll(-1)).toBeNull();
    });
  });
});
