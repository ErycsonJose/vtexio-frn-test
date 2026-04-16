# frncubo.service

App VTEX IO do tipo **Node Service** responsável por expor endpoints customizados para o storefront. Atualmente gerencia a consulta e filtragem de promoções ativas da plataforma VTEX.

---

## Contexto

O VTEX IO não expõe diretamente uma API de promoções ativas para o frontend. Este serviço atua como middleware entre o storefront e a API privada de promoções (`/api/rnb/pvt`), realizando:

1. Listagem de todas as promoções via API VTEX
2. Filtragem das promoções realmente ativas (período vigente, não arquivadas, status `active`)
3. Busca dos detalhes completos de cada promoção ativa em paralelo
4. Retorno de um payload normalizado e pronto para consumo pelo frontend

---

## Estrutura

```
services/
├── node/
│   ├── __tests__/              # Testes unitários
│   │   ├── __mocks__/          # Mock do @vtex/api
│   │   ├── fixtures.ts         # Dados de exemplo baseados na API real
│   │   ├── getActivePromotions.test.ts
│   │   └── promotionsClient.test.ts
│   ├── clients/
│   │   ├── index.ts            # Registro dos clients no IOClients
│   │   └── promotions.ts       # Client HTTP para a API de promoções
│   ├── helpers/
│   │   └── appConfigs.ts       # Leitura segura das configurações do app
│   ├── middlewares/
│   │   ├── get-app-configs.ts  # Middleware de leitura de settings
│   │   └── getActivePromotions.ts  # Middleware principal
│   ├── typings/
│   │   └── promotion.ts        # Interfaces TypeScript
│   ├── index.ts                # Entry point do Service
│   ├── service.json            # Definição de rotas e recursos
│   └── package.json
├── docs/
│   └── README.md
└── manifest.json
```

---

## Endpoint

### `GET /_v/promotions/active`

Retorna todas as promoções ativas no momento da requisição.

**Critérios de filtragem:**
- `isActive === true`
- `isArchived === false`
- `status === 'active'`
- `beginDate <= now`
- `endDate >= now` (ou ausente, para promoções sem data de expiração)

**Exemplo de resposta:**

```json
[
  {
    "id": "094e0db6-0c4b-48a3-9db6-681963dd1543",
    "name": "Promoção Beauty Fest",
    "startDate": "2025-05-24T06:00:00Z",
    "endDate": "2025-05-26T06:00:00Z",
    "paymentMethods": [
      { "id": "207", "name": "Pago en cuotas BAC (207)" }
    ],
    "scope": {
      "collections": [{ "id": "22576", "name": "Beauty Fest Cosméticos" }],
      "brands": [],
      "products": [],
      "skus": [],
      "categories": []
    }
  }
]
```

**Códigos de resposta:**

| Status | Descrição |
|--------|-----------|
| `200` | Sucesso — retorna array (pode ser vazio) |
| `500` | Erro interno ao consultar a API VTEX |

---

## Configuração

As credenciais da API VTEX são configuradas via **App Settings** no Admin VTEX em:
`Apps > frncubo.service > Configurações`

| Campo | Descrição |
|-------|-----------|
| `serviceAppKey` | `X-VTEX-API-AppKey` para autenticação na API de promoções |
| `serviceAppToken` | `X-VTEX-API-AppToken` para autenticação na API de promoções |

---

## Como executar

### Pré-requisitos

- [VTEX Toolbelt](https://developers.vtex.com/docs/guides/vtex-io-documentation-vtex-io-cli-installation-and-command-reference) instalado
- Conta VTEX com workspace de desenvolvimento
- Node.js 16.x

### Desenvolvimento

```bash
# Dentro da pasta services/
vtex link
```

O comando sobe o app no workspace ativo e exibe os logs em tempo real. O endpoint ficará disponível em:

```
https://{workspace}--{account}.myvtex.com/_v/promotions/active
```

### Testes

```bash
# Dentro da pasta services/node/
yarn test
```

Os testes cobrem:
- Filtragem de promoções por todos os critérios de `isActive`
- Mapeamento do retorno da API para o shape de resposta
- Comportamento do client (`listAll` e `getById`)
- Tratamento de erros e resiliência a falhas individuais

### Lint

```bash
# Dentro da pasta services/node/
yarn lint
```

---

## Performance

- Requisições ao `getById` são feitas em **lotes de 5** (`CONCURRENCY_LIMIT`) via `Promise.allSettled`, evitando rate limit da API VTEX
- Falhas individuais em `getById` são ignoradas silenciosamente — a promoção é descartada e as demais são retornadas normalmente
- O `service.json` define `ttl: 10` para cache da resposta no edge por 10 segundos

---

## Políticas de acesso (`manifest.json`)

```json
{
  "name": "outbound-access",
  "attrs": {
    "host": "{accountName}.vtexcommercestable.com.br",
    "path": "/api/rnb/*"
  }
}
```

Necessária para que o builder-hub autorize chamadas à API privada de promoções da VTEX.
