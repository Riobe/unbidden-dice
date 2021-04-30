const Discord = require('discord.js');
const client = new Discord.Client();

require('dotenv').config();

const { matchInput } = require('./parser');
const { challengeRoll, damageRoll } = require('./roller');

client.once('ready', () => {
  console.log('Ready!');
});

client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
  console.log(`${client.user.tag} has logged in.`);
  client.user.setActivity('!wv', { type: 'LISTENING' });
});

client.on('message', message => {
  const { content } = message;
  if (content === '!wv' || content === '!vault') {
    message.channel.send(
      `Welcome to Unbidden Dice, the dice roller for Whispering Vault!

You can use either \`!wv\` or \`!vault\` to use the bot. There are two types of rolls, challenge rolls and damage rolls. Challenge rolls are the default type and you can do one by just including a number of dice after a space after the command. Like so:

\`!wv 5\`

If you want to add a skill just type a \`+\` and the number after that like \`!vault 5 + 2\`. The other type of roll is a damage roll and to do one of those include \`/d\` after the command like this:

\`!wv/d 8\`

You will often have a die cap on a damage roll (Say for ranged weapons, or mortal weapons) and to include that just use a colon (\`:\`) after the dice number and what the die cap is. You can either type the die cap directly like \`8:5\` or put in a negative number to subtract from 6 like \`8:-1\`. Here's an example:

\`!vault 8:-2\`

After any of these commands you can type whatever you want, so you can include a comment about what the roll is for if you want. Enjoy!
`,
    );
  }
});

client.on('message', message => {
  const match = matchInput(message.content);
  if (!match) {
    return;
  }

  const { type, dice, modifier, screwedUp, error } = match;

  if (error) {
    return message.reply(error);
  }

  if (dice === 0) {
    return message.reply('https://tenor.com/wXii.gif');
  }

  if (type === 'challenge') {
    const skill = modifier;
    const sign = modifier >= 0 ? '+' : '';
    const roll = challengeRoll(dice, skill);
    const rollsString = roll.dice
      .map(die => (die === roll.bestFace ? `**${die}**` : die))
      .join(',');

    message.reply(
      `Challenge Result: **${roll.total}** *(${roll.result}${sign}${skill})* | Roll: ${rollsString} (**${roll.result}**) | Skill: **${sign}${skill}**`,
    );
  } else {
    const dieCap = modifier;

    if (dieCap < 1 || dieCap > 6) {
      return message.reply(
        'When doing a damage roll, your die cap *must* be between 1 and 6.',
      );
    }

    const roll = damageRoll(dice, dieCap);
    const rollsString = roll.dice
      .map(die => (die <= dieCap ? `**${die}**` : `~~${die}~~`))
      .join(',');
    const dieCapDifference = roll.beforeCap - roll.total;

    message.reply(
      `Damage Result: **${roll.total}** | Roll: ${rollsString} (*${roll.beforeCap} - ${dieCapDifference}*) | Die Cap: **${dieCap}**`,
    );
  }

  if (screwedUp) {
    message.channel.send('Oh, and btw, the /d goes **before** the numbers. <3');
  }
});
