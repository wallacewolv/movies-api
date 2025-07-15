# Itau Movies

Aplicacao Angular 18 que consome a [API de Filmes](https://github.com/TesteDevGrowth/movies-api), com autenticacao via JWT, listagem e gerenciamento de filmes favoritos.

> Arquitetura moderna com padrao **Feature-based**, **Angular 18**, **Standalone Components**, e **Signals**.

---

## 🚀 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/wallacewolv/movies-api
cd movies-api
```

### 2. Inicie a API

```bash
npm install
npm dev
```

A API estara disponivel com swagger em: `https://github.com/wallacewolv/movies-api`

### 3. Inicie o Frontend

```bash
cd itau-movies-front
npm install
npm start
```

Acesse: `http://localhost:4200`

---

## Arquitetura do Projeto

A estrutura segue o padrao **Feature-based** com **Standalone Components** e uso de **Angular Signals** para controle de estado local e reativo.

```
src/
└── app/
    ├── core/                                         # Servicos de infraestrutura (auth, interceptor, guard)
    │   ├── auth/                              
    │   │   ├── auth.guard.ts
    │   │   ├── auth.interceptor.ts
    │   │   ├── auth.model.ts
    │   │   └── auth.service.ts
    │   ├── favorite/
    │   │   └── favorite.service.ts
    │   └── movie/
    │       ├── movie.enum.ts
    │       ├── movie.model.ts
    │       └── movie.service.ts
    ├── features/                                     # Funcionalidades isoladas por dominio
    │   ├── auth/                                     # Login
    │   │   └── login/
    │   │       └── login.component.ts
    │   ├── movies/                                   # Listagem de filmes
    │   │   └── movie.component.ts
    │   └── favorites/                                # Lista de favoritos
    │       └── favorites.component.ts
    ├── shared/                                       # Componentes reutilizaveis, pipes, validators
    │   ├── components/
    │   │   └── movie-card/
    │   │       └── movie-card.component.ts
    │   └── utils/
    │       ├── pipes/
    │       │   └── field.pipe.ts
    │       └── validators/
    │           └── get-portuguese-paginator-intl.ts
    ├── app.component.ts
    ├── app.config.ts
    └── app.routes.ts                                 # Rotas com proteção via AuthGuard
```

---

## Fluxo de Navegacao e Autenticacao

### Acesso inicial

* Verifica a existencia de token no `localStorage`
* Se **nao houver token valido**, redireciona para `/login`
* Se houver, redireciona para `/movies`

### Login (`/login`)

* Envia e-mail e senha para `/auth/login`
* Se login falhar, exibe mensagem de erro
* Se sucesso:

  * Salva o token JWT no `localStorage` (`movies-token`)
  * Redireciona para `/movies`

---

## 📽️ Tela de Filmes (`/movies`)

* Ao entrar:

  * Chama a API `/movies` com o token no `Authorization` (via `AuthInterceptor`)
  * Se o token for invalido, redireciona para login
  * Caso contrario, exibe a lista de filmes

### Funcionalidades:

* **Favoritar filme**:

  * Ao clicar, o filme é adicionado ao servico de favoritos (`FavoriteService`)
  * Os dados sao salvos tambem no `localStorage` para persistencia

* **Filtragem**:

  * Com base na resposta da API (ex: genero)
  * Ao selecionar filtros, a listagem é atualizada com nova chamada

---

## ⭐ Tela de Favoritos (`/favorites`)

* Verifica a existencia dos favotiros salvos no `localStorage`
* Mostra os filmes favoritos salvos
* Utiliza a lista completa de filmes ja carregada anteriormente
* Baseia-se nos IDs salvos no `FavoriteService`

---

## Tecnologias Utilizadas

* ✅ Angular **18**
* ✅ Standalone Components
* ✅ Angular **Signals**
* ✅ `HttpClient` com `Interceptor`
* ✅ `Router` com `AuthGuard`
* ✅ `localStorage` para persistencia de token e favoritos

---

## Comandos uteis

```bash
npm start         # Inicia o frontend ou a API backend
npm build         # Gera o build de producao
```

---

## Contato

Desenvolvido por [Wallace Wesley](https://github.com/wallacewolv).
