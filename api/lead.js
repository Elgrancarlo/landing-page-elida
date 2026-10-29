// Rota serverless (Vercel): recebe o lead da landing, salva no Supabase e
// dispara o webhook do n8n com o id gerado. Sem dependências (usa fetch nativo
// do Node 18+). Os segredos ficam em variáveis de ambiente no Vercel.
//
// Variáveis de ambiente necessárias (Vercel > Project > Settings > Environment Variables):
//   SUPABASE_URL                 ex: https://xxxxxxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY    a chave service_role (NUNCA a anon, NUNCA no front)
//   SUPABASE_TABLE               opcional, padrao: leads
//   N8N_WEBHOOK_URL              URL de producao do webhook do n8n

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const TABLE = process.env.SUPABASE_TABLE || "leads";
  const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

  // body vem como objeto (Content-Type: application/json). Se vier string, parseia.
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const nowIso = new Date().toISOString();
  const evento = body.evento || "lead";
  const phone_e164 = (body.phone_e164 || "").trim();

  // Linha para o Supabase. Campos vazios sao removidos para o upsert nao
  // sobrescrever dados bons com vazio em eventos posteriores (quiz_parcial/quiz).
  const row = {
    nome: body.nome,
    phone: body.phone,
    phone_e164: phone_e164,
    email: body.email,
    evento: evento,
    score: body.score != null && body.score !== "" ? Number(body.score) : undefined,
    temperatura: body.temperatura,
    perguntas_respondidas:
      body.perguntas_respondidas != null && body.perguntas_respondidas !== ""
        ? Number(body.perguntas_respondidas)
        : undefined,
    meta_90_dias: body.meta_90_dias,
    maior_trava: body.maior_trava,
    ja_investiu: body.ja_investiu,
    decisao: body.decisao,
    intencao_live: body.intencao_live,
    utm_source: body.utm_source,
    utm_medium: body.utm_medium,
    utm_campaign: body.utm_campaign,
    utm_content: body.utm_content,
    utm_term: body.utm_term,
    utm_id: body.utm_id,
    fbclid: body.fbclid,
    url: body.url,
    slug: body.slug,
    updated_at: nowIso,
  };
  Object.keys(row).forEach((k) => {
    if (row[k] === undefined || row[k] === null || row[k] === "") delete row[k];
  });

  let saved = null;

  // 1) Salva no Supabase (upsert por phone_e164 => um lead vira uma linha que
  //    vai sendo enriquecida a cada etapa; sem duplicar).
  if (SUPABASE_URL && SERVICE_KEY && phone_e164) {
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/${TABLE}?on_conflict=phone_e164`,
        {
          method: "POST",
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "resolution=merge-duplicates,return=representation",
          },
          body: JSON.stringify([row]),
        }
      );
      const text = await r.text();
      if (r.ok) {
        const arr = JSON.parse(text);
        saved = Array.isArray(arr) ? arr[0] : arr;
      } else {
        console.error("[lead] supabase erro", r.status, text);
      }
    } catch (e) {
      console.error("[lead] supabase falhou", e);
    }
  } else if (!phone_e164) {
    return res.status(400).json({ error: "sem_telefone" });
  }

  // 2) Dispara o webhook do n8n apenas na 1a captura (evento "lead"), com o id ja gerado.
  if (N8N_WEBHOOK_URL && saved && saved.id && evento === "lead") {
    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: saved.id,
          nome: saved.nome || body.nome || "",
          telefone: saved.phone_e164 || phone_e164,
          timestamp: saved.created_at || nowIso,
          email: saved.email || body.email || "",
        }),
      });
    } catch (e) {
      console.error("[lead] webhook n8n falhou", e);
    }
  }

  return res.status(200).json({ ok: true, id: saved ? saved.id : null });
}
