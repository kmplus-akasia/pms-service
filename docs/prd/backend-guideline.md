# PMS Backend Development Guidelines

## 📋 Overview

This document serves as the **living guideline** for PMS (Performance Management System) backend development. It must be referenced and followed for **every agentic call** and development task.

**Last Updated**: December 2025
**Framework**: NestJS
**Architecture**: Modular Microservice
**Database**: MySQL 8.0+
**Cache**: Redis
**Message Queue**: RabbitMQ (planned)

---

## 🏗️ Architecture Principles

### **1. Technology Stack**

#### **Core Framework**

- **Framework**: NestJS v11.0.1
- **Language**: TypeScript 5.7.3 (strict mode)
- **Runtime**: Node.js 18+
- **Package Manager**: npm

#### **Database & Storage**

- **Primary Database**: MySQL 8.0+ with InnoDB engine
- **Cache**: Redis 7.0+ for session and performance data
- **File Storage**: External service (referenced via `tb_file`)
- **Character Set**: UTF8MB4 for Unicode support

#### **Infrastructure**

- **Message Queue**: RabbitMQ (for async operations)
- **Load Balancer**: Nginx (for production deployment)
- **Container**: Docker with multi-stage builds
- **Orchestration**: Kubernetes (planned)

#### **External Dependencies**

- **mysql2**: ^3.16.0 (MySQL client)
- **redis**: ^4.6.0 (Redis client)
- **amqplib**: ^0.10.0 (RabbitMQ client)
- **class-validator**: ^0.14.0 (DTO validation)
- **class-transformer**: ^0.5.1 (Object transformation)
- **@nestjs/swagger**: ^7.0.0 (OpenAPI/Swagger documentation)

### **2. API Documentation with Swagger**

#### **Swagger Configuration**

All APIs must be documented using **Swagger/OpenAPI** with NestJS Swagger module.

**Main Application Setup:**

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Pelindo PMS Service')
    .setDescription('Performance Management System API')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('my-performance', 'Individual performance management')
    .addTag('team', 'Team performance management')
    .addTag('kpi', 'KPI management')
    .addTag('dictionary', 'KPI dictionary')
    .addTag('performance-tree', 'KPI hierarchy')
    .addCookieAuth('smartkmsystemAuth', {
      type: 'apiKey',
      in: 'cookie',
      name: 'smartkmsystemAuth',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  });

  await app.listen(3000);
}
bootstrap();
```

#### **Controller Documentation**

**Basic Controller with Swagger:**

```typescript
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MyPerformanceService } from './my-performance.service';
import { CreateKpiDto } from './dto/create-kpi.dto';
import { KpiResponseDto } from './dto/kpi-response.dto';

@ApiTags('my-performance')
@ApiCookieAuth('smartkmsystemAuth')
@Controller('my-performance')
@UseGuards(JwtAuthGuard)
export class MyPerformanceController {
  constructor(private readonly myPerformanceService: MyPerformanceService) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get personal performance dashboard',
    description: "Retrieve current user's KPI overview and progress",
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
    type: [KpiResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication',
  })
  async getDashboard(@Req() req: Request) {
    return this.myPerformanceService.getDashboard(req.user.employeeNumber);
  }

  @Post('kpi')
  @ApiOperation({
    summary: 'Create new KPI',
    description: 'Create a new KPI for the authenticated user',
  })
  @ApiResponse({
    status: 201,
    description: 'KPI created successfully',
    type: KpiResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async createKpi(@Body() dto: CreateKpiDto, @Req() req: Request) {
    return this.myPerformanceService.createKpi(dto, req.user);
  }
}
```

#### **DTO Documentation**

**DTO with Swagger Decorators:**

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsIn,
  IsNumber,
  Min,
  Max,
  Length,
} from 'class-validator';

export class CreateKpiDto {
  @ApiProperty({
    description: 'KPI title/name',
    example: 'Container Throughput Terminal Nilam',
    minLength: 1,
    maxLength: 200,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiProperty({
    description: 'Detailed KPI description',
    example: 'Total volume of containers handled at Terminal Nilam',
    minLength: 1,
    maxLength: 2000,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 2000)
  description: string;

  @ApiProperty({
    description: 'KPI type',
    enum: ['IMPACT', 'OUTPUT', 'KAI'],
    example: 'OUTPUT',
  })
  @IsNotEmpty()
  @IsIn(['IMPACT', 'OUTPUT', 'KAI'])
  type: 'IMPACT' | 'OUTPUT' | 'KAI';

  @ApiProperty({
    description: 'Target value for the KPI',
    example: 50000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  target: number;

  @ApiProperty({
    description: 'Unit of measurement',
    example: 'TEUs',
    minLength: 1,
    maxLength: 25,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 25)
  targetUnit: string;

  @ApiPropertyOptional({
    description: 'BSC Perspective',
    enum: ['FINANCIAL', 'CUSTOMER', 'INTERNAL_PROCESS', 'LEARNING_GROWTH'],
    example: 'CUSTOMER',
  })
  @IsIn(['FINANCIAL', 'CUSTOMER', 'INTERNAL_PROCESS', 'LEARNING_GROWTH'])
  perspective?: string;

  @ApiPropertyOptional({
    description: 'Weight/Bobot (0-100%)',
    example: 30,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  weight?: number;
}
```

**Response DTO:**

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class KpiResponseDto {
  @ApiProperty({
    description: 'Unique KPI identifier',
    example: 123,
  })
  kpiId: number;

  @ApiProperty({
    description: 'KPI title',
    example: 'Container Throughput Terminal Nilam',
  })
  title: string;

  @ApiProperty({
    description: 'KPI type',
    example: 'OUTPUT',
    enum: ['IMPACT', 'OUTPUT', 'KAI'],
  })
  type: string;

  @ApiProperty({
    description: 'Target value',
    example: 50000,
  })
  target: number;

  @ApiProperty({
    description: 'Target unit',
    example: 'TEUs',
  })
  targetUnit: string;

  @ApiProperty({
    description: 'Current status',
    example: 'draft',
    enum: ['draft', 'waiting_for_approval', 'approved', 'rejected'],
  })
  status: string;

  @ApiProperty({
    description: 'Achievement percentage',
    example: 85.5,
  })
  achievement: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-01-20T14:45:00Z',
  })
  updatedAt: Date;
}
```

#### **Error Response Documentation**

**Global Exception Filter with Swagger:**

```typescript
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiException } from '@nestjs/swagger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';

    if (exception instanceof BusinessException) {
      status = exception.getStatus();
      message = exception.message;
      errorCode = exception.errorCode;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    const errorResponse = {
      success: false,
      error: {
        code: errorCode,
        message,
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
      },
    };

    response.status(status).json(errorResponse);
  }
}

// Usage in DTOs
export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({
    type: 'object',
    properties: {
      code: { type: 'string', example: 'VALIDATION_ERROR' },
      message: { type: 'string', example: 'Validation failed' },
      timestamp: { type: 'string', example: '2025-01-20T14:45:00Z' },
      path: { type: 'string', example: '/api/kpi' },
    },
  })
  error: {
    code: string;
    message: string;
    timestamp: string;
    path: string;
  };
}
```

#### **Authentication Documentation**

**Custom Decorator for Authentication:**

```typescript
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export function Authenticated() {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiCookieAuth('smartkmsystemAuth'),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - Invalid or missing authentication token',
    }),
  );
}

// Usage in controllers
@Controller('kpi')
export class KpiController {
  @Get()
  @Authenticated()
  @ApiOperation({ summary: 'Get user KPIs' })
  async getUserKpis(@Req() req: Request) {
    // Implementation
  }
}
```

### **3. Application Structure**

#### **Modular Architecture**

Each business module follows this **strict structure**:

```
src/modules/[module-name]/
├── dto/                    # Data Transfer Objects
│   ├── create-[entity].dto.ts
│   ├── update-[entity].dto.ts
│   └── [entity].response.dto.ts
├── entities/              # TypeORM entities (if using ORM)
├── repositories/          # Data access layer
│   └── [entity].repository.ts
├── services/              # Business logic layer
│   └── [entity].service.ts
├── controllers/           # HTTP endpoints
│   └── [entity].controller.ts
├── guards/               # Route guards
├── interceptors/         # Request/Response interceptors
├── decorators/           # Custom decorators
├── [module-name].module.ts # Module definition
└── index.ts              # Module exports
```

#### **Infrastructure Layer**

Infrastructure components are **strictly separated** in dedicated folders:

```
src/infrastructure/
├── cache/                # Redis operations
│   ├── redis.service.ts
│   ├── redis.module.ts
│   └── interfaces/
├── queue/               # RabbitMQ operations (planned)
│   ├── rabbitmq.service.ts
│   ├── rabbitmq.module.ts
│   └── interfaces/
├── database/           # Database connections
│   ├── mysql.service.ts
│   ├── mysql.module.ts
│   └── migrations/      # Future database migrations
├── file-storage/       # External file operations
│   ├── file.service.ts  # Reference to tb_file table
│   └── interfaces/
└── monitoring/         # Observability
    ├── metrics.service.ts
    └── health.controller.ts
```

#### **Shared/Common Layer**

```
src/common/
├── decorators/          # Global decorators
├── guards/             # Global guards
├── interceptors/       # Global interceptors
├── filters/           # Exception filters
├── pipes/             # Validation pipes
├── interfaces/        # Shared interfaces
├── types/             # TypeScript types
└── utils/             # Utility functions
```

### **3. Module Examples**

#### **Auth Module Structure**

```
src/modules/auth/
├── dto/                    # Authentication DTOs
│   ├── login.dto.ts
│   └── token.response.dto.ts
├── strategies/            # Passport strategies
│   └── jwt.strategy.ts
├── guards/               # Authentication guards
│   ├── jwt-auth.guard.ts
│   └── roles.guard.ts
├── auth.service.ts       # Authentication business logic
├── auth.controller.ts    # Authentication endpoints
└── auth.module.ts       # Auth module definition
```

#### **My Performance Module Structure**

```
src/modules/my-performance/
├── dto/                    # Data Transfer Objects
│   ├── create-kpi.dto.ts
│   ├── submit-realization.dto.ts
│   └── kpi-list.response.dto.ts
├── services/              # Business logic layer
│   └── my-performance.service.ts
├── controllers/           # HTTP endpoints
│   └── my-performance.controller.ts
├── guards/               # Route guards
│   └── ownership.guard.ts
├── repositories/          # Data access layer (optional)
│   └── kpi.repository.ts
└── my-performance.module.ts # Module definition
```

#### **KPI Module Structure**

```
src/modules/kpi/
├── dto/                    # KPI DTOs
│   ├── create-kpi.dto.ts
│   ├── update-kpi.dto.ts
│   └── kpi.response.dto.ts
├── services/              # KPI business logic
│   └── kpi.service.ts
├── controllers/           # KPI endpoints
│   └── kpi.controller.ts
├── entities/              # TypeORM entities (future)
│   └── kpi.entity.ts
├── guards/               # KPI-specific guards
│   └── kpi-ownership.guard.ts
└── kpi.module.ts        # KPI module definition
```

---

## 🔐 Authentication & Authorization

### **1. Token Handling**

#### **Cookie-Based Authentication**

- **Cookie Name**: `smartkmsystemAuth`
- **Token Type**: Bearer token in cookie value
- **Format**: `Bearer <jwt_token>`

#### **Token Validation Flow**

```
1. Extract token from cookie 'smartkmsystemAuth'
2. Parse JWT payload (user_id, employee_number, permissions)
3. Query database for user details and permissions
4. Cache user session in Redis (TTL: 1 hour)
5. Attach user context to request object
```

### **2. Authentication Service**

#### **Redis Caching Strategy**

```typescript
// Cache key format: user:{employee_number}
const CACHE_KEY = `user:${employeeNumber}`;
const CACHE_TTL = 3600; // 1 hour

// Cache structure
interface CachedUser {
  employeeNumber: string;
  employeeName: string;
  positionId: string;
  departmentId: string;
  permissions: string[];
  lastLogin: Date;
  sessionId: string;
}
```

#### **Database Queries**

```sql
-- User lookup query
SELECT
  e.employee_number,
  e.employee_name,
  p.position_master_variant_id,
  d.department_id,
  r.role_name,
  p.permissions
FROM tb_employee e
JOIN tb_position_master_variant p ON e.position_id = p.position_id
JOIN tb_department d ON e.department_id = d.department_id
LEFT JOIN tb_roles r ON e.role_id = r.role_id
WHERE e.employee_number = ?
  AND e.is_active = 1;
```

### **3. Guards Implementation**

#### **JWT Auth Guard**

```typescript
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      // Check Redis cache first
      const cachedUser = await this.redisService.get(`user:${token.sub}`);
      if (cachedUser) {
        request.user = cachedUser;
        return true;
      }

      // Fallback to database lookup
      const user = await this.authService.validateUser(token.sub);
      await this.redisService.set(`user:${token.sub}`, user, CACHE_TTL);
      request.user = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid authentication token');
    }
  }

  private extractTokenFromCookie(request: Request): string | null {
    const cookies = request.cookies || {};
    const authCookie = cookies['smartkmsystemAuth'];

    if (!authCookie || !authCookie.startsWith('Bearer ')) {
      return null;
    }

    return authCookie.substring(7); // Remove 'Bearer ' prefix
  }
}
```

---

## 📝 Code Style Guidelines

### **1. TypeScript Configuration**

#### **tsconfig.json (Strict Mode)**

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2020",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["src/*"],
      "@/common/*": ["src/common/*"],
      "@/modules/*": ["src/modules/*"],
      "@/infrastructure/*": ["src/infrastructure/*"]
    }
  }
}
```

### **2. Naming Conventions**

#### **Files and Folders**

- **PascalCase**: Classes, interfaces, types, enums
- **camelCase**: Variables, functions, methods, properties
- **kebab-case**: File names, folder names
- **UPPER_CASE**: Constants, environment variables

#### **Examples**

```typescript
// ✅ Correct
src/modules/my-performance/
├── dto/
│   ├── create-kpi.dto.ts
│   └── kpi-response.dto.ts
├── services/
│   └── my-performance.service.ts
└── my-performance.module.ts

// ❌ Incorrect
src/modules/MyPerformance/
├── DTO/
│   ├── CreateKPI.dto.ts
├── services/
│   └── MyPerformanceService.ts
```

#### **Class and Interface Names**

```typescript
// ✅ Correct
export class CreateKpiDto {}
export interface KpiResponse {}
export type KpiStatus = 'draft' | 'approved' | 'rejected';

// ❌ Incorrect
export class createKPIDTO {}
export interface kpi_response {}
export type KPI_STATUS = 'DRAFT' | 'APPROVED' | 'REJECTED';
```

### **3. Import/Export Guidelines**

#### **Import Order**

```typescript
// 1. Node.js built-ins
import { promises as fs } from 'fs';

// 2. External libraries
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// 3. Internal modules (using path mapping)
import { DatabaseService } from '@/infrastructure/database/database.service';
import { KpiEntity } from '@/modules/kpi/entities/kpi.entity';
import { CreateKpiDto } from './dto/create-kpi.dto';

// 4. Relative imports (only when necessary)
import { HelperUtil } from '../utils/helper.util';
```

#### **Export Patterns**

```typescript
// ✅ Preferred: Named exports
export class KpiService {}
export interface IKpiService {}

// ✅ Also acceptable: Default export with named export
export class KpiService {}
export default KpiService;

// ❌ Avoid: Only default exports
export default class KpiService {}
```

### **4. Code Structure Patterns**

#### **Controller Pattern**

```typescript
@Controller('kpi')
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  @Get()
  async findAll(@Req() req: Request) {
    return this.kpiService.findAll(req.user.employeeNumber);
  }

  @Post()
  async create(@Body() dto: CreateKpiDto, @Req() req: Request) {
    return this.kpiService.create(dto, req.user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateKpiDto,
    @Req() req: Request,
  ) {
    return this.kpiService.update(id, dto, req.user);
  }
}
```

#### **Service Pattern**

```typescript
@Injectable()
export class KpiService {
  constructor(
    private readonly kpiRepository: KpiRepository,
    private readonly redisService: RedisService,
  ) {}

  async findAll(employeeNumber: string): Promise<KpiResponseDto[]> {
    // Check cache first
    const cacheKey = `kpi:list:${employeeNumber}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;

    // Query database
    const kpis = await this.kpiRepository.findByEmployee(employeeNumber);

    // Cache result
    await this.redisService.set(cacheKey, kpis, 300); // 5 minutes

    return kpis;
  }

  async create(dto: CreateKpiDto, user: UserContext): Promise<KpiResponseDto> {
    // Business logic validation
    await this.validateKpiCreation(dto, user);

    // Create entity
    const kpi = await this.kpiRepository.create({
      ...dto,
      createdBy: user.employeeNumber,
      employeeNumber: user.employeeNumber,
    });

    // Invalidate cache
    await this.redisService.del(`kpi:list:${user.employeeNumber}`);

    return kpi;
  }
}
```

#### **Repository Pattern**

```typescript
@Injectable()
export class KpiRepository {
  constructor(
    @Inject('MYSQL_CONNECTION')
    private readonly connection: mysql.Connection,
  ) {}

  async findByEmployee(employeeNumber: string): Promise<KpiEntity[]> {
    const query = `
      SELECT k.*, o.weight, o.ownership_type
      FROM kpi_v3 k
      JOIN kpi_ownership_v3 o ON k.kpi_id = o.kpi_id
      WHERE o.employee_number = ?
        AND k.is_active = 1
        AND k.deleted_at IS NULL
      ORDER BY k.type, o.weight DESC
    `;

    const [rows] = await this.connection.execute(query, [employeeNumber]);
    return rows as KpiEntity[];
  }

  async create(data: Partial<KpiEntity>): Promise<KpiEntity> {
    const query = `
      INSERT INTO kpi_v3 (
        title, description, type, target, target_unit,
        created_by_employee_number, employee_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.title,
      data.description,
      data.type,
      data.target,
      data.targetUnit,
      data.createdByEmployeeNumber,
      data.employeeNumber,
    ];

    const [result] = await this.connection.execute(query, values);
    return { ...data, kpiId: result.insertId } as KpiEntity;
  }
}
```

### **5. Error Handling**

#### **Custom Exceptions**

```typescript
export class BusinessException extends HttpException {
  constructor(
    message: string,
    public readonly errorCode: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ message, errorCode, timestamp: new Date() }, status);
  }
}

// Usage
throw new BusinessException(
  'KPI weight total must equal 100%',
  'KPI_WEIGHT_TOTAL_INVALID',
  HttpStatus.UNPROCESSABLE_ENTITY,
);
```

#### **Global Exception Filter**

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';

    if (exception instanceof BusinessException) {
      status = exception.getStatus();
      message = exception.message;
      errorCode = exception.errorCode;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    this.logger.error(
      `[${request.method}] ${request.url} - ${message}`,
      exception,
    );

    response.status(status).json({
      success: false,
      error: {
        code: errorCode,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}
```

---

## 🧪 Testing Guidelines

### **1. Testing Stack**

#### **Unit Testing**

- **Framework**: Jest v30.0.0
- **Assertion Library**: Built-in Jest assertions
- **Mock Library**: jest-mock
- **Coverage**: Minimum 80% coverage required

#### **Integration Testing**

- **Framework**: Jest with Supertest
- **Database**: Separate test database
- **External APIs**: Mocked with nock

#### **E2E Testing**

- **Framework**: Jest with Supertest
- **Database**: Docker-based test database
- **Full Flow**: Complete user journeys

### **2. Test Structure**

#### **Unit Test Structure**

```
src/modules/[module]/
├── [service].spec.ts          # Unit tests for service
├── [repository].spec.ts       # Unit tests for repository
├── [controller].spec.ts       # Unit tests for controller
└── dto/
    └── [dto].spec.ts          # Unit tests for DTOs
```

#### **Test Structure**

```
test/
├── integration/         # Integration tests
│   ├── [module]/
│   │   ├── [feature].spec.ts
│   │   └── setup.ts
│   └── setup.ts
└── e2e/                 # End-to-end tests
    ├── [module]/
    │   ├── [feature].spec.ts
    │   └── setup.ts
    └── setup.ts
```

#### **Unit Test Structure**

```
src/modules/[module]/
├── [service].spec.ts          # Unit tests for service
├── [repository].spec.ts       # Unit tests for repository
├── [controller].spec.ts       # Unit tests for controller
└── dto/
    └── [dto].spec.ts          # Unit tests for DTOs
```

### **3. Test Patterns**

#### **Unit Test Example**

```typescript
describe('KpiService', () => {
  let service: KpiService;
  let repository: jest.Mocked<KpiRepository>;
  let redisService: jest.Mocked<RedisService>;

  beforeEach(async () => {
    const mockRepository = {
      findByEmployee: jest.fn(),
      create: jest.fn(),
    };

    const mockRedis = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KpiService,
        { provide: KpiRepository, useValue: mockRepository },
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();

    service = module.get<KpiService>(KpiService);
    repository = module.get(KpiRepository);
    redisService = module.get(RedisService);
  });

  describe('findAll', () => {
    it('should return cached data if available', async () => {
      // Arrange
      const employeeNumber = 'EMP001';
      const cachedKpis = [{ id: 1, title: 'Test KPI' }];
      redisService.get.mockResolvedValue(cachedKpis);

      // Act
      const result = await service.findAll(employeeNumber);

      // Assert
      expect(result).toEqual(cachedKpis);
      expect(repository.findByEmployee).not.toHaveBeenCalled();
    });

    it('should fetch from database if cache miss', async () => {
      // Arrange
      const employeeNumber = 'EMP001';
      const dbKpis = [{ id: 1, title: 'Test KPI' }];
      redisService.get.mockResolvedValue(null);
      repository.findByEmployee.mockResolvedValue(dbKpis);

      // Act
      const result = await service.findAll(employeeNumber);

      // Assert
      expect(result).toEqual(dbKpis);
      expect(repository.findByEmployee).toHaveBeenCalledWith(employeeNumber);
      expect(redisService.set).toHaveBeenCalled();
    });
  });
});
```

#### **Integration Test Example**

```typescript
describe('KPI Creation (Integration)', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DatabaseService)
      .useClass(TestDatabaseService)
      .compile();

    app = moduleFixture.createNestApplication();
    databaseService = moduleFixture.get(DatabaseService);

    // Setup test database
    await databaseService.setupTestDatabase();

    await app.init();

    // Get auth token for test user
    authToken = await getAuthToken(app, 'test_employee');
  });

  afterAll(async () => {
    await databaseService.cleanupTestDatabase();
    await app.close();
  });

  describe('POST /kpi', () => {
    it('should create KPI successfully', async () => {
      const createKpiDto = {
        title: 'Test KPI',
        description: 'Test KPI Description',
        type: 'OUTPUT',
        target: 100,
        targetUnit: 'units',
      };

      const response = await request(app.getHttpServer())
        .post('/kpi')
        .set('Cookie', [`smartkmsystemAuth=Bearer ${authToken}`])
        .send(createKpiDto)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          title: 'Test KPI',
          type: 'OUTPUT',
          status: 'draft',
        },
      });

      // Verify database state
      const kpiInDb = await databaseService.query(
        'SELECT * FROM kpi_v3 WHERE title = ?',
        ['Test KPI'],
      );
      expect(kpiInDb[0]).toBeDefined();
    });

    it('should validate required fields', async () => {
      const invalidDto = {
        description: 'Missing title',
        type: 'OUTPUT',
      };

      await request(app.getHttpServer())
        .post('/kpi')
        .set('Cookie', [`smartkmsystemAuth=Bearer ${authToken}`])
        .send(invalidDto)
        .expect(400)
        .expect((res) => {
          expect(res.body.error.code).toBe('VALIDATION_ERROR');
        });
    });
  });
});
```

### **4. Test Coverage Requirements**

#### **Coverage Thresholds**

```json
{
  "jest": {
    "collectCoverageFrom": [
      "**/*.(t|j)s",
      "!**/*.spec.ts",
      "!**/*.config.ts",
      "!**/node_modules/**",
      "!**/dist/**"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

#### **Coverage Areas**

- **Statements**: 80% minimum
- **Branches**: 80% minimum (if/else, switch)
- **Functions**: 80% minimum
- **Lines**: 80% minimum

### **5. Test Data Management**

#### **Test Database Setup**

```typescript
@Injectable()
export class TestDatabaseService {
  private connection: mysql.Connection;

  async setupTestDatabase() {
    // Create test database
    this.connection = await mysql.createConnection({
      host: 'localhost',
      user: 'test_user',
      password: 'test_pass',
      database: 'pms_test',
    });

    // Run migrations
    await this.runMigrations();

    // Seed test data
    await this.seedTestData();
  }

  async cleanupTestDatabase() {
    // Clean up test data
    await this.connection.execute('DELETE FROM kpi_realization_log_v3');
    await this.connection.execute('DELETE FROM kpi_realization_v3');
    await this.connection.execute('DELETE FROM kpi_ownership_v3');
    await this.connection.execute('DELETE FROM kpi_v3');
  }

  private async seedTestData() {
    // Insert test employees
    await this.connection.execute(`
      INSERT INTO tb_employee (employee_number, employee_name, is_active)
      VALUES ('EMP001', 'Test Employee 1', 1)
    `);

    // Insert test positions
    await this.connection.execute(`
      INSERT INTO tb_position_master_variant (position_master_variant_id, position_name)
      VALUES ('POS001', 'Test Position 1')
    `);
  }
}
```

---

## 🚀 Deployment & DevOps

### **1. Containerization**

#### **Dockerfile (Multi-stage)**

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine AS production
RUN apk add --no-cache dumb-init
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN npm run build

USER node
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start:prod"]
```

#### **docker-compose.yml (Development)**

```yaml
version: '3.8'
services:
  pms-service:
    build: .
    ports:
      - '3000:3000'
    environment:
      - DB_HOST=mysql
      - DB_USERNAME=pms_user
      - DB_PASSWORD=password
      - DB_DATABASE=pms_db
      - REDIS_HOST=redis
    depends_on:
      - mysql
      - redis
    volumes:
      - .:/app
      - /app/node_modules

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=pms_db
      - MYSQL_USER=pms_user
      - MYSQL_PASSWORD=password
    ports:
      - '3306:3306'
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'

volumes:
  mysql_data:
```

### **2. Environment Configuration**

#### **Environment Variables**

```bash
# Application
NODE_ENV=production
PORT=3000

# Database
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=pms_user
DB_PASSWORD=secure_password
DB_DATABASE=pms_db

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# External Services
P_KPI_BASE_URL=https://api.p-kpi.com
MDM_BASE_URL=https://api.mdm.com
DICTIONARY_BASE_URL=https://api.dictionary.com
FILE_STORAGE_BASE_URL=https://api.files.com

# JWT (generate secure keys)
JWT_SECRET=your_secure_jwt_secret_here

# Monitoring
MONITORING_ENABLED=true
MONITORING_ENDPOINT=https://monitoring.company.com/v1/logs
```

### **3. Health Checks**

#### **Health Controller**

```typescript
@Controller('health')
export class HealthController {
  constructor(
    private readonly db: DatabaseService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  async health() {
    const dbHealth = await this.checkDatabase();
    const redisHealth = await this.checkRedis();

    const isHealthy = dbHealth && redisHealth;

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth ? 'up' : 'down',
        redis: redisHealth ? 'up' : 'down',
      },
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.db.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  private async checkRedis(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch {
      return false;
    }
  }
}
```

---

## 📊 Monitoring & Observability

### **1. Logging**

#### **Structured Logging**

```typescript
@Injectable()
export class LoggerService {
  private logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
    ),
    defaultMeta: { service: 'pms-service' },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
        ),
      }),
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
      }),
    ],
  });

  info(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  error(message: string, error?: Error, meta?: any) {
    this.logger.error(message, {
      error: error?.message,
      stack: error?.stack,
      ...meta,
    });
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, meta);
  }
}
```

### **2. Metrics**

#### **Performance Metrics**

```typescript
@Injectable()
export class MetricsService {
  private readonly responseTime = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
  });

  recordResponseTime(
    method: string,
    route: string,
    statusCode: number,
    duration: number,
  ) {
    this.responseTime
      .labels(method, route, statusCode.toString())
      .observe(duration);
  }

  getMetrics() {
    return promClient.register.metrics();
  }
}
```

---

## 🔄 API Versioning & Evolution

### **1. API Versioning Strategy**

#### **URL Path Versioning**

```
/api/v1/kpi
/api/v1/my-performance
/api/v1/team
```

#### **Version Header**

```
Accept-Version: v1
```

### **2. Backward Compatibility**

#### **Deprecation Strategy**

```typescript
@Controller('kpi')
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  // Current version
  @Get()
  async findAllV1(@Req() req: Request) {
    return this.kpiService.findAll(req.user.employeeNumber);
  }

  // Deprecated version (still supported)
  @Get('legacy')
  @Deprecated('Use /kpi endpoint instead')
  async findAllLegacy(@Req() req: Request) {
    return this.kpiService.findAllLegacy(req.user.employeeNumber);
  }
}

// Deprecation decorator
export function Deprecated(message: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // Log deprecation warning
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      console.warn(`DEPRECATED: ${propertyKey} - ${message}`);
      return original.apply(this, args);
    };
  };
}
```

---

## 📚 Development Workflow

### **1. Git Workflow**

#### **Branch Naming**

```
feature/PMS-123-add-kpi-validation
bugfix/PMS-456-fix-approval-workflow
hotfix/PMS-789-critical-auth-fix
```

#### **Commit Messages**

```
feat: add KPI validation for weight totals
fix: resolve approval workflow race condition
docs: update API documentation for KPI endpoints
refactor: optimize database queries for performance
test: add unit tests for KPI service
```

### **2. Code Review Checklist**

#### **For Reviewers**

- [ ] **Swagger Documentation**: All endpoints have @ApiOperation, @ApiResponse decorators
- [ ] **DTO Validation**: DTOs use both class-validator and @ApiProperty decorators
- [ ] **Error Responses**: All possible error responses are documented with proper HTTP status codes
- [ ] **Authentication**: Cookie-based auth documented with @ApiCookieAuth
- [ ] TypeScript types are properly defined
- [ ] Database queries are optimized and use indexes
- [ ] Business rules are correctly implemented
- [ ] Error handling is comprehensive
- [ ] Authentication/authorization is properly implemented
- [ ] Caching strategy is appropriate
- [ ] Tests are written and passing (80% coverage)
- [ ] Documentation is updated
- [ ] Security best practices are followed

#### **For Contributors**

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No linting errors
- [ ] Database migrations are included
- [ ] Documentation is updated
- [ ] Security implications are considered

---

## 🛡️ Security Guidelines

### **1. Input Validation**

#### **DTO Validation**

```typescript
import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateKpiDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsIn(['IMPACT', 'OUTPUT', 'KAI'])
  type: string;

  @IsNumber()
  @Min(0)
  target: number;

  @IsNotEmpty()
  @IsString()
  targetUnit: string;
}
```

### **2. SQL Injection Prevention**

#### **Parameterized Queries**

```typescript
// ✅ Safe
const [rows] = await this.connection.execute(
  'SELECT * FROM kpi_v3 WHERE employee_number = ? AND type = ?',
  [employeeNumber, type],
);

// ❌ Unsafe
const [rows] = await this.connection.execute(
  `SELECT * FROM kpi_v3 WHERE employee_number = '${employeeNumber}'`,
);
```

### **3. Rate Limiting**

#### **Global Rate Limiting**

```typescript
@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly requests = new Map<
    string,
    { count: number; resetTime: number }
  >();

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 100;

    const userRequests = this.requests.get(ip) || {
      count: 0,
      resetTime: now + windowMs,
    };

    if (now > userRequests.resetTime) {
      userRequests.count = 1;
      userRequests.resetTime = now + windowMs;
    } else {
      userRequests.count++;
    }

    this.requests.set(ip, userRequests);

    if (userRequests.count > maxRequests) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
```

---

## 📈 Performance Guidelines

### **1. Database Optimization**

#### **Index Usage**

- Always include indexed columns in WHERE clauses
- Use composite indexes for multi-column queries
- Avoid SELECT \* for large tables
- Use LIMIT for pagination

#### **Connection Pooling**

```typescript
// Database configuration
export const databaseConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
};
```

### **2. Caching Strategy**

#### **Cache Keys Pattern**

```
user:{employee_number}              # User session data
kpi:list:{employee_number}          # User's KPI list
kpi:detail:{kpi_id}                 # KPI details
team:list:{manager_employee_number} # Team member list
```

#### **Cache TTL Strategy**

```typescript
const CACHE_TTL = {
  user_session: 3600, // 1 hour
  kpi_list: 300, // 5 minutes
  kpi_detail: 600, // 10 minutes
  team_list: 1800, // 30 minutes
  reference_data: 86400, // 24 hours
};
```

### **3. Query Optimization**

#### **Avoid N+1 Queries**

```typescript
// ❌ N+1 Problem
const kpis = await this.kpiRepository.findAll();
for (const kpi of kpis) {
  kpi.ownership = await this.ownershipRepository.findByKpiId(kpi.id);
}

// ✅ Solution: Use JOIN or batch load
const kpisWithOwnership = await this.kpiRepository.findAllWithOwnership();
```

#### **Pagination**

```typescript
async findPaginated(
  employeeNumber: string,
  page: number = 1,
  limit: number = 20
): Promise<{ data: KpiEntity[]; total: number }> {
  const offset = (page - 1) * limit;

  const [data] = await this.connection.execute(
    'SELECT * FROM kpi_v3 WHERE employee_number = ? LIMIT ? OFFSET ?',
    [employeeNumber, limit, offset]
  );

  const [countResult] = await this.connection.execute(
    'SELECT COUNT(*) as total FROM kpi_v3 WHERE employee_number = ?',
    [employeeNumber]
  );

  return {
    data: data as KpiEntity[],
    total: countResult[0].total,
  };
}
```

---

## 🎯 Quality Assurance

### **1. Code Quality Tools**

#### **ESLint Configuration**

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', '@typescript-eslint/recommended', 'prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
  },
};
```

#### **Prettier Configuration**

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### **2. Pre-commit Hooks**

#### **Husky + lint-staged**

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "prettier --write",
      "jest --findRelatedTests --passWithNoTests"
    ]
  }
}
```

---

## 🔄 Continuous Integration

### **1. GitHub Actions Workflow**

#### **CI Pipeline**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: pms_test
        ports:
          - 3306:3306
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run tests
        run: npm run test:cov
        env:
          DB_HOST: localhost
          DB_USERNAME: root
          DB_PASSWORD: root
          DB_DATABASE: pms_test

      - name: Build application
        run: npm run build

      - name: Run security audit
        run: npm audit --audit-level high
```

### **2. Deployment Pipeline**

#### **CD Pipeline**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t pms-service:${{ github.sha }} .

      - name: Run database migrations
        run: docker run --rm --network host pms-service:${{ github.sha }} npm run db:migrate

      - name: Deploy to Kubernetes
        run: kubectl apply -f k8s/deployment.yaml

      - name: Run health checks
        run: |
          kubectl rollout status deployment/pms-service
          curl -f https://api.company.com/health || exit 1
```

---

## 📚 References

### **Key Documentation**

- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Redis Documentation](https://redis.io/documentation)
- [Swagger/OpenAPI Specification](https://swagger.io/specification/)

### **PRD Documents**

- `docs/prd/PEL-004-PMS-BRD.md` - Business Requirements Document
- `docs/prd/backend-guideline.md` - **Backend Development Guidelines** 📋
- `docs/prd/part-1-my-performance.md` - My Performance Requirements
- `docs/prd/part-2-my-team-performance.md` - Team Performance Requirements
- `docs/prd/part-3-kpi-dictionary.md` - KPI Dictionary Requirements
- `docs/prd/part-4-performance-tree.md` - Performance Tree Requirements
- `docs/prd/part-5-performance-hq.md` - Performance HQ Requirements

### **Database Documentation**

- `src/database/script/ddl/tables/README.md` - Database Schema Documentation
- `src/database/script/ddl/indexes/01_performance_indexes.sql` - Performance Indexes

---

**Document Version**: 1.0.0
**Last Updated**: December 2025
**Framework**: NestJS v11.0.1
**Architecture**: Modular Microservice
**Status**: Living Document - Update for every agentic call

---

_This document serves as the comprehensive guideline for PMS backend development. It must be consulted and followed for every development task and agentic interaction._
