const { matchInput } = require('./parser');

describe('parser', () => {
  describe('matchInput', () => {
    it('should return undefined if not a match.', async () => {
      const command = 'bob';

      const result = matchInput(command);

      expect(result).toBeUndefined();
    });

    it('should return a "challenge" type if no damage modifier is present.', async () => {
      const command = '!wv 6';

      const result = matchInput(command);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        type: 'challenge'
      });
    });

    it('should return the parsed dice value for challenge rolls.', async () => {
      const command = '!wv 6';

      const result = matchInput(command);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        dice: 6
      });
    });

    it('should return the parsed skill value for challenge rolls as modifier.', async () => {
      const command = '!wv 6 + 2';

      const result = matchInput(command);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        modifier: 2
      });
    });

    it('should return a "damage" type if no damage modifier is present.', async () => {
      const command = '!wv/d 6';

      const result = matchInput(command);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        type: 'damage'
      });
    });

    it('should return the parsed dice value for damage rolls.', async () => {
      const command = '!wv/d 6';

      const result = matchInput(command);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        dice: 6
      });
    });

    it('should return the parsed skill value for damage rolls as modifier.', async () => {
      const command = '!wv/d 6:2';

      const result = matchInput(command);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        modifier: 2
      });
    });

    it('should handle backslash for the damage modifier roll.', async () => {
      const command = '!wv\\d 6:2';

      const result = matchInput(command);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        type: 'damage',
        dice: 6,
        modifier: 2
      });
    });

    it('should handle a negative die cap.', async () => {
      const command = '!wv/d 6:-2';

      const result = matchInput(command);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        type: 'damage',
        dice: 6,
        modifier: 4
      });
    });

    it('should tell you when you put the damage modifier too late.', async () => {
      const command = '!wv 6:-2/d';

      const result = matchInput(command);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        screwedUp: true,
      });
    });
  });
});
