# ArtKech Design Studio — File Management & Digital Asset Organization

## 1. Purpose

A design studio's files are its most valuable asset after its people. Lost files, version confusion, and disorganized folders cost hours of rework and damage client trust. This SOP defines how every file is named, stored, versioned, and archived at ArtKech — ensuring any team member can find any asset within 60 seconds.

## 2. Folder Structure

### 2.1 Master Structure (Google Drive / Dropbox)

```
ArtKech Studio/
├── 01_CLIENTS/
│   ├── [Client Name]/
│   │   ├── 00_ADMIN (contracts, briefs, invoices)
│   │   ├── 01_BRAND (guidelines, logos, brand assets)
│   │   ├── 02_PROJECTS/
│   │   │   ├── [YYYY-MM]_[Project Name]/
│   │   │   │   ├── 00_BRIEF (client brief, references, mood board)
│   │   │   │   ├── 01_WIP (work in progress, explorations)
│   │   │   │   ├── 02_REVIEW (files sent to client for review)
│   │   │   │   ├── 03_APPROVED (client-approved versions only)
│   │   │   │   └── 04_FINAL (production-ready files, all formats)
│   │   │   └── ...
│   │   └── 03_ASSETS (photography, stock, supplied materials)
│   └── ...
├── 02_INTERNAL/
│   ├── Brand (ArtKech's own brand assets)
│   ├── Marketing (portfolio, social media, website)
│   ├── Templates (proposal, invoice, brief, contract templates)
│   └── Admin (HR, finance, legal)
├── 03_RESOURCES/
│   ├── Fonts (licensed fonts library)
│   ├── Stock (purchased stock images/vectors)
│   ├── Mockups (presentation mockups)
│   ├── Textures (patterns, textures, backgrounds)
│   └── Icons (icon libraries)
└── 04_ARCHIVE/
    └── [Year]/ (completed projects moved here after 6 months)
```

### 2.2 Folder Naming Rules

| Rule | Example | Violation |
| :--- | :--- | :--- |
| Client folders: Full business name, title case | `Riad Dar Zellij` | `riad dar zellij`, `RDZ` |
| Project folders: Date prefix + descriptive name | `2026-05_Menu-Redesign` | `menu project`, `new menu` |
| No special characters except hyphens and underscores | `Brand-Identity_V2` | `Brand Identity (V2!)` |
| No spaces in folder names (use hyphens) | `Social-Media-Pack` | `Social Media Pack` |
| Numbers padded with leading zeros | `01_WIP`, `02_REVIEW` | `1_WIP`, `2_REVIEW` |

## 3. File Naming Convention

### 3.1 Standard Format

```
[ClientCode]_[ProjectCode]_[Descriptor]_[Version].[ext]

Examples:
RDZ_MENU26_Cover_V1.ai
RDZ_MENU26_Cover_V2.ai
RDZ_MENU26_Cover_V2-FINAL.pdf
RDZ_MENU26_Pages-Interior_V3.indd
AK_SOCIAL_IG-Post-Jun05_V1.psd
```

### 3.2 Client Codes (3-4 letters)

| Client | Code | Client | Code |
| :--- | :--- | :--- | :--- |
| Riad Dar Zellij | RDZ | Café Nomad | CAFN |
| Atlas Ventures | ATLV | Marrakech Biennale | MKBI |
| Souk & Soul | SKSL | La Maison Arabe | LMA |
| ArtKech (internal) | AK | Generic/Template | GEN |

### 3.3 Version Numbering

| Stage | Format | Example |
| :--- | :--- | :--- |
| Work in progress | V1, V2, V3... | `RDZ_LOGO_Concept-A_V1.ai` |
| Client review | V1-R1, V1-R2 (revision rounds) | `RDZ_LOGO_Concept-A_V1-R2.ai` |
| Approved | V[X]-APPROVED | `RDZ_LOGO_Concept-A_V3-APPROVED.ai` |
| Final production | V[X]-FINAL | `RDZ_LOGO_Concept-A_V3-FINAL.ai` |
| Print-ready | V[X]-PRINT | `RDZ_LOGO_Concept-A_V3-PRINT.pdf` |

### 3.4 Special Suffixes

| Suffix | Meaning | When Used |
| :--- | :--- | :--- |
| `-FINAL` | Production-ready, approved, no further changes | End of project |
| `-PRINT` | Print-ready with bleeds, crop marks, CMYK | Sending to printer |
| `-WEB` | Optimized for web (RGB, compressed) | Digital delivery |
| `-DRAFT` | Internal draft, not for client eyes | WIP folder only |
| `-MOCKUP` | Placed in presentation mockup | Review folder |
| `-CLIENT` | Simplified version for client (no layers, flat) | Client delivery |

## 4. File Delivery Standards

### 4.1 Logo Delivery Package

| File | Format | Color Space | Notes |
| :--- | :--- | :--- | :--- |
| Master file | .AI or .SVG | CMYK + RGB versions | Fully editable, all layers |
| Vector (print) | .EPS + .PDF | CMYK | Outlined text |
| Vector (digital) | .SVG | RGB | Optimized paths |
| Raster (high-res) | .PNG (transparent) | RGB | 3000px minimum width |
| Raster (standard) | .PNG (transparent) | RGB | 1000px width |
| Raster (small) | .PNG (transparent) | RGB | 500px width |
| Social media | .JPG + .PNG | RGB | Platform-specific sizes |
| Favicon | .ICO + .PNG | RGB | 16px, 32px, 180px |
| Monochrome versions | All formats above | Black, white, grayscale | For single-color applications |

### 4.2 Print File Delivery

| Element | Standard |
| :--- | :--- |
| Color space | CMYK (Coated FOGRA39 or printer-specified profile) |
| Resolution | 300 DPI minimum (600 DPI for text-heavy) |
| Bleed | 3mm on all sides (5mm for large format) |
| Crop marks | Included, 3mm offset |
| Fonts | Outlined (or packaged with fonts) |
| Images | Embedded (not linked) |
| Format | PDF/X-1a or PDF/X-4 (printer preference) |
| Overprint | Black text set to overprint |
| Rich black | C60 M40 Y40 K100 (for large black areas) |

### 4.3 Digital File Delivery

| Element | Standard |
| :--- | :--- |
| Color space | sRGB |
| Resolution | 72 DPI (screen) or as specified |
| Format | PNG (transparency), JPG (photos), SVG (icons/logos) |
| Compression | JPG quality 80-90%, PNG optimized |
| Max file size | < 500KB for web images, < 2MB for hero images |
| Naming | Descriptive, lowercase, hyphens: `hero-banner-desktop.jpg` |

## 5. Version Control

### 5.1 Rules

| Rule | Standard |
| :--- | :--- |
| Never overwrite a previous version | Always save as new version number |
| WIP files stay in 01_WIP | Only move to 02_REVIEW when ready for client |
| Only approved files go to 03_APPROVED | Marked with `-APPROVED` suffix |
| Final delivery files go to 04_FINAL | Complete package, all formats |
| Delete nothing | Old versions may be needed for reference or rollback |

### 5.2 Figma Version Control

| Action | Process |
| :--- | :--- |
| Major milestone | Create a named version: "V1 - Initial Concepts" |
| Before client review | Create a named version: "V2 - Sent for Review Jun 5" |
| After approval | Create a named version: "V3 - APPROVED Jun 7" |
| Branch for exploration | Create a branch, merge if approved |

## 6. Backup & Security

### 6.1 Backup Strategy (3-2-1 Rule)

| Layer | Location | Frequency | Retention |
| :--- | :--- | :--- | :--- |
| Primary | Google Drive / Dropbox (cloud) | Real-time sync | Indefinite |
| Secondary | External HDD (studio) | Weekly (Friday EOD) | 2 years |
| Tertiary | External HDD (off-site, Creative Director's home) | Monthly | 1 year |

### 6.2 Access Control

| Access Level | Who | Can Do |
| :--- | :--- | :--- |
| Full access | Creative Director, Studio Coordinator | Create, edit, delete, share, manage permissions |
| Editor | Senior Designers, Account Managers | Create, edit, share within assigned clients |
| Contributor | Junior Designers | Create, edit within assigned project folders only |
| Viewer | Freelancers (per-project) | View and download from assigned project folder only |
| Client access | Clients (via shared link) | View and download from 02_REVIEW and 04_FINAL only |

### 6.3 Security Rules

| Rule | Standard |
| :--- | :--- |
| Client files shared externally | Password-protected links with expiry (7 days) |
| Freelancer access | Revoked within 24 hours of project completion |
| Former employee access | Revoked on last day of employment |
| Sensitive files (contracts, financials) | Restricted to Creative Director + Studio Coordinator |
| Personal devices | No client files on personal devices without encryption |

## 7. Archiving

### 7.1 When to Archive

| Trigger | Action |
| :--- | :--- |
| Project completed + 6 months | Move to 04_ARCHIVE/[Year]/ |
| Client relationship ended + 12 months | Archive entire client folder |
| Annual cleanup (January) | Review all projects older than 12 months |

### 7.2 Archive Process

1. Verify all final files are in 04_FINAL folder
2. Remove obvious duplicates and unnecessary WIP explorations
3. Keep: final files, approved versions, brief, key references
4. Compress project folder (ZIP)
5. Move to 04_ARCHIVE/[Year]/[Client]/
6. Update archive index spreadsheet
7. Verify backup includes archived files

### 7.3 Retrieval from Archive

- Any team member can request archived files
- Studio Coordinator retrieves within 4 hours (business hours)
- If file is needed for ongoing work: copy back to active folder (don't move)
- Log retrieval in archive index (helps identify frequently-needed assets)

## 8. Performance Metrics

| KPI | Target | Measurement |
| :--- | :--- | :--- |
| File findability (time to locate any asset) | < 60 seconds | Spot checks |
| Naming convention compliance | > 95% | Monthly audit (random 20 files) |
| Backup completion rate | 100% weekly | Backup log |
| Storage usage (total) | < 80% of plan capacity | Monthly check |
| Client file delivery errors | 0 per quarter | Incident tracking |
| Archive completion (projects > 6 months) | 100% | January audit |

---

*Document Owner: Studio Operations | Last Review: May 2026 | Next Review: August 2026*
