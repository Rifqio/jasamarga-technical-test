create type gender as enum ('Laki-Laki', 'Perempuan');
create table employee_profile (
    id serial primary key,
    employee_id integer not null,
    place_of_birth varchar(100),
    date_of_birth date,
    gender gender,
    is_married boolean,
    prof_pict varchar(255),
    created_by varchar(255),
    updated_by varchar(255),
    created_at timestamp default now(),
    updated_at timestamp default now()
)