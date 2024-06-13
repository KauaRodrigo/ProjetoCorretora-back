DROP TABLE IF EXISTS user_role;
DROP TABLE IF EXISTS sinistros;
DROP TABLE IF EXISTS "comments";
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS seguradora;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS endereco;


CREATE TABLE endereco (
	id serial4 NOT NULL,
	cep int8 NULL,
	cidade varchar(255) NULL,
	estado varchar(255) NULL,
	rua varchar(255) NULL,
	bairro varchar(255) NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT endereco_pkey PRIMARY KEY (id)
);


CREATE TABLE roles (
	id serial4 NOT NULL,
	"name" varchar(255) NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT roles_pkey PRIMARY KEY (id)
);


CREATE TABLE seguradora (
	id serial4 NOT NULL,
	nome varchar(255) NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT seguradora_pkey PRIMARY KEY (id)
);


CREATE TABLE users (
	id serial4 NOT NULL,
	"name" varchar(255) NULL,
	email varchar(255) NULL,
	"password" varchar(255) NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT users_pkey PRIMARY KEY (id)
);


CREATE TABLE clientes (
	id serial4 NOT NULL,
	"name" varchar(255) NULL,
	"seguradoraId" int4 NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT clientes_pkey PRIMARY KEY (id),
	CONSTRAINT "clientes_seguradoraId_fkey" FOREIGN KEY ("seguradoraId") REFERENCES seguradora(id) ON UPDATE CASCADE
);


CREATE TABLE "comments" (
	id serial4 NOT NULL,
	conteudo text NULL,
	"userId" int4 NULL,
	"sinistroId" int4 NULL,
	"deletedAt" timestamptz NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT comments_pkey PRIMARY KEY (id),
	CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON UPDATE CASCADE
);


CREATE TABLE sinistros (
	id serial4 NOT NULL,
	codigo int8 NOT NULL,
	placa varchar(255) NULL,
	evento varchar(255) NULL,
	terceiro bool NOT NULL,
	caminho varchar(255) NULL,
	tipo "enum_sinistros_tipo" NOT NULL,
	status "enum_sinistros_status" NULL,
	"deletedAt" timestamptz NULL,
	"clienteId" int4 NULL,
	"enderecoId" int4 NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT sinistros_pkey PRIMARY KEY (id),
	CONSTRAINT "sinistros_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES clientes(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "sinistros_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES endereco(id) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE user_role (
	"userId" int4 NOT NULL,
	"roleId" int4 NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT user_role_pkey PRIMARY KEY ("userId", "roleId"),
	CONSTRAINT "user_role_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "user_role_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);