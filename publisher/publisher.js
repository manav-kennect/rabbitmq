const amqp = require('amqplib')
const express = require('express')
const cors = require('cors');
const { json } = require('express');
const PORT =  10001
const app = express();
const rabbitParameter = {
    protocol: 'amqp',
    hostname: '172.18.0.2',
    port: '5672',
    username: 'guest',
    password: 'guest',
    vhost: '/'
}


async function connect_2_MQ() {
    try{
    const conn = await amqp.connect(rabbitParameter);
    console.log("connection created")
    return conn
   
    }
    catch (err) {
        console.log(err)
        return "Connection Failed"
    }
}

// connect_2_MQ()

// app.use(cors)
app.use(express.json())
app.get('/',async (req,res,err)=>{
res.send('<h1>Welcome to RabbitMQ Message API</h1><br/><h1>Direct to /math/add?num1=value1&num2=value2 to add both number OR</h1><br/><h1>Direct to /math/mult?num1=value1&num2=value2 to multiply both number</h1>')})
app.get('/math/:opt',async (req,res)=>{
    const queue = 'message_queue'
    const msg = [{'name':"first"},{"name":"secondd"},{"name":"third"}]
    const msg2 = ["first","second",'third']
    console.log(req.params)
    req.query.opt = req.params.opt
    const messages = req.query
    console.log("QUERY PARAM", messages)
    if(Object.keys(req.query).length ===0) {
        res.send('alert("Please enter Number for operations as query params")')
    }
    else {
    try{
        console.log(req.query)
        const conn_transaction = await connect_2_MQ()
        const channel = await conn_transaction.createChannel()
        console.log("Channel Created")
        const res = channel.assertQueue(queue,{
            durable: true
          });
        console.log('queue created')
        // for(let ms in msg ) {
            await channel.sendToQueue(queue, Buffer.from(JSON.stringify(messages)), {
            persistent: true
        })
        // console.log("MESSAGE SENT TO QUEUEU")
    // }
    }
    catch (err) {
        console.log(err)

    }
    }
}) 

app.post(`/result`,(req,res) =>{
    console.log(req.body)
    res.json({"result": "recieved"})
})

app.listen(PORT, ()=>{
    console.log("Server Started at "+ `${PORT}`)
})
