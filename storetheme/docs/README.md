# frncubo.frn-template

Store Theme customizado para a loja **FRN**, construído sobre o VTEX IO Store Framework. Este tema define a estrutura visual, os blocos de página e os estilos da loja, integrando componentes nativos da VTEX com componentes customizados do app `frncubo.custom-components`.

---

## Contexto

Este repositório contém exclusivamente a camada de **apresentação** da loja. Ele não possui lógica de negócio — toda a customização de comportamento está nos apps `frncubo.custom-components` (componentes React) e `frncubo.service` (middleware Node).

---

## Estrutura

```
storetheme/
├── assets/                  # Imagens e arquivos estáticos
├── docs/
│   └── README.md
├── store/
│   └── blocks/
│       ├── default.jsonc    # Blocos padrão reutilizáveis
│       ├── footer.jsonc     # Rodapé
│       ├── header.jsonc     # Cabeçalho
│       ├── home.jsonc       # Página inicial
│       ├── product.jsonc    # Página de produto
│       ├── quickview.jsonc  # Modal de quickview
│       └── search.jsonc     # Página de busca e categoria
├── styles/
│   ├── configs/
│   │   └── style.json       # Configurações globais de tipografia e cores
│   ├── css/                 # CSS gerado pelo Gulp (não editar diretamente)
│   └── sass/
│       ├── general/         # Estilos globais
│       ├── pages/           # Estilos por página
│       ├── partials/        # Estilos por componente/seção
│       └── utils/
│           ├── _mixin.scss  # Mixins reutilizáveis
│           └── _vars.scss   # Variáveis de cor, espaçamento e tipografia
├── gulpfile.js              # Compilação SCSS → CSS
└── manifest.json
```

---

## Páginas e blocos

| Arquivo | Página |
|---------|--------|
| `home.jsonc` | Página inicial — exibe o componente `custom-promotions` com slider de produtos |
| `header.jsonc` | Cabeçalho global com menu, busca, minicart e login |
| `footer.jsonc` | Rodapé global |
| `product.jsonc` | Página de detalhe de produto |
| `search.jsonc` | Página de busca e listagem por categoria |
| `quickview.jsonc` | Modal de visualização rápida do produto |

### Componente customizado na home

O bloco `custom-promotions` é fornecido pelo app `frncubo.custom-components` e renderiza as promoções ativas em um tab layout com slider de produtos. Ele consome o endpoint `/_v/promotions/active` provido pelo app `frncubo.service`.

```jsonc
"custom-promotions": {
  "props": {
    "title": "Nossos produtos \n**Selecionados para você:**"
  },
  "blocks": ["product-summary.shelf"],
  "children": ["slider-layout#promotions-slider"]
}
```

---

## Estilos

Os estilos são escritos em **SCSS** na pasta `styles/sass/` e compilados para `styles/css/` via Gulp. Os arquivos CSS gerados são lidos pelo builder `styles` do VTEX IO.

### Compilar estilos

```bash
# Dentro da pasta storetheme/
yarn gulp storetheme
```

O comando `storetheme` executa `run` (compilação inicial) e `watch` (recompilação automática ao salvar).

### Organização do SCSS

| Pasta | Conteúdo |
|-------|----------|
| `utils/_vars.scss` | Variáveis globais de cor, fonte e espaçamento |
| `utils/_mixin.scss` | Mixins de responsividade e utilitários |
| `general/` | Reset e estilos base globais |
| `partials/shelf/` | Estilos do shelf e product summary |
| `partials/quickview/` | Estilos do modal de quickview |
| `pages/home/` | Estilos específicos da página inicial |

---

## Dependências principais

| App | Versão | Uso |
|-----|--------|-----|
| `vtex.store` | `2.x` | Base do Store Framework |
| `vtex.flex-layout` | `0.x` | Layouts flexíveis |
| `vtex.slider-layout` | `0.x` | Slider de produtos |
| `vtex.product-summary` | `2.x` | Card de produto |
| `vtex.search-result` | `3.x` | Listagem de busca/categoria |
| `vtex.modal-layout` | `0.x` | Modal de quickview |
| `vtex.rich-text` | `0.x` | Textos com markdown |
| `frncubo.custom-components` | `0.x` | Componentes customizados da loja |

---

## Como executar

### Pré-requisitos

- [VTEX Toolbelt](https://developers.vtex.com/docs/guides/vtex-io-documentation-vtex-io-cli-installation-and-command-reference) instalado
- Conta VTEX com workspace de desenvolvimento
- Node.js 16.x

### Passo a passo

**1. Autenticar na VTEX**

```bash
vtex login frncubo
```

**2. Criar ou selecionar um workspace**

```bash
vtex use {nome-do-workspace}
```

**3. Verificar apps instalados**

```bash
vtex list
```

Certifique-se de que `vtex.store` e `vtex.store-sitemap` estão instalados. Caso não estejam:

```bash
vtex install vtex.store vtex.store-sitemap -f
```

**4. Desinstalar tema existente (se houver)**

```bash
vtex uninstall vtex.store-theme
```

**5. Subir o tema**

```bash
# Dentro da pasta storetheme/
vtex link
```

**6. Visualizar no browser**

```bash
vtex browse
```

A loja estará disponível em:
```
https://{workspace}--frncubo.myvtex.com
```

---

## Dependências de outros apps do monorepo

Este tema depende dos seguintes apps que devem estar linkados ou publicados:

| App | Pasta | Comando |
|-----|-------|---------|
| `frncubo.custom-components` | `custom/` | `vtex link` |
| `frncubo.service` | `services/` | `vtex link` |

> Para desenvolvimento local, suba os três apps em terminais separados antes de acessar a loja.
