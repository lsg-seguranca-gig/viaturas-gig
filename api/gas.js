// /api/gas.js
// Handler para Serverless Functions (Vercel, Netlify, etc.)

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyGrfIj2JYZZ1PJwi8giGdOzz_-mPFvNqVc4F5zWF_9-O3_m5SADvLMUHscc8VUE_cSNQ/exec";

export default async function handler(req, res) {
  // Configurações de CORS para aceitar chamadas do frontend
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Trata a requisição OPTIONS (Preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 1. REQUISIÇÃO GET: Buscar listas de Veículos, Motoristas e Controladores
    if (req.method === 'GET') {
      const response = await fetch(SCRIPT_URL);
      const data = await response.json();
      return res.status(200).json(data);
    }

    // 2. REQUISIÇÃO POST: Enviar novo registro de Saída ou Retorno
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

    // Método não suportado
    return res.status(405).json({ error: 'Método não permitido.' });

  } catch (error) {
    console.error('Erro no Serverless Proxy:', error);
    return res.status(500).json({ 
      error: 'Erro interno ao se comunicar com o Google Apps Script.', 
      details: error.message 
    });
  }
}
