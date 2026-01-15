-- =====================================================
-- INVENTORY, PRICE LISTS, VENDORS & WORKFLOW MANAGEMENT
-- =====================================================

-- ============ INVENTARIO Y PRODUCTOS ============

-- Categorías de productos
CREATE TABLE IF NOT EXISTS product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    parent_id UUID REFERENCES product_categories(id),
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Productos y Servicios
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    long_description TEXT,
    
    -- Clasificación
    category_id UUID REFERENCES product_categories(id),
    product_type VARCHAR(20) DEFAULT 'PRODUCT' CHECK (product_type IN ('PRODUCT', 'SERVICE', 'KIT')),
    
    -- Precios base
    cost DECIMAL(12,2) DEFAULT 0,
    price DECIMAL(12,2) NOT NULL,
    suggested_price DECIMAL(12,2),
    
    -- Impuestos
    tax_rate DECIMAL(5,2) DEFAULT 18.00,
    tax_exempt BOOLEAN DEFAULT FALSE,
    
    -- Unidades
    unit VARCHAR(20) DEFAULT 'UND',
    
    -- Stock (solo para productos, no servicios)
    track_inventory BOOLEAN DEFAULT TRUE,
    current_stock DECIMAL(12,3) DEFAULT 0,
    min_stock DECIMAL(12,3) DEFAULT 0,
    max_stock DECIMAL(12,3),
    reorder_point DECIMAL(12,3),
    
    -- Imágenes
    image_url TEXT,
    images JSONB, -- Array de URLs
    
    -- Estado
    active BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Full-text search
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('spanish', coalesce(sku, '') || ' ' || coalesce(name, '') || ' ' || coalesce(description, ''))
    ) STORED
);

-- Almacenes
CREATE TABLE IF NOT EXISTS warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    manager VARCHAR(200),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Stock por almacén
CREATE TABLE IF NOT EXISTS inventory_stock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    quantity DECIMAL(12,3) NOT NULL DEFAULT 0,
    reserved_quantity DECIMAL(12,3) DEFAULT 0,
    available_quantity DECIMAL(12,3) GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    last_count_date DATE,
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(product_id, warehouse_id)
);

-- Movimientos de inventario (Kardex)
CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('IN', 'OUT', 'ADJUSTMENT', 'TRANSFER')),
    quantity DECIMAL(12,3) NOT NULL,
    unit_cost DECIMAL(12,2),
    reference_type VARCHAR(50), -- 'PURCHASE', 'SALE', 'ADJUSTMENT', etc.
    reference_id UUID,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============ LISTAS DE PRECIOS ============

-- Listas de precios
CREATE TABLE IF NOT EXISTS price_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Vigencia
    valid_from DATE,
    valid_to DATE,
    
    -- Prioridad
    priority INTEGER DEFAULT 0,
    
    -- Estado
    active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Precios por lista
CREATE TABLE IF NOT EXISTS price_list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    price_list_id UUID NOT NULL REFERENCES price_lists(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    price DECIMAL(12,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    min_quantity DECIMAL(12,3) DEFAULT 1,
    UNIQUE(price_list_id, product_id, min_quantity)
);

-- Asignación de lista de precios a clientes
CREATE TABLE IF NOT EXISTS customer_price_lists (
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    price_list_id UUID NOT NULL REFERENCES price_lists(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (customer_id, price_list_id)
);

-- ============ DESCUENTOS Y PROMOCIONES ============

CREATE TABLE IF NOT EXISTS discounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Tipo de descuento
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('PERCENTAGE', 'FIXED_AMOUNT', 'VOLUME', 'COMBO')),
    
    -- Valor
    discount_value DECIMAL(12,2) NOT NULL,
    max_discount_amount DECIMAL(12,2),
    
    -- Aplicabilidad
    applies_to VARCHAR(20) DEFAULT 'ALL' CHECK (applies_to IN ('ALL', 'CATEGORY', 'PRODUCT', 'CUSTOMER')),
    target_ids JSONB, -- Array de IDs
    
    -- Condiciones
    min_purchase_amount DECIMAL(12,2),
    min_quantity DECIMAL(12,3),
    
    -- Vigencia
    valid_from TIMESTAMP,
    valid_to TIMESTAMP,
    
    -- Límites
    max_uses INTEGER,
    uses_count INTEGER DEFAULT 0,
    max_uses_per_customer INTEGER,
    
    -- Estado
    active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============ VENDEDORES Y COMISIONES ============

CREATE TABLE IF NOT EXISTS salespersons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200),
    phone VARCHAR(20),
    
    -- Comisión por defecto
    default_commission_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Metas
    monthly_goal DECIMAL(12,2),
    quarterly_goal DECIMAL(12,2),
    annual_goal DECIMAL(12,2),
    
    -- Estado
    active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Reglas de comisión
CREATE TABLE IF NOT EXISTS commission_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    
    -- Alcance
    applies_to VARCHAR(20) DEFAULT 'ALL' CHECK (applies_to IN ('ALL', 'CATEGORY', 'PRODUCT', 'CUSTOMER')),
    target_ids JSONB,
    
    -- Cálculo
    commission_type VARCHAR(20) DEFAULT 'PERCENTAGE' CHECK (commission_type IN ('PERCENTAGE', 'FIXED_AMOUNT')),
    commission_value DECIMAL(12,2) NOT NULL,
    
    -- Basado en
    based_on VARCHAR(20) DEFAULT 'SALE' CHECK (based_on IN ('SALE', 'PAYMENT', 'PROFIT')),
    
    -- Escalas
    tier_min_amount DECIMAL(12,2),
    tier_max_amount DECIMAL(12,2),
    
    priority INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Comisiones calculadas
CREATE TABLE IF NOT EXISTS salesperson_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salesperson_id UUID NOT NULL REFERENCES salespersons(id),
    
    -- Referencia
    reference_type VARCHAR(20) CHECK (reference_type IN ('QUOTE', 'INVOICE', 'PAYMENT')),
    reference_id UUID,
    
    -- Montos
    base_amount DECIMAL(12,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    commission_amount DECIMAL(12,2) NOT NULL,
    
    -- Pago
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'PAID')),
    paid_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============ WORKFLOW Y APROBACIONES ============

CREATE TABLE IF NOT EXISTS approval_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'QUOTE', 'DISCOUNT', 'CREDIT_NOTE', etc.
    
    -- Condición para activar
    condition JSONB, -- {"field": "total", "operator": ">", "value": 50000}
    
    -- Niveles de aprobación
    approval_levels JSONB, -- [{"level": 1, "role": "SUPERVISOR"}, {"level": 2, "role": "MANAGER"}]
    
    -- Comportamiento
    require_all_levels BOOLEAN DEFAULT TRUE,
    allow_self_approval BOOLEAN DEFAULT FALSE,
    
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES approval_workflows(id),
    
    -- Referencia
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    
    -- Solicitante
    requested_by UUID NOT NULL REFERENCES users(id),
    requested_at TIMESTAMP DEFAULT NOW(),
    
    -- Estado general
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
    
    -- Niveles completados
    current_level INTEGER DEFAULT 1,
    
    -- Comentarios
    notes TEXT,
    
    -- Aprobador final
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    rejected_by UUID REFERENCES users(id),
    rejected_at TIMESTAMP,
    rejection_reason TEXT
);

CREATE TABLE IF NOT EXISTS approval_request_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES approval_requests(id) ON DELETE CASCADE,
    level INTEGER NOT NULL,
    
    -- Aprobador
    approver_role VARCHAR(50),
    approver_user_id UUID REFERENCES users(id),
    
    -- Estado
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    
    -- Acción
    approved_at TIMESTAMP,
    comments TEXT,
    
    UNIQUE(request_id, level)
);

-- ============ PROVEEDORES (SUPPLIERS) ============

CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    rnc VARCHAR(20),
    
    -- Contacto
    contact_name VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(20),
    address TEXT,
    
    -- Términos
    payment_terms VARCHAR(50), -- 'NET_30', 'NET_60', etc.
    credit_limit DECIMAL(12,2),
    
    -- Categoría
    category VARCHAR(100),
    
    -- Estado
    active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Órdenes de compra
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    
    -- Montos
    subtotal DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL,
    
    -- Fechas
    order_date DATE DEFAULT CURRENT_DATE,
    expected_date DATE,
    received_date DATE,
    
    -- Estado
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'CONFIRMED', 'RECEIVED', 'CANCELLED')),
    
    -- Items
    items JSONB NOT NULL,
    
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============ ÍNDICES ============

CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_inventory_stock_product ON inventory_stock(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_product ON inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_price_list_items_list ON price_list_items(price_list_id);
CREATE INDEX IF NOT EXISTS idx_salesperson_commissions_person ON salesperson_commissions(salesperson_id);
CREATE INDEX IF NOT EXISTS idx_approval_requests_entity ON approval_requests(entity_type, entity_id);

-- ============ TRIGGERS ============

-- Trigger: Actualizar stock al crear movimiento
CREATE OR REPLACE FUNCTION update_stock_on_movement()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.movement_type IN ('IN', 'ADJUSTMENT') THEN
        UPDATE inventory_stock
        SET quantity = quantity + NEW.quantity,
            updated_at = NOW()
        WHERE product_id = NEW.product_id AND warehouse_id = NEW.warehouse_id;
    ELSIF NEW.movement_type = 'OUT' THEN
        UPDATE inventory_stock
        SET quantity = quantity - NEW.quantity,
            updated_at = NOW()
        WHERE product_id = NEW.product_id AND warehouse_id = NEW.warehouse_id;
    END IF;
    
    -- Actualizar stock total del producto
    UPDATE products
    SET current_stock = (
        SELECT COALESCE(SUM(quantity), 0)
        FROM inventory_stock
        WHERE product_id = NEW.product_id
    )
    WHERE id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stock
    AFTER INSERT ON inventory_movements
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_on_movement();

-- Trigger: Alertas de stock bajo
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.current_stock <= NEW.reorder_point AND OLD.current_stock > NEW.reorder_point THEN
        -- TODO: Enviar notificación/alerta
        RAISE NOTICE 'Low stock alert for product %: % units remaining', NEW.sku, NEW.current_stock;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_low_stock_alert
    AFTER UPDATE ON products
    FOR EACH ROW
    WHEN (OLD.current_stock IS DISTINCT FROM NEW.current_stock)
    EXECUTE FUNCTION check_low_stock();

-- ============ FUNCIONES UTILITARIAS ============

-- Generar código de producto automático
CREATE SEQUENCE IF NOT EXISTS product_sku_seq START 1000;

CREATE OR REPLACE FUNCTION generate_product_sku(prefix TEXT DEFAULT 'PROD')
RETURNS VARCHAR AS $$
BEGIN
    RETURN prefix || '-' || LPAD(nextval('product_sku_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Calcular precio con descuento
CREATE OR REPLACE FUNCTION calculate_discounted_price(
    p_product_id UUID,
    p_customer_id UUID,
    p_quantity DECIMAL,
    OUT final_price DECIMAL
)
AS $$
DECLARE
    base_price DECIMAL;
    list_price DECIMAL;
    discount_value DECIMAL := 0;
BEGIN
    -- Precio base del producto
    SELECT price INTO base_price FROM products WHERE id = p_product_id;
    
    -- Verificar lista de precios del cliente
    SELECT pli.price INTO list_price
    FROM price_list_items pli
    JOIN customer_price_lists cpl ON cpl.price_list_id = pli.price_list_id
    WHERE cpl.customer_id = p_customer_id
      AND pli.product_id = p_product_id
      AND pli.min_quantity <= p_quantity
    ORDER BY pli.min_quantity DESC
    LIMIT 1;
    
    -- Si hay precio de lista, usarlo
    IF list_price IS NOT NULL THEN
        base_price := list_price;
    END IF;
    
    -- Aplicar descuentos activos (simplificado)
    SELECT discount_value INTO discount_value
    FROM discounts
    WHERE active = TRUE
      AND (valid_from IS NULL OR valid_from <= NOW())
      AND (valid_to IS NULL OR valid_to >= NOW())
      AND (min_quantity IS NULL OR min_quantity <= p_quantity)
    ORDER BY priority DESC
    LIMIT 1;
    
    final_price := base_price - (base_price * discount_value / 100);
END;
$$ LANGUAGE plpgsql;

COMMENT ON SCHEMA public IS 'Enhanced schema with Inventory, Price Lists, Vendors, and Workflow Management';
