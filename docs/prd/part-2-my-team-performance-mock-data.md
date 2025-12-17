<aside>
📌

**Konteks Mock Data:**

- **User Aktif:** Siti Nurhaliza
- **Posisi:** Customer Service Supervisor (Definitif)
- **Timeline View:** April 2026 (monitoring Q1 2026)
</aside>

---

## Profil Atasan (User Aktif)

| Atribut | Value |
| --- | --- |
| **NIPP** | 12345678 |
| **Nama** | Siti Nurhaliza |
| **Posisi Aktif** | Customer Service Supervisor |
| **Position Master Variant ID** | PMV-CS-SUP-005 |
| **Kohort** | BOD-3 (Supervisor) |
| **Kelas Jabatan** | 8 |
| **Organisasi** | Dept. Customer Service - Terminal Nilam |
| **Atasan Langsung** | Bambang Setiawan (Manager CS) |
| **Jumlah Bawahan Langsung** | 3 orang |

---

## Daftar Bawahan Langsung

| No | NIPP | Nama | Posisi | Position Master Variant ID | Kohort | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 12345682 | Ahmad Rizki | CS Officer | PMV-CS-001 | BOD-4 | Aktif |
| 2 | 12345683 | Ratna Dewi | CS Officer | PMV-CS-001 | BOD-4 | Aktif |
| 3 | 12345684 | Eko Prasetyo | CS Officer | PMV-CS-001 | BOD-4 | Aktif |

### Konfigurasi Bobot per Bawahan (BOD-4 - Officer)

| Jenis KPI | Bobot Jenis |
| --- | --- |
| KPI Impact | 10% |
| KPI Output | 30% |
| KAI | 60% |
| **Total** | **100%** |

---

## Planning Phase - KPI Allocation & Cascading

<aside>
🌳

**Dua Jalur KPI Planning:**

1. **Allocation from Performance Tree:** Item KPI dari master posisi di-allocate ke incumbent
2. **Cascading from Atasan (Siti):** KPI Output Siti di-cascade ke bawahan
</aside>

### Unallocated KPI dari Performance Tree

| Item KPI | Type | Master Position | Target (Template) | Incumbents | Status |
| --- | --- | --- | --- | --- | --- |
| Customer Complaint Resolution Rate | 🎯 Output | CS Officer (PMV-CS-001) | ≥ 95% | 3 incumbents | ✅ Allocated |
| First Call Resolution | 🎯 Output | CS Officer (PMV-CS-001) | ≥ 85% | 3 incumbents | ✅ Allocated |
| Daily Customer Feedback Score | 📋 KAI | CS Officer (PMV-CS-001) | ≥ 4.5 | 3 incumbents | ✅ Allocated |
| Response Time ≤ 5 min | 📋 KAI | CS Officer (PMV-CS-001) | ≥ 90% | 3 incumbents | ✅ Allocated |

---

### Cascaded KPI dari Siti Nurhaliza

<aside>
⬇️

**Cascading dari KPI Output Siti:**

KPI Output Siti di-cascade ke bawahan untuk mendukung pencapaian target tim. Data diselaraskan dengan struktur OUT-CS-001 dari My Performance.

</aside>

### Parent KPI: OUT-CS-001 - Customer Complaint Resolution Revenue

| Atribut Parent | Value |
| --- | --- |
| **KPI ID** | OUT-CS-001 |
| **Title** | Customer Complaint Resolution Revenue |
| **Owner** | Siti Nurhaliza |
| **Target** | 10,000,000,000 IDR/bulan |
| **Unit** | IDR |
| **Bobot** | 35% |
| **Cascade Method** | 🔗 **Direct Cascade** (SUM) |

<aside>
📊

**Struktur Target Parent:**

- Target Total: 10,000,000,000 IDR/bulan
- Realisasi Item Sendiri (Siti): 2,400,000,000 IDR
- Realisasi dari Children: 7,600,000,000 IDR (A + B + C)
</aside>

**Child KPI (Cascaded to Subordinates):**

| Child KPI ID | Title | Recipient | Target (IDR/bulan) | Role | Bobot (di Portfolio Bawahan) |
| --- | --- | --- | --- | --- | --- |
| OUT-CS-001-A | Revenue from Technical Resolution Services | Ahmad Rizki | 2,800,000,000 | Owner | 40% |
| OUT-CS-001-B | Revenue from Service Complaint Handling | Ratna Dewi | 2,400,000,000 | Owner | 40% |
| OUT-CS-001-C | Revenue from Escalation Resolution | Eko Prasetyo | 2,400,000,000 | Owner | 40% |

<aside>
💡

**Direct Cascade (SUM):** Realisasi child (OUT-CS-001-A, B, C) akan di-**SUM** ke realisasi parent (OUT-CS-001).

**Formula:** Parent Realisasi = Siti Own (2.4B) + Child A + Child B + Child C

</aside>

---

### Parent KPI: OUT-SUP-003 - SLA Compliance Rate

| Atribut Parent | Value |
| --- | --- |
| **KPI ID** | OUT-SUP-003 |
| **Title** | SLA Compliance Rate |
| **Owner** | Siti Nurhaliza |
| **Target** | ≥ 98% |
| **Bobot** | 25% |
| **Cascade Method** | 🔀 **Indirect Cascade** |

**Child KPI (Indirect - Independent Tracking):**

| Child KPI ID | Recipient | Target | Role | Bobot | Note |
| --- | --- | --- | --- | --- | --- |
| OUT-CS-SLA-A | Ahmad Rizki | ≥ 97% | Owner | 35% | Target berbeda dari parent |
| OUT-CS-SLA-B | Ratna Dewi | ≥ 97% | Owner | 35% | Independent tracking |
| OUT-CS-SLA-C | Eko Prasetyo | ≥ 96% | Owner | 35% | Target disesuaikan shift malam |

<aside>
💡

**Indirect Cascade:** Realisasi child TIDAK otomatis di-sum ke parent. Satuan boleh berbeda. Link hanya untuk traceability.

</aside>

---

### Cascaded KPI Review Status Tracker

| KPI Item | Recipient | Cascaded Date | Status | Notes |
| --- | --- | --- | --- | --- |
| Revenue Technical Resolution (Direct) | Ahmad Rizki | 16 Jan 2026 | 🟢 Accepted | - |
| Revenue Service Complaint (Direct) | Ratna Dewi | 16 Jan 2026 | 🟢 Accepted | - |
| Revenue Escalation Resolution (Direct) | Eko Prasetyo | 16 Jan 2026 | 🟢 Accepted | - |
| SLA Compliance (Indirect) | Ahmad Rizki | 17 Jan 2026 | 🟢 Accepted | - |
| SLA Compliance (Indirect) | Ratna Dewi | 17 Jan 2026 | 🔵 Revision Requested | "Mohon adjust target ke 96%, beban kerja shift siang lebih tinggi" |
| SLA Compliance (Indirect) | Eko Prasetyo | 17 Jan 2026 | 🟢 Accepted | - |

---

### KAI Drafted untuk Bawahan

<aside>
⚠️

**Aturan KAI Cascading:**

KAI hanya dapat di-link ke KPI Output **milik bawahan tersebut** (bukan KPI Output atasan). Siti men-draft KAI untuk bawahan dengan link ke KPI Output bawahan.

</aside>

**KAI Drafted by Siti untuk Ahmad Rizki:**

| KAI ID | Item | Link to KPI Output | Target | Frequency | Status |
| --- | --- | --- | --- | --- | --- |
| KAI-AR-001 | Daily Customer Feedback Score | OUT-CS-001-A (Revenue Technical) | ≥ 4.5 | Weekly | ✅ Approved |
| KAI-AR-002 | Response Time ≤ 5 min | OUT-CS-001-A (Revenue Technical) | ≥ 90% | Weekly | ✅ Approved |
| KAI-AR-003 | Ticket Handling Volume | OUT-CS-SLA-A (SLA Compliance) | ≥ 50/day | Weekly | ✅ Approved |

---

## Two-Stage Approval - Planning Phase

### Per-Item Approval History (Ahmad Rizki)

| Timestamp | Item | Type | Action | Actor | Notes |
| --- | --- | --- | --- | --- | --- |
| 16 Jan 09:00 | OUT-CS-001-A | KPI Output | 📤 Submitted | Ahmad Rizki | - |
| 16 Jan 14:00 | OUT-CS-001-A | KPI Output | ✅ Item Approved | Siti Nurhaliza | - |
| 17 Jan 09:30 | OUT-CS-SLA-A | KPI Output | 📤 Submitted | Ahmad Rizki | - |
| 17 Jan 11:00 | OUT-CS-SLA-A | KPI Output | ✅ Item Approved | Siti Nurhaliza | - |
| 18 Jan 10:00 | KAI-AR-001 | KAI | 📤 Submitted | Ahmad Rizki | - |
| 18 Jan 15:00 | KAI-AR-001 | KAI | ✅ Item Approved | Siti Nurhaliza | - |
| 19 Jan 09:00 | KAI-AR-002, KAI-AR-003 | KAI | 📤 Submitted | Ahmad Rizki | - |
| 19 Jan 14:00 | KAI-AR-002, KAI-AR-003 | KAI | ✅ Item Approved | Siti Nurhaliza | - |

### Final Portfolio Approval

| Member | KPI Output Items | Total Bobot Output | KAI Items | Total Bobot KAI | Final Status | Approval Date |
| --- | --- | --- | --- | --- | --- | --- |
| Ahmad Rizki | 3 items | 100% | 5 items | 100% | ✅ Portfolio Approved | 20 Jan 2026 |
| Ratna Dewi | 3 items | 100% | 5 items | 100% | ✅ Portfolio Approved | 21 Jan 2026 |
| Eko Prasetyo | 3 items | 100% | 5 items | 100% | ✅ Portfolio Approved | 21 Jan 2026 |

---

## Monitoring Phase - Q1 2026 (View: April 2026)

<aside>
📊

**Timeline Context:**

Data ini merepresentasikan state per **April 2026** untuk monitoring Q1 2026 (Januari-Maret). Siti mereview performance tim Q1 di awal April.

</aside>

---

### Team Dashboard Summary - April 2026

| Metric | Value |
| --- | --- |
| **Team Average Score Q1** | 101.5% |
| **Highest Score** | 104.2% (Ahmad Rizki) |
| **Lowest Score** | 97.8% (Eko Prasetyo) |
| **Pending Approvals** | 3 items (Realisasi Maret) |
| **At Risk Members** | 1 (Eko Prasetyo - Feb) |

### KPI Status Overview - Q1 2026

| Bawahan | 🟢 On Track | 🟡 Behind | 🔴 At Risk | Total Score Q1 |
| --- | --- | --- | --- | --- |
| Ahmad Rizki | 12 | 2 | 0 | 104.2% |
| Ratna Dewi | 10 | 3 | 1 | 102.5% |
| Eko Prasetyo | 8 | 4 | 2 | 97.8% |

---

## Individual Performance - Detail per Bawahan

### Member 1: Ahmad Rizki

<aside>
👤

**Status:** 🟢 On Track | **Score Q1:** 104.2%

</aside>

### KPI Portfolio

| KPI ID | Item | Type | Target | Unit | Q1 Achievement | Status | Cascade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| OUT-CS-001-A | Revenue from Technical Resolution Services | 🎯 Output | 2,800,000,000 | IDR | 2,940,000,000 | 🟢 On Track | 🔗 Direct from OUT-CS-001 |
| OUT-CS-SLA-A | SLA Compliance Rate | 🎯 Output | ≥ 97% | % | 98.2% | 🟢 On Track | 🔀 Indirect from OUT-SUP-003 |
| OUT-CS-FCR-A | First Call Resolution | 🎯 Output | ≥ 85% | % | 87% | 🟢 On Track | - |
| KAI-AR-001 | Daily Feedback Score | 📋 KAI | ≥ 4.5 | Score | 4.7 | 🟢 On Track | - |
| KAI-AR-002 | Response Time | 📋 KAI | ≥ 90% | % | 92% | 🟢 On Track | - |
| KAI-AR-003 | Ticket Volume | 📋 KAI | ≥ 50/day | Count | 55/day | 🟢 On Track | - |

### Realisasi Detail - OUT-CS-001-A (Direct Cascade - Revenue)

| Bulan | Target (IDR) | Realisasi (IDR) | Achievement | Status | Evidence | Approval |
| --- | --- | --- | --- | --- | --- | --- |
| Jan 2026 | 2,800,000,000 | 2,856,000,000 | 102.0% | 🟢 On Track | revenue_ahmad_jan.pdf | ✅ Approved |
| Feb 2026 | 2,800,000,000 | 2,940,000,000 | 105.0% | 🟢 On Track | revenue_ahmad_feb.pdf | ✅ Approved |
| Mar 2026 | 2,800,000,000 | 3,024,000,000 | 108.0% | 🟢 On Track | revenue_ahmad_mar.pdf | 🟡 Pending Review |

---

### Member 2: Ratna Dewi

<aside>
👤

**Status:** 🟢 On Track | **Score Q1:** 102.5%

</aside>

### KPI Portfolio

| KPI ID | Item | Type | Target | Unit | Q1 Achievement | Status | Cascade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| OUT-CS-001-B | Revenue from Service Complaint Handling | 🎯 Output | 2,400,000,000 | IDR | 2,472,000,000 | 🟢 On Track | 🔗 Direct from OUT-CS-001 |
| OUT-CS-SLA-B | SLA Compliance Rate | 🎯 Output | ≥ 96% | % | 97.5% | 🟢 On Track | 🔀 Indirect from OUT-SUP-003 |
| OUT-CS-FCR-B | First Call Resolution | 🎯 Output | ≥ 85% | % | 84% | 🟡 Behind | - |
| KAI-RD-001 | Daily Feedback Score | 📋 KAI | ≥ 4.5 | Score | 4.6 | 🟢 On Track | - |
| KAI-RD-002 | Response Time | 📋 KAI | ≥ 90% | % | 88% | 🟡 Behind | - |
| KAI-RD-003 | Ticket Volume | 📋 KAI | ≥ 50/day | Count | 52/day | 🟢 On Track | - |

### Realisasi Detail - OUT-CS-001-B (Direct Cascade - Revenue)

| Bulan | Target (IDR) | Realisasi (IDR) | Achievement | Status | Evidence | Approval |
| --- | --- | --- | --- | --- | --- | --- |
| Jan 2026 | 2,400,000,000 | 2,400,000,000 | 100.0% | 🟢 On Track | revenue_ratna_jan.pdf | ✅ Approved |
| Feb 2026 | 2,400,000,000 | 2,472,000,000 | 103.0% | 🟢 On Track | revenue_ratna_feb.pdf | ✅ Approved |
| Mar 2026 | 2,400,000,000 | 2,544,000,000 | 106.0% | 🟢 On Track | revenue_ratna_mar.pdf | 🟡 Pending Review |

---

### Member 3: Eko Prasetyo

<aside>
👤

**Status:** 🟡 At Risk | **Score Q1:** 97.8%

</aside>

### KPI Portfolio

| KPI ID | Item | Type | Target | Unit | Q1 Achievement | Status | Cascade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| OUT-CS-001-C | Revenue from Escalation Resolution | 🎯 Output | 2,400,000,000 | IDR | 2,256,000,000 | 🔴 At Risk | 🔗 Direct from OUT-CS-001 |
| OUT-CS-SLA-C | SLA Compliance Rate | 🎯 Output | ≥ 96% | % | 95.2% | 🟡 Behind | 🔀 Indirect from OUT-SUP-003 |
| OUT-CS-FCR-C | First Call Resolution | 🎯 Output | ≥ 85% | % | 82% | 🔴 At Risk | - |
| KAI-EP-001 | Daily Feedback Score | 📋 KAI | ≥ 4.5 | Score | 4.3 | 🟡 Behind | - |
| KAI-EP-002 | Response Time | 📋 KAI | ≥ 90% | % | 85% | 🔴 At Risk | - |
| KAI-EP-003 | Ticket Volume | 📋 KAI | ≥ 50/day | Count | 48/day | 🟡 Behind | - |

### Realisasi Detail - OUT-CS-001-C (Direct Cascade - Revenue)

| Bulan | Target (IDR) | Realisasi (IDR) | Achievement | Status | Evidence | Approval |
| --- | --- | --- | --- | --- | --- | --- |
| Jan 2026 | 2,400,000,000 | 2,280,000,000 | 95.0% | 🟡 Behind | revenue_eko_jan.pdf | ✅ Approved |
| Feb 2026 | 2,400,000,000 | 2,160,000,000 | 90.0% | 🔴 At Risk | revenue_eko_feb.pdf | ✅ Approved |
| Mar 2026 | 2,400,000,000 | 2,328,000,000 | 97.0% | 🟡 Behind | revenue_eko_mar.pdf | 🟡 Pending Review |

---

## Direct Cascade Aggregation - OUT-CS-001

<aside>
🔗

**Direct Cascade Calculation (SUM):**

Realisasi parent (OUT-CS-001 milik Siti) dihitung dari **SUM** seluruh komponen:

**Parent = Siti Own + Child A + Child B + Child C**

</aside>

### Struktur Target dan Realisasi

| Komponen | Owner | Target (IDR/bulan) | Kontribusi ke Parent |
| --- | --- | --- | --- |
| Siti Own | Siti Nurhaliza | 2,400,000,000 | 24% |
| OUT-CS-001-A | Ahmad Rizki | 2,800,000,000 | 28% |
| OUT-CS-001-B | Ratna Dewi | 2,400,000,000 | 24% |
| OUT-CS-001-C | Eko Prasetyo | 2,400,000,000 | 24% |
| **Total Parent** | **OUT-CS-001** | **10,000,000,000** | **100%** |

### Agregasi ke Parent KPI Siti (OUT-CS-001: Customer Complaint Resolution Revenue)

| Bulan | Siti Own (IDR) | Ahmad A (IDR) | Ratna B (IDR) | Eko C (IDR) | **Total Parent (IDR)** | Target | Achievement | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Jan 2026 | 2,520,000,000 | 2,856,000,000 | 2,400,000,000 | 2,280,000,000 | **10,056,000,000** | 10,000,000,000 | 100.6% | 🟢 On Track |
| Feb 2026 | 2,640,000,000 | 2,940,000,000 | 2,472,000,000 | 2,160,000,000 | **10,212,000,000** | 10,000,000,000 | 102.1% | 🟢 On Track |
| Mar 2026 | 2,760,000,000 | 3,024,000,000 | 2,544,000,000 | 2,328,000,000 | **10,656,000,000** | 10,000,000,000 | 106.6% | 🟢 On Track |
| **Q1 Avg** | **2,640,000,000** | **2,940,000,000** | **2,472,000,000** | **2,256,000,000** | **10,308,000,000** |  | **103.1%** |  |

<aside>
💡

**Insight:**

- Meskipun Eko consistently below target (avg 94%), agregasi tim tetap **On Track** karena Siti (110%), Ahmad (105%), dan Ratna (103%) mengkompensasi.
- Total Q1: 10.3B IDR dari target 10B IDR (103.1% achievement)
</aside>

### Kontribusi per Member - Q1 2026

| Member | Target Q1 (IDR) | Realisasi Q1 (IDR) | Achievement | Kontribusi Aktual |
| --- | --- | --- | --- | --- |
| Siti Nurhaliza (Own) | 7,200,000,000 | 7,920,000,000 | 110.0% | 25.6% |
| Ahmad Rizki (A) | 8,400,000,000 | 8,820,000,000 | 105.0% | 28.5% |
| Ratna Dewi (B) | 7,200,000,000 | 7,416,000,000 | 103.0% | 24.0% |
| Eko Prasetyo (C) | 7,200,000,000 | 6,768,000,000 | 94.0% | 21.9% |
| **Total** | **30,000,000,000** | **30,924,000,000** | **103.1%** | **100%** |

---

## Approval Queue - April 2026

### Pending Approvals (Realisasi Maret 2026)

| No | Member | Type | Item | Submitted | Deadline | Evidence | Action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Ahmad Rizki | 🎯 Output | Revenue Technical Resolution - Mar | 5 Apr | 10 Apr | 📎 revenue_ahmad_mar.pdf | Review |
| 2 | Ratna Dewi | 🎯 Output | Revenue Service Complaint - Mar | 5 Apr | 10 Apr | 📎 revenue_ratna_mar.pdf | Review |
| 3 | Eko Prasetyo | 🎯 Output | Revenue Escalation Resolution - Mar | 6 Apr | 10 Apr | 📎 revenue_eko_mar.pdf | Review |

### Recent Approvals (Feb-Mar 2026)

| No | Member | Type | Item | Decision | Date | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Ahmad Rizki | 🎯 Output | Revenue Technical - Feb | ✅ Approved | 8 Mar | - |
| 2 | Ratna Dewi | 🎯 Output | Revenue Service Complaint - Feb | ✅ Approved | 8 Mar | - |
| 3 | Eko Prasetyo | 🎯 Output | Revenue Escalation - Feb | ✅ Approved | 9 Mar | At Risk alert sent |
| 4 | Ahmad Rizki | 📋 KAI | Daily Feedback - W8-W12 | ✅ Bulk Approved | 28 Mar | - |
| 5 | Ratna Dewi | 📋 KAI | Response Time - Feb | ⚙️ Adjust & Approve | 10 Mar | Adjusted 86% → 88% (data correction) |
| 6 | Eko Prasetyo | 📋 KAI | Ticket Volume - W6 | ❌ Rejected | 15 Feb | "Evidence screenshot tidak clear, mohon upload ulang" |

---

## Approval Action Samples

### Sample 1: Approve dengan Review Evidence (Revenue-based)

```jsx
Member: Ahmad Rizki
Item: OUT-CS-001-A - Revenue from Technical Resolution (Mar 2026)
Submitted Value: 3,024,000,000 IDR
Evidence: revenue_ahmad_mar.pdf
Evidence Preview: ✅ Valid - Invoice summary dari Finance system tanggal 1-31 Mar 2026

Action: APPROVE
Notes: -
Result: Status → Approved
        Parent KPI (OUT-CS-001) → Recalculated
        New Parent Total Mar: 10,656,000,000 IDR (106.6%)
```

### Sample 2: Reject karena At Risk (Revenue)

```jsx
Member: Eko Prasetyo
Item: OUT-CS-001-C - Revenue from Escalation Resolution (Feb 2026)
Submitted Value: 2,160,000,000 IDR
Evidence: revenue_eko_feb.xlsx
Target: 2,400,000,000 IDR
Achievement: 90.0% (below target)
Status: 🔴 At Risk

Action: REJECT
Comment: "Realisasi 2.16B dari target 2.4B (90%). Mohon:
         1. Breakdown revenue per kategori eskalasi
         2. Analisis penyebab shortfall 240M
         3. Action plan untuk recovery
         4. Submit ulang dengan lampiran analisis"
Result: Status → Rejected - Awaiting Revision
```

### Sample 3: Request Clarification pada At Risk Member

```jsx
Member: Eko Prasetyo
Item: OUT-CS-001-C - Revenue Escalation Resolution (Feb 2026)
Submitted Value: 2,160,000,000 IDR (90% of target)
Evidence: revenue_eko_feb.pdf
Status: 🔴 At Risk (below 2.4B target)

Action: REQUEST CLARIFICATION
Question: "Realisasi 2.16B di bawah target 2.4B untuk bulan kedua berturut-turut. 
          Mohon jelaskan:
          1. Breakdown revenue per kategori (technical/service/escalation)?
          2. Apakah ada kendala dari volume eskalasi atau pricing?
          3. Action plan untuk mencapai target di Maret?"
Result: Status → Pending Clarification
```

### Sample 4: Adjust & Approve (Revenue Correction)

```jsx
Member: Ratna Dewi
Item: OUT-CS-001-B - Revenue Service Complaint (Feb 2026)
Submitted Value: 2,400,000,000 IDR
Evidence: revenue_ratna_feb.xlsx
Cross-check: Finance system menunjukkan 2,472,000,000 IDR (termasuk late invoice)

Action: ADJUST & APPROVE
Original Value: 2,400,000,000 IDR
Adjusted Value: 2,472,000,000 IDR
Justification: "Setelah cross-check dengan Finance, ada 3 invoice 
               yang masuk di akhir Feb tidak tercatat. Total adjusted."
Result: Status → Approved (Adjusted)
        Achievement: 100% → 103% (recalculated)
```

### Sample 5: Bulk Approve KAI

```jsx
Action: BULK APPROVE
Selected Items: 12 KAI Weekly items (W8-W12)
Members: Ahmad Rizki (4), Ratna Dewi (4), Eko Prasetyo (4)

Pre-check:
✅ All items have valid submissions
✅ Evidence available (KAI - optional)
✅ No At Risk items in selection

Confirmation Modal:
"Anda akan approve 12 KAI items sekaligus:
- Ahmad Rizki: 4 items
- Ratna Dewi: 4 items  
- Eko Prasetyo: 4 items

Lanjutkan?"

Result: 12 items → Approved
        Scores recalculated for all members
        Batch notification sent
```

---

## Alert & Notification - Q1 2026

| Tanggal | Event | Member | KPI | Alert Type | Action Taken |
| --- | --- | --- | --- | --- | --- |
| 9 Feb 2026 | Revenue ≤ 95% | Eko Prasetyo | OUT-CS-001-C | 🟡 In-App | Siti review member detail |
| 9 Mar 2026 | Revenue ≤ 90% | Eko Prasetyo | OUT-CS-001-C | 🔴 Email + In-App | Siti schedule coaching |
| 10 Mar 2026 | Coaching Session | Eko Prasetyo | - | 📝 Internal Note | Action plan dibuat |
| 15 Mar 2026 | KAI Rejected | Eko Prasetyo | KAI-EP-003 | 🟡 In-App | Re-submission requested |
| 2 Apr 2026 | H-3 Reminder | All Members | All Output | 🔔 In-App + Email | Deadline 5 Apr |
| 4 Apr 2026 | H-1 Reminder | All Members | All Output | 🔔 In-App + Email | Final reminder |

---

## Team Calendar - April 2026

| Tanggal | Event Type | Event | Members | Status | Color |
| --- | --- | --- | --- | --- | --- |
| 2 Apr | Reminder | 🔔 H-3 Deadline input realisasi Maret | All | ✅ Sent | 🟩 Green |
| 4 Apr | Reminder | 🔔 H-1 Deadline input realisasi Maret | All | ✅ Sent | 🟩 Green |
| 5 Apr | Deadline | ⚠️ Deadline input realisasi Maret 2026 | All | ✅ All Submitted | 🟨 Yellow |
| 10 Apr | Deadline | ⚠️ Deadline approval realisasi Maret | Siti (Atasan) | ⏳ Pending | 🟨 Yellow |
| 10 Apr | Auto-Approve | 🔄 Auto-approve trigger jika tidak di-review | - | ⏳ Scheduled | 🟦 Blue |
| 15 Apr | P-KPI Sync | 📊 Sinkronisasi data KPI Impact Q1 | All | ⏳ Scheduled | 🟦 Blue |

---

## Key Insights - Q1 2026

### 1. Direct Cascade Impact (Revenue-based)

| Aspect | Observation |
| --- | --- |
| **Parent KPI Status** | OUT-CS-001 tetap On Track (10.3B avg dari target 10B = 103.1%) |
| **Compensation Effect** | Siti (110%), Ahmad (105%), Ratna (103%) mengkompensasi Eko (94%) |
| **Alert Trigger** | Siti menerima alert untuk Eko, bukan untuk tim keseluruhan |
| **Revenue Shortfall** | Eko shortfall ~432M IDR per Q1, terkompensasi 924M surplus dari tim |

### 2. At Risk Member Analysis (Eko Prasetyo)

| KPI | Jan (IDR) | Feb (IDR) | Mar (IDR) | Trend |
| --- | --- | --- | --- | --- |
| Revenue Escalation | 2,280,000,000 (95%) | 2,160,000,000 (90%) | 2,328,000,000 (97%) | 📈 Recovery |
| SLA Compliance | 96% | 94% | 95.5% | 📈 Recovery |
| Response Time KAI | 88% | 82% | 85% | 📈 Recovery |

<aside>
✅

**Action Outcome:** Setelah coaching session tanggal 10 Mar, Eko menunjukkan tren recovery di bulan Maret (+168M dari Feb). Action plan mencakup: additional training on escalation handling, workload rebalancing, dan peer mentoring dari Ahmad untuk revenue optimization.

</aside>

### 3. Approval Efficiency

| Metric | Q1 2026 |
| --- | --- |
| Total Items Submitted | 45 items |
| Approved | 38 (84%) |
| Adjusted & Approved | 3 (7%) |
| Rejected (re-submitted) | 2 (4%) |
| Pending | 3 (5%) |
| Avg Approval Time | 2.3 days |

---

## Dashboard Summary View - April 2026

```jsx
┌─────────────────────────────────────────────────────────────┐
│ My Team Performance - Q1 2026              Siti Nurhaliza   │
│ 📍 Position: Customer Service Supervisor              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Team Performance Summary                             │  │
│  │  ╔════════════════════════════════════════════════╗   │  │
│  │  ║     Team Average: 101.5%                       ║   │  │
│  │  ║     🟢 On Track                                ║   │  │
│  │  ╚════════════════════════════════════════════════╝   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Team Members:                                              │
│  ┌──────────────┬──────────────┬──────────────┐            │
│  │ Ahmad Rizki  │ Ratna Dewi   │ Eko Prasetyo │            │
│  │ 104.2%       │ 102.5%       │ 97.8%        │            │
│  │ 🟢 On Track  │ 🟢 On Track  │ 🟡 At Risk   │            │
│  └──────────────┴──────────────┴──────────────┘            │
│                                                             │
│  Action Required:                                           │
│  🔔 3 Pending Approvals (Realisasi Maret)                   │
│  ⚠️ 1 Member At Risk (Eko Prasetyo)                         │
│                                                             │
│  Cascaded KPI Status (OUT-CS-001 - Revenue):                │
│  Parent Q1 Avg: 10.3B IDR | Target: 10B IDR | 🟢 On Track   │
│  └─ Siti: 2.64B ✅ | Ahmad: 2.94B ✅ |                       │
│     Ratna: 2.47B ✅ | Eko: 2.26B ⚠️                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```