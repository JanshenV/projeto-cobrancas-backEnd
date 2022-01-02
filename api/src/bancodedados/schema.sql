drop database if exists desafio_5
create database desafio_5

create table usuarios (
	id serial primary key,
  	nome text not null,
  	email text not null unique,
  	senha text not null,
    cpf varchar(11),
    telefone text
);

create table clientes(
	id serial primary key,
	nome text not null,
	email text not null,
	cpf varchar(11) not null,
	telefone text not null,
	cep varchar(8),
	logradouro text,
	complemento text,
	bairro text,
	cidade text,
	estado text
);

create table cobrancas(
	id serial primary key,
	cliente_id int not null,
	descricao text not null,
	status text not null,
	valor float not null,
	vencimento timestamptz not null,
	data_gerada timestamptz default now(),
	foreign key(cliente_id) references clientes(id)
);