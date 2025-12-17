# Mock Data: Performance HQ Configuration

## Weight Configuration 2026

### Bobot Jenis KPI per Kohort

| Cohort | KPI Impact | KPI Output | KAI | Total | Effective Period |
| --- | --- | --- | --- | --- | --- |
| BOD | 60% | 30% | 10% | 100% | 2026-01-01 to 2026-12-31 |
| BOD-1 (Group Head) | 40% | 40% | 20% | 100% | 2026-01-01 to 2026-12-31 |
| BOD-2 (Dept Head) | 30% | 40% | 30% | 100% | 2026-01-01 to 2026-12-31 |
| BOD-3 (Manager/Supervisor) | 20% | 40% | 40% | 100% | 2026-01-01 to 2026-12-31 |
| BOD-4 (Officer/Staff) | 10% | 30% | 60% | 100% | 2026-01-01 to 2026-12-31 |

### Konfigurasi Masa Transisi Q4 2025

| Cohort | KPI Impact | KPI Output | KAI | Total | Effective Period |
| --- | --- | --- | --- | --- | --- |
| All Cohorts | 40% | 60% | 0% | 100% | 2025-10-01 to 2025-12-31 |

---

## Common KAI Master Data

### Active Common KAI

| ID | Title | Target | Unit | Polarity | Fixed Weight | Status |
| --- | --- | --- | --- | --- | --- | --- |
| COM-001 | Workplace Safety Compliance | 100 | % | Maximize | 10% 🔒 | Active |
| COM-002 | Attendance Rate | ≥ 95 | % | Maximize | 5% 🔒 | Active |
| COM-003 | Corporate Training Completion | 100 | % | Maximize | 5% 🔒 | Active |
| COM-004 | Code of Conduct Compliance | 100 | % | Maximize | - | Active |

### Common KAI Weight per Cohort

| Common KAI | BOD | BOD-1 | BOD-2 | BOD-3 | BOD-4 |
| --- | --- | --- | --- | --- | --- |
| Safety Compliance | 5% | 8% | 10% | 12% | 15% |
| Attendance Rate | 2% | 4% | 5% | 8% | 10% |
| Training Completion | 2% | 4% | 5% | 8% | 10% |
| Code of Conduct | 1% | 4% | 10% | 12% | 25% |
| **Total Common KAI** | **10%** | **20%** | **30%** | **40%** | **60%** |

### Common KAI Assignment Log

| Date | Action | Common KAI | Affected | By |
| --- | --- | --- | --- | --- |
| 2026-01-01 | Auto-Assign | All Active | 2,450 employees | System |
| 2026-01-15 | New Hire Assign | All Active | 5 new employees | System |
| 2026-02-01 | Deactivate | COM-OLD-001 | 2,455 employees | HR Admin |

---

## Period Configuration

### Performance Periods 2026

| Period Type | Start Date | End Date | Status |
| --- | --- | --- | --- |
| Planning Period | 2026-01-01 | 2026-01-31 | Closed |
| Q1 Monitoring | 2026-01-01 | 2026-03-31 | Active |
| Q2 Monitoring | 2026-04-01 | 2026-06-30 | Scheduled |
| Q3 Monitoring | 2026-07-01 | 2026-09-30 | Scheduled |
| Q4 Monitoring | 2026-10-01 | 2026-12-31 | Scheduled |
| Finalization | 2027-01-01 | 2027-01-15 | Scheduled |

### Period Extension History

| Original End | Extended To | Reason | Approved By | Date |
| --- | --- | --- | --- | --- |
| 2026-01-15 | 2026-01-31 | System migration delay | CHRO | 2026-01-10 |

---

## System Settings

### Current Configuration

| Setting | Value | Last Modified |
| --- | --- | --- |
| Auto-approve timeout (days) | 5 | 2025-12-01 |
| Realization deadline (day of month) | 5 | 2025-12-01 |
| Review deadline (day of month) | 10 | 2025-12-01 |
| Cut-off date (day of month) | 25 | 2025-12-01 |
| Min evidence file size (KB) | 10 | 2025-12-01 |
| Max evidence file size (MB) | 10 | 2025-12-01 |
| Allowed evidence types | PDF, JPG, PNG, XLSX | 2025-12-01 |
| Score decimal places | 2 | 2025-12-01 |
| Enable notifications | true | 2025-12-01 |
| Enable auto-approve | true | 2025-12-01 |

---

## Admin Override Log

### Recent Overrides

| Date | Admin | Action | Target | Justification |
| --- | --- | --- | --- | --- |
| 2026-01-25 | Rina Kusuma | Add KPI | Budi Prasetyo | "Penambahan KAI terkait project khusus Q1" |
| 2026-01-20 | Ahmad Fauzi | Edit Target | OUT-OPS-015 | "Penyesuaian target sesuai capacity baru" |
| 2026-01-18 | Budi Santoso | Change Owner | OUT-CS-003 | "Mutasi Dewi ke dept lain, transfer ke Siti" |
| 2026-01-15 | HR Admin | Adjust Realization | KAI-COM-002 | "Koreksi data attendance system error" |

### Override Detail Sample

```
Override ID: OVR-2026-0125
Date: 2026-01-25
Admin: Rina Kusuma (Performance Admin)
Action: Add KPI to Position

Target:
- Employee: Budi Prasetyo (12345681)
- Position: CS Officer

KPI Added:
- Title: Project X Customer Onboarding
- Type: KAI
- Target: 50 customers
- Bobot: 10%

Justification:
"Penambahan KAI terkait project khusus Customer 
Onboarding di Q1 2026. Project ini merupakan 
inisiatif strategis yang tidak tercakup dalam 
KPI standar posisi CS Officer."

Reference: project_x_charter.pdf
Effective Date: 2026-01-25
```

---

## Audit Log Sample

### Recent Admin Activities

| Timestamp | User | Event | Details |
| --- | --- | --- | --- |
| 2026-01-28 10:15 | HR Admin HO | Weight Change | BOD-4: KAI 55%→60% |
| 2026-01-28 09:30 | Rina Kusuma | Override | Add KPI to Budi |
| 2026-01-27 16:45 | Ahmad Fauzi | Setting Change | Auto-approve: 3→5 days |
| 2026-01-27 14:20 | HR Admin HO | Common KAI | Created COM-004 |
| 2026-01-26 11:00 | System | Period Change | Planning closed |

### Audit Log Filter Options

| Filter | Options |
| --- | --- |
| Date Range | Custom, Today, Last 7 days, Last 30 days |
| Event Type | All, Weight Change, Override, Setting, Period |
| User | All admins, Specific user |
| Scope | All, Own actions only |

---

## Access Control Status

### Current Admin Users

| User | Role | Scope | Last Active |
| --- | --- | --- | --- |
| Budi Santoso | Performance Admin HO | All | 2026-01-28 |
| Ahmad Fauzi | Performance Admin HO | All | 2026-01-27 |
| Rina Kusuma | Performance Admin | Terminal Nilam | 2026-01-28 |
| Citra Dewi | Performance Admin | Terminal Jamrud | 2026-01-26 |
| Dwi Putra | Performance Admin | Terminal Berlian | 2026-01-25 |

### Permission Matrix Applied

| Feature | Rina Kusuma | Budi Santoso |
| --- | --- | --- |
| View Weight Config | ✅ | ✅ |
| Edit Weight Config | ❌ | ✅ |
| View Common KAI | ✅ | ✅ |
| Manage Common KAI | ❌ | ✅ |
| Override KPI (Terminal Nilam) | ✅ | ✅ |
| Override KPI (All Terminals) | ❌ | ✅ |
| Period Management | ❌ | ✅ |
| System Settings | ❌ | ✅ |
| View Audit Log (Own) | ✅ | ✅ |
| View Audit Log (All) | ❌ | ✅ |