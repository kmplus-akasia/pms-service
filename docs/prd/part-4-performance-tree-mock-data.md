# Mock Data: Performance Tree & Top-Down Monitoring

## Struktur Organisasi Sample

```jsx
Pelindo (Corporate)
└── Direktorat Operasi
    └── Dept. Terminal Operations - Nilam
        ├── Section Bongkar Muat
        │   ├── Supervisor Bongkar Muat
        │   │   ├── Operator Crane A
        │   │   ├── Operator Crane B
        │   │   └── Operator Crane C
        │   └── Foreman Bongkar Muat
        └── Section Customer Service
            └── Supervisor CS
                ├── CS Officer 1 (Siti)
                ├── CS Officer 2 (Dewi)
                └── CS Officer 3 (Ani)
```

---

# A. Fase Planning

## Tree Navigation - Planning View

*Fokus: Alokasi & Konfigurasi KPI*

### Level 1: Direktorat - Allocation Status

| **Node** | **Allocated** | **Unallocated** | **Planning Status** | **Color** |
| --- | --- | --- | --- | --- |
| Direktorat Operasi | ✓ 45 | ○ 3 | 📋 Incomplete | 🟡 |
| Direktorat Keuangan | ✓ 32 | ○ 0 | 📋 Complete | 🟢 |
| Direktorat SDM | ✓ 28 | ○ 5 | 📋 Incomplete | 🟡 |
| Direktorat Komersial | ✓ 0 | ○ 12 | 📋 Not Started | 🔴 |

### Level 2: Department - Allocation Detail (Direktorat Operasi)

| **Node** | **Allocated** | **Unallocated** | **Pending Approval** | **Status** |
| --- | --- | --- | --- | --- |
| Dept. Terminal Operations - Nilam | ✓ 18 | ○ 2 | ⏳ 3 | 🟡 Partially |
| Dept. Terminal Operations - Jamrud | ✓ 15 | ○ 1 | ⏳ 0 | 🟡 Partially |
| Dept. Maintenance | ✓ 12 | ○ 0 | ⏳ 0 | 🟢 Complete |

---

## Position KPI Management - Planning Phase

### Position: Customer Service Officer

| **Atribut** | **Value** |
| --- | --- |
| Position Master ID | PM-CS-OFF-001 |
| Position Name | Customer Service Officer |
| Cohort | BOD-4 |
| Function | Customer Service |
| Incumbent Count | 3 |
| **Allocation Summary** | **[✓ 5 | ○ 2]** |

**Incumbent List:**

| **No** | **NIPP** | **Nama** | **Status** |
| --- | --- | --- | --- |
| 1 | 12345678 | Siti Nurhaliza | Aktif |
| 2 | 12345679 | Dewi Anggraini | Aktif |
| 3 | 12345680 | Ani Wijaya | Aktif |

### KPI Attached - Allocated Items

| **Type** | **ID** | **Item** | **Target** | **Bobot** | **Source** | **Workflow** |
| --- | --- | --- | --- | --- | --- | --- |
| Output | OUT-CS-001 | Complaint Resolution Rate | ≥ 95% | 40% | 📖 Dictionary | ✅ Approved |
| Output | OUT-CS-002 | First Call Resolution | ≥ 85% | 35% | 🔗 Cascaded | ✅ Approved |
| Output | OUT-CS-003 | Customer Retention | ≥ 90% | 25% | ✏️ Custom | ⏳ Pending |
| KAI | KAI-CS-001 | Daily Feedback Score | ≥ 4.5 | 50% | 📖 Dictionary | ✅ Approved |
| KAI | KAI-CS-002 | Response Time SLA | ≥ 90% | 50% | 🔗 Cascaded | ✅ Approved |

### KPI Attached - Unallocated Items (Pending from Parent)

| **Type** | **Parent KPI** | **Parent Owner** | **Cascade Type** | **Action Required** |
| --- | --- | --- | --- | --- |
| Output | Customer Satisfaction Index | Supervisor CS | Direct | Configure & Assign |
| Output | Service Level Agreement | Supervisor CS | Indirect | Configure & Assign |

---

## Add KPI Scenarios - Planning Phase

### Scenario 1: Add KPI from Dictionary

```jsx
Step 1: Select Position
→ Customer Service Officer (PM-CS-OFF-001)
→ Current: [✓ 5 | ○ 2]

Step 2: Click "Add KPI" → "From Dictionary"
→ Browse/Search: "response time"

Step 3: Select Item
→ KAI-DICT-004: Response Time SLA Compliance
→ Badge: 📖 From Dictionary

Step 4: Configure
- Target Value: 90% (default from dictionary)
- Target Unit: % (auto-filled, read-only)
- Bobot: 25% (configurable)
- Owner Assignment: Position-based
- Cascading: None

Step 5: Save
→ Status: "Allocated - Draft"
→ Workflow: Requires approval from Supervisor CS
→ Updated: [✓ 6 | ○ 2]
```

### Scenario 2: Add Custom KPI

```jsx
Step 1: Select Position
→ Customer Service Officer

Step 2: Click "Add KPI" → "Custom"

Step 3: Fill Form
- Title: "Proactive Customer Follow-up"
- Description: "Percentage of customers contacted..."
- KPI Type: KAI
- Target Value: 80
- Target Unit: %
- Polarity: Maximize
- Bobot: 15%
- Evidence Requirement: "Weekly report..."
- Monitoring Frequency: Mingguan

Step 4: Configure Assignment
- Owner Assignment: Position-based
→ All 3 incumbents become Owner

Step 5: Save
→ Status: "Allocated - Draft"
→ Badge: ✏️ Custom
→ Workflow: Pending approval
```

### Scenario 3: Cascade KPI from Parent

```jsx
Step 1: View Unallocated Item
→ "Customer Satisfaction Index" from Supervisor CS
→ Badge: ○ Pending Allocation

Step 2: Click "Cascade from Parent"
→ Parent: OUT-SUP-001 (Target: 95%)
→ Parent Status: ✅ Approved

Step 3: Select Cascade Type
○ Direct Cascade
  - Unit: Must match parent (%)
  - Realization: Auto-SUM to parent
  - Visual: ━━━ Solid line

● Indirect Cascade ← Selected
  - Unit: Can differ
  - Realization: Independent
  - Visual: ┄┄┄ Dashed line

Step 4: Configure Child KPI
- Title: "Individual Customer Satisfaction"
- Target: ≥ 92%
- Unit: % 
- Bobot: 20%
- Owner: Position-based

Step 5: Save
→ Parent Unallocated count: -1
→ Child created with link to parent
→ Status: "Allocated - Draft"
```

---

## Workflow Status Examples

| **Status** | **Icon** | **Description** | **Actions Available** |
| --- | --- | --- | --- |
| Draft | ⚪ | Baru dibuat, belum disubmit | Edit, Delete, Submit |
| Pending Approval | ⏳ | Menunggu approval atasan | View only (Admin: Approve/Reject) |
| Approved | ✅ | Sudah disetujui, siap monitoring | View only |
| Rejected | ❌ | Ditolak, perlu revisi | Edit, Resubmit |

---

## KPI Attribute Change Tracking

**Example: Target Modified from Dictionary**

| **Field** | **Original (Dictionary)** | **Current** | **Delta** |
| --- | --- | --- | --- |
| Target Value | 90% | 95% | 🔺 +5% |
| Bobot | 25% 🔒 | 25% | - (Fixed) |
| Evidence Requirement | "Monthly report" | "Weekly report with screenshots" | ✏️ Modified |

**Change History:**

| **Timestamp** | **Actor** | **Action** | **Detail** |
| --- | --- | --- | --- |
| 03 Dec 2025, 10:30 | Admin Perf | ➕ Created | Added from Dictionary |
| 03 Dec 2025, 10:35 | Admin Perf | Δ Modified | Target: 90% → 95% |
| 03 Dec 2025, 11:00 | Admin Perf | 📤 Submitted | For approval |
| 03 Dec 2025, 14:00 | Supervisor CS | ✅ Approved | - |

---

# B. Fase Monitoring

## Tree Navigation - Monitoring View

*Fokus: Achievement & Realisasi*

### Level 1: Direktorat - Achievement Status

| **Node** | **KPI Count** | **Avg Achievement** | **Status** | **Visual** |
| --- | --- | --- | --- | --- |
| Direktorat Operasi | 45 | 103.5% | 🟢 On Track | ━━━ |
| Direktorat Keuangan | 32 | 101.2% | 🟢 On Track | ━━━ |
| Direktorat SDM | 28 | 98.5% | 🟡 At Risk | ┄┄┄ |
| Direktorat Komersial | 38 | 104.1% | 🟢 On Track | ━━━ |

### Level 2: Department - Achievement Detail

| **Node** | **KPI Count** | **Achievement** | **On Track** | **At Risk** | **Behind** |
| --- | --- | --- | --- | --- | --- |
| Dept. Terminal Nilam | 18 | 104.2% | 15 | 2 | 1 |
| Dept. Terminal Jamrud | 15 | 102.8% | 14 | 1 | 0 |
| Dept. Maintenance | 12 | 101.5% | 12 | 0 | 0 |

### Level 3: Section - With Behind Indicator

| **Node** | **Achievement** | **Status** | **Behind Children** | **Visual** |
| --- | --- | --- | --- | --- |
| Section Bongkar Muat | 105.1% | 🟢 On Track | 0 | ━━━ |
| Section Customer Service | 102.5% | 🟡 At Risk | 1 | 🔴━━━ |

### Level 4: Individual - With Behind Highlight

| **Node** | **Incumbent** | **Achievement** | **Status** | **Visual** |
| --- | --- | --- | --- | --- |
| CS Officer | Siti Nurhaliza | 102.1% | 🟢 On Track | ━━━ |
| CS Officer | Dewi Anggraini | 101.1% | 🟢 On Track | ━━━ |
| CS Officer | Ani Wijaya | **95.0%** | **🔴 Behind** | **🔴━━━** |

---

## Top-Down Monitoring - Drill Down

### Starting Point: KPI Impact - Customer Satisfaction Index

| **Level** | **Node** | **Target** | **Actual** | **Achievement** | **Status** |
| --- | --- | --- | --- | --- | --- |
| **Corporate** | CSI | 90% | 92% | **102.2%** | 🟢 |
| ↓ Dir. Operasi | CSI-OP | 91% | 94% | 103.3% | 🟢 |
| ↓ Dir. Komersial | CSI-KOM | 89% | 89% | 100.0% | 🟢 |

### Drill-Down Path: Corporate → Individual

| **Level** | **Node** | **Target** | **Actual** | **Achievement** | **Cascade** | **Visual** |
| --- | --- | --- | --- | --- | --- | --- |
| Corporate | CSI | 90% | 92% | 102.2% | - | 🟢 |
| → Direktorat | CSI-Operasi | 91% | 94% | 103.3% | Direct | ━━━ 🟢 |
| → → Dept | CSI-Nilam | 92% | 95% | 103.3% | Direct | ━━━ 🟢 |
| → → → Section | CSI-CS | 93% | 95% | 102.2% | Direct | ━━━ 🟡 |
| → → → → Siti | CSI-Individual | 95% | 97% | 102.1% | Direct | ━━━ 🟢 |
| → → → → Dewi | CSI-Individual | 95% | 96% | 101.1% | Direct | ━━━ 🟢 |
| → → → → **Ani** | CSI-Individual | 95% | **90%** | **94.7%** | Direct | **🔴━━━ 🔴** |

---

## Aggregate Performance View

| **Metric** | **Value** | **Detail** |
| --- | --- | --- |
| **Average Achievement** | 99.3% | - |
| **Min** | 94.7% | Ani Wijaya 🔴 |
| **Max** | 102.1% | Siti Nurhaliza 🟢 |
| **Std Deviation** | 3.2% | - |
| **Distribution** | - | 🟢 2 | 🟡 0 | 🔴 1 |

---

## Cascading Tracker - Monitoring Phase

### Parent KPI: Regional Container Throughput

| **Atribut** | **Value** |
| --- | --- |
| Owner | GM Operations (Eko Prasetyo) |
| Target | 200,000 TEUs/month |
| Cascade Type | Direct (━━━) |
| Status | 🟡 At Risk (1 child Behind) |

**Child KPIs with Visual Coding:**

| **Position** | **Owner** | **Target** | **Actual** | **Achievement** | **Visual** |
| --- | --- | --- | --- | --- | --- |
| Dept Head Terminal A | Budi Santoso | 80,000 | 82,000 | 102.5% | ━━━ 🟢 |
| Dept Head Terminal B | Citra Dewi | 70,000 | 72,000 | 102.9% | ━━━ 🟢 |
| **Dept Head Terminal C** | **Dwi Putra** | **60,000** | **56,000** | **93.3%** | **🔴━━━ 🔴** |
| **TOTAL (SUM)** | - | **210,000** | **210,000** | **100.0%** | - |

**Cascade Visualization:**

```jsx
[Parent: Regional Throughput] 🟡 At Risk (child Behind)
Target: 200,000 | Actual: 210,000 | 105%
              │
    ┌─────────┼─────────┐
    │ Direct  │ Direct  │ Direct
    │ (━━━)   │ (━━━)   │ (🔴━━━) ← Red: Behind
    ▼         ▼         ▼
[Terminal A] [Terminal B] [Terminal C]
  102.5%       102.9%      93.3%
    🟢          🟢          🔴
```

---

## Realization Progress - Individual KPI

### KPI: Complaint Resolution Rate (Ani Wijaya)

| **Periode** | **Target** | **Actual** | **Achievement** | **Status** |
| --- | --- | --- | --- | --- |
| Jan 2026 | 95% | 92% | 96.8% | 🔴 Behind |
| Feb 2026 | 95% | 94% | 98.9% | 🔴 Behind |
| Mar 2026 | 95% | 90% | 94.7% | 🔴 Behind |
| Apr 2026 | 95% | - | - | ⚪ Pending |
| **YTD** | **95%** | **92%** | **96.8%** | **🔴 Behind** |

---

# ⚠️ ALIGNMENT ANALYSIS

## Issue Summary

| **Severity** | **Count** |
| --- | --- |
| 🔴 Errors | 2 |
| ⚠️ Warnings | 5 |

## Issue Details

### Error 1: Unit Mismatch - Direct Cascade

```jsx
🔴 ERROR: Unit Mismatch

Parent KPI: Container Throughput
Parent Unit: TEUs

Child KPI: Loading Efficiency
Child Unit: %

Issue: Direct Cascade requires matching units.
       Cannot SUM different units.

Resolution:
1. Change cascade type to Indirect, OR
2. Change child unit to TEUs
```

### Error 2: Owner Not Assigned

```jsx
🔴 ERROR: Owner Not Assigned

KPI: New Service Metrics
Position: CS Officer
Status: Allocated - Draft

Issue: KPI allocated but no owner assigned.
       Cannot proceed to monitoring.

Resolution: Configure owner assignment
```

### Warning 1: No Cascade Down (Unallocated)

```jsx
⚠️ WARNING: Unallocated KPI

KPI: Revenue Growth (IMP-002)
Level: BOD-1 (Group Head)
Unallocated to: BOD-2 level

Issue: Parent KPI not cascaded to child positions.

Recommendation: Create cascading KPI di level BOD-2
```

### Warning 2: Orphan KPI

```jsx
⚠️ WARNING: Orphan KPI Detected

KPI: Equipment Downtime Reduction
Position: Maintenance Supervisor
Source: ✏️ Custom

Issue: Custom KPI tanpa parent linkage.

Recommendation: Link ke KPI Output "Operational 
Excellence" di level Department Head.
```

### Warning 3: Level Skip

```jsx
⚠️ WARNING: Level Skip Detected

Parent KPI: Customer Satisfaction (Direktorat)
Child KPI: Individual CS Score (CS Officer)

Issue: Cascade skipped Department and Section levels.

Recommendation: Create intermediate KPIs for proper
alignment tracking.
```

---

# 📈 TREE STATISTICS

## Overall Metrics

| **Metric** | **Planning** | **Monitoring** |
| --- | --- | --- |
| Total Positions | 156 | 156 |
| Total KPI Items | 1,248 | 1,180 (approved) |
| Allocated Items | 1,180 (94.6%) | - |
| Unallocated Items | 68 (5.4%) | - |

## Planning Phase Statistics

| **Metric** | **Count** | **%** |
| --- | --- | --- |
| KPI Output | 512 | 41% |
| KAI | 736 | 59% |
| From Dictionary 📖 | 845 | 67.7% |
| Cascaded 🔗 | 298 | 23.9% |
| Custom ✏️ | 105 | 8.4% |
| Draft ⚪ | 42 | 3.4% |
| Pending ⏳ | 26 | 2.1% |
| Approved ✅ | 1,180 | 94.6% |

## Monitoring Phase Statistics

| **Metric** | **Count** | **%** |
| --- | --- | --- |
| On Track 🟢 | 1,062 | 90% |
| At Risk 🟡 | 71 | 6% |
| Behind 🔴 | 47 | 4% |
| Direct Cascade Links | 89 | - |
| Indirect Cascade Links | 124 | - |

## Alignment Issues

| **Issue Type** | **Severity** | **Count** |
| --- | --- | --- |
| Unallocated (No Cascade Down) | ⚠️ Warning | 68 |
| Orphan KPI | ⚠️ Warning | 12 |
| Unit Mismatch | 🔴 Error | 2 |
| Level Skip | ⚠️ Warning | 5 |
| Owner Not Assigned | 🔴 Error | 3 |

---

# Sampel Struktur KPI (BOD → BOD-4)

*View berdasarkan hierarki KPI: Impact → Output (4 level)*

## Sample KPI Hierarchy: Customer Satisfaction Index

### Fase Perencanaan - KPI Structure View

### Level 1: KPI Impact (Corporate)

| **KPI ID** | **KPI Name** | **Owner** | **Type** | **Linked** | **Unallocated** | **Status** |
| --- | --- | --- | --- | --- | --- | --- |
| IMP-001 | Customer Satisfaction Index | CEO | 📈 Impact | ✓ 3 | ○ 0 | 🟢 Complete |
| IMP-002 | Revenue Growth | CFO | 📈 Impact | ✓ 4 | ○ 1 | 🟡 Incomplete |
| IMP-003 | Operational Excellence Index | COO | 📈 Impact | ✓ 5 | ○ 0 | 🟢 Complete |

### Level 2: KPI Output - Direktorat (Child of IMP-001)

| **KPI ID** | **KPI Name** | **Owner** | **Parent** | **Cascade** | **Target** | **Bobot** | **Linked** | **Status** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OUT-DIR-001 | Customer Satisfaction - Operasi | Direktur Operasi | IMP-001 | Direct (━━━) | 91% | 35% | ✓ 4 | ✅ Approved |
| OUT-DIR-002 | Customer Satisfaction - Komersial | Direktur Komersial | IMP-001 | Direct (━━━) | 89% | 30% | ✓ 3 | ✅ Approved |
| OUT-DIR-003 | Service Quality Index | Direktur Operasi | IMP-001 | Indirect (┄┄┄) | 85% | 35% | ✓ 5 | ✅ Approved |

### Level 3: KPI Output - Department (Child of OUT-DIR-001)

| **KPI ID** | **KPI Name** | **Owner** | **Parent** | **Cascade** | **Target** | **Bobot** | **Linked** | **Status** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OUT-DPT-001 | Customer Satisfaction - Terminal Nilam | GM Terminal Nilam | OUT-DIR-001 | Direct (━━━) | 92% | 40% | ✓ 3 | ✅ Approved |
| OUT-DPT-002 | Customer Satisfaction - Terminal Jamrud | GM Terminal Jamrud | OUT-DIR-001 | Direct (━━━) | 91% | 35% | ✓ 2 | ✅ Approved |
| OUT-DPT-003 | Customer Satisfaction - Maintenance | GM Maintenance | OUT-DIR-001 | Direct (━━━) | 88% | 25% | ✓ 2 | ✅ Approved |
| OUT-DPT-004 | Loading Time Efficiency | GM Terminal Nilam | OUT-DIR-003 | Indirect (┄┄┄) | ≤ 2.5 hrs | 30% | ✓ 4 | ✅ Approved |

### Level 4: KPI Output - Section (Child of OUT-DPT-001)

| **KPI ID** | **KPI Name** | **Owner** | **Parent** | **Cascade** | **Target** | **Bobot** | **Linked** | **Status** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OUT-SCT-001 | Customer Satisfaction - CS Section | Supervisor CS | OUT-DPT-001 | Direct (━━━) | 93% | 50% | ✓ 5 | ✅ Approved |
| OUT-SCT-002 | Customer Satisfaction - Bongkar Muat | Supervisor BM | OUT-DPT-001 | Direct (━━━) | 91% | 35% | ✓ 4 | ✅ Approved |
| OUT-SCT-003 | Document Processing Accuracy | Supervisor CS | OUT-DPT-001 | Indirect (┄┄┄) | ≥ 98% | 15% | ✓ 3 | ✅ Approved |

### Level 5: KPI Output - Individual (Child of OUT-SCT-001)

| **KPI ID** | **KPI Name** | **Owner (Incumbent)** | **Parent** | **Cascade** | **Target** | **Bobot** | **Source** | **Status** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OUT-CS-001 | Customer Complaint Resolution Revenue | Siti Nurhaliza | OUT-SCT-001 | Direct (━━━) | 35% | 40% | 🔗 Cascaded | ✅ Approved |
| OUT-CS-002 | First Call Resolution | Siti Nurhaliza | OUT-SCT-001 | Indirect (┄┄┄) | ≥ 85% | 35% | 📖 Dictionary | ✅ Approved |
| OUT-CS-003 | Customer Retention Rate | Siti Nurhaliza | - | - | ≥ 90% | 25% | ✏️ Custom | ⏳ Pending |
| KAI-CS-001 | Daily Feedback Score | Siti Nurhaliza | OUT-SCT-001 | Indirect (┄┄┄) | ≥ 4.5 | 50% | 📖 Dictionary | ✅ Approved |
| KAI-CS-002 | Response Time SLA | Siti Nurhaliza | OUT-SCT-001 | Direct (━━━) | ≥ 90% | 50% | 🔗 Cascaded | ✅ Approved |

---

### Fase Monitoring - KPI Structure View

### Full Cascade Path: Impact → Individual

| **Level** | **KPI ID** | **KPI Name** | **Owner** | **Target** | **Actual** | **Achievement** | **Status** | **Cascade** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| L1: Impact | IMP-001 | Customer Satisfaction Index | CEO | 90% | 92% | 102.2% | 🟢 | - |
| ↓ L2: Output | OUT-DIR-001 | CSI - Operasi | Direktur Operasi | 91% | 94% | 103.3% | 🟢 | ━━━ |
| ↓ L3: Output | OUT-DPT-001 | CSI - Terminal Nilam | GM Terminal Nilam | 92% | 95% | 103.3% | 🟢 | ━━━ |
| ↓ L4: Output | OUT-SCT-001 | CSI - CS Section | Supervisor CS | 93% | 95% | 102.2% | 🟡 | ━━━ |
| ↓ L5: Output | OUT-CS-001 | Complaint Resolution | Siti Nurhaliza | 35% | 103.1% | 294.6% | 🟢 | ━━━ |
| ↓ L5: Output | OUT-CS-001 | Complaint Resolution | Dewi Anggraini | 35% | 101.1% | 288.9% | 🟢 | ━━━ |
| ↓ L5: Output | OUT-CS-001 | Complaint Resolution | **Ani Wijaya** | 35% | **94.7%** | **270.6%** | **🔴** | **━━━** |

---

## KPI Detail View - Planning Phase

### KPI: OUT-CS-001 - Customer Complaint Resolution Revenue

### Metadata

| **Atribut** | **Value** |
| --- | --- |
| KPI ID | OUT-CS-001 |
| KPI Name | Customer Complaint Resolution Revenue |
| Type | KPI Output |
| BSC Perspective | Customer |
| Frequency | Monthly |
| Source | 🔗 Cascaded from Parent |
| Created By | Admin Perf (03 Dec 2025) |
| Last Modified | Supervisor CS (05 Dec 2025) |
| Status | ✅ Approved |

### Parent KPI Relationship

| **Atribut** | **Value** |
| --- | --- |
| Parent KPI ID | OUT-SCT-001 |
| Parent KPI Name | Customer Satisfaction - CS Section |
| Parent Owner | Supervisor CS (Siti Nurhaliza) |
| Cascade Type | Direct (━━━) |
| Parent Target | 10,000,000,000 IDR |
| Parent Unit | IDR |
| Realization Method | Auto-SUM to parent |

### Target & Weight Configuration

| **Atribut** | **Value** |
| --- | --- |
| Target Value | 35% |
| Target Unit | % (Bobot) |
| Polarity | ↑ Maximize |
| Bobot (Item) | 40% |
| Bobot (Type) | 100% (KPI Output) |

### Owner Assignment

| **Position** | **Incumbent** | **NIPP** | **Assignment Type** | **Allocation** |
| --- | --- | --- | --- | --- |
| CS Officer | Siti Nurhaliza | 12345678 | Owner | 35% |
| CS Officer | Dewi Anggraini | 12345679 | Owner | 35% |
| CS Officer | Ani Wijaya | 12345680 | Owner | 30% |
| **Total Allocation** | - | - | - | **100%** |

### Evidence & Validation Rules

| **Atribut** | **Value** |
| --- | --- |
| Evidence Required | Monthly complaint resolution report from CRM system |
| Data Source | Portaverse CRM Module |
| Calculation Formula | (Resolved Complaints / Total Complaints) × Revenue Impact |
| Validation Rule | Must have CRM ticket closure evidence |
| Approval Required | Yes (by Supervisor CS) |

---

## KPI Detail View - Monitoring Phase

### KPI: OUT-CS-001 - Performance View (Siti Nurhaliza)

### Current Period: April 2026

| **Metric** | **Value** |
| --- | --- |
| Target | 2,800,000,000 IDR (35% × 8,000,000,000) |
| Realization | 2,940,000,000 IDR |
| Achievement | 105% |
| Bobot | 40% |
| Weighted Score | 42% (105% × 40%) |
| Status | 🟢 On Track |
| Forecast (Q1) | 🟢 On Track (Based on current trend) |

### Monthly Trend (Q1 2026)

| **Period** | **Target** | **Realization** | **Achievement** | **Δ vs Target** | **Status** |
| --- | --- | --- | --- | --- | --- |
| Jan 2026 | 2,400,000,000 | 2,472,000,000 | 103% | +72,000,000 | 🟢 |
| Feb 2026 | 2,400,000,000 | 2,520,000,000 | 105% | +120,000,000 | 🟢 |
| Mar 2026 | 2,400,000,000 | 2,568,000,000 | 107% | +168,000,000 | 🟢 |
| Apr 2026 | 2,800,000,000 | 2,940,000,000 | 105% | +140,000,000 | 🟢 |
| **YTD** | **10,000,000,000** | **10,500,000,000** | **105%** | **+500,000,000** | **🟢** |

### Breakdown Detail - April 2026

| **Component** | **Target** | **Actual** | **Achievement** |
| --- | --- | --- | --- |
| Ahmad Rizki | 980,000,000 | 1,029,000,000 | 105% |
| Ratna Dewi | 840,000,000 | 865,800,000 | 103% |
| Eko Prasetyo | 840,000,000 | 790,800,000 | 94% |
| **Total (SUM)** | **2,800,000,000** | **2,940,000,000** | **105%** |

### Cascade Impact to Parent

| **Parent KPI** | **Contribution** | **Impact** |
| --- | --- | --- |
| OUT-SCT-001: CSI - CS Section | 2,940,000,000 IDR | Auto-summed to parent realization |
| Parent Status | 🟢 On Track | Child performance supports parent target |

---

## Weight Distribution Analysis

### Position: Customer Service Supervisor (POS-003)

### Weight Validation

| **Check** | **Status** | **Detail** |
| --- | --- | --- |
| Total KPI Impact Weight | ✅ Valid | 0% (No Impact KPI at this level) |
| Total KPI Output Weight | ✅ Valid | 100% (13 allocated + 0 unallocated) |
| Total KAI Weight | ✅ Valid | 100% (10 allocated + 0 unallocated) |
| Type Distribution | ✅ Valid | Output: 35% | Impact: 0% | KAI: 65% |

### KPI Output Weight Breakdown

| **KPI ID** | **KPI Name** | **Bobot** | **Source** | **Status** |
| --- | --- | --- | --- | --- |
| OUT-CS-001 | Complaint Resolution Revenue | 40% | 🔗 Cascaded | ✅ |
| OUT-CS-002 | First Call Resolution | 35% | 📖 Dictionary | ✅ |
| OUT-CS-003 | Customer Retention Rate | 25% | ✏️ Custom | ⏳ |
| **Total** | - | **100%** | - | - |

### KAI Weight Breakdown

| **KPI ID** | **KPI Name** | **Bobot** | **Source** | **Status** |
| --- | --- | --- | --- | --- |
| KAI-CS-001 | Daily Feedback Score | 50% | 📖 Dictionary | ✅ |
| KAI-CS-002 | Response Time SLA | 50% | 🔗 Cascaded | ✅ |
| **Total** | - | **100%** | - | - |

---

## Alternative Cascade Example: Revenue Growth

### 4-Level Indirect Cascade

| **Level** | **KPI ID** | **KPI Name** | **Owner** | **Target** | **Unit** | **Cascade** | **Method** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| L1: Impact | IMP-002 | Revenue Growth | CFO | 15% | % | - | - |
| ↓ L2: Output | OUT-FIN-001 | Regional Revenue Growth | Regional Finance Head | 18% | % | Indirect (┄┄┄) | Independent |
| ↓ L3: Output | OUT-TRM-001 | Terminal Revenue - Nilam | GM Terminal Nilam | 500B IDR | IDR | Indirect (┄┄┄) | Independent |
| ↓ L4: Output | OUT-SRV-001 | Service Revenue - CS | Supervisor CS | 50B IDR | IDR | Indirect (┄┄┄) | Independent |
| ↓ L5: Output | OUT-IND-001 | Individual Service Revenue | CS Officer (Siti) | 15B IDR | IDR | Direct (━━━) | Auto-SUM |

**Visual Representation:**

```jsx
[IMP-002: Revenue Growth] 15% YoY
              │
       Indirect (┄┄┄) ← Unit change: % → %
              ▼
[OUT-FIN-001: Regional Revenue] 18% YoY
              │
       Indirect (┄┄┄) ← Unit change: % → IDR
              ▼
[OUT-TRM-001: Terminal Revenue] 500B IDR
              │
       Indirect (┄┄┄) ← Same unit, independent
              ▼
[OUT-SRV-001: Service Revenue] 50B IDR
              │
       Direct (━━━) ← Same unit, auto-SUM
              ▼
[OUT-IND-001: Individual Revenue] 15B IDR (×3 officers)
              Sum: 45B → Parent
```

---

## Search & Filter - Struktur KPI View

### Filter Options - Planning Phase

| **Filter Type** | **Options** |
| --- | --- |
| KPI Type | 📈 Impact | 📊 Output | ⚡ KAI |
| Cascade Type | Direct (━━━) | Indirect (┄┄┄) | No Cascade |
| Source | 📖 Dictionary | 🔗 Cascaded | ✏️ Custom |
| Status | ⚪ Draft | ⏳ Pending | ✅ Approved | ❌ Rejected |
| BSC Perspective | Financial | Customer | Internal Process | Learning & Growth |
| Allocation Status | Linked (✓) | Unallocated (○) |
| Owner Level | BOD-1 | BOD-2 | BOD-3 | BOD-4 | BOD-5 |

### Search Scenarios

### Scenario 1: Find all unallocated KPI Output

```jsx
Filter:
- KPI Type: 📊 Output
- Allocation Status: Unallocated (○)

Result: 45 items
- IMP-002 → 12 unallocated to BOD-2
- OUT-DIR-003 → 8 unallocated to Department
- OUT-DPT-005 → 25 unallocated to Section/Individual
```

### Scenario 2: Find all Direct Cascade with unit mismatch

```jsx
Filter:
- Cascade Type: Direct (━━━)
- Alignment Issues: Unit Mismatch

Result: 2 items
- OUT-DPT-004 (Parent: %, Child: TEUs)
- OUT-SCT-008 (Parent: IDR, Child: Count)
```

### Scenario 3: Track specific KPI path from Impact to Individual

```jsx
Search: "Customer Satisfaction"
Filter by: Full cascade path

Result: Tree view showing:
IMP-001 (CEO)
  ├─ OUT-DIR-001 (Dir. Operasi) ━━━
  │   ├─ OUT-DPT-001 (GM Terminal) ━━━
  │   │   ├─ OUT-SCT-001 (Supervisor CS) ━━━
  │   │   │   ├─ OUT-CS-001 (Siti) ━━━
  │   │   │   ├─ OUT-CS-001 (Dewi) ━━━
  │   │   │   └─ OUT-CS-001 (Ani) ━━━
```

---

## Alignment Health Dashboard - Struktur KPI View

### Overall Health Score

| **Metric** | **Score** | **Status** |
| --- | --- | --- |
| Cascade Completeness | 94.6% | 🟢 Healthy |
| Weight Distribution | 98.2% | 🟢 Healthy |
| Approval Rate | 94.5% | 🟢 Healthy |
| Alignment Errors | 2 | 🔴 Critical |
| Alignment Warnings | 5 | 🟡 Attention |

### Issue Distribution by Level

| **Level** | **Errors** | **Warnings** | **Info** |
| --- | --- | --- | --- |
| L1: Impact | 0 | 1 | 0 |
| L2: Direktorat | 0 | 2 | 3 |
| L3: Department | 1 | 1 | 5 |
| L4: Section | 1 | 1 | 2 |
| L5: Individual | 0 | 0 | 8 |

---

# 📅 HISTORICAL PERIOD SELECTION

## Period Selector - Available Periods

| **Period** | **Data Type** | **Status** | **Editable** |
| --- | --- | --- | --- |
| December 2025 | Real-time | 🟢 Current Period | Yes (Admin) |
| November 2025 | Snapshot | ⚪ Historical | No |
| October 2025 | Snapshot | ⚪ Historical | No |
| September 2025 | Snapshot | ⚪ Historical | No |
| August 2025 | Snapshot | ⚪ Historical | No |

## Historical Data - November 2025 Snapshot

### Struktur Organisasi - Planning Phase

| **Node** | **Allocated** | **Unallocated** | **Planning Status** | **Δ vs Current** |
| --- | --- | --- | --- | --- |
| Direktorat Operasi | ✓ 42 | ○ 5 | 📋 Incomplete | +3 allocated |
| Direktorat Keuangan | ✓ 30 | ○ 2 | 📋 Incomplete | +2 allocated |
| Direktorat SDM | ✓ 25 | ○ 8 | 📋 Incomplete | +3 allocated |
| Direktorat Komersial | ✓ 0 | ○ 12 | 📋 Not Started | No change |

### Struktur Organisasi - Monitoring Phase (November 2025)

| **Node** | **KPI Count** | **Avg Achievement** | **Status** | **Δ vs December** |
| --- | --- | --- | --- | --- |
| Direktorat Operasi | 42 | 101.2% | 🟢 On Track | -2.3% |
| Direktorat Keuangan | 30 | 99.8% | 🟡 At Risk | +1.4% |
| Direktorat SDM | 25 | 97.2% | 🟡 At Risk | +1.3% |
| Direktorat Komersial | 0 | - | ⚪ No Data | - |

## Compare Mode - November vs December 2025

### Aggregate Metrics Comparison

| **Metric** | **November 2025** | **December 2025** | **Delta** | **Trend** |
| --- | --- | --- | --- | --- |
| Total Allocated Items | 97 (82.2%) | 105 (88.9%) | +8 items | 🟢 Improving |
| Avg Achievement | 99.4% | 102.1% | +2.7% | 🟢 Improving |
| On Track Count | 980 | 1,062 | +82 | 🟢 Improving |
| At Risk Count | 85 | 71 | -14 | 🟢 Improving |
| Behind Count | 52 | 47 | -5 | 🟢 Improving |

### Individual KPI Comparison - Siti Nurhaliza

| **KPI** | **Nov 2025** | **Dec 2025** | **Delta** | **Trend** |
| --- | --- | --- | --- | --- |
| Complaint Resolution Revenue | 101.5% | 103.1% | +1.6% | 🟢 Improving |
| First Call Resolution | 98.2% | 102.5% | +4.3% | 🟢 Improving |
| Daily Feedback Score | 102.0% | 100.8% | -1.2% | 🔴 Declining |

---

# ⚡ SELF-CASCADED KPI

## Position Detail - KPI Summary with Self-Cascaded

### Position: Customer Service Officer (Siti Nurhaliza)

| **Metric** | **Count** | **Percentage** |
| --- | --- | --- |
| Total KPI | 15 | 100% |
| Via Performance Tree | 12 | 80% |
| Self-Cascaded ⚡ | 3 | 20% |

### Self-Cascaded KPI Detail List

| **KPI Title** | **Owner** | **Source Parent** | **Cascade Type** | **Date Cascaded** | **Status** |
| --- | --- | --- | --- | --- | --- |
| Customer Retention Rate | Siti Nurhaliza | Supervisor CS → Customer Satisfaction | Indirect (┄┄┄) | 15 Jan 2025 | 🟢 Active |
| Proactive Follow-up Score | Siti Nurhaliza | Supervisor CS → Service Quality | Indirect (┄┄┄) | 22 Jan 2025 | 🟢 Active |
| Cross-sell Success Rate | Supervisor CS (assigned to Siti) | GM Terminal → Revenue Growth | Direct (━━━) | 10 Feb 2025 | 🟢 Active |

### Via Performance Tree vs Self-Cascaded Breakdown

| **Source** | **KPI Type** | **Count** | **Avg Achievement** |
| --- | --- | --- | --- |
| Via Performance Tree | Output | 8 | 102.5% |
| Via Performance Tree | KAI | 4 | 101.8% |
| Self-Cascaded ⚡ | Output | 2 | 98.3% |
| Self-Cascaded ⚡ | KAI | 1 | 103.2% |

### Self-Cascaded Item Detail - Customer Retention Rate

| **Atribut** | **Value** |
| --- | --- |
| KPI ID | OUT-CS-SC-001 |
| KPI Title | Customer Retention Rate |
| Created Via | My Performance ⚡ |
| Owner (Creator) | Siti Nurhaliza (CS Officer) |
| Source Parent | OUT-SUP-002: Customer Satisfaction (Supervisor CS) |
| Cascade Type | Indirect (┄┄┄) |
| Date Cascaded | 15 Jan 2025, 14:30 |
| Target | ≥ 90% |
| Bobot | 15% |
| Current Achievement | 92.5% (On Track) |
| Status | 🟢 Active |
| Editable By | Owner only (via My Performance) |

### Orphaned Self-Cascaded KPI Example

| **KPI Title** | **Owner** | **Source Parent** | **Issue** | **Status** | **Action Required** |
| --- | --- | --- | --- | --- | --- |
| Product Upsell Rate | Dewi Anggraini (Resigned) | Supervisor CS → Revenue Target (Deleted) | ⚠️ Owner resigned + Parent deleted | 🔴 Orphaned | Re-assign or Archive |

### Filter View Examples

### Filter: Show All

| **#** | **KPI Title** | **Source** | **Achievement** |
| --- | --- | --- | --- |
| 1 | Complaint Resolution Revenue | Via Tree | 103.1% |
| 2 | First Call Resolution | Via Tree | 102.5% |
| 3 | Customer Retention Rate | Self-Cascaded ⚡ | 98.3% |
| 4 | Daily Feedback Score | Via Tree | 100.8% |
| 5 | Proactive Follow-up Score | Self-Cascaded ⚡ | 103.2% |

### Filter: Self-Cascaded Only

| **#** | **KPI Title** | **Owner** | **Date Cascaded** | **Achievement** |
| --- | --- | --- | --- | --- |
| 1 | Customer Retention Rate | Siti Nurhaliza | 15 Jan 2025 | 98.3% |
| 2 | Proactive Follow-up Score | Siti Nurhaliza | 22 Jan 2025 | 103.2% |
| 3 | Cross-sell Success Rate | Supervisor CS | 10 Feb 2025 | 95.8% |

### Admin Actions for Self-Cascaded KPI

| **Action** | **Description** | **When Used** |
| --- | --- | --- |
| Convert to Via Tree | Mengubah Self-Cascaded KPI menjadi Via Tree (managed by Admin) | Untuk standarisasi KPI struktural |
| Re-assign Owner | Mengganti owner Orphaned KPI | Ketika owner resign/mutasi |
| Archive | Meng-archive KPI yang tidak relevan | Ketika KPI tidak digunakan lagi |
| View History | Melihat history cascade dan perubahan | Audit trail |