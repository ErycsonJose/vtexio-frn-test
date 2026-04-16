# frn-template

Monorepo VTEX IO para a loja **FRN**, gerenciado com **Lerna** e **Yarn Workspaces**. O projeto é composto por três apps independentes que trabalham em conjunto para entregar a experiência completa da loja.

---

## Arquitetura

```
frn-template/
├── custom/        → frncubo.custom-components  (React — componentes customizados)
├── services/      → frncubo.service             (Node — middleware e APIs)
└── storetheme/    → frncubo.frn-template        (Store Theme — blocos e estilos)
```

Cada pasta é um app VTEX IO independente com seu próprio `manifest.json` e pode ser linkado separadamente. O monorepo centraliza scripts, dependências de desenvolvimento e configurações compartilhadas.

---

## Apps

### `custom/` — frncubo.custom-components

App React responsável pelos componentes customizados da loja. Expõe blocos para uso no Store Theme via `store/interfaces.json`.

| Bloco | Componente | Descrição |
|-------|-----------|-----------|
| `custom-promotions` | `Promotions` | Tab layout de promoções ativas com produtos por aba |
| `custom-example` | `Example` | Componente de exemplo |

O componente `Promotions` consome o endpoint `/_v/promotions/active` do app `frncubo.service`, renderiza uma aba por promoção ativa e executa queries GraphQL (`productSearch` ou `productsByIdentifier`) sob demanda ao clicar em cada aba.

---

### `services/` — frncubo.service

App Node responsável pelo middleware de promoções. Expõe um endpoint REST que consulta a API privada da VTEX, filtra as promoções vigentes e retorna um payload normalizado para o frontend.

**Endpoint disponível:**

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/_v/promotions/active` | Retorna promoções ativas com escopo e métodos de pagamento |

Consulte `services/docs/README.md` para documentação completa do endpoint e configuração de credenciais.

---

### `storetheme/` — frncubo.frn-template

Store Theme que define a estrutura de blocos e estilos da loja. Utiliza os componentes do `frncubo.custom-components` e consome os dados do `frncubo.service` indiretamente via componentes React.

Os estilos são escritos em **SCSS** com variáveis e mixins centralizados em `styles/sass/utils/` e compilados via **Gulp**.

Consulte `storetheme/docs/README.md` para documentação completa de blocos e estilos.

---

## Pré-requisitos

- [VTEX Toolbelt](https://developers.vtex.com/docs/guides/vtex-io-documentation-vtex-io-cli-installation-and-command-reference)
- Node.js 16.x
- Yarn 1.22.x
- Acesso à conta VTEX `frncubo`

---

## Instalação

```bash
# Na raiz do monorepo
yarn install
```

O `postinstall` instala automaticamente as dependências do app `custom`.

---

## Como executar

### Autenticar e criar workspace

```bash
vtex login frncubo
vtex use {nome-do-workspace}
```

### Linkar todos os apps simultaneamente

```bash
# Na raiz do monorepo
yarn vlink
```

Esse comando sobe `custom` e `storetheme` em paralelo via `concurrently`, além de iniciar o Gulp para compilação do SCSS.

### Linkar apps individualmente

```bash
yarn vlink:custom        # custom/
yarn vlink:storetheme    # storetheme/
yarn vlink:services      # services/
```

### Relinkar em caso de erro

```bash
yarn vfix:custom         # vtex unlink + vtex link no custom
yarn vfix:storetheme     # vtex unlink + vtex link no storetheme
yarn vfix:services       # vtex unlink + vtex link no services
```

### Compilar estilos (SCSS)

```bash
yarn vlink:storetheme:build   # Gulp watch — recompila ao salvar
```

---

## Testes

```bash
# Dentro de services/node/
yarn test
```

Cobre o middleware `getActivePromotions` e o client `PromotionsClient` com 27 testes unitários.

---

## Lint

```bash
yarn lint           # Roda lint em custom e storetheme
yarn lint:custom    # Apenas custom
yarn lint:storetheme # Apenas storetheme
```

---

## Estrutura detalhada

```
frn-template/
├── custom/
│   ├── react/
│   │   ├── components/
│   │   │   ├── Promotions/         # Componente principal de promoções
│   │   │   │   ├── components/     # PromotionTab, PromotionTabList, Skeletons
│   │   │   │   ├── graphql/        # Queries e fragments GraphQL
│   │   │   │   ├── hooks/          # usePromotions, usePromotionFacets
│   │   │   │   ├── mocks/          # Mock do endpoint para desenvolvimento
│   │   │   │   └── typings/        # Interfaces TypeScript
│   │   │   └── Example/
│   │   └── graphql/
│   │       └── queries/            # searchProducts, productsByIdentifier
│   └── store/
│       └── interfaces.json         # Registro dos blocos VTEX
│
├── services/
│   ├── node/
│   │   ├── __tests__/              # Testes unitários (Jest + ts-jest)
│   │   ├── clients/                # PromotionsClient (JanusClient)
│   │   ├── middlewares/            # getActivePromotions
│   │   ├── helpers/                # appConfigs
│   │   └── typings/                # Interfaces da API VTEX
│   └── docs/
│       └── README.md
│
└── storetheme/
    ├── store/blocks/               # Definição de páginas (home, product, search...)
    ├── styles/
    │   ├── sass/
    │   │   ├── utils/              # _vars.scss, _mixin.scss
    │   │   ├── partials/           # Estilos por componente (shelf, quickview)
    │   │   └── pages/              # Estilos por página
    │   └── css/                    # CSS compilado (não editar)
    └── docs/
        └── README.md
```

---

## Fluxo de dados

```
storetheme (bloco custom-promotions)
    └── custom-components (Promotions.tsx)
            ├── GET /_v/promotions/active
            │       └── services (getActivePromotions middleware)
            │               └── VTEX API /api/rnb/pvt/...
            │
            └── GraphQL productSearch / productsByIdentifier
                    └── vtex.search-graphql
```

---

## Documentação por app

| App | README |
|-----|--------|
| Store Theme | [storetheme/docs/README.md](./storetheme/docs/README.md) |
| Service | [services/docs/README.md](./services/docs/README.md) |
