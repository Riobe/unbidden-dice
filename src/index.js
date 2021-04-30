const Discord = require('discord.js');
const client = new Discord.Client();

require("dotenv").config();

const { matchInput } = require('./parser');
const { challengeRoll, damageRoll, } = require('./roller');

console.log(`Using token ${process.env.DISCORD_TOKEN}`);

client.once('ready', () => {
    console.log('Ready!');
});

client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
    client.user.setActivity("#help", { type: "LISTENING" });
})


client.on('message', message => {
    if (message.content === "#help") {
        message.channel.send("Unbidden Dice test?");
    }
});

client.on('message', message => {
  const match = matchInput(message.content);
  if (!match) {
    return;
  }

  const {
    type,
    dice,
    modifier,
    screwedUp,
    error,
  } = match;

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
    const rollsString = roll.dice.map(die => die === roll.bestFace ? `**${die}**` : die).join(',');

    return message.reply(
      `Challenge Result: **${roll.total}** *(${roll.result}${sign}${skill})* | Roll: ${rollsString} (**${roll.result}**) | Skill: **${sign}${skill}**`
    );
  } else {
    const dieCap = modifier;

    if (dieCap < 1 || dieCap > 6) {
      return message.reply('When doing a damage roll, your die cap *must* be between 1 and 6.');
    }

    const roll = damageRoll(dice, dieCap);
    const rollsString = roll.dice.map(die => die <= dieCap ? `**${die}**` : `~~${die}~~`).join(',');
    const dieCapDifference = roll.beforeCap - roll.total;

    return message.reply(
      `Damage Result: **${roll.total}** | Roll: ${rollsString} (*${roll.beforeCap} - ${dieCapDifference}*) | Die Cap: **${dieCap}**`
    );
  }

  if (screwedUp) {
    message.channel.send('Oh, and btw, the /d goes **before** the numbers. <3');
  }
});
