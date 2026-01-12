import { startDateEndDateFilter } from '../../../../lib/startDateEndDateFilter';
// import * as fs from 'fs';

interface SuperiorPositionQueryParams {
  queryFilter?: string;
  additionalData?: string[];
  additionalJoin?: string[];
}

export class SuperiorEmployeePositionMasterRepository {
  static query({ queryFilter, additionalData, additionalJoin }: SuperiorPositionQueryParams): string {
    const query = `
        SELECT
        te_original.employee_number as original_employee_number,
        te_original.firstname as original_employee_name,
        te_original.employee_id as original_employee_id,
        CASE
          WHEN tpm.position_master_id = tpmv_gh.position_master_id THEN tpmv_parent.position_master_id
          ELSE tpmv_gh.position_master_id
        END AS superior_position_master_id,
        CASE
          WHEN tpm.position_master_id = tpmv_gh.position_master_id THEN tpmv_parent.position_master_variant_id
          ELSE tpmv_gh.position_master_variant_id
        END AS superior_position_master_variant_id,
        CASE
          WHEN tpm.position_master_id = tpmv_gh.position_master_id THEN te_parent.employee_number
          ELSE tepms.employee_number
        END AS superior_employee_number,
        CASE
          WHEN tpm.position_master_id = tpmv_gh.position_master_id THEN te_parent.firstname
          ELSE te.firstname
        END AS superior_employee_name,
        CASE
          WHEN tpm.position_master_id = tpmv_gh.position_master_id THEN tpm_parent.name
          ELSE tpm_gh.name
        END AS superior_position_name
        -- (end) case when position_master_id are group head
      ${additionalData?.length ? `, ${additionalData.join(", ")}` : ""}
    FROM tb_employee te_original
    LEFT JOIN tb_employee_position_master_sync tepms_original ON tepms_original.employee_number = te_original.employee_number AND tepms_original.deletedAt IS NULL
      AND NOW() BETWEEN tepms_original.start_date AND tepms_original.end_date
    LEFT JOIN tb_position_master_variant tpmv_original ON tpmv_original.position_master_variant_id = tepms_original.position_master_variant_id
    LEFT JOIN tb_position_master_v2 tpm ON tpm.position_master_id = tpmv_original.position_master_id
    
    
    -- (start) case normal case
    LEFT JOIN tb_position_master_organization_sync tpmos ON tpmos.position_master_id = tpm.position_master_id
    LEFT JOIN tb_group_master tgm ON tgm.group_master_id  = tpmos.organization_master_id
    LEFT JOIN tb_employee_position_master_sync tepms ON tepms.employee_position_master_sync_id = tgm.chief_employee_position_id AND tepms.deletedAt IS NULL
    LEFT JOIN tb_employee te ON te.employee_number = tepms.employee_number

    -- (start) case when position_master_id are group head
    LEFT JOIN tb_position_master_variant tpmv_gh ON tpmv_gh.position_master_variant_id = tepms.position_master_variant_id
    LEFT JOIN tb_group_master tgm_parent ON tgm_parent.group_master_id = tgm.parent_id
    LEFT JOIN tb_employee_position_master_sync tepms_parent ON tepms_parent.employee_position_master_sync_id = tgm_parent.chief_employee_position_id AND tepms_parent.deletedAt IS NULL
    LEFT JOIN tb_position_master_variant tpmv_parent ON tpmv_parent.position_master_variant_id = tepms_parent.position_master_variant_id
    LEFT JOIN tb_employee te_parent ON te_parent.employee_number = tepms_parent.employee_number
    LEFT JOIN tb_position_master_v2 tpm_gh ON tpmv_gh.position_master_id = tpm_gh.position_master_id 
    LEFT JOIN tb_position_master_v2 tpm_parent ON tpmv_parent.position_master_id = tpm_parent.position_master_id 
    -- (end) case when position_master_id are group head
    ${additionalJoin?.length ? ` ${additionalJoin.join("\n")}` : ""}
    WHERE 1 = 1
    AND tepms.employee_number IS NOT NULL
    AND ${startDateEndDateFilter.query({
      tbAlias: "tpmos",
      begdaField: "start_date",
      endaField: "end_date",
    })}
    AND ${startDateEndDateFilter.query({
      tbAlias: "tgm",
      begdaField: "start_date",
      endaField: "end_date",
    })}
    AND ${startDateEndDateFilter.query({
      tbAlias: "tepms",
      begdaField: "start_date",
      endaField: "end_date",
    })}
    ${queryFilter || ""}
          `;

    // fs.writeFileSync('query.sql', query);

    return query;
  }
}
