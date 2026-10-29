# Guia de deploy — Landing "Black Infinita" (Elida)

Landing de captura. Quando a pessoa se cadastra, o sistema **salva no Supabase** e
**envia um webhook pro n8n** com `id`, `nome`, `telefone`, `timestamp` e `email`.
O código já está pronto e testado — faltam só os passos abaixo, que são feitos na
**sua conta** (dono/admin do projeto).

**Repositório:** https://github.com/Elgrancarlo/landing-page-elida

---

## Antes de começar

Você precisa de **acesso a este repositório no GitHub**. A Rebeca vai te adicionar
como colaborador (você recebe um convite por e-mail do GitHub) — **aceite o convite**
antes de seguir.

Os **valores das variáveis de ambiente** (chaves do Supabase e URL do n8n) a Rebeca
te envia **em separado** (eles não ficam no repositório, por segurança).

---

## Passo 1 — Conectar o repositório ao projeto no Vercel

**Recomendado: usar o mesmo projeto que já serve o `black.elidadias.org`** (assim o
domínio continua no ar, sem precisar mexer).

1. Abra o projeto no Vercel → **Settings → Git**.
2. Clique em **Connect Git Repository**.
3. Escolha **Elgrancarlo/landing-page-elida**.
   - Se o Vercel não enxergar o repositório, clique em **Adjust GitHub App Permissions**
     e dê acesso a esse repositório.

> Se preferir criar um projeto novo (Add New → Project → Import), depois você precisa
> **mover o domínio** `black.elidadias.org` para o projeto novo em Settings → Domains.
> Por isso o caminho mais simples é conectar no projeto que já existe.

---

## Passo 2 — Variáveis de ambiente

No projeto → **Settings → Environment Variables**, adicione as 4 abaixo
(marque **Production** e **Preview**):

| Nome | Valor |
|------|-------|
| `SUPABASE_URL` | *(enviado pela Rebeca)* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(enviado pela Rebeca)* |
| `N8N_WEBHOOK_URL` | *(enviado pela Rebeca)* |
| `SUPABASE_TABLE` | `leads` |

---

## Passo 3 — Banco de dados (Supabase)

A tabela **`leads` já foi criada e testada**. Você não precisa fazer nada aqui.
(Só é necessário rodar o arquivo `supabase.sql` de novo se for usar **outro** projeto
Supabase.)

---

## Passo 4 — Publicar

Vá em **Deployments** → no último deploy, menu **⋯ → Redeploy**.
(A partir daí, qualquer alteração enviada ao repositório publica sozinha.)

---

## Passo 5 — Testar

1. Abra o site no ar e preencha o formulário com **seus próprios dados**.
2. Confira:
   - **Supabase** → tabela `leads`: deve aparecer uma linha nova com seu nome/telefone.
   - **n8n** → aba **Executions**: deve aparecer uma execução nova com os campos.

Deu certo nos dois? Está no ar. 🚀

---

## Qualquer ajuste

Precisou mudar nome de campo, formato do telefone, incluir outro dado no webhook, etc.,
é só falar com a Rebeca — a alteração é feita no arquivo `api/lead.js` e publica no próximo deploy.
