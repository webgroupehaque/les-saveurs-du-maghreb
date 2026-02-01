import { Handler } from '@netlify/functions';

export const handler: Handler = async () => {
  const orderNumber = String(Math.floor(1000 + Math.random() * 9000));
  
  return {
    statusCode: 200,
    body: JSON.stringify({ orderNumber }),
  };
};
