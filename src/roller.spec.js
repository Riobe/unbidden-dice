const { challengeRoll, damageRoll } = require('./roller');

describe('roller', () => {
  let mathSpy;

  beforeEach(() => {
    mathSpy = jest.spyOn(global.Math, 'random');
  });

  afterEach(() => {
    mathSpy.mockRestore();
  });

  const setRand = value => mathSpy.mockImplementation(() => (1/6) * (value-1));

  describe('challengeRoll', () => {
    it('should return null if given zero dice.', async () => {
      expect(challengeRoll(0)).toBeNull();
    });

    it('should return null if given negative dice.', async () => {
      expect(challengeRoll(-1)).toBeNull();
    });

    it('should return a rolls array.', async () => {
      setRand(5);

      const result = challengeRoll(1);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        rolls: [5],
        bestFace: 5,
        result: 5,
      });
    });
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
