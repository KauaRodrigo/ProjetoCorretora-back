DROP TABLE public.users;

CREATE TABLE public.users (
	id serial4 NOT NULL,
	"name" varchar(255) NULL,
	email varchar(255) NULL,
	"password" varchar(255) NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT users_pkey PRIMARY KEY (id)
);

DROP TABLE public.roles;

CREATE TABLE public.roles (
	id serial4 NOT NULL,
	"name" varchar(255) NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT roles_pkey PRIMARY KEY (id)
);

DROP TABLE public.seguradora;

CREATE TABLE public.seguradora (
	id serial4 NOT NULL,
	nome varchar(255) NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT seguradora_pkey PRIMARY KEY (id)
);

DROP TYPE public."enum_sinistros_status";

CREATE TYPE public."enum_sinistros_status" AS ENUM (
	'ABERTO',
	'INDENIZADO',
	'FECHADO',	
	'REPARO',
	'RETORNO_REPARO',
	'CANCELADO');

DROP TYPE public."enum_sinistros_tipo";

CREATE TYPE public."enum_sinistros_tipo" AS ENUM (
	'VEICULAR',
	'RESIDENCIAL',
	'EMPRESARIAL',
	'VIAGEM',
	'VIDA');

DROP TABLE public.endereco;

CREATE TABLE public.endereco (
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

DROP TABLE public.clientes;

CREATE TABLE public.clientes (
	id serial4 NOT NULL,
	"name" varchar(255) NULL,
	"seguradoraId" int4 NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT clientes_pkey PRIMARY KEY (id),
	CONSTRAINT "clientes_seguradoraId_fkey" FOREIGN KEY ("seguradoraId") REFERENCES public.seguradora(id) ON UPDATE CASCADE
);

DROP TABLE public."comments";

CREATE TABLE public."comments" (
	id serial4 NOT NULL,
	conteudo text NULL,
	"userId" int4 NULL,
	"sinistroId" int4 NULL,
	"deletedAt" timestamptz NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT comments_pkey PRIMARY KEY (id),
	CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE
);

DROP TABLE public.sinistros;

CREATE TABLE public.sinistros (
	id serial4 NOT NULL,
	codigo int8 NOT NULL,
	placa varchar(255) NULL,
	evento varchar(255) NULL,
	terceiro bool NOT NULL,
	caminho varchar(255) NULL,
	tipo public."enum_sinistros_tipo" NOT NULL,
	status public."enum_sinistros_status" NULL,
	"deletedAt" timestamptz NULL,
	"clienteId" int4 NULL,
	"enderecoId" int4 NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT sinistros_pkey PRIMARY KEY (id),
	CONSTRAINT "sinistros_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES public.clientes(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "sinistros_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES public.endereco(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE public.user_role;

CREATE TABLE public.user_role (
	"userId" int4 NOT NULL,
	"roleId" int4 NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT user_role_pkey PRIMARY KEY ("userId", "roleId"),
	CONSTRAINT "user_role_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "user_role_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE
);