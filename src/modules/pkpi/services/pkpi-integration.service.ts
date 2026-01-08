import { Injectable, Logger } from '@nestjs/common';

// Import entities
import {
  KpiEntity,
  KpiType,
  NatureOfWork,
  CascadingMethod,
  Polarity,
  MonitoringPeriod,
  KpiOwnershipType,
  Source,
  ItemApprovalStatus,
} from '../../../infrastructure/database/entities/kpi.entity';

import {
  KpiOwnershipEntity,
  OwnershipType,
  WeightApprovalStatus,
} from '../../../infrastructure/database/entities/kpi-ownership.entity';

// Import utilities
import { dateToTwFilter } from '../../../lib/dateToTwFilter';
import { MysqlService } from '../../../infrastructure/database/mysql.service';

// Import service
import { PkpiService } from './pkpi.service';
import { KpiRepository } from '../../core/kpi/repositories/kpi.repository';

export interface PKpiParams {
  periode: string;
  year: number;
  group_ids?: string[];
  regional_ids?: string[];
  subholding_ids?: string[];
}

export interface PKpiData {
  ID: string;
  KPI: string;
  POLARITAS: string;
  SATUAN?: string;
  FORMULA?: string;
  BOBOT: number;
  PERIODE_PENGUKURAN: string;
  TW1?: number;
  TW2?: number;
  TW3?: number;
  TW4?: number;
  PERSPEKTIF?: string;
  ACTION_FLAG?: string;
  REALISASI?: number;
  CAPAIAN_AKHIR?: number;
  SKOR_KPI?: number;
}

export interface PreparedKpiData {
  kpi: Partial<KpiEntity>;
  ownership: Partial<KpiOwnershipEntity>;
  score?: any;
}

@Injectable()
export class PkpiIntegrationService {
  private readonly logger = new Logger(PkpiIntegrationService.name);

  constructor(
    private readonly pkpiService: PkpiService,
    private readonly mysqlService: MysqlService,
    private readonly kpiRepository: KpiRepository,
  ) {}

  // Regional and Subholding mappings
  private readonly REGIONAL_MAP = {
    REG1: [
      "RH1",
      "OPRS",
      "AKPL",
      "PKPR",
      "TKNK",
      "KMRL",
      "PSDU",
      "TBK",
      "TPI",
      "TBH",
      "BTM",
      "BLW",
      "DUM",
      "GST",
      "KTG",
      "LSM",
      "MLH",
      "PBR",
      "SBG",
      "TBA",
    ],
    REG2: [
      "RH2",
      "PKPR",
      "PSDU",
      "OPRS",
      "KMRL",
      "AKPL",
      "TKNK",
      "SKA",
      "TGDN",
      "TPK",
      "TBS",
      "PTK",
      "BTN",
      "PJG",
      "PBM",
      "JBI",
      "CBN",
      "BKL",
      "PLG",
    ],
    REG3: [
      "RH3",
      "PSDU",
      "PKPR",
      "KMRL",
      "AKPL",
      "OPRS",
      "TKNK",
      "RBNT",
      "RKLM",
      "RJWA",
      "CLBW",
      "ENIP",
      "LBJO",
      "LMBR",
      "MMRE",
      "TKPG",
      "WNGP",
      "KLBH",
      "BIMA",
      "BDAS",
      "TGAL",
      "TJTG",
      "KLGT",
      "TJWI",
      "TJMS",
      "TJMS",
      "KLMS",
      "GRSK",
      "BNOA",
      "BGND",
      "BTLC",
      "BMHJ",
      "KTBR",
      "PLPS",
      "TSKT",
    ],
    REG4: [
      "RH4",
      "AKPL",
      "TKNK",
      "PKPR",
      "PSDU",
      "OPRS",
      "KMRL",
      "TLI",
      "KDI",
      "MKS",
      "MDO",
      "MNK",
      "MRK",
      "NNK",
      "PTL",
      "PRE",
      "SMD",
      "SRG",
      "TNR",
      "TRK",
      "TNT",
      "GTO",
      "FFK",
      "BOT",
      "BTG",
      "BIK",
      "BPP",
      "AMB",
      "JYP",
    ],
  };

  private readonly SUBHOLDING_MAP = {
    SPJM: [
      "PLJM",
      "KRIS",
      "DRUT",
      "SDMU",
      "STKM",
      "DOTK",
      "STMN",
      "SKRT",
      "DTMO",
      "MRSK",
      "OPKL",
      "PDPU",
      "KDMA",
      "SPIR",
      "TKLG",
      "PAPN",
      "KMHP",
      "PSPP",
      "LSDU",
      "DHUK",
      "PCPS",
      "PLGP",
      "PPAK",
      "SMW1",
      "SMW2",
      "SMWT",
      "SMWP",
      "BIMA",
      "EII",
      "RUKINDO",
      "LEGI",
      "APBS",
      "ISMA",
      "JPPI",
      "EPI",
      "JAI",
      "PMS",
    ],
    SPMT: [
      "PLMT",
      "DSDM",
      "DIRT",
      "DISK",
      "DIOP",
      "DIRU",
      "DKMR",
      "MNRS",
      "PKPJ",
      "TRMO",
      "SKTR",
      "SPIT",
      "AKUL",
      "KPAP",
      "KHPL",
      "PLOS",
      "SIME",
      "PPSD",
      "SDMU",
      "HUKM",
      "FSPB",
      "PALT",
      "PPOS",
      "PRSG",
      "TEKI",
      "BGRS",
      "BTJW",
      "BMKS",
      "BBLP",
      "BTPI",
      "BSBG",
      "BTBK",
      "BLMB",
      "BBNO",
      "BMLH",
      "BLHW",
      "BTRI",
      "BDMI",
      "BBLW",
      "BTJI",
      "BJMR",
      "BPRE",
      "BBHG",
      "BTJE",
      "TCU",
      "PPEL",
      "PTP",
      "IKT",
    ],
    SPSL: [
      "PLSL",
      "DSPB",
      "DKMT",
      "DIUT",
      "DKES",
      "HKMP",
      "KEUN",
      "SDMU",
      "TEKN",
      "PRKU",
      "PAPN",
      "SKTN",
      "PRSP",
      "SPIL",
      "MMI",
      "API",
      "PIL",
      "PPK",
      "MTI",
    ],
    SPTP: [
      "PLTP",
      "SDMN",
      "DOPS",
      "DUTM",
      "KEUG",
      "DTEK",
      "DRSK",
      "PRPO",
      "PGKP",
      "SEKT",
      "SPIN",
      "PRGS",
      "MRIK",
      "TKNI",
      "KMHL",
      "KUPP",
      "PRSR",
      "HKUM",
      "LSMM",
      "PLSI",
      "MHSE",
      "FSPN",
      "PALT",
      "AKAP",
      "PPTR",
      "TPMR",
      "TPSR",
      "TPKD",
      "TPSM",
      "TPBJ",
      "TPAM",
      "TPTK",
      "TPJY",
      "TPBT",
      "TPTE",
      "TPMK",
      "TPKN",
      "TPBB",
      "TPPW",
      "TPTR",
      "TPPT",
      "TPTL",
      "TPS",
      "ITPK",
      "PMT",
      "BJTI",
      "KKT",
      "PTP",
    ],
  };

  /**
   * Main function to prepare PKPI data for synchronization
   * This function fetches data from external source and prepares it for kpi_v3 structure
   */
  async preparePkpiData({
    periode,
    year,
    group_ids = [],
    regional_ids = [],
    subholding_ids = [],
  }: PKpiParams): Promise<{
    preparedKpis: PreparedKpiData[];
    groupCodeToGroupId: Record<string, number>;
    impactedGroupIds: number[];
    result: {
      successCount: number;
      failedCount: number;
      createdKpis: KpiEntity[];
      errors: Array<{ index: number; error: string }>;
    };
  }> {
    this.logger.log(`Starting PKPI data preparation for period ${periode}, year ${year}`);

    const positionVariants = await this.getPositionVariants(periode, year);

    let groupsPositionVariants = positionVariants.filter((pv) => {
      const prefix = pv.p_kpi_group_code.split("-")[1];
      return !prefix || !["REG1", "REG2", "REG3", "REG4"].includes(pv.p_kpi_group_code.split("-")[0]);
    });

    let regionalPositionVariants = positionVariants.filter((pv) => {
      const prefix = pv.p_kpi_group_code.split("-")[1];
      return prefix && ["REG1", "REG2", "REG3", "REG4"].includes(pv.p_kpi_group_code.split("-")[0]);
    });

    let subholdingPositionVariants = positionVariants.filter((pv) => {
      const prefix = pv.p_kpi_group_code.split("-")[1];
      return prefix && !["REG1", "REG2", "REG3", "REG4"].includes(pv.p_kpi_group_code.split("-")[0]);
    });

    // Filter by provided IDs
    groupsPositionVariants = groupsPositionVariants.filter((e) =>
      group_ids.includes(e.p_kpi_group_code)
    );
    regionalPositionVariants = regionalPositionVariants.filter((e) =>
      regional_ids.includes(e.p_kpi_group_code)
    );
    subholdingPositionVariants = subholdingPositionVariants.filter((e) =>
      subholding_ids.includes(e.p_kpi_group_code)
    );

    // Ensure unique entries
    groupsPositionVariants = this.uniqueBy(groupsPositionVariants, 'p_kpi_group_code');
    regionalPositionVariants = this.uniqueBy(regionalPositionVariants, 'p_kpi_group_code');
    subholdingPositionVariants = this.uniqueBy(subholdingPositionVariants, 'p_kpi_group_code');

    const groupIds = groupsPositionVariants.map((e) => e.p_kpi_group_code);
    const regionalIds = regionalPositionVariants.map((e) => e.p_kpi_group_code);
    const subholdingIds = subholdingPositionVariants.map((e) => e.p_kpi_group_code);

    // Create mapping of group code to group id
    const groupCodeToGroupId = [
      ...groupsPositionVariants,
      ...regionalPositionVariants,
      ...subholdingPositionVariants,
    ].reduce((acc, curr) => {
      acc[curr.p_kpi_group_code] = curr.group_master_id;
      return acc;
    }, {} as Record<string, number>);

    const impactedGroupIds = Object.values(groupCodeToGroupId) as number[];

    // Fetch PKPI data from external service
    const resultPKPI = await this.fetchPkpiData(
      periode,
      year,
      groupIds,
      regionalIds,
      subholdingIds
    );

    // Prepare KPI data structures
    const preparedKpis: PreparedKpiData[] = [];

    for (const position of [...groupsPositionVariants, ...regionalPositionVariants, ...subholdingPositionVariants]) {
      const pKpisRaw = resultPKPI?.[position.p_kpi_group_code];
      if (!pKpisRaw) continue;

      const kpi_for_group_id = groupCodeToGroupId[position.p_kpi_group_code];

      for (const pKpi of pKpisRaw) {
        const preparedKpi = this.constructKpiDataForV3(
          pKpi,
          position.position_master_variant_id,
          year,
          periode,
          kpi_for_group_id,
          position.employee_number
        );
        preparedKpis.push(preparedKpi);
      }
    }

    // * Write prepared KPI data to database
    const result = await this.writePreparedKpisToDatabase(preparedKpis);
    this.logger.log(`Prepared ${preparedKpis.length} KPIs for synchronization`);
    return { preparedKpis, groupCodeToGroupId, impactedGroupIds, result };
  }

  /**
   * Write prepared KPI data to database
   * This function saves KPI and KPI ownership records to the database
   */
  async writePreparedKpisToDatabase(
    preparedKpis: PreparedKpiData[]
  ): Promise<{
    successCount: number;
    failedCount: number;
    createdKpis: KpiEntity[];
    errors: Array<{ index: number; error: string }>;
  }> {
    this.logger.log(`Starting to write ${preparedKpis.length} KPIs to database`);

    let successCount = 0;
    let failedCount = 0;
    const createdKpis: KpiEntity[] = [];
    const errors: Array<{ index: number; error: string }> = [];

    for (let i = 0; i < preparedKpis.length; i++) {
      const preparedKpi = preparedKpis[i];
      
      try {
        // Create KPI entity
        const createdKpi = await this.kpiRepository.create(preparedKpi.kpi);
        
        // Create ownership entity with the created KPI ID
        const ownershipData = {
          ...preparedKpi.ownership,
          kpiId: createdKpi.kpiId,
        };
        
        await this.kpiRepository.createOwnership(ownershipData);
        
        createdKpis.push(createdKpi);
        successCount++;
        
        this.logger.log(
          `Successfully created KPI ${createdKpi.kpiId} with ownership for employee ${preparedKpi.ownership.employeeNumber}`
        );
      } catch (error) {
        failedCount++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({ index: i, error: errorMessage });
        
        this.logger.error(
          `Failed to create KPI at index ${i}: ${errorMessage}`,
          error instanceof Error ? error.stack : undefined
        );
      }
    }

    this.logger.log(
      `Completed writing KPIs to database. Success: ${successCount}, Failed: ${failedCount}`
    );

    return {
      successCount,
      failedCount,
      createdKpis,
      errors,
    };
  }

  /**
   * Fetch PKPI data from external service
   */
  private async fetchPkpiData(
    periode: string,
    year: number,
    groupIds: string[],
    regionalIds: string[],
    subholdingIds: string[]
  ): Promise<Record<string, PKpiData[]>> {
    this.logger.log('Fetching PKPI data from external service');

    let resultPKPIGroup = {};
    if (groupIds.length > 0) {
      this.logger.log('=== Fetching getKPIByGroup');
      try {
        const response = await this.pkpiService.getKPIByGroup(groupIds, year, parseInt(periode) || 1);
        resultPKPIGroup = response.data?.data || {};
      } catch (error) {
        this.logger.error('Error fetching group KPIs:', error);
      }
    }

    // Fetch for regional
    let resultPKPIRegional = {};
    const allRegional = Object.keys(this.REGIONAL_MAP);
    for (let index = 0; index < allRegional.length; index++) {
      const parentCode = allRegional[index];
      let filtered: string[] = [];

      if (regionalIds.length > 0) {
        filtered = regionalIds
          .filter((e) => e.startsWith(parentCode + "-"))
          .map((e) => e.split("-")[1]);
      }

      if (filtered.length === 0) continue;

      this.logger.log(`=== Fetching getKPIByRegional for ${parentCode}`);
      try {
        const response = await this.pkpiService.getKPIByRegional(
          filtered,
          parentCode,
          year,
          parseInt(periode) || 1
        );

        const formattedResult = {};
        const temp = response.data?.data || {};
        if (temp) {
          for (const key in temp) {
            formattedResult[`${parentCode}-${key}`] = temp[key];
          }
        }
        resultPKPIRegional = { ...resultPKPIRegional, ...formattedResult };
      } catch (error) {
        this.logger.error(`Error fetching regional KPIs for ${parentCode}:`, error);
      }
    }

    // Fetch for subholding
    let resultPKPISubholding = {};
    const allSubholding = Object.keys(this.SUBHOLDING_MAP);
    for (let index = 0; index < allSubholding.length; index++) {
      const parentCode = allSubholding[index];
      let filtered: string[] = [];

      if (subholdingIds.length > 0) {
        filtered = subholdingIds
          .filter((e) => e.startsWith(parentCode + "-"))
          .map((e) => e.split("-")[1]);
      }

      if (filtered.length === 0) continue;

      this.logger.log(`=== Fetching getKPIBySubholding for ${parentCode}`);
      try {
        const response = await this.pkpiService.getKPIBySubholding(
          filtered,
          parentCode,
          year,
          parseInt(periode) || 1
        );

        const formattedResult = {};
        const temp = response.data?.data || {};
        if (temp) {
          for (const key in temp) {
            formattedResult[`${parentCode}-${key}`] = temp[key];
          }
        }
        resultPKPISubholding = { ...resultPKPISubholding, ...formattedResult };
      } catch (error) {
        this.logger.error(`Error fetching subholding KPIs for ${parentCode}:`, error);
      }
    }

    return {
      ...resultPKPIGroup,
      ...resultPKPIRegional,
      ...resultPKPISubholding,
    };
  }

  /**
   * Construct KPI data structure for kpi_v3 table
   */
  private constructKpiDataForV3(
    pKPI: PKpiData,
    positionMasterVariantId: number,
    year: number,
    periode: string,
    kpiForGroupId: number,
    employeeNumber: string
  ): PreparedKpiData {
    const kpiData: Partial<KpiEntity> = {
      // Basic fields
      type: this.mapKpiType(pKPI),
      title: pKPI.KPI,
      description: pKPI.KPI,

      // Target and measurement
      target: this.calculateTargetValue(pKPI),
      targetUnit: pKPI.SATUAN || 'Number',
      formula: pKPI.FORMULA,

      // Perspective and polarity
      perspective: pKPI.PERSPEKTIF,
      polarity: this.parsePolarity(pKPI.POLARITAS),

      // Monitoring and ownership
      monitoringPeriod: this.parseMonitoringPeriod(pKPI.PERIODE_PENGUKURAN),
      kpiOwnershipType: KpiOwnershipType.SPECIFIC,

      // Group and source
      kpiForGroupId: kpiForGroupId,
      source: Source.PKPI,

      // Status
      itemApprovalStatus: ItemApprovalStatus.APPROVED, // PKPI data is already approved

      // Metadata
      createdByEmployeeNumber: 'SYSTEM',
      createdByText: 'PKPI Integration Service',
      isActive: true,
      version: 1,
    };

    const ownershipData: Partial<KpiOwnershipEntity> = {
      employeeNumber: employeeNumber,
      positionMasterVariantId: positionMasterVariantId,
      ownershipType: OwnershipType.OWNER,
      weight: pKPI.BOBOT,
      weightApprovalStatus: WeightApprovalStatus.DRAFT,
      year: year,
      version: 1,
    };

    // Score data structure (for future use)
    const scoreData = {
      year,
      periode,
      realisasi: pKPI.REALISASI,
      capaian: pKPI.CAPAIAN_AKHIR,
      skorKpi: pKPI.SKOR_KPI,
      status: 'ACCEPTED',
      filledBy: 'PKPI',
    };

    return {
      kpi: kpiData,
      ownership: ownershipData,
      score: scoreData,
    };
  }

  /**
   * Map PKPI data to KPI type enum
   */
  private mapKpiType(pKPI: PKpiData): KpiType {
    // TODO: Implement proper mapping logic based on business rules
    // * For now, impact when targetUnit = Rupiah
    if (pKPI.SATUAN && pKPI.SATUAN.includes('Rupiah')) {
      return KpiType.IMPACT;
    }
  
    // For now, default to OUTPUT
    return KpiType.OUTPUT;
  }

  /**
   * Calculate target value from TW fields
   */
  private calculateTargetValue(pKPI: PKpiData): number {
    // Use the latest TW value as target, or sum, depending on business logic
    // For now, return TW4 or 0
    return pKPI.TW4 || pKPI.TW3 || pKPI.TW2 || pKPI.TW1 || 0;
  }

  /**
   * Parse polarity from PKPI data
   */
  private parsePolarity(polaritas: string): Polarity {
    switch (polaritas) {
      case 'Maximize':
        return Polarity.POSITIVE;
      case 'Minimize':
        return Polarity.NEGATIVE;
      default:
        return Polarity.NEUTRAL;
    }
  }

  /**
   * Parse monitoring period
   */
  private parseMonitoringPeriod(periodePengukuran: string): MonitoringPeriod {
    switch (periodePengukuran) {
      case 'Daily':
        return MonitoringPeriod.DAILY;
      case 'Weekly':
        return MonitoringPeriod.WEEKLY;
      case 'Monthly':
        return MonitoringPeriod.MONTHLY;
      case 'Quarterly':
        return MonitoringPeriod.QUARTERLY;
      case 'Semester':
      case 'Semesteran':
        return MonitoringPeriod.QUARTERLY; // Map to quarterly as closest match
      case 'Triwulanan':
        return MonitoringPeriod.QUARTERLY;
      default:
        return MonitoringPeriod.MONTHLY;
    }
  }

  /**
   * Get position variants (placeholder - needs actual implementation)
   */
  private async getPositionVariants(periode: string, year: number): Promise<any[]> {
    // SQL query to get position master variant IDs for the selected group code, period, and year
    // This query joins multiple tables to retrieve the necessary information
    const query = `
    -- get positionMasterVariantId running on selected groupCode periode and year
    SELECT
        tgm.p_kpi_group_code,
        tgm.group_master_id,
        tpmv.position_master_variant_id,
        tepms.employee_number
    FROM tb_position_master_variant tpmv
    LEFT JOIN tb_employee_position_master_sync tepms ON tepms.position_master_variant_id = tpmv.position_master_variant_id AND tepms.deletedAt IS NULL
    AND ${dateToTwFilter.query({
        tbAlias: "tepms",
    })}
    LEFT JOIN tb_position_master_v2 tpm ON tpm.position_master_id = tpmv.position_master_id AND tpm.deletedAt IS NULL
    AND ${dateToTwFilter.query({
        tbAlias: "tpm",
    })}
    LEFT JOIN tb_position_master_organization_sync tpmos ON tpmos.position_master_id = tpm.position_master_id AND tpmos.deletedAt IS NULL
    AND ${dateToTwFilter.query({
        tbAlias: "tpmos",
    })}
    LEFT JOIN tb_group_master tgm ON tgm.group_master_id = tpmos.organization_master_id AND tgm.deletedAt IS NULL
    AND ${dateToTwFilter.query({
        tbAlias: "tgm",
    })}
    WHERE tpmv.deletedAt IS NULL
    AND tpm.position_master_type_id = 5
    AND tgm.group_master_id IS NOT NULL
    AND tgm.p_kpi_group_code IS NOT NULL
    `;

    const positionVariants = await this.mysqlService.query<any>(query, {periode, year});
    return positionVariants;
  }

  

  /**
   * Utility function to get unique items by key
   */
  private uniqueBy<T>(array: T[], key: keyof T): T[] {
    return [...new Map(array.map(item => [item[key], item])).values()];
  }
}
