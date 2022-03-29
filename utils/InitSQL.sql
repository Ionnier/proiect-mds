drop view updateservices;
drop table BoughtServices;
drop table Services;
drop table Users;

create table Users(
	id_user serial primary key,
	user_name varchar(50) not null unique,
	user_email varchar(254) not null unique,
	user_first_name varchar(50),
	user_last_name varchar(50),
	user_password varchar(150) not null,
	user_credits real default 0 not null check(user_credits>=0)
);

create table Services(
	id_service serial primary key,
	service_name varchar(50) not null unique,
	service_description varchar(250) not null unique,
	service_base_price real not null check(service_base_price>0),
	service_base_value real not null check(service_base_value>0),
	service_price_modifier float not null check(service_base_value>0),
	service_value_modifier float not null check(service_value_modifier>0),
	service_max_level int not null check(service_max_level>0) default 10,
	service_refresh_value int not null check(service_refresh_value >= 1000) default 1000
);

create table BoughtServices(
	id_service integer not null,
	id_user integer not null,
	service_level integer default 1 not null check(service_level>0),
	service_last_check timestamptz default now(),
	service_image varchar(500),
	constraint pk_bought_services
		primary key(id_service, id_user),
	constraint fk_user_bought_services
		foreign key(id_user)
			references Users(id_user)
				on delete cascade,
	constraint fk_service_bought_services
		foreign key(id_service)
			references Services(id_service)
				on delete cascade
);

create or replace
view UpdateServices as 
select
	b.id_service, b.service_level, s.service_base_value , s.service_value_modifier , b.id_user
from
	boughtservices b
join
	services s on s.id_service = b.id_service 
where
	b.service_last_check + interval '1 second' * (
	select
		service_refresh_value
	from
		Services s
	where
		b.id_service = s.id_service) < current_timestamp;
