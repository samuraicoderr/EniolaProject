# UI/UX Alignment Plan

> **Legend:** `[x]` Done · `[ ]` Pending

---

## Phase 1: Backend — Expose is_staff / is_admin via /me ✅

**File:** `backend/src/users/serializers.py`

- [x] Add `is_staff` to `UserSerializer.Meta.fields` and `read_only_fields`.
- [x] Add `is_admin` alias (sources `is_staff`) for frontend convenience.
- No migration needed — `is_staff` is a built-in Django AbstractUser field.

---

## Phase 2: Dashboard Bottom Nav (HomeNav) ✅

**File:** `frontend/components/app/home/HomeNav.tsx`

Now has 7 buttons (8th conditional):

| Button   | Route           | Emoji | Colour       |
|----------|-----------------|-------|-------------|
| Videos   | `/videos`       | 🎬    | Gold        |
| Ranks    | `/leaderboard`  | 🏆    | Blue        |
| Progress | `/progress`     | 📊    | Green       |
| Coach    | `/coach`        | 🤖    | Purple      |
| Portal   | `/portal`       | 🏫    | Red/Orange  |
| Admin    | `/admin/dashboard` | ⚙️ | Grey (conditional) |
| Logout   | calls `onLogout`| 🚪    | Red (destructive) |

- [x] Accepts `isAdmin` and `onLogout` props.
- [x] Admin button renders only when `isAdmin` is true.
- [x] All buttons use matching pill-style with coloured shadows and framer-motion animations.

**File:** `frontend/app/page.tsx`

- [x] Passes `isAdmin={auth.user.is_staff ?? false}` and `onLogout={() => auth.logout()}` to `<HomeNav>`.
- [x] Removed the standalone admin gear button (now part of HomeNav).
- [x] Cleaned unused `Link` import.

---

## Phase 3: Align Dashboard Sub-Pages to References

### 3a. Videos Page `[ ]`
- **Reference:** `references/videos.html`
- **Current:** `frontend/app/videos/page.tsx`
- [ ] Match layout, card styles, colours, typography to reference.
- [ ] Reuse shared components where possible.

### 3b. Leaderboard / Ranks Page `[ ]`
- **Reference:** `references/ranking.html`
- **Current:** `frontend/app/leaderboard/page.tsx`
- [ ] Match layout, card styles, colours, typography to reference.

### 3c. Progress Page `[ ]`
- **Reference:** `references/progress.html`
- **Current:** `frontend/app/progress/page.tsx`
- [ ] Match layout, card styles, colours, typography to reference.

### 3d. Coach Page `[x]`
- **Reference:** None provided — design consistent with reference style.
- **Current:** `frontend/app/coach/page.tsx` (functional chat interface exists).
- [x] Align header, chat bubbles, bottom nav, colours to reference palette.
- [x] Replace bottom nav with the shared `PageShell` bottom nav.
- [x] Wrap mascot and chat panels in `PageCard` with purple theme.

### 3e. Portal Page `[ ]`
- **Reference:** None provided.
- **Current:** Does not exist — needs creation.
- [ ] Create `frontend/app/portal/page.tsx`.
- [ ] If no backend endpoint exists yet, build a placeholder UI with the reference aesthetic.

### 3f. Admin Dashboard Page `[x]`
- **Reference:** None provided.
- **Current:** `frontend/app/admin/dashboard/page.tsx`
- [x] Align visual style to reference palette (greens, golds, blues, warm cream).
- [x] Use `PageShell` for header/background and `PageCard` for settings and analytics cards.
- [x] Use `is_admin` alias for admin gating (fallback to `is_staff`).

---

## Phase 4: Polish & Consistency `[ ]`

- [ ] **Font:** All pages use `var(--font-fredoka)` consistently.
- [ ] **Palette:** Core colours applied everywhere:
  - Background: `#F2E1C0` (warm cream)
  - Gold: `#D4A017` / shadow `#A06808`
  - Blue: `#1B3A8C` / shadow `#0D1E56`
  - Green: `#2A7A3B` / shadow `#1A5C28`
  - Red/Orange: `#B5451B` / shadow `#8B3010`
  - Purple: `#8B2E8B` / shadow `#5A1A5A`
  - Logout Red: `#C0392B` / shadow `#8B1A1A`
  - Admin Grey: `#4A4A4A` / shadow `#2A2A2A`
- [ ] **Shadows:** Coloured bottom shadows (e.g. `#A06808 0px 6px 0px`) not generic box-shadows.
- [ ] **Animations:** framer-motion spring (`stiffness: 200, damping: 15`) for entrance, scale transforms for hover/tap.
- [ ] **Responsiveness:** `clamp()` for font sizes and padding throughout.
- [ ] **Loading states:** "Loading Vocab Adventure..." style skeleton on all pages.

---

## Execution Order

1. ✅ Backend `is_staff` serializer
2. ✅ HomeNav expansion + home page wiring
3. [ ] Portal page creation (needed for HomeNav link to work)
4. [ ] Videos page — align to reference
5. [ ] Leaderboard page — align to reference
6. [ ] Progress page — align to reference
7. [ ] Coach page — polish UI
8. [ ] Admin dashboard — polish UI
9. [ ] Final consistency sweep across all pages
