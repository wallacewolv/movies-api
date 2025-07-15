Acessando o front
- Valida se tem token (AuthGuard)
    - Se não tiver 
        - Redireciona para tela "Login"
    - Se tiver
        - Redireciona para tela "filmes"

Tela Login
- Envia usuário e senha
    - Se login der errado
        Apresenta uma notificação de erro
    - Se login der certo
        - Recebe o token e salva no localStorage (movies-token)
        - Redireciona para tela "filmes"

Tela Filmes
- Chamada para a listagem de "filmes" e "filtros dos filmes" utilizando o token no Header (AuthInterceptor)
    - Token inválido
        - Redireciona para tela "Login"
    - Token válido
        - trás a lista de filmes

- Filtrando filmes
    - Usa o retorno da api com "filtros dos filmes"
        - Chama a listagem de "filmes" passando os filtros selecionados

- Favoritando um filme
    - Salva no "favoriteService" o filme favoritado
    - O mesmo manipula os dados no localStorage

- Navegando para tela favoritos

Tela favoritos
- Acessar os filmes favoritados
