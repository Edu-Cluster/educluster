import { Server } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';

// https://stackoverflow.com/questions/18240512/stay-connected-to-socket-io-while-switching-pages

type Data = {
  response: string;
};

const prefix = 'WS::';

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  // @ts-ignore
  if (!res.socket.server.io) {
    console.log(`${prefix} Setting up socket...`);

    // @ts-ignore
    const io = new Server(res.socket.server);

    io.on('connection', (socket) => {
      socket.on('newUser', (username) => {
        socket.join(username);
        console.log(`${prefix} Joined room ${username}.`);
      });

      socket.on('sendNotification', ({ senderName, receiverName, type }) => {
        io.in(receiverName).emit('getNotification', {
          senderName,
          type,
        });
      });

      socket.on('disconnect', () => {
        console.log(`${prefix} disconnected.`);
      });
    });

    // @ts-ignore
    res.socket.server.io = io;
    res.status(200).end();
  }

  res.status(200).end();
}
