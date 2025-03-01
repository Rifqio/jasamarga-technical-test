create type education_level as enum ('Tk', 'Sd', 'Smp', 'Sma', 'Strata 1', 'Strata 2', 'Doktor', 'Profesor');
create table education (
    id serial primary key,
    employee_id integer not null,
    name varchar(255),
    level education_level,
    description varchar(255) not null,
    created_by varchar(255) not null,
    updated_by varchar(255) not null,
    created_at timestamp default now() not null,
    updated_at timestamp default now() not null
)