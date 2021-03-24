import { NextApiHandler } from 'next';

const health: NextApiHandler = (req, res) => res.end('OK');

export default health;
