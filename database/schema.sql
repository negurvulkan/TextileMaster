-- 1. Projekte
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    deleted_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Motivgruppen
CREATE TABLE motifs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    deleted_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 3. Produkte
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    motif_id INT NOT NULL,
    product_type VARCHAR(100) NOT NULL,
    color VARCHAR(100),
    gender ENUM('male', 'female', 'unisex') DEFAULT 'unisex',
    article_number VARCHAR(100),
    deleted_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (motif_id) REFERENCES motifs(id) ON DELETE CASCADE,
    CONSTRAINT unique_article_number UNIQUE (article_number)
);

-- 4. Größen pro Produkt
CREATE TABLE product_sizes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    size_label VARCHAR(10) NOT NULL,
    target_quantity INT DEFAULT 0,
    actual_quantity INT DEFAULT 0,
    deleted_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE (product_id, size_label)
);

-- 5. Globale Arbeitsschritte
CREATE TABLE steps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    created_by INT,
    updated_by INT,
    deleted_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT unique_step_name UNIQUE (name)
);

-- 6. Projektspezifische Schritte
CREATE TABLE project_steps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    step_id INT NOT NULL,
    project_id INT,
    motif_id INT,
    custom_sort_order INT DEFAULT 0,
    deleted_at DATETIME DEFAULT NULL,
    FOREIGN KEY (step_id) REFERENCES steps(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (motif_id) REFERENCES motifs(id) ON DELETE CASCADE
);

-- Trigger: project_steps muss project_id oder motif_id enthalten
DELIMITER //

CREATE TRIGGER trg_project_steps_validate BEFORE INSERT ON project_steps
FOR EACH ROW
BEGIN
    IF NEW.project_id IS NULL AND NEW.motif_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Entweder project_id oder motif_id muss gesetzt sein.';
    END IF;
END;
//

DELIMITER ;

-- 7. Nutzer
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('admin', 'worker') NOT NULL DEFAULT 'worker',
    password_hash VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    deleted_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Trigger: username darf nicht leer sein
DELIMITER //

CREATE TRIGGER trg_users_username_not_empty BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    IF TRIM(NEW.username) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Username darf nicht leer sein.';
    END IF;
END;
//

DELIMITER ;

-- 8. Maschinen
CREATE TABLE machines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    machine_type VARCHAR(100),
    location VARCHAR(100),
    notes TEXT,
    last_used_at DATETIME,
    updated_by INT,
    deleted_at DATETIME DEFAULT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 9. Maschinen ↔ Schritte
CREATE TABLE step_machines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    step_id INT NOT NULL,
    machine_id INT NOT NULL,
    deleted_at DATETIME DEFAULT NULL,
    UNIQUE (step_id, machine_id),
    FOREIGN KEY (step_id) REFERENCES steps(id) ON DELETE CASCADE,
    FOREIGN KEY (machine_id) REFERENCES machines(id) ON DELETE CASCADE
);

-- 10. Fortschrittsbuchungen
CREATE TABLE progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    motif_id INT NOT NULL,
    product_id INT NOT NULL,
    product_size_id INT NOT NULL,
    step_id INT NOT NULL,
    machine_id INT,
    quantity INT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (motif_id) REFERENCES motifs(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (product_size_id) REFERENCES product_sizes(id),
    FOREIGN KEY (step_id) REFERENCES steps(id),
    FOREIGN KEY (machine_id) REFERENCES machines(id)
);

-- Index zur Leistungsabfrage nach Zeit
CREATE INDEX idx_progress_timestamp ON progress(timestamp);

-- Trigger: quantity darf nicht negativ sein
DELIMITER //

CREATE TRIGGER trg_progress_quantity_nonnegative BEFORE INSERT ON progress
FOR EACH ROW
BEGIN
    IF NEW.quantity < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Quantity darf nicht negativ sein.';
    END IF;
END;
//

DELIMITER ;

-- 11. Einstellungen
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value VARCHAR(255),
    deleted_at DATETIME DEFAULT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 12. Zielvorgaben für Benutzer
CREATE TABLE user_targets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    target_quantity INT NOT NULL,
    target_period ENUM('daily', 'weekly') DEFAULT 'daily',
    valid_from DATE NOT NULL,
    valid_to DATE,
    deleted_at DATETIME DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
