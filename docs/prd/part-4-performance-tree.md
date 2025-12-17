## 1.1 Deskripsi Modul

**Performance Tree** adalah modul untuk mengelola struktur KPI secara hierarkis berdasarkan posisi/jabatan dan melakukan monitoring top-down. Modul ini memiliki dua fase utama: **Fase Perencanaan** (untuk alokasi dan konfigurasi KPI) dan **Fase Monitoring** (untuk pemantauan pencapaian).

| Aspek | Keterangan |
| --- | --- |
| **Target User** | Performance Admin, Executive |
| **Access Level** | View (Executive), Full (Admin) |
| **Primary Actions** | Browse Tree, Add KPI to Position, Monitor Top-Down, Track Cascading, View Allocation Status |
| **Operating Phases** | Perencanaan (Planning), Monitoring |

---

## 1.2 Epic Overview

<aside>
🌳

**Epic: Performance Tree**

Sebagai Performance Admin atau Executive, saya dapat melihat dan mengelola struktur KPI secara hierarkis berdasarkan organisasi untuk memastikan alignment KPI dari level korporat hingga individu, serta melakukan monitoring achievement secara top-down dengan visualisasi status alokasi dan hubungan cascading antar KPI.

</aside>

**Cakupan User Stories (Diurutkan berdasarkan Use Case):**

**Use Case 1: Navigasi & Visualisasi Tree**

| **Story ID** | **Summary** | **Actor** | **BRD Ref** |
| --- | --- | --- | --- |
| US-PT-001 | Navigate Performance Tree | Admin, Executive | BR-001 |
| US-PT-002 | Switch Planning/Monitoring Phase View | Admin, Executive | BR-001 |
| US-PT-003 | View KPI Allocation Status | Admin, Executive | BR-001 |
| US-PT-004 | View Position KPI Detail | Admin, Executive | BR-001 |
| US-PT-021 | Select Historical Period | Admin, Executive | BR-001 |

**Use Case 2: Pengelolaan KPI pada Position**

| **Story ID** | **Summary** | **Actor** | **BRD Ref** |
| --- | --- | --- | --- |
| US-PT-005 | Add KPI from Dictionary | Performance Admin | BR-004, BR-007 |
| US-PT-006 | Add Custom KPI | Performance Admin | BR-004 |
| US-PT-007 | Cascade KPI from Parent | Performance Admin | BR-005, BR-006 |
| US-PT-008 | Configure KPI Assignment | Performance Admin | BR-009, BR-010 |
| US-PT-009 | View KPI Attribute Changes | Admin, Executive | BR-004 |
| US-PT-022 | View Self-Cascaded KPI | Admin, Executive | BR-004 |

**Use Case 3: Monitoring Top-Down**

| **Story ID** | **Summary** | **Actor** | **BRD Ref** |
| --- | --- | --- | --- |
| US-PT-010 | Monitor Top-Down (Drill Down) | Executive | BR-026 |
| US-PT-011 | View Aggregate Performance | Executive | BR-026 |

**Use Case 4: Tracking Cascading & Alignment**

| **Story ID** | **Summary** | **Actor** | **BRD Ref** |
| --- | --- | --- | --- |
| US-PT-012 | Track Cascading Relationships | Admin, Executive | BR-005, BR-006 |
| US-PT-013 | Detect Alignment Gaps | Performance Admin | BR-005 |

**Use Case 5: Export & Reporting**

| **Story ID** | **Summary** | **Actor** | **BRD Ref** |
| --- | --- | --- | --- |
| US-PT-014 | Export Performance Data | Admin, Executive | BR-026 |

**Detail Panel Components (Supporting All Use Cases)**

| **Story ID** | **Summary** | **BRD Ref** |
| --- | --- | --- |
| US-PT-015 | View KPI Detail Panel - Basic Info | BR-004, BR-009 |
| US-PT-016 | View KPI Detail Panel - Ownership Info | BR-008, BR-010 |
| US-PT-017 | View KPI Detail Panel - Cascading Hierarchy | BR-005, BR-006 |
| US-PT-018 | View KPI Detail Panel - Realization Progress | BR-013, BR-027 |
| US-PT-019 | View KPI Detail Panel - Evidence & Attachments | BR-013 |
| US-PT-020 | View KPI Detail Panel - Approval History | BR-014, BR-015 |

---

## 1.3 User Stories Detail

### US-PT-001: Navigate Performance Tree

**User Story:**

**As a** Performance Admin / Executive

**I want to** menavigasi struktur Performance Tree berdasarkan hierarki organisasi

**So that** saya dapat melihat KPI dan status alokasi di setiap level dan posisi

**Acceptance Criteria:**

- **Given** saya login sebagai Performance Admin atau Executive
- **When** saya membuka menu "Performance Tree"
- **Then** saya melihat struktur tree hierarkis organisasi
- **And** saya dapat memilih mode navigasi: Organisasi / Function / Cohort
- **And** saya dapat expand/collapse setiap node
- **And** saya melihat summary metrics di setiap node termasuk:
    - Jumlah Allocated Items
    - Jumlah Unallocated Items
    - Status Perencanaan (Complete/Incomplete)
    - Status Monitoring (On Track/At Risk/Behind)
- **And** saya melihat phase indicator (Perencanaan/Monitoring) di header

**Validation Rules:**

- **UI Rules:**
    - Tree panel di sisi kiri dengan detail panel di kanan
    - Expand/collapse dengan klik icon atau node
    - Search box untuk quick navigation ke posisi tertentu
    - Breadcrumb menampilkan path navigasi saat ini
    - Phase toggle button di header: 📋 Perencanaan | 📊 Monitoring
    - Summary badge di setiap node menampilkan: `\[✓ X \| ○ Y\]` (X = allocated, Y = unallocated)
    - Color indicator per node:
        - 🟢 Hijau: Semua KPI allocated, planning complete
        - 🟡 Kuning: Partially allocated
        - 🔴 Merah: Belum ada alokasi / ada issue
- **Business Rules:**
    - Executive hanya dapat view, tidak dapat edit
    - Admin dapat view dan edit
    - Node dengan pending items ditandai dengan badge
    - Status perencanaan dan monitoring dihitung berdasarkan child nodes
- **Data Rules:**
    - Struktur organisasi dari MDM
    - Real-time sync dengan perubahan struktur organisasi
    - Allocation count di-aggregate dari semua KPI di bawah node
- **Edge Cases:**
    - Jika posisi tidak memiliki KPI, tampilkan empty state dengan indicator "0 Allocated"
    - Jika posisi vacant, tampilkan indicator "Vacant" dengan jumlah unallocated items

**Navigation Modes:**

| **Mode** | **Hierarchy** | **Use Case** |
| --- | --- | --- |
| Organisasi | Corporate → Direktorat → Dept → Section → Position | Standard org view |
| Function | Function → Sub-function → Position | Cross-unit analysis |
| Cohort | Cohort Level → Positions in Cohort | Peer comparison |

**Organization Node Summary Display:**

| **Metric** | **Display** | **Description** |
| --- | --- | --- |
| Allocated Items | ✓ X | Jumlah KPI yang sudah dialokasikan ke posisi |
| Unallocated Items | ○ Y | Jumlah KPI yang belum dialokasikan (dari cascade parent) |
| Planning Status | 📋 Complete / Incomplete | Status kelengkapan perencanaan KPI |
| Monitoring Status | 🟢 / 🟡 / 🔴 | Aggregate status pencapaian KPI |

---

### US-PT-002: Switch Planning/Monitoring Phase View

**User Story:**

**As a** Performance Admin / Executive

**I want to** beralih antara tampilan Fase Perencanaan dan Fase Monitoring

**So that** saya dapat melihat informasi yang relevan sesuai dengan fase yang sedang berjalan

**Acceptance Criteria:**

- **Given** saya berada di Performance Tree
- **When** saya klik toggle "Fase Perencanaan"
- **Then** tampilan tree menunjukkan:
    - Status alokasi KPI per posisi (Allocated/Unallocated)
    - Progress perencanaan per node
    - Action buttons untuk Add/Edit/Cascade KPI (untuk Admin)
    - Pending approval items ditandai dengan badge
- **When** saya klik toggle "Fase Monitoring"
- **Then** tampilan tree menunjukkan:
    - Achievement metrics per posisi
    - Status indicator (On Track/At Risk/Behind)
    - Visualisasi garis merah untuk hubungan parent-child yang Behind
    - Drill-down capability ke level individual

**Validation Rules:**

- **UI Rules:**
    - Toggle button dengan icon: 📋 Perencanaan | 📊 Monitoring
    - Active phase highlighted dengan warna berbeda
    - Transition smooth dengan loading indicator
    - Tooltip menjelaskan perbedaan setiap fase
    - Banner informasi di header menunjukkan periode aktif dan fase
- **Business Rules:**
    - **Fase Perencanaan:**
        - Fokus pada alokasi dan konfigurasi KPI
        - Edit capability aktif untuk Admin
        - Menampilkan target yang direncanakan
    - **Fase Monitoring:**
        - Fokus pada achievement dan realisasi
        - Read-only untuk struktur KPI
        - Menampilkan actual vs target
        - Visualisasi khusus untuk KPI Behind
- **Data Rules:**
    - Phase switching tidak mengubah data, hanya view
    - Cached data per phase untuk performance
- **Edge Cases:**
    - Jika periode perencanaan belum dibuka, Fase Perencanaan disabled dengan tooltip
    - Jika belum ada realisasi, Fase Monitoring menampilkan "Belum ada data monitoring"

**Phase Comparison:**

| **Aspect** | **Fase Perencanaan** | **Fase Monitoring** |
| --- | --- | --- |
| Focus | Alokasi & Konfigurasi KPI | Achievement & Realisasi |
| Primary Metrics | Allocated/Unallocated count | Achievement %, Status |
| Edit Capability | Ya (Admin) | Tidak |
| Visualization | Allocation badges | Achievement bars, Red lines for Behind |
| Actions Available | Add, Edit, Cascade, Configure | View, Drill-down, Export |

---

### US-PT-003: View KPI Allocation Status

**User Story:**

**As a** Performance Admin / Executive

**I want to** melihat status alokasi KPI pada setiap posisi dalam tree

**So that** saya dapat mengidentifikasi posisi mana yang sudah memiliki KPI lengkap dan mana yang masih perlu dialokasikan

**Acceptance Criteria:**

- **Given** saya berada di Performance Tree (Fase Perencanaan atau Monitoring)
- **When** saya melihat tree structure
- **Then** setiap node posisi menampilkan badge status alokasi:
    - **Allocated:** Jumlah KPI yang sudah di-assign ke posisi
    - **Unallocated:** Jumlah KPI dari parent yang belum di-cascade
- **And** saya dapat filter tree berdasarkan status alokasi
- **When** saya klik pada item KPI yang Allocated
- **Then** saya melihat detail lengkap termasuk:
    - Owner (nama dan posisi)
    - Target Value dan Unit
    - Bobot
    - Cascading Method
    - Source (Dictionary/Custom/Cascaded)
    - Status Workflow (Draft/Pending/Approved)

**Validation Rules:**

- **UI Rules:**
    - Badge status di samping setiap node: `\[✓ X \| ○ Y\]`
    - Color coding:
        - 🟢 Fully Allocated: Semua KPI dari parent sudah di-cascade
        - 🟡 Partially Allocated: Sebagian KPI allocated
        - ⚪ Not Allocated: Belum ada KPI
    - Filter chips: "All", "Fully Allocated", "Partially Allocated", "Not Allocated"
    - Expandable detail panel untuk item KPI
    - Hover tooltip menampilkan quick summary
- **Business Rules:**
    - Unallocated count = KPI dari parent dengan cascading method yang belum di-assign ke child
    - Status dihitung per jenis KPI (Output dan KAI)
    - KPI Impact tidak termasuk dalam alokasi (read-only dari P-KPI)
- **Data Rules:**
    - Real-time calculation dari database Performance Tree
    - Aggregate count dari semua level di bawah node
- **Edge Cases:**
    - Jika tidak ada parent KPI untuk cascade, Unallocated = 0
    - Jika posisi baru dibuat, tampilkan "New Position - Allocation Required"

**Allocated Item Detail Fields:**

| **Field** | **Source** | **Description** |
| --- | --- | --- |
| Title | KPI Data | Nama KPI |
| Owner | Assignment | Nama dan posisi pemilik KPI |
| Target Value | KPI Data | Nilai target yang ditetapkan |
| Target Unit | KPI Data | Satuan pengukuran |
| Bobot | Assignment | Persentase bobot dalam portofolio |
| Cascading Method | KPI Data | Direct / Indirect |
| Source | KPI Data | Dictionary / Custom / Cascaded from Parent |
| Workflow Status | System | Draft / Pending Approval / Approved |

---

### US-PT-004: View Position KPI Detail

**User Story:**

**As a** Performance Admin / Executive

**I want to** melihat detail KPI yang attached ke suatu posisi

**So that** saya dapat memahami target, achievement, dan ownership posisi tersebut

**Acceptance Criteria:**

- **Given** saya berada di Performance Tree
- **When** saya klik suatu node posisi
- **Then** saya melihat detail panel dengan informasi posisi
- **And** saya melihat incumbent(s) yang menjabat posisi tersebut
- **And** saya melihat daftar KPI Impact (read-only, dari P-KPI)
- **And** saya melihat daftar KPI Output dengan:
    - Status alokasi (Allocated/Unallocated)
    - Detail owner, target, bobot untuk item Allocated
    - Achievement (pada Fase Monitoring)
- **And** saya melihat daftar KAI dengan achievement

**Validation Rules:**

- **UI Rules:**
    - Tab switching: Impact | Output | KAI
    - Setiap tab menampilkan summary: "X Allocated | Y Unallocated"
    - Item Allocated menampilkan: Title, Target, Bobot, Owner, Achievement, Status
    - Item Unallocated menampilkan: Title dengan badge "Pending Allocation"
    - Color coding achievement: Hijau (≥100%), Kuning (80-99%), Merah (<80%)
    - Cascade indicator untuk item yang di-cascade (🔗 Direct, 🔀 Indirect)
- **Business Rules:**
    - KPI Impact tidak dapat di-edit (source: P-KPI)
    - KPI Output dan KAI dapat di-manage oleh Admin
    - Bobot per tipe KPI harus = 100% total
    - Unallocated items = KPI dari parent yang belum di-assign
- **Data Rules:**
    - Position info dari tb_position_master_v2
    - Incumbent dari MDM
    - KPI dari Performance Tree database
- **Edge Cases:**
    - Jika incumbent > 1 (same position), tampilkan list dengan individual achievement
    - Jika tidak ada KPI, tampilkan empty state dengan CTA "Add KPI"

**Position Detail Schema:**

| **Field** | **Source** | **Description** |
| --- | --- | --- |
| Position Name | MDM | Nama jabatan |
| Position Code | MDM | Kode jabatan |
| Cohort | MDM | Level cohort untuk calibration |
| Function | MDM | Department/Function |
| Incumbent(s) | MDM | Pekerja yang menjabat |
| Total KPI Count | Calculated | Jumlah KPI attached (Allocated + Unallocated) |
| Allocated Count | Calculated | Jumlah KPI yang sudah di-assign |
| Unallocated Count | Calculated | Jumlah KPI pending allocation |
| Avg Achievement | Calculated | Rata-rata achievement (Monitoring phase) |

---

### US-PT-021: Select Historical Period

**User Story:**

**As a** Performance Admin / Executive

**I want to** memilih periode (bulan dan tahun) untuk melihat data historikal

**So that** saya dapat membandingkan KPI dan achievement di periode sebelumnya pada view Struktur Organisasi maupun Struktur KPI

**Acceptance Criteria:**

- **Given** saya berada di Performance Tree (Struktur Organisasi atau Struktur KPI)
- **When** saya membuka period selector di header
- **Then** saya melihat dropdown dengan pilihan periode: bulan dan tahun
- **And** saya dapat memilih periode tertentu (e.g., "March 2025")
- **When** saya memilih periode
- **Then** seluruh view tree ter-update menampilkan data untuk periode yang dipilih
- **And** semua metrics (Allocation Status, Achievement, Status) berdasarkan snapshot periode tersebut
- **And** saya dapat compare data antar periode dengan toggle "Compare Mode"

**Validation Rules:**

- **UI Rules:**
    - Period selector di header dengan format: "Month YYYY"
    - Dropdown dengan list periode tersedia (dari periode perencanaan pertama hingga bulan berjalan)
    - Default = current period (bulan berjalan)
    - Banner notification: "Viewing historical data: [Selected Period]"
    - Quick navigation: "< Previous Month | Next Month >"
    - Toggle "Compare Mode" untuk side-by-side comparison dengan periode lain
    - Visual indicator di setiap node menunjukkan data snapshot periode tersebut
- **Business Rules:**
    - **Fase Perencanaan:** Tampilkan allocation status snapshot periode tersebut
    - **Fase Monitoring:** Tampilkan achievement dan realization periode tersebut
    - Periode yang dapat dipilih dimulai dari periode perencanaan pertama yang pernah aktif
    - Future periods (bulan yang belum datang) tidak dapat dipilih
    - Historical data read-only (tidak dapat di-edit)
- **Data Rules:**
    - Data snapshot tersimpan per periode close (end of month)
    - Real-time calculation untuk periode berjalan
    - Historical data cached untuk performance
    - Metrics yang ditampilkan per periode:
        - **Planning Phase:** Allocated count, Unallocated count, Planning status
        - **Monitoring Phase:** Target, Actual, Achievement %, Status
- **Edge Cases:**
    - Jika belum ada data untuk periode tertentu, tampilkan "No data available for this period"
    - Jika struktur organisasi berubah antar periode, tampilkan warning "Organization structure has changed"
    - Jika KPI di-delete/archived di periode sebelumnya, tampilkan dengan badge "Archived"

**Period Selector Options:**

| **Option** | **Behavior** | **Data Source** |
| --- | --- | --- |
| Current Period | Real-time data bulan berjalan | Live database |
| Previous Months | Historical snapshot data | Period snapshot table |
| Compare Mode | Side-by-side 2 periode | Period snapshot + live |

---

### US-PT-022: View Self-Cascaded KPI

**User Story:**

**As a** Performance Admin / Executive

**I want to** melihat informasi KPI yang di-cascade oleh pekerja/atasannya sendiri (tidak melalui Performance Tree)

**So that** saya dapat mengidentifikasi KPI yang dikelola langsung oleh pekerja tanpa melalui proses alokasi struktural

**Acceptance Criteria:**

- **Given** saya membuka panel detail posisi
- **When** saya melihat section "KPI Summary"
- **Then** saya melihat informasi agregat:
    - **Total KPI:** Jumlah total KPI attached ke posisi
    - **Via Performance Tree:** Jumlah KPI yang di-cascade melalui Performance Tree
    - **Self-Cascaded:** Jumlah KPI yang di-cascade langsung oleh pekerja/atasan dari My Performance
- **When** saya klik "View Self-Cascaded KPI"
- **Then** saya melihat daftar lengkap KPI yang di-cascade sendiri dengan:
    - Title KPI
    - Owner (nama pekerja yang melakukan cascade)
    - Source (dari KPI parent mana)
    - Date cascaded
    - Status (Active/Archived)
    - Badge "Self-Cascaded ⚡"

**Validation Rules:**

- **UI Rules:**
    - Section "KPI Summary" di header panel detail posisi
    - Card summary dengan breakdown: Total | Via Tree | Self-Cascaded
    - Badge count pada tab KPI menampilkan total (Tree + Self)
    - Self-Cascaded items ditandai dengan icon ⚡ dan background highlight berbeda
    - Filter toggle: "Show All" | "Via Tree Only" | "Self-Cascaded Only"
    - Expandable detail untuk setiap Self-Cascaded item
- **Business Rules:**
    - **Self-Cascaded KPI:** KPI yang di-create via "Cascade from Parent" di My Performance oleh pekerja sendiri atau atasannya
    - Tidak melalui proses alokasi struktural di Performance Tree
    - Tetap terhitung dalam achievement posisi
    - Performance Admin dapat view tapi tidak dapat edit (ownership di My Performance)
    - Self-Cascaded dapat di-convert ke "Via Tree" jika diperlukan (Admin action)
- **Data Rules:**
    - Source tracking: `created_via = 'my_performance'` vs `created_via = 'performance_tree'`
    - Link ke parent KPI tersimpan untuk traceability
    - Ownership = pekerja yang melakukan cascade
- **Edge Cases:**
    - Jika pekerja dimutasi/resign, Self-Cascaded KPI tetap attached ke posisi dengan badge "Orphaned"
    - Jika parent KPI dihapus, Self-Cascaded KPI menjadi "Orphaned" dengan warning
    - Admin dapat re-assign atau archive Orphaned KPI

**KPI Summary Display:**

| **Metric** | **Count** | **Description** |
| --- | --- | --- |
| Total KPI | 15 | Semua KPI attached ke posisi |
| Via Performance Tree | 12 | KPI yang di-cascade melalui Performance Tree oleh Admin |
| Self-Cascaded ⚡ | 3 | KPI yang di-cascade langsung oleh pekerja/atasan via My Performance |

---

### US-PT-005: Add KPI from Dictionary

**User Story:**

**As a** Performance Admin

**I want to** menambahkan KPI dari Dictionary ke suatu posisi

**So that** saya dapat menggunakan KPI standar yang sudah tervalidasi

**Acceptance Criteria:**

- **Given** saya berada di Position KPI Detail
- **And** saya adalah Performance Admin
- **And** fase Perencanaan sedang aktif
- **When** saya klik tombol "Add KPI" → "From Dictionary"
- **Then** sistem menampilkan browser KPI Dictionary
- **And** saya dapat search dan filter dictionary items
- **And** saya memilih item yang sesuai
- **When** saya klik "Add to Position"
- **Then** sistem menampilkan form konfigurasi
- **And** saya mengisi Target Value dan Bobot
- **When** saya klik "Save"
- **Then** KPI tersimpan di Performance Tree posisi tersebut dengan status "Allocated"

**Validation Rules:**

- **UI Rules:**
    - Modal browser dengan search dan filter
    - Preview item sebelum add
    - Configuration form setelah select
    - Fixed Weight item: bobot read-only dengan icon 🔒
    - Badge "From Dictionary 📖" pada item yang di-add
- **Business Rules:**
    - Hanya item "Published" yang dapat dipilih
    - Item harus match dengan Applicable Cohorts posisi
    - Fixed Weight tidak dapat diubah (BR-KD-001)
    - Status setelah add = "Allocated - Draft"
- **Data Rules:**
    - Link ke dictionary item tersimpan
    - Usage count dictionary ter-increment
- **Edge Cases:**
    - Jika item sudah ada di posisi, tampilkan warning "Already exists"
    - Jika fase Perencanaan tidak aktif, tombol Add disabled

---

### US-PT-006: Add Custom KPI

**User Story:**

**As a** Performance Admin

**I want to** menambahkan KPI custom ke suatu posisi

**So that** saya dapat membuat KPI spesifik yang tidak ada di Dictionary

**Acceptance Criteria:**

- **Given** saya berada di Position KPI Detail
- **And** saya adalah Performance Admin
- **And** fase Perencanaan sedang aktif
- **When** saya klik tombol "Add KPI" → "Custom"
- **Then** sistem menampilkan form input KPI
- **And** saya mengisi seluruh mandatory fields
- **When** saya klik "Save"
- **Then** KPI tersimpan di Performance Tree posisi tersebut
- **And** status KPI = "Allocated - Draft" (perlu approval atasan incumbent)

**Validation Rules:**

- **UI Rules:**
    - Form sama dengan draft KPI di My Performance
    - KPI Type selector: Output / KAI
    - For KAI: frequency selector (Mingguan / Bulanan)
    - Badge "Custom ✏️" pada item yang di-add
- **Business Rules:**
    - Custom KPI perlu approval workflow
    - Admin dapat bypass approval jika diperlukan
    - Custom KPI tidak otomatis masuk ke Dictionary
    - Status setelah add = "Allocated - Draft"
- **Data Rules:**
    - Custom KPI tidak linked ke dictionary
    - Dapat di-suggest ke Dictionary setelah approved
- **Edge Cases:**
    - Jika title sudah ada, tampilkan warning "Duplicate title"

**Custom KPI Input Fields:**

| **Field** | **Type** | **Mandatory** |
| --- | --- | --- |
| Title | Text | Ya |
| Description | Rich Text | Ya |
| KPI Type | Enum | Ya (Output / KAI) |
| Target Value | Number | Ya |
| Target Unit | Text | Ya |
| Polarity | Enum | Ya |
| Bobot | Number | Ya (1-100%) |
| Evidence Requirement | Text | Ya |
| Monitoring Frequency | Enum | Ya (untuk KAI) |

---

### US-PT-007: Cascade KPI from Parent

**User Story:**

**As a** Performance Admin

**I want to** men-cascade KPI dari posisi parent ke posisi child

**So that** saya dapat memastikan alignment KPI antar level

**Acceptance Criteria:**

- **Given** saya berada di Position KPI Detail
- **And** posisi tersebut memiliki parent dengan KPI Output
- **When** saya klik tombol "Add KPI" → "Cascade from Parent"
- **Then** sistem menampilkan daftar KPI dari parent yang dapat di-cascade (Unallocated items)
- **And** saya memilih KPI yang akan di-cascade
- **And** saya memilih cascade type: Direct / Indirect
- **When** saya klik "Configure"
- **Then** sistem menampilkan form konfigurasi sesuai cascade type
- **When** saya klik "Save"
- **Then** child KPI tersimpan dengan link ke parent
- **And** status parent KPI unallocated count berkurang

**Validation Rules:**

- **UI Rules:**
    - List parent KPIs yang available untuk cascade (Unallocated items highlighted)
    - Radio button: Direct / Indirect dengan tooltip penjelasan
    - Configuration form berbeda per cascade type
    - Visual indicator: 🔗 untuk Direct, 🔀 untuk Indirect
- **Business Rules:**
    - **Direct Cascade:**
        - Unit child WAJIB sama dengan parent (BR-006)
        - Realisasi child akan di-SUM ke parent
        - Visualisasi khusus: garis solid penghubung
    - **Indirect Cascade:**
        - Unit child boleh berbeda
        - Realisasi independen (tidak auto-sum)
        - Visualisasi: garis putus-putus penghubung
- **Technical Rules:**
    - Parent-child relationship tersimpan di database
    - Trigger auto-sum untuk Direct Cascade
- **Edge Cases:**
    - Jika parent KPI belum approved, tidak dapat di-cascade
    - Jika semua parent KPI sudah allocated, tampilkan "All KPIs allocated"

**Cascade Type Comparison:**

| **Aspect** | **Direct Cascade** | **Indirect Cascade** |
| --- | --- | --- |
| Unit | Harus sama dengan parent | Boleh berbeda |
| Realisasi | Auto-SUM ke parent | Independen |
| Target | Dapat berbeda | Dapat berbeda |
| Visual | Garis solid (━━━) | Garis putus-putus (┄┄┄) |
| Use Case | Output yang terukur sama | Aktivitas pendukung |

---

### US-PT-008: Configure KPI Assignment

**User Story:**

**As a** Performance Admin

**I want to** mengkonfigurasi ownership assignment untuk KPI

**So that** saya dapat menentukan siapa yang bertanggung jawab atas KPI tersebut

**Acceptance Criteria:**

- **Given** saya sedang menambahkan KPI ke posisi
- **When** saya sampai di step Owner Assignment
- **Then** saya dapat memilih assignment type: Position-based / Specific Employee
- **If** Position-based:
    - **Then** semua incumbent di posisi menjadi Owner (Shared)
- **If** Specific Employee:
    - **Then** saya memilih 1 incumbent sebagai Owner
    - **And** saya dapat assign incumbent lain sebagai Shared Owner

**Validation Rules:**

- **UI Rules:**
    - Radio button untuk assignment type
    - Dropdown incumbent list untuk Specific Employee
    - Multi-select untuk Shared Owner
    - Warning banner untuk Shared Owner limitations
    - Preview hasil assignment sebelum save
- **Business Rules:**
    - Hanya 1 Owner per KPI item
    - Shared Owner tidak dapat input realisasi (BR-010)
    - Shared Owner mendapat achievement identik dengan Owner
    - Status setelah configure = "Allocated"
- **Data Rules:**
    - Owner dan Shared Owner tersimpan di Performance Tree
    - Achievement di-copy ke semua Shared Owner saat Owner submit
- **Edge Cases:**
    - Jika incumbent dimutasi, alert untuk re-assign ownership
    - Jika posisi vacant, tampilkan warning "Position vacant - assignment pending"

**Assignment Options:**

| **Option** | **Behavior** | **Use Case** |
| --- | --- | --- |
| Position-based | Semua incumbent = Owner (masing-masing input realisasi sendiri) | Multiple holders, independent output |
| Specific + Owner | 1 incumbent = Owner (input realisasi) | Single accountability |
| Specific + Shared | 1 Owner + N Shared Owners (achievement sama) | Shared responsibility, same output |

---

### US-PT-009: View KPI Attribute Changes

**User Story:**

**As a** Performance Admin / Executive

**I want to** melihat perubahan atribut KPI ketika dialokasikan oleh pekerja

**So that** saya dapat memonitor deviasi dari KPI standar dan mengidentifikasi adjustment yang dilakukan

**Acceptance Criteria:**

- **Given** saya berada di Position KPI Detail
- **And** KPI telah dialokasikan dengan perubahan atribut dari standar/parent
- **When** saya melihat item KPI yang mengalami perubahan
- **Then** sistem menampilkan indicator delta (Δ) pada item tersebut
- **And** saya melihat badge "Modified" dengan tooltip detail perubahan
- **When** saya klik item atau expand detail
- **Then** saya melihat comparison view:
    - **Original Value:** Nilai dari Dictionary/Parent
    - **Current Value:** Nilai setelah alokasi
    - **Delta:** Selisih/perubahan

**Validation Rules:**

- **UI Rules:**
    - Delta indicator: Δ dengan warna berbeda per jenis perubahan
        - 🔺 Merah: Target increased
        - 🔻 Hijau: Target decreased
        - 🔄 Biru: Other attribute changed
    - Badge "Modified ✏️" di header item
    - Tooltip on hover menampilkan quick diff
    - Expandable section "Change History" dalam detail panel
    - Side-by-side comparison untuk detail view
- **Business Rules:**
    - Perubahan yang di-track:
        - Target Value
        - Target Unit (untuk non-Direct Cascade)
        - Bobot
        - Evidence Requirement
    - Perubahan dari Fixed Weight item tidak allowed (read-only)
    - History perubahan di-log untuk audit
- **Data Rules:**
    - Original value tersimpan sebagai reference
    - Timestamp perubahan tercatat
    - Actor (siapa yang mengubah) tercatat
- **Edge Cases:**
    - Jika tidak ada perubahan, hide delta indicator
    - Jika perubahan di-revert ke original, remove "Modified" badge

**Change Tracking Fields:**

| **Field** | **Original Source** | **Change Indicator** |
| --- | --- | --- |
| Target Value | Parent KPI / Dictionary | Δ +/- value |
| Target Unit | Parent KPI / Dictionary | "Unit changed" |
| Bobot | Dictionary (if Fixed) / User input | Δ +/- % |
| Evidence Requirement | Dictionary | "Modified" |

**Change History Entry:**

| **Column** | **Description** |
| --- | --- |
| Timestamp | DD MMM YYYY, HH:mm |
| Actor | Nama pekerja yang mengubah |
| Field | Nama atribut yang diubah |
| From | Nilai sebelum perubahan |
| To | Nilai setelah perubahan |

---

### US-PT-010: Monitor Top-Down (Drill Down)

**User Story:**

**As a** Executive

**I want to** melakukan drill-down dari level korporat ke individu

**So that** saya dapat menelusuri pencapaian dari atas ke bawah dengan visualisasi status KPI

**Acceptance Criteria:**

- **Given** saya login sebagai Executive
- **And** saya berada di Fase Monitoring
- **When** saya membuka "Top-Down Monitor"
- **Then** saya melihat KPI Impact level korporat
- **When** saya klik salah satu KPI Impact
- **Then** saya melihat breakdown ke level Direktorat
- **And** saya dapat terus drill-down hingga level Individual
- **And** setiap level menampilkan aggregate metrics
- **And** saya melihat visualisasi garis merah untuk parent-child relationship yang "Behind"
- **And** saya melihat visualisasi khusus (garis solid) untuk Direct Cascade relationship

**Validation Rules:**

- **UI Rules:**
    - Breadcrumb menampilkan drill-down path
    - Back button untuk naik ke level sebelumnya
    - Summary cards di setiap level
    - Expandable rows untuk quick preview
    - **Visualisasi Khusus:**
        - 🔴 **Garis Merah:** Menghubungkan parent KPI ke child KPI dengan status "Behind"
        - ━━━ **Garis Solid:** Direct Cascade relationship
        - ┄┄┄ **Garis Putus-putus:** Indirect Cascade relationship
    - Legend di header menjelaskan visual coding
- **Business Rules:**
    - Drill-down mengikuti cascade relationships
    - Jika tidak ada cascade, tampilkan "No breakdown available"
    - Behind status trigger red line visualization
    - Direct Cascade ditampilkan dengan garis lebih tebal
- **Data Rules:**
    - Data aggregated real-time dari child nodes
    - Behind threshold: Achievement < 100%
- **Edge Cases:**
    - Jika node tidak memiliki children, tampilkan individual detail
    - Jika semua children On Track, tidak ada garis merah

**Drill-Down Paths:**

| **Start Level** | **Drill-Down Path** |
| --- | --- |
| Corporate (KPI Impact) | → Direktorat → Department → Section → Position → Individual |
| BOD-1 | → BOD-2 → BOD-3 → BOD-4 |
| Function | → Sub-function → Position → Individual |

**Visual Coding Legend:**

| **Visual** | **Meaning** | **When Applied** |
| --- | --- | --- |
| 🔴 Red Line | Behind Status Connection | Parent-child dimana child Behind |
| ━━━ Solid Line | Direct Cascade | Realisasi di-SUM ke parent |
| ┄┄┄ Dashed Line | Indirect Cascade | Realisasi independen |
| 🟢 Green Node | On Track (≥100%) | Achievement mencapai target |
| 🟡 Yellow Node | At Risk | Item OK tapi child Behind |
| 🔴 Red Node | Behind (<100%) | Achievement di bawah target |

---

### US-PT-011: View Aggregate Performance

**User Story:**

**As a** Executive

**I want to** melihat aggregate performance metrics di setiap level

**So that** saya dapat memahami distribusi achievement di organisasi

**Acceptance Criteria:**

- **Given** saya berada di Top-Down Monitor (Fase Monitoring)
- **When** saya berada di suatu level (non-individual)
- **Then** saya melihat aggregate metrics: Average, Min, Max, Distribution
- **And** saya melihat chart distribusi achievement
- **And** saya dapat identify outliers (over/under performers)

**Validation Rules:**

- **UI Rules:**
    - Summary cards: Avg, Min, Max, Count
    - Distribution chart (histogram atau bar chart)
    - Outlier highlighting dengan color coding
    - Export button untuk data
    - Breakdown by allocation status: "X On Track | Y At Risk | Z Behind"
- **Business Rules:**
    - Aggregate dihitung dari approved realisasi saja
    - Pending/draft tidak termasuk dalam aggregate
    - At Risk = item OK tapi minimal 1 child Behind
- **Data Rules:**
    - Real-time calculation dari child nodes
- **Edge Cases:**
    - Jika semua children pending, tampilkan "No data available"

**Aggregate Metrics:**

| **Metric** | **Formula** | **Display** |
| --- | --- | --- |
| Average | SUM(Achievement) / COUNT(Children) | Percentage with color |
| Min | MIN(Achievement) | Percentage + Owner name |
| Max | MAX(Achievement) | Percentage + Owner name |
| Distribution | Grouped by range (0-50, 50-80, 80-100, >100) | Bar chart |

---

### US-PT-012: Track Cascading Relationships

**User Story:**

**As a** Performance Admin / Executive

**I want to** melihat hubungan cascading antar KPI dengan visualisasi khusus

**So that** saya dapat memahami bagaimana KPI terhubung dari atas ke bawah dan mengidentifikasi area bermasalah

**Acceptance Criteria:**

- **Given** saya berada di Performance Tree
- **When** saya klik suatu KPI item
- **Then** saya melihat cascade relationship view
- **And** saya melihat parent KPI (jika ada)
- **And** saya melihat child KPIs (jika ada)
- **And** saya melihat cascade type (Direct/Indirect) setiap relationship
- **For** Direct Cascade:
    - **Then** saya melihat contribution % ke parent
    - **And** visualisasi garis solid penghubung
- **For** Fase Monitoring dengan child Behind:
    - **Then** saya melihat garis merah menghubungkan parent ke child yang Behind

**Validation Rules:**

- **UI Rules:**
    - Cascade tree visualization (flowchart style)
    - Parent di atas, children di bawah
    - **Visual coding:**
        - Direct cascade: solid line (━━━)
        - Indirect: dashed line (┄┄┄)
        - Behind child: red line (🔴━━━)
    - Contribution percentage label pada Direct links
    - Click-to-navigate pada setiap node
    - Zoom in/out untuk large trees
- **Business Rules:**
    - Direct Cascade: Parent Realization = SUM(Child Realizations)
    - Indirect Cascade: No auto-calculation
    - Behind status (Achievement < 100%) triggers red visualization
- **Data Rules:**
    - Cascade relationships dari Performance Tree database
- **Edge Cases:**
    - Orphan KPI (tanpa parent): tampilkan indicator "Standalone"
    - Jika child Behind dan Direct Cascade, parent potentially affected

**Cascade Visualization Example:**

```jsx
[Parent KPI: Revenue Target] 🟢 On Track
        │
   ┌────┴────┐
   │ Direct  │ Direct
   │ (━━━)   │ (🔴━━━) ← Red: Child Behind
   ▼         ▼
[Child A]  [Child B]
 40%        60%
 🟢         🔴 Behind
```

---

### US-PT-013: Detect Alignment Gaps

**User Story:**

**As a** Performance Admin

**I want to** mendeteksi gap dalam alignment KPI

**So that** saya dapat memastikan tidak ada KPI yang orphan atau tidak ter-cascade

**Acceptance Criteria:**

- **Given** saya login sebagai Performance Admin
- **When** saya membuka "Alignment Analysis"
- **Then** saya melihat daftar potential issues:
    - KPI tanpa cascade ke level bawah (Unallocated)
    - Orphan KPI (tanpa parent, bukan dari Dictionary)
    - Unit mismatch pada Direct Cascade
    - Incomplete cascade (ada level yang skip)
- **And** saya dapat klik issue untuk navigate ke detail

**Validation Rules:**

- **UI Rules:**
    - Issue list dengan severity indicator (Warning / Error)
    - Filter by issue type
    - Quick action untuk resolve issue
    - Summary dashboard: "X Errors | Y Warnings"
- **Business Rules:**
    - KPI Impact dari P-KPI tidak termasuk orphan check
    - Warning ≠ blocking (bisa diabaikan)
    - Error = blocking (harus di-resolve)
- **Data Rules:**
    - Analysis run on-demand atau scheduled
    - Results cached untuk performance
- **Edge Cases:**
    - Jika tidak ada issues, tampilkan "All aligned ✓"
- **Issue Types:**
    
    
    | **Issue Type** | **Severity** | **Description** |
    | --- | --- | --- |
    | No Cascade Down | Warning | KPI belum di-cascade ke level bawah (Unallocated) |
    | Orphan KPI | Warning | Custom KPI tanpa parent linkage |
    | Unit Mismatch | Error | Direct Cascade dengan unit berbeda |
    | Level Skip | Warning | Cascade melompati level hierarki |

### US-PT-014: Export Performance Data

**User Story:**

**As a** Performance Admin / Executive

**I want to** meng-export data Performance Tree

**So that** saya dapat melakukan analisis lebih lanjut di luar sistem

**Acceptance Criteria:**

- **Given** saya berada di Performance Tree atau Top-Down Monitor
- **When** saya klik tombol "Export"
- **Then** saya dapat memilih scope: Current View / All Data
- **And** saya dapat memilih format: Excel / CSV / PDF
- **And** saya dapat memilih fields yang akan di-export
- **And** saya dapat memilih phase data: Planning / Monitoring / Both
- **When** saya klik "Download"
- **Then** file ter-download sesuai pilihan

**Validation Rules:**

- **UI Rules:**
    - Export modal dengan options
    - Preview row count sebelum export
    - Progress indicator untuk large exports
    - Checkbox untuk include allocation status data
- **Business Rules:**
    - Max 10,000 rows per export
    - Sensitive data (NIPP) dapat di-mask (optional)
    - Export history di-log untuk audit
- **Technical Rules:**
    - Background job untuk large exports
    - Notification saat export selesai
- **Edge Cases:**
    - Jika data > 10,000, tampilkan warning dan suggest filter

---

### US-PT-015: View KPI Detail Panel - Basic Info

**User Story:**

**As a** Performance Admin / Executive

**I want to** melihat informasi dasar KPI pada panel detail

**So that** saya dapat memahami konteks dan definisi KPI secara lengkap

**Acceptance Criteria:**

- **Given** saya berada di Performance Tree
- **When** saya klik pada item KPI di daftar
- **Then** sistem menampilkan panel detail KPI
- **And** saya melihat informasi dasar: Title, Description, BSC Perspective, Target Value, Target Unit, Target Type (Fixed/Progressive)
- **And** saya melihat Allocation Status (Allocated/Unallocated)
- **And** saya melihat Workflow Status (Draft/Pending Approval/Approved/Rejected)
- **And** saya melihat sumber KPI (Manual/Kamus KPI/Cascaded) dengan link ke sumber

**Validation Rules:**

- **UI Rules:**
    - Panel detail muncul sebagai side panel atau modal
    - Header menampilkan Title + Status Badge dengan color coding
    - Allocation Status badge: ✓ Allocated (green) / ○ Unallocated (gray)
    - Section "Basic Info" sebagai accordion yang default expanded
    - Field dari Kamus KPI ditandai dengan icon 📖
    - Field yang di-modify ditandai dengan Δ indicator
- **Business Rules:**
    - Semua field read-only jika status = Approved
    - Field dapat di-edit jika status = Draft atau Rejected (Admin only)
- **Data Rules:**
    - Title: max 200 karakter
    - Description: max 1000 karakter, support rich text

**Detail Panel - Basic Info Fields:**

| **Field** | **Type** | **Source** |
| --- | --- | --- |
| Title | Text | User Input / Kamus KPI / Parent |
| Description | Rich Text | User Input / Kamus KPI / Parent |
| BSC Perspective | Enum | User Input / Kamus KPI |
| Target Value | Number | User Input |
| Target Unit | Text | User Input / Kamus KPI / Parent |
| Target Type | Enum | Fixed / Progressive |
| Polarity | Enum | Maximize / Minimize |
| Allocation Status | Enum | System Generated |
| Workflow Status | Enum | System Generated |
| Sumber KPI | Enum + Link | Manual / Kamus KPI / Cascaded |

---

### US-PT-016: View KPI Detail Panel - Ownership Info

**User Story:**

**As a** Performance Admin / Executive

**I want to** melihat informasi ownership KPI pada panel detail

**So that** saya mengetahui siapa Owner dan Shared Owner beserta bobot kontribusi masing-masing

**Acceptance Criteria:**

- **Given** saya membuka panel detail KPI yang sudah Allocated
- **When** saya melihat section "Ownership"
- **Then** saya melihat nama dan posisi Owner KPI
- **And** saya melihat daftar Shared Owner (jika ada)
- **And** saya melihat bobot kontribusi setiap Shared Owner
- **And** saya melihat total bobot kontribusi = 100%

**Validation Rules:**

- **UI Rules:**
    - Section "Ownership" sebagai accordion
    - Owner ditampilkan dengan badge 👑 dan foto profil
    - Shared Owner ditampilkan dengan badge 🤝 dan bobot %
    - Tampilkan avatar stack jika lebih dari 3 Shared Owner
    - Untuk Unallocated item, tampilkan "Pending Assignment"
- **Business Rules:**
    - Owner = 1 orang, bertanggung jawab input realisasi (BR-008)
    - Shared Owner dapat lebih dari 1, score mengikuti Owner (BR-010)
- **Data Rules:**
    - Nama diambil dari MDM
    - Posisi diambil dari Position Master

**Ownership Display:**

| **Role** | **Icon** | **Info Displayed** | **Can Input Realization** |
| --- | --- | --- | --- |
| Owner | 👑 | Nama, Posisi, NIPP | Ya |
| Shared Owner | 🤝 | Nama, Posisi, NIPP, Bobot % | Tidak |

---

### US-PT-017: View KPI Detail Panel - Cascading Hierarchy

**User Story:**

**As a** Performance Admin / Executive

**I want to** melihat hierarki cascading KPI pada panel detail

**So that** saya memahami hubungan KPI dengan parent dan child serta status masing-masing

**Acceptance Criteria:**

- **Given** saya membuka panel detail KPI Output
- **When** saya melihat section "Cascading"
- **Then** saya melihat Parent KPI (jika ada) dengan nama, owner, dan achievement
- **And** saya melihat daftar Child KPI (jika ada) dengan nama, owner, dan achievement
- **And** saya melihat Cascading Method (Direct/Indirect)
- **And** saya melihat visual indicator untuk child yang Behind (garis merah)
- **And** saya dapat klik Parent/Child untuk navigasi ke detail KPI tersebut

**Validation Rules:**

- **UI Rules:**
    - Section "Cascading" sebagai accordion
    - Visualisasi tree sederhana: Parent → Current → Children
    - Parent KPI ditandai dengan icon ⬆️
    - Child KPI ditandai dengan icon ⬇️
    - Cascading Method badge: 🔗 Direct (solid), 🔀 Indirect (dashed)
    - Achievement mini-bar di samping setiap item
    - Child Behind highlighted dengan 🔴 dan garis merah
- **Business Rules:**
    - Direct Cascade: Realisasi child di-SUM ke parent (BR-005)
    - Indirect Cascade: Realisasi child independen (BR-006)
    - Behind status visible pada Fase Monitoring
- **Edge Cases:**
    - Jika tidak ada Parent, tampilkan "Top Level KPI"
    - Jika tidak ada Child, tampilkan "Tidak ada cascading ke bawah"

**Cascading Display:**

| **Level** | **Icon** | **Info Displayed** |
| --- | --- | --- |
| Parent KPI | ⬆️ | Title, Owner Name, Achievement %, Method, Status |
| Current KPI | 📍 | Title (highlighted) |
| Child KPI | ⬇️ | Title, Owner Name, Achievement %, Method, Status (🔴 if Behind) |

---

### US-PT-018: View KPI Detail Panel - Realization Progress

**User Story:**

**As a** Performance Admin / Executive

**I want to** melihat progress realisasi KPI pada panel detail

**So that** saya dapat memonitor pencapaian per periode dan trend achievement

**Acceptance Criteria:**

- **Given** saya membuka panel detail KPI (Fase Monitoring)
- **When** saya melihat section "Progress"
- **Then** saya melihat tabel realisasi per periode (Monthly/Quarterly)
- **And** setiap periode menampilkan: Target, Actual, Achievement %, Status
- **And** saya melihat trend chart achievement sepanjang tahun
- **And** saya melihat YTD (Year-to-Date) achievement summary

**Validation Rules:**

- **UI Rules:**
    - Section "Progress" sebagai accordion, default expanded pada Fase Monitoring
    - Tabel dengan kolom: Periode, Target, Actual, Achievement %, Status
    - Trend chart sebagai line/bar chart mini
    - YTD summary di header section
    - Color coding per row sesuai achievement threshold
    - Behind periods highlighted dengan background merah
- **Business Rules:**
    - Achievement % = (Actual/Target) × 100 untuk Maximize
    - Achievement % = (Target/Actual) × 100 untuk Minimize
    - YTD = average atau cumulative tergantung KPI nature
- **Data Rules:**
    - Tampilkan semua periode dalam tahun berjalan
    - Periode yang belum berjalan ditampilkan dengan "-"

**Progress Table Structure:**

| **Periode** | **Target** | **Actual** | **Achievement** | **Status** |
| --- | --- | --- | --- | --- |
| Jan 2026 | 100 | 95 | 95% | 🔴 Behind |
| Feb 2026 | 100 | 110 | 110% | 🟢 On Track |
| Mar 2026 | 100 | - | - | ⚪ Pending |

---

### US-PT-019: View KPI Detail Panel - Evidence & Attachments

**User Story:**

**As a** Performance Admin / Executive

**I want to** melihat daftar evidence yang di-upload untuk setiap realisasi

**So that** saya dapat mengakses dokumen pendukung dan memastikan kelengkapan evidence

**Acceptance Criteria:**

- **Given** saya membuka panel detail KPI
- **When** saya melihat section "Evidence"
- **Then** saya melihat daftar evidence grouped by periode realisasi
- **And** setiap evidence menampilkan: File Name, Type, Upload Date, Uploader
- **And** saya dapat preview (image) atau download (file) evidence

**Validation Rules:**

- **UI Rules:**
    - Section "Evidence" sebagai accordion
    - Grid view dengan thumbnail untuk image, icon untuk file types
    - Filter by periode
    - Preview modal untuk image, PDF viewer inline
    - Download button untuk semua file types
- **Business Rules:**
    - Evidence wajib untuk setiap submit realisasi
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

### US-PT-020: View KPI Detail Panel - Approval History

**User Story:**

**As a** Performance Admin / Executive

**I want to** melihat timeline approval/rejection history pada panel detail

**So that** saya dapat melacak perjalanan KPI dari draft hingga approved

**Acceptance Criteria:**

- **Given** saya membuka panel detail KPI
- **When** saya melihat section "History"
- **Then** saya melihat timeline aktivitas KPI dari awal hingga saat ini
- **And** setiap entry menampilkan: Timestamp, Actor, Action, Notes (jika ada)
- **And** attribute changes (Δ) ditampilkan dalam history

**Validation Rules:**

- **UI Rules:**
    - Section "History" sebagai accordion
    - Timeline vertical dengan icon per action type
    - Color coding: 🟢 Approve, 🔴 Reject, 🟡 Submit, ⚪ Draft, 🔵 Edit
    - Expandable untuk melihat detail notes dan diff
    - Avatar actor di samping setiap entry
- **Business Rules:**
    - Semua status change di-log untuk audit trail (BR-014)
    - Attribute changes di-log dengan before/after values
- **Data Rules:**
    - Timestamp dalam format "DD MMM YYYY, HH:mm"
    - Actor = nama pekerja yang melakukan action

**History Timeline Actions:**

| **Action** | **Icon** | **Color** | **Has Notes** |
| --- | --- | --- | --- |
| Created (Draft) | ➕ | ⚪ Gray | Optional |
| Allocated | ✓ | 🟢 Green | Optional |
| Attribute Changed | Δ | 🔵 Blue | Shows diff |
| Submitted | 📤 | 🟡 Yellow | Optional |
| Approved | ✅ | 🟢 Green | Optional |
| Rejected | ❌ | 🔴 Red | Mandatory |

---

## 1.4 UI Components

### Screen: Tree Browser

| Section | Komponen | Behavior |
| --- | --- | --- |
| Header | Phase Toggle + Period Selector | Switch Perencanaan/Monitoring, select period |
| Sidebar | Navigation Mode Selector + Search | Radio buttons (Org/Function/Cohort), quick search |
| Tree Panel | Expandable Tree with metrics | Click to expand/collapse, hover for tooltip, allocation badges |
| Detail Panel | Selected Node Detail (tabs) | Context-sensitive content per phase |
| Actions | Add KPI, Export, Analyze buttons | Toolbar at top (Admin only for edit actions) |

### Screen: Position Detail

| Section | Komponen | Behavior |
| --- | --- | --- |
| Header | Position Info + Allocation Summary | Name, Code, [✓ X Allocated | ○ Y Unallocated] |
| Incumbent | Incumbent List | Static display with photo and role |
| Tabs | Impact / Output / KAI | Tab switching with count badges (Allocated/Unallocated) |
| KPI List | Table with inline actions | Sort, filter, expand for details, allocation status badge |
| Add Button | Floating Action Button with dropdown | From Dictionary / Custom / Cascade (Admin, Planning phase only) |

### Screen: Top-Down Monitor

| Section | Komponen | Behavior |
| --- | --- | --- |
| Header | Phase indicator + Legend | Shows "Monitoring Phase" + visual coding legend |
| Breadcrumb | Current drill-down path | Clickable navigation |
| Summary Cards | Aggregate metrics (Avg, Min, Max) | Color-coded values |
| Child List | Child nodes with metrics | Expandable rows, click to drill, red line for Behind |
| Chart | Distribution visualization | Interactive histogram |

### Screen: Cascade Tracker

| Section | Komponen | Behavior |
| --- | --- | --- |
| Parent Info | Parent KPI card | Click to navigate |
| Cascade Type | Direct / Indirect badge + visual | Solid line for Direct, Dashed for Indirect |
| Children List | Child KPIs with contribution % | Expandable details, red highlight for Behind |
| Visualization | Tree diagram | Interactive nodes with red lines for Behind connections |

---

## 1.5 Business Rules

| Rule ID | Rule | Enforcement |
| --- | --- | --- |
| BR-PT-001 | KPI Impact tidak dapat di-add manual (dari P-KPI) | Hide add button for Impact tab |
| BR-PT-002 | Direct Cascade wajib unit sama dengan parent | Validation on save, block if mismatch |
| BR-PT-003 | Admin dapat bypass approval untuk custom KPI | Flag `bypassed_approval = true`, audit logged |
| BR-PT-004 | Executive hanya view, tidak dapat edit | Hide edit actions based on role |
| BR-PT-005 | Perubahan struktur hanya dalam Fase Perencanaan | Block edit di luar periode aktif |
| BR-PT-006 | Direct Cascade: realisasi child di-SUM ke parent | Auto-trigger saat child approved |
| BR-PT-007 | Shared Owner tidak dapat input realisasi | Hide input button, auto-copy from Owner |
| BR-PT-008 | Total bobot per KPI type harus = 100% | Validation warning (not blocking) |
| BR-PT-009 | Allocated item wajib memiliki Owner | Block allocation without owner assignment |
| BR-PT-010 | Attribute changes di-log dengan before/after values | Auto-log pada setiap perubahan atribut |
| BR-PT-011 | Behind status trigger red line visualization | Achievement < 100% = Behind, tampilkan garis merah |
| BR-PT-012 | Direct Cascade ditampilkan dengan garis solid | Visual differentiation dari Indirect (dashed) |
| BR-PT-013 | Org node menampilkan allocation summary | Aggregate Allocated/Unallocated dari child nodes |
| BR-PT-014 | Planning/Monitoring status dihitung dari child nodes | Real-time aggregation |
| BR-PT-015 | Historical data dapat diakses via period selector | Dropdown dengan list periode, data dari snapshot table |
| BR-PT-016 | Period selector tersedia di Struktur Organisasi dan Struktur KPI | Global selector di header |
| BR-PT-017 | Self-Cascaded KPI ditampilkan dengan badge ⚡ | Visual differentiation dari Via Tree KPI |
| BR-PT-018 | Self-Cascaded count agregat di panel detail posisi | Summary: Total | Via Tree | Self-Cascaded |
| BR-PT-019 | Historical periods read-only (tidak dapat di-edit) | Disable edit actions untuk periode selain current |
| BR-PT-020 | Compare Mode untuk side-by-side 2 periode | Toggle di period selector, tampilkan delta metrics |

---

## 1.6 Mock Data

[Mock Data: Performance Tree & Top-Down Monitoring](https://www.notion.so/Mock-Data-Performance-Tree-Top-Down-Monitoring-16f2ea2ce24d4d56ad92c7c1babec780?pvs=21)