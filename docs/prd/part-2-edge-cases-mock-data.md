# Mock Data: Edge Cases - Shared vs Duplicate KPI

## Konteks Skenario

**Departemen:** Customer Service - Terminal Nilam

**Posisi:** Customer Service Officer (3 incumbent)

**KPI yang di-assign:** Customer Complaint Resolution Rate

---

## Opsi 1: Shared Owner

### Struktur Assignment

| Pekerja | NIPP | Role | Dapat Input Realisasi |
| --- | --- | --- | --- |
| Dewi Anggraini | 12345679 | **Owner** | ✅ Ya |
| Ani Wijaya | 12345680 | Shared Owner | ❌ Tidak |
| Budi Prasetyo | 12345681 | Shared Owner | ❌ Tidak |

### Data KPI

| Atribut | Value |
| --- | --- |
| **KPI ID** | OUT-CS-SHARED-001 |
| **Title** | Customer Complaint Resolution Rate |
| **Target** | ≥ 95% |
| **Unit** | % |
| **Polarity** | Maximize |
| **Ownership Type** | Shared |

### Realisasi Januari 2026

| Atribut | Value |
| --- | --- |
| **Input By** | Dewi Anggraini (Owner) |
| **Realisasi** | 96% |
| **Evidence** | shared_complaint_jan.pdf |
| **Achievement** | 101.1% |

### Score Distribution

| Pekerja | Role | Achievement | Bobot di Tree | Kontribusi Score |
| --- | --- | --- | --- | --- |
| Dewi Anggraini | Owner | **101.1%** | 40% | 101.1% × 40% = 40.44% |
| Ani Wijaya | Shared Owner | **101.1%** | 35% | 101.1% × 35% = 35.39% |
| Budi Prasetyo | Shared Owner | **101.1%** | 30% | 101.1% × 30% = 30.33% |

**Catatan:** Achievement **identik** untuk semua, bobot dapat **berbeda**.

---

## Opsi 2: Duplicate KPI

### Struktur Assignment

| Pekerja | NIPP | Role | KPI ID | Dapat Input Realisasi |
| --- | --- | --- | --- | --- |
| Dewi Anggraini | 12345679 | Owner | OUT-CS-DUP-001 | ✅ Ya |
| Ani Wijaya | 12345680 | Owner | OUT-CS-DUP-002 | ✅ Ya |
| Budi Prasetyo | 12345681 | Owner | OUT-CS-DUP-003 | ✅ Ya |

### Data KPI per Pekerja

**Dewi Anggraini (OUT-CS-DUP-001):**

| Atribut | Value |
| --- | --- |
| **Title** | Customer Complaint Resolution - Shift Pagi |
| **Target** | ≥ 95% |
| **Unit** | % |
| **Bobot** | 40% |

**Ani Wijaya (OUT-CS-DUP-002):**

| Atribut | Value |
| --- | --- |
| **Title** | Customer Complaint Resolution - Shift Siang |
| **Target** | ≥ 95% |
| **Unit** | % |
| **Bobot** | 40% |

**Budi Prasetyo (OUT-CS-DUP-003):**

| Atribut | Value |
| --- | --- |
| **Title** | Customer Complaint Resolution - Shift Malam |
| **Target** | ≥ 92% |
| **Unit** | % |
| **Bobot** | 40% |

### Realisasi Januari 2026

| Pekerja | KPI ID | Target | Realisasi | Achievement | Evidence |
| --- | --- | --- | --- | --- | --- |
| Dewi Anggraini | OUT-CS-DUP-001 | 95% | 97% | 102.1% | dewi_jan.pdf |
| Ani Wijaya | OUT-CS-DUP-002 | 95% | 94% | 98.9% | ani_jan.pdf |
| Budi Prasetyo | OUT-CS-DUP-003 | 92% | 90% | 97.8% | budi_jan.pdf |

### Score Distribution

| Pekerja | Achievement | Bobot | Kontribusi Score |
| --- | --- | --- | --- |
| Dewi Anggraini | 102.1% | 40% | 102.1% × 40% = 40.84% |
| Ani Wijaya | 98.9% | 40% | 98.9% × 40% = 39.56% |
| Budi Prasetyo | 97.8% | 40% | 97.8% × 40% = 39.12% |

**Catatan:** Achievement **independen**, target dapat **berbeda**.

---

## Perbandingan Hasil

### Skenario: Januari 2026 Performance Score (KPI Output Only)

| Pekerja | Shared Owner | Duplicate KPI | Selisih |
| --- | --- | --- | --- |
| Dewi Anggraini | 40.44% | 40.84% | +0.40% |
| Ani Wijaya | 35.39% | 39.56% | +4.17% |
| Budi Prasetyo | 30.33% | 39.12% | +8.79% |

### Analisis

**Shared Owner lebih cocok ketika:**

- Output tidak dapat dipisahkan per individu
- Satu customer ticket ditangani bersama
- Metrics dihitung dari pool yang sama

**Duplicate KPI lebih cocok ketika:**

- Masing-masing memiliki shift/area berbeda
- Output dapat diukur independen
- Target berbeda sesuai kondisi (misal shift malam lebih rendah)

---

## Kombinasi: Mixed Approach

### Skenario: 2 KPI untuk posisi yang sama

**KPI 1 - Shared (tidak terpisahkan):**

| Item | Type | Owner | Shared Owners |
| --- | --- | --- | --- |
| Team NPS Score | Shared | Dewi | Ani, Budi |

**KPI 2 - Duplicate (terpisahkan per shift):**

| Item | Owner | Target |
| --- | --- | --- |
| Ticket Resolution - Shift Pagi | Dewi | ≥ 50/day |
| Ticket Resolution - Shift Siang | Ani | ≥ 50/day |
| Ticket Resolution - Shift Malam | Budi | ≥ 40/day |

### Performance Tree Summary

| Pekerja | KPI 1 (Shared) | KPI 2 (Individual) | Total KPI Output |
| --- | --- | --- | --- |
| Dewi | 15% (shared) | 25% (own) | 40% |
| Ani | 15% (shared) | 25% (own) | 40% |
| Budi | 15% (shared) | 25% (own) | 40% |

---

## UI Behavior Differences

### Shared Owner View

```
KPI: Customer Complaint Resolution Rate
Role: Shared Owner
Target: ≥ 95%
Current Achievement: 101.1% (synced from Owner)

[View Details] [View Evidence]
⚠️ Anda tidak dapat input realisasi. 
   Realisasi diinput oleh Owner (Dewi Anggraini).
```

### Owner View (Shared)

```
KPI: Customer Complaint Resolution Rate
Role: Owner
Target: ≥ 95%
Current Achievement: 101.1%

Shared With: Ani Wijaya, Budi Prasetyo

[Input Realisasi] [View Details] [Upload Evidence]
ℹ️ Realisasi Anda akan mempengaruhi score 2 Shared Owner lainnya.
```

### Owner View (Duplicate)

```
KPI: Customer Complaint Resolution - Shift Pagi
Role: Owner
Target: ≥ 95%
Current Achievement: 102.1%

[Input Realisasi] [View Details] [Upload Evidence]
```