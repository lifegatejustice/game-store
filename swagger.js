const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Game DB API',
      version: '1.0.0',
      description: 'API for managing games, characters, developers, reviews, and users',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:3000',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            oauthId: { type: 'string' },
            provider: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            avatar: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Game: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            developer: { type: 'string' },
            genres: { type: 'array', items: { type: 'string' } },
            platforms: { type: 'array', items: { type: 'string' } },
            releaseDates: { type: 'array', items: { type: 'object', properties: { region: { type: 'string' }, date: { type: 'string', format: 'date' } } } },
            media: { type: 'object', properties: { cover: { type: 'string' }, screenshots: { type: 'array', items: { type: 'string' } }, trailerUrl: { type: 'string' } } },
            price: { type: 'number' },
            stock: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Character: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            bio: { type: 'string' },
            firstAppearance: { type: 'string' },
            abilities: { type: 'string' },
            images: { type: 'string' }
          }
        },
        Developer: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            foundedYear: { type: 'number' },
            country: { type: 'string' },
            website: { type: 'string' },
            description: { type: 'string' }
          }
        },
        Review: {
          type: 'object',
          properties: {
            game: { type: 'string' },
            user: { type: 'string' },
            rating: { type: 'number', minimum: 1, maximum: 5 },
            title: { type: 'string' },
            body: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js'],
};


const specs = swaggerJSDoc(options);

module.exports = specs;
