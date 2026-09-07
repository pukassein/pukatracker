// Banco Central do Brasil SGS series 27603: Taxa SML (real/guarani).
// The returned value is BRL for one PYG.
const BCB_SGS_URL = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.27603/dados/ultimos/1?formato=json';

export async function fetchPygToBrlRate(): Promise<{ rate: number; date: string }> {
  const response = await fetch(BCB_SGS_URL);
  if (!response.ok) throw new Error(`Banco Central request failed (${response.status})`);
  const rows = await response.json() as Array<{ data: string; valor: string }>;
  const latest = rows[0];
  const rate = Number(latest?.valor);
  if (!latest || !Number.isFinite(rate) || rate <= 0) throw new Error('Banco Central returned no valid PYG/BRL rate');
  return { rate, date: latest.data };
}
