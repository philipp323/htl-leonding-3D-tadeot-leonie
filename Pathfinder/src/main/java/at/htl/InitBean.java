package at.htl;

import org.eclipse.paho.client.mqttv3.*;
import org.json.JSONObject;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.Initialized;
import javax.enterprise.event.Observes;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import java.util.UUID;

@ApplicationScoped
public class InitBean {
    private Client client;
    private WebTarget target;
    private String API_URL = "http://vm90.htl-leonding.ac.at:8080/path/shortest?";

    private String publisherId = UUID.randomUUID().toString();
    private String MQTT_URL = "tcp://leonie.htl-leonding.ac.at:1883";
    private String Topic = "path";
    IMqttClient mqttClient = null;



    private void init(@Observes @Initialized(ApplicationScoped.class) Object init) throws MqttException, InterruptedException {

        mqttClient = new MqttClient(MQTT_URL,publisherId);

        MqttConnectOptions options = new MqttConnectOptions();
        options.setAutomaticReconnect(true);
        options.setCleanSession(true);
        options.setConnectionTimeout(10);
        client = ClientBuilder.newClient();


        mqttClient.connect(options);
        mqttClient.subscribe(Topic);

        if (mqttClient.isConnected())
        {
            System.err.println("Client is connected to Broker: "+MQTT_URL+" and to topic: "+Topic);
        }
        else
            System.err.println("Client could not connect!");


        mqttClient.setCallback(new MqttCallback() {
            @Override
            public void connectionLost(Throwable throwable) {
                System.err.println("Mqtt client lost connection");
            }

            @Override
            public void messageArrived(String s, MqttMessage mqttMessage) throws Exception {
                System.out.println("Message arrived");
                if (!mqttClient.isConnected())
                {
                    System.err.println("MQTT Client is not connected");
                    return;
                }
                MqttMessage msg = new MqttMessage(mqttMessage.getPayload());
                msg.setQos(2);
                msg.setRetained(false); //falls die Nachricht bleiben soll -> true


                JSONObject jo = new JSONObject(new String(msg.getPayload()));
                String from = jo.getString("from");
                String to = jo.getString("to");
                String system = jo.getString("system");

                try {
                    target = client.target(API_URL)
                            .queryParam("start",from)
                            .queryParam("end",to);

                    String  apiResponse =  target
                            .request(MediaType.APPLICATION_JSON)
                            .get(String.class);


                    MqttMessage response = new MqttMessage(apiResponse.getBytes());
                    response.setQos(1);
                    response.setRetained(false);


                    mqttClient.publish(Topic+"/result/"+system,response);
                } catch (Exception e) {
                    e.printStackTrace();
                    System.err.println("Fehler geworfen");
                }

            }

            @Override
            public void deliveryComplete(IMqttDeliveryToken iMqttDeliveryToken) {
                System.out.println("Message delivered");
            }

        });
    }

}
