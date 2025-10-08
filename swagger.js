const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CTF Backend API',
      version: '1.0.0',
      description: 'A Capture The Flag (CTF) competition backend API built with Express.js',
      contact: {
        name: 'CTF Team',
        email: 'support@psgtech.ac.in'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'jwt',
          description: 'JWT token stored in HTTP-only cookie'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email (must be @psgtech.ac.in)'
            },
            team_name: {
              type: 'string',
              description: 'Team name'
            },
            year: {
              type: 'number',
              description: 'Academic year (1-4)'
            },
            point: {
              type: 'number',
              description: 'Total points earned'
            },
            solved_no: {
              type: 'number',
              description: 'Number of questions solved'
            },
            field: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role'
            }
          }
        },
        Category: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Category ID'
            },
            name: {
              type: 'string',
              description: 'Category name'
            }
          }
        },
        Question: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Question ID'
            },
            categoryId: {
              type: 'string',
              description: 'Category ID reference'
            },
            title: {
              type: 'string',
              description: 'Question title'
            },
            description: {
              type: 'string',
              description: 'Question description'
            },
            answer: {
              type: 'string',
              description: 'Correct answer'
            },
            point: {
              type: 'number',
              description: 'Points awarded for solving'
            },
            year: {
              type: 'number',
              description: 'Target year level'
            },
            solved_count: {
              type: 'number',
              description: 'Number of times solved'
            }
          }
        },
        Submission: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Submission ID'
            },
            user_id: {
              type: 'string',
              description: 'User ID reference'
            },
            question_id: {
              type: 'string',
              description: 'Question ID reference'
            },
            submitted_answer: {
              type: 'string',
              description: 'Submitted answer'
            },
            iscorrect: {
              type: 'boolean',
              description: 'Whether the answer is correct'
            },
            submitted_at: {
              type: 'string',
              format: 'date-time',
              description: 'Submission timestamp'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'string',
              description: 'Detailed error information'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'Admin',
        description: 'Admin-only endpoints for managing categories and questions'
      },
      {
        name: 'Submissions',
        description: 'Question submission and retrieval endpoints'
      },
      {
        name: 'Leaderboard',
        description: 'Leaderboard and ranking endpoints'
      }
    ]
  },
  apis: ['./Routes/*.js'] // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'CTF Backend API Documentation'
  }));
  
  // Serve swagger spec as JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log('📚 Swagger documentation available at http://localhost:5000/api-docs');
};

module.exports = setupSwagger;
