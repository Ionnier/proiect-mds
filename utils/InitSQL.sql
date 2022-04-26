drop table if exists notificationendpoints cascade;
drop index if exists unique_active_game;
drop table if exists RandomGuessOptions cascade;
drop table if exists RandomGuessGames cascade;
drop table if exists RoomParticipants cascade;
drop table if exists Rooms cascade;
drop type if exists room_roles cascade;
drop view if exists updateservices;
drop table if exists BoughtServices cascade;
drop table if exists Services cascade;
drop table if exists Users cascade;

create table Users(
	id_user serial primary key,
	user_name varchar(50) not null unique,
	user_email varchar(254) not null unique,
	user_first_name varchar(50),
	user_last_name varchar(50),
	user_password varchar(150) not null,
	user_credits real default 0 not null check(user_credits>=0),
	notification_game_finished bool default false not null,
	notification_game_created bool default false not null,
	notification_points_refresh bool default false not null
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
	service_refresh_value int not null check(service_refresh_value >= 0) default 60
);

create table BoughtServices(
	id_service integer not null,
	id_user integer not null,
	service_level integer default 1 not null check(service_level>0),
	service_last_check timestamptz default current_timestamp,
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
b.id_service,
b.service_level,
s.service_base_value,
s.service_value_modifier,
b.id_user,
floor(extract(epoch from ((current_timestamp - b.service_last_check) / s.service_refresh_value))) "times"
from
	boughtservices b
join
	services s on
	s.id_service = b.id_service
where
	b.service_last_check + interval '1 second' * (
	select
		service_refresh_value
	from
		Services s
	where
		b.id_service = s.id_service) < current_timestamp;
	
create table Rooms(
	id_room serial primary key,
	room_name varchar(50) not null default 'New Room',
	room_creation_time timestamptz not null default current_timestamp,
	room_image varchar(100)
);

CREATE TYPE room_roles AS ENUM ('Owner', 'Admin', 'Participant');

create table RoomParticipants(
	id_room int references Rooms(id_room) on delete cascade,
	id_user int references Users(id_user) on delete cascade,
	room_role room_roles not null default 'Participant',
	constraint pk_roomparticipant primary key(id_room, id_user)
);

create table RandomGuessGames(
	id_random_guess_game serial not null primary key,
	id_room int references Rooms(id_room) on delete cascade not null,
	random_guess_game_create_date timestamptz not null default current_timestamp,
	random_guess_game_finish_date timestamptz
);

CREATE UNIQUE INDEX unique_active_game
    ON RandomGuessGames
       (id_room)
 WHERE random_guess_game_finish_date IS NULL;

create table RandomGuessOptions(
	id_random_guess_game int not null references RandomGuessGames(id_random_guess_game) on delete cascade,
	id_user int not null references Users(id_user) on delete cascade,
	option_name text not null,
	winner bool default false,
	points int default 0 not null check(points>=0),
	constraint pk_rgo primary key (id_random_guess_game, id_user, option_name)
);

create table NotificationEndpoints(
	id_user int not null references Users(id_user) on delete cascade,
	endpoint text not null primary key
);

insert
	into
	public.services (service_name,
	service_description,
	service_base_price,
	service_base_value,
	service_price_modifier,
	service_value_modifier,
	service_max_level,
	service_refresh_value)
values('First Service',
'An introductive service. Doesn''t provide a lot of value but it is cheap.',
100,
1,
1.25,
1.25,
10,
60), 
('Second Service', 'Stuff is getting more advanced. Provides decent value.', 500, 10, 1.5, 1.5, 10, 120),
('Third Service', 'Getting a bit more expensive, but it will be worth it.', 2000, 10, 1.5, 5, 5, 300),
('Fourth Service', 'Lots of value but very expensive', 10000, 100, 10, 5, 5, 600),
('Fifth Service', 'This will get you everywhere', 100000, 10000, 10, 1.05, 5, 3600);