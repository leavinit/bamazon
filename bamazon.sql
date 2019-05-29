DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(255) NOT NULL,
	dept_name VARCHAR(255) NOT NULL,
	price   DECIMAL(13, 2) NOT NULL,
    in_stock INT NOT NULL,
    PRIMARY KEY(id));

INSERT INTO products (product_name, dept_name, price, in_stock)
VALUES ("Razor", "Bath Goods", 20.99, 500),
	("Bicylcle", "Outdoor", 200.99, 1000),
    ("Baseball", "Sports", 45.81, 200),
    ("Big Truck", "Vehicles", 35000.22, 10),
    ("Laptop PC", "Office", 299.87, 100),
    ("Football", "Sports", 40.01, 300),
    ("Pen", "Office", 30.99, 125),
    ("Hair Ties", "Beauty", 1.99, 100),
    ("Sedan", "Vehicles", 19999.99, 45),
    ("Neon Wig", "Head things", 99.97, 10000)
    


