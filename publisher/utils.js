async function connect_2_MQ(ampq) {
    try{
        const conn = ampq.connect();
    }
    catch (err) {
        console.log(err)
    }
}

export {connect_2_MQ}