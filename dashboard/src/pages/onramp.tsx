'use client';
import { useState, useEffect } from 'react';
import { FIAT_CURRENCIES } from '../config/fiatCurrencies';
import axios from 'axios';
import DynamicQR from '../components/DynamicQR';

export default function OnrampPage() {
  const [selectedFiat, setSelectedFiat] = useState('USD');
  const [amount, setAmount] = useState(100);
  const [rate, setRate] = useState<number | null>(null);
  const onrampId = 'tx_' + Date.now();

  // Función para obtener la tasa de cambio desde la API route
  async function fetchRate() {
    try {
      console.log('Fetching rate from local API...');
      const response = await axios.get('/api/p2pRate');
      console.log('API response:', response.data);
      const rate = response.data.rate;
      setRate(rate);
    } catch (error) {
      console.error('Error fetching rate from local API:', error);
      setRate(12.59); // Fallback actualizado a tu dato de hoy
    }
  }

  useEffect(() => {
    fetchRate(); // Llama inmediatamente al cambiar moneda

    // Intervalo para actualizaciones frecuentes (cada 30 segundos) por volatilidad del BOB
    const interval = setInterval(fetchRate, 30000); // 30 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, [selectedFiat]); // Se ejecuta al cambiar la moneda

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Onramp</h1>
      <label className="block mt-4">Selecciona moneda:</label>
      <select
        value={selectedFiat}
        onChange={(e) => setSelectedFiat(e.target.value)}
        className="border p-2 rounded"
      >
        {FIAT_CURRENCIES.map(currency => (
          <option key={currency.code} value={currency.code}>
            {currency.symbol} {currency.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Monto en BOB"
        className="border p-2 rounded mt-2 block"
      />
      {rate && (
        <p className="mt-2">
          1 USDT = {rate.toFixed(2)} {selectedFiat} (Actualizado en tiempo real)
        </p>
      )}
      <DynamicQR amount={amount} onrampId={onrampId} />
    </div>
  );
}