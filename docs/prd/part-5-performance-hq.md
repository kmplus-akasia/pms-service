# Part 5: Performance HQ

## 5.1 Deskripsi Modul

**Performance HQ** adalah modul admin untuk konfigurasi sistem PMS secara keseluruhan, mencakup pengaturan bobot per cohort, manajemen Common KAI, override KPI, serta kontrol periode dan sistem.

| Aspek | Keterangan |
| --- | --- |
| **Target User** | Performance Admin (scoped), Performance Admin HO (full access) |
| **Access Level** | Scoped (Admin unit), Full (Admin HO) |
| **Primary Actions** | Configure Weights, Manage Common KAI, Override KPI, Period Management, System Settings, View Audit Log |

---

## 5.2 Epic Overview

<aside>
⚙️

**Epic: Performance HQ**

Sebagai Performance Admin, saya dapat mengelola konfigurasi sistem PMS secara terpusat untuk memastikan konsistensi aturan, bobot, dan periode performance di seluruh organisasi, serta melakukan override dan monitoring melalui audit trail.

</aside>

**Cakupan User Stories:**

| **Story ID** | **Summary** | **Actor** | **BRD Ref** |
| --- | --- | --- | --- |
| US-HQ-001 | View HQ Dashboard | Performance Admin | BR-030 |
| US-HQ-002 | Configure Weight per Cohort | Performance Admin HO | BR-003, BR-004 |
| US-HQ-003 | Create Common KAI | Performance Admin HO | BR-017 |
| US-HQ-004 | Edit Common KAI | Performance Admin HO | BR-017 |
| US-HQ-005 | Deactivate Common KAI | Performance Admin HO | BR-017 |
| US-HQ-006 | Override KPI Item | Performance Admin | BR-020 |
| US-HQ-007 | Adjust Realization Value | Performance Admin HO | BR-020 |
| US-HQ-008 | Manage Performance Period | Performance Admin HO | BR-021 |
| US-HQ-009 | Configure System Settings | Performance Admin HO | BR-022 |
| US-HQ-010 | View Audit Log | Performance Admin | BR-023 |
| US-HQ-011 | Configure Transition Scoring Rules | Performance Admin HO | BR-024 |
| US-HQ-012 | Bulk Import KPI | Performance Admin HO | BR-025 |

---

## 5.3 User Stories Detail

### US-HQ-001: View HQ Dashboard

**User Story:**

**As a** Performance Admin

**I want to** melihat dashboard ringkasan status PMS

**So that** saya dapat memantau kondisi sistem dan aktivitas terkini

**Acceptance Criteria (Gherkin):**

- **Given** saya login sebagai Performance Admin
- **When** saya membuka menu "Performance HQ"
- **Then** saya melihat dashboard dengan summary cards
- **And** saya melihat current period status (Planning/Monitoring/Finalization)
- **And** saya melihat pending items count (approvals, overdue realization)
- **And** saya melihat recent admin activity feed
- **And** saya melihat quick action buttons

**Validation Rules:**

- **UI Rules:**
    - Summary cards dengan color-coded status
    - Activity feed menampilkan 10 item terakhir
    - Quick actions: Jump ke Weight Config, Common KAI, Period Management
    - Responsive layout untuk berbagai screen size
- **Business Rules:**
    - Performance Admin melihat data sesuai scope (unit sendiri)
    - Performance Admin HO melihat data seluruh organisasi
    - Activity feed hanya menampilkan aktivitas admin (bukan user)
- **Data Rules:**
    - Pending items dihitung real-time dari database
    - Period status dari tb_performance_period
- **Edge Cases:**
    - Jika tidak ada pending items, tampilkan "All caught up!" message

---

### US-HQ-002: Configure Weight per Cohort

**User Story:**

**As a** Performance Admin HO

**I want to** mengatur bobot komponen performance per cohort

**So that** formula perhitungan skor sesuai dengan kebijakan organisasi

**Acceptance Criteria (Gherkin):**

- **Given** saya login sebagai Performance Admin HO
- **When** saya membuka menu "Weight Configuration"
- **Then** saya melihat daftar cohort dengan current weight setting
- **When** saya memilih salah satu cohort
- **Then** saya melihat form input bobot untuk setiap komponen
- **And** sistem menampilkan preview pie chart
- **When** saya mengubah nilai bobot
- **Then** sistem validasi total harus = 100%
- **And** saya WAJIB mengisi justification
- **When** saya klik "Save"
- **Then** bobot tersimpan dan berlaku untuk periode berikutnya
- **And** perubahan tercatat di audit log

**Validation Rules:**

- **UI Rules:**
    - Cohort selector sebagai tabs atau dropdown
    - Input field dengan slider dan number input
    - Real-time pie chart preview
    - Sum validation indicator (green jika = 100%, red jika tidak)
    - Justification textarea (min 50 chars)
- **Business Rules:**
    - Total bobot WAJIB = 100% (BR-HQ-001)
    - Bobot tidak boleh negatif
    - Perubahan berlaku untuk periode yang belum dimulai
    - Periode yang sedang berjalan tidak terpengaruh
- **Data Rules:**
    - Weight components: KPI Impact, KPI Output, KAI
    - Minimum weight per component: 0%
    - Maximum weight per component: 100%
- **Edge Cases:**
    - Jika cohort belum memiliki setting, tampilkan default (Impact 30%, Output 50%, KAI 20%)

**Weight Components per Cohort:**

| **Component** | **Description** | **Default Range** |
| --- | --- | --- |
| KPI Impact | Bobot untuk KPI korporat dari P-KPI | 20-40% |
| KPI Output | Bobot untuk KPI posisi (owner + collaborator) | 40-60% |
| KAI | Bobot untuk Key Activity Indicators | 10-30% |

---

### US-HQ-003: Create Common KAI

**User Story:**

**As a** Performance Admin HO

**I want to** membuat Common KAI baru untuk seluruh pekerja

**So that** ada KAI standar yang berlaku universal di organisasi

**Acceptance Criteria (Gherkin):**

- **Given** saya login sebagai Performance Admin HO
- **When** saya membuka menu "Common KAI Management"
- **And** saya klik tombol "Create New"
- **Then** sistem menampilkan form input Common KAI
- **When** saya mengisi seluruh mandatory fields
- **And** saya klik "Submit for Approval"
- **Then** Common KAI tersimpan dengan status "Pending CHRO Approval"
- **And** notifikasi terkirim ke CHRO
- **When** CHRO approve
- **Then** status berubah menjadi "Published"
- **And** Common KAI otomatis ter-assign ke seluruh pekerja aktif

**Validation Rules:**

- **UI Rules:**
    - Multi-step form atau single page dengan sections
    - Weight per Cohort sebagai expandable table
    - Effective Period dengan date range picker
    - Auto-Assign toggle dengan tooltip explanation
    - Preview sebelum submit
- **Business Rules:**
    - Common KAI WAJIB melalui CHRO approval (BR-HQ-002)
    - Weight harus di-set untuk setiap cohort yang applicable
    - Effective Period harus di masa depan atau current
    - Auto-Assign default: true
- **Technical Rules:**
    - Setelah publish, sistem trigger batch assignment
    - Assignment async dengan progress indicator
- **Edge Cases:**
    - Jika ada Common KAI dengan title serupa, tampilkan warning

**Input Fields:**

| **Field** | **Type** | **Mandatory** | **Validation** |
| --- | --- | --- | --- |
| Title | Text | Ya | Max 200 chars, unique |
| Description | Rich Text | Ya | Max 2000 chars |
| Target Value | Number | Ya | Positive number |
| Target Unit | Text | Ya | Max 50 chars |
| Polarity | Enum | Ya | Higher is Better / Lower is Better |
| Evidence Requirement | Text | Ya | Max 500 chars |
| Monitoring Frequency | Enum | Ya | Weekly / Monthly |
| Weight per Cohort | Number per cohort | Ya | 0-100% per cohort |
| Effective Period | Date Range | Ya | Start ≤ End |
| Auto-Assign | Boolean | Ya | Default: true |
| Applicable Cohorts | Multi-select | Ya | Min 1 cohort |

---

### US-HQ-004: Edit Common KAI

**User Story:**

**As a** Performance Admin HO

**I want to** mengedit Common KAI yang sudah published

**So that** saya dapat memperbaiki atau update definisi sesuai kebutuhan

**Acceptance Criteria (Gherkin):**

- **Given** saya login sebagai Performance Admin HO
- **And** ada Common KAI dengan status "Published"
- **When** saya klik tombol "Edit" pada item
- **Then** sistem menampilkan form edit dengan current values
- **When** saya mengubah field yang diperlukan
- **And** saya klik "Submit for Approval"
- **Then** perubahan tersimpan dengan status "Pending CHRO Approval"
- **When** CHRO approve
- **Then** perubahan diterapkan
- **And** KPI existing yang menggunakan Common KAI ter-update

**Validation Rules:**

- **UI Rules:**
    - Form edit sama dengan form create
    - Impact preview menampilkan jumlah pekerja yang terpengaruh
    - Changelog visible di sidebar
    - Warning banner untuk perubahan yang impact ke existing assignments
- **Business Rules:**
    - Edit Common KAI WAJIB melalui CHRO approval (BR-HQ-002)
    - Minor edit (description, evidence): apply langsung ke existing
    - Major edit (target, weight): opsi untuk apply ke existing atau hanya new
- **Technical Rules:**
    - Version history tersimpan
    - Propagation ke existing assignments bersifat optional
- **Edge Cases:**
    - Jika Common KAI sudah ada realisasi, tampilkan warning impact

---

### US-HQ-005: Deactivate Common KAI

**User Story:**

**As a** Performance Admin HO

**I want to** menonaktifkan Common KAI yang sudah tidak relevan

**So that** KAI tersebut tidak lagi muncul di Performance Tree baru

**Acceptance Criteria (Gherkin):**

- **Given** saya login sebagai Performance Admin HO
- **And** ada Common KAI dengan status "Published"
- **When** saya klik tombol "Deactivate"
- **Then** sistem menampilkan konfirmasi dengan impact analysis
- **And** saya WAJIB mengisi alasan deactivation
- **When** saya konfirmasi deactivation
- **Then** status berubah menjadi "Inactive"
- **And** Common KAI tidak lagi auto-assign ke pekerja baru
- **And** KPI existing yang menggunakan Common KAI tetap valid sampai periode berakhir

**Validation Rules:**

- **UI Rules:**
    - Deactivation modal dengan impact count
    - Textarea untuk alasan deactivation
    - Option untuk immediate removal atau end-of-period removal
- **Business Rules:**
    - Deactivation tidak memerlukan CHRO approval
    - Inactive Common KAI tidak muncul di new assignments
    - Existing assignments tetap valid hingga periode berakhir
    - History tetap tersimpan untuk audit
- **Technical Rules:**
    - Soft delete (status change)
    - Deactivation reason logged
- **Edge Cases:**
    - Jika Common KAI adalah satu-satunya KAI untuk cohort tertentu, tampilkan warning

---

### US-HQ-006: Override KPI Item

**User Story:**

**As a** Performance Admin

**I want to** melakukan override pada KPI item tanpa melalui approval workflow

**So that** saya dapat mengatasi situasi khusus atau koreksi data

**Acceptance Criteria (Gherkin):**

- **Given** saya login sebagai Performance Admin
- **When** saya membuka menu "KPI Override"
- **And** saya search atau browse KPI item target
- **Then** saya melihat detail KPI item tersebut
- **When** saya memilih action override (Add/Edit/Delete/Change Owner)
- **Then** sistem menampilkan form override
- **And** saya WAJIB mengisi justification (min 50 chars)
- **And** saya WAJIB attach reference document
- **When** saya klik "Execute Override"
- **Then** override diterapkan immediately
- **And** perubahan tercatat di audit log dengan detail lengkap

**Validation Rules:**

- **UI Rules:**
    - Search dengan filter: Employee, Position, Period, KPI Type
    - Detail panel dengan current values highlighted
    - Override form dengan mandatory justification
    - File upload untuk reference document
    - Confirmation modal dengan summary perubahan
- **Business Rules:**
    - Performance Admin hanya dapat override dalam scope unit sendiri
    - Performance Admin HO dapat override seluruh organisasi
    - Override WAJIB audit trail (BR-HQ-003)
    - Justification minimum 50 characters
    - Reference document mandatory
- **Data Rules:**
    - All overrides logged ke tb_audit_log
    - Original values preserved untuk rollback
- **Edge Cases:**
    - Jika KPI sudah finalized, tampilkan additional warning

**Override Capabilities:**

| **Action** | **Scope** | **Perf Admin** | **Perf Admin HO** |
| --- | --- | --- | --- |
| Add KPI to Position | Any position in scope | ✅ (own unit) | ✅ (all) |
| Edit KPI Item | Any item in scope | ✅ (own unit) | ✅ (all) |
| Delete KPI Item | Any item in scope | ✅ (own unit) | ✅ (all) |
| Change Owner | Any item in scope | ✅ (own unit) | ✅ (all) |
| Adjust Realization | Any period | ❌ | ✅ |

---

### US-HQ-007: Adjust Realization Value

**User Story:**

**As a** Performance Admin HO

**I want to** mengkoreksi nilai realisasi KPI

**So that** saya dapat mengatasi kesalahan input atau data discrepancy

**Acceptance Criteria (Gherkin):**

- **Given** saya login sebagai Performance Admin HO
- **When** saya membuka detail KPI item dari Override menu
- **And** saya memilih action "Adjust Realization"
- **Then** sistem menampilkan history realisasi per periode
- **When** saya memilih periode yang akan dikoreksi
- **Then** saya dapat mengubah nilai realisasi
- **And** saya WAJIB mengisi justification
- **And** saya WAJIB attach corrected evidence
- **When** saya klik "Save Adjustment"
- **Then** nilai realisasi ter-update
- **And** skor otomatis ter-recalculate
- **And** perubahan tercatat di audit log

**Validation Rules:**

- **UI Rules:**
    - Timeline view untuk history realisasi
    - Before/After comparison display
    - Corrected evidence uploader
    - Recalculation preview sebelum save
- **Business Rules:**
    - Hanya Performance Admin HO yang dapat adjust realization
    - Adjustment berlaku retroactive
    - Skor otomatis recalculate setelah adjustment
    - Original value dan evidence preserved
- **Technical Rules:**
    - Trigger score recalculation async
    - Notify affected employee via notification
- **Edge Cases:**
    - Jika periode sudah closed/finalized, require additional approval level

---

### US-HQ-008: Manage Performance Period

**User Story:**

**As a** Performance Admin HO

**I want to** mengelola periode performance (planning, monitoring, finalization)

**So that** saya dapat mengontrol lifecycle PMS sesuai kalender organisasi

**Acceptance Criteria (Gherkin):**

- **Given** saya login sebagai Performance Admin HO
- **When** saya membuka menu "Period Management"
- **Then** saya melihat daftar periode dengan status
- **And** saya melihat timeline visual
- **When** saya klik "Create New Period"
- **Then** saya dapat set tanggal untuk setiap phase
- **When** saya klik "Open Planning"
- **Then** periode planning aktif dan user dapat draft KPI
- **When** saya klik "Close Planning"
- **Then** KPI terkunci dan monitoring dimulai
- **When** saya klik "Force Finalize"
- **Then** seluruh KPI terkunci dan skor final dihitung

**Validation Rules:**

- **UI Rules:**
    - Calendar view atau Gantt-style timeline
    - Status badges: Draft, Planning Open, Planning Closed, Monitoring, Finalized
    - Action buttons sesuai current state
    - Confirmation modal untuk setiap state change
- **Business Rules:**
    - Hanya satu periode yang bisa "Planning Open" pada satu waktu
    - Close Planning tidak bisa di-undo (require new extension)
    - Force Finalize adalah action irreversible
    - Cannot delete period yang sudah memiliki data (BR-HQ-004)
- **Data Rules:**
    - Period types: Annual, Quarterly (Triwulan)
    - Each period has: Planning Start/End, Monitoring Start/End, Finalization Date
- **Edge Cases:**
    - Jika ada KPI yang belum approved saat Close Planning, tampilkan warning

**Period Controls:**

| **Action** | **Effect** | **Reversible** |
| --- | --- | --- |
| Create Period | Buat periode baru dengan status Draft | Ya (delete jika belum ada data) |
| Open Planning | Aktifkan mode planning, user bisa draft/edit KPI | Ya (revert ke Draft) |
| Close Planning | Lock KPI, mulai monitoring | Tidak (hanya bisa extend) |
| Extend Planning | Tambah waktu planning (max 30 hari) | Ya |
| Force Finalize | Lock everything, calculate final scores | Tidak |

---

### US-HQ-009: Configure System Settings

**User Story:**

**As a** Performance Admin HO

**I want to** mengkonfigurasi parameter sistem PMS

**So that** sistem berperilaku sesuai dengan kebijakan dan kebutuhan organisasi

**Acceptance Criteria (Gherkin):**

- **Given** saya login sebagai Performance Admin HO
- **When** saya membuka menu "System Settings"
- **Then** saya melihat daftar configurable settings dengan current values
- **When** saya mengubah nilai setting
- **Then** sistem validasi sesuai constraint
- **When** saya klik "Save"
- **Then** setting ter-update
- **And** perubahan tercatat di audit log (BR-HQ-005)

**Validation Rules:**

- **UI Rules:**
    - Settings grouped by category
    - Input type sesuai setting type (number, toggle, multi-select)
    - Default value indicator
    - Reset to default button per setting
- **Business Rules:**
    - Setting changes apply immediately (unless specified)
    - Some settings require system restart notification
    - All changes logged (BR-HQ-005)
- **Technical Rules:**
    - Settings cached, refresh on change
    - Validation per setting type
- **Edge Cases:**
    - Jika setting invalid, block save dengan error message

**Configurable Settings:**

| **Setting** | **Type** | **Default** | **Description** |
| --- | --- | --- | --- |
| Auto-approve timeout (days) | Number | 5 | Hari sebelum auto-approve KPI |
| Realization deadline (day of month) | Number | 5 | Batas input realisasi bulanan |
| Review deadline (day of month) | Number | 10 | Batas review atasan |
| Cut-off date (day of month) | Number | 25 | Tanggal cut-off perhitungan |
| Min evidence file size (KB) | Number | 10 | Minimum ukuran file evidence |
| Max evidence file size (MB) | Number | 10 | Maximum ukuran file evidence |
| Allowed evidence types | Multi-select | PDF, JPG, PNG, XLSX | Tipe file yang diizinkan |
| Score decimal places | Number | 2 | Presisi desimal skor |
| Enable notifications | Boolean | true | Toggle notifikasi sistem |
| KAI Auto-approve Weekly (day) | Enum | Wednesday | Hari auto-approve KAI mingguan |
| KAI Auto-approve Monthly (day) | Number | 8 | Tanggal auto-approve KAI bulanan |

---

### US-HQ-010: View Audit Log

**User Story:**

**As a** Performance Admin

**I want to** melihat audit log aktivitas admin

**So that** saya dapat memantau perubahan dan memenuhi compliance requirement

**Acceptance Criteria (Gherkin):**

- **Given** saya login sebagai Performance Admin
- **When** saya membuka menu "Audit Log"
- **Then** saya melihat daftar log entries
- **And** saya dapat filter berdasarkan: Event Type, Date Range, User, Target
- **And** saya dapat search berdasarkan keyword
- **When** saya klik salah satu entry
- **Then** saya melihat detail lengkap termasuk before/after values
- **And** saya dapat export log ke Excel/CSV

**Validation Rules:**

- **UI Rules:**
    - Table view dengan sorting dan filtering
    - Date range picker default: last 30 days
    - Detail panel slide-in atau modal
    - Export button dengan format selection
    - Pagination: 50 entries per page
- **Business Rules:**
    - Performance Admin melihat log sesuai scope (own unit)
    - Performance Admin HO melihat seluruh log
    - Log retention: 7 years (compliance)
    - Log cannot be edited or deleted
- **Data Rules:**
    - Fields: Timestamp, Event Type, Actor, Target, Before Value, After Value, Justification
    - Event Types: Weight Change, Common KAI Change, Override Action, Period Change, Setting Change
- **Edge Cases:**
    - Jika date range terlalu lebar (lebih dari 1 year), tampilkan warning performance

**Logged Events:**

| **Event Type** | **Fields Captured** |
| --- | --- |
| Weight Change | Cohort, Old values, New values, Justification, Changed by, Timestamp |
| Common KAI Change | Action (Create/Edit/Deactivate), Item details, Approval chain, Changed by, Timestamp |
| Override Action | Type, Target Employee, Target KPI, Before/After, Justification, Reference Doc, Changed by, Timestamp |
| Period Change | Action, Period ID, Dates affected, Changed by, Timestamp |
| Setting Change | Setting name, Old value, New value, Changed by, Timestamp |
| Realization Adjustment | Employee, KPI, Period, Old value, New value, Justification, Changed by, Timestamp |

---

### US-HQ-011: Configure Transition Scoring Rules

**User Story:**

**As a** Performance Admin HO

**I want to** mengkonfigurasi aturan scoring untuk masa transisi

**So that** sistem dapat menangani perhitungan skor selama periode migrasi/transisi

**Acceptance Criteria (Gherkin):**

- **Given** saya login sebagai Performance Admin HO
- **And** sistem sedang dalam masa transisi PMS
- **When** saya membuka menu "Transition Settings"
- **Then** saya melihat konfigurasi khusus masa transisi
- **And** saya dapat set "Additional Points" configuration
- **And** saya dapat set "Boundary Points" configuration
- **When** saya save konfigurasi
- **Then** aturan transisi berlaku untuk periode yang ditentukan

**Validation Rules:**

- **UI Rules:**
    - Form dengan section: Additional Points, Boundary Points
    - Period selector untuk masa berlaku
    - Preview perhitungan dengan sample data
    - Warning banner bahwa ini adalah fitur transisi
- **Business Rules:**
    - Transition rules hanya berlaku untuk periode yang dipilih
    - Additional Points: kompensasi untuk KPI yang belum terinput
    - Boundary Points: adjustment untuk edge cases
    - Admin HO approval required
- **Technical Rules:**
    - Transition config stored separately dari main config
    - Feature flag untuk enable/disable transition mode
- **Edge Cases:**
    - Jika transition period overlap dengan normal period, prioritaskan transition rules

**Transition Configuration Fields:**

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| Transition Period | Select | Periode yang berlaku aturan transisi |
| Additional Points Enabled | Boolean | Toggle fitur additional points |
| Additional Points Value | Number | Nilai default additional points |
| Additional Points Cohorts | Multi-select | Cohort yang eligible |
| Boundary Points Enabled | Boolean | Toggle fitur boundary points |
| Boundary Min Score | Number | Minimum skor yang diizinkan |
| Boundary Max Score | Number | Maximum skor yang diizinkan |

---

### US-HQ-012: Bulk Import KPI

**User Story:**

**As a** Performance Admin HO

**I want to** melakukan bulk import KPI dari file Excel

**So that** saya dapat mempercepat setup KPI untuk banyak posisi sekaligus

**Acceptance Criteria (Gherkin):**

- **Given** saya login sebagai Performance Admin HO
- **When** saya membuka menu "Bulk Import"
- **Then** saya dapat download template Excel
- **When** saya upload file Excel yang sudah diisi
- **Then** sistem melakukan validation
- **And** sistem menampilkan preview data dengan validation status
- **When** validation passed
- **And** saya klik "Execute Import"
- **Then** KPI ter-import ke sistem
- **And** summary report ditampilkan

**Validation Rules:**

- **UI Rules:**
    - Download template button
    - Drag-and-drop upload area
    - Validation result table dengan row status (Valid/Invalid)
    - Error detail per row
    - Progress bar untuk import process
- **Business Rules:**
    - Maximum 1000 rows per import
    - All mandatory fields must be filled
    - Position must exist in system
    - Dictionary item reference optional
- **Technical Rules:**
    - Async processing untuk large files
    - Transaction rollback jika ada error
    - Import log tersimpan
- **Edge Cases:**
    - Jika file corrupt, tampilkan error message
    - Jika partial success, tampilkan summary dengan failed rows

**Template Columns:**

| **Column** | **Mandatory** | **Validation** |
| --- | --- | --- |
| Position Code | Ya | Must exist in tb_position_master_v2 |
| KPI Type | Ya | Output / KAI |
| KPI Title | Ya | Max 200 chars |
| Description | Ya | Max 2000 chars |
| Target Value | Ya | Numeric |
| Target Unit | Ya | Max 50 chars |
| Weight | Ya | 1-100% |
| Polarity | Ya | Higher is Better / Lower is Better |
| Dictionary Item ID | Tidak | Must exist if provided |
| Owner Employee ID | Ya | Must exist in tb_employee |

---

## 5.4 UI Components

### Screen: HQ Dashboard

| **Section** | **Komponen** | **Behavior** |
| --- | --- | --- |
| Navigation | Sidebar Menu | Collapsible, icon + label |
| Summary | Status Cards (4 cards) | Current period, pending approvals, overdue items, recent changes |
| Quick Actions | Button Group | Weight Config, Common KAI, Period Mgmt shortcuts |
| Activity Feed | Timeline List | Last 10 admin actions with timestamp |

### Screen: Weight Configuration

| **Section** | **Komponen** | **Behavior** |
| --- | --- | --- |
| Cohort Selector | Tab Bar atau Dropdown | Switch between cohorts |
| Weight Inputs | Number fields + Sliders | Real-time sum validation (must = 100%) |
| Preview | Pie Chart | Visual representation of weights |
| Justification | Textarea | Min 50 chars, required for save |
| Save | Button + Confirmation Modal | Validate all before save |

### Screen: Common KAI Management

| **Section** | **Komponen** | **Behavior** |
| --- | --- | --- |
| Filter Bar | Status, Period, Search | Multi-filter support |
| List View | Table dengan status badges | Sortable columns |
| Row Actions | Edit, Deactivate buttons | Inline or dropdown menu |
| Bulk Actions | Checkbox selection | Bulk deactivate option |
| Create Button | FAB atau Header Button | Open create form |

### Screen: Audit Log

| **Section** | **Komponen** | **Behavior** |
| --- | --- | --- |
| Filters | Event Type, Date Range, User, Keyword | Collapsible filter panel |
| Log Table | Paginated table | 50 rows per page, sortable |
| Detail Panel | Slide-in panel | Full details with before/after |
| Export | Button dengan format selector | Excel/CSV export |

---

## 5.5 Business Rules

| **Rule ID** | **Rule** | **Enforcement** |
| --- | --- | --- |
| BR-HQ-001 | Weight changes require justification (min 50 chars) | Block save tanpa justification |
| BR-HQ-002 | Common KAI create/edit requires CHRO approval | Workflow enforcement, status "Pending CHRO Approval" |
| BR-HQ-003 | All override actions must have audit trail | System logging mandatory, include justification + reference doc |
| BR-HQ-004 | Cannot delete period with existing data | Block delete button, show error if attempted |
| BR-HQ-005 | All settings changes logged to audit | Auto audit on save |
| BR-HQ-006 | Performance Admin scope limited to own unit | Data filtering based on user's organizational unit |
| BR-HQ-007 | Audit log retention 7 years | System policy, no manual delete |
| BR-HQ-008 | Realization adjustment only by Admin HO | Role-based access control |
| BR-HQ-009 | Force Finalize is irreversible | Multi-step confirmation, require typed confirmation |
| BR-HQ-010 | Bulk import max 1000 rows | Validation error if exceeded |

---

## 5.6 Access Control Matrix

| **Feature** | **Perf Admin** | **Perf Admin HO** |
| --- | --- | --- |
| View HQ Dashboard | ✅ (scoped) | ✅ (all) |
| View Weight Config | ✅ | ✅ |
| Edit Weight Config | ❌ | ✅ |
| View Common KAI | ✅ | ✅ |
| Manage Common KAI | ❌ | ✅ |
| Override KPI (own scope) | ✅ | ✅ |
| Override KPI (all) | ❌ | ✅ |
| Adjust Realization | ❌ | ✅ |
| Period Management | ❌ | ✅ |
| System Settings | ❌ | ✅ |
| View Audit Log | ✅ (own scope) | ✅ (all) |
| Transition Settings | ❌ | ✅ |
| Bulk Import | ❌ | ✅ |

---
