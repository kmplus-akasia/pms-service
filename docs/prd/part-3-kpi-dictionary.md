# Part 3: KPI Dictionary

## 3.1 Deskripsi Modul

**KPI Dictionary** adalah katalog item KPI terstandarisasi yang dapat digunakan sebagai referensi saat perencanaan KPI.

| Aspek | Keterangan |
| --- | --- |
| **Target User** | Seluruh pekerja (view), Performance Admin (manage) |
| **Access Level** | Read (all), Write (admin) |
| **Primary Actions** | Browse, Search, Use Item, Submit New, Validate, Approve |

---

## 3.2 Epic Overview

<aside>
📚

**Epic: KPI Dictionary**

Sebagai pengguna sistem PMS, saya dapat mengakses katalog KPI terstandarisasi untuk memastikan konsistensi definisi KPI di seluruh organisasi, mulai dari browsing item, menggunakan item untuk perencanaan, hingga mengajukan item baru dengan dual-approval workflow.

</aside>

**Cakupan User Stories:**

| **Story ID** | **Summary** | **Actor** | **BRD Ref** |
| --- | --- | --- | --- |
| US-KD-001 | Browse KPI Dictionary | Pekerja | BR-007 |
| US-KD-002 | Search KPI Dictionary | Pekerja | BR-007 |
| US-KD-003 | View Dictionary Item Detail | Pekerja | BR-007 |
| US-KD-004 | Use Dictionary Item untuk KPI Planning | Pekerja | BR-007, BR-008 |
| US-KD-005 | Submit New Dictionary Item | Pekerja | BR-007 |
| US-KD-006 | Validate Dictionary Item (Level 1) | Validator | BR-007 |
| US-KD-007 | Approve Dictionary Item (Level 2) | Approver | BR-007 |
| US-KD-008 | Edit Dictionary Item | Performance Admin | BR-007 |
| US-KD-009 | Deprecate Dictionary Item | Performance Admin | BR-007 |
| US-KD-010 | View Dictionary Usage Statistics | Performance Admin | BR-007 |

---

## 3.3 User Stories Detail

### US-KD-001: Browse KPI Dictionary

**User Story:**

**As a** Pekerja

**I want to** melihat katalog KPI yang tersedia di dictionary

**So that** saya dapat menemukan KPI standar yang sesuai dengan pekerjaan saya

**Acceptance Criteria (Gherkin):**

- **Given** saya login sebagai Pekerja
- **When** saya membuka menu "KPI Dictionary"
- **Then** saya melihat daftar KPI items dalam format card atau list
- **And** saya dapat filter berdasarkan KPI Type (Output/KAI)
- **And** saya dapat filter berdasarkan BSC Perspective
- **And** saya dapat filter berdasarkan Function/Department
- **And** saya dapat filter berdasarkan Cohort

**Validation Rules:**

- **UI Rules:**
    - Default view: Card Grid (toggle ke List View available)
    - Setiap card menampilkan: Title, Type Badge, BSC Perspective, Usage Count
    - Filter panel collapsible di sidebar
    - Pagination: 20 items per page
- **Business Rules:**
    - Hanya tampilkan item dengan status "Published"
    - Item di-sort berdasarkan Usage Count (descending) by default
    - Filter dapat dikombinasikan (AND logic)
- **Data Rules:**
    - Data dictionary dari tb_kpi_dictionary
    - Usage count dihitung dari Performance Tree references
- **Edge Cases:**
    - Jika tidak ada item yang match filter, tampilkan empty state dengan suggestion

---

### US-KD-002: Search KPI Dictionary

**User Story:**

**As a** Pekerja

**I want to** mencari KPI berdasarkan keyword

**So that** saya dapat cepat menemukan KPI yang relevan

**Acceptance Criteria (Gherkin):**

- **Given** saya berada di halaman KPI Dictionary
- **When** saya mengetik keyword di search bar
- **Then** sistem menampilkan hasil yang match dengan keyword
- **And** pencarian mencakup field: Title, Description, Evidence Requirement
- **And** hasil di-highlight pada bagian yang match

**Validation Rules:**

- **UI Rules:**
    - Search bar sticky di header
    - Real-time search (debounce 300ms)
    - Minimum 2 karakter untuk trigger search
    - Clear button untuk reset search
- **Business Rules:**
    - Search case-insensitive
    - Partial match supported (contains)
    - Search result tetap respect active filters
- **Technical Rules:**
    - Full-text search dengan indexing
    - Maximum 100 results displayed
- **Edge Cases:**
    - Jika keyword terlalu pendek, tampilkan hint "Minimum 2 karakter"

---

### US-KD-003: View Dictionary Item Detail

**User Story:**

**As a** Pekerja

**I want to** melihat detail lengkap item KPI dari dictionary

**So that** saya dapat memahami definisi dan requirement sebelum menggunakan

**Acceptance Criteria (Gherkin):**

- **Given** saya berada di halaman KPI Dictionary
- **When** saya klik salah satu item KPI
- **Then** saya melihat halaman detail item tersebut
- **And** saya melihat seluruh field definisi KPI
- **And** saya melihat usage statistics (berapa kali digunakan)
- **And** saya melihat tombol "Use This Item" untuk apply ke Performance Tree

**Validation Rules:**

- **UI Rules:**
    - Modal atau full-page detail (configurable)
    - Status badge di header (Published, Deprecated)
    - Read-only untuk semua field
    - Usage chart menampilkan trend penggunaan
- **Business Rules:**
    - Semua pekerja dapat view detail
    - Edit button hanya visible untuk Performance Admin
- **Data Rules:**
    - Display Fields sesuai Dictionary Item Schema
- **Edge Cases:**
    - Jika item deprecated, tampilkan warning banner

---

### US-KD-004: Use Dictionary Item untuk KPI Planning

**User Story:**

**As a** Pekerja

**I want to** menggunakan item dari dictionary untuk KPI planning saya

**So that** saya dapat mengadopsi KPI standar dengan cepat dan konsisten

**Acceptance Criteria (Gherkin):**

- **Given** saya berada di detail view sebuah dictionary item
- **And** item tersebut applicable untuk cohort saya
- **When** saya klik tombol "Use This Item"
- **Then** sistem membuka form draft KPI dengan field ter-prefill dari dictionary
- **And** saya dapat customize Target Value sesuai posisi saya
- **And** saya dapat customize Bobot (jika bukan Fixed Weight)
- **When** saya klik "Simpan Draft"
- **Then** KPI tersimpan di Performance Tree saya dengan link ke dictionary item

**Validation Rules:**

- **UI Rules:**
    - Form prefilled dengan visual indicator "From Dictionary"
    - Field dari dictionary: Title, Description, Unit, Polarity, Evidence Requirement (read-only)
    - Field customizable: Target Value, Bobot (jika non-fixed)
    - Fixed Weight ditampilkan sebagai read-only dengan lock icon
- **Business Rules:**
    - Fixed Weight item: Bobot tidak dapat diubah (BR-KD-001)
    - Non-Fixed Weight: Bobot dapat di-customize (1-100%)
    - Item harus sesuai dengan Applicable Cohorts user
    - Usage count di-increment setelah submit approval
- **Technical Rules:**
    - Link referensi ke dictionary item tersimpan
    - Jika dictionary item di-update, KPI existing tidak berubah
- **Edge Cases:**
    - Jika item tidak applicable untuk cohort user, tombol disabled dengan tooltip

---

### US-KD-005: Submit New Dictionary Item

**User Story:**

**As a** Pekerja

**I want to** mengajukan item KPI baru ke dictionary

**So that** KPI yang sering digunakan dapat distandarisasi

**Acceptance Criteria (Gherkin):**

- **Given** saya tidak menemukan KPI yang sesuai di dictionary
- **When** saya klik tombol "Submit New Item"
- **Then** sistem menampilkan form input untuk item baru
- **And** saya mengisi seluruh mandatory fields
- **When** saya klik "Submit"
- **Then** item tersimpan dengan status "Pending Validation"
- **And** notifikasi terkirim ke Validator

**Validation Rules:**

- **UI Rules:**
    - Form multi-step atau single-page (configurable)
    - Mandatory field indicator (*)
    - Preview sebelum submit
    - Progress indicator untuk multi-step form
- **Business Rules:**
    - Semua pekerja dapat submit new item
    - Item masuk ke queue validation
    - Submitter dapat edit selama masih Draft
- **Data Rules:**
    - Input Fields sesuai tabel di bawah
    - All mandatory fields harus terisi
- **Edge Cases:**
    - Jika item dengan title serupa sudah ada, tampilkan warning "Possible duplicate"

**Input Fields:**

| **Field** | **Type** | **Mandatory** | **Validation** |
| --- | --- | --- | --- |
| Title | Text | Ya | Max 200 chars, unique check |
| Description | Rich Text | Ya | Max 2000 chars |
| KPI Type | Enum | Ya | Output / KAI |
| Recommended Target | Text | Ya | Numeric or range |
| Target Unit | Text | Ya | Max 50 chars |
| Polarity | Enum | Ya | Higher is Better / Lower is Better |
| BSC Perspective | Enum | Ya | Financial / Customer / Internal Process / Learning & Growth |
| Applicable Functions | Multi-select | Ya | Min 1 selection |
| Applicable Cohorts | Multi-select | Ya | Min 1 selection |
| Evidence Requirement | Text | Ya | Max 500 chars |
| Suggested Fixed Weight | Number / None | Tidak | 0-100% atau kosong |

---

### US-KD-006: Validate Dictionary Item (Level 1)

**User Story:**

**As a** Validator (Performance Admin)

**I want to** me-review dan validasi item dictionary yang di-submit

**So that** item memenuhi standar kualitas sebelum approval final

**Acceptance Criteria (Gherkin):**

- **Given** ada item dengan status "Pending Validation"
- **When** saya membuka queue validation
- **Then** saya melihat daftar item yang perlu di-validasi
- **And** saya dapat melihat detail item beserta submitter info
- **When** saya klik "Validate"
- **Then** status item berubah menjadi "Validated"
- **And** item otomatis masuk ke queue approval (Level 2)
- **When** saya klik "Reject"
- **Then** saya WAJIB mengisi catatan penolakan
- **And** status item berubah menjadi "Rejected"
- **And** notifikasi terkirim ke submitter

**Validation Rules:**

- **UI Rules:**
    - Queue view dengan filter dan sort
    - Detail panel dengan comparison view (jika ada similar items)
    - Comment thread untuk komunikasi dengan submitter
- **Business Rules:**
    - Validator me-review: definisi, target, evidence requirement
    - Validator dapat request revision tanpa reject
    - Validator tidak boleh = Submitter (BR-KD-003)
- **Technical Rules:**
    - Auto-assign ke validator pool berdasarkan workload
    - SLA: 3 hari kerja untuk validasi
- **Edge Cases:**
    - Jika validator tidak action dalam SLA, escalate ke supervisor

---

### US-KD-007: Approve Dictionary Item (Level 2)

**User Story:**

**As a** Approver (Performance Admin HO)

**I want to** melakukan final review dan publish item dictionary

**So that** item dapat digunakan oleh seluruh pekerja

**Acceptance Criteria (Gherkin):**

- **Given** ada item dengan status "Pending Approval" (sudah validated)
- **When** saya membuka queue approval
- **Then** saya melihat daftar item yang perlu di-approve
- **And** saya dapat melihat detail item beserta validation notes
- **And** saya dapat set/modify Fixed Weight jika diperlukan
- **When** saya klik "Approve & Publish"
- **Then** status item berubah menjadi "Published"
- **And** item muncul di dictionary untuk semua user
- **And** notifikasi terkirim ke submitter
- **When** saya klik "Reject"
- **Then** saya WAJIB mengisi catatan penolakan
- **And** status item berubah menjadi "Rejected"

**Validation Rules:**

- **UI Rules:**
    - Queue view dengan validation history
    - Fixed Weight setter dengan recommendation engine
    - Preview how item will appear in dictionary
- **Business Rules:**
    - Approver melakukan final review
    - Approver dapat set Fixed Weight (yang akan berlaku untuk semua user)
    - Approver tidak boleh = Validator (BR-KD-003)
- **Technical Rules:**
    - Auto-assign ke approver pool berdasarkan workload
    - SLA: 5 hari kerja untuk approval
- **Edge Cases:**
    - Jika approver tidak action dalam SLA, escalate ke senior approver

---

### US-KD-008: Edit Dictionary Item

**User Story:**

**As a** Performance Admin

**I want to** mengedit item dictionary yang sudah published

**So that** saya dapat memperbaiki atau update definisi KPI

**Acceptance Criteria (Gherkin):**

- **Given** saya adalah Performance Admin
- **And** ada item dictionary dengan status "Published"
- **When** saya klik tombol "Edit" pada item detail
- **Then** sistem menampilkan form edit dengan current values
- **And** saya dapat mengubah field yang diperlukan
- **When** saya klik "Save Changes"
- **Then** perubahan tersimpan dengan version history
- **And** item tetap Published (tidak perlu re-approval untuk minor edit)

**Validation Rules:**

- **UI Rules:**
    - Form edit sama dengan form create
    - Changelog visible di sidebar
    - Preview perubahan sebelum save
- **Business Rules:**
    - Minor edit: tidak perlu re-approval (description, evidence req)
    - Major edit: perlu re-approval (target, unit, polarity, fixed weight)
    - Version history tersimpan untuk audit
- **Technical Rules:**
    - All changes logged dengan timestamp dan editor
    - Previous versions retrievable
- **Edge Cases:**
    - Jika item sedang digunakan di KPI aktif, tampilkan warning impact

---

### US-KD-009: Deprecate Dictionary Item

**User Story:**

**As a** Performance Admin

**I want to** men-deprecate item dictionary yang sudah tidak relevan

**So that** item tidak lagi digunakan untuk KPI baru

**Acceptance Criteria (Gherkin):**

- **Given** saya adalah Performance Admin
- **And** ada item dictionary dengan status "Published"
- **When** saya klik tombol "Deprecate" pada item detail
- **Then** sistem menampilkan konfirmasi dengan impact analysis
- **And** saya WAJIB mengisi alasan deprecation
- **When** saya konfirmasi deprecation
- **Then** status item berubah menjadi "Deprecated"
- **And** item tidak muncul di browse/search default
- **And** KPI existing yang menggunakan item tetap valid

**Validation Rules:**

- **UI Rules:**
    - Deprecation modal dengan impact count
    - Textarea untuk alasan deprecation
    - Option untuk suggest replacement item
- **Business Rules:**
    - Published item tidak dapat di-delete, hanya deprecate (BR-KD-004)
    - Deprecated item masih visible dengan filter khusus
    - KPI existing tidak terpengaruh
- **Technical Rules:**
    - Soft delete (status change, not physical delete)
    - Deprecation reason logged
- **Edge Cases:**
    - Jika item masih banyak digunakan, sistem warning sebelum deprecate

---

### US-KD-010: View Dictionary Usage Statistics

**User Story:**

**As a** Performance Admin

**I want to** melihat statistik penggunaan dictionary items

**So that** saya dapat menganalisis adoption dan identify improvement areas

**Acceptance Criteria (Gherkin):**

- **Given** saya adalah Performance Admin
- **When** saya membuka menu "Dictionary Analytics"
- **Then** saya melihat dashboard dengan usage statistics
- **And** saya melihat top 10 most used items
- **And** saya melihat items yang belum pernah digunakan
- **And** saya melihat trend adoption per periode
- **And** saya dapat export report ke Excel

**Validation Rules:**

- **UI Rules:**
    - Dashboard dengan charts dan tables
    - Date range filter
    - Export button untuk Excel/CSV
- **Business Rules:**
    - Statistics dihitung dari Performance Tree references
    - Include breakdown per department/cohort
- **Data Rules:**
    - Usage = count of KPI items linked to dictionary
    - Adoption rate = users using dictionary vs total users
- **Edge Cases:**
    - Jika tidak ada data untuk period selected, tampilkan empty state

---

## 3.4 Dual-Approval Workflow

<aside>
✅

**Dual-Approval Requirement:**

Setiap item dictionary baru wajib melalui 2 level approval sebelum published.

</aside>

**Approval Levels:**

| **Level** | **Role** | **Responsibility** | **SLA** |
| --- | --- | --- | --- |
| Level 1 | Validator (Performance Admin) | Review definisi, target, evidence requirement | 3 hari kerja |
| Level 2 | Approver (Performance Admin HO) | Final review, set Fixed Weight, publish | 5 hari kerja |

---

## 3.5 Dictionary Item Schema

**Display Fields (Read-only for all users):**

| **Field** | **Type** | **Description** |
| --- | --- | --- |
| Title | Text | Nama KPI standar |
| Description | Rich Text | Definisi dan penjelasan KPI |
| KPI Type | Enum | Output / KAI |
| Recommended Target | Text | Target yang disarankan |
| Target Unit | Text | Satuan target (%, Rp, unit, dll) |
| Polarity | Enum | Higher is Better / Lower is Better |
| BSC Perspective | Enum | Financial / Customer / Internal Process / Learning & Growth |
| Applicable Functions | Multi-select | Department/Function yang relevan |
| Applicable Cohorts | Multi-select | Cohort level yang relevan |
| Evidence Requirement | Text | Jenis bukti yang diperlukan |
| Fixed Weight | Number / Null | Bobot tetap (jika ada) |
| Usage Count | Number | Jumlah penggunaan (auto-calculated) |
| Status | Enum | Draft / Pending Validation / Validated / Pending Approval / Published / Deprecated |
| Created By | User | Submitter |
| Validated By | User | Level 1 Validator |
| Approved By | User | Level 2 Approver |

---

## 3.6 UI Components

### Screen: Dictionary Browser

| Section | Komponen | Behavior |
| --- | --- | --- |
| Sidebar | Filter Panel (Type, BSC, Function, Cohort) | Collapsible, multi-select filters |
| Header | Search Bar + View Toggle + Submit Button | Sticky header |
| Main | Card Grid / List View | Toggle between views |
| Card | Title, Type Badge, BSC Badge, Usage Count | Click to open detail |
| Pagination | Page numbers + items per page selector | 20/50/100 options |

### Screen: Item Detail

| Section | Komponen | Behavior |
| --- | --- | --- |
| Header | Title + Status Badge + Action Buttons | Fixed header |
| Details | Field List (all dictionary fields) | Read-only display |
| Usage | Usage Statistics + Trend Chart | Interactive chart |
| Actions | Use Item (all), Edit/Deprecate (admin) | Role-based visibility |

### Screen: Validation/Approval Queue

| Section | Komponen | Behavior |
| --- | --- | --- |
| Filter | Status, Date Range, Submitter | Quick filter tabs |
| List | Expandable Cards with preview | Inline action buttons |
| Detail Panel | Side panel with full details | Slide-in panel |
| Actions | Validate/Approve/Reject buttons | With confirmation modal |

---

## 3.7 Business Rules

| Rule ID | Rule | Enforcement |
| --- | --- | --- |
| BR-KD-001 | Fixed Weight tidak dapat diubah oleh user saat use item | Read-only field dengan lock icon |
| BR-KD-002 | Item baru harus melalui dual-approval (Validator + Approver) | Block publish tanpa 2 level approvals |
| BR-KD-003 | Validator ≠ Approver ≠ Submitter | System validation different user per role |
| BR-KD-004 | Published item tidak dapat di-delete, hanya deprecate | Hide delete button, show deprecate |
| BR-KD-005 | User hanya dapat use item yang match Applicable Cohorts | Disable "Use" button jika tidak match |
| BR-KD-006 | Reject wajib disertai catatan | Block reject tanpa comment |
| BR-KD-007 | Major edit pada published item perlu re-approval | Trigger approval workflow untuk major changes |
| BR-KD-008 | Deprecated item tidak muncul di default browse/search | Filter out by default, option to show |

---