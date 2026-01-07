import { startDateEndDateFilter } from '../../../../lib/startDateEndDateFilter';

interface SubordinatePositionQueryParams {
  queryFilter?: string;
  search?: string | null;
  additionalData?: string[];
}

export class SubordinateEmployeePositionMasterRepository {
  static query({ queryFilter, search, additionalData }: SubordinatePositionQueryParams): string {
    const query = `
    SELECT
      CASE
        WHEN tpmv2.position_master_variant_id = tpmv.position_master_variant_id THEN tpm_gh.position_master_id
        ELSE tpm.position_master_id
      END AS position_master_id,
      CASE
        WHEN tpmv2.position_master_variant_id = tpmv.position_master_variant_id THEN tpmv_gh.position_master_variant_id
        ELSE tpmv2.position_master_variant_id
      END AS position_master_variant_id,
      CASE
        WHEN tpmv2.position_master_variant_id = tpmv.position_master_variant_id THEN te_gh.employee_number
        ELSE tepms2.employee_number
      END AS employee_number,
      COALESCE(te.firstname, te_gh.firstname) as name
      ${additionalData?.length ? `, ${additionalData.join(", ")}` : ""}
    FROM tb_position_master_v2 tpm
    LEFT JOIN tb_position_master_variant tpmv ON tpmv.position_master_id = tpm.position_master_id
    LEFT JOIN tb_employee_position_master_sync tepms ON tepms.position_master_variant_id = tpmv.position_master_variant_id AND tepms.deletedAt IS NULL
    LEFT JOIN tb_group_master tgm ON tgm.chief_employee_position_id = tepms.employee_position_master_sync_id
    LEFT JOIN tb_position_master_organization_sync tpmos ON tpmos.organization_master_id = tgm.group_master_id
    -- for subordinate position master
    LEFT JOIN tb_position_master_v2 tpm2 ON tpm2.position_master_id = tpmos.position_master_id
    LEFT JOIN tb_position_master_variant tpmv2 ON tpmv2.position_master_id = tpm2.position_master_id
    LEFT JOIN tb_employee_position_master_sync tepms2 ON tepms2.position_master_variant_id = tpmv2.position_master_variant_id AND tepms2.deletedAt IS NULL
    LEFT JOIN tb_employee te ON te.employee_number = tepms2.employee_number
    -- case for group head
    LEFT JOIN tb_group_master tgm_gh ON tgm_gh.parent_id = tgm.group_master_id AND tpmv2.position_master_variant_id = tpmv.position_master_variant_id
    LEFT JOIN tb_employee_position_master_sync tepms_gh ON tepms_gh.employee_position_master_sync_id = tgm_gh.chief_employee_position_id AND tepms_gh.deletedAt IS NULL
    LEFT JOIN tb_position_master_variant tpmv_gh ON tpmv_gh.position_master_variant_id = tepms_gh.position_master_variant_id
    LEFT JOIN tb_position_master_v2 tpm_gh ON tpm_gh.position_master_id = tpmv_gh.position_master_id
    LEFT JOIN tb_employee te_gh ON te_gh.employee_number = tepms_gh.employee_number
    WHERE 1 = 1
    ${queryFilter || ""}
    AND ${startDateEndDateFilter.query({
      tbAlias: "tepms",
      begdaField: "start_date",
      endaField: "end_date",
    })}
    AND ${startDateEndDateFilter.query({
      tbAlias: "tgm",
      begdaField: "start_date",
      endaField: "end_date",
    })}
    AND ${startDateEndDateFilter.query({
      tbAlias: "tpmos",
      begdaField: "start_date",
      endaField: "end_date",
    })}
    AND ${startDateEndDateFilter.query({
      tbAlias: "tepms2",
      begdaField: "start_date",
      endaField: "end_date",
    })}
    -- case for group head
    AND (
      tpmv2.position_master_variant_id <> tpmv.position_master_variant_id
      OR
        (
        ${startDateEndDateFilter.query({
          tbAlias: "tgm_gh",
          begdaField: "start_date",
          endaField: "end_date",
        })}
        AND ${startDateEndDateFilter.query({
          tbAlias: "tepms_gh",
          begdaField: "start_date",
          endaField: "end_date",
        })}
      )
    )
    ${search ? `AND te.firstname LIKE :search` : ""}
    HAVING 1 = 1
    AND employee_number IS NOT NULL
          `;

    return query;
  }
}
