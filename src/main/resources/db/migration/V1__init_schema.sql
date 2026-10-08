CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       first_name VARCHAR(100) NOT NULL,
                       last_name VARCHAR(100) NOT NULL,
                       role VARCHAR(50) NOT NULL, -- ROLE_USER, ROLE_BROKER, ROLE_ADMIN
                       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE brokers (
                         id BIGSERIAL PRIMARY KEY,
                         user_id BIGINT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                         first_name VARCHAR(100) NOT NULL,
                         last_name VARCHAR(100) NOT NULL,
                         phone VARCHAR(50) NOT NULL,
                         agency_name VARCHAR(255),
                         rating NUMERIC(3, 2) DEFAULT 0.0
);

CREATE TABLE properties (
                            id BIGSERIAL PRIMARY KEY,
                            broker_id BIGINT NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
                            title VARCHAR(255) NOT NULL,
                            description TEXT,
                            property_type VARCHAR(50) NOT NULL,
                            deal_type VARCHAR(50) NOT NULL,
                            status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, RESERVED, SOLD_RENTED
                            price NUMERIC(12, 2) NOT NULL,
                            area_sqm NUMERIC(8, 2) NOT NULL,
                            floor INT,
                            total_floors INT,
                            rooms_count INT NOT NULL,
                            city VARCHAR(100) NOT NULL,
                            neighborhood VARCHAR(100),
                            address VARCHAR(255),
                            latitude NUMERIC(10, 8),
                            longitude NUMERIC(11, 8),
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE amenities (
                           id BIGSERIAL PRIMARY KEY,
                           name VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE property_amenities (
                                    property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
                                    amenity_id BIGINT NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
                                    PRIMARY KEY (property_id, amenity_id)
);


CREATE TABLE property_images (
                                 id BIGSERIAL PRIMARY KEY,
                                 property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
                                 image_url VARCHAR(500) NOT NULL,
                                 is_primary BOOLEAN DEFAULT FALSE,
                                 display_order INT DEFAULT 0
);


CREATE TABLE inquiries (
                           id BIGSERIAL PRIMARY KEY,
                           property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
                           user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
                           client_first_name VARCHAR(100) NOT NULL,
                           client_last_name VARCHAR(100) NOT NULL,
                           client_email VARCHAR(255) NOT NULL,
                           client_phone VARCHAR(50),
                           message TEXT NOT NULL,
                           is_read BOOLEAN DEFAULT FALSE,
                           created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- better performance for queries filtering by broker_id and status
CREATE INDEX idx_properties_city_price ON properties(city, price);
CREATE INDEX idx_properties_broker_id ON properties(broker_id);
CREATE INDEX idx_inquiries_property_id ON inquiries(property_id);
CREATE INDEX idx_inquiries_user_id ON inquiries(user_id);