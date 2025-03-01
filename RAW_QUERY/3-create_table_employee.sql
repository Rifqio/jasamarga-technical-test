create table employee (
    id serial primary key,
    nik varchar(16),
    name varchar(140),
    is_active boolean,
    start_date date not null,
    end_date date not null,
    created_by varchar(255),
    updated_by varchar(255),
    created_at timestamp default now() not null,
    updated_at timestamp default now() not null
)