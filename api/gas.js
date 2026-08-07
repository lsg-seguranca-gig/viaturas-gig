// /api/gas.js
// Handler Serverless para Vercel / Node.js

export default async function handler(req, res) {
  // Configuração de CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Trata a requisição preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Leitura da variável de ambiente configurada na Vercel / .env.local
  const SCRIPT_URL = process.env.GAS_URL;

  if (!SCRIPT_URL) {
    return res.status(500).json({ 
      error: 'Variável de ambiente GAS_URL não encontrada. Configure-a na Vercel ou no arquivo .env.local.' 
    });
  }

  try {
    // 1. REQUISIÇÃO GET: Busca as listas de Veículos, Motoristas e Controladores
    if (req.method === 'GET') {
      const response = await fetch(SCRIPT_URL);
      const data = await response.json();
      return res.status(200).json(data);
    }

    // 2. REQUISIÇÃO POST: Envia registros de Saída e Retorno para o Google Sheets
    if (req.method === 'POST') {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();
      return res.status(200).json(data);
    }

    // Método HTTP não permitido
    return res.status(405).json({ error: 'Método não permitido.' });

  } catch (error) {
    console.error('Erro no Serverless Proxy:', error);
    return res.status(500).json({ 
      error: 'Erro interno ao se comunicar com o Google Apps Script.', 
      details: error.message 
    });
  }
}
