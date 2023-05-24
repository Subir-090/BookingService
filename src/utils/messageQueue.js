const amqplib = require('amqplib');
const { MESSAGE_BROKER_URL, EXCHANGE_NAME } = require('../config/serverConfig');

async function createChannel() {
    try {
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);
        const channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME,'direct',false);
        return channel;
    } catch (error) {
        throw error;
    }
}

async function publishMessage(channel,binding_key,message) {
    try {
        await channel.assertQueue('QUEUE_NAME');
        await channel.publish(EXCHANGE_NAME,binding_key, Buffer.from(message));
    } catch (error) {
        throw error;
    }
}

async function consumeMessage(channel,binding_key) {
    try {
        const applicationQueue = await channel.assertQueue('QUEUE_NAME');
        channel.bindQueue(applicationQueue.Queue,EXCHANGE_NAME, binding_key);
        channel.consume(applicationQueue.queue, (msg) => {
            console.log("received data");
            console.log(msg.content.toString());
            channel.ack(msg);
        });
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createChannel,
    publishMessage,
    consumeMessage
}