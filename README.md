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
- **Documentation**: OpenAPI/Swagger

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
│   │   └── pipes/            # Validation pipes
│   ├── config/               # Configuration modules
│   ├── database/             # Database related
│   │   ├── entities/         # TypeORM entities
│   │   ├── migrations/       # Database migrations
│   │   └── script/
│   │       └── ddl/
│   │           └── tables/   # SQL table definitions
│   ├── modules/              # Feature modules
│   │   ├── auth/            # Authentication module
│   │   ├── calendar/        # Performance calendar
│   │   ├── dictionary/      # KPI dictionary module
│   │   ├── kpi/             # KPI management
│   │   ├── my-performance/  # Individual performance
│   │   ├── performance-tree/ # KPI hierarchy
│   │   └── team/            # Team management
│   ├── app.controller.ts    # Main application controller
│   ├── app.module.ts        # Root application module
│   ├── app.service.ts       # Main application service
│   └── main.ts              # Application entry point
├── docs/
│   └── prd/                 # Product Requirements Documents
├── test/                    # Test files
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
   cp .env.example .env
   # Edit .env with your database and external system configurations
   ```

4. **Set up database**

   ```bash
   # Run database migrations in order
   mysql -u username -p database_name < src/database/script/ddl/tables/01_kpi_v3.sql
   mysql -u username -p database_name < src/database/script/ddl/tables/02_kpi_ownership_v3.sql
   # ... continue with remaining tables
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

# Testing
npm run test              # Run unit tests
npm run test:e2e          # Run end-to-end tests
npm run test:cov          # Run tests with coverage

# Code Quality
npm run lint              # Run ESLint
npm run format            # Format code with Prettier
```

## 📚 API Documentation

### Authentication

- JWT-based authentication
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

## 📞 Support

- **Business Requirements**: Refer to `docs/prd/PEL-004-PMS-BRD.md`
- **API Documentation**: Generated via Swagger/OpenAPI
- **Database Schema**: `src/database/script/ddl/tables/`
- **Mock Data**: Available in `docs/prd/` for testing

## 📄 License

This project is proprietary software developed for PT Pelindo.

---

**Document Version**: 1.0.0
**Last Updated**: December 2025
**Author**: PMS Development Team
