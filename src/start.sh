#!/bin/sh

while true;
do
 screen -dmS telegram-chatbot node index.js && break;
done

