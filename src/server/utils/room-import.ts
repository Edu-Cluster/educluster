import authenticatedWebUntis from './untis';
import { prisma } from './prisma';
import { Room } from 'webuntis';

// Method must be explicitly called in a controller for the logic to be executed!

export const importRoomData = async () => {
  await authenticatedWebUntis.login();

  const rooms = await authenticatedWebUntis.getRooms();

  rooms.forEach((room: Room) => {
    if (room.longName === 'Klasse') {
      prisma.room.create({
        data: {
          untis_id: room.id.toString(),
          name: room.name,
          is_active: room.active,
        },
      });
    }
  });

  await authenticatedWebUntis.logout();
};
