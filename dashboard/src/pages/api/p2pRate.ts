import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.get(
      'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search?asset=USDT&fiat=BOB&tradeType=BUY&transAmount=100&payTypes=[]&page=1&rows=10',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const offers = response.data.data;
    if (offers && offers.length > 0) {
      const topOffers = offers.slice(0, 5);
      const averageRate = topOffers.reduce((sum, offer) => sum + parseFloat(offer.adv.price), 0) / topOffers.length;
      res.status(200).json({ rate: averageRate });
    } else {
      res.status(200).json({ rate: 12.59 }); // Fallback actualizado a tu dato de hoy
    }
  } catch (error) {
    console.error('Error fetching P2P rate:', error);
    res.status(200).json({ rate: 12.59 }); // Fallback si falla
  }
}