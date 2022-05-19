import socket
import logging

server = 'irc.chat.twitch.tv'
port = 6667
nickname = 'learndatasci'
token = 'oauth:0fbzrr2svxhwmh6kxd0mixcsxd1q0c'
channel = '#kabhaal'
sock = socket.socket()
sock.connect((server, port))
sock.send(f"PASS {token}\n".encode('utf-8'))
sock.send(f"NICK {nickname}\n".encode('utf-8'))
sock.send(f"JOIN {channel}\n".encode('utf-8'))
resp = sock.recv(2048).decode('utf-8')


logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s — %(message)s',
                    datefmt='%Y-%m-%d_%H:%M:%S',
                    handlers=[logging.FileHandler('chat.log', encoding='utf-8')])
logging.info(resp)

from emoji import demojize

while True:
    resp = sock.recv(2048).decode('utf-8')

    if resp.startswith('PING'):
        sock.send("PONG\n".encode('utf-8'))

    elif len(resp) > 0:
        logging.info(demojize(resp))
        print(resp)