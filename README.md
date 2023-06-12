# Telegram chat bot

This application, written in [**Node.js**](https://nodejs.org/), runs a Telegram chat bot using the OpenAI API.

Please note that this chat bot has limited features than classic web OpenAI ChatGPT. If you'd rather like to chat with full featured ChatGPT, navigate here: **https://chat.openai.com/**.

## Features
- Chat bot
- Image bot
- Music bot (not yet implemented)
- Speech recognition (not yet implemented)
- Text to speech output (not yet implemented)

## Development status

Working version done. Additional functionality in development - please see [**TODO**](./TODO.md) file.

## Example

You can chat with our Telegram chat bot here: [**@libersoft_chatbot**](https://t.me/libersoft_chatbot)

## Installation

These are the installation instructions of this software for the different Linux distributions.

**IMPORTANT NOTE**: It is recommended to install this software on a clean OS installation, otherwise it may cause that other software previously installed on your server could stop working properly due to this. You are using this software at your own risk.

### Debian / Ubuntu Linux

Log in as "root" on your server and run the following commands to download the necessary dependencies and the latest version of this software from GitHub:

```console
apt update
apt -y upgrade
apt -y install git curl screen
curl -fsSL https://deb.nodesource.com/setup_19.x | bash -
apt -y install nodejs
git clone https://github.com/libersoft-org/telegram-chatbot.git
cd telegram-chatbot/src/
npm i
```

### CentOS / RHEL / Fedora Linux

Log in as "root" on your server and run the following commands to download the necessary dependencies and the latest version of this software from GitHub:

```console
dnf -y update
dnf -y install git curl screen
curl -fsSL https://rpm.nodesource.com/setup_19.x | bash -
dnf -y install nodejs
git clone https://github.com/libersoft-org/telegram-chatbot.git
cd telegram-chatbot/src/
npm i
```

## Configuration

After the installation is completed, follow these steps:

1. Get the **Telegram API token**:

- In Telegram application find this contact: **@BotFather** (or use this link: **https://t.me/BotFather**
- Write: **/start**, then **/newbot**, then enter the name of your bot. If you're successful, the BotFather will create an Telegram API token for your new chat bot. Copy this token and your bot's username, you will need it later.

2. Get the **OpenAI API token**

- Sign up and then log in to this website: **https://beta.openai.com/**
- After you're logged in, go to this link: **https://beta.openai.com/account/api-keys** and click on "Create new secret key". Copy this newly generated API key token too, you will need it later. 

3. Go back to your linux shell and create the app settings file using:

```console
node index.js --create-settings
```

This will create a settings file called **settings.json** and the app will ask you to enter your **Telegram API token** and **OpenAI API token** - enter them and they'll be saved to settings file. You can edit these tokens later, if you need.

The default OpenAI model in settings file is set to "**text-davinci-003**". If you'd like to use a different model, change it in settings file. You can find more information about models here: **https://beta.openai.com/docs/models/overview**.

## Run the application

Now you can run the application using:

```console
./start.sh
```

This will run the application on background in screen.

You can attach the server screen using:

```console
screen -x openai-telegram-chatbot
```

To detach screen press **CTRL+A** and then **CTRL+D**.

Alternatively you can run the app without using **screen** by:

```console
node index.js
```

To stop the server just press **CTRL+C**.

## Start using the chat bot

Open your Telegram app and find the username of your chat bot. Write **/start** to start the conversation and follow the instructions in bot's welcome message.

## License
- This software is developed as open source under [**Unlicense**](./LICENSE).

## Donations

Donations are important to support the ongoing development and maintenance of our open source projects. Your contributions help us cover costs and support our team in improving our software. We appreciate any support you can offer.

To find out how to donate our projects, please navigate here:

[![Donate](https://raw.githubusercontent.com/libersoft-org/documents/main/donate.png)](https://libersoft.org/donations)

Thank you for being a part of our projects' success!
