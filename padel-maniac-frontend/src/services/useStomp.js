import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useEffect, useRef, useState } from 'react';

export function useStomp(topic) {
    const clientRef = useRef(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log('STOMP connected');

                client.subscribe(topic, (message) => {
                    setMessages(JSON.parse(message.body));
                });
            },
            onStompError: (frame) => {
                console.error('Broker error:', frame.headers['message']);
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [topic]);

    const sendMessage = (destination, body) => {
        if (clientRef.current?.connected) {
            clientRef.current.publish({
                destination,
                body: JSON.stringify(body),
            });
        }
    };

    return { messages, sendMessage };
}
