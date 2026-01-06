import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

// Services
import { MyTeamPerformanceService } from '../services/my-team-performance.service';
import { ApprovalService } from '../services/approval.service';
import { CascadeService } from '../services/cascade.service';
import { AllocationService } from '../services/allocation.service';

// DTOs
import { TeamDashboardResponseDto } from '../dto/team-dashboard.response.dto';
import { MemberPerformanceDetailDto } from '../dto/member-detail.response.dto';
import {
  ApproveKpiItemDto,
  RejectKpiItemDto,
  RequestClarificationDto,
  ApproveFinalPortfolioDto,
  RejectFinalPortfolioDto,
  ApproveRealizationDto,
  RejectRealizationDto,
  AdjustAndApproveRealizationDto,
  BulkApproveRealizationsDto,
  ApprovalResponseDto,
  BulkApprovalResponseDto,
} from '../dto/approval.dto';
import {
  CascadeKpiDto,
  DraftKpiForSubordinateDto,
  DraftKaiForSubordinateDto,
  CascadedKpiReviewStatusDto,
  RespondToCascadeRevisionDto,
} from '../dto/cascade.dto';
import {
  AllocateKpiFromTreeDto,
  UnallocatedKpiListResponseDto,
  AssignOwnerDto,
  AssignSharedOwnerDto,
  SamePositionAllocationDto,
} from '../dto/allocation.dto';
import {
  TeamCalendarQueryDto,
  TeamCalendarResponseDto,
  ExportReportQueryDto,
  ExportReportResponseDto,
} from '../dto/team-calendar.dto';

// Guards (to be implemented)
// import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
// import { CurrentUser } from '../../../common/decorators/current-user.decorator';

interface UserContext {
  employeeNumber: string;
  name: string;
  positionId: string;
}

@ApiTags('My Team Performance')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('my-team-performance')
export class MyTeamPerformanceController {
  constructor(
    private readonly teamService: MyTeamPerformanceService,
    private readonly approvalService: ApprovalService,
    private readonly cascadeService: CascadeService,
    private readonly allocationService: AllocationService,
  ) {}

  // ==================== USE CASE 1: Team Monitoring & Dashboard ====================

  /**
   * US-MT-001: View Team Dashboard
   * Get team dashboard with summary and member list
   */
  @Get('dashboard')
  @ApiOperation({ summary: 'Get team dashboard' })
  @ApiResponse({ status: 200, type: TeamDashboardResponseDto })
  async getTeamDashboard(
    // @CurrentUser() user: UserContext,
    @Query('period') period?: string,
  ): Promise<TeamDashboardResponseDto> {
    // TODO: Get user from JWT token
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.teamService.getTeamDashboard(user, period);
  }

  /**
   * US-MT-002: View Member Performance Detail
   * Get detailed performance of a specific team member
   */
  @Get('members/:employeeNumber')
  @ApiOperation({ summary: 'Get member performance detail' })
  @ApiResponse({ status: 200, type: MemberPerformanceDetailDto })
  async getMemberDetail(
    // @CurrentUser() user: UserContext,
    @Param('employeeNumber') employeeNumber: string,
    @Query('period') period?: string,
  ): Promise<MemberPerformanceDetailDto> {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.teamService.getMemberDetail(user, employeeNumber, period);
  }

  /**
   * US-MT-018: View Team KPI Status Overview
   * Get KPI status overview for entire team
   */
  @Get('status-overview')
  @ApiOperation({ summary: 'Get team KPI status overview' })
  @ApiResponse({ status: 200 })
  async getTeamStatusOverview(
    // @CurrentUser() user: UserContext,
    @Query('period') period?: string,
  ) {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.teamService.getTeamStatusOverview(user, period);
  }

  // ==================== USE CASE 2: KPI Allocation from Performance Tree ====================

  /**
   * US-MT-022: View Unallocated KPI from Performance Tree
   * Get list of unallocated KPI items from Performance Tree
   */
  @Get('unallocated-kpis')
  @ApiOperation({ summary: 'Get unallocated KPI items from Performance Tree' })
  @ApiResponse({ status: 200, type: UnallocatedKpiListResponseDto })
  async getUnallocatedKpis(
    // @CurrentUser() user: UserContext,
    @Query('type') type?: string,
    @Query('positionId') positionId?: string,
  ): Promise<UnallocatedKpiListResponseDto> {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.allocationService.getUnallocatedKpis(user, { type, positionId });
  }

  /**
   * US-MT-023: Allocate KPI from Performance Tree to Team Members
   * Allocate a Performance Tree item to team members
   */
  @Post('allocate-kpi')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Allocate KPI from Performance Tree to team members' })
  @ApiResponse({ status: 201 })
  async allocateKpiFromTree(
    // @CurrentUser() user: UserContext,
    @Body() dto: AllocateKpiFromTreeDto,
  ) {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.allocationService.allocateKpiFromTree(user, dto);
  }

  /**
   * US-MT-014: Assign Owner untuk KPI
   * Assign an owner to a KPI
   */
  @Put('kpi/assign-owner')
  @ApiOperation({ summary: 'Assign owner to KPI' })
  @ApiResponse({ status: 200 })
  async assignOwner(
    // @CurrentUser() user: UserContext,
    @Body() dto: AssignOwnerDto,
  ) {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.allocationService.assignOwner(user, dto);
  }

  /**
   * US-MT-015: Assign Shared Owner untuk KPI
   * Assign shared owners to a KPI (vertical support)
   */
  @Put('kpi/assign-shared-owners')
  @ApiOperation({ summary: 'Assign shared owners to KPI' })
  @ApiResponse({ status: 200 })
  async assignSharedOwners(
    // @CurrentUser() user: UserContext,
    @Body() dto: AssignSharedOwnerDto,
  ) {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.allocationService.assignSharedOwners(user, dto);
  }

  /**
   * US-MT-016: Handle Same Position Allocation
   * Handle allocation for multiple incumbents in same position
   */
  @Post('allocate-same-position')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Handle same position allocation' })
  @ApiResponse({ status: 201 })
  async handleSamePositionAllocation(
    // @CurrentUser() user: UserContext,
    @Body() dto: SamePositionAllocationDto,
  ) {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.allocationService.handleSamePositionAllocation(user, dto);
  }

  // ==================== USE CASE 3: KPI Cascading ====================

  /**
   * US-MT-011: Draft KPI untuk Bawahan
   * Draft a KPI for subordinate
   */
  @Post('draft-kpi-for-subordinate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Draft KPI for subordinate' })
  @ApiResponse({ status: 201 })
  async draftKpiForSubordinate(
    // @CurrentUser() user: UserContext,
    @Body() dto: DraftKpiForSubordinateDto,
  ) {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.cascadeService.draftKpiForSubordinate(user, dto);
  }

  /**
   * US-MT-012 & US-MT-013: Cascade KPI to Subordinates
   * Cascade KPI to subordinates (Direct or Indirect)
   */
  @Post('cascade-kpi')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cascade KPI to subordinates' })
  @ApiResponse({ status: 201 })
  async cascadeKpi(
    // @CurrentUser() user: UserContext,
    @Body() dto: CascadeKpiDto,
  ) {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.cascadeService.cascadeKpi(user, dto);
  }

  /**
   * US-MT-024: Draft KAI untuk Bawahan
   * Draft KAI for subordinate linked to their KPI Output
   */
  @Post('draft-kai-for-subordinate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Draft KAI for subordinate' })
  @ApiResponse({ status: 201 })
  async draftKaiForSubordinate(
    // @CurrentUser() user: UserContext,
    @Body() dto: DraftKaiForSubordinateDto,
  ) {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.cascadeService.draftKaiForSubordinate(user, dto);
  }

  /**
   * US-MT-025: Monitor Cascaded KPI Review Status
   * Get status of cascaded KPIs
   */
  @Get('cascaded-kpis/review-status')
  @ApiOperation({ summary: 'Get cascaded KPI review status' })
  @ApiResponse({ status: 200, type: [CascadedKpiReviewStatusDto] })
  async getCascadedKpiReviewStatus(
    // @CurrentUser() user: UserContext,
  ): Promise<CascadedKpiReviewStatusDto[]> {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.cascadeService.getCascadedKpiReviewStatus(user);
  }

  /**
   * Respond to Cascade Revision Request
   * Handle subordinate's revision request for cascaded KPI
   */
  @Put('cascaded-kpis/respond-revision')
  @ApiOperation({ summary: 'Respond to cascade revision request' })
  @ApiResponse({ status: 200 })
  async respondToCascadeRevision(
    // @CurrentUser() user: UserContext,
    @Body() dto: RespondToCascadeRevisionDto,
  ) {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.cascadeService.respondToCascadeRevision(user, dto);
  }

  // ==================== USE CASE 4: KPI Planning Approval (Two-Stage) ====================

  /**
   * US-MT-003: Approve KPI Item (Per-Item)
   * Approve individual KPI item
   */
  @Put('approval/kpi-item/approve')
  @ApiOperation({ summary: 'Approve KPI item (per-item approval)' })
  @ApiResponse({ status: 200, type: ApprovalResponseDto })
  async approveKpiItem(
    // @CurrentUser() user: UserContext,
    @Body() dto: ApproveKpiItemDto,
  ): Promise<ApprovalResponseDto> {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.approvalService.approveKpiItem(user, dto);
  }

  /**
   * US-MT-004: Reject KPI Item dengan Catatan
   * Reject individual KPI item with notes
   */
  @Put('approval/kpi-item/reject')
  @ApiOperation({ summary: 'Reject KPI item with notes' })
  @ApiResponse({ status: 200, type: ApprovalResponseDto })
  async rejectKpiItem(
    // @CurrentUser() user: UserContext,
    @Body() dto: RejectKpiItemDto,
  ): Promise<ApprovalResponseDto> {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.approvalService.rejectKpiItem(user, dto);
  }

  /**
   * US-MT-005: Request Clarification KPI
   * Request clarification before approving/rejecting
   */
  @Put('approval/kpi-item/request-clarification')
  @ApiOperation({ summary: 'Request clarification for KPI' })
  @ApiResponse({ status: 200, type: ApprovalResponseDto })
  async requestClarification(
    // @CurrentUser() user: UserContext,
    @Body() dto: RequestClarificationDto,
  ): Promise<ApprovalResponseDto> {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.approvalService.requestClarification(user, dto);
  }

  /**
   * US-MT-006: Approve Final KPI Portfolio
   * Approve entire KPI portfolio (final approval)
   */
  @Put('approval/portfolio/approve')
  @ApiOperation({ summary: 'Approve final KPI portfolio' })
  @ApiResponse({ status: 200, type: ApprovalResponseDto })
  async approveFinalPortfolio(
    // @CurrentUser() user: UserContext,
    @Body() dto: ApproveFinalPortfolioDto,
  ): Promise<ApprovalResponseDto> {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.approvalService.approveFinalPortfolio(user, dto);
  }

  /**
   * US-MT-007: Reject Final KPI Portfolio
   * Reject entire KPI portfolio
   */
  @Put('approval/portfolio/reject')
  @ApiOperation({ summary: 'Reject final KPI portfolio' })
  @ApiResponse({ status: 200, type: ApprovalResponseDto })
  async rejectFinalPortfolio(
    // @CurrentUser() user: UserContext,
    @Body() dto: RejectFinalPortfolioDto,
  ): Promise<ApprovalResponseDto> {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.approvalService.rejectFinalPortfolio(user, dto);
  }

  // ==================== USE CASE 5: Realisasi Approval & Review ====================

  /**
   * US-MT-008: Approve Realisasi Bawahan
   * Approve subordinate's realization
   */
  @Put('approval/realization/approve')
  @ApiOperation({ summary: 'Approve realization' })
  @ApiResponse({ status: 200, type: ApprovalResponseDto })
  async approveRealization(
    // @CurrentUser() user: UserContext,
    @Body() dto: ApproveRealizationDto,
  ): Promise<ApprovalResponseDto> {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.approvalService.approveRealization(user, dto);
  }

  /**
   * US-MT-009: Reject Realisasi dengan Catatan
   * Reject realization with notes
   */
  @Put('approval/realization/reject')
  @ApiOperation({ summary: 'Reject realization with notes' })
  @ApiResponse({ status: 200, type: ApprovalResponseDto })
  async rejectRealization(
    // @CurrentUser() user: UserContext,
    @Body() dto: RejectRealizationDto,
  ): Promise<ApprovalResponseDto> {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.approvalService.rejectRealization(user, dto);
  }

  /**
   * US-MT-010: Adjust dan Approve Realisasi
   * Adjust value and approve realization
   */
  @Put('approval/realization/adjust-and-approve')
  @ApiOperation({ summary: 'Adjust and approve realization' })
  @ApiResponse({ status: 200, type: ApprovalResponseDto })
  async adjustAndApproveRealization(
    // @CurrentUser() user: UserContext,
    @Body() dto: AdjustAndApproveRealizationDto,
  ): Promise<ApprovalResponseDto> {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.approvalService.adjustAndApproveRealization(user, dto);
  }

  /**
   * US-MT-020: Bulk Approve Realisasi
   * Bulk approve multiple realizations
   */
  @Put('approval/realization/bulk-approve')
  @ApiOperation({ summary: 'Bulk approve realizations' })
  @ApiResponse({ status: 200, type: BulkApprovalResponseDto })
  async bulkApproveRealizations(
    // @CurrentUser() user: UserContext,
    @Body() dto: BulkApproveRealizationsDto,
  ): Promise<BulkApprovalResponseDto> {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.approvalService.bulkApproveRealizations(user, dto);
  }

  /**
   * Get Approval Queue
   * Get list of items pending approval
   */
  @Get('approval/queue')
  @ApiOperation({ summary: 'Get approval queue' })
  @ApiResponse({ status: 200 })
  async getApprovalQueue(
    // @CurrentUser() user: UserContext,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('memberEmployeeNumber') memberEmployeeNumber?: string,
  ) {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.approvalService.getApprovalQueue(user, { type, status, memberEmployeeNumber });
  }

  // ==================== USE CASE 7: Team Calendar & Reports ====================

  /**
   * US-MT-028: View Team Calendar & Deadline Tracking
   * Get team calendar with deadlines
   */
  @Get('calendar')
  @ApiOperation({ summary: 'Get team calendar' })
  @ApiResponse({ status: 200, type: TeamCalendarResponseDto })
  async getTeamCalendar(
    // @CurrentUser() user: UserContext,
    @Query() query: TeamCalendarQueryDto,
  ): Promise<TeamCalendarResponseDto> {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.teamService.getTeamCalendar(user, query);
  }

  /**
   * US-MT-021: Export Team Performance Report
   * Export team performance report
   */
  @Post('export-report')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Export team performance report' })
  @ApiResponse({ status: 200, type: ExportReportResponseDto })
  async exportTeamReport(
    // @CurrentUser() user: UserContext,
    @Body() query: ExportReportQueryDto,
  ): Promise<ExportReportResponseDto> {
    const user: UserContext = {
      employeeNumber: '00001',
      name: 'Manager User',
      positionId: 'POS-001',
    };

    return this.teamService.exportTeamReport(user, query);
  }
}

