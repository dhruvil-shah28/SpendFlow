-- =============================================================================
-- SpendFlow — MySQL 8.0.13+ schema (InnoDB, utf8mb4)
-- Multi-tenant expenses, approval rules, sequential approval log.
-- Run as a user with CREATE privileges.
-- =============================================================================

CREATE DATABASE IF NOT EXISTS spendflow
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE spendflow;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Companies — tenant root; base currency at signup
-- -----------------------------------------------------------------------------
CREATE TABLE companies (
    company_id       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    public_id        CHAR(36) NOT NULL DEFAULT (UUID()) COMMENT 'Opaque id for APIs / URLs',
    name             VARCHAR(255) NOT NULL,
    country_code     CHAR(2) NOT NULL COMMENT 'ISO 3166-1 alpha-2',
    default_currency CHAR(3) NOT NULL COMMENT 'ISO 4217; base for converted_amount',
    timezone         VARCHAR(64) NOT NULL DEFAULT 'UTC' COMMENT 'IANA tz for calendars and cutoffs',
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_companies_public_id UNIQUE (public_id),
    CONSTRAINT chk_companies_default_currency CHECK (CHAR_LENGTH(default_currency) = 3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_companies_country ON companies (country_code);

-- -----------------------------------------------------------------------------
-- 2. Users — auth, role, hierarchy; soft-disable without losing history
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    user_id       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    public_id     CHAR(36) NOT NULL DEFAULT (UUID()) COMMENT 'Opaque id for APIs / URLs',
    company_id    BIGINT UNSIGNED NOT NULL,
    manager_id    BIGINT UNSIGNED NULL COMMENT 'Self-FK: direct manager',
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(320) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('Admin', 'Manager', 'Employee') NOT NULL DEFAULT 'Employee',
    is_active     TINYINT(1) NOT NULL DEFAULT 1 COMMENT '0 = login disabled; prefer over hard delete',
    deleted_at    TIMESTAMP NULL DEFAULT NULL COMMENT 'Soft delete; keeps FK and audit intact',
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_public_id UNIQUE (public_id),
    CONSTRAINT fk_users_company
        FOREIGN KEY (company_id) REFERENCES companies (company_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_users_manager
        FOREIGN KEY (manager_id) REFERENCES users (user_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT uq_users_company_email UNIQUE (company_id, email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_users_company ON users (company_id);
CREATE INDEX idx_users_manager ON users (manager_id);
CREATE INDEX idx_users_company_role ON users (company_id, role);
CREATE INDEX idx_users_active ON users (company_id, is_active, deleted_at);

-- -----------------------------------------------------------------------------
-- 3. Expense categories — per-company labels for consistent UI and reporting
-- -----------------------------------------------------------------------------
CREATE TABLE expense_categories (
    category_id  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id   BIGINT UNSIGNED NOT NULL,
    name         VARCHAR(128) NOT NULL,
    description  VARCHAR(500) NULL,
    sort_order   INT NOT NULL DEFAULT 0,
    is_active    TINYINT(1) NOT NULL DEFAULT 1,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_expense_categories_company
        FOREIGN KEY (company_id) REFERENCES companies (company_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uq_expense_categories_company_name UNIQUE (company_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_expense_categories_company ON expense_categories (company_id, is_active, sort_order);

-- -----------------------------------------------------------------------------
-- 4. Expenses — claims; company_id denormalized for tenant-scoped queries
-- -----------------------------------------------------------------------------
CREATE TABLE expenses (
    expense_id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    public_id                CHAR(36) NOT NULL DEFAULT (UUID()) COMMENT 'Opaque id for APIs / URLs',
    company_id               BIGINT UNSIGNED NOT NULL COMMENT 'Must equal submitter company_id (enforced by trigger)',
    user_id                  BIGINT UNSIGNED NOT NULL COMMENT 'Submitter (employee)',
    category_id              BIGINT UNSIGNED NOT NULL,
    incurred_on              DATE NOT NULL COMMENT 'Transaction / expense date (avoid reserved word date)',
    description              VARCHAR(2000) NOT NULL,
    original_amount          DECIMAL(19, 4) NOT NULL,
    original_currency        CHAR(3) NOT NULL,
    exchange_rate_to_base    DECIMAL(19, 10) NULL COMMENT 'Rate such that original_amount * rate = converted_amount (NULL if same currency or rate stored only in app)',
    converted_amount         DECIMAL(19, 4) NOT NULL COMMENT 'Amount in company default_currency',
    merchant_name            VARCHAR(255) NULL,
    receipt_image_url        VARCHAR(2048) NULL COMMENT 'Primary receipt; optional extra files in expense_attachments',
    expense_type             VARCHAR(64) NULL,
    status                   ENUM('Draft', 'Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Draft',
    current_approval_step    INT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Matches expense_approval_logs.step_sequence_number',
    submitted_at             TIMESTAMP NULL DEFAULT NULL COMMENT 'When moved from Draft to Pending',
    resolved_at              TIMESTAMP NULL DEFAULT NULL COMMENT 'When expense reached Approved or Rejected',
    deleted_at               TIMESTAMP NULL DEFAULT NULL COMMENT 'Soft delete for list views without dropping rows',
    created_at               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_expenses_public_id UNIQUE (public_id),
    CONSTRAINT fk_expenses_company
        FOREIGN KEY (company_id) REFERENCES companies (company_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_expenses_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_expenses_category
        FOREIGN KEY (category_id) REFERENCES expense_categories (category_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_expenses_amounts_non_negative CHECK (
        original_amount >= 0 AND converted_amount >= 0
    ),
    CONSTRAINT chk_expenses_currencies CHECK (CHAR_LENGTH(original_currency) = 3),
    CONSTRAINT chk_expenses_approval_step_positive CHECK (current_approval_step >= 1),
    CONSTRAINT chk_expenses_resolved_terminal CHECK (
        (status IN ('Draft', 'Pending') AND resolved_at IS NULL)
        OR (status IN ('Approved', 'Rejected') AND resolved_at IS NOT NULL)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_expenses_company_status_date ON expenses (company_id, status, incurred_on);
CREATE INDEX idx_expenses_user_incurred ON expenses (user_id, incurred_on);
CREATE INDEX idx_expenses_status_step ON expenses (status, current_approval_step);
CREATE INDEX idx_expenses_submitted ON expenses (company_id, submitted_at);

-- -----------------------------------------------------------------------------
-- 5. Expense attachments — extra receipts / documents (optional multi-file)
-- -----------------------------------------------------------------------------
CREATE TABLE expense_attachments (
    attachment_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    expense_id    BIGINT UNSIGNED NOT NULL,
    file_url      VARCHAR(2048) NOT NULL,
    file_name     VARCHAR(255) NULL,
    mime_type     VARCHAR(128) NULL,
    sort_order    INT NOT NULL DEFAULT 0,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_expense_attachments_expense
        FOREIGN KEY (expense_id) REFERENCES expenses (expense_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_expense_attachments_expense ON expense_attachments (expense_id, sort_order);

-- -----------------------------------------------------------------------------
-- 6. Approval rules — configurable routing and thresholds
-- -----------------------------------------------------------------------------
CREATE TABLE approval_rules (
    rule_id                   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id                BIGINT UNSIGNED NOT NULL,
    rule_name                 VARCHAR(255) NOT NULL,
    rule_type                 ENUM('Percentage', 'Specific_Approver', 'Hybrid') NOT NULL,
    rule_priority             INT NOT NULL DEFAULT 100 COMMENT 'Lower value = evaluated first',
    is_active                 TINYINT(1) NOT NULL DEFAULT 1,
    threshold_amount          DECIMAL(19, 4) NULL COMMENT 'Match when converted_amount > threshold',
    required_percentage       DECIMAL(5, 2) NULL COMMENT 'Percentage/Hybrid quorum, e.g. 60 = 60%',
    designated_approver_role  VARCHAR(64) NULL COMMENT 'e.g. CFO title routing',
    designated_user_id        BIGINT UNSIGNED NULL COMMENT 'Fixed approver user when applicable',
    created_at                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_approval_rules_company
        FOREIGN KEY (company_id) REFERENCES companies (company_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_approval_rules_designated_user
        FOREIGN KEY (designated_user_id) REFERENCES users (user_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_approval_rules_percentage_range CHECK (
        required_percentage IS NULL OR (required_percentage >= 0 AND required_percentage <= 100)
    ),
    CONSTRAINT chk_approval_rules_threshold_non_negative CHECK (
        threshold_amount IS NULL OR threshold_amount >= 0
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_approval_rules_company_active ON approval_rules (company_id, is_active, rule_priority);
CREATE INDEX idx_approval_rules_company_type ON approval_rules (company_id, rule_type);

-- -----------------------------------------------------------------------------
-- 7. Expense approval log — queue + audit per step
-- -----------------------------------------------------------------------------
CREATE TABLE expense_approval_logs (
    log_id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    expense_id             BIGINT UNSIGNED NOT NULL,
    approver_id            BIGINT UNSIGNED NOT NULL,
    step_sequence_number   INT UNSIGNED NOT NULL,
    status                 ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    comments               TEXT NULL,
    decided_at             TIMESTAMP NULL DEFAULT NULL COMMENT 'Set when status leaves Pending',
    created_at             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_expense_approval_logs_expense
        FOREIGN KEY (expense_id) REFERENCES expenses (expense_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_expense_approval_logs_approver
        FOREIGN KEY (approver_id) REFERENCES users (user_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uq_expense_approval_step UNIQUE (expense_id, step_sequence_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_expense_approval_logs_expense ON expense_approval_logs (expense_id);
CREATE INDEX idx_expense_approval_logs_approver_pending ON expense_approval_logs (approver_id, status);
CREATE INDEX idx_expense_approval_logs_pending ON expense_approval_logs (expense_id, status, step_sequence_number);

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- Integrity: expense.company_id = submitter.company_id; category belongs to company
-- -----------------------------------------------------------------------------
DELIMITER $$

CREATE TRIGGER trg_expenses_bi_company_align
BEFORE INSERT ON expenses
FOR EACH ROW
BEGIN
    DECLARE u_company BIGINT UNSIGNED;
    DECLARE c_company BIGINT UNSIGNED;
    SELECT company_id INTO u_company FROM users WHERE user_id = NEW.user_id;
    SELECT company_id INTO c_company FROM expense_categories WHERE category_id = NEW.category_id;
    IF u_company IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'expenses.user_id must reference an existing user';
    END IF;
    IF NEW.company_id <> u_company THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'expenses.company_id must match users.company_id for user_id';
    END IF;
    IF c_company IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'expenses.category_id must reference an existing category';
    END IF;
    IF NEW.company_id <> c_company THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'expense category must belong to the same company as the expense';
    END IF;
END$$

CREATE TRIGGER trg_expenses_bu_company_align
BEFORE UPDATE ON expenses
FOR EACH ROW
BEGIN
    DECLARE u_company BIGINT UNSIGNED;
    DECLARE c_company BIGINT UNSIGNED;
    SELECT company_id INTO u_company FROM users WHERE user_id = NEW.user_id;
    SELECT company_id INTO c_company FROM expense_categories WHERE category_id = NEW.category_id;
    IF NEW.company_id <> u_company THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'expenses.company_id must match users.company_id for user_id';
    END IF;
    IF NEW.company_id <> c_company THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'expense category must belong to the same company as the expense';
    END IF;
END$$

CREATE TRIGGER trg_approval_rules_bi_designated_user_company
BEFORE INSERT ON approval_rules
FOR EACH ROW
BEGIN
    DECLARE u_company BIGINT UNSIGNED;
    IF NEW.designated_user_id IS NOT NULL THEN
        SELECT company_id INTO u_company FROM users WHERE user_id = NEW.designated_user_id;
        IF u_company IS NULL OR u_company <> NEW.company_id THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'approval_rules.designated_user_id must belong to the same company_id';
        END IF;
    END IF;
END$$

CREATE TRIGGER trg_approval_rules_bu_designated_user_company
BEFORE UPDATE ON approval_rules
FOR EACH ROW
BEGIN
    DECLARE u_company BIGINT UNSIGNED;
    IF NEW.designated_user_id IS NOT NULL THEN
        SELECT company_id INTO u_company FROM users WHERE user_id = NEW.designated_user_id;
        IF u_company IS NULL OR u_company <> NEW.company_id THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'approval_rules.designated_user_id must belong to the same company_id';
        END IF;
    END IF;
END$$

DELIMITER ;

-- =============================================================================
-- Notes for backend / frontend
-- =============================================================================
-- • Expose public_id in REST/GraphQL; keep BIGINT PK internal.
-- • On submit: set status Pending, submitted_at = NOW(), build approval log rows.
-- • On final Approve/Reject: set expense.resolved_at; enforce rejection comments in app.
-- • approval_rules.designated_user_id same-company enforced by trigger trg_approval_rules_*.
-- • Seed expense_categories when creating a company so category_id is always valid.
--
-- Demo data (optional): after applying this file, run:
--   mysql -u USER -p < sql/spendflow_seed_demo.sql
-- =============================================================================
