## 1.1 Deskripsi Modul

**My Performance** adalah modul utama bagi pekerja untuk mengelola KPI individu, mulai dari perencanaan hingga monitoring realisasi.

| Aspek | Keterangan |
| --- | --- |
| **Target User** | Seluruh pekerja aktif |
| **Access Level** | Personal (hanya data sendiri) |
| **Primary Actions** | View, Draft, Submit, Edit (sebelum approval) |

---

## 1.2 Epic Overview

<aside>
🎯

**Epic: My Performance**

Sebagai pekerja, saya dapat mengelola seluruh siklus kinerja individu mulai dari melihat dashboard performa, merencanakan KPI Output dan KAI, menginput realisasi, hingga memonitor pencapaian score secara real-time.

</aside>

**Cakupan User Stories (Diurutkan berdasarkan Use Case):**

**Use Case 1: Perencanaan KPI & Cascading**

| **Story ID** | **Summary** | **BRD Ref** |
| --- | --- | --- |
| US-MP-001 | Draft KPI Output | BR-004, BR-009 |
| US-MP-002 | Draft KPI Output dari Kamus KPI | BR-022 |
| US-MP-003 | Set Cascading Method | BR-005, BR-006 |
| US-MP-004 | Set Target Type (Fixed/Progressive) | BR-007 |
| US-MP-005 | Draft Specific KAI | BR-017 |
| US-MP-006 | Set Bobot Item KPI | BR-011, BR-012 |
| US-MP-007 | Review KPI Cascade dari Admin/Atasan | BR-005, BR-006 |

**Use Case 2: Approval KPI Planning**

| **Story ID** | **Summary** | **BRD Ref** |
| --- | --- | --- |
| US-MP-008 | Submit KPI untuk Approval | BR-012 |
| US-MP-009 | View KPI Planning Status | BR-012, BR-014 |

**Use Case 3: Pengisian Realisasi KPI Output**

| **Story ID** | **Summary** | **BRD Ref** |
| --- | --- | --- |
| US-MP-010 | Input Realisasi KPI Output | BR-013 |
| US-MP-011 | View KPI Output Detail & Progress | BR-013, BR-027 |

**Use Case 4: Pengisian Realisasi KAI**

| **Story ID** | **Summary** | **BRD Ref** |
| --- | --- | --- |
| US-MP-012 | Input Realisasi KAI | BR-013 |
| US-MP-013 | View KAI Detail & Progress | BR-013, BR-027 |

**Use Case 6: Monitoring Pencapaian Individu**

| **Story ID** | **Summary** | **BRD Ref** |
| --- | --- | --- |
| US-MP-014 | View Performance Dashboard | BR-011, BR-027 |
| US-MP-015 | View KPI Impact (Read-Only) | BR-002, BR-003 |
| US-MP-016 | View Achievement & Weighted Score | BR-027 |
| US-MP-017 | View Proporsional Score (Mutasi) | BR-016 |
| US-MP-018 | View Multi-Position KPI | BR-029 |
| US-MP-019 | View KPI Monitoring Status Indicator | BR-027 |
| US-MP-020 | View KPI Status Alert & Notification | BR-027, BR-030 |

**Use Case 8: Revisi KPI dan Realisasi**

| **Story ID** | **Summary** | **BRD Ref** |
| --- | --- | --- |
| US-MP-021 | Revisi KPI (Setelah Reject) | BR-014, BR-015 |

**Use Case 14: Reminder & Deadline Management**

| **Story ID** | **Summary** | **BRD Ref** |
| --- | --- | --- |
| US-MP-022 | View Performance Calendar | BR-030 |

**Detail Panel Components (Supporting All Use Cases)**

| **Story ID** | **Summary** | **BRD Ref** |
| --- | --- | --- |
| US-MP-023 | View KPI Detail Panel - Basic Info | BR-004, BR-009 |
| US-MP-024 | View KPI Detail Panel - Ownership Info | BR-008, BR-010 |
| US-MP-025 | View KPI Detail Panel - Cascading Hierarchy | BR-005, BR-006 |
| US-MP-026 | View KPI Detail Panel - Realization Progress | BR-013, BR-027 |
| US-MP-027 | View KPI Detail Panel - Evidence & Attachments | BR-013 |
| US-MP-028 | View KPI Detail Panel - Approval History | BR-014, BR-015 |

---

## 1.3 User Stories Detail

### US-MP-001: Draft KPI Output

**User Story:**

**As a** Pekerja

**I want to** membuat draft KPI Output baru

**So that** saya dapat merencanakan target kinerja individu untuk periode mendatang

**Acceptance Criteria:**

- **Given** saya login sebagai Pekerja
- **And** periode perencanaan KPI sedang aktif
- **When** saya klik tombol "Draft KPI Output"
- **Then** sistem menampilkan form input KPI Output
- **And** saya dapat mengisi seluruh field mandatory
- **And** saya dapat menyimpan sebagai draft
- **When** saya klik "Simpan Draft"
- **Then** KPI tersimpan dengan status "Draft"
- **And** KPI muncul di daftar My Performance

**Validation Rules:**

- **UI Rules:**
    - Form dalam mode wizard (step-by-step) atau single page
    - Field mandatory ditandai dengan asterisk merah (*)
    - Real-time validation saat user keluar dari field
    - Tombol "Simpan Draft" selalu enabled
    - Tombol "Submit" disabled sampai semua mandatory field terisi
- **Business Rules:**
    - KPI Output di-attach ke Position Master Variant ID pekerja (BR-004)
    - Pekerja dapat draft sendiri ATAU atasan yang draft untuk bawahan
    - Status awal = "Draft"
- **Data Rules:**
    - Title: max 200 karakter, wajib diisi
    - Description: max 1000 karakter, wajib diisi
    - Target Value: angka > 0
    - Bobot: 1-100, akan divalidasi saat submit
- **Edge Cases:**
    - Jika periode perencanaan tidak aktif, tombol "Draft KPI" disabled dengan tooltip "Periode perencanaan belum dibuka"

**Input Fields - KPI Output:**

| Field | Type | Mandatory | Validation |
| --- | --- | --- | --- |
| Title | Text | Ya | Max 200 chars |
| Description | Rich Text | Ya | Max 1000 chars |
| BSC Perspective | Enum | Ya | Financial / Customer / Internal Process / Learning & Growth |
| Target Value | Number | Ya | > 0 |
| Target Unit | Text | Ya | Non-empty |
| Target Type | Enum | Ya | Fixed / Progressive |
| Polarity | Enum | Ya | Maximize / Minimize |
| Cascading Method | Enum | Ya | Direct / Indirect |
| Bobot | Number | Ya | 1-100, total Output = 100% |

---

### US-MP-002: Draft KPI Output dari Kamus KPI

**User Story:**

**As a** Pekerja

**I want to** memilih KPI dari Kamus KPI

**So that** saya dapat menggunakan KPI terstandarisasi tanpa membuat dari awal

**Acceptance Criteria:**

- **Given** saya login sebagai Pekerja
- **And** periode perencanaan KPI sedang aktif
- **When** saya klik tombol "Pilih dari Kamus KPI"
- **Then** sistem menampilkan modal browser Kamus KPI
- **And** saya dapat search/filter item berdasarkan keyword, BSC Perspective, atau Function
- **When** saya pilih item dan klik "Gunakan"
- **Then** form KPI Output ter-populate dengan data dari Kamus
- **And** field dengan Fixed Weight menjadi read-only

**Validation Rules:**

- **UI Rules:**
    - Modal browser dengan search bar dan filter chips
    - Preview item sebelum memilih (hover atau klik)
    - Field Fixed Weight ditampilkan dengan icon 🔒 dan disabled
    - User tetap dapat edit field non-Fixed Weight
- **Business Rules:**
    - Item dari Kamus KPI ditandai dengan flag "Is From Dictionary = True"
    - Fixed Weight tidak dapat diubah oleh pekerja (BR-022)
    - Definisi dan Evidence Requirement mengikuti standar Kamus
- **Data Rules:**
    - Pencarian minimal 3 karakter
    - Filter by: BSC Perspective, Function, Ownership Type
- **Edge Cases:**
    - Jika Kamus KPI kosong, tampilkan empty state "Belum ada item di Kamus KPI"

---

### US-MP-003: Set Cascading Method

**User Story:**

**As a** Pekerja (Owner KPI)

**I want to** menentukan metode cascading untuk KPI Output saya

**So that** realisasi dari bawahan dapat berkontribusi sesuai mekanisme yang tepat

**Acceptance Criteria:**

- **Given** saya sedang membuat/edit KPI Output
- **When** saya memilih Cascading Method = "Direct"
- **Then** sistem menampilkan warning bahwa satuan child KPI harus sama dengan parent
- **And** saat cascading, field Target Unit di child KPI menjadi read-only (ikut parent)
- **When** saya memilih Cascading Method = "Indirect"
- **Then** tidak ada constraint satuan untuk child KPI

**Validation Rules:**

- **UI Rules:**
    - Radio button untuk pilihan Direct / Indirect
    - Tooltip penjelasan di samping setiap opsi
    - Warning box kuning jika Direct dipilih
- **Business Rules:**
    - **Direct Cascade:** Realisasi child di-SUM ke parent, satuan WAJIB sama (BR-005, BR-006)
    - **Indirect Cascade:** Realisasi child independen, satuan boleh berbeda
    - Target child tidak harus akumulatif dengan parent
- **Technical Rules:**
    - Validasi satuan dilakukan saat child KPI di-submit
    - Jika Direct dan satuan berbeda, block submit dengan error message
- **Edge Cases:**
    - Jika KPI tidak akan di-cascade (level terendah), default = Indirect

---

### US-MP-004: Set Target Type (Fixed/Progressive)

**User Story:**

**As a** Pekerja

**I want to** menentukan tipe target KPI (Fixed atau Progressive)

**So that** pencapaian saya dihitung sesuai karakteristik KPI

**Acceptance Criteria:**

- **Given** saya sedang membuat/edit KPI Output atau KAI
- **When** saya memilih Target Type = "Fixed"
- **Then** saya hanya perlu input 1 nilai target untuk seluruh periode
- **When** saya memilih Target Type = "Progressive"
- **Then** sistem menampilkan input field untuk setiap periode monitoring
- **And** saya wajib mengisi target per periode (Monthly: 12 field, Quarterly: 4 field)

**Validation Rules:**

- **UI Rules:**
    - Radio button untuk Fixed / Progressive
    - Jika Progressive, expand accordion dengan input per periode
    - Visualisasi chart mini menunjukkan trend target Progressive
- **Business Rules:**
    - **Fixed Target:** Target sama sepanjang tahun (BR-007)
    - **Progressive Target:** Target spesifik per periode, dapat berbeda
    - Achievement dihitung berdasarkan target periode yang berlaku
- **Data Rules:**
    - Progressive Monthly = 12 input fields (Jan-Des)
    - Progressive Quarterly = 4 input fields (Q1-Q4)
    - Semua field Progressive wajib diisi sebelum submit
- **Edge Cases:**
    - Jika switch dari Progressive ke Fixed, data Progressive di-clear dengan konfirmasi

**Rekomendasi Visualisasi:**

- **Fixed Target:** Tampilkan sebagai horizontal line di chart realisasi
- **Progressive Target:** Tampilkan sebagai stepped line atau area chart dengan gradasi warna untuk menunjukkan perubahan target per periode

---

### US-MP-005: Draft Specific KAI

**User Story:**

**As a** Pekerja

**I want to** membuat draft Specific KAI

**So that** saya dapat memonitor aktivitas operasional harian/mingguan/bulanan

**Acceptance Criteria:**

- **Given** saya login sebagai Pekerja
- **And** periode perencanaan KPI sedang aktif
- **When** saya klik tombol "Draft KAI"
- **Then** sistem menampilkan form input KAI
- **And** saya dapat mengisi field mandatory termasuk Nature of Work
- **And** saya dapat link KAI ke KPI Output terkait (opsional)
- **When** saya klik "Simpan Draft"
- **Then** KAI tersimpan dengan status "Draft"

**Validation Rules:**

- **UI Rules:**
    - Form serupa dengan KPI Output dengan field tambahan Nature of Work
    - Dropdown link ke KPI Output menampilkan hanya KPI Output milik sendiri
    - Common KAI tidak muncul di form ini (auto-assign oleh sistem)
- **Business Rules:**
    - Specific KAI di-attach ke Position ID pekerja (BR-017)
    - Nature of Work: Routine (aktivitas rutin) atau Non-routine (project-based)
    - Monitoring Frequency: Weekly atau Monthly
- **Edge Cases:**
    - Common KAI yang sudah auto-assign tidak dapat di-edit/delete oleh pekerja

**Input Fields - KAI:**

| Field | Type | Mandatory | Validation |
| --- | --- | --- | --- |
| Title | Text | Ya | Max 200 chars |
| Description | Rich Text | Ya | Max 1000 chars |
| Target Value | Number | Ya | > 0 |
| Target Unit | Text | Ya | Non-empty |
| Nature of Work | Enum | Ya | Routine / Non-routine |
| Monitoring Frequency | Enum | Ya | Weekly / Monthly |
| Link to KPI Output | Relation | Tidak | Existing KPI Output milik sendiri |
| Bobot | Number | Ya | 1-100, total KAI = 100% |

---

### US-MP-006: Set Bobot Item KPI

**User Story:**

**As a** Pekerja

**I want to** mengatur bobot untuk setiap item KPI

**So that** kontribusi setiap KPI terhadap total score sesuai prioritas

**Acceptance Criteria:**

- **Given** saya memiliki beberapa item KPI Output atau KAI
- **When** saya mengatur bobot untuk setiap item
- **Then** sistem menampilkan real-time total bobot
- **And** sistem memberikan warning jika total ≠ 100%
- **When** total bobot = 100%
- **Then** indikator berubah menjadi hijau "Valid"

**Validation Rules:**

- **UI Rules:**
    - Input number dengan slider atau direct input
    - Real-time calculation total bobot (contoh: "75/100%")
    - Color indicator: Merah (≠100%), Hijau (=100%)
    - Fixed Weight items ditampilkan read-only dengan icon 🔒
- **Business Rules:**
    - Total bobot item dalam 1 jenis KPI WAJIB = 100% (BR-012)
    - Validasi terpisah untuk KPI Output dan KAI
    - Fixed Weight dari Kamus KPI tidak dapat diubah
- **Data Rules:**
    - Bobot: integer 1-100
    - Minimum bobot per item: 1%
    - Maximum bobot per item: 100%
- **Edge Cases:**
    - Jika hanya ada 1 item dalam jenis, bobot otomatis 100% (read-only)
    - Jika Fixed Weight item melebihi 100%, block penambahan item baru

---

### US-MP-007: Review KPI Cascade dari Admin/Atasan

**User Story:**

**As a** Pekerja

**I want to** melihat dan mereview KPI yang di-cascade dari Admin atau Atasan

**So that** saya dapat memahami target yang sudah ditetapkan untuk saya dan melakukan penyesuaian jika diperlukan

**Acceptance Criteria:**

- **Given** Admin atau Atasan telah melakukan cascade KPI kepada saya
- **When** saya membuka My Performance di periode perencanaan
- **Then** saya melihat KPI yang di-cascade dengan status "Cascaded - Pending Review"
- **And** saya dapat melihat detail KPI termasuk parent KPI, target, dan cascading method
- **And** saya dapat Accept atau Request Revision dengan memberikan catatan
- **When** saya klik "Accept"
- **Then** KPI masuk ke daftar KPI saya dengan status "Draft"
- **When** saya klik "Request Revision"
- **Then** notifikasi terkirim ke Admin/Atasan dengan catatan saya

**Validation Rules:**

- **UI Rules:**
    - Banner notifikasi di top dashboard: "Anda memiliki X KPI yang perlu direview"
    - Badge "Cascaded" dengan warna biru pada item KPI
    - Section khusus "Pending Review" di My Performance
    - Modal review dengan detail lengkap KPI dan input field untuk catatan
    - Tombol "Accept" (hijau) dan "Request Revision" (kuning)
- **Business Rules:**
    - KPI cascade dapat berasal dari Admin (via Performance Tree) atau Atasan langsung
    - Pekerja WAJIB accept atau request revision sebelum batas waktu perencanaan
    - Setelah accept, pekerja dapat mengedit field tertentu (kecuali parent link dan cascading method)
    - Request revision WAJIB disertai catatan minimal 20 karakter
- **Data Rules:**
    - Cascaded KPI inherit: Title, Description, Target Unit, Cascading Method, Parent KPI Link
    - Pekerja dapat adjust: Target Value, Bobot (dalam constraint total 100%)
- **Edge Cases:**
    - Jika pekerja tidak review sampai deadline, sistem auto-accept dan kirim reminder
    - Jika cascaded KPI dari parent yang kemudian di-delete, notifikasi ke pekerja untuk handling

---

### US-MP-008: Submit KPI untuk Approval

**User Story:**

**As a** Pekerja

**I want to** submit KPI yang sudah di-draft untuk approval atasan

**So that** KPI saya dapat difinalisasi dan digunakan untuk monitoring

**Acceptance Criteria:**

- **Given** saya memiliki KPI dengan status "Draft"
- **And** total bobot item KPI Output = 100%
- **And** total bobot item KAI = 100%
- **When** saya klik tombol "Submit untuk Approval"
- **Then** sistem melakukan validasi final
- **And** jika valid, status KPI berubah menjadi "Pending Approval"
- **And** notifikasi terkirim ke atasan langsung

**Validation Rules:**

- **UI Rules:**
    - Tombol "Submit" disabled jika validasi belum terpenuhi
    - Tampilkan checklist validasi sebelum submit (bobot, mandatory fields)
    - Konfirmasi modal sebelum submit final
    - Loading state saat proses submit
- **Business Rules:**
    - Validasi: Total bobot KPI Output = 100%, Total bobot KAI = 100%
    - Setelah submit, KPI tidak dapat di-edit sampai di-approve atau di-reject
    - Atasan langsung = berdasarkan struktur organisasi di MDM
- **Technical Rules:**
    - Notifikasi via in-app notification dan email
    - Status change di-log untuk audit trail
- **Edge Cases:**
    - Jika atasan tidak ada (posisi kosong), eskalasi ke atasan level +1
    - Jika gagal kirim notifikasi, tetap ubah status dan retry notification

---

### US-MP-009: View KPI Planning Status

**User Story:**

**As a** Pekerja

**I want to** melihat status planning KPI saya (Draft, Pending Approval, Approved, Rejected)

**So that** saya dapat melacak progress approval dan tahu KPI mana yang perlu tindakan

**Acceptance Criteria:**

- **Given** saya login sebagai Pekerja
- **When** saya membuka My Performance
- **Then** saya melihat status badge di setiap item KPI
- **And** saya dapat filter KPI berdasarkan status
- **And** saya melihat summary count per status di dashboard header
- **When** status = "Rejected"
- **Then** saya melihat alert banner dengan catatan penolakan
- **When** status = "Pending Approval"
- **Then** saya melihat durasi pending (contoh: "Pending 2 hari")

**Validation Rules:**

- **UI Rules:**
    - Status badge dengan color coding:
        - Draft: ⚪ Gray
        - Cascaded - Pending Review: 🔵 Blue
        - Pending Approval: 🟡 Yellow
        - Approved: 🟢 Green
        - Rejected: 🔴 Red
    - Filter chips di header: "All", "Draft", "Pending Approval", "Approved", "Rejected"
    - Summary card: "X Draft, Y Pending, Z Approved, W Rejected"
    - Rejected items highlighted dengan border merah dan expandable rejection notes
- **Business Rules:**
    - Status workflow: Draft → Pending Approval → Approved/Rejected
    - Jika Rejected → kembali ke Draft (editable)
    - Status Approved = locked, tidak dapat edit tanpa workflow revisi khusus
- **Data Rules:**
    - Status tracking dengan timestamp untuk audit trail
    - Pending duration dihitung dari timestamp submit hingga sekarang
- **Edge Cases:**
    - Jika pending > 5 hari kerja, tampilkan warning "Menunggu approval atasan"

---

### US-MP-010: Input Realisasi KPI Output

**User Story:**

**As a** Pekerja (Owner KPI)

**I want to** menginput realisasi KPI Output

**So that** pencapaian saya tercatat dan dapat dihitung score-nya

**Acceptance Criteria:**

- **Given** saya memiliki KPI Output dengan status "Approved"
- **And** periode monitoring sedang aktif
- **When** saya klik "Input Realisasi" pada item KPI
- **Then** sistem menampilkan form input realisasi
- **And** saya mengisi Actual Value dan upload Evidence
- **When** saya klik "Submit Realisasi"
- **Then** realisasi tersimpan dengan status "Pending Review"
- **And** achievement % dihitung otomatis

**Validation Rules:**

- **UI Rules:**
    - Form input dengan field Actual Value, Evidence (upload), Notes
    - Preview evidence sebelum upload
    - Tampilkan Target Value sebagai referensi
    - Achievement % ter-kalkulasi real-time saat input
- **Business Rules:**
    - Hanya Owner yang dapat input realisasi (BR-010)
    - Shared Owner tidak dapat input (score mengikuti Owner)
    - Evidence WAJIB di-upload sebelum submit
    - Deadline input: Tanggal 5 untuk Monthly, Tanggal 10 untuk Quarterly (BR-013)
- **Data Rules:**
    - Actual Value: angka (bisa desimal)
    - Evidence: PDF, Image (JPG/PNG), atau Link (URL)
    - Max file size: 10MB per file
    - Notes: max 500 karakter (opsional)
- **Edge Cases:**
    - Jika input setelah deadline, tampilkan warning "Melewati deadline" tetapi tetap bisa submit
    - Jika Direct Cascade, realisasi child otomatis di-sum ke parent

**Achievement Calculation:**

| Field | Formula |
| --- | --- |
| Achievement % (Maximize) | (Actual / Target) × 100 |
| Achievement % (Minimize) | (Target / Actual) × 100 |
| Weighted Score | Achievement × Bobot Item × Bobot Jenis |

---

### US-MP-011: View KPI Output Detail & Progress

**User Story:**

**As a** Pekerja

**I want to** melihat detail dan progress KPI Output secara terpisah

**So that** saya dapat memonitor pencapaian KPI Output dengan fokus pada karakteristik output-based metrics

**Acceptance Criteria:**

- **Given** saya memiliki KPI Output
- **When** saya klik item KPI Output di daftar
- **Then** sistem menampilkan panel detail khusus KPI Output
- **And** saya melihat informasi: Title, Target, Cascading Info, Child KPIs
- **And** saya melihat progress chart dengan breakdown per periode
- **And** saya melihat tabel realisasi dengan Achievement % dan Status per periode
- **And** saya melihat list child KPIs beserta kontribusi mereka (jika Direct Cascade)

**Validation Rules:**

- **UI Rules:**
    - Panel detail dengan tab navigation: "Overview", "Progress", "Cascading", "Evidence", "History"
    - Tab "Cascading" menampilkan tree view parent-child relationship
    - Highlight Direct Cascade dengan indikator "∑ Auto-sum from children"
    - Progress chart menampilkan trend line actual vs target
- **Business Rules:**
    - Untuk Direct Cascade, tampilkan contribution breakdown dari setiap child
    - Untuk Indirect Cascade, hanya tampilkan link ke child KPIs tanpa sum
- **Data Rules:**
    - Progress data per periode (Monthly atau Quarterly sesuai monitoring frequency)
- **Edge Cases:**
    - Jika tidak ada child KPI, hide section "Cascading"

---

### US-MP-012: Input Realisasi KAI

**User Story:**

**As a** Pekerja

**I want to** menginput realisasi KAI

**So that** aktivitas operasional saya tercatat sesuai frekuensi monitoring

**Acceptance Criteria:**

- **Given** saya memiliki KAI (Specific atau Common) dengan status "Approved"
- **And** periode monitoring sedang aktif
- **When** saya klik "Input Realisasi" pada item KAI
- **Then** sistem menampilkan form input realisasi
- **And** saya mengisi Actual Value dan upload Evidence
- **When** saya klik "Submit Realisasi"
- **Then** realisasi tersimpan dengan status "Pending Review"

**Validation Rules:**

- **UI Rules:**
    - Form serupa dengan KPI Output
    - Untuk KAI Weekly, tampilkan calendar picker untuk select week
    - Tampilkan histori realisasi minggu/bulan sebelumnya
- **Business Rules:**
    - Deadline KAI Weekly: Minggu 23:59
    - Deadline KAI Monthly: Tanggal 5
    - Common KAI berlaku untuk seluruh pekerja (tidak dapat di-skip)
- **Data Rules:**
    - Evidence wajib di-upload
    - Format sama dengan KPI Output
- **Edge Cases:**
    - Jika KAI Weekly terlewat, sistem buka form untuk minggu berikutnya
    - Backfill minggu sebelumnya hanya bisa via request ke Performance Admin

---

### US-MP-013: View KAI Detail & Progress

**User Story:**

**As a** Pekerja

**I want to** melihat detail dan progress KAI secara terpisah

**So that** saya dapat memonitor aktivitas operasional dengan fokus pada nature of work dan frequency yang berbeda dari KPI Output

**Acceptance Criteria:**

- **Given** saya memiliki KAI (Specific atau Common)
- **When** saya klik item KAI di daftar
- **Then** sistem menampilkan panel detail khusus KAI
- **And** saya melihat informasi: Title, Target, Nature of Work, Monitoring Frequency, Link to KPI Output (jika ada)
- **And** saya melihat progress chart sesuai frequency (Weekly: 52 minggu, Monthly: 12 bulan)
- **And** saya melihat tabel realisasi dengan frekuensi yang lebih granular
- **And** untuk Common KAI, saya melihat badge "Common - Applies to All"

**Validation Rules:**

- **UI Rules:**
    - Panel detail dengan badge type: "Specific KAI" atau "Common KAI"
    - Nature of Work indicator: 🔄 Routine atau 🎯 Non-routine
    - Monitoring Frequency selector: Week view atau Month view
    - Progress chart dengan granularitas tinggi (weekly bars atau monthly bars)
    - Link to related KPI Output (jika applicable) dengan one-click navigation
- **Business Rules:**
    - Common KAI ditampilkan read-only untuk planning (bobot fixed)
    - Specific KAI dapat di-link ke KPI Output untuk menunjukkan kontribusi operasional ke output
- **Data Rules:**
    - Weekly KAI: 52 data points per tahun
    - Monthly KAI: 12 data points per tahun
- **Edge Cases:**
    - Jika KAI tidak linked ke KPI Output, hide section "Related Output"

---

### US-MP-014: View Performance Dashboard

**User Story:**

**As a** Pekerja

**I want to** melihat dashboard performa saya

**So that** saya dapat memonitor pencapaian KPI secara keseluruhan

**Acceptance Criteria:**

- **Given** saya login sebagai Pekerja
- **When** saya membuka menu "My Performance"
- **Then** saya melihat Score Card dengan total performance score
- **And** saya melihat progress indicator per jenis KPI (Impact, Output, KAI)
- **And** saya melihat daftar KPI dengan status masing-masing

**Validation Rules:**

- **UI Rules:**
    - Score Card menampilkan angka dengan 2 desimal (contoh: 105.14%)
    - Color indicator: Hijau (≥100%), Kuning (80-99%), Merah (<80%)
    - Default period = periode berjalan (bulan/triwulan aktif)
    - Progress indicator berbentuk circular chart per jenis KPI
- **Business Rules:**
    - Score dihitung real-time berdasarkan realisasi yang sudah di-approve
    - KPI Impact score diambil dari P-KPI (read-only)
- **Data Rules:**
    - Jika belum ada realisasi, tampilkan score 0%
    - Jika periode belum dimulai, tampilkan "Belum ada data"

---

### US-MP-015: View KPI Impact (Read-Only)

**User Story:**

**As a** Pekerja

**I want to** melihat KPI Impact yang berlaku untuk saya

**So that** saya memahami target korporat yang menjadi tanggung jawab bersama

**Acceptance Criteria:**

- **Given** saya login sebagai Pekerja
- **When** saya membuka tab "KPI Impact" di My Performance
- **Then** saya melihat daftar item KPI Impact yang identik dengan seluruh pekerja
- **And** saya melihat bobot per item sesuai kohort saya
- **And** saya melihat achievement % dari P-KPI
- **And** tidak ada tombol Edit atau Delete

**Validation Rules:**

- **UI Rules:**
    - Semua field dalam mode read-only (disabled)
    - Tidak ada tombol "Edit", "Delete", atau "Add"
    - Tampilkan label "Sinkronisasi dari P-KPI" di header section
    - Icon 🔒 di samping setiap item
- **Business Rules:**
    - Item KPI Impact identik untuk seluruh pekerja (BR-002)
    - Bobot berbeda per kohort, di-set oleh Performance Admin via Performance HQ
    - Data di-sync dari P-KPI setiap D+5 setelah akhir triwulan
- **Technical Rules:**
    - API polling ke P-KPI setiap 6 jam untuk check update
    - Jika P-KPI tidak available, tampilkan data terakhir dengan timestamp
- **Edge Cases:**
    - Jika sync gagal, tampilkan warning banner "Data terakhir sync: [timestamp]"

---

### US-MP-016: View Achievement dan Weighted Score

**User Story:**

**As a** Pekerja

**I want to** melihat achievement dan weighted score per KPI

**So that** saya memahami kontribusi setiap KPI terhadap total performance score

**Acceptance Criteria:**

- **Given** saya memiliki realisasi yang sudah di-approve
- **When** saya membuka detail KPI di My Performance
- **Then** saya melihat Achievement % (actual vs target)
- **And** saya melihat Weighted Score (achievement × bobot item × bobot jenis)
- **And** saya melihat trend chart bulanan/triwulanan

**Validation Rules:**

- **UI Rules:**
    - Tampilkan breakdown: Achievement %, Bobot Item, Bobot Jenis, Weighted Score
    - Trend chart menampilkan histori achievement per periode
    - Color coding sesuai threshold (Hijau/Kuning/Merah)
- **Business Rules:**
    - Score dihitung real-time setelah realisasi di-approve
    - Formula End-State (2026+): Total = Σ(Achievement × Bobot Item × Bobot Jenis)
    - Formula Transisi (Q4 2025): Total = (Impact × 40%) + (Output × 60%)
- **Data Rules:**
    - Achievement % dengan 2 desimal
    - Weighted Score dengan 2 desimal
- **Edge Cases:**
    - Jika belum ada realisasi approved, tampilkan "-" atau 0%

---

### US-MP-017: View Proporsional Score (Mutasi)

**User Story:**

**As a** Pekerja yang mengalami mutasi/rotasi

**I want to** melihat score proporsional dari posisi lama dan baru

**So that** score triwulanan saya dihitung secara fair

**Acceptance Criteria:**

- **Given** saya mengalami mutasi di tengah triwulan
- **When** saya membuka My Performance untuk triwulan tersebut
- **Then** saya melihat breakdown score per posisi (lama dan baru)
- **And** saya melihat jumlah bulan per posisi
- **And** saya melihat total score proporsional yang sudah di-weight

**Validation Rules:**

- **UI Rules:**
    - Section khusus "Score Proporsional" jika ada mutasi
    - Tabel breakdown: Posisi, Bulan, Score, Kontribusi
    - Highlight tanggal mutasi
- **Business Rules:**
    - Threshold tanggal 15 untuk menentukan kepemilikan bulan (BR-016)
    - Mutasi tanggal 1-15: Bulan jadi tanggung jawab posisi baru
    - Mutasi tanggal 16-31: Bulan jadi tanggung jawab posisi lama
    - Formula: Score Q = ((Score Lama × Bulan Lama) + (Score Baru × Bulan Baru)) / 3
- **Data Rules:**
    - Data mutasi diambil dari MDM (Master Data Management)
- **Edge Cases:**
    - Jika mutasi lebih dari 1x dalam triwulan, hitung proporsional untuk semua posisi

---

### US-MP-018: View Multi-Position KPI

**User Story:**

**As a** Pekerja dengan posisi secondary assignment

**I want to** melihat dan mengelola KPI dari berbagai posisi yang saya tempati

**So that** saya dapat memonitor dan mengisi realisasi untuk setiap posisi secara terpisah

**Acceptance Criteria:**

- **Given** saya memiliki posisi definitif dan posisi secondary assignment (PLH)
- **When** saya membuka My Performance
- **Then** saya melihat position switcher di header
- **And** saya dapat memilih posisi definitif atau posisi secondary dari dropdown
- **When** saya switch ke posisi tertentu
- **Then** dashboard menampilkan KPI spesifik untuk posisi tersebut
- **And** saya dapat mengisi realisasi untuk KPI di posisi yang dipilih

**Validation Rules:**

- **UI Rules:**
    - Dropdown dengan indicator visual: 📍 untuk posisi definitif, 🔄 untuk secondary
    - Label periode assignment untuk posisi secondary (contoh: "Jan 15 - Feb 28, 2026")
    - Badge "Definitif" atau "PLH" di samping nama posisi
    - Color coding: Biru untuk definitif, Orange untuk secondary
- **Business Rules:**
    - KPI antar posisi tidak saling mempengaruhi (BR-029)
    - Score proporsional dihitung berdasarkan durasi di masing-masing posisi
    - KPI dari posisi secondary tetap visible setelah assignment berakhir (read-only)
    - Setiap posisi memiliki atasan approval sendiri
- **Data Rules:**
    - Data posisi diambil dari MDM (Master Data Management)
    - Position Master Variant ID berbeda untuk setiap posisi
    - Threshold tanggal 15 untuk scoring proporsional
- **Edge Cases:**
    - Jika hanya punya 1 posisi (definitif), hide position switcher
    - Jika posisi secondary sudah berakhir, tampilkan sebagai "Historical" dengan read-only mode
    - Jika mutasi di tengah periode, tampilkan breakdown proporsional di dashboard

---

### US-MP-019: View KPI Monitoring Status Indicator

**User Story:**

**As a** Pekerja

**I want to** melihat status monitoring KPI (On Track, At Risk, Behind)

**So that** saya dapat dengan cepat mengidentifikasi KPI yang memerlukan perhatian khusus

**Acceptance Criteria:**

- **Given** saya login sebagai Pekerja
- **When** saya melihat daftar KPI di My Performance
- **Then** setiap KPI menampilkan Status Indicator berdasarkan realisasi item dan turunannya
- **And** status dihitung dengan logika:
    - **On Track:** Realisasi item sendiri + semua child (jika ada) mencapai target
    - **At Risk:** Realisasi item sendiri mencapai target TAPI ada child yang tidak mencapai target
    - **Behind:** Realisasi item sendiri tidak mencapai target
- **And** saya dapat filter KPI berdasarkan status
- **When** saya membuka panel detail KPI
- **Then** saya melihat penjelasan status dan breakdown child KPI (jika applicable)

**Validation Rules:**

- **UI Rules:**
    - Badge status di samping setiap KPI item
    - Color coding:
        - 🟢 On Track: Green
        - 🟡 At Risk: Yellow (realisasi OK, tapi child bermasalah)
        - 🔴 Behind: Red (realisasi tidak mencapai target)
        - ⚪ Pending: Gray (belum ada realisasi)
    - Filter chips di header: "All", "On Track", "At Risk", "Behind"
    - Tooltip saat hover menjelaskan: "On Track: Item dan semua turunan mencapai target"
    - Dashboard summary: jumlah KPI per status
- **Business Rules:**
    - Status dihitung cascade-aware (mempertimbangkan child KPI)
    - **On Track:** Achievement item ≥ 100% DAN semua child (jika ada) achievement ≥ 100%
    - **At Risk:** Achievement item ≥ 100% TAPI minimal 1 child achievement < 100%
    - **Behind:** Achievement item < 100% (terlepas dari status child)
    - **Pending:** Belum ada realisasi untuk periode berjalan
    - Untuk KPI tanpa child (leaf node), hanya ada status On Track, Behind, atau Pending
- **Data Rules:**
    - Status di-recalculate setiap kali realisasi di-approve (baik item sendiri atau child)
    - Historical status tersimpan untuk reporting
    - Achievement threshold: 100% (custom threshold per KPI belum supported)
- **Edge Cases:**
    - Jika KPI memiliki Indirect Cascade, status At Risk tidak applicable (child independen)
    - Jika child KPI belum input realisasi, tidak dihitung sebagai "tidak mencapai target" untuk status At Risk

**Status Logic Examples:**

| **Item Achievement** | **Child 1 Achievement** | **Child 2 Achievement** | **Status** |
| --- | --- | --- | --- |
| 105% | 110% | 102% | 🟢 On Track |
| 105% | 95% | 102% | 🟡 At Risk |
| 95% | 110% | 102% | 🔴 Behind |
| 95% | 90% | 85% | 🔴 Behind |
| - | - | - | ⚪ Pending |

---

### US-MP-020: View KPI Status Alert & Notification

**User Story:**

**As a** Pekerja

**I want to** menerima alert dan notifikasi ketika status KPI berubah menjadi At Risk atau Behind

**So that** saya dapat segera mengambil tindakan korektif sebelum terlambat

**Acceptance Criteria:**

- **Given** saya memiliki KPI yang sedang di-monitor
- **When** status KPI berubah dari On Track menjadi Behind
- **Then** saya menerima in-app notification "KPI [Title] status berubah menjadi Behind"
- **When** status KPI berubah menjadi At Risk
- **Then** saya menerima in-app notification dan email alert
- **And** KPI tersebut ditampilkan dengan highlight di dashboard
- **When** saya membuka My Performance
- **Then** saya melihat summary alert di header ("2 KPI At Risk, 3 KPI Behind")

**Validation Rules:**

- **UI Rules:**
    - Alert banner di top dashboard jika ada KPI At Risk
    - Badge counter di menu "My Performance"
    - Notification bell dengan unread indicator
    - KPI At Risk ditampilkan dengan border merah di list
- **Business Rules:**
    - Alert trigger: Status change ke Behind atau At Risk
    - Email notification hanya untuk At Risk (lebih urgent)
    - Atasan juga menerima notification untuk KPI bawahan yang At Risk
    - Alert dapat di-dismiss tetapi akan muncul lagi jika status masih At Risk
- **Technical Rules:**
    - Status check dijalankan setelah setiap realisasi di-approve
    - Batch notification untuk multiple status changes (max 1 email per jam)
- **Edge Cases:**
    - Jika KPI kembali ke On Track, kirim notification "KPI [Title] kembali On Track"
    - User dapat mute notification per KPI (opt-out)

**Notification Types:**

| **Trigger** | **In-App** | **Email** | **Recipient** |
| --- | --- | --- | --- |
| Status → Behind | Ya | Tidak | Owner |
| Status → At Risk | Ya | Ya | Owner + Atasan |
| Status → On Track (recovery) | Ya | Tidak | Owner |
| Deadline approaching (H-3) | Ya | Ya | Owner |
| Deadline missed | Ya | Ya | Owner + Atasan |

---

### US-MP-021: Revisi KPI (Setelah Reject)

**User Story:**

**As a** Pekerja

**I want to** merevisi KPI atau realisasi yang di-reject oleh atasan

**So that** saya dapat memperbaiki dan submit ulang

**Acceptance Criteria:**

- **Given** KPI atau realisasi saya di-reject oleh atasan
- **When** saya membuka item yang di-reject
- **Then** saya melihat catatan penolakan dari atasan
- **And** form kembali ke mode edit
- **When** saya perbaiki data sesuai feedback
- **And** klik "Submit Ulang"
- **Then** status berubah menjadi "Pending Approval" kembali

**Validation Rules:**

- **UI Rules:**
    - Banner merah dengan catatan penolakan dari atasan
    - Highlight field yang perlu direvisi (jika dispesifikkan atasan)
    - Tombol "Submit Ulang" menggantikan "Submit"
    - Histori revisi ditampilkan di timeline
- **Business Rules:**
    - Reject WAJIB disertai catatan penolakan (BR-015)
    - Tidak ada limit jumlah revisi
    - Setiap revisi di-log untuk audit trail
- **Technical Rules:**
    - Version control untuk setiap revisi
    - Notifikasi ke atasan saat submit ulang
- **Edge Cases:**
    - Jika atasan berubah (mutasi), approval ke atasan baru

---

### US-MP-022: View Performance Calendar

**User Story:**

**As a** Pekerja

**I want to** melihat calendar dengan deadline dan aktivitas PMS

**So that** saya tidak melewatkan deadline penting dan dapat merencanakan aktivitas

**Acceptance Criteria:**

- **Given** saya login sebagai Pekerja
- **When** saya membuka tab "Calendar" di My Performance
- **Then** saya melihat calendar view dengan deadline dan aktivitas
- **And** setiap event memiliki color coding sesuai tipe (Planning/Input/Approval/Sync)
- **When** saya klik pada tanggal dengan event
- **Then** sistem menampilkan detail event dan action button jika applicable
- **And** saya menerima reminder H-3 dan H-1 sebelum deadline

**Validation Rules:**

- **UI Rules:**
    - 3 view modes: Monthly, Weekly, Agenda
    - Color coding: 🟦 Blue (Planning), 🟩 Green (Input), 🟨 Yellow (Approval), 🟥 Red (Overdue)
    - Badge indicator untuk jumlah pending items per tanggal
    - Filter toggle: "All Events", "My Deadlines Only", "Team Deadlines"
- **Business Rules:**
    - Planning deadlines: Januari-Februari (BR-030)
    - Input deadlines: Tanggal 5 setiap bulan untuk Monthly KPI
    - Approval deadlines: Tanggal 10 setiap bulan
    - P-KPI Sync: D+5 setelah akhir triwulan (5 Jan, 5 Apr, 5 Jul, 5 Okt)
    - Personal reminders: H-3 dan H-1 via in-app notification dan email
- **Data Rules:**
    - Calendar events di-generate berdasarkan KPI yang assigned
    - Multi-position: Filter by posisi definitif atau secondary
    - Sync dengan Annual Performance Calendar dari BRD Section 7.2.1
- **Technical Rules:**
    - Cache calendar data untuk performance
    - Real-time update saat ada perubahan status KPI
    - Export calendar ke Google Calendar / Outlook (future enhancement)
- **Edge Cases:**
    - Jika tidak ada KPI, tampilkan empty state dengan link ke "Draft KPI"
    - Jika melewati deadline, event berubah warna merah dengan badge "Overdue"
    - Untuk posisi secondary yang berakhir, hide future events dari posisi tersebut

**Calendar Events:**

| **Event Type** | **Color** | **Timing** | **Action Available** |
| --- | --- | --- | --- |
| Planning Deadline | 🟦 Blue | Januari-Februari | "Draft KPI" |
| Input Realisasi Monthly | 🟩 Green | Tanggal 5 | "Input Realisasi" |
| Input Realisasi Quarterly | 🟩 Green | Tanggal 10 (Q baru) | "Input Realisasi" |
| Approval Deadline | 🟨 Yellow | Tanggal 10 (Monthly) | "Review Submission" |
| P-KPI Sync | 🟦 Blue | D+5 akhir Q | "View KPI Impact" |
| Overdue Item | 🟥 Red | After deadline | "Submit Now" |

---

### US-MP-023: View KPI Detail Panel - Basic Info

**User Story:**

**As a** Pekerja

**I want to** melihat informasi dasar KPI pada panel detail

**So that** saya dapat memahami konteks dan definisi KPI secara lengkap

**Acceptance Criteria:**

- **Given** saya login sebagai Pekerja
- **When** saya klik pada item KPI di daftar My Performance
- **Then** sistem menampilkan panel detail KPI
- **And** saya melihat informasi dasar: Title, Description, BSC Perspective, Target Value, Target Unit, Target Type (Fixed/Progressive)
- **And** saya melihat Workflow Status (Draft/Pending Approval/Approved/Rejected)
- **And** saya melihat periode berlaku KPI (Tahun, Triwulan)
- **And** saya melihat sumber KPI (Manual/Kamus KPI) dengan link ke item Kamus jika applicable

**Validation Rules:**

- **UI Rules:**
    - Panel detail muncul sebagai side panel atau modal
    - Header menampilkan Title + Status Badge dengan color coding
    - Section "Basic Info" sebagai accordion yang default expanded
    - Field dari Kamus KPI ditandai dengan icon 📖
    - Link ke Kamus KPI dapat di-klik untuk melihat definisi standar
- **Business Rules:**
    - Semua field read-only jika status = Approved
    - Field dapat di-edit jika status = Draft atau Rejected
- **Data Rules:**
    - Title: max 200 karakter
    - Description: max 1000 karakter, support rich text

**Detail Panel - Basic Info Fields:**

| **Field** | **Type** | **Source** |
| --- | --- | --- |
| Title | Text | User Input / Kamus KPI |
| Description | Rich Text | User Input / Kamus KPI |
| BSC Perspective | Enum | User Input / Kamus KPI |
| Target Value | Number | User Input |
| Target Unit | Text | User Input / Kamus KPI |
| Target Type | Enum | Fixed / Progressive |
| Polarity | Enum | Maximize / Minimize |
| Workflow Status | Enum | System Generated |
| Periode | Text | System Generated |
| Sumber KPI | Enum + Link | Manual / Kamus KPI |

---

### US-MP-024: View KPI Detail Panel - Ownership Info

**User Story:**

**As a** Pekerja

**I want to** melihat informasi ownership KPI pada panel detail

**So that** saya mengetahui siapa Owner dan Shared Owner/Collaborator beserta bobot kontribusi masing-masing

**Acceptance Criteria:**

- **Given** saya membuka panel detail KPI
- **When** saya melihat section "Ownership"
- **Then** saya melihat nama dan posisi Owner KPI
- **And** saya melihat daftar Shared Owner/Collaborator (jika ada)
- **And** saya melihat bobot kontribusi setiap Shared Owner
- **And** saya melihat total bobot kontribusi = 100%
- **And** saya melihat indicator apakah saya adalah Owner atau Shared Owner

**Validation Rules:**

- **UI Rules:**
    - Section "Ownership" sebagai accordion
    - Owner ditampilkan dengan badge 👑 dan foto profil
    - Shared Owner ditampilkan dengan badge 🤝 dan bobot %
    - Highlight current user dengan border atau background berbeda
    - Tampilkan avatar stack jika lebih dari 3 Shared Owner
- **Business Rules:**
    - Owner = 1 orang, bertanggung jawab input realisasi (BR-008)
    - Shared Owner dapat lebih dari 1, score mengikuti Owner (BR-010)
    - Total bobot kontribusi Shared Owner = 100% dari bobot KPI tersebut di portofolio mereka
- **Data Rules:**
    - Nama diambil dari MDM
    - Posisi diambil dari Position Master

**Ownership Display:**

| **Role** | **Icon** | **Info Displayed** | **Can Input Realization** |
| --- | --- | --- | --- |
| Owner | 👑 | Nama, Posisi, NIPP | Ya |
| Shared Owner | 🤝 | Nama, Posisi, NIPP, Bobot % | Tidak |

---

### US-MP-025: View KPI Detail Panel - Cascading Hierarchy

**User Story:**

**As a** Pekerja

**I want to** melihat hierarki cascading KPI pada panel detail

**So that** saya memahami hubungan KPI saya dengan KPI atasan (parent) dan bawahan (child)

**Acceptance Criteria:**

- **Given** saya membuka panel detail KPI Output
- **When** saya melihat section "Cascading"
- **Then** saya melihat Parent KPI (jika ada) dengan nama, owner, dan achievement
- **And** saya melihat daftar Child KPI (jika ada) dengan nama, owner, dan achievement
- **And** saya melihat Cascading Method (Direct/Indirect)
- **And** saya dapat klik Parent/Child untuk navigasi ke detail KPI tersebut

**Validation Rules:**

- **UI Rules:**
    - Section "Cascading" sebagai accordion
    - Visualisasi tree sederhana: Parent → Current → Children
    - Parent KPI ditandai dengan icon ⬆️
    - Child KPI ditandai dengan icon ⬇️
    - Cascading Method badge: 🔗 Direct, 🔀 Indirect
    - Achievement mini-bar di samping setiap item
- **Business Rules:**
    - Direct Cascade: Realisasi child di-SUM ke parent (BR-005)
    - Indirect Cascade: Realisasi child independen (BR-006)
    - KPI Impact tidak memiliki cascading (top level)
- **Edge Cases:**
    - Jika tidak ada Parent, tampilkan "Top Level KPI"
    - Jika tidak ada Child, tampilkan "Tidak ada cascading ke bawah"

**Cascading Display:**

| **Level** | **Icon** | **Info Displayed** |
| --- | --- | --- |
| Parent KPI | ⬆️ | Title, Owner Name, Achievement %, Method |
| Current KPI | 📍 | Title (highlighted) |
| Child KPI | ⬇️ | Title, Owner Name, Achievement %, Method |

---

### US-MP-026: View KPI Detail Panel - Realization Progress

**User Story:**

**As a** Pekerja

**I want to** melihat progress realisasi KPI pada panel detail

**So that** saya dapat memonitor pencapaian per periode dan trend achievement

**Acceptance Criteria:**

- **Given** saya membuka panel detail KPI
- **When** saya melihat section "Progress"
- **Then** saya melihat tabel realisasi per periode (Monthly/Quarterly)
- **And** setiap periode menampilkan: Target, Actual, Achievement %, Status
- **And** saya melihat trend chart achievement sepanjang tahun
- **And** saya melihat YTD (Year-to-Date) achievement summary

**Validation Rules:**

- **UI Rules:**
    - Section "Progress" sebagai accordion, default expanded pada periode monitoring
    - Tabel dengan kolom: Periode, Target, Actual, Achievement %, Status
    - Trend chart sebagai line/bar chart mini
    - YTD summary di header section
    - Color coding per row sesuai achievement threshold
- **Business Rules:**
    - Achievement % = (Actual/Target) × 100 untuk Maximize
    - Achievement % = (Target/Actual) × 100 untuk Minimize
    - YTD = average atau cumulative tergantung KPI nature
- **Data Rules:**
    - Tampilkan semua periode dalam tahun berjalan
    - Periode yang belum berjalan ditampilkan dengan "-"
    - Periode yang sudah lewat tanpa realisasi ditampilkan dengan warning

**Progress Table Structure:**

| **Periode** | **Target** | **Actual** | **Achievement** | **Status** |
| --- | --- | --- | --- | --- |
| Jan 2026 | 100 | 95 | 95% | 🟡 Behind |
| Feb 2026 | 100 | 110 | 110% | 🟢 On Track |
| Mar 2026 | 100 | - | - | ⚪ Pending |

---

### US-MP-027: View KPI Detail Panel - Evidence & Attachments

**User Story:**

**As a** Pekerja

**I want to** melihat daftar evidence yang di-upload untuk setiap realisasi

**So that** saya dapat mengakses dokumen pendukung dan memastikan kelengkapan evidence

**Acceptance Criteria:**

- **Given** saya membuka panel detail KPI
- **When** saya melihat section "Evidence"
- **Then** saya melihat daftar evidence grouped by periode realisasi
- **And** setiap evidence menampilkan: File Name, Type, Upload Date, Uploader
- **And** saya dapat preview (image) atau download (file) evidence
- **And** saya melihat status approval evidence per periode

**Validation Rules:**

- **UI Rules:**
    - Section "Evidence" sebagai accordion
    - Grid view dengan thumbnail untuk image, icon untuk file types
    - Filter by periode
    - Preview modal untuk image, PDF viewer inline
    - Download button untuk semua file types
- **Business Rules:**
    - Evidence wajib untuk setiap submit realisasi (BR-013)
    - Evidence dapat lebih dari 1 per periode
    - Evidence tidak dapat di-delete setelah realisasi approved
- **Data Rules:**
    - Supported formats: PDF, JPG, PNG, URL
    - Max file size: 10MB per file

**Evidence Display:**

| **File Type** | **Icon** | **Preview** | **Actions** |
| --- | --- | --- | --- |
| PDF | 📄 | Inline viewer | Download, Open in new tab |
| Image (JPG/PNG) | 🖼️ | Thumbnail + Modal | Download, Zoom |
| URL/Link | 🔗 | - | Open link |

---

### US-MP-028: View KPI Detail Panel - Approval History

**User Story:**

**As a** Pekerja

**I want to** melihat timeline approval/rejection history pada panel detail

**So that** saya dapat melacak perjalanan KPI dari draft hingga approved dan memahami feedback yang diberikan

**Acceptance Criteria:**

- **Given** saya membuka panel detail KPI
- **When** saya melihat section "History"
- **Then** saya melihat timeline aktivitas KPI dari awal hingga saat ini
- **And** setiap entry menampilkan: Timestamp, Actor, Action, Notes (jika ada)
- **And** rejection entries menampilkan catatan penolakan dari atasan
- **And** saya dapat expand entry untuk melihat detail perubahan (diff)

**Validation Rules:**

- **UI Rules:**
    - Section "History" sebagai accordion
    - Timeline vertical dengan icon per action type
    - Color coding: 🟢 Approve, 🔴 Reject, 🟡 Submit, ⚪ Draft, 🔵 Edit
    - Expandable untuk melihat detail notes dan diff
    - Avatar actor di samping setiap entry
- **Business Rules:**
    - Semua status change di-log untuk audit trail (BR-014)
    - Rejection wajib memiliki notes (BR-015)
    - Version control untuk setiap revision
- **Data Rules:**
    - Timestamp dalam format "DD MMM YYYY, HH:mm"
    - Actor = nama pekerja yang melakukan action

**History Timeline Actions:**

| **Action** | **Icon** | **Color** | **Has Notes** |
| --- | --- | --- | --- |
| Created (Draft) | ➕ | ⚪ Gray | Optional |
| Edited | ✏️ | 🔵 Blue | Optional |
| Submitted | 📤 | 🟡 Yellow | Optional |
| Approved | ✅ | 🟢 Green | Optional |
| Rejected | ❌ | 🔴 Red | Mandatory |
| Realization Submitted | 📊 | 🟡 Yellow | Optional |
| Realization Approved | ✅ | 🟢 Green | Optional |

---

## 1.4 UI Components

### Screen: My Performance Dashboard

| Section | Komponen | Behavior |
| --- | --- | --- |
| Header | Period Selector | Dropdown Q1-Q4 / Month |
| Score Card | Current Score | Display with color indicator (Hijau/Kuning/Merah) |
| Progress | Circular Chart per Jenis | KPI Impact, KPI Output, KAI dengan persentase |
| KPI List | Expandable Table | Click to expand details, grouped by jenis |
| Actions | Button Group | Draft KPI Output, Draft KAI, Input Realisasi, View History |

### Screen: KPI Detail

| Section | Komponen | Behavior |
| --- | --- | --- |
| Header | KPI Title + Status Badge | Draft / Pending Approval / Approved / Rejected |
| Target Info | Target Value + Unit + Type | Read-only after approval |
| Progress | Achievement Chart | Monthly/Quarterly trend line chart |
| Realization | Input Form / History Table | Form |

### Screen: KPI Detail

| Section | Komponen | Behavior |
| --- | --- | --- |
| Header | KPI Title + Status Badge | Draft / Pending Approval / Approved / Rejected |
| Target Info | Target Value + Unit + Type | Read-only after approval |
| Progress | Achievement Chart | Monthly/Quarterly trend line chart |
| Realization | Input Form / History Table | Form jika belum input, table jika sudah ada histori |
| Evidence | File Upload / Preview | Download/Preview dengan thumbnail |
| Timeline | Activity Log | Submission history |

---

## 1.5 Business Rules

| Rule ID | Rule | Enforcement |
| --- | --- | --- |
| BR-MP-001 | Total bobot item KPI Output = 100% | Block submit jika tidak valid |
| BR-MP-002 | Total bobot item KAI = 100% | Block submit jika tidak valid |
| BR-MP-003 | KPI Impact read-only (dari P-KPI) | Hide edit/delete button, semua field disabled |
| BR-MP-004 | Evidence wajib untuk submit realisasi | Block submit tanpa evidence |
| BR-MP-005 | Deadline input realisasi Monthly = Tanggal 5 | Warning banner setelah deadline |
| BR-MP-006 | Deadline input realisasi Quarterly = Tanggal 10 | Warning banner setelah deadline |
| BR-MP-007 | Direct Cascade: satuan child = satuan parent | Block submit child jika satuan berbeda |
| BR-MP-008 | Fixed Weight dari Kamus KPI tidak dapat diubah | Field bobot read-only dengan icon 🔒 |
| BR-MP-009 | Hanya Owner yang dapat input realisasi KPI Output | Hide input button untuk Shared Owner |
| BR-MP-010 | Reject wajib disertai catatan penolakan | Block reject tanpa catatan (min 20 karakter) |
| BR-MP-011 | Status On Track jika Achievement ≥ 100% | Auto-calculated, badge hijau |
| BR-MP-012 | Status Behind jika Achievement 80% - 99% | Auto-calculated, badge kuning |
| BR-MP-013 | Status At Risk jika Achievement < 80% | Auto-calculated, badge merah + email alert |
| BR-MP-014 | Shared Owner tidak dapat input realisasi | Hide input button, score mengikuti Owner |
| BR-MP-015 | Evidence history tidak dapat di-delete setelah approved | Hide delete button untuk approved realization |

---

## 1.6 Mock Data

[Mock Data: My Performance](https://www.notion.so/Mock-Data-My-Performance-cdb7b52468494207a1e28a4f40d23692?pvs=21)