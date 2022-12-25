export enum statusCodes {
  FAILURE,
  SUCCESS,
  TENTATIVE,
}

export enum roles {
  ADMINISTRATOR = 'Administrator',
  STUDENT = 'Schüler',
  TEACHER = 'Professor',
}

export enum resources {
  USER = 'person',
  CLUSTER = 'cluster',
  APPOINTMENT = 'appointment',
  SUBJECT = 'subject',
  TOPIC = 'topic',
}

export enum timeTypes {
  FROM,
  TO,
}
