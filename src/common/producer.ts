import client, { Connection, Channel } from 'amqplib';

class Producer{ 
    connection: Connection | null;
    channel: Channel | null;
    queue_name: string;
    exchange_name: string;
    binding_key: string;
    username: string;
    password: string;
    hostname: string;
    port: string | number;

    constructor(queue_name: string, exchange_name: string, username: string = 'username', password: string = 'password', hostname: string = 'localhost', port: number = 5672){ 
        this.connection = null;
        this.channel = null;
        this.username = username;
        this.password = password;
        this.hostname = hostname;
        this.port = port;
        this.queue_name = queue_name;
        this.exchange_name = exchange_name;
        this.binding_key = queue_name;
    }

    async connect(): Promise<number | void>{ 
        try{
            // connect to the rabbitmq server
            this.connection = await client.connect(`amqp://${this.username}:${this.password}@${this.hostname}:${this.port}`);

            // create a new channel 
            this.channel = await this.connection.createChannel();

            // create an exchange with support for delayed messages
            this.channel.assertExchange(this.exchange_name, "x-delayed-message", { 
                arguments: { 'x-delayed-type':  "direct" } 
            });

            // bind a queue to the exchange 
            this.channel.assertQueue(this.queue_name!, { durable: true });

            // bind the queue to the exchange 
            this.channel.bindQueue(this.queue_name, this.exchange_name, this.binding_key);

            console.log("Producer connected to rabbitmq broker!");
        }
        catch(err){
            console.log(err);
            return -1;
        }
    }

    async sendmessage(message: string, delay: number = 0): Promise<void> {
        this.channel!.publish(this.exchange_name!, this.binding_key, Buffer.from(message), { headers: { "x-delay": delay } }); 
        console.log("Sent message to queue!");
    }   

    async sendmessages(messages: Array<string>): Promise<void>{ 
        for(let message of messages){
            this.channel?.sendToQueue(this.queue_name!, Buffer.from(message)); 
            console.log("Sent message to queue!");
        }
    }
}

export default Producer;