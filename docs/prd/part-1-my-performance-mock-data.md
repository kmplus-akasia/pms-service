## Profil Pekerja Sample

| Atribut | Value |
| --- | --- |
| **NIPP** | 12345678 |
| **Nama** | Siti Nurhaliza |
| **Posisi Definitif** | Customer Service Supervisor |
| **Position Master Variant ID** | PMV-CS-SUP-005 |
| **Kohort Definitif** | BOD-3 (Supervisor) |
| **Kelas Jabatan (Definitif)** | 8 |
| **Posisi Secondary** | Customer Relation Consultant |
| **Kohort Secondary** | BOD-4 (Officer) |
| **Periode Secondary** | 15 Januari 2026 - 28 Februari 2026 |
| **Atasan Langsung** | Bambang Setiawan (Manager CS) |
| **Organisasi** | Dept. Customer Service - Terminal Nilam |
| **Status Pekerja** | PKWTT Pelindo |
| **Periode** | 2026 |

---

## Konfigurasi Bobot per Kohort

### Bobot Posisi Definitif (BOD-3 - Supervisor)

| Jenis KPI | Bobot Jenis |
| --- | --- |
| KPI Impact | 20% |
| KPI Output | 50% |
| KAI | 30% |
| **Total** | **100%** |

### Bobot Posisi Secondary (BOD-4 - Officer)

| Jenis KPI | Bobot Jenis |
| --- | --- |
| KPI Impact | 10% |
| KPI Output | 30% |
| KAI | 60% |
| **Total** | **100%** |

---

## Posisi Definitif (Supervisor)

<aside>
📍

**Position:** Customer Service Supervisor (Definitif)

**Status:** Active

**Period:** 01 Jan 2026 - Present

</aside>

### KPI Impact (20%)

| ID | Item | Target | Unit | Polarity | Bobot Item | Kontribusi Final |
| --- | --- | --- | --- | --- | --- | --- |
| IMP-001 | Net Income | ≥ 25,000,000,000 | IDR | Maximize | 30% | 6.0% |
| IMP-002 | Revenue Growth | ≥ 8 | % | Maximize | 25% | 5.0% |
| IMP-003 | Customer Satisfaction Index | ≥ 90 | % | Maximize | 20% | 4.0% |
| IMP-004 | Operational Excellence | ≥ 95 | % | Maximize | 15% | 3.0% |
| IMP-005 | Employee Engagement | ≥ 85 | % | Maximize | 10% | 2.0% |
| **Total** |  |  |  |  | **100%** | **20%** |

### KPI Output (50%)

| ID | Item | Target | Unit | Polarity | Frequency | Bobot Item | Kontribusi Final | Role | Cascade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OUT-SUP-001 | Customer Complaint Resolution Revenue | ≥ 10,000,000,000 | IDR | Maximize | Monthly | 30% | 15.0% | Owner | 🔗 Direct |
| OUT-SUP-002 | Team Customer Satisfaction Rate | ≥ 92% | % | Maximize | Monthly | 25% | 12.5% | Owner | - |
| OUT-SUP-003 | Team Performance Achievement | ≥ 95% | % | Maximize | Monthly | 20% | 10.0% | Owner | - |
| OUT-SUP-004 | SLA Compliance Rate | ≥ 98% | % | Maximize | Monthly | 15% | 7.5% | Owner | 🔀 Indirect |
| OUT-SUP-005 | Team Development Score | ≥ 85 | Score | Maximize | Monthly | 10% | 5.0% | Owner | - |
| **Total** |  |  |  |  |  | **100%** | **50%** |  |  |

<aside>
🔗

**Direct Cascade - OUT-SUP-001 (Customer Complaint Resolution Revenue):**

Item ini di-cascade secara **Direct (SUM)** ke 3 bawahan langsung:

- Ahmad Rizki: OUT-CS-001-A (Revenue Technical Resolution) = 2.8B IDR/bulan
- Ratna Dewi: OUT-CS-001-B (Revenue Service Complaint) = 2.4B IDR/bulan
- Eko Prasetyo: OUT-CS-001-C (Revenue Escalation Resolution) = 2.4B IDR/bulan
- Siti Own (tidak di-cascade): 2.4B IDR/bulan

**Total Target:** 10B IDR/bulan = Siti Own (2.4B) + Child A (2.8B) + Child B (2.4B) + Child C (2.4B)

**Agregasi:** Realisasi parent (OUT-SUP-001) = SUM(Siti Own + Ahmad + Ratna + Eko)

</aside>

### KAI (30%)

| ID | Item | Parent KPI Output | Target | Unit | Polarity | Frequency | Nature | Bobot Item | Kontribusi Final | Type |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| KAI-SUP-001 | Weekly Team Meeting Completion | OUT-SUP-002 | 100 | % | Maximize | Weekly | Routine | 30% | 9.0% | Specific |
| KAI-SUP-002 | Coaching Session per Team Member | OUT-SUP-004 | ≥ 2 | sessions/month | Maximize | Monthly | Routine | 25% | 7.5% | Specific |
| KAI-SUP-003 | Escalation Resolution Time | OUT-SUP-003 | ≤ 2 | hours | Minimize | Weekly | Routine | 20% | 6.0% | Specific |
| KAI-COM-001 | Workplace Safety Compliance | - | 100 | % | Maximize | Monthly | Routine | 15% | 4.5% | Common |
| KAI-COM-002 | Attendance Rate | - | ≥ 95 | % | Maximize | Monthly | Routine | 10% | 3.0% | Common |
| **Total** |  |  |  |  |  |  |  | **100%** | **30%** |  |

<aside>
💡

**Catatan Parent KPI Output:**

KAI (Key Activity Indicators) di-cascade dari KPI Output **individu sendiri**, bukan dari KPI Output atasan. Ini menunjukkan bahwa aktivitas operasional (KAI) berkontribusi langsung ke pencapaian output individu.

</aside>

---

## Posisi Secondary (Customer Relation Consultant)

<aside>
🔄

**Position:** Customer Relation Consultant

**Status:** Secondary Assignment

**Period:** 15 Jan 2026 - 28 Feb 2026

**Atasan:** Bambang Setiawan (Manager CS)

</aside>

### KPI Impact (10%) - Secondary

| ID | Item | Target | Bobot Item | Kontribusi Final |
| --- | --- | --- | --- | --- |
| IMP-001 | Net Income | ≥ 25 Miliar | 30% | 3.0% |
| IMP-002 | Revenue Growth | ≥ 8% | 25% | 2.5% |
| IMP-003 | Customer Satisfaction Index | ≥ 90% | 20% | 2.0% |
| IMP-004 | Operational Excellence | ≥ 95% | 15% | 1.5% |
| IMP-005 | Employee Engagement | ≥ 85% | 10% | 1.0% |
| **Total** |  |  | **100%** | **10%** |

### KPI Output (30%) - Secondary

| ID | Item | Target | Frequency | Bobot Item | Kontribusi Final | Role |
| --- | --- | --- | --- | --- | --- | --- |
| OUT-CS-001 | Customer Complaint Resolution Rate | ≥ 95% | Monthly | 40% | 12.0% | Owner |
| OUT-CS-002 | First Call Resolution | ≥ 85% | Monthly | 35% | 10.5% | Owner |
| OUT-CS-003 | Customer Retention Rate | ≥ 90% | Quarterly | 25% | 7.5% | Shared Owner |
| **Total** |  |  |  | **100%** | **30%** |  |

### KAI (60%) - Secondary

| ID | Item | Target | Frequency | Bobot Item | Kontribusi Final | Type |
| --- | --- | --- | --- | --- | --- | --- |
| KAI-CS-001 | Daily Customer Feedback Score | ≥ 4.5 | Weekly | 30% | 18.0% | Specific |
| KAI-CS-002 | Response Time ≤ 5 min | ≥ 90% | Weekly | 25% | 15.0% | Specific |
| KAI-CS-003 | Ticket Handling Volume | ≥ 50/day | Weekly | 20% | 12.0% | Specific |
| KAI-COM-001 | Workplace Safety Compliance | 100% | Monthly | 15% | 9.0% | Common |
| KAI-COM-002 | Attendance Rate | ≥ 95% | Monthly | 10% | 6.0% | Common |
| **Total** |  |  |  | **100%** | **60%** |  |

---

## Data Monitoring - Q1 2026

<aside>
📊

**Skenario Mock Data:**

Mock data ini dirancang untuk mendemonstrasikan berbagai kondisi monitoring, termasuk status On Track, At Risk, dan Behind dengan mempertimbangkan cascading relationship (parent-child KPI).

**Timeline Context:**

Data ini merepresentasikan state per **April 2026** untuk monitoring yang baru selesai (Maret 2026). User sedang mereview performance Q1 2026 (Januari-Maret) di awal April.

</aside>

### KPI Impact Realization (dari P-KPI)

| ID | Item | Target Q1 | Realisasi Q1 | Achievement | Status |
| --- | --- | --- | --- | --- | --- |
| IMP-001 | Net Income | 25,000,000,000 | 26,150,000,000 | 104.6% | 🟢 On Track |
| IMP-002 | Revenue Growth | 8% | 8.5% | 106.3% | 🟢 On Track |
| IMP-003 | Customer Satisfaction Index | 90% | 92% | 102.2% | 🟢 On Track |
| IMP-004 | Operational Excellence | 95% | 96% | 101.1% | 🟢 On Track |
| IMP-005 | Employee Engagement | 85% | 87% | 102.4% | 🟢 On Track |

**Achievement KPI Impact Q1:** 103.3%

---

### KPI Output Realization - Periode Januari - Maret 2026

<aside>
💡

**Catatan Cascading:**

- **OUT-SUP-001** memiliki komponen dari multiple team members dengan **Aggregate tracking**
- **OUT-SUP-002** merupakan aggregate dari team performance individual
- **OUT-SUP-003** memiliki cascade ke bawahan (Indirect)
</aside>

### OUT-SUP-001: Customer Complaint Resolution Revenue (Owner - Direct Cascade)

<aside>
🔗

**Direct Cascade (SUM):** Realisasi parent = Siti Own + Child A (Ahmad) + Child B (Ratna) + Child C (Eko)

</aside>

| Bulan | Target (IDR) | Siti Own (IDR) | Ahmad A (IDR) | Ratna B (IDR) | Eko C (IDR) | **Total Realisasi (IDR)** | Achievement | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Jan 2026 | 10,000,000,000 | 2,520,000,000 | 2,856,000,000 | 2,400,000,000 | 2,280,000,000 | **10,056,000,000** | 100.6% | 🟢 On Track |
| Feb 2026 | 10,000,000,000 | 2,640,000,000 | 2,940,000,000 | 2,472,000,000 | 2,160,000,000 | **10,212,000,000** | 102.1% | 🟢 On Track |
| Mar 2026 | 10,000,000,000 | 2,760,000,000 | 3,024,000,000 | 2,544,000,000 | 2,328,000,000 | **10,656,000,000** | 106.6% | 🟢 On Track |

**Achievement OUT-SUP-001 Q1:** 103.1%

<aside>
💡

**Insight Direct Cascade:**

- Meskipun Eko consistently below target (avg 94%), agregasi tim tetap **On Track** karena Siti Own (110%), Ahmad (105%), dan Ratna (103%) mengkompensasi.
- Q1 Total: 30.92B IDR dari target 30B IDR (103.1% achievement)
- Detail breakdown ada di [Mock Data: My Team Performance](https://www.notion.so/Mock-Data-My-Team-Performance-1d2dc469e1fe4be9a7d689f518fd93bd?pvs=21)
</aside>

---

### OUT-SUP-002: Team Customer Satisfaction Rate (Owner)

| Bulan | Target | Realisasi | Achievement | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| Jan 2026 | 95% | 96% | 101.1% | 🟢 On Track | team_perf_jan.xlsx |
| Feb 2026 | 95% | 97% | 102.1% | 🟢 On Track | team_perf_feb.xlsx |
| Mar 2026 | 95% | 98% | 103.2% | 🟢 On Track | team_perf_mar.xlsx |

### OUT-SUP-003: SLA Compliance Rate (Owner)

| Bulan | Target | Realisasi | Achievement | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| Jan 2026 | 98% | 98.5% | 100.5% | 🟢 On Track | sla_jan.pdf |
| Feb 2026 | 98% | 97% | 99.0% | 🔴 Behind | sla_feb.pdf |
| Mar 2026 | 98% | 99% | 101.0% | 🟢 On Track | sla_mar.pdf |

### OUT-SUP-004: Team Development Score (Owner)

| Bulan | Target | Realisasi | Achievement | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| Jan 2026 | 85 | 87 | 102.4% | 🟢 On Track | dev_score_jan.xlsx |
| Feb 2026 | 85 | 86 | 101.2% | 🟢 On Track | dev_score_feb.xlsx |
| Mar 2026 | 85 | 88 | 103.5% | 🟢 On Track | dev_score_mar.xlsx |

---

### KPI Output Achievement Summary - Q1 2026

| KPI ID | KPI | Bobot Item | Jan Achievement | Feb Achievement | Mar Achievement | Q1 Avg | Weighted Score |
| --- | --- | --- | --- | --- | --- | --- | --- |
| OUT-SUP-001 | Team Customer Satisfaction Rate | 35% | 101.1% | 102.2% | 103.3% | 102.2% | 17.88% |
| OUT-SUP-002 | Team Performance Achievement | 30% | 101.1% | 102.1% | 103.2% | 102.1% | 15.32% |
| OUT-SUP-003 | SLA Compliance Rate | 25% | 100.5% | 99.0% | 101.0% | 100.2% | 12.52% |
| OUT-SUP-004 | Team Development Score | 10% | 102.4% | 101.2% | 103.5% | 102.4% | 5.12% |
| **Total** |  | **100%** |  |  |  | **101.8%** | **50.84%** |

**Achievement KPI Output Q1:** 101.8% (kontribusi ke total score: 50.84%)

---

### KAI Realization - Januari - Maret 2026

### KAI-SUP-001: Weekly Team Meeting Completion (Weekly)

| Month | Week | Target | Realisasi | Achievement | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Januari | W1-W4 | 100% | 100% | 100.0% | 🟢 On Track | meeting_jan_summary.pdf |
| Februari | W1-W4 | 100% | 100% | 100.0% | 🟢 On Track | meeting_feb_summary.pdf |
| Maret | W1-W4 | 100% | 100% | 100.0% | 🟢 On Track | meeting_mar_summary.pdf |

**Achievement KAI-SUP-001 Q1:** 100.0%

---

### KAI-SUP-002: Coaching Session per Team Member (Monthly)

| Month | Target | Realisasi | Achievement | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| Januari | ≥ 2 sessions | 2.3 sessions | 115.0% | 🟢 On Track | coaching_jan_log.xlsx |
| Februari | ≥ 2 sessions | 2.0 sessions | 100.0% | 🟢 On Track | coaching_feb_log.xlsx |
| Maret | ≥ 2 sessions | 2.5 sessions | 125.0% | 🟢 On Track | coaching_mar_log.xlsx |

**Achievement KAI-SUP-002 Q1:** 113.3%

---

### KAI-SUP-003: Escalation Resolution Time (Weekly)

| Month | Target | Realisasi | Achievement | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| Januari | ≤ 2 hours | 1.8 hours | 111.1% | 🟢 On Track | escalation_jan_summary.xlsx |
| Februari | ≤ 2 hours | 1.9 hours | 105.3% | 🟢 On Track | escalation_feb_summary.xlsx |
| Maret | ≤ 2 hours | 1.7 hours | 117.6% | 🟢 On Track | escalation_mar_summary.xlsx |

**Achievement KAI-SUP-003 Q1:** 111.3%

---

### Common KAI

| ID | Item | Bulan | Target | Realisasi | Achievement | Status |
| --- | --- | --- | --- | --- | --- | --- |
| KAI-COM-001 | Workplace Safety Compliance | Jan | 100% | 100% | 100.0% | 🟢 On Track |
| KAI-COM-001 | Workplace Safety Compliance | Feb | 100% | 100% | 100.0% | 🟢 On Track |
| KAI-COM-001 | Workplace Safety Compliance | Mar | 100% | 100% | 100.0% | 🟢 On Track |
| KAI-COM-002 | Attendance Rate | Jan | 95% | 100% | 105.3% | 🟢 On Track |
| KAI-COM-002 | Attendance Rate | Feb | 95% | 98% | 103.2% | 🟢 On Track |
| KAI-COM-002 | Attendance Rate | Mar | 95% | 96% | 101.1% | 🟢 On Track |

**Achievement Common KAI Q1:** 101.6%

---

### KAI Achievement Summary - Q1 2026

| KAI ID | KAI | Bobot Item | Q1 Achievement | Weighted Score |
| --- | --- | --- | --- | --- |
| KAI-SUP-001 | Weekly Team Meeting | 30% | 100.0% | 9.00% |
| KAI-SUP-002 | Coaching Session | 25% | 113.3% | 8.50% |
| KAI-SUP-003 | Escalation Resolution Time | 20% | 111.3% | 6.68% |
| KAI-COM-001 | Safety Compliance | 15% | 100.0% | 4.50% |
| KAI-COM-002 | Attendance Rate | 10% | 103.2% | 3.10% |
| **Total** |  | **100%** | **105.7%** | **31.78%** |

**Achievement KAI Q1:** 105.7% (kontribusi ke total score: 31.78%)

---

## Perhitungan Score Q1 2026

### Score per Jenis KPI (Definitif - Supervisor)

| Jenis KPI | Achievement | Bobot Jenis | Kontribusi |
| --- | --- | --- | --- |
| KPI Impact | 103.3% | 20% | 20.66% |
| KPI Output | 101.8% | 50% | 50.84% |
| KAI | 105.7% | 30% | 31.78% |
| **Total Score Q1** |  | **100%** | **103.28%** |

### Score Detail per Item (Definitif)

| Jenis | Item | Achievement | Bobot Item | Bobot Jenis | Kontribusi Final |
| --- | --- | --- | --- | --- | --- |
| Impact | Net Income | 104.6% | 30% | 20% | 6.28% |
| Impact | Revenue Growth | 106.3% | 25% | 20% | 5.32% |
| Impact | Customer Satisfaction Index | 102.2% | 20% | 20% | 4.09% |
| Impact | Operational Excellence | 101.1% | 15% | 20% | 3.03% |
| Impact | Employee Engagement | 102.4% | 10% | 20% | 2.05% |
| Output | Team Customer Satisfaction | 102.2% | 35% | 50% | 17.88% |
| Output | Team Performance Achievement | 102.1% | 30% | 50% | 15.32% |
| Output | SLA Compliance Rate | 100.2% | 25% | 50% | 12.52% |
| Output | Team Development Score | 102.4% | 10% | 50% | 5.12% |
| KAI | Weekly Team Meeting | 100.0% | 30% | 30% | 9.00% |
| KAI | Coaching Session | 113.3% | 25% | 30% | 8.50% |
| KAI | Escalation Resolution Time | 111.3% | 20% | 30% | 6.68% |
| KAI | Safety Compliance | 100.0% | 15% | 30% | 4.50% |
| KAI | Attendance Rate | 103.2% | 10% | 30% | 3.10% |
| **TOTAL** |  |  |  |  | **103.28%** |

---

## Dashboard Summary View - Q1 2026

```jsx
┌─────────────────────────────────────────────────────────────┐
│ My Performance - Q1 2026                    Siti Nurhaliza   │
│ 📍 Position: Customer Service Supervisor (Definitif)         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Overall Performance Score                            │  │
│  │  ╔════════════════════════════════════════════════╗   │  │
│  │  ║           103.28%                              ║   │  │
│  │  ║     🟢 On Track                                ║   │  │
│  │  ╚════════════════════════════════════════════════╝   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  Breakdown by KPI Type:                                      │
│  ┌──────────────┬──────────────┬──────────────┐            │
│  │ KPI Impact   │ KPI Output   │ KAI          │            │
│  │ 103.3%       │ 101.8%       │ 105.7%       │            │
│  │ 🟢 20%       │ 🟢 50%       │ 🟢 30%       │            │
│  └──────────────┴──────────────┴──────────────┘            │
│                                                               │
│  KPI Status Summary:                                         │
│  🟢 On Track: 13  🔴 Behind: 1  ⚪ Pending: 0                │
│                                                               │
│  ⚠️ Alerts:                                                   │
│  • OUT-SUP-003 was Behind in Feb (Recovered in Mar) ✅       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Position Switcher UI Mock

```jsx
┌────────────────────────────────────────────────────┐
│ My Performance                                     │
│ ┌────────────────────────────────────────────────┐ │
│ │ 📍 Position Switcher:                          │ │
│ │ ▼ [Customer Service Supervisor] 📍 Definitif   │ │  ← Active
│ │   • Customer Relation Consultant 🔄            │ │  ← Secondary
│ │     15 Jan 2026 - 28 Feb 2026                  │ │
│ └────────────────────────────────────────────────┘ │
│                                                    │
│ Performance Overview - Q1 2026                     │
│ ┌──────────────────────┬──────────────────────┐   │
│ │ Definitif Position   │ Secondary Position   │   │
│ ├──────────────────────┼──────────────────────┤   │
│ │ KPI Impact: 20%      │ KPI Impact: 10%      │   │
│ │ KPI Output: 50%      │ KPI Output: 30%      │   │
│ │ KAI: 30%             │ KAI: 60%             │   │
│ │                      │                      │   │
│ │ Current: 103.28%     │ Current: 102.09%     │   │
│ │ Status: On Track ✅  │ Status: On Track ✅  │   │
│ └──────────────────────┴──────────────────────┘   │
└────────────────────────────────────────────────────┘
```

---

## Scoring Proporsional Example (Q1 2026)

<aside>
📊

**Skenario Multi-Position Scoring:**

Siti memiliki 2 posisi di Q1 2026 dengan threshold tanggal 15:

- **1-14 Jan:** Posisi Definitif saja (Supervisor)
- **15 Jan - 28 Feb:** Posisi Definitif + Secondary (Supervisor + Customer Relation Consultant)
- **1-31 Mar:** Posisi Definitif saja (Supervisor)

Scoring dihitung proporsional berdasarkan durasi di masing-masing posisi.

</aside>

### Perhitungan Januari 2026

**Distribusi:**

- Tanggal 15 Jan → Secondary assignment mulai
- 15 ≥ 15 → Januari penuh menjadi tanggung jawab **Posisi Baru** (Secondary)

**Note:** Untuk bulan pertama secondary assignment, scoring menggunakan bobot posisi secondary untuk seluruh bulan Januari.

| Position | Achievement Jan | Bobot Configuration | Score | Responsibility |
| --- | --- | --- | --- | --- |
| Definitif (Supervisor) | 103.28% | Impact 20% + Output 50% + KAI 30% | - | Tidak dihitung (Jan full secondary) |
| Secondary (Customer Relation Consultant) | 102.09% | Impact 10% + Output 30% + KAI 60% | 102.09% | Full month |
| **Score Januari** |  |  | **102.09%** |  |

### Scoring Multi-Position Summary

| Bulan | Posisi Aktif | Scoring Basis | Achievement |
| --- | --- | --- | --- |
| Januari | Definitif + Secondary (dari tgl 15) | Secondary (threshold ≥ 15) | 102.09% |
| Februari | Definitif + Secondary | Proporsional keduanya | TBD |
| Maret | Definitif only (secondary ends 28 Feb) | Definitif only | 103.28% |