# PLAN: Master Surat Management

## Phase 1: Infrastructure & Data Actions
- [ ] Create `getMasterSurat` action to fetch all templates with classifications.
- [ ] Create `upsertMasterSurat` action for adding/updating templates.
- [ ] Create `deleteMasterSurat` action.
- [ ] Create `getKlasifikasi` action for the dropdown.

## Phase 2: Main Dashboard (List View)
- [ ] Create `src/app/admin/surat/master/page.tsx`.
- [ ] Implement a premium grid/table view of all letter templates.
- [ ] Add Search and Filter by Classification.
- [ ] Add "Tambah Template" button.

## Phase 3: Template Editor (Add/Edit)
- [ ] Create `src/app/admin/surat/master/edit/[id]/page.tsx`.
- [ ] Implement `MasterSuratForm` with:
    - Basic Info (Nama, Kode, Klasifikasi).
    - Format Nomor (Placeholder support like `[NOMOR]/[KODE]/[TAHUN]`).
    - **Dynamic Form Schema Builder**: UI to manage JSON schema for fields.
    - **Content Editor**: Markdown/Rich Text editor for the letter content.

## Phase 4: Verification & Polishing
- [ ] Test template rendering with dynamic data.
- [ ] Validate JSON schema integrity.
- [ ] Final UI/UX audit for consistency.

## Agent Assignments
- **Backend Specialist**: Server actions and Prisma integrations.
- **Frontend Specialist**: High-fidelity UI components and editors.
- **Project Planner**: Orchestration and verification.

## Verification Checklist
- [ ] Can add a new letter type.
- [ ] Can edit JSON schema and see it reflected in `SuratForm`.
- [ ] Can delete a template safely.
- [ ] Layout matches the SID Kediren design system.
