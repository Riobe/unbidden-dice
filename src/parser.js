const messageRegex = /^!(?<command>wv|vault)\s*(?<damageModifier>[\\/]d)?\s+(?<dice>\d+)\s*d?\s*((?<connector>[+:])\s*(?<plus>[+])?(?<negative>-)?(?<modifier>\d+))?\s*(?<screwedUp>[\\/]d)?/;

function matchInput(textInput) {
  const match = textInput.toLowerCase().match(messageRegex);
  if (!match) {
    return;
  }

  if (match.groups.dice.length > 2) {
    return {
      error: 'You cannot roll more than 99 dice',
    };
  }

  const screwedUp = !!match.groups.screwedUp;

  const type =
    match.groups.damageModifier || screwedUp ? 'damage' : 'challenge';

  if (type === 'challenge' && match.groups.connector === ':') {
    return {
      error:
        'When doing a challenge roll, you can use + to add a skill. : is for specifying a die cap on a damage roll.',
    };
  }

  if (type === 'damage' && match.groups.connector === '+') {
    return {
      error:
        'When doing a damage roll, you can use : to specify the die cap. + is for adding skill to a challenge roll.',
    };
  }

  if (match.groups.plus) {
    return {
      error:
        'You cannot add to the die cap of a damage roll. The dice only has six sides. Remove the + and try again.',
    };
  }

  const dice = parseInt(match.groups.dice, 10);

  const defaultModifier = type === 'challenge' ? 0 : 6;
  let modifier = parseInt(match.groups.modifier || defaultModifier, 10);
  if (match.groups.negative) {
    if (type === 'damage') {
      modifier = 6 - modifier;
    } else {
      modifier *= -1;
    }
  }

  if (modifier > 999) {
    return {
      error:
        "Congratulations on your god character, but I'm not working with numbers that big.",
    };
  }

  return {
    type,
    dice,
    modifier,
    screwedUp,
  };
}

module.exports = {
  matchInput,
};
