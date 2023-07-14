
const amqp = require('amqplib');
const axios = require('axios')
const rabbitParameter = {
    protocol: 'amqp',
    hostname: '172.18.0.2',
    port: '5672',
    username: 'guest',
    password: 'guest',
    vhost: '/'
}


async function connect_2_MQ() {
    const queue = 'message_queue'

    try{
    const conn = await amqp.connect(rabbitParameter);
    console.log("connection created")
    const channel = await conn.createChannel()
    console.log('channerl created')
    const res = await channel.assertQueue()

    await channel.consume(queue,(msg)=>{
        var secs = JSON.parse(msg.content.toString())

        console.log(" [x] Received %s", secs.num1,secs.num2);
        let result = ""
        if(secs.opt === 'add') {
           console.log("Inside ADD")
            console.log(typeof(secs.num1),typeof(secs.num2))
            result = String((Number(secs.num1) + Number(secs.num2)))
        }
        else if(secs.opt === 'mult') {
      console.log("Inside MULT")
            result = String((secs.num1 * secs.num2));
        }
        else {
            result = ""
        }
        setTimeout(async function() {
          await axios.post('http://Producer1:10001/result',{'result': result }).then(res=>{
            console.log(res.data, "OPERATION SUCCESSFULL")
          })
        },1000);
    },{noAck: true})
   
    }
    catch (err) {
        console.log(err)
        return "Connection Failed"
    }
}

connect_2_MQ()

// app.use(cors)
