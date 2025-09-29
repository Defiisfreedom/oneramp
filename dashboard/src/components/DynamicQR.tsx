'use client';
import React, { useState } from 'react';
import QRCode from 'qrcode.react';

interface QRData {
  accountNumber: string;
  bankCode: string;
  amount: number;
  description: string;
  reference: string;
}

const DynamicQR: React.FC<{ amount: number; onrampId: string }> = ({ amount, onrampId }) => {
  const [qrData, setQrData] = useState<string | null>(null);

  const generateQR = () => {
    const data: QRData = {
      accountNumber: '111111111', 
      bankCode: '02', // Ej. Banco Unión
      amount: amount,
      description: 'Onramp a USDT',
      reference: onrampId,
    };

    const simpleUri = `simplepay://pay?account=${data.accountNumber}&bank=${data.bankCode}&amount=${data.amount}&desc=${encodeURIComponent(data.description)}&ref=${data.reference}`;
    setQrData(simpleUri);
  };

  return (
    <div className="mt-4">
      <button
        onClick={generateQR}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Generar QR
      </button>
      {qrData && (
        <div className="mt-4">
          <p>Paga {amount} BOB vía $imple</p>
          <QRCode value={qrData} size={256} />
          <p>Escanea con tu app bancaria</p>
        </div>
      )}
    </div>
  );
};

export default DynamicQR; 