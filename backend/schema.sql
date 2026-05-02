

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('admin', 'member') DEFAULT 'member'
);

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  created_by INT,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  status ENUM('todo', 'in-progress', 'done') DEFAULT 'todo',
  assigned_to INT,
  project_id INT,
  due_date DATE,
  FOREIGN KEY (assigned_to) REFERENCES users(id),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
