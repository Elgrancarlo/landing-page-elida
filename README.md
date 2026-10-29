# Landing Page — Black Infinita (Elida)

Página de captura (quiz WhatsApp → nome → e-mail → perguntas). Ao se cadastrar:

1. O navegador envia os dados para **/api/lead** (rota serverless no Vercel).
2. A rota **salva no Supabase** (upsert por telefone, sem duplicar).
3. Na primeira captura, a rota **dispara o webhook do n8n** com `id`, `nome`, `telefone`, `timestamp` (e `email`).

A `service_role` do Supabase fica só no servidor (variável de ambiente), nunca no navegador.

## Estrutura

- `index.html` — a página (HTML/CSS/JS únicos) + `assets/` (imagens, vídeos, fontes)
- `api/lead.js` — rota que salva no Supabase e dispara o n8n
- `supabase.sql` — schema da tabela `leads` (rode no SQL Editor do Supabase)
- `.env.example` — variáveis de ambiente necessárias

## Setup (1x)

1. **Supabase:** rode o conteúdo de `supabase.sql` no SQL Editor para criar a tabela `leads`.
2. **Vercel → Project → Settings → Environment Variables:** adicione
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_TABLE` (opcional, padrão `leads`)
   - `N8N_WEBHOOK_URL`
3. **Deploy.** Conecte este repositório ao projeto no Vercel (ou `vercel --prod`).

## Webhook enviado ao n8n (POST JSON)

```json
{
  "id": "uuid gerado pelo Supabase",
  "nome": "Maria",
  "telefone": "+5562988887777",
  "timestamp": "2026-11-01T12:34:56.000Z",
  "email": "maria@email.com"
}
```
