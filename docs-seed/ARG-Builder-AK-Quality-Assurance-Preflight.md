# ArtKech Design Studio — Quality Assurance & Pre-Flight Checklist

## 1. Purpose

Every file that leaves ArtKech represents our reputation. A single typo on a printed brochure, a wrong color on a logo, or a low-resolution image on a client's website damages trust that took months to build. This SOP defines the QA process that every deliverable must pass before reaching a client or a printer.

## 2. QA Levels

| Level | Applied To | Reviewed By | Duration |
| :--- | :--- | :--- | :--- |
| Self-check | All work before internal review | Designer who created it | 10-15 min |
| Peer review | All client-facing deliverables | Another designer (not the creator) | 15-30 min |
| Senior review | Brand identities, final print files, high-value projects | Creative Director or Senior Designer | 20-45 min |
| External proof | Print production files | Print vendor (proof approval) | 1-3 days |

## 3. Self-Check Checklist (Designer)

### 3.1 Before Requesting Internal Review

| Category | Check | ✓ |
| :--- | :--- | :--- |
| **Content** | All text proofread (no typos, correct spelling) | |
| | Phone numbers, emails, URLs verified | |
| | Client name spelled correctly everywhere | |
| | Dates and prices are current/correct | |
| | All placeholder text (Lorem ipsum) replaced | |
| **Typography** | Consistent font usage (no rogue fonts) | |
| | Proper hierarchy (H1 > H2 > body) | |
| | No widows or orphans in body text | |
| | Hyphenation checked (no awkward breaks) | |
| | Line spacing consistent throughout | |
| **Color** | Colors match brand guidelines exactly (check hex/CMYK values) | |
| | Sufficient contrast for readability | |
| | No unintended color shifts between elements | |
| **Layout** | Alignment consistent (use guides/grids) | |
| | Margins and padding consistent | |
| | No overlapping elements | |
| | Visual hierarchy clear (what do you see first?) | |
| **Technical** | Correct artboard/page size | |
| | Correct color mode (CMYK for print, RGB for digital) | |
| | Images at correct resolution (300 DPI print, 72 DPI web) | |
| | No missing links or fonts | |
| | File named correctly per naming convention | |

## 4. Peer Review Checklist

### 4.1 Fresh Eyes Review (15-30 minutes)

The peer reviewer has NOT worked on this project. They review with fresh eyes:

| Category | Check | Notes |
| :--- | :--- | :--- |
| **First impression** | Does it look professional and polished? | |
| | Is the brand recognizable and consistent? | |
| | Would you be proud to show this to a client? | |
| **Brief compliance** | Does it meet the stated objectives? | |
| | Are all required deliverables present? | |
| | Does it match the approved concept/direction? | |
| **Content accuracy** | Read ALL text out loud (catches errors silent reading misses) | |
| | Verify contact information against source | |
| | Check dates, prices, and factual claims | |
| **Consistency** | Same style applied throughout (multi-page docs) | |
| | Headers, footers, page numbers consistent | |
| | Color usage consistent across all pieces | |
| **Usability** | Is text readable at actual size? | |
| | Is the visual hierarchy clear? | |
| | Would the target audience understand this immediately? | |

### 4.2 Peer Review Feedback Format

Feedback is given in one of three categories:
- **Must fix** (blocks delivery): Errors, typos, wrong information, brand violations
- **Should fix** (improves quality): Alignment issues, spacing inconsistencies, minor improvements
- **Could fix** (nice to have): Subjective suggestions, alternative approaches (designer's discretion)

## 5. Print Pre-Flight Checklist

### 5.1 Before Sending to Printer

| Category | Check | Standard |
| :--- | :--- | :--- |
| **Document setup** | Page size matches print spec | Exact dimensions |
| | Bleed set correctly | 3mm (standard), 5mm (large format) |
| | Crop marks included | 3mm offset from trim |
| | Safety margin respected | No critical content within 5mm of trim |
| **Color** | Document in CMYK color mode | No RGB elements |
| | Black text is K100 only (not rich black) | Small text only |
| | Large black areas use rich black | C60 M40 Y40 K100 |
| | No RGB images embedded | Convert all to CMYK |
| | Total ink coverage < 300% | Check in Acrobat preflight |
| | Spot colors correctly defined (if used) | Pantone reference verified |
| **Images** | All images 300 DPI at print size | Check in preflight |
| | No upscaled images | Original resolution sufficient |
| | Images embedded (not linked) | Or package with links |
| | No transparency issues | Flatten if needed for older RIPs |
| **Typography** | All fonts embedded or outlined | No missing fonts |
| | Minimum text size respected | 6pt (body), 4pt (legal/fine print) |
| | White text on dark background: minimum 8pt | Avoid thin fonts on dark |
| | Overprint settings correct | Black text overprints |
| **File format** | PDF/X-1a or PDF/X-4 | Confirm with printer |
| | No password protection | Printer needs full access |
| | Correct PDF version | 1.4 minimum |
| **Final checks** | Print at actual size on office printer | Visual check for layout issues |
| | View at 400% zoom | Check for artifacts, low-res areas |
| | Run Adobe Preflight | Fix all errors, review warnings |

### 5.2 Common Print Errors to Catch

| Error | Consequence | Prevention |
| :--- | :--- | :--- |
| RGB images in CMYK document | Colors shift dramatically on press | Preflight check, convert before placing |
| Text too close to trim edge | Gets cut off during trimming | 5mm safety margin enforced |
| Thin white text on dark background | Disappears or becomes illegible | Minimum 8pt, medium-bold weight |
| Missing bleed | White edges visible on finished piece | Always extend backgrounds 3mm past trim |
| Low-resolution images | Pixelated/blurry in print | Check at 100% zoom before sending |
| Wrong Pantone reference | Color doesn't match brand | Verify against physical Pantone book |
| Overprint not set on black text | White knockout visible behind text | Set overprint on 100K text |

## 6. Digital Pre-Flight Checklist

### 6.1 Before Delivering Digital Files

| Category | Check | Standard |
| :--- | :--- | :--- |
| **Format** | Correct file format for use case | PNG (transparency), JPG (photos), SVG (vectors) |
| | Correct color profile | sRGB for web |
| | Correct dimensions | As specified in brief |
| **Optimization** | File size optimized | < 500KB web images, < 200KB social |
| | No unnecessary metadata | Strip EXIF if privacy concern |
| | Retina versions provided (if needed) | 2x dimensions |
| **Accessibility** | Alt text prepared | Descriptive, concise |
| | Sufficient color contrast | WCAG AA minimum (4.5:1 for text) |
| | Text readable without zooming | 16px minimum for body text |
| **Responsiveness** | Works at multiple sizes (if web) | Test at 320px, 768px, 1440px |
| | No text in images (unless decorative) | Prevents scaling issues |
| **Links/Interactive** | All links working | Test every URL |
| | Correct link destinations | No placeholder links |
| | Interactive elements functional | Buttons, forms, navigation |

## 7. Brand Compliance Check

### 7.1 Before Any Client Delivery

| Element | Check Against | Action if Non-Compliant |
| :--- | :--- | :--- |
| Logo usage | Client brand guidelines | Fix immediately |
| Color values | Brand color palette (exact hex/CMYK) | Correct to exact values |
| Typography | Specified brand fonts | Replace with correct fonts |
| Tone of voice | Brand voice guidelines | Rewrite copy |
| Photography style | Brand imagery guidelines | Replace images |
| Layout rules | Brand layout grid/spacing | Adjust layout |
| Co-branding | Partnership guidelines (if applicable) | Verify with client |

## 8. QA Sign-Off Process

### 8.1 Sign-Off Authority

| Deliverable Type | Sign-Off Required From | Before |
| :--- | :--- | :--- |
| Internal review (concept) | Creative Director | Presenting to client |
| Client review round | Senior Designer or Creative Director | Sending to client |
| Final delivery (digital) | Peer reviewer + Creative Director | Sending final files |
| Print production files | Creative Director + printer proof approval | Going to press |
| Website launch | Creative Director + Account Manager | Going live |

### 8.2 QA Documentation

Every project has a QA log noting:
- Date of each QA check
- Who performed the review
- Issues found and resolution
- Final sign-off with name and date

## 9. Performance Metrics

| KPI | Target | Measurement |
| :--- | :--- | :--- |
| Client-reported errors post-delivery | 0 per quarter | Client feedback tracking |
| Print errors requiring reprint | 0 per year | Incident log |
| QA completion rate (all deliverables checked) | 100% | Project tracking |
| Average QA turnaround time | < 4 hours | Time tracking |
| Peer review coverage | 100% of client deliverables | Process audit |
| Preflight pass rate (first attempt) | > 85% | Preflight reports |

---

*Document Owner: Quality Assurance | Last Review: May 2026 | Next Review: August 2026*
