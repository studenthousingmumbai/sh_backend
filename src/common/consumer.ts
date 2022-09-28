import client, { Connection, Channel, ConsumeMessage } from 'amqplib'

class Consumer{ 
    connection: Connection | null;
    channel: Channel | null;
    queue_name: string | null;
    username: string;
    password: string;
    hostname: string;
    port: string | number;
    onMessage: (msg: ConsumeMessage | null) => void;

    constructor(queue_name: string, username: string = 'username', password: string = 'password', hostname: string = 'localhost', port: number = 5672){ 
        this.connection = null;
        this.channel = null;
        this.username = username;
        this.password = password;
        this.hostname = hostname;
        this.port = port;
        this.queue_name = queue_name;
        this.onMessage = (msg: ConsumeMessage | null): void => { }
    }

    async connect(): Promise<number | void>{ 
        try{ 
            // connect to the rabbitmq server
            this.connection = await client.connect(`amqp://${this.username}:${this.password}@${this.hostname}:${this.port}`);

            // create a new channel 
            this.channel = await this.connection.createChannel();

            // fetch max 100 messages at once from the message broker 
            this.channel.prefetch(100);

            // create a new queue 
            await this.channel.assertQueue(this.queue_name!, { durable: true });

            // add the message handler 
            this.channel.consume(this.queue_name!, this.onMessage);

            console.log("Consumer connected to rabbitmq broker!");
        }
        catch(err){
            console.log(err);
            return -1;
        }
    }

    // gets one single message from the message broker 
    async dequeueMessage(): Promise<any> { 
        return await this.channel!.get(this.queue_name!);
    }
}

export default Consumer;