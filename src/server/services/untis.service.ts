import authenticatedWebUntis from '../utils/untis';

export const isRoomAvailable = async (
  untisId: number,
  from: Date,
  to: Date,
) => {
  let fromDate: number;
  let fromMonth = (from.getMonth() + 1).toString();
  let fromDay = from.getDate().toString();

  fromMonth = fromMonth.length === 1 ? `0${fromMonth}` : fromMonth;
  fromDay = fromDay.length === 1 ? `0${fromDay}` : fromDay;
  fromDate = Number(`${from.getFullYear()}${fromMonth}${fromDay}`);

  let toDate: number;
  let toMonth = (to.getMonth() + 1).toString();
  let toDay = to.getDate().toString();

  toMonth = toMonth.length === 1 ? `0${toMonth}` : toMonth;
  toDay = toDay.length === 1 ? `0${toDay}` : toDay;
  toDate = Number(`${to.getFullYear()}${toMonth}${toDay}`);

  const fromTime = Number(`${from.getHours()}${from.getMinutes()}`);
  const toTime = Number(`${to.getHours()}${to.getMinutes()}`);

  await authenticatedWebUntis.login();

  const timetable = await authenticatedWebUntis.getTimetableForRange(
    from,
    to,
    untisId,
    4,
  );
  let alreadyBooked;

  if (fromDate === toDate) {
    alreadyBooked = timetable.find(
      (lesson) =>
        lesson.date === fromDate &&
        (lesson.startTime < fromTime || lesson.endTime > toTime),
    );

    await authenticatedWebUntis.logout();

    return !alreadyBooked;
  } else {
    let iterator = fromDate;
    let freeSlots: number[] = [];

    while (iterator <= toDate) {
      const alreadyBooked = timetable.find(
        (lesson) =>
          lesson.date === fromDate &&
          (lesson.startTime < fromTime || lesson.endTime > toTime),
      );

      if (!alreadyBooked) {
        freeSlots.push(iterator);
      }

      ++iterator;
    }

    await authenticatedWebUntis.logout();

    return freeSlots.length ? freeSlots : false;
  }
};
