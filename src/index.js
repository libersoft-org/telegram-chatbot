const { Telegraf } = require('telegraf');
const { Configuration, OpenAIApi } = require('openai');
const readline = require('readline-sync');
const os = require('os');
const fs = require('fs');

class ChatBot {
 settingsFile = 'settings.json';

 run() {
  const args = process.argv.slice(2);
  switch (args.length) {
   case 0:
    this.startBot();
    break;
   case 1:
    if (args[0] == '--help') this.getHelp();
    else if (args[0] == '--create-settings') this.createSettings();
    else this.getHelp();
    break;
   default:
    this.getHelp();
    break;
  }
 }
 
 startBot() {
  this.loadSettings();
  this.addLog('The Telegram chat bot application is running ...');
  const bot = new Telegraf(this.settings.telegram_token);
  const openai = new OpenAIApi(new Configuration({ apiKey: this.settings.openai_token }));
  bot.start((ctx) => { ctx.reply('Hi, I am Telegram Chat Bot. I am using OpenAI as a source of knowledge. You can write me anything you want or you can use the following commands for additional functionality:' + os.EOL + os.EOL + '/start - to see this welcome message' + os.EOL + '/image SOME IMAGE DESCRIPTION - it will create an AI generated image based on your description'); });
  bot.command('image', async (ctx) => {
   this.addLog('FROM: ' + ctx.message.from.id + ' - ' + ctx.message.from.first_name + ' ' + ctx.message.from.last_name + ' (' + ctx.message.from.username + '): ' + ctx.message.text);
   if (ctx.message.text.startsWith('/image ') && ctx.message.text.length > 7) {
    try {
     var msg = ctx.message.text.substring(7);
     console.log(msg);
     ctx.reply('Generating a picture described as: "' + msg + '". Please wait ...');
     const image = await openai.createImage({
      size: '1024x1024',
      prompt: msg,
      response_format: 'b64_json'
     });
     const imgFileName = this.getHash(32) + '.png';
     fs.writeFileSync(imgFileName, Buffer.from(image.data.data[0].b64_json, 'base64'));
     await ctx.replyWithPhoto({ source: imgFileName });
     fs.unlinkSync(imgFileName);
    } catch (error) {
     ctx.reply('Sorry, I cannot generate such picture. ');
     this.addLog(error);
    };
   } else {
    ctx.reply('Image description is missing. Please use command in format /image SOME IMAGE DESCRIPTION');
   }
  });
  bot.on('text', async (ctx) => {
   try {
    if (ctx.message.text == '') ctx.reply('Error: Your message is empty');
    else if (ctx.message.text.length > 1000) ctx.reply('Error: Your message is too long.');
    else {
     this.addLog('FROM: ' + ctx.message.from.id + ' - ' + ctx.message.from.first_name + ' ' + ctx.message.from.last_name + ' (' + ctx.message.from.username + '): ' + ctx.message.text);
     const completion = await openai.createCompletion({
      model: this.settings.openai_model,
      prompt: ctx.message.text,
      max_tokens: 2048,
      user: ctx.message.from.id.toString()
     });
     ctx.reply(completion.data.choices[0].text);
     this.addLog('TO: ' + ctx.message.from.id + ' - ' + ctx.message.from.first_name + ' ' + ctx.message.from.last_name + ' (' + ctx.message.from.username + '): ' + completion.data.choices[0].text);
    }
   } catch (error) {
    if (error.response) {
     this.addLog('Error: ' + error.response.status);
     this.addLog(error.response.data);
    } else this.addLog(error.message);
   };
  });
  bot.on('voice', async (ctx) => {
   const voiceMessage = ctx.message.voice;
   const fileID = voiceMessage.file_id;
   const file = await ctx.telegram.getFile(fileID);
   const fileUrl = 'https://api.telegram.org/file/bot' + this.settings.telegram_token + '/' + file.file_path;
   this.addLog('FROM: ' + ctx.message.from.id + ' - ' + ctx.message.from.first_name + ' ' + ctx.message.from.last_name + ' (' + ctx.message.from.username + ') - VOICE MESSAGE: ' + fileUrl);
   ctx.reply(fileUrl);
  });
  bot.launch();
 }
 
 loadSettings() {
  if (fs.existsSync(this.settingsFile)) {
   this.settings = JSON.parse(fs.readFileSync(this.settingsFile, { encoding:'utf8', flag:'r' }));
  } else {
   console.log('');
   console.log('Error: The settings file "' + this.settingsFile + '" not found. Please run this application again using: node index.js --create-settings');
   console.log('');
   process.exit(1);
  }
 }
 
 createSettings() {
  if (fs.existsSync(settingsFile)) {
   console.log('');
   console.log('Error: The settings file "' + this.settingsFile +  '" already exists. If you need to replace it with default one, delete the old one first.');
   console.log('');
   process.exit(1);
  } else {
   const telegram_token = readline.question('Enter your Telegram API token: ');
   const openai_token = readline.question('Enter your OpenAI API token: ');
   const settings = {
    log_to_file: true,
    log_file: 'chatbot.log',
    telegram_token: telegram_token,
    openai_token: openai_token
   }
   fs.writeFileSync(this.settingsFile, JSON.stringify(this.settings, null, ' '));
   console.log('');
   console.log('Settings file "' + this.settingsFile + '" was created sucessfully. You can run the application now.');
   console.log('');
  }
 }
 
 addLog(message) {
  const time = this.getDateTime() + ' -';
  const msg = message == undefined ? '' : message;
  console.log(time, msg);
  if (this.settings && this.settings.log_to_file) fs.appendFileSync(this.settings.log_file, time + ' ' +  msg + os.EOL);
 }
 
 getDateTime() {
  function toString(number, padLength) { return number.toString().padStart(padLength, '0'); }
  const date = new Date();
  return toString(date.getFullYear(), 4)
   + '-' + toString(date.getMonth() + 1, 2)
   + '-'  + toString(date.getDate(), 2)
   + ' ' + toString(date.getHours(), 2)
   + ':'  + toString(date.getMinutes(), 2)
   + ':'  + toString(date.getSeconds(), 2);
 }
 
 getHelp() {
  console.log('');
  console.log('Command line arguments:');
  console.log();
  console.log('--help - to see this help');
  console.log('--create-settings - to create default settings file called "' + this.settingsFile + '"');
  console.log('');
 }

 getHash(len) {
  const chars ='abcdefghijklmnopqrstuvwxyz0123456789';
  var res = '';
  for (var i = 0; i < len; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
  return res;
 }
}

const chatBot = new ChatBot();
chatBot.run();
