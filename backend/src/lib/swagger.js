import swaggerUi from 'swagger-ui-express';

const swaggerDocument = {
  openapi: '3.1.0',
  info: {
    title: 'CEDIG Family Tree API',
    version: '1.0.0',
    description: 'Backend API for CEDIG Mongolian Family Tree & Archival Records Platform',
    contact: {
      name: 'CEDIG Development Team',
    },
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API v1',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          username: { type: 'string' },
          role: { type: 'string', enum: ['Owner', 'Admin', 'Editor', 'Viewer'] },
          avatar: { type: 'string', nullable: true },
          code: { type: 'string', nullable: true },
        },
      },
      Person: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          treeId: { type: 'string', format: 'uuid' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          surname: { type: 'string', nullable: true },
          clanName: { type: 'string' },
          birthPlace: { type: 'string' },
          biography: { type: 'string', nullable: true },
          zodiacSign: { type: 'string', nullable: true },
          birthYear: { type: 'integer' },
          birthDate: { type: 'string', nullable: true },
          deathDate: { type: 'string', nullable: true },
          gender: { type: 'string', enum: ['male', 'female'] },
          occupation: { type: 'string', nullable: true },
          education: { type: 'string', nullable: true },
          awards: { type: 'array', items: { type: 'string' } },
          notes: { type: 'string', nullable: true },
          relationshipLabel: { type: 'string', enum: ['DIRECT LINE', 'HEAD OF CLAN', 'MATRIARCH', 'DESCENDANT', 'SPOUSE', 'RELATIVE'] },
          verified: { type: 'boolean' },
          pendingOralHistory: { type: 'boolean' },
          fatherId: { type: 'string', format: 'uuid', nullable: true },
          motherId: { type: 'string', format: 'uuid', nullable: true },
          spouseId: { type: 'string', format: 'uuid', nullable: true },
        },
      },
      MediaItem: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          personId: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string' },
          type: { type: 'string', enum: ['photo', 'document', 'certificate'] },
          url: { type: 'string' },
          version: { type: 'integer' },
          uploadedAt: { type: 'string', format: 'date-time' },
        },
      },
      AppNotification: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          type: { type: 'string', enum: ['info', 'success', 'warn'] },
          title: { type: 'string' },
          message: { type: 'string' },
          isRead: { type: 'boolean' },
          time: { type: 'string' },
        },
      },
      ActivityLog: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          type: { type: 'string', enum: ['add', 'edit', 'delete', 'media_add', 'media_delete', 'role_update'] },
          description: { type: 'string' },
          personId: { type: 'string', format: 'uuid', nullable: true },
          userName: { type: 'string' },
          timestamp: { type: 'string' },
        },
      },
      Invite: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          phone: { type: 'string', nullable: true },
          role: { type: 'string', enum: ['Editor', 'Viewer'] },
          code: { type: 'string' },
          status: { type: 'string', enum: ['Pending', 'Active'] },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          currentPage: { type: 'integer' },
          totalPages: { type: 'integer' },
          totalItems: { type: 'integer' },
          pageSize: { type: 'integer' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          errors: { type: 'array', items: { type: 'object' } },
        },
      },
    },
  },
  paths: {
    '/auth/login/email': {
      post: {
        tags: ['Auth'],
        summary: 'Login with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/User' } } } } } },
          '401': { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/auth/login/phone': {
      post: {
        tags: ['Auth'],
        summary: 'Login with phone number and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['phone', 'password', 'countryCode'],
                properties: {
                  phone: { type: 'string' },
                  countryCode: { type: 'string' },
                  password: { type: 'string', minLength: 6 },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Login successful' }, '401': { description: 'Invalid credentials' } },
      },
    },
    '/auth/register/email': {
      post: {
        tags: ['Auth'],
        summary: 'Register with email',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'firstName', 'lastName', 'email', 'password', 'agreeTerms', 'agreePrivacy'],
                properties: {
                  username: { type: 'string' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  agreeTerms: { type: 'boolean', enum: [true] },
                  agreePrivacy: { type: 'boolean', enum: [true] },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Registration successful' }, '409': { description: 'Email or username already exists' } },
      },
    },
    '/auth/register/phone': {
      post: {
        tags: ['Auth'],
        summary: 'Register with phone number',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { username: { type: 'string' }, firstName: { type: 'string' }, lastName: { type: 'string' }, countryCode: { type: 'string' }, phone: { type: 'string' }, password: { type: 'string' }, agreeTerms: { type: 'boolean' }, agreePrivacy: { type: 'boolean' } } } } },
        },
        responses: { '201': { description: 'Registration successful' } },
      },
    },
    '/auth/social': {
      post: {
        tags: ['Auth'],
        summary: 'Social login (Google/Facebook)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { idToken: { type: 'string' }, provider: { type: 'string', enum: ['google', 'facebook'] } } } } },
        },
        responses: { '200': { description: 'Login successful' } },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Send password reset OTP',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' } } } } },
        },
        responses: { '200': { description: 'OTP sent' } },
      },
    },
    '/auth/verify-otp': {
      post: {
        tags: ['Auth'],
        summary: 'Verify OTP',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, otp: { type: 'string' } } } } },
        },
        responses: { '200': { description: 'OTP verified' } },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password with token',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' }, token: { type: 'string' } } } } },
        },
        responses: { '200': { description: 'Password reset successful' } },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { refreshToken: { type: 'string' } } } } },
        },
        responses: { '200': { description: 'Token refreshed' } },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'User profile' }, '401': { description: 'Unauthorized' } },
      },
    },
    '/trees': {
      post: {
        tags: ['Trees'],
        summary: 'Create a new family tree',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, clanName: { type: 'string' } } } } },
        },
        responses: { '201': { description: 'Tree created' } },
      },
      get: {
        tags: ['Trees'],
        summary: 'Get user family trees',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'List of trees' } },
      },
    },
    '/trees/join': {
      post: {
        tags: ['Trees'],
        summary: 'Join a family tree by code',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { code: { type: 'string' } } } } },
        },
        responses: { '200': { description: 'Joined successfully' } },
      },
    },
    '/trees/{id}': {
      get: {
        tags: ['Trees'],
        summary: 'Get tree by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Tree details' } },
      },
      put: {
        tags: ['Trees'],
        summary: 'Update tree',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Tree updated' } },
      },
      delete: {
        tags: ['Trees'],
        summary: 'Delete tree',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Tree deleted' } },
      },
    },
    '/trees/{id}/members': {
      get: {
        tags: ['Trees'],
        summary: 'Get tree members',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'List of members' } },
      },
    },
    '/people': {
      get: {
        tags: ['People'],
        summary: 'Get people with filtering and pagination',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'treeId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'clan', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'gender', in: 'query', schema: { type: 'string', enum: ['male', 'female'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: { '200': { description: 'Paginated list of people' } },
      },
      post: {
        tags: ['People'],
        summary: 'Create a new person',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Person' } } } },
        responses: { '201': { description: 'Person created' } },
      },
    },
    '/people/{id}': {
      get: {
        tags: ['People'],
        summary: 'Get person by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'treeId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Person details' } },
      },
      put: {
        tags: ['People'],
        summary: 'Update person',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Person updated' } },
      },
      delete: {
        tags: ['People'],
        summary: 'Delete person',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Person deleted' } },
      },
    },
    '/media/person/{personId}': {
      get: {
        tags: ['Media'],
        summary: 'Get media by person',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'personId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'treeId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'List of media' } },
      },
    },
    '/media/tree/{treeId}': {
      get: {
        tags: ['Media'],
        summary: 'Get media by tree',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'treeId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Paginated media list' } },
      },
    },
    '/media': {
      post: {
        tags: ['Media'],
        summary: 'Upload media',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, personId: { type: 'string' }, treeId: { type: 'string' }, title: { type: 'string' }, type: { type: 'string', enum: ['photo', 'document', 'certificate'] } } } } } },
        responses: { '201': { description: 'Media created' } },
      },
    },
    '/media/{id}': {
      delete: {
        tags: ['Media'],
        summary: 'Delete media',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Media deleted' } },
      },
    },
    '/invites/{treeId}': {
      get: {
        tags: ['Invites'],
        summary: 'Get invites for tree',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'treeId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'List of invites' } },
      },
      post: {
        tags: ['Invites'],
        summary: 'Create invite',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'treeId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, phone: { type: 'string' }, role: { type: 'string', enum: ['Editor', 'Viewer'] } } } } } },
        responses: { '201': { description: 'Invite created' } },
      },
    },
    '/invites/{treeId}/{email}': {
      put: {
        tags: ['Invites'],
        summary: 'Update invite role',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'treeId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'email', in: 'path', required: true, schema: { type: 'string', format: 'email' } },
        ],
        responses: { '200': { description: 'Role updated' } },
      },
      delete: {
        tags: ['Invites'],
        summary: 'Remove invite',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'treeId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'email', in: 'path', required: true, schema: { type: 'string', format: 'email' } },
        ],
        responses: { '200': { description: 'Invite removed' } },
      },
    },
    '/notifications': {
      get: {
        tags: ['Notifications'],
        summary: 'Get notifications',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Paginated notifications' } },
      },
    },
    '/notifications/unread-count': {
      get: {
        tags: ['Notifications'],
        summary: 'Get unread notification count',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Unread count' } },
      },
    },
    '/notifications/{id}/read': {
      put: {
        tags: ['Notifications'],
        summary: 'Mark notification as read',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { '200': { description: 'Marked as read' } },
      },
    },
    '/notifications/read-all': {
      put: {
        tags: ['Notifications'],
        summary: 'Mark all notifications as read',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'All marked as read' } },
      },
    },
    '/notifications/clear': {
      delete: {
        tags: ['Notifications'],
        summary: 'Clear all notifications',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Cleared' } },
      },
    },
    '/activity/{treeId}': {
      get: {
        tags: ['Activity'],
        summary: 'Get activity log',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'treeId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { '200': { description: 'Paginated activity log' } },
      },
    },
    '/settings/profile': {
      get: {
        tags: ['Settings'],
        summary: 'Get user profile',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Profile' } },
      },
      put: {
        tags: ['Settings'],
        summary: 'Update profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { firstName: { type: 'string' }, lastName: { type: 'string' }, username: { type: 'string' } } } } },
        },
        responses: { '200': { description: 'Profile updated' } },
      },
    },
    '/settings/email': {
      put: {
        tags: ['Settings'],
        summary: 'Update email',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string', format: 'email' } } } } } },
        responses: { '200': { description: 'Email updated' } },
      },
    },
    '/settings/phone': {
      put: {
        tags: ['Settings'],
        summary: 'Update phone number',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { phone: { type: 'string' }, countryCode: { type: 'string' } } } } } },
        responses: { '200': { description: 'Phone updated' } },
      },
    },
    '/settings/password': {
      put: {
        tags: ['Settings'],
        summary: 'Change password',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { currentPassword: { type: 'string' }, newPassword: { type: 'string', minLength: 8 }, confirmPassword: { type: 'string' } } } } } },
        responses: { '200': { description: 'Password changed' } },
      },
    },
    '/settings/notifications': {
      put: {
        tags: ['Settings'],
        summary: 'Update notification preferences',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Preferences updated' } },
      },
    },
    '/settings/account': {
      delete: {
        tags: ['Settings'],
        summary: 'Delete account',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Account deleted' } },
      },
    },
    '/uploads/file': {
      post: {
        tags: ['Uploads'],
        summary: 'Upload a file',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, folder: { type: 'string' } } } } } },
        responses: { '201': { description: 'File uploaded' } },
      },
    },
    '/uploads/avatar': {
      post: {
        tags: ['Uploads'],
        summary: 'Upload avatar',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } } } },
        responses: { '201': { description: 'Avatar uploaded' } },
      },
    },
    '/admin/stats': {
      get: {
        tags: ['Admin'],
        summary: 'Get admin statistics',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Admin stats' } },
      },
    },
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        responses: { '200': { description: 'API is healthy' } },
      },
    },
  },
};

export const swaggerServe = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(swaggerDocument, {
  explorer: true,
  customSiteTitle: 'CEDIG API Documentation',
  customfavIcon: '/favicon.ico',
});
