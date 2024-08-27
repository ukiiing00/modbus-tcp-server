import Modbus from 'modbus';
import mqtt from 'mqtt';

const protocol = 'mqtt';
const host = 'broker.emqx.io';
const port = '1883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `${protocol}://${host}:${port}`;
const topic = '/nodejs/mqtt/*';

const slave = new Modbus('10.10.10.90', '502', '1');
const mqtt_client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
});

let arr = [];

setInterval(function () {
    slave.read('ir1-2', (err, res) => {
        console.log('res:', res);
        arr = res;
    });

    mqtt_client.publish(
        topic,
        arr.join(','),
        { qos: 2, retain: false },
        (error) => {
            if (error) {
                console.error(error);
            }
        }
    );
}, 3000);

mqtt_client.on('connect', () => {
    console.log('Connected');
    mqtt_client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`);
    });
});

mqtt_client.on('message', (topic, payload) => {
    console.log('Received Message:', topic, `${payload}`);
});
