const customConfig: {
  port: number;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  dbUri: string;
  accessTokenPrivateKey: string;
  refreshTokenPrivateKey: string;
  accessTokenPublicKey: string;
  refreshTokenPublicKey: string;
  school: string;
  schoolBaseUrl: string;
} = {
  port: 8000,
  accessTokenExpiresIn: 15, // In minutes
  refreshTokenExpiresIn: 60, // In minutes

  dbUri: process.env.DATABASE_URL as string,
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY as string,
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY as string,
  refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY as string,

  school: 'HTL Pinkafeld',
  schoolBaseUrl: 'euterpe.webuntis.com',
};

export default customConfig;
