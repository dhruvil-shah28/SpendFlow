-- =============================================================================
-- SpendFlow — Demo / seed data (run AFTER spendflow_schema.sql)
-- Clears existing rows then inserts deterministic sample data for local dev & UI.
-- =============================================================================

USE spendflow;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
-- Workbench "Safe Updates" blocks DELETE without WHERE; disable for this session only
SET SQL_SAFE_UPDATES = 0;

DELETE FROM expense_approval_logs;
DELETE FROM expense_attachments;
DELETE FROM approval_rules;
DELETE FROM expenses;
DELETE FROM expense_categories;
DELETE FROM users;
DELETE FROM companies;

SET SQL_SAFE_UPDATES = 1;
SET FOREIGN_KEY_CHECKS = 1;

ALTER TABLE companies AUTO_INCREMENT = 2;
ALTER TABLE users AUTO_INCREMENT = 5;
ALTER TABLE expense_categories AUTO_INCREMENT = 4;
ALTER TABLE expenses AUTO_INCREMENT = 7;
ALTER TABLE expense_attachments AUTO_INCREMENT = 3;
ALTER TABLE approval_rules AUTO_INCREMENT = 4;
ALTER TABLE expense_approval_logs AUTO_INCREMENT = 6;

-- -----------------------------------------------------------------------------
-- Companies (1 row — all columns)
-- -----------------------------------------------------------------------------
INSERT INTO companies (
    company_id,
    public_id,
    name,
    country_code,
    default_currency,
    timezone,
    created_at,
    updated_at
) VALUES (
    1,
    'a0000001-0000-4000-8000-000000000001',
    'Acme Demo Corporation',
    'US',
    'USD',
    'America/New_York',
    '2026-01-15 09:00:00',
    '2026-03-01 14:30:00'
);

-- -----------------------------------------------------------------------------
-- Users (4 rows — hierarchy + one inactive soft-deleted former employee)
-- password_hash: dummy bcrypt-shaped string (do not use in production)
-- -----------------------------------------------------------------------------
INSERT INTO users (
    user_id,
    public_id,
    company_id,
    manager_id,
    name,
    email,
    password_hash,
    role,
    is_active,
    deleted_at,
    created_at,
    updated_at
) VALUES
(
    1,
    'b0000001-0000-4000-8000-000000000001',
    1,
    NULL,
    'Alice Admin',
    'alice.admin@acme.demo',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Admin',
    1,
    NULL,
    '2026-01-15 09:05:00',
    '2026-03-01 10:00:00'
),
(
    2,
    'b0000002-0000-4000-8000-000000000002',
    1,
    1,
    'Bob Manager',
    'bob.manager@acme.demo',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Manager',
    1,
    NULL,
    '2026-01-15 09:10:00',
    '2026-03-01 10:00:00'
),
(
    3,
    'b0000003-0000-4000-8000-000000000003',
    1,
    2,
    'Carol Employee',
    'carol.employee@acme.demo',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Employee',
    1,
    NULL,
    '2026-01-20 11:00:00',
    '2026-03-01 10:00:00'
),
(
    4,
    'b0000004-0000-4000-8000-000000000004',
    1,
    2,
    'Dan Former',
    'dan.former@acme.demo',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Employee',
    0,
    '2026-02-01 12:00:00',
    '2026-01-22 09:00:00',
    '2026-02-01 12:00:00'
);

-- -----------------------------------------------------------------------------
-- Expense categories (3 rows)
-- -----------------------------------------------------------------------------
INSERT INTO expense_categories (
    category_id,
    company_id,
    name,
    description,
    sort_order,
    is_active,
    created_at,
    updated_at
) VALUES
(
    1,
    1,
    'Travel',
    'Flights, hotels, ground transport',
    10,
    1,
    '2026-01-15 09:15:00',
    '2026-01-15 09:15:00'
),
(
    2,
    1,
    'Meals & Entertainment',
    'Client meals and team events',
    20,
    1,
    '2026-01-15 09:15:00',
    '2026-01-15 09:15:00'
),
(
    3,
    1,
    'Software & Subscriptions',
    'SaaS licenses and tools',
    30,
    1,
    '2026-01-15 09:15:00',
    '2026-01-15 09:15:00'
);

-- -----------------------------------------------------------------------------
-- Expenses (6 rows — Draft, Pending, Approved, Rejected, Pending 2-step, Draft+deleted)
-- CHECK: Draft/Pending => resolved_at NULL; Approved/Rejected => resolved_at NOT NULL
-- -----------------------------------------------------------------------------
INSERT INTO expenses (
    expense_id,
    public_id,
    company_id,
    user_id,
    category_id,
    incurred_on,
    description,
    original_amount,
    original_currency,
    exchange_rate_to_base,
    converted_amount,
    merchant_name,
    receipt_image_url,
    expense_type,
    status,
    current_approval_step,
    submitted_at,
    resolved_at,
    deleted_at,
    created_at,
    updated_at
) VALUES
(
    1,
    'c0000001-0000-4000-8000-000000000001',
    1,
    3,
    1,
    '2026-03-10',
    'Draft: client visit flight — not yet submitted',
    450.0000,
    'USD',
    1.0000000000,
    450.0000,
    'Delta Air Lines',
    'https://cdn.demo.spendflow.example/receipts/exp-001-thumb.png',
    'Receipt_line',
    'Draft',
    1,
    NULL,
    NULL,
    NULL,
    '2026-03-10 16:00:00',
    '2026-03-10 16:00:00'
),
(
    2,
    'c0000002-0000-4000-8000-000000000002',
    1,
    3,
    2,
    '2026-03-08',
    'Pending: team dinner with client',
    186.4300,
    'USD',
    1.0000000000,
    186.4300,
    'Bistro Central',
    'https://cdn.demo.spendflow.example/receipts/exp-002.pdf',
    'Receipt_line',
    'Pending',
    1,
    '2026-03-11 09:00:00',
    NULL,
    NULL,
    '2026-03-11 09:00:00',
    '2026-03-11 09:00:00'
),
(
    3,
    'c0000003-0000-4000-8000-000000000003',
    1,
    3,
    3,
    '2026-02-20',
    'Approved: annual Figma subscription',
    180.0000,
    'EUR',
    1.0800000000,
    194.4000,
    'Figma Inc.',
    'https://cdn.demo.spendflow.example/receipts/exp-003.png',
    'Receipt_line',
    'Approved',
    1,
    '2026-02-21 10:00:00',
    '2026-02-25 15:00:00',
    NULL,
    '2026-02-21 10:00:00',
    '2026-02-25 15:00:00'
),
(
    4,
    'c0000004-0000-4000-8000-000000000004',
    1,
    3,
    1,
    '2026-02-01',
    'Rejected: mileage over policy cap',
    320.0000,
    'USD',
    1.0000000000,
    320.0000,
    NULL,
    NULL,
    'Mileage',
    'Rejected',
    1,
    '2026-02-02 08:00:00',
    '2026-02-05 11:00:00',
    NULL,
    '2026-02-02 08:00:00',
    '2026-02-05 11:00:00'
),
(
    5,
    'c0000005-0000-4000-8000-000000000005',
    1,
    3,
    1,
    '2026-03-01',
    'Pending: conference ticket — manager approved, CFO pending',
    1200.0000,
    'USD',
    1.0000000000,
    1200.0000,
    'TechConf Events LLC',
    'https://cdn.demo.spendflow.example/receipts/exp-005.jpg',
    'Receipt_line',
    'Pending',
    2,
    '2026-03-05 12:00:00',
    NULL,
    NULL,
    '2026-03-05 12:00:00',
    '2026-03-12 08:00:00'
),
(
    6,
    'c0000006-0000-4000-8000-000000000006',
    1,
    3,
    2,
    '2026-01-10',
    'Soft-deleted duplicate submission (demo)',
    42.0000,
    'USD',
    1.0000000000,
    42.0000,
    'Coffee Shop',
    'https://cdn.demo.spendflow.example/receipts/exp-006.png',
    'Receipt_line',
    'Draft',
    1,
    NULL,
    NULL,
    '2026-03-01 12:00:00',
    '2026-01-10 08:00:00',
    '2026-03-01 13:00:00'
);
-- -----------------------------------------------------------------------------
-- Expense attachments (2 rows — optional extra files)
-- -----------------------------------------------------------------------------
INSERT INTO expense_attachments (
    attachment_id,
    expense_id,
    file_url,
    file_name,
    mime_type,
    sort_order,
    created_at,
    updated_at
) VALUES
(
    1,
    1,
    'https://cdn.demo.spendflow.example/receipts/exp-001-full.pdf',
    'delta-itinerary.pdf',
    'application/pdf',
    0,
    '2026-03-10 16:05:00',
    '2026-03-10 16:05:00'
),
(
    2,
    3,
    'https://cdn.demo.spendflow.example/receipts/exp-003-invoice.xml',
    'invoice-metadata.xml',
    'application/xml',
    0,
    '2026-02-21 10:05:00',
    '2026-02-21 10:05:00'
);

-- -----------------------------------------------------------------------------
-- Approval rules (3 rows — one per rule_type; designated_user_id = Bob, company 1)
-- -----------------------------------------------------------------------------
INSERT INTO approval_rules (
    rule_id,
    company_id,
    rule_name,
    rule_type,
    rule_priority,
    is_active,
    threshold_amount,
    required_percentage,
    designated_approver_role,
    designated_user_id,
    created_at,
    updated_at
) VALUES
(
    1,
    1,
    'Large spend — percentage quorum',
    'Percentage',
    10,
    1,
    1000.0000,
    60.00,
    NULL,
    NULL,
    '2026-01-15 09:20:00',
    '2026-01-15 09:20:00'
),
(
    2,
    1,
    'Always route high-value to Bob (specific approver)',
    'Specific_Approver',
    20,
    1,
    NULL,
    NULL,
    NULL,
    2,
    '2026-01-15 09:20:00',
    '2026-01-15 09:20:00'
),
(
    3,
    1,
    'Hybrid — threshold + CFO role + fallback user',
    'Hybrid',
    30,
    1,
    500.0000,
    75.00,
    'CFO',
    2,
    '2026-01-15 09:20:00',
    '2026-01-15 09:20:00'
);

-- -----------------------------------------------------------------------------
-- Expense approval logs (queue + audit)
-- Expense 2: step 1 Pending (Bob)
-- Expense 3: step 1 Approved (Bob)
-- Expense 4: step 1 Rejected (Bob) + comments
-- Expense 5: step 1 Approved (Bob), step 2 Pending (Alice as stand-in CFO)
-- -----------------------------------------------------------------------------
INSERT INTO expense_approval_logs (
    log_id,
    expense_id,
    approver_id,
    step_sequence_number,
    status,
    comments,
    decided_at,
    created_at,
    updated_at
) VALUES
(
    1,
    2,
    2,
    1,
    'Pending',
    NULL,
    NULL,
    '2026-03-11 09:00:00',
    '2026-03-11 09:00:00'
),
(
    2,
    3,
    2,
    1,
    'Approved',
    'Looks good — within policy.',
    '2026-02-25 15:00:00',
    '2026-02-21 10:30:00',
    '2026-02-25 15:00:00'
),
(
    3,
    4,
    2,
    1,
    'Rejected',
    'Mileage exceeds per-diem policy for this route; please resubmit with split.',
    '2026-02-05 11:00:00',
    '2026-02-02 09:00:00',
    '2026-02-05 11:00:00'
),
(
    4,
    5,
    2,
    1,
    'Approved',
    'Within team budget — forwarding to CFO step.',
    '2026-03-10 17:00:00',
    '2026-03-05 12:05:00',
    '2026-03-10 17:00:00'
),
(
    5,
    5,
    1,
    2,
    'Pending',
    NULL,
    NULL,
    '2026-03-10 17:01:00',
    '2026-03-10 17:01:00'
);

-- =============================================================================
-- Demo summary (IDs are fixed for predictable API mocks)
-- Company 1 | Users 1=Admin, 2=Manager, 3=Employee, 4=Former (inactive + soft-deleted)
-- Expenses 1=Draft, 2=Pending (1 step), 3=Approved, 4=Rejected, 5=Pending (2 steps), 6=Draft+deleted
-- =============================================================================
