export enum statusCodes {
  FAILURE,
  SUCCESS,
  TENTATIVE,
}

export enum resources {
  USER = 'person',
  CLUSTER = 'cluster',
  APPOINTMENT = 'appointment',
  ROOM = 'room',
  SUBJECT = 'subject',
  TOPIC = 'topic',
}

export enum timeTypes {
  FROM,
  TO,
}

export enum conditionSatisfactionTypes {
  SATISFIED,
  SEMISATISFIED,
  UNSATISFIED,
}
