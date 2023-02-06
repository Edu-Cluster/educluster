import type { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'cookies-next';

type Data = {
  response: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  console.log(req.body, req.query);
  setCookie('notification', req.query, {
    req,
    res,
    expires: new Date(Date.now() + 60 * 1000),
  });

  res.status(200).json({ response: '[accepted]' });
}
