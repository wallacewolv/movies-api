require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const movies = require('./data/movies');
const app = express();
const PORT = process.env.PORT || 3000;

// JWT secret key (in production, should be in environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-secret-key';

// Fixed credentials for testing
const AUTH_USER = 'teste';
const AUTH_PASSWORD = 'teste';

// Middleware para parsing JSON
app.use(express.json());

// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware de autenticação JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Token de acesso requerido',
      message: 'Faça login para obter um token de acesso'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Token inválido ou expirado',
        message: 'Faça login novamente para obter um novo token'
      });
    }
    req.user = user;
    next();
  });
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticar usuário
 *     description: Autentica o usuário e retorna um token JWT válido por 30 minutos
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             usuario: "teste"
 *             senha: "teste"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Credenciais inválidas"
 *               message: "Usuário ou senha incorretos"
 */
// Endpoint de autenticação
app.post('/auth/login', (req, res) => {
  try {
    const { usuario, senha } = req.body;

    // Validar se os campos foram fornecidos
    if (!usuario || !senha) {
      return res.status(400).json({
        error: 'Campos obrigatórios',
        message: 'Usuario e senha são obrigatórios'
      });
    }

    // Verificar credenciais
    if (usuario !== AUTH_USER || senha !== AUTH_PASSWORD) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: 'Usuário ou senha incorretos'
      });
    }

    // Gerar token JWT com expiração de 30 minutos
    const token = jwt.sign(
      { usuario: usuario },
      JWT_SECRET,
      { expiresIn: '30m' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      token: token,
      expiresIn: '30 minutos',
      tokenType: 'Bearer'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// Função auxiliar para ordenar filmes
function sortMovies(movies, sortBy, order = 'asc') {
  const validSortFields = ['nome', 'anoLancamento', 'genero'];
  
  if (!validSortFields.includes(sortBy)) {
    return movies;
  }
  
  return [...movies].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Para strings, converter para lowercase para ordenação case-insensitive
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (order === 'desc') {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    } else {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    }
  });
}

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Lista filmes com paginação e ordenação
 *     description: Retorna uma lista paginada de filmes com opções de ordenação e filtro por gênero
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortByParam'
 *       - $ref: '#/components/parameters/OrderParam'
 *       - $ref: '#/components/parameters/GeneroParam'
 *     responses:
 *       200:
 *         description: Lista de filmes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MoviesResponse'
 *       400:
 *         description: Erro de validação nos parâmetros
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidPage:
 *                 value:
 *                   error: "Número da página deve ser maior que 0"
 *               invalidLimit:
 *                 value:
 *                   error: "Limite deve ser entre 1 e 100"
 *               invalidOrder:
 *                 value:
 *                   error: "Ordem deve ser \"asc\" ou \"desc\""
 *       401:
 *         description: Token de acesso requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Token de acesso requerido"
 *               message: "Faça login para obter um token de acesso"
 *       403:
 *         description: Token inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Token inválido ou expirado"
 *               message: "Faça login novamente para obter um novo token"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Endpoint GET para listar filmes com paginação e ordenação
app.get('/movies', authenticateToken, (req, res) => {
  try {
    // Parâmetros de query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'nome';
    const order = req.query.order || 'asc';
    const genero = req.query.genero;
    
    // Validar parâmetros
    if (page < 1) {
      return res.status(400).json({ 
        error: 'Número da página deve ser maior que 0' 
      });
    }
    
    if (limit < 1 || limit > 100) {
      return res.status(400).json({ 
        error: 'Limite deve ser entre 1 e 100' 
      });
    }
    
    if (!['asc', 'desc'].includes(order)) {
      return res.status(400).json({ 
        error: 'Ordem deve ser "asc" ou "desc"' 
      });
    }
    
    // Filtrar por gênero se especificado
    let filteredMovies = movies;
    if (genero) {
      filteredMovies = movies.filter(movie => 
        movie.genero.toLowerCase().includes(genero.toLowerCase())
      );
    }
    
    // Ordenar filmes
    const sortedMovies = sortMovies(filteredMovies, sortBy, order);
    
    // Calcular paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMovies = sortedMovies.slice(startIndex, endIndex);
    
    // Metadados de paginação
    const totalMovies = sortedMovies.length;
    const totalPages = Math.ceil(totalMovies / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    // Resposta
    res.json({
      data: paginatedMovies,
      pagination: {
        currentPage: page,
        totalPages,
        totalMovies,
        moviesPerPage: limit,
        hasNextPage,
        hasPrevPage
      },
      filters: {
        sortBy,
        order,
        genero: genero || null
      }
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

/**
 * @swagger
 * /movies/filters:
 *   get:
 *     summary: Obter filtros disponíveis
 *     description: Retorna informações sobre os filtros e opções de ordenação disponíveis
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Filtros disponíveis retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FiltersResponse'
 *       401:
 *         description: Token de acesso requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Token inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Endpoint para obter informações sobre os filtros disponíveis
app.get('/movies/filters', authenticateToken, (req, res) => {
  const genres = [...new Set(movies.map(movie => movie.genero))];
  const sortFields = ['nome', 'anoLancamento', 'genero'];
  
  res.json({
    availableGenres: genres,
    availableSortFields: sortFields,
    sortOrders: ['asc', 'desc']
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check da API
 *     description: Verifica se a API está funcionando corretamente (não requer autenticação)
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API funcionando corretamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    availableEndpoints: [
      'POST /auth/login - Autenticação (público: usuário: teste, senha: teste)',
      'GET /movies - Lista filmes com paginação e ordenação (requer autenticação)',
      'GET /movies/filters - Informações sobre filtros disponíveis (requer autenticação)',
      'GET /health - Status da API (público)',
      'GET /api-docs - Documentação Swagger (público)'
    ]
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🎬 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}`);
  console.log(`📚 Documentação Swagger em http://localhost:${PORT}/api-docs`);
  console.log(`🔐 Para acessar, faça login em POST /auth/login com:`);
  console.log(`   { "usuario": "teste", "senha": "teste" }`);
  console.log(`🎭 Endpoints disponíveis:`);
  console.log(`   POST /auth/login - Autenticação (público)`);
  console.log(`   GET /movies - Lista filmes (autenticado)`);
  console.log(`   GET /movies/filters - Filtros disponíveis (autenticado)`);
  console.log(`   GET /health - Status da API (público)`);
  console.log(`   GET /api-docs - Documentação Swagger (público)`);
});

module.exports = app;
