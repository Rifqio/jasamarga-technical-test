create type religion as enum ('Islam', 'Protestan', 'Katolik', 'Buda', 'Konghucu');
create type relation_status as enum ('Suami', 'Istri', 'Anak', 'Anak Sambung')

create table employee_family (
    id serial primary key,
    employee_id integer not null,
    name varchar(255),
    identifier varchar(255),
    job varchar(255),
    place_of_birth varchar(100),
    date_of_birth date,
    religion religion,
    is_life boolean,
    is_divorced boolean,
    relation relation_status,
    created_by varchar(255),
    updated_by varchar(255),
    created_at timestamp default now() not null,
    updated_at timestamp default now() not null
)