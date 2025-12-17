# Part 2: My Team Performance

## 2.1 Deskripsi Modul

**My Team Performance** adalah modul untuk atasan dalam mengelola dan memonitor kinerja bawahan langsung.

| Aspek | Keterangan |
| --- | --- |
| **Target User** | Pekerja dengan bawahan langsung (struktural) |
| **Access Level** | Hierarchical (bawahan langsung berdasarkan MDM) |
| **Primary Actions** | View Team, Approve/Reject, Cascade KPI, Assign Owner/Collaborator |

---

## 2.2 Epic Overview

**Cakupan User Stories (Diurutkan berdasarkan Use Case):**

**Use Case 1: Team Monitoring & Dashboard**

| **Story ID** | **Summary** | **BRD Ref** |
| --- | --- | --- |
| US-MT-001 | View Team Dashboard | BR-027 |
| US-MT-002 | View Member Performance Detail | BR-027 |
| US-MT-018 | View Team KPI Status Overview | BR-027 |
| US-MT-019 | Receive At Risk Alert for Team | BR-027, BR-030 |
| US-MT-021 | Export Team Performance Report | BR-027 |

**Use Case 2: KPI Allocation dari Performance Tree**

| **Story ID** | **Summary** | **BRD Ref** |
| --- | --- | --- |
| US-MT-022 | View Unallocated KPI from Performance Tree | BR-004, BR-009 |
| US-MT-023 | Allocate KPI from Performance Tree to Team Members | BR-004, BR-008, BR-009 |
| US-MT-014 | Assign Owner untuk KPI | BR-008 |
| US-MT-015 | Assign Shared Owner untuk KPI (Vertical Support) | BR-008, BR-010 |
| US-MT-016 | Handle Same Position Allocation | BR-008 |

**Use Case 3: KPI Cascading dari Atasan**

| **Story ID** | **Summary** | **BRD Ref** |
| --- | --- | --- |
| US-MT-011 | Cascade KPI Output dari Atasan (Free Draft atau dari Kamus) | BR-004, BR-009, BR-022 |
| US-MT-012 | Cascade KPI ke Bawahan (Direct) | BR-005, BR-006 |
| US-MT-013 | Cascade KPI ke Bawahan (Indirect) | BR-005 |
| US-MT-024 | Draft KAI untuk Bawahan dari KPI Output Bawahan | BR-017 |
| US-MT-025 | Monitor Cascaded KPI Review Status | BR-014 |

**Use Case 4: KPI Planning Approval (Two-Stage)**

| **Story ID** | **Summary** | **BRD Ref** |
| --- | --- | --- |
| US-MT-003 | Approve KPI Item (Per-Item) | BR-012, BR-014 |
| US-MT-004 | Reject KPI Item dengan Catatan | BR-014, BR-015 |
| US-MT-005 | Request Clarification KPI | BR-014 |
| US-MT-006 | Approve Final KPI Portfolio | BR-012 |
| US-MT-007 | Reject Final KPI Portfolio | BR-012, BR-015 |

**Use Case 5: Realisasi Approval & Review**

| **Story ID** | **Summary** | **BRD Ref** |
| --- | --- | --- |
| US-MT-008 | Approve Realisasi Bawahan | BR-013, BR-014 |
| US-MT-009 | Reject Realisasi dengan Catatan | BR-014, BR-015 |
| US-MT-010 | Adjust dan Approve Realisasi | BR-014 |
| US-MT-020 | Bulk Approve Realisasi | BR-014 |

**Use Case 6: Multi-Position & Dynamic Team Management**

| **Story ID** | **Summary** | **BRD Ref** |
| --- | --- | --- |
| US-MT-026 | View Team Members Across Multiple Positions | BR-027, BR-029 |
| US-MT-027 | Handle Mutasi Masuk - Auto Re-planning Trigger | BR-016 |

**Use Case 7: Team Calendar & Detail Panel**

| **Story ID** | **Summary** | **BRD Ref** |
| --- | --- | --- |
| US-MT-028 | View Team Calendar & Deadline Tracking | BR-030 |
| US-MT-017a | View Member KPI Detail Panel - Basic Info | BR-004, BR-009, BR-027 |
| US-MT-017b | View Member KPI Detail Panel - Ownership Info | BR-008, BR-010, BR-027 |
| US-MT-017c | View Member KPI Detail Panel - Cascading Hierarchy | BR-005, BR-006, BR-027 |
| US-MT-017d | View Member KPI Detail Panel - Realization Progress | BR-013, BR-027 |
| US-MT-017e | View Member KPI Detail Panel - Evidence & Attachments | BR-013, BR-027 |
| US-MT-017f | View Member KPI Detail Panel - Approval History | BR-014, BR-015, BR-027 |

---

## 2.3 User Stories Detail

### US-MT-001: View Team Dashboard

**User Story:**

**As a** Atasan

**I want to** melihat dashboard performa seluruh bawahan langsung saya

**So that** saya dapat memonitor kinerja tim secara keseluruhan

**Acceptance Criteria (Gherkin):**

- **Given** saya login sebagai Pekerja dengan bawahan langsung
- **When** saya membuka menu "My Team Performance"
- **Then** saya melihat daftar bawahan langsung dengan foto dan nama
- **And** saya melihat current score setiap bawahan
- **And** saya melihat summary cards (Average Score, Pending Approval, At Risk)
- **And** saya melihat badge jumlah pending items yang perlu di-review

**Validation Rules:**

- **UI Rules:**
    - Daftar bawahan diurutkan berdasarkan nama (A-Z) by default
    - Summary cards clickable untuk filter daftar
    - Color coding score: Hijau (≥100%), Kuning (80-99%), Merah (<80%)
    - Badge pending items berwarna merah jika > 0
- **Business Rules:**
    - Hanya tampilkan bawahan langsung (1 level) berdasarkan struktur MDM
    - Tidak dapat melihat bawahan dari bawahan (tidak recursive)
    - Jika tidak memiliki bawahan, tampilkan empty state
- **Data Rules:**
    - Data bawahan diambil dari MDM berdasarkan atasan langsung
    - Score dihitung real-time dari realisasi yang sudah di-approve
- **Edge Cases:**
    - Jika bawahan baru ditambahkan, otomatis muncul di daftar setelah sync MDM
    - Jika bawahan dimutasi, otomatis hilang dari daftar

---

### US-MT-002: View Member Performance Detail

**User Story:**

**As a** Atasan

**I want to** melihat detail performa individual bawahan

**So that** saya dapat memahami pencapaian dan area perbaikan bawahan

**Acceptance Criteria (Gherkin):**

- **Given** saya berada di Team Dashboard
- **When** saya klik salah satu member di daftar
- **Then** saya melihat halaman detail performa bawahan tersebut
- **And** saya melihat informasi pekerja (nama, NIPP, posisi, kohort)
- **And** saya melihat current score dengan breakdown per jenis KPI
- **And** saya melihat daftar KPI dengan achievement masing-masing
- **And** saya melihat pending items yang perlu di-approve (jika ada)

**Validation Rules:**

- **UI Rules:**
    - Layout serupa dengan My Performance (konsistensi UX)
    - Semua data dalam mode read-only (tidak bisa edit langsung)
    - Tombol "Approve" dan "Reject" hanya muncul jika ada pending items
    - Trend chart menampilkan achievement historis
- **Business Rules:**
    - Atasan hanya bisa view, tidak bisa input realisasi atas nama bawahan
    - Pending items mencakup: KPI Planning, Realisasi KPI Output, Realisasi KAI
- **Data Rules:**
    - Employee info dari MDM
    - Position dari tb_position_master_v2
    - Score dari Performance Tree bawahan
- **Edge Cases:**
    - Jika bawahan belum memiliki KPI, tampilkan empty state dengan CTA "Draft KPI"

---

### US-MT-003: Approve KPI Item (Per-Item)

**User Story:**

**As a** Atasan

**I want to** meng-approve individual KPI item yang di-submit bawahan

**So that** item KPI tersebut dapat ditambahkan ke portfolio bawahan

<aside>
ℹ️

**Two-Stage Approval Process:**

KPI Planning menggunakan dua tahap approval:

1. **Per-Item Approval** (US-MT-003, US-MT-004) - Approve/reject setiap item KPI individual
2. **Final Portfolio Approval** (US-MT-006, US-MT-007) - Finalisasi keseluruhan portfolio (hanya ketika total bobot = 100%)
</aside>

**Acceptance Criteria (Gherkin):**

- **Given** bawahan saya submit KPI item dengan status "Pending Approval"
- **When** saya membuka detail submission tersebut
- **Then** saya melihat detail KPI item: Title, Description, Target, Bobot, dll
- **And** saya melihat indicator ini adalah approval per-item (bukan final)
- **When** saya klik tombol "Approve Item"
- **Then** status KPI item berubah menjadi "Item Approved"
- **And** notifikasi terkirim ke bawahan
- **And** item ditambahkan ke draft portfolio bawahan
- **And** bawahan dapat melanjutkan menambah item lain

**Validation Rules:**

- **UI Rules:**
    - Tombol "Approve Item" berwarna hijau
    - Badge "Per-Item Approval" untuk membedakan dari Final Approval
    - Progress indicator: "3/5 items approved" atau "Total bobot: 75%"
    - Konfirmasi modal sebelum approve (opsional, configurable)
    - Success toast setelah berhasil
- **Business Rules:**
    - Approve per-item tidak memerlukan bobot total = 100%
    - Item yang sudah approved tidak dapat di-edit oleh bawahan
    - Timestamp approval di-log untuk audit trail
    - Item approved masuk ke status "Item Approved", bukan "Active"
- **Technical Rules:**
    - Status change di-persist ke database
    - Notifikasi via in-app dan email
- **Edge Cases:**
    - Jika bawahan ingin mengubah item yang sudah approved, perlu request revisi ke atasan

---

### US-MT-004: Reject KPI Item dengan Catatan

**User Story:**

**As a** Atasan

**I want to** me-reject individual KPI item yang tidak sesuai

**So that** bawahan dapat memperbaiki item tersebut dan submit ulang

**Acceptance Criteria (Gherkin):**

- **Given** bawahan saya submit KPI item dengan status "Pending Approval"
- **When** saya membuka detail submission tersebut
- **And** saya klik tombol "Reject Item"
- **Then** sistem menampilkan form untuk catatan penolakan
- **And** saya WAJIB mengisi catatan penolakan (minimal 20 karakter)
- **When** saya submit rejection
- **Then** status KPI item berubah menjadi "Item Rejected"
- **And** catatan penolakan tersimpan dan ditampilkan ke bawahan
- **And** notifikasi terkirim ke bawahan
- **And** bawahan dapat edit item dan submit ulang

**Validation Rules:**

- **UI Rules:**
    - Tombol "Reject" berwarna merah
    - Form catatan dengan textarea (min 20 chars, max 500 chars)
    - Character counter ditampilkan
    - Tombol "Submit" disabled jika catatan kurang dari 20 karakter
- **Business Rules:**
    - Reject WAJIB disertai catatan penolakan (BR-015)
    - Setelah reject, bawahan dapat edit item tersebut dan submit ulang
    - Setelah reject, bawahan dapat edit dan submit ulang
    - Rejection history di-log untuk audit trail
- **Data Rules:**
    - Catatan minimal 20 karakter
    - Catatan maksimal 500 karakter
- **Edge Cases:**
    - Jika reject tanpa catatan, sistem block dengan error message

---

### US-MT-005: Request Clarification KPI

**User Story:**

**As a** Atasan

**I want to** meminta klarifikasi sebelum approve/reject KPI

**So that** saya mendapat informasi tambahan untuk keputusan

**Acceptance Criteria (Gherkin):**

- **Given** bawahan saya submit KPI dengan status "Pending Approval"
- **When** saya klik tombol "Request Clarification"
- **Then** sistem menampilkan form untuk pertanyaan klarifikasi
- **And** saya WAJIB mengisi pertanyaan (minimal 10 karakter)
- **When** saya submit request
- **Then** status KPI berubah menjadi "Pending Clarification"
- **And** notifikasi terkirim ke bawahan dengan pertanyaan saya
- **And** bawahan dapat membalas clarification

**Validation Rules:**

- **UI Rules:**
    - Tombol "Request Clarification" berwarna kuning/orange
    - Form dengan textarea untuk pertanyaan
    - Thread discussion untuk multiple clarification rounds
- **Business Rules:**
    - Request clarification tidak mengubah deadline auto-approve
    - Bawahan dapat membalas atau langsung edit dan submit ulang
    - History clarification tersimpan di audit log
- **Data Rules:**
    - Pertanyaan minimal 10 karakter
- **Edge Cases:**
    - Jika tidak ada response hingga deadline, sistem tetap auto-approve

---

### US-MT-006: Approve Final KPI Portfolio

**User Story:**

**As a** Atasan

**I want to** melakukan final approval pada keseluruhan KPI portfolio bawahan

**So that** portfolio KPI menjadi aktif dan dapat digunakan untuk monitoring periode berjalan

<aside>
⚠️

**Prerequisite:** Final approval hanya dapat dilakukan ketika:

- Total bobot KPI Output = 100%
- Total bobot KAI = 100%
- Semua item sudah berstatus "Item Approved"
</aside>

**Acceptance Criteria (Gherkin):**

- **Given** bawahan saya submit "Finalize KPI Portfolio" request
- **And** total bobot KPI Output = 100%
- **And** total bobot KAI = 100%
- **And** semua item berstatus "Item Approved"
- **When** saya membuka detail submission tersebut
- **Then** saya melihat summary keseluruhan portfolio:
    - Daftar semua KPI Output dengan bobot masing-masing
    - Daftar semua KAI dengan bobot masing-masing
    - Total bobot per jenis (harus 100%)
- **And** saya dapat klik tombol "Approve Portfolio"
- **When** saya klik "Approve Portfolio"
- **Then** status seluruh KPI berubah menjadi "Active"
- **And** notifikasi terkirim ke bawahan
- **And** KPI muncul di Performance Tree untuk monitoring
- **And** periode monitoring dimulai

**Validation Rules:**

- **UI Rules:**
    - Tombol "Approve Portfolio" berwarna hijau dengan icon ✅
    - Summary card menampilkan total items dan total bobot
    - Checklist visual: ✅ KPI Output 100% | ✅ KAI 100% | ✅ All items approved
    - Tombol disabled jika prerequisite belum terpenuhi dengan tooltip alasan
    - Konfirmasi modal: "Setelah approve, KPI tidak dapat diubah untuk periode ini"
- **Business Rules:**
    - Final approval WAJIB memenuhi semua prerequisite
    - Setelah final approval, portfolio LOCKED untuk periode tersebut
    - Perubahan hanya dapat dilakukan via Change Request ke Performance Admin
    - Timestamp final approval di-log untuk audit trail
- **Technical Rules:**
    - Batch update status semua item dari "Item Approved" ke "Active"
    - Trigger Performance Tree generation
    - Notifikasi via in-app dan email
- **Edge Cases:**
    - Jika ada item dengan status selain "Item Approved", block final approval
    - Jika periode planning sudah berakhir, tampilkan warning tetapi tetap bisa approve

**Portfolio Summary Display:**

| **Komponen** | **Items** | **Total Bobot** | **Status** |
| --- | --- | --- | --- |
| KPI Output | 5 items | 100% | ✅ Valid |
| Specific KAI | 3 items | 70% | ⏳ Pending (Common KAI auto-assign) |
| Common KAI | 2 items | 30% | ✅ Auto-assigned |
| **Total KAI** | **5 items** | **100%** | **✅ Valid** |

---

### US-MT-007: Reject Final KPI Portfolio

**User Story:**

**As a** Atasan

**I want to** me-reject keseluruhan KPI portfolio bawahan

**So that** bawahan dapat melakukan revisi menyeluruh sebelum finalisasi

**Acceptance Criteria (Gherkin):**

- **Given** bawahan saya submit "Finalize KPI Portfolio" request
- **When** saya membuka detail submission tersebut
- **And** saya menemukan issue yang memerlukan revisi menyeluruh
- **And** saya klik tombol "Reject Portfolio"
- **Then** sistem menampilkan form untuk catatan penolakan
- **And** saya WAJIB mengisi catatan penolakan (minimal 20 karakter)
- **And** saya dapat memilih item mana saja yang perlu direvisi (opsional)
- **When** saya submit rejection
- **Then** status portfolio berubah menjadi "Portfolio Rejected"
- **And** item yang dipilih untuk revisi berubah status ke "Needs Revision"
- **And** catatan penolakan tersimpan dan ditampilkan ke bawahan
- **And** notifikasi terkirim ke bawahan

**Validation Rules:**

- **UI Rules:**
    - Tombol "Reject Portfolio" berwarna merah
    - Form catatan dengan textarea (min 20 chars, max 1000 chars)
    - Checkbox list untuk memilih item yang perlu direvisi
    - Character counter ditampilkan
- **Business Rules:**
    - Reject portfolio WAJIB disertai catatan penolakan (BR-015)
    - Item yang ditandai "Needs Revision" dapat di-edit oleh bawahan
    - Item yang tidak ditandai tetap "Item Approved"
    - Bawahan perlu submit ulang finalization setelah revisi
- **Data Rules:**
    - Catatan minimal 20 karakter
    - Catatan maksimal 1000 karakter
- **Edge Cases:**
    - Jika tidak ada item dipilih untuk revisi, semua item tetap "Item Approved"

---

### US-MT-008: Approve Realisasi Bawahan

**User Story:**

**As a** Atasan

**I want to** meng-approve realisasi KPI yang di-submit bawahan

**So that** pencapaian tercatat dan score ter-update

**Acceptance Criteria (Gherkin):**

- **Given** bawahan saya submit realisasi dengan status "Pending Review"
- **When** saya membuka detail submission tersebut
- **Then** saya melihat: KPI Title, Target, Actual Value, Achievement %, Evidence
- **And** saya dapat preview/download evidence
- **When** saya klik tombol "Approve"
- **Then** status realisasi berubah menjadi "Approved"
- **And** score bawahan ter-update di Performance Tree
- **And** notifikasi terkirim ke bawahan

**Validation Rules:**

- **UI Rules:**
    - Preview evidence langsung di modal (untuk image)
    - Download link untuk PDF
    - Tampilkan comparison: Target vs Actual vs Achievement
- **Business Rules:**
    - Approve tidak memerlukan input tambahan
    - Score dihitung otomatis setelah approve
    - Jika Direct Cascade, realisasi child otomatis sum ke parent
- **Technical Rules:**
    - Recalculate weighted score setelah approve
    - Update dashboard real-time
- **Edge Cases:**
    - Jika evidence tidak bisa dibuka, tampilkan error dengan opsi download

---

### US-MT-009: Reject Realisasi dengan Catatan

**User Story:**

**As a** Atasan

**I want to** me-reject realisasi yang tidak sesuai atau evidence tidak memadai

**So that** bawahan dapat memperbaiki dan submit ulang

**Acceptance Criteria (Gherkin):**

- **Given** bawahan saya submit realisasi dengan status "Pending Review"
- **When** saya klik tombol "Reject"
- **Then** sistem menampilkan form untuk catatan penolakan
- **And** saya WAJIB mengisi catatan penolakan (minimal 20 karakter)
- **When** saya submit rejection
- **Then** status realisasi berubah menjadi "Rejected"
- **And** catatan penolakan tersimpan dan ditampilkan ke bawahan
- **And** bawahan dapat re-submit realisasi

**Validation Rules:**

- **UI Rules:**
    - Sama dengan reject KPI planning
    - Tampilkan guidance: alasan umum rejection (data tidak cocok, evidence tidak valid, dll)
- **Business Rules:**
    - Reject WAJIB disertai catatan penolakan (BR-015)
    - Score tidak ter-update jika rejected
    - Bawahan dapat submit ulang dengan data/evidence baru
- **Data Rules:**
    - Catatan minimal 20 karakter
- **Edge Cases:**
    - Jika sudah melewati deadline periode, bawahan tetap bisa re-submit

---

### US-MT-010: Adjust dan Approve Realisasi

**User Story:**

**As a** Atasan

**I want to** mengadjust nilai realisasi sebelum approve

**So that** saya dapat memperbaiki error minor tanpa reject

**Acceptance Criteria (Gherkin):**

- **Given** bawahan saya submit realisasi dengan status "Pending Review"
- **And** saya menemukan error minor pada Actual Value
- **When** saya klik tombol "Adjust & Approve"
- **Then** sistem menampilkan form edit Actual Value
- **And** saya WAJIB mengisi justifikasi adjustment (minimal 20 karakter)
- **When** saya submit adjustment
- **Then** status realisasi berubah menjadi "Approved (Adjusted)"
- **And** nilai baru ter-save dan score ter-update
- **And** adjustment history di-log dengan justifikasi

**Validation Rules:**

- **UI Rules:**
    - Field Actual Value menjadi editable
    - Tampilkan nilai original vs nilai adjusted
    - Form justifikasi wajib diisi
- **Business Rules:**
    - Adjust & Approve memerlukan justifikasi wajib
    - Original value tetap tersimpan di history
    - Achievement dihitung berdasarkan adjusted value
- **Data Rules:**
    - Justifikasi minimal 20 karakter
    - Adjusted value harus valid numeric
- **Edge Cases:**
    - Jika adjusted value = original value, sistem block dengan warning

---

### US-MT-011: Draft KPI untuk Bawahan

**User Story:**

**As a** Atasan

**I want to** membuat draft KPI untuk bawahan saya

**So that** saya dapat proaktif merencanakan KPI tim

**Acceptance Criteria (Gherkin):**

- **Given** saya berada di halaman detail bawahan
- **And** periode perencanaan KPI sedang aktif
- **When** saya klik tombol "Draft KPI untuk [Nama Bawahan]"
- **Then** sistem menampilkan form KPI (sama dengan My Performance)
- **And** saya dapat mengisi seluruh field KPI
- **When** saya klik "Simpan Draft"
- **Then** KPI tersimpan dengan status "Draft" di Performance Tree bawahan
- **And** bawahan dapat melihat dan edit draft tersebut

**Validation Rules:**

- **UI Rules:**
    - Form sama dengan Draft KPI di My Performance
    - Dropdown pilih bawahan jika diakses dari Team Dashboard
    - Indikator "Drafted by: [Nama Atasan]"
- **Business Rules:**
    - Atasan dapat draft KPI untuk bawahan langsung saja
    - Bawahan tetap perlu submit untuk approval (workflow sama)
    - Draft dari atasan dapat di-edit oleh bawahan
- **Technical Rules:**
    - Creator field menunjukkan atasan sebagai drafter
    - Notification ke bawahan saat draft dibuat
- **Edge Cases:**
    - Jika periode perencanaan tidak aktif, tombol disabled

---

### US-MT-012: Cascade KPI ke Bawahan (Direct)

**User Story:**

**As a** Atasan (Owner KPI)

**I want to** men-cascade KPI saya ke bawahan dengan metode Direct

**So that** realisasi bawahan berkontribusi langsung ke pencapaian saya

**Acceptance Criteria (Gherkin):**

- **Given** saya memiliki KPI Output dengan status "Approved"
- **When** saya klik "Cascade ke Bawahan" pada item KPI tersebut
- **And** saya memilih metode "Direct Cascade"
- **And** saya memilih bawahan yang akan menerima cascade
- **Then** sistem membuat child KPI baru untuk bawahan tersebut
- **And** child KPI ter-link ke parent KPI saya
- **And** satuan (Unit) child KPI sama dengan parent (read-only)
- **And** realisasi child akan di-SUM ke realisasi parent

**Validation Rules:**

- **UI Rules:**
    - Modal pilih bawahan dengan checkbox (multi-select)
    - Warning banner: "Direct Cascade: Satuan harus sama, realisasi akan di-sum"
    - Form target per bawahan (dapat berbeda, tidak harus akumulatif)
- **Business Rules:**
    - Direct Cascade: satuan child WAJIB sama dengan parent (BR-006)
    - Target child tidak harus = total target parent
    - Realisasi child otomatis di-sum ke parent saat approved
- **Technical Rules:**
    - Relasi parent-child tersimpan di database
    - Trigger auto-sum saat realisasi child di-approve
- **Edge Cases:**
    - Jika child sudah punya realisasi, update parent saat child di-approve

---

### US-MT-013: Cascade KPI ke Bawahan (Indirect)

**User Story:**

**As a** Atasan (Owner KPI)

**I want to** men-cascade KPI saya ke bawahan dengan metode Indirect

**So that** bawahan memiliki KPI terkait tanpa auto-sum ke pencapaian saya

**Acceptance Criteria (Gherkin):**

- **Given** saya memiliki KPI Output dengan status "Approved"
- **When** saya klik "Cascade ke Bawahan" pada item KPI tersebut
- **And** saya memilih metode "Indirect Cascade"
- **And** saya memilih bawahan yang akan menerima cascade
- **Then** sistem membuat child KPI baru untuk bawahan tersebut
- **And** child KPI ter-link ke parent KPI saya (sebagai referensi)
- **And** satuan (Unit) child KPI dapat berbeda dengan parent
- **And** realisasi child TIDAK otomatis di-sum ke parent

**Validation Rules:**

- **UI Rules:**
    - Modal pilih bawahan dengan checkbox (multi-select)
    - Info banner: "Indirect Cascade: Satuan dapat berbeda, realisasi independen"
    - Form bebas untuk target dan satuan per bawahan
- **Business Rules:**
    - Indirect Cascade: satuan boleh berbeda (BR-005)
    - Realisasi child independen, tidak mempengaruhi parent
    - Link parent-child hanya untuk traceability
- **Data Rules:**
    - Target dan satuan dapat disesuaikan per bawahan
- **Edge Cases:**
    - Bawahan dapat mengubah satuan dan target saat edit

---

### US-MT-014: Assign Owner untuk KPI

**User Story:**

**As a** Atasan

**I want to** meng-assign bawahan sebagai Owner sebuah KPI

**So that** bawahan bertanggung jawab penuh atas KPI tersebut

**Acceptance Criteria (Gherkin):**

- **Given** saya sedang membuat/cascade KPI
- **When** saya memilih ownership type "Owner"
- **And** saya memilih bawahan sebagai Owner
- **Then** bawahan tersebut menjadi satu-satunya Owner KPI
- **And** bawahan dapat input realisasi sendiri
- **And** achievement dihitung berdasarkan realisasi yang di-input

**Validation Rules:**

- **UI Rules:**
    - Radio button untuk pilihan ownership type
    - Dropdown pilih 1 bawahan sebagai Owner
    - Owner ditampilkan dengan badge "Owner"
- **Business Rules:**
    - Hanya 1 Owner per item KPI
    - Owner bertanggung jawab input realisasi
    - Ownership dapat diubah sebelum KPI di-approve
- **Edge Cases:**
    - Jika Owner dimutasi, alert ke atasan untuk re-assign

---

### US-MT-015: Assign Shared Owner untuk KPI

**User Story:**

**As a** Atasan

**I want to** meng-assign bawahan sebagai Shared Owner sebuah KPI

**So that** bawahan berbagi tanggung jawab dengan Owner existing

**Acceptance Criteria (Gherkin):**

- **Given** sudah ada KPI dengan Owner yang di-assign
- **When** saya memilih ownership type "Shared Owner"
- **And** saya memilih bawahan lain sebagai Shared Owner
- **Then** bawahan tersebut menjadi Shared Owner KPI
- **And** Shared Owner TIDAK dapat input realisasi
- **And** Shared Owner mendapat achievement % sama dengan Owner

**Validation Rules:**

- **UI Rules:**
    - Multi-select dropdown untuk Shared Owner
    - Shared Owner ditampilkan dengan badge "Shared"
    - Warning: "Shared Owner tidak dapat input realisasi"
- **Business Rules:**
    - Shared Owner tidak dapat input realisasi (BR-010)
    - Achievement Shared Owner = Achievement Owner
    - Bobot di Performance Tree dapat berbeda per individu
- **Data Rules:**
    - Dapat multiple Shared Owner per item KPI
- **Edge Cases:**
    - Jika Owner dimutasi dan Shared Owner tetap, perlu re-assign Owner baru

---

### US-MT-016: Handle Same Position Allocation

**User Story:**

**As a** Atasan

**I want to** menentukan metode alokasi KPI untuk multiple bawahan di posisi yang sama

**So that** pencapaian mereka dapat diukur secara fair

**Acceptance Criteria (Gherkin):**

- **Given** saya memiliki beberapa bawahan dengan posisi yang sama
- **When** saya akan assign KPI untuk mereka
- **Then** sistem menampilkan 2 opsi alokasi:
- **Opsi 1: Shared Owner** - 1 Owner + N Shared Owners, achievement identik
- **Opsi 2: Duplicate KPI** - Setiap bawahan Owner item sendiri, achievement independen
- **And** saya memilih opsi yang sesuai dengan nature of work

**Validation Rules:**

- **UI Rules:**
    - Card selection untuk 2 opsi dengan deskripsi jelas
    - Recommendation engine berdasarkan tipe KPI
    - Comparison table menunjukkan perbedaan kedua opsi
- **Business Rules:**
    - **Opsi 1 (Shared Owner):**
        - Cocok untuk: tanggung jawab identik, output tidak terpisahkan
        - Hanya Owner yang input realisasi
        - Semua mendapat achievement identik
    - **Opsi 2 (Duplicate KPI):**
        - Cocok untuk: tanggung jawab terpisah, output terukur independen
        - Masing-masing input realisasi sendiri
        - Achievement dihitung independen
- **Data Rules:**
    - Sistem menyimpan allocation method untuk audit
- **Edge Cases:**
    - Kombinasi keduanya diperbolehkan (sebagian shared, sebagian independen)

---

### US-MT-017: View Member KPI Detail Panel

**User Story:**

**As a** Atasan

**I want to** melihat detail lengkap KPI bawahan pada panel detail

**So that** saya dapat memahami konteks KPI sebelum melakukan approval atau review

**Acceptance Criteria (Gherkin):**

- **Given** saya berada di halaman detail member
- **When** saya klik pada item KPI bawahan
- **Then** sistem menampilkan panel detail KPI dengan informasi lengkap:
    - Basic Info: Title, Description, Target, Unit, BSC Perspective
    - Ownership Info: Owner, Shared Owners (jika ada) dengan bobot
    - Cascading Info: Parent KPI, Child KPIs, Cascading Method
    - Progress: Realisasi per periode, Achievement %, Trend chart
    - Evidence: Daftar evidence per periode
    - History: Timeline approval/rejection

**Validation Rules:**

- **UI Rules:**
    - Panel detail sebagai side panel atau modal
    - Accordion sections untuk setiap kategori info
    - Action buttons (Approve/Reject) di footer panel jika ada pending item
- **Business Rules:**
    - Atasan dapat view detail tapi tidak dapat edit langsung
    - Evidence dapat di-preview/download
- **Edge Cases:**
    - Jika KPI cascaded dari parent, tampilkan link ke parent KPI

---

### US-MT-018: View Team KPI Status Overview

**User Story:**

**As a** Atasan

**I want to** melihat overview status KPI seluruh bawahan

**So that** saya dapat dengan cepat mengidentifikasi bawahan yang memerlukan perhatian

**Acceptance Criteria (Gherkin):**

- **Given** saya berada di Team Dashboard
- **When** saya melihat section "KPI Status Overview"
- **Then** saya melihat breakdown jumlah KPI per status untuk seluruh bawahan:
    - 🟢 On Track: X KPIs
    - 🟡 Behind: Y KPIs
    - 🔴 At Risk: Z KPIs
    - ⚪ Pending: N KPIs
- **And** saya dapat klik setiap status untuk filter dan melihat detail
- **And** saya melihat heatmap per bawahan

**Validation Rules:**

- **UI Rules:**
    - Summary cards dengan jumlah dan color coding
    - Heatmap grid: Rows = Bawahan, Columns = KPI Items
    - Tooltip saat hover menampilkan KPI title dan achievement
    - Filter chips untuk drill-down
- **Business Rules:**
    - Status threshold sama dengan My Performance (On Track ≥100%, Behind 80-99%, At Risk <80%)
    - Aggregate dihitung real-time

**Status Overview Display:**

| **Bawahan** | **On Track** | **Behind** | **At Risk** | **Total Score** |
| --- | --- | --- | --- | --- |
| Ahmad Dani | 4 | 1 | 0 | 102% |
| Budi Santoso | 2 | 2 | 1 | 78% |
| Citra Dewi | 5 | 0 | 0 | 115% |

---

### US-MT-019: Receive At Risk Alert for Team

**User Story:**

**As a** Atasan

**I want to** menerima alert ketika KPI bawahan berubah status menjadi At Risk

**So that** saya dapat segera melakukan coaching atau intervensi

**Acceptance Criteria (Gherkin):**

- **Given** KPI bawahan saya berubah status menjadi At Risk
- **When** status change terjadi
- **Then** saya menerima in-app notification "KPI [Title] milik [Nama Bawahan] At Risk"
- **And** saya menerima email alert dengan detail KPI dan achievement
- **When** saya membuka Team Dashboard
- **Then** saya melihat alert banner "X KPIs At Risk dalam tim Anda"
- **And** bawahan dengan At Risk di-highlight dalam daftar

**Validation Rules:**

- **UI Rules:**
    - Alert banner merah di top Team Dashboard
    - Badge counter "At Risk" di menu My Team Performance
    - Row highlight merah untuk bawahan dengan At Risk
- **Business Rules:**
    - Atasan menerima alert untuk semua KPI At Risk bawahan langsung
    - Alert di-trigger setelah realisasi di-approve (bukan saat submit)
    - Atasan dapat melakukan coaching note (future enhancement)
- **Technical Rules:**
    - Batch notification: max 1 email per jam untuk multiple alerts

**Notification Triggers:**

| **Event** | **In-App** | **Email** | **Recipient** |
| --- | --- | --- | --- |
| Bawahan KPI → At Risk | Ya | Ya | Atasan |
| Bawahan KPI → Behind | Ya | Tidak | Atasan |
| Bawahan KPI → On Track (recovery) | Ya | Tidak | Atasan |
| Bawahan miss deadline | Ya | Ya | Atasan + Bawahan |

---

### US-MT-020: Bulk Approve Realisasi

**User Story:**

**As a** Atasan

**I want to** melakukan bulk approve untuk multiple realisasi sekaligus

**So that** saya dapat menghemat waktu untuk approval routine items

**Acceptance Criteria (Gherkin):**

- **Given** saya memiliki beberapa realisasi dengan status "Pending Review"
- **When** saya berada di Approval Queue
- **Then** saya melihat checkbox di setiap item
- **And** saya dapat memilih multiple items
- **When** saya klik "Bulk Approve" dengan items terpilih
- **Then** sistem menampilkan konfirmasi modal dengan summary
- **When** saya konfirmasi
- **Then** semua items yang dipilih berubah status menjadi "Approved"
- **And** score masing-masing bawahan ter-update
- **And** notifikasi batch terkirim ke masing-masing bawahan

**Validation Rules:**

- **UI Rules:**
    - Checkbox dengan "Select All" option
    - Counter: "5 items selected"
    - Bulk Approve button enabled hanya jika ada selection
    - Konfirmasi modal menampilkan list items yang akan di-approve
    - Progress bar untuk batch processing
- **Business Rules:**
    - Bulk approve hanya untuk items dengan evidence valid (KPI Output)
    - Tidak ada bulk reject (reject harus individual dengan catatan)
    - Max 50 items per batch untuk performance
- **Technical Rules:**
    - Batch processing dengan transaction
    - Rollback jika ada error di tengah batch
- **Edge Cases:**
    - Jika ada item yang gagal, tampilkan partial success dengan list failures

---

### US-MT-021: Export Team Performance Report

**User Story:**

**As a** Atasan

**I want to** meng-export data performa tim ke Excel atau PDF

**So that** saya dapat melakukan analisis lebih lanjut atau reporting

**Acceptance Criteria (Gherkin):**

- **Given** saya berada di Team Dashboard
- **When** saya klik tombol "Export"
- **Then** sistem menampilkan modal export options:
    - Format: Excel (.xlsx) atau PDF
    - Scope: All Members atau Selected Members
    - Period: Current Quarter, YTD, atau Custom Range
    - Content: Summary Only atau Detailed (include all KPIs)
- **When** saya pilih options dan klik "Generate"
- **Then** sistem generate file dan provide download link

**Validation Rules:**

- **UI Rules:**
    - Modal dengan form options
    - Preview sample sebelum generate
    - Progress indicator untuk file generation
    - Download link dengan expiry (24 jam)
- **Business Rules:**
    - Export hanya data bawahan langsung (sesuai access level)
    - Data sensitive (evidence files) tidak di-include
    - Watermark dengan timestamp dan exporter name
- **Data Rules:**
    - Excel: Multiple sheets (Summary, per Member, per KPI Type)
    - PDF: Formatted report dengan charts dan tables

**Export Content:**

| **Section** | **Excel** | **PDF** |
| --- | --- | --- |
| Team Summary | Sheet 1 | Page 1 |
| Member List with Scores | Sheet 2 | Page 2 |
| KPI Details per Member | Sheet 3-N | Appendix |
| Status Distribution Chart | Embedded | Page 1 |
| Trend Chart | Embedded | Page 3 |

---

### US-MT-022: View Unallocated KPI from Performance Tree

**User Story:**

**As a** Atasan

**I want to** melihat list item KPI yang sudah di-draft admin di Performance Tree untuk master posisi bawahan saya

**So that** saya dapat mengalokasikan item tersebut ke incumbent yang tepat

<aside>
🌳

**Performance Tree Allocation Flow:**

Admin draft item KPI di Performance Tree → Item ter-attach ke **master posisi** (bukan individu) → Atasan melakukan **allocation** ke incumbent(s) dengan menentukan Owner, Bobot, dan Target.

</aside>

**Acceptance Criteria (Gherkin):**

- **Given** saya login sebagai Atasan dengan bawahan langsung
- **When** saya membuka menu "Unallocated KPI" atau section "Needs Allocation" di Team Dashboard
- **Then** saya melihat list item KPI yang di-draft admin di Performance Tree
- **And** setiap item menampilkan: Title, Type (Output/KAI), Target, Master Position
- **And** saya melihat badge "Needs Allocation" untuk posisi dengan multiple incumbents
- **And** saya dapat filter berdasarkan posisi dan KPI type
- **When** saya klik item untuk detail
- **Then** saya melihat preview definisi KPI dari Performance Tree (read-only)
- **And** saya melihat list incumbent(s) yang perlu di-assign

**Validation Rules:**

- **UI Rules:**
    - Section "Unallocated KPI" dengan counter badge di header
    - Badge "Needs Allocation" berwarna orange
    - List item dengan expand/collapse untuk detail
    - Preview panel menampilkan: Title, Description, Target (template), BSC Perspective
    - CTA button "Allocate to Team Members" per item
    - Filter chips: "All" | "KPI Output" | "KAI" | "By Position"
- **Business Rules:**
    - Hanya tampilkan item KPI dari master posisi bawahan langsung
    - Item KPI dari Performance Tree bersifat template (bobot dan target final ditentukan saat allocation)
    - Multiple incumbents di satu master posisi memerlukan allocation decision (Shared vs Duplicate)
    - Atasan dapat melihat definisi lengkap dari Performance Tree sebelum allocate
- **Data Rules:**
    - Data master posisi dari MDM
    - Data item KPI dari Performance Tree (tb_performance_tree)
    - Link incumbent ke master posisi berdasarkan Position Master Variant ID
- **Edge Cases:**
    - Jika semua item sudah di-alokasi, tampilkan empty state "All KPIs allocated"
    - Jika ada incumbent baru ditambahkan ke master posisi, item yang sudah di-alokasi ke incumbent lain tetap perlu re-review

**Unallocated KPI Display:**

| **Item KPI** | **Type** | **Master Position** | **Incumbents** | **Status** |
| --- | --- | --- | --- | --- |
| Revenue Growth Q1 | 🎯 Output | Officer Kinerja Individu | 2 incumbents | 🟠 Needs Allocation |
| Weekly Team Meeting | 📋 KAI | Supervisor HRD | 1 incumbent | 🟠 Needs Allocation |
| Cost Efficiency % | 🎯 Output | Analyst Keuangan | 3 incumbents | 🟠 Needs Allocation |

---

### US-MT-023: Allocate KPI from Performance Tree to Team Members

**User Story:**

**As a** Atasan

**I want to** meng-alokasi item KPI dari Performance Tree ke team members saya

**So that** setiap incumbent memiliki KPI dengan Owner, Bobot, dan Target yang jelas

<aside>
⚙️

**Dua Jalur KPI Planning:**

1. **Allocation from Performance Tree** (US-MT-023): Item KPI di-draft admin → Atasan allocate ke incumbent dengan konfigurasi Owner, Bobot, Target
2. **Cascading from Own KPI** (US-MT-011, US-MT-012, US-MT-013): Atasan cascade KPI Output miliknya sendiri ke bawahan (free draft atau dari Kamus KPI)
</aside>

**Acceptance Criteria (Gherkin):**

- **Given** saya melihat unallocated KPI item dari Performance Tree
- **When** saya klik "Allocate to Team Members" pada item tersebut
- **Then** sistem menampilkan Allocation Wizard dengan steps:
    1. **Review Definition:** Preview item KPI dari Performance Tree (read-only)
    2. **Select Incumbents:** Pilih incumbent(s) yang akan menerima KPI ini
    3. **Choose Strategy:** Shared Owner vs Duplicate KPI (jika multiple incumbents)
    4. **Configure:** Set Owner, Bobot, Target per incumbent
    5. **Confirm:** Review summary dan finalize allocation
- **When** saya selesai configure dan klik "Finalize Allocation"
- **Then** sistem membuat KPI instance untuk setiap incumbent sesuai strategy
- **And** status item berubah dari "Needs Allocation" menjadi "Allocated"
- **And** incumbent menerima notifikasi "KPI baru telah di-assign oleh atasan"
- **And** incumbent dapat melihat KPI di My Performance dengan status "Cascaded - Pending Review"

**Validation Rules:**

- **UI Rules:**
    - Wizard dengan progress indicator (Step 1/5, 2/5, dst)
    - Step 1: Read-only preview dengan highlight mandatory fields
    - Step 2: Checkbox list incumbents dengan info: Avatar, Nama, NIPP, Posisi
    - Step 3: Card selection untuk Shared vs Duplicate (hanya jika multiple incumbents)
    - Step 4: Form per incumbent dengan fields: Owner (radio), Shared Owner (checkbox), Bobot (%), Target (number + unit)
    - Step 5: Summary table dengan review lengkap sebelum finalize
    - Back/Next navigation di wizard
- **Business Rules:**
    - Item KPI dari Performance Tree inherit: Title, Description, BSC Perspective, Unit (untuk Output)
    - Atasan WAJIB set: Owner (1 per item), Bobot (% dari total portfolio), Target (value spesifik)
    - Jika multiple incumbents + Shared Owner strategy: 1 Owner + N Shared Owners
    - Jika multiple incumbents + Duplicate strategy: Setiap incumbent jadi Owner item tersendiri
    - Total bobot allocation tidak harus = 100% (validasi bobot final saat portfolio approval)
    - Target dapat berbeda per incumbent (tidak harus akumulatif)
- **Data Rules:**
    - Owner: Required, 1 person per item instance
    - Bobot: Integer 1-100%
    - Target: Numeric, > 0
    - Unit: Inherited dari Performance Tree untuk KPI Output
- **Edge Cases:**
    - Jika hanya 1 incumbent, skip Step 3 (langsung ke Configure)
    - Jika incumbent baru ditambahkan setelah allocation, atasan menerima alert untuk re-allocate

**Allocation Strategy Decision Matrix:**

| **Scenario** | **Recommended Strategy** | **Rationale** |
| --- | --- | --- |
| Tanggung jawab identik, output tidak terpisahkan (e.g., Team Revenue) | ✅ **Shared Owner** | Hanya 1 realisasi, achievement identik untuk semua |
| Tanggung jawab terpisah, output terukur independen (e.g., Individual Sales Target) | ✅ **Duplicate KPI** | Setiap orang input realisasi sendiri, achievement independen |
| Sebagian shared, sebagian independen | ⚙️ **Hybrid** | Kombinasi: 1 item Shared + duplicate untuk sisanya |

---

### US-MT-024: Draft KAI untuk Bawahan dari KPI Output Bawahan

**User Story:**

**As a** Atasan

**I want to** men-draft KAI untuk bawahan dengan link ke KPI Output milik bawahan tersebut

**So that** bawahan memiliki aktivitas operasional yang jelas untuk mencapai target output mereka

<aside>
⚠️

**Aturan Cascading KAI:**

KAI **HANYA dapat di-cascade dari KPI Output milik bawahan** (bukan dari KPI Output atasan). Hal ini memastikan KAI relevan dengan tanggung jawab output individu bawahan.

</aside>

**Acceptance Criteria (Gherkin):**

- **Given** saya berada di halaman detail bawahan
- **And** bawahan sudah memiliki KPI Output (status Draft atau Approved)
- **When** saya klik "Draft KAI untuk [Nama Bawahan]"
- **Then** sistem menampilkan form KAI dengan dropdown "Link to KPI Output"
- **And** dropdown hanya menampilkan **KPI Output milik bawahan tersebut** (bukan KPI Output atasan)
- **When** saya pilih KPI Output dan mengisi field KAI (Title, Target, Frequency, dll)
- **And** saya klik "Save Draft"
- **Then** KAI tersimpan dengan status "Draft" dan ter-link ke KPI Output bawahan
- **And** bawahan menerima notifikasi "KAI baru telah di-draft oleh atasan"
- **And** bawahan dapat review, edit, dan submit KAI untuk approval

**Validation Rules:**

- **UI Rules:**
    - Form KAI serupa dengan US-MP-005 (Draft Specific KAI)
    - Dropdown "Link to KPI Output" **mandatory** (tidak boleh kosong)
    - Dropdown filtered: hanya KPI Output milik bawahan yang dipilih
    - Preview KPI Output yang dipilih di side panel
    - Helper text: "KAI ini akan membantu mencapai target KPI Output yang dipilih"
- **Business Rules:**
    - KAI **hanya dapat di-link ke KPI Output milik bawahan tersebut** (BR-KAI-006)
    - KAI tidak dapat di-link ke KPI Output milik atasan (validation error)
    - Atasan dapat draft multiple KAI untuk 1 KPI Output bawahan
    - Bawahan tetap perlu submit KAI untuk approval (workflow sama seperti KPI Output)
    - KAI yang di-draft atasan dapat di-edit oleh bawahan sebelum submit
- **Data Rules:**
    - Link to KPI Output: Required, must be owned by selected subordinate
    - Nature of Work: Routine / Non-routine
    - Monitoring Frequency: Weekly / Monthly
    - Target Value dan Unit: Required
- **Edge Cases:**
    - Jika bawahan belum memiliki KPI Output, tampilkan warning "Bawahan belum memiliki KPI Output. Silakan allocate atau cascade KPI Output terlebih dahulu."
    - Jika KPI Output bawahan di-reject atau di-delete, KAI yang ter-link menjadi orphan (perlu re-link)

---

### US-MT-025: Monitor Cascaded KPI Review Status

**User Story:**

**As a** Atasan

**I want to** memonitor status review bawahan terhadap KPI yang saya cascade

**So that** saya dapat merespons revision request dan memastikan KPI diterima dengan baik

**Acceptance Criteria (Gherkin):**

- **Given** saya telah men-cascade KPI (Output atau KAI) ke bawahan
- **When** saya membuka "Cascaded KPI Tracker" di Team Dashboard
- **Then** saya melihat list KPI yang di-cascade dengan status review:
    - 🟡 **Pending Review:** Bawahan belum accept/reject
    - 🟢 **Accepted:** Bawahan sudah accept, masuk ke Draft mereka
    - 🔵 **Revision Requested:** Bawahan request revision dengan catatan
    - ⚪ **Expired:** Bawahan tidak review hingga deadline (auto-accept)
- **When** status = "Revision Requested"
- **Then** saya melihat catatan revision dari bawahan
- **And** saya dapat merespons dengan:
    - **Adjust & Re-cascade:** Edit KPI dan cascade ulang
    - **Explain:** Kirim catatan penjelasan tanpa perubahan
    - **Withdraw:** Batalkan cascade (remove dari bawahan)
- **When** saya buka detail item
- **Then** saya melihat timeline review: Cascaded → Pending Review → Accepted/Revision

**Validation Rules:**

- **UI Rules:**
    - Section "Cascaded KPI Tracker" di Team Dashboard
    - Badge counter per status (e.g., "3 Pending Review, 1 Revision Requested")
    - Expandable list dengan detail per item
    - Timeline visual untuk review history
    - Action buttons: "Adjust & Re-cascade", "Explain", "Withdraw"
    - Form catatan penjelasan (min 20 chars) jika pilih "Explain"
- **Business Rules:**
    - Atasan menerima notification saat bawahan request revision
    - Revision request WAJIB disertai catatan dari bawahan (min 20 chars)
    - Jika auto-accept (expired), atasan menerima summary notification
    - Adjust & Re-cascade mengirim ulang KPI dengan status "Cascaded - Pending Review" (reset timeline)
    - Explain mengirim catatan ke bawahan tanpa mengubah status
    - Withdraw menghapus KPI dari portfolio bawahan (jika belum di-accept)
- **Data Rules:**
    - Auto-accept deadline: 7 hari kerja setelah cascade
    - Revision request catatan: Min 20 chars, max 500 chars
    - Explanation catatan: Min 20 chars, max 500 chars
- **Edge Cases:**
    - Jika bawahan accept lalu request revisi ulang, tidak bisa (harus via workflow revisi standard)
    - Jika atasan withdraw setelah bawahan accept, tampilkan konfirmasi "KPI sudah diterima bawahan, yakin withdraw?"

**Review Status Tracker:**

| **KPI Item** | **Recipient** | **Cascaded Date** | **Status** | **Action** |
| --- | --- | --- | --- | --- |
| Revenue Growth Q1 | Ahmad Dani | 15 Jan 2026 | 🟢 Accepted | - |
| Cost Efficiency % | Budi Santoso | 16 Jan 2026 | 🔵 Revision Requested | Respond |
| Weekly Report KAI | Citra Dewi | 17 Jan 2026 | 🟡 Pending Review (5 days left) | Remind |

---

### US-MT-026: View Team Members Across Multiple Positions

**User Story:**

**As a** Atasan

**I want to** melihat bawahan yang memiliki multiple positions (definitif + secondary assignment)

**So that** saya dapat memonitor dan approve KPI mereka untuk setiap posisi secara terpisah

**Acceptance Criteria (Gherkin):**

- **Given** saya login sebagai Atasan
- **And** salah satu bawahan saya memiliki secondary assignment (PLH)
- **When** saya membuka Team Dashboard
- **Then** saya melihat bawahan tersebut dengan badge indicator "Multi-Position"
- **And** saya dapat expand row untuk melihat breakdown posisi:
    - 📍 **Definitif:** Posisi tetap
    - 🔄 **Secondary:** Posisi PLH dengan periode assignment
- **When** saya klik detail bawahan
- **Then** saya melihat position switcher di header halaman detail
- **And** saya dapat toggle between posisi definitif dan secondary
- **When** saya switch posisi
- **Then** dashboard menampilkan KPI spesifik untuk posisi tersebut
- **And** approval queue ter-filter berdasarkan posisi yang dipilih

**Validation Rules:**

- **UI Rules:**
    - Badge "Multi-Position" berwarna purple di Team Dashboard
    - Expandable row dengan sub-rows per posisi
    - Position switcher dropdown di halaman detail: "Definitif" (biru) | "PLH" (orange)
    - Label periode assignment untuk secondary: "15 Jan - 28 Feb 2026"
    - Approval queue dengan filter "All Positions" | "Definitif Only" | "Secondary Only"
    - Historical view: Secondary assignment yang sudah berakhir tetap visible (read-only)
- **Business Rules:**
    - KPI antar posisi tidak saling mempengaruhi (independent portfolio)
    - Setiap posisi memiliki atasan approval sendiri (bisa berbeda)
    - Score proporsional dihitung per posisi berdasarkan durasi assignment
    - Atasan hanya dapat approve KPI untuk posisi yang mereka supervise
    - Secondary assignment dapat berakhir mid-year (threshold tanggal 15 untuk scoring)
- **Data Rules:**
    - Data posisi dari MDM (Master Data Management)
    - Position Master Variant ID berbeda per posisi
    - Assignment period tracked dengan start_date dan end_date
- **Edge Cases:**
    - Jika secondary assignment berakhir, posisi tetap visible di historical view (read-only)
    - Jika bawahan pindah definitif (mutasi), posisi lama menjadi historical, posisi baru jadi current
    - Jika atasan berbeda untuk definitif vs secondary, filter team dashboard accordingly

**Multi-Position Display:**

| **Bawahan** | **Position Type** | **Position Title** | **Period** | **Score** |
| --- | --- | --- | --- | --- |
| Ahmad Dani | 📍 Definitif | Officer Kinerja | Permanent | 105% |
| 🔄 Secondary | Supervisor HRD (PLH) | 15 Jan - 28 Feb | 98% |  |

---

### US-MT-027: Handle Mutasi Masuk - Auto Re-planning Trigger

**User Story:**

**As a** Atasan

**I want to** menerima notifikasi otomatis ketika ada pekerja baru masuk ke tim saya (mutasi atau hire)

**So that** saya dapat segera melakukan KPI allocation untuk incumbent baru tersebut

**Acceptance Criteria (Gherkin):**

- **Given** ada mutasi masuk: pekerja baru mengisi posisi existing atau posisi baru terbentuk di struktur saya
- **When** sistem detect perubahan struktur dari MDM sync
- **Then** saya menerima in-app notification "Pekerja baru di tim Anda memerlukan KPI allocation"
- **And** saya menerima email summary: Nama pekerja, Posisi, Tanggal efektif
- **When** saya membuka Team Dashboard
- **Then** saya melihat alert banner "X new members need KPI allocation"
- **And** incumbent baru ditampilkan dengan badge "New - Needs KPI"
- **And** saya dapat klik CTA "Allocate KPI Now" yang direct ke allocation workflow

**Validation Rules:**

- **UI Rules:**
    - Alert banner orange di top Team Dashboard
    - Badge "New - Needs KPI" berwarna orange di member row
    - CTA button "Allocate KPI Now" dengan icon ⚡
    - Modal summary perubahan tim: "Added: X members, Removed: Y members"
    - Link ke unallocated KPI list untuk posisi baru
- **Business Rules:**
    - System detect mutasi dari MDM sync (scheduled atau real-time)
    - Trigger re-planning notification ke atasan langsung
    - Incumbent baru yang mengisi posisi existing memerlukan:
        1. Allocation dari unallocated Performance Tree items (jika ada)
        2. Atau cascading dari atasan
    - Posisi baru memerlukan full KPI planning dari scratch
    - Threshold tanggal 15: Mutasi masuk tanggal 1-15 → incumbent tanggung jawab full bulan, tanggal 16-31 → bulan berikutnya
- **Data Rules:**
    - MDM sync frequency: Real-time atau daily batch
    - Notification batching: Max 1 email per hari untuk multiple mutations
    - Alert expire: Badge "New - Needs KPI" hilang setelah KPI di-allocate
- **Edge Cases:**
    - Jika incumbent baru masuk di tengah periode perencanaan (late join), berikan extended deadline
    - Jika mutasi masuk + keluar simultaneous (job rotation), prioritaskan allocation untuk masuk
    - Jika posisi existing dengan item KPI sudah allocated ke incumbent lain, perlu decision: Shared atau Duplicate

**Mutasi Detection Workflow:**

| **Event** | **Detection** | **Notification** | **Action Required** |
| --- | --- | --- | --- |
| Pekerja baru mengisi posisi existing | MDM sync | In-app + Email | Allocate KPI from Performance Tree atau Cascade |
| Posisi baru terbentuk | MDM sync | In-app + Email | Full KPI planning (Allocate atau Cascade) |
| Pekerja keluar (mutasi keluar) | MDM sync | In-app only | Auto-remove dari team dashboard |
| Job rotation (simultaneous) | MDM sync | In-app + Email | Re-allocate untuk incoming incumbent |

---

### US-MT-028: View Team Calendar & Deadline Tracking

**User Story:**

**As a** Atasan

**I want to** melihat calendar dengan deadline dan aktivitas PMS seluruh bawahan saya

**So that** saya dapat memastikan tim tidak melewatkan deadline penting dan merencanakan review schedule

**Acceptance Criteria (Gherkin):**

- **Given** saya login sebagai Atasan
- **When** saya membuka tab "Team Calendar" di My Team Performance
- **Then** saya melihat calendar view dengan deadline dan aktivitas PMS seluruh bawahan
- **And** setiap event memiliki color coding sesuai tipe dan urgency
- **And** saya dapat filter by member, posisi, atau event type
- **When** saya klik pada tanggal dengan event
- **Then** sistem menampilkan detail event dan list bawahan terkait
- **And** saya dapat klik CTA untuk action (e.g., "Review Submissions", "Remind Member")
- **When** approaching deadline (H-3)
- **Then** saya menerima summary notification "X submissions due in 3 days"

**Validation Rules:**

- **UI Rules:**
    - 3 view modes: Monthly, Weekly, Agenda
    - Color coding:
        - 🟦 Blue: Planning deadlines
        - 🟩 Green: Input realisasi deadlines
        - 🟨 Yellow: Approval deadlines (action required)
        - 🟥 Red: Overdue items
    - Badge counter per tanggal: jumlah pending items
    - Filter toggle: "All Members" | "By Member" | "By Event Type"
    - Hover tooltip: Preview event details
    - Sync button: Manual refresh from latest data
- **Business Rules:**
    - Calendar aggregate dari seluruh bawahan langsung
    - Event types:
        - Planning deadline (KPI submission)
        - Input realisasi deadline (Monthly: tgl 5, Quarterly: tgl 10)
        - Approval deadline (Monthly: tgl 10, Quarterly: tgl 15)
        - Auto-approve trigger date
        - P-KPI sync date (D+5 akhir triwulan)
    - Reminder schedule: H-3 dan H-1 via in-app notification
    - Overdue items persistent hingga di-complete
- **Data Rules:**
    - Calendar data cached untuk performance (refresh manual atau auto setiap 1 jam)
    - Multi-position members: Events grouped by posisi
    - Export calendar: iCal format untuk Google Calendar / Outlook integration (future)
- **Edge Cases:**
    - Jika tidak ada bawahan, tampilkan empty state "No team members"
    - Jika semua deadline sudah lewat, tampilkan historical view dengan filter "Show Past Events"
    - Jika bawahan late submit (after deadline), event tetap muncul dengan badge "Overdue"

**Team Calendar Events:**

| **Event Type** | **Color** | **Timing** | **Action Available** |
| --- | --- | --- | --- |
| Planning Deadline | 🟦 Blue | Januari-Februari | "Review Submissions" |
| Input Realisasi (Monthly) | 🟩 Green | Tanggal 5 | "View Status", "Remind" |
| Approval Deadline (Monthly) | 🟨 Yellow | Tanggal 10 | "Go to Approval Queue" |
| Auto-Approve Trigger | 🟦 Blue | Tanggal 10-15 | "Review Before Auto-approve" |
| Overdue Submission | 🟥 Red | After deadline | "Escalate", "Remind" |

---

### US-MT-017a: View Member KPI Detail Panel - Basic Info

**User Story:**

**As a** Atasan

**I want to** melihat informasi dasar KPI bawahan pada panel detail

**So that** saya dapat memahami konteks dan definisi KPI secara lengkap sebelum approval atau review

**Acceptance Criteria (Gherkin):**

- **Given** saya membuka detail KPI bawahan
- **When** saya melihat tab "Basic Info" di detail panel
- **Then** saya melihat informasi lengkap:
    - Title dan Description KPI
    - BSC Perspective
    - Target Value, Target Unit, Target Type (Fixed/Progressive)
    - Polarity (Maximize/Minimize)
    - Workflow Status (Draft/Pending/Approved/Rejected)
    - Periode berlaku (Tahun, Triwulan)
    - Sumber KPI: Manual, Kamus KPI, Performance Tree, atau Cascaded from Atasan
    - Created by dan Created date
- **And** field dari Kamus KPI atau Performance Tree ditandai dengan icon 📖 atau 🌳
- **And** jika cascaded, saya melihat link ke parent KPI

**Validation Rules:**

- **UI Rules:**
    - Tab navigation: Basic Info | Ownership | Cascading | Progress | Evidence | History
    - Section "Basic Info" default expanded
    - Read-only fields dengan styling berbeda dari editable
    - Icon indicator: 📖 (Kamus KPI), 🌳 (Performance Tree), 🔗 (Cascaded)
    - Link ke source (Kamus atau parent KPI) dapat di-klik untuk view definition
    - Status badge dengan color coding di header
- **Business Rules:**
    - Semua field read-only untuk atasan (tidak dapat edit langsung)
    - Atasan dapat view full definition untuk context approval
    - Jika KPI dari Performance Tree, tampilkan "Allocated by [Nama Atasan]"
    - Jika cascaded, tampilkan "Cascaded from [Parent KPI Title]"
- **Data Rules:**
    - All fields dari database KPI master
    - Source tracking: user_created vs system_allocated
- **Edge Cases:**
    - Jika KPI hybrid (free draft dengan reference ke Kamus), tampilkan both sources

**Basic Info Display Fields:**

| **Field** | **Type** | **Source Indicator** |
| --- | --- | --- |
| Title | Text | 📖 🌳 🔗 (jika applicable) |
| Description | Rich Text | 📖 🌳 (jika applicable) |
| BSC Perspective | Enum | - |
| Target Value | Number | - |
| Target Unit | Text | 📖 🌳 (jika applicable) |
| Target Type | Fixed / Progressive | - |
| Polarity | Maximize / Minimize | - |
| Workflow Status | Enum Badge | System generated |
| Created By | User Link | - |
| Source | Text + Link | Manual / Kamus / Tree / Cascaded |

---

### US-MT-017b: View Member KPI Detail Panel - Ownership Info

**User Story:**

**As a** Atasan

**I want to** melihat informasi ownership KPI bawahan pada panel detail

**So that** saya mengetahui siapa Owner dan Shared Owner beserta bobot kontribusi dan struktur vertikal mereka

**Acceptance Criteria (Gherkin):**

- **Given** saya membuka detail KPI bawahan
- **When** saya melihat tab "Ownership" di detail panel
- **Then** saya melihat informasi lengkap:
    - **Owner:** Nama, Posisi, Level BOD, NIPP
    - **Shared Owners** (jika ada): List dengan Nama, Posisi, Level BOD, NIPP, Bobot %
    - **Vertical Structure:** Visual hierarchy jika ada shared owner cross-level
    - Total bobot kontribusi = 100%
- **And** current user (bawahan) di-highlight dengan border atau background berbeda
- **And** saya dapat hover untuk melihat detail kontribusi per Shared Owner

**Validation Rules:**

- **UI Rules:**
    - Tab "Ownership" dengan badge count (e.g., "1 Owner + 3 Shared")
    - Owner dengan badge 👑 dan foto profil besar
    - Shared Owner dengan badge 🤝 dan bobot % di samping nama
    - Level BOD indicator: Tag "BOD-3", "BOD-4", "BOD-5"
    - Vertical structure visual: Tree diagram atau grouped list by level
    - Highlight current user dengan border hijau atau background light
    - Avatar stack jika lebih dari 5 Shared Owners
- **Business Rules:**
    - Owner = 1 orang, bertanggung jawab input realisasi
    - Shared Owner dapat lebih dari 1, achievement mengikuti Owner
    - Vertical shared owner: Shared owner dapat di level manapun dalam struktur
    - Total bobot kontribusi shared owners = 100% dari bobot KPI di portfolio mereka masing-masing
- **Data Rules:**
    - Nama, Posisi, Level dari MDM
    - Bobot per Shared Owner dari allocation config
- **Edge Cases:**
    - Jika tidak ada Shared Owner, tampilkan "Single Owner (No sharing)"
    - Jika Shared Owner dimutasi keluar, tampilkan badge "Inactive" dengan strikethrough

**Ownership Display - Vertical Structure Example:**

| **Role** | **Name** | **Position** | **Level** | **Bobot %** |
| --- | --- | --- | --- | --- |
| 👑 Owner | Ahmad Dani | Supervisor Kinerja | BOD-4 | - |
| 🤝 Shared | Budi Santoso | Officer HRD | BOD-5 | 50% |
| 🤝 Shared | Citra Dewi | Officer Kinerja | BOD-5 | 30% |
| 🤝 Shared | Deni Firmansyah | Analyst Perf | BOD-6 | 20% |

---

### US-MT-017c: View Member KPI Detail Panel - Cascading Hierarchy

**User Story:**

**As a** Atasan

**I want to** melihat hierarki cascading KPI bawahan pada panel detail

**So that** saya memahami hubungan KPI bawahan dengan KPI parent (atasan atau admin) dan child KPIs (jika bawahan juga atasan)

**Acceptance Criteria (Gherkin):**

- **Given** saya membuka detail KPI bawahan
- **When** saya melihat tab "Cascading" di detail panel
- **Then** saya melihat visualisasi hierarchy:
    - **Parent KPI** (jika ada): Title, Owner, Achievement %, Cascading Method
    - **Current KPI:** Title (highlighted)
    - **Child KPIs** (jika ada): Title, Owner, Achievement %, Cascading Method
- **And** saya dapat klik Parent atau Child untuk navigasi ke detail KPI tersebut
- **And** saya melihat indicator Direct vs Indirect cascade
- **And** jika Direct Cascade, saya melihat auto-sum calculation preview

**Validation Rules:**

- **UI Rules:**
    - Tab "Cascading" dengan tree visualization
    - Parent KPI dengan icon ⬆️ di atas
    - Current KPI dengan icon 📍 highlighted dengan border
    - Child KPIs dengan icon ⬇️ di bawah
    - Cascading Method badge: 🔗 Direct (blue), 🔀 Indirect (gray)
    - Achievement mini-bar di samping setiap item (color coded)
    - Clickable cards untuk navigation
    - Tooltip saat hover: Preview target dan actual
- **Business Rules:**
    - Direct Cascade: Realisasi child di-SUM ke parent
    - Indirect Cascade: Realisasi child independen, link hanya traceability
    - KPI dari Performance Tree tidak memiliki parent KPI (top level untuk individu tersebut)
    - Jika bawahan juga atasan, mereka dapat cascade KPI mereka ke level bawah (recursive)
- **Data Rules:**
    - Parent-child relationship tracked di database
    - Achievement % real-time dari latest approved realization
- **Edge Cases:**
    - Jika tidak ada Parent, tampilkan "Top Level KPI (from Performance Tree atau Admin)"
    - Jika tidak ada Child, tampilkan "No cascading to subordinates"
    - Jika Parent KPI di-delete, KPI menjadi orphan dengan warning badge

**Cascading Hierarchy Display:**

| **Level** | **Icon** | **Title** | **Owner** | **Achievement** | **Method** |
| --- | --- | --- | --- | --- | --- |
| Parent | ⬆️ | Revenue Growth Division | Manager HRD | 102% | 🔗 Direct |
| **Current** | **📍** | **Revenue Growth Team** | **Ahmad Dani** | **105%** | **-** |
| Child | ⬇️ | Revenue Region A | Budi Santoso | 110% | 🔗 Direct |
| Child | ⬇️ | Revenue Region B | Citra Dewi | 100% | 🔗 Direct |

---

### US-MT-017d: View Member KPI Detail Panel - Realization Progress

**User Story:**

**As a** Atasan

**I want to** melihat progress realisasi KPI bawahan pada panel detail

**So that** saya dapat memonitor pencapaian per periode, trend, dan mengidentifikasi issues sebelum approval

**Acceptance Criteria (Gherkin):**

- **Given** saya membuka detail KPI bawahan
- **When** saya melihat tab "Progress" di detail panel
- **Then** saya melihat:
    - Tabel realisasi per periode (Monthly/Quarterly)
    - Setiap periode menampilkan: Target, Actual, Achievement %, Status, Approval Status
    - Trend chart achievement sepanjang tahun (line atau bar chart)
    - YTD (Year-to-Date) achievement summary
    - Forecast achievement (jika ada pattern)
- **And** periode dengan pending approval di-highlight
- **And** saya dapat klik periode untuk detail submission dan evidence

**Validation Rules:**

- **UI Rules:**
    - Tab "Progress" default expanded saat review realisasi
    - Tabel dengan sortable columns
    - Color coding per row:
        - 🟢 Green: Achievement ≥ 100%
        - 🟡 Yellow: Achievement 80-99%
        - 🔴 Red: Achievement < 80%
        - ⚪ Gray: Pending atau No data
    - Trend chart dengan dual axis: Target (line) dan Actual (bars)
    - YTD summary card di header section
    - Filter: "All Periods" | "Completed" | "Pending" | "Overdue"
- **Business Rules:**
    - Achievement calculation:
        - Maximize: (Actual / Target) × 100
        - Minimize: (Target / Actual) × 100
    - YTD: Cumulative atau Average tergantung KPI nature
    - Forecast: Linear regression dari historical data (optional feature)
    - Status: On Track (≥100%), Behind (80-99%), At Risk (<80%), Pending
- **Data Rules:**
    - Display all periods dalam tahun berjalan
    - Periode belum berjalan: "-" atau "N/A"
    - Periode overdue tanpa submission: Red badge "Overdue"
- **Edge Cases:**
    - Jika no realization data, tampilkan empty state "No submissions yet"
    - Jika Progressive Target, tampilkan target berbeda per periode di chart

**Realization Progress Table:**

| **Periode** | **Target** | **Actual** | **Achievement** | **Status** | **Approval** |
| --- | --- | --- | --- | --- | --- |
| Jan 2026 | 100 | 95 | 95% | 🟡 Behind | ✅ Approved |
| Feb 2026 | 100 | 110 | 110% | 🟢 On Track | ✅ Approved |
| Mar 2026 | 100 | 105 | 105% | 🟢 On Track | 🟡 Pending Review |
| Apr 2026 | 100 | - | - | ⚪ Not Started | - |

---

### US-MT-017e: View Member KPI Detail Panel - Evidence & Attachments

**User Story:**

**As a** Atasan

**I want to** melihat dan review evidence yang di-upload bawahan untuk setiap realisasi

**So that** saya dapat memvalidasi data sebelum approve dan memastikan kelengkapan dokumentasi

**Acceptance Criteria (Gherkin):**

- **Given** saya membuka detail KPI bawahan
- **When** saya melihat tab "Evidence" di detail panel
- **Then** saya melihat daftar evidence grouped by periode realisasi
- **And** setiap evidence menampilkan:
    - File Name atau URL
    - File Type (PDF, Image, Link)
    - Upload Date dan Uploader name
    - File size
    - Approval status per periode
- **And** saya dapat preview image langsung di modal
- **And** saya dapat download file (PDF, Excel, etc)
- **And** saya dapat open URL di new tab

**Validation Rules:**

- **UI Rules:**
    - Tab "Evidence" dengan counter badge (e.g., "12 files")
    - Grid view dengan thumbnail untuk images
    - Icon per file type: 📄 PDF, 🖼️ Image, 🔗 Link, 📊 Excel
    - Filter by periode
    - Preview modal untuk images dengan zoom capability
    - PDF inline viewer (embedded)
    - Download button prominent untuk all file types
    - Drag & drop area (disabled untuk atasan, info only)
- **Business Rules:**
    - Evidence WAJIB untuk KPI Output realisasi approval (BR-OUT-001)
    - Atasan WAJIB review evidence sebelum approve (BR-OUT-002)
    - Evidence tidak dapat di-delete setelah realisasi approved
    - Multiple evidence per periode diperbolehkan
    - Evidence dari periode approved bersifat immutable (read-only)
- **Data Rules:**
    - Supported formats: PDF, JPG, PNG, Excel, URL
    - Max file size: 10MB per file
    - Storage: Secure cloud storage dengan access control
- **Edge Cases:**
    - Jika file corrupt atau tidak dapat dibuka, tampilkan error dengan opsi "Request Re-upload"
    - Jika URL link broken (404), tampilkan warning badge
    - Jika no evidence untuk KPI Output, block approval dengan error

**Evidence Display:**

| **Periode** | **File Name** | **Type** | **Upload Date** | **Actions** |
| --- | --- | --- | --- | --- |
| Jan 2026 | Revenue_Report_Jan.pdf | 📄 PDF | 5 Feb 2026 | Preview, Download |
| Jan 2026 | Dashboard_Screenshot.png | 🖼️ Image | 5 Feb 2026 | Preview, Download |
| Feb 2026 | https://dashboard.internal/feb | 🔗 Link | 5 Mar 2026 | Open Link |

---

### US-MT-017f: View Member KPI Detail Panel - Approval History

**User Story:**

**As a** Atasan

**I want to** melihat timeline approval/rejection history KPI bawahan

**So that** saya dapat melacak perjalanan KPI dan memahami feedback yang sudah diberikan sebelumnya

**Acceptance Criteria (Gherkin):**

- **Given** saya membuka detail KPI bawahan
- **When** saya melihat tab "History" di detail panel
- **Then** saya melihat timeline aktivitas KPI dari awal hingga saat ini
- **And** setiap entry menampilkan:
    - Timestamp
    - Actor (nama dan role: Bawahan, Atasan, Admin)
    - Action (Created, Edited, Submitted, Approved, Rejected, etc)
    - Notes atau catatan (jika ada)
    - Diff/perubahan (untuk Edit actions)
- **And** rejection entries menampilkan catatan penolakan lengkap
- **And** saya dapat expand entry untuk detail perubahan field

**Validation Rules:**

- **UI Rules:**
    - Tab "History" dengan timeline vertical
    - Icon per action type dengan color coding
    - Avatar actor di samping setiap entry
    - Timestamp format: "DD MMM YYYY, HH:mm WIB"
    - Expandable entries untuk detail notes dan diff
    - Highlight rejection entries dengan red border
    - Show more button jika history panjang (pagination)
- **Business Rules:**
    - Semua status change dan edits di-log untuk audit trail
    - Rejection WAJIB memiliki notes (enforced at reject action)
    - Version control: Setiap edit create new version
    - Approval history include: who approved, when, any adjustment made
- **Data Rules:**
    - Full audit log dari database
    - Notes max 1000 characters
    - Diff tracking untuk field changes (old value → new value)
- **Edge Cases:**
    - Jika KPI di-create via allocation (bukan submit bawahan), first entry "Allocated by [Atasan]"
    - Jika adjustment saat approve, entry "Approved with Adjustment + justifikasi"

**Approval History Timeline:**

| **Timestamp** | **Actor** | **Action** | **Notes** |
| --- | --- | --- | --- |
| 15 Jan 2026, 09:00 | Ahmad Dani | ➕ Created (Draft) | - |
| 16 Jan 2026, 14:30 | Ahmad Dani | ✏️ Edited | Changed target from 100 to 120 |
| 17 Jan 2026, 10:00 | Ahmad Dani | 📤 Submitted | Ready for approval |
| 18 Jan 2026, 11:00 | Manager HRD | ❌ Rejected | Target terlalu tinggi, mohon adjust ke 110 |
| 19 Jan 2026, 09:00 | Ahmad Dani | ✏️ Revised | Adjusted target to 110 |
| 19 Jan 2026, 09:15 | Ahmad Dani | 📤 Re-submitted | - |
| 20 Jan 2026, 10:00 | Manager HRD | ✅ Approved | - |

---

## 2.4 Perbedaan Aturan: KPI Output vs KAI

<aside>
⚠️

**Penting:** KPI Output dan Key Activity Indicators (KAI) memiliki aturan yang berbeda dalam hal approval, monitoring, dan cascading. Atasan perlu memahami perbedaan ini.

</aside>

### 2.4.1 Comparison Table

| **Aspek** | **KPI Output** | **KAI (Key Activity Indicators)** |
| --- | --- | --- |
| **Definisi** | Hasil/outcome yang harus dicapai | Aktivitas/kegiatan yang harus dilakukan untuk mencapai output |
| **Periode Monitoring** | Bulanan atau Triwulanan | Mingguan atau Bulanan |
| **Frekuensi Input Realisasi** | 1x per periode (akhir bulan/triwulan) | Sesuai frekuensi monitoring (bisa multiple per bulan) |
| **Target Type** | Outcome-based (revenue, unit, %) | Activity-based (jumlah meeting, report, dll) |
| **Evidence Requirement** | **Wajib** (dokumen, screenshot, report) | **Opsional** (simplified proof) |
| **Cascade** | ✅ Direct atau Indirect | ❌ Tidak dapat di-cascade |
| **Shared Owner** | ✅ Dapat memiliki Shared Owner | ❌ Selalu individual (no sharing) |
| **Auto-Approve Deadline** | Tanggal 10-15 bulan berikutnya | Lebih cepat (3-5 hari setelah submit) |
| **Bulk Approve** | ✅ Dapat di-bulk approve | ✅ Dapat di-bulk approve |
| **Adjust & Approve** | ✅ Atasan dapat adjust nilai | ⚠️ Terbatas (hanya untuk error correction) |

---

### 2.4.2 Approval Flow: KPI Output

Flow Detail - KPI Output Realisasi

**Workflow:**

1. Bawahan input realisasi dengan **evidence wajib**
2. Status: "Pending Review"
3. Atasan review nilai DAN evidence
4. Actions available:
    - **Approve** → Score ter-update
    - **Reject** → Wajib catatan, bawahan re-submit
    - **Adjust & Approve** → Koreksi nilai + justifikasi
5. Jika Direct Cascade: realisasi anak di-SUM ke parent

**Deadline & Auto-Approve:**

- Bulanan: Auto-approve tanggal 10 bulan berikutnya
- Triwulanan: Auto-approve tanggal 15 bulan pertama triwulan berikutnya

**Evidence Rules:**

- Evidence WAJIB di-upload saat submit realisasi
- Format: PDF, Image, Excel
- Max file size: 10MB
- Atasan HARUS review evidence sebelum approve

---

### 2.4.3 Approval Flow: KAI (Key Activity Indicators)

Flow Detail - KAI Realisasi

**Workflow:**

1. Bawahan input realisasi aktivitas (**evidence opsional**)
2. Status: "Pending Review"
3. Atasan review nilai aktivitas
4. Actions available:
    - **Approve** → Score ter-update
    - **Reject** → Wajib catatan, bawahan re-submit
    - **Adjust & Approve** → Hanya untuk error correction minor
5. Tidak ada cascade (KAI bersifat individual)

**Deadline & Auto-Approve (per frekuensi):**

| **Frekuensi KAI** | **Input Deadline** | **Auto-Approve** |
| --- | --- | --- |
| Mingguan | Senin minggu berikutnya | Rabu minggu berikutnya |
| Bulanan | Tanggal 5 bulan berikutnya | Tanggal 8 bulan berikutnya |

**Evidence Rules:**

- Evidence OPSIONAL (tidak wajib)
- Jika di-upload, atasan dapat review
- Simplified proof: screenshot, foto, atau deskripsi singkat
- Jika tanpa evidence, atasan approve berdasarkan trust

---

### 2.4.4 Business Rules Khusus

**KPI Output Specific:**

| Rule ID | Rule | Enforcement |
| --- | --- | --- |
| BR-OUT-001 | Realisasi KPI Output WAJIB disertai evidence | Block submit tanpa evidence |
| BR-OUT-002 | Atasan WAJIB review evidence sebelum approve | Evidence preview/download mandatory |
| BR-OUT-003 | Direct Cascade: realisasi child di-SUM ke parent | Auto-trigger saat child approved |
| BR-OUT-004 | Shared Owner mendapat achievement identik dengan Owner | System auto-copy achievement |

**KAI Specific:**

| Rule ID | Rule | Enforcement |
| --- | --- | --- |
| BR-KAI-001 | KAI tidak dapat di-cascade ke bawahan | Hide cascade button untuk KAI |
| BR-KAI-002 | KAI tidak dapat memiliki Shared Owner | Hide shared owner option untuk KAI |
| BR-KAI-003 | Evidence KAI bersifat opsional | Allow submit tanpa evidence |
| BR-KAI-004 | KAI mingguan: auto-approve lebih cepat dari bulanan | Shorter SLA untuk weekly KAI |
| BR-KAI-005 | Adjust pada KAI hanya untuk error correction | Require justification "Error Correction" |

---

### 2.4.5 UI Differentiation

**Approval Queue - Visual Indicators:**

| Element | KPI Output | KAI |
| --- | --- | --- |
| Badge | 🎯 Output | 📋 KAI |
| Color | Blue badge | Green badge |
| Evidence Icon | 📎 (always present) | 📎 (jika ada) atau "-" |
| Cascade Indicator | 🔗 jika cascaded | Tidak ada |
| Shared Owner Indicator | 👥 jika shared | Tidak ada |

**Filter Options di Approval Queue:**

- Filter by Type: "All" | "KPI Output" | "KAI"
- Filter by Frequency (KAI only): "Weekly" | "Monthly"
- Filter by Cascade Status (Output only): "Cascaded" | "Non-Cascaded"

---

## 2.5 UI Components

### Screen: Team Dashboard

| Section | Komponen | Behavior |
| --- | --- | --- |
| Header | Team Name + Member Count | Static, menampilkan nama atasan dan jumlah bawahan |
| Summary Cards | Avg Score, Pending Items, At Risk | Clickable untuk filter daftar member |
| Member List | Table dengan Avatar, Nama, Posisi, Score | Click row untuk ke detail member |
| Quick Actions | Bulk Approve, Export | Batch operations untuk efisiensi |

### Screen: Approval Queue

| Section | Komponen | Behavior |
| --- | --- | --- |
| Filter | By Type (KPI/Realisasi), Status, Member | Multi-select filter |
| List | Expandable Cards | Show preview tanpa buka page baru |
| Actions | Approve/Reject/Clarify Buttons | Dengan confirmation modal |
| Bulk | Checkbox + Bulk Approve | Untuk mass approval (tanpa reject) |

### Screen: Cascade KPI

| Section | Komponen | Behavior |
| --- | --- | --- |
| Source KPI | KPI Card (read-only) | Menampilkan parent KPI yang akan di-cascade |
| Method | Radio Button Direct/Indirect | Dengan tooltip penjelasan |
| Recipients | Checkbox List Bawahan | Multi-select dengan search |
| Target Config | Form per recipient | Target dan bobot per bawahan |

---

## 2.6 Business Rules

| Rule ID | Rule | Enforcement |
| --- | --- | --- |
| BR-MT-001 | Reject WAJIB disertai catatan (min 20 chars) | Block reject tanpa catatan |
| BR-MT-002 | Adjust value WAJIB disertai justifikasi (min 20 chars) | Block save tanpa justifikasi |
| BR-MT-003 | Shared Owner tidak dapat input realisasi | Hide input button untuk Shared Owner |
| BR-MT-004 | Auto-approve setelah deadline | System trigger otomatis |
| BR-MT-005 | Atasan hanya lihat bawahan langsung (1 level) | Filter by hierarchy dari MDM |
| BR-MT-006 | Direct Cascade: satuan child = satuan parent | Unit field read-only, auto-copy dari parent |
| BR-MT-007 | Direct Cascade: realisasi child di-sum ke parent | Auto-sum saat child realisasi di-approve |
| BR-MT-008 | Request Clarification tidak reset deadline auto-approve | Timer tetap berjalan |
| BR-MT-009 | Per-item approval tidak memerlukan total bobot = 100% | Allow approve item individual |
| BR-MT-010 | Final portfolio approval WAJIB total bobot = 100% | Block finalize jika bobot tidak valid |
| BR-MT-011 | Setelah final approval, portfolio LOCKED | Perubahan hanya via Change Request |
| BR-MT-012 | Atasan menerima alert untuk KPI At Risk bawahan | In-app + email notification |
| BR-MT-013 | Bulk approve max 50 items per batch | System limit untuk performance |
| BR-MT-014 | Export hanya data bawahan langsung | Filter by hierarchy |

---

## 2.7 Mock Data

[Mock Data: My Team Performance](https://www.notion.so/Mock-Data-My-Team-Performance-1d2dc469e1fe4be9a7d689f518fd93bd?pvs=21)

[Mock Data: Edge Cases - Shared vs Duplicate KPI](https://www.notion.so/Mock-Data-Edge-Cases-Shared-vs-Duplicate-KPI-332985dd7c2644b789dc68092689d34a?pvs=21)