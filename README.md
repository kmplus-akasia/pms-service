# Pelindo Performance Management System (PMS) Service

## 📋 Overview

The **Pelindo PMS Service** is a comprehensive Employee Performance Management System built for PT Pelindo, Indonesia's state-owned port management company. This backend service manages the complete performance lifecycle from KPI planning and cascading to monitoring and evaluation.

### 🎯 Business Context

- **Company**: PT Pelindo (Port Management Company)
- **Document**: PEL-004-PMS-BRD (Business Requirements Document)
- **Version**: 5.0.0 (Edition)
- **Target Users**: All employees from BOD to Staff level
- **Scope**: Corporate-wide performance management system

### 📊 System Architecture

```mermaid
graph TB
    A[Frontend (React)] --> B[PMS Service]
    B --> C[(MySQL Database)]
    B --> D[P-KPI System]
    B --> E[MDM System]
    B --> F[Portaverse]

    subgraph "External Systems"
        D
        E
        F
    end

    subgraph "Core Modules"
        G[My Performance]
        H[My Team Performance]
        I[KPI Dictionary]
        J[Performance Tree]
        K[Performance HQ]
    end

    B --> G
    B --> H
    B --> I
    B --> J
    B --> K
```

## 🚀 Key Features

### 1. **Three-Tier KPI Structure**

#### KPI Impact (Corporate KPIs)

- Derived from CEO's KPI Output (corporate-wide)
- Identical for all employees (items are the same, weights differ by cohort)
- Quarterly monitoring frequency
- Auto-assigned from P-KPI system

#### KPI Output (Position-Specific KPIs)

- Individual performance indicators specific to job positions
- Can be cascaded to subordinates
- Monthly/Quarterly monitoring
- Supports Direct and Indirect cascading methods

#### Key Activity Indicators (KAI)

- Operational activity indicators
- Specific per position OR Common for all employees
- Weekly/Monthly monitoring frequency

### 2. **Performance Calculation Formula**

```
Performance Score = 100% from KPIs only
- Impact + Output + KAI = 100%
- No behavioral assessment or 360-degree evaluation
- Transition period (Q4 2025): 40% Impact + 60% Output
- End-state (2026+): Impact + Output + KAI = 100%
```

### 3. **Core Modules**

#### **My Performance** 👤

- Personal KPI management and planning
- Realization input and progress tracking
- Performance dashboard and monitoring
- Evidence attachment and approval workflow

#### **My Team Performance** 👥

- Team dashboard and member performance monitoring
- KPI allocation and cascading to subordinates
- Two-stage approval workflow (per-item + portfolio)
- Bulk operations and team calendar

#### **KPI Dictionary** 📚

- Standardized KPI catalog for reference
- Template-based KPI creation
- Validation rules and approval workflow

#### **Performance Tree** 🌳

- Hierarchical KPI structure visualization
- Position-based KPI allocation
- Cascading relationship management

#### **Performance HQ** ⚙️

- Administrative configuration module
- Cohort weight management
- Common KAI management
- System-wide KPI overrides

### 4. **Advanced Features**

#### **Cascading Methods**

- **Direct Cascade**: Child realization contributes directly to parent (sum)
- **Indirect Cascade**: Child progress doesn't auto-contribute to parent

#### **Ownership Types**

- **Owner**: Sole responsibility for KPI realization
- **Shared Owner**: Joint responsibility with equal scoring
- **Collaborator**: Has own KPI derived from cascading

#### **Cohort-Based Calibration**

- BOD, BOD-1, BOD-2, BOD-3, BOD-4 levels
- Fair performance evaluation across organizational levels
- Weight adjustments per cohort

## 🛠 Technology Stack

### Backend Framework

- **Framework**: NestJS v11.0.1
- **Language**: TypeScript 5.7.3
- **Runtime**: Node.js

### Database

- **Primary**: MySQL 8.0+
- **ORM**: TypeORM (planned)
- **Migration**: Custom SQL scripts
- **Charset**: UTF8MB4

### Development Tools

- **Build**: NestJS CLI
- **Linting**: ESLint + Prettier
- **Testing**: Jest
- **Documentation**: OpenAPI/Swagger (accessible at `/api`)

### Key Dependencies

```json
{
  "@nestjs/common": "^11.0.1",
  "@nestjs/core": "^11.0.1",
  "@nestjs/platform-express": "^11.0.1",
  "reflect-metadata": "^0.2.2",
  "rxjs": "^7.8.1"
}
```

## 📁 Project Structure

```
pms-service/
├── src/
│   ├── common/                 # Shared utilities
│   │   ├── decorators/        # Custom decorators
│   │   ├── filters/          # Exception filters
│   │   ├── guards/           # Authentication guards
│   │   ├── interceptors/     # Request interceptors
│   │   ├── pipes/            # Validation pipes
│   │   ├── interfaces/       # Shared TypeScript interfaces
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── config/               # Configuration modules
│   ├── database/             # Database related
│   │   ├── entities/         # TypeORM entities (planned)
│   │   ├── migrations/       # Database migrations (planned)
│   │   └── script/
│   │       └── ddl/
│   │           ├── indexes/  # Performance indexes
│   │           └── tables/   # SQL table definitions
│   ├── infrastructure/       # Infrastructure layer
│   │   ├── cache/           # Redis operations
│   │   │   ├── redis.service.ts
│   │   │   ├── redis.module.ts
│   │   │   └── interfaces/
│   │   ├── queue/           # RabbitMQ operations
│   │   │   ├── rabbitmq.service.ts
│   │   │   ├── rabbitmq.module.ts
│   │   │   └── interfaces/
│   │   ├── database/        # Database connections
│   │   │   ├── mysql.service.ts
│   │   │   ├── mysql.module.ts
│   │   │   └── migrations/
│   │   ├── file-storage/    # External file operations
│   │   │   ├── file.service.ts
│   │   │   └── interfaces/
│   │   └── monitoring/      # Observability
│   │       ├── metrics.service.ts
│   │       └── health.controller.ts
│   ├── modules/              # Feature modules
│   │   ├── auth/            # Authentication & authorization
│   │   │   ├── dto/
│   │   │   ├── strategies/
│   │   │   ├── guards/
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   ├── calendar/        # Performance calendar
│   │   ├── dictionary/      # KPI dictionary module
│   │   ├── kpi/             # KPI management
│   │   ├── my-performance/  # Individual performance
│   │   │   ├── dto/
│   │   │   ├── services/
│   │   │   ├── controllers/
│   │   │   ├── guards/
│   │   │   └── my-performance.module.ts
│   │   ├── performance-tree/ # KPI hierarchy
│   │   └── team/            # Team management
│   ├── app.controller.ts    # Main application controller
│   ├── app.module.ts        # Root application module
│   ├── app.service.ts       # Main application service
│   └── main.ts              # Application entry point
├── docs/
│   └── prd/                 # Product Requirements Documents
│       ├── PEL-004-PMS-BRD.md
│       ├── part-1-my-performance.md
│       ├── part-2-my-team-performance.md
│       ├── part-3-kpi-dictionary.md
│       ├── part-4-performance-tree.md
│       ├── part-5-performance-hq.md
│       ├── backend-guideline.md     # 📋 THIS DOCUMENT
│       └── monitoring-planning.md
├── test/                    # Test files
│   ├── integration/         # Integration tests
│   └── e2e/                 # End-to-end tests
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

## 🗄️ Database Schema

### Core Tables Overview

| Table                | Purpose                     | Key Features                               |
| -------------------- | --------------------------- | ------------------------------------------ |
| `kpi_v3`             | Main KPI definitions        | Three-tier structure, cascading, ownership |
| `kpi_ownership_v3`   | KPI assignment to employees | Owner/Shared Owner/Collaborator types      |
| `kpi_realization_v3` | KPI realization tracking    | Progress input, approvals, evidence        |
| `kpi_score_v3`       | Performance scoring         | Proportional calculations, weightings      |
| `position_cohort`    | Organizational cohorts      | BOD-1 to BOD-4 levels                      |
| `cohort_kpi_formula` | Scoring formulas            | Weight configurations per cohort           |

### Audit Trail Tables

All major tables include corresponding log tables with full audit capabilities:

- `*_log_v3` tables with `created_at`, `updated_at`, `deleted_at` timestamps
- Comprehensive change tracking for compliance and debugging

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pms-service
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Create .env file with your database configuration
   cat > .env << EOF
   # Database Configuration (required)
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=pms_user
   DB_PASSWORD=your_password_here
   DB_DATABASE=pms_db

   # External Systems (configure as needed)
   P_KPI_BASE_URL=https://p-kpi-api.example.com
   MDM_BASE_URL=https://mdm-api.example.com
   DICTIONARY_BASE_URL=https://dictionary-api.example.com
   FILE_STORAGE_BASE_URL=https://files.example.com

   # Application
   JWT_SECRET=your_jwt_secret_here
   PORT=3000
   NODE_ENV=development
   EOF
   ```

4. **Set up database**

   ```bash
   # Option 1: Using npm scripts (recommended)
   npm run db:migrate

   # Option 2: Manual migration with environment variables
   DB_USERNAME=pms_user DB_PASSWORD=password DB_DATABASE=pms_db npm run db:migrate

   # Option 3: Dry run (see what would be executed)
   npm run db:migrate:dry

   # Option 4: Force recreate tables
   npm run db:migrate:force

   # Option 5: Get help
   npm run db:migrate:help
   ```

5. **Start development server**
   ```bash
   npm run start:dev
   ```

### Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debug mode

# Production
npm run build             # Build for production
npm run start:prod        # Start production server

# Database Migration
npm run db:migrate         # Run database migration
npm run db:migrate:dry     # Dry run migration (show what would be executed)
npm run db:migrate:force   # Force recreate tables
npm run db:migrate:help    # Show migration help

# Testing
npm run test              # Run unit tests
npm run test:e2e          # Run end-to-end tests
npm run test:cov          # Run tests with coverage

# Code Quality
npm run lint              # Run ESLint
npm run format            # Format code with Prettier
```

## 📚 API Documentation

### Swagger/OpenAPI

When the application is running, comprehensive API documentation is available at:

- **URL**: `http://localhost:3000/api`
- **Features**: Interactive API testing, schema validation, authentication
- **Tags**: Organized by modules (auth, my-performance, team, kpi, etc.)
- **Authentication**: Cookie-based (`smartkmsystemAuth`)

### Authentication

- JWT-based authentication (via cookies)
- Cookie name: `smartkmsystemAuth`
- Role-based access control (RBAC)
- Employee number as primary identifier

### Key Endpoints

#### My Performance Module

- `GET /my-performance/dashboard` - Personal performance overview
- `POST /my-performance/kpi/draft` - Create KPI draft
- `PUT /my-performance/realization/{id}` - Submit realization
- `GET /my-performance/calendar` - Performance calendar

#### Team Performance Module

- `GET /team/dashboard` - Team performance overview
- `POST /team/kpi/allocate` - Allocate KPI to team member
- `PUT /team/approval/{id}` - Approve/reject KPI or realization

#### KPI Dictionary Module

- `GET /dictionary/search` - Search KPI templates
- `POST /dictionary/validate` - Validate KPI against dictionary

#### Performance Tree Module

- `GET /performance-tree/{positionId}` - Get position KPI tree
- `POST /performance-tree/cascade` - Create cascading relationship

## 🔧 Development Guidelines

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration with Prettier
- **Naming**: CamelCase for variables/functions, PascalCase for classes
- **Imports**: Group by external libraries, then internal modules

### Database Conventions

- **Table Naming**: `snake_case` with version suffix (e.g., `kpi_v3`)
- **Primary Keys**: Auto-increment BIGINT named `table_name_id`
- **Foreign Keys**: Named `fk_table_name_field`
- **Indexes**: Named `idx_table_name_field`

### Commit Messages

```
feat: add KPI cascading functionality
fix: resolve approval workflow bug
docs: update API documentation
refactor: optimize database queries
```

### Testing Strategy

- **Unit Tests**: Service methods and utilities
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Complete user workflows

## 🔄 Integration Points

### External Systems

#### **P-KPI System**

- Master data source for corporate KPIs
- API synchronization for KPI Impact
- Real-time data sync capabilities

#### **MDM (Master Data Management)**

- Employee and organizational data
- Position hierarchy and reporting structure
- User authentication and authorization

#### **Portaverse**

- Legacy system integration
- Historical data migration
- Position-specific KPI templates

### Data Flow

1. **Master Data Sync**: Daily sync from P-KPI and MDM
2. **KPI Planning**: Employees draft KPIs → Atasan approval → Finalization
3. **Realization Input**: Weekly/Monthly data entry with evidence
4. **Scoring Calculation**: Automated scoring based on formulas
5. **Reporting**: Real-time dashboards and periodic reports

## 📋 Business Rules

### Performance Scoring

- **100% KPI-based** (no behavioral component)
- **Proportional scoring** for mid-period joins/transfers
- **Cohort-based calibration** for fair evaluation

### Approval Workflows

- **Two-stage approval**: Per-item + Portfolio level
- **Hierarchical approval** based on organizational structure
- **Bulk operations** for efficiency

### Data Validation

- **Mandatory fields** based on KPI type and ownership
- **Business rule validation** (weight totals, cascading logic)
- **Cross-reference validation** with external systems

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Review Checklist

- [ ] TypeScript types properly defined
- [ ] Database queries optimized
- [ ] Business rules correctly implemented
- [ ] Tests written and passing
- [ ] Documentation updated

## 🔄 Database Migration

### Automated Migration Script

The PMS service includes a comprehensive migration script that handles the complete database setup:

```bash
# Full migration (recommended)
npm run db:migrate

# Dry run (see what would be executed)
npm run db:migrate:dry

# Force recreate all tables (WARNING: drops data)
npm run db:migrate:force

# Show help
npm run db:migrate:help
```

### Migration Features

- ✅ **Environment validation** - Checks required DB credentials
- ✅ **Connection testing** - Verifies database connectivity
- ✅ **Dependency ordering** - Creates tables in correct sequence
- ✅ **Performance indexes** - Adds 50+ optimized indexes
- ✅ **Validation checks** - Verifies successful migration
- ✅ **Progress feedback** - Detailed console output
- ✅ **Error handling** - Comprehensive error reporting
- ✅ **Dry-run mode** - Safe testing without changes

### Manual Migration (Alternative)

```bash
# 1. Create tables in order
mysql -u username -p database_name < src/database/script/ddl/tables/01_kpi_v3.sql
mysql -u username -p database_name < src/database/script/ddl/tables/02_kpi_ownership_v3.sql
# ... continue with all 15 table files

# 2. Add performance indexes
mysql -u username -p database_name < src/database/script/ddl/indexes/01_performance_indexes.sql
```

### Environment Configuration

Required environment variables for migration:

```bash
DB_HOST=localhost          # MySQL host
DB_PORT=3306              # MySQL port
DB_USERNAME=pms_user       # Database username
DB_PASSWORD=password       # Database password
DB_DATABASE=pms_db         # Database name
```

## 📞 Support

- **Business Requirements**: Refer to `docs/prd/PEL-004-PMS-BRD.md`
- **Backend Guidelines**: 📋 `docs/prd/backend-guideline.md` (Living Document)
- **API Documentation**: Live at `/api` (Swagger/OpenAPI)
- **Database Schema**: `src/database/script/ddl/tables/README.md`
- **Migration Script**: `src/database/script/ddl/index.js`
- **Mock Data**: Available in `docs/prd/` for testing

## 📄 License

This project is proprietary software developed for PT Pelindo.

---

**Document Version**: 1.0.0
**Last Updated**: December 2025
**Author**: PMS Development Team
