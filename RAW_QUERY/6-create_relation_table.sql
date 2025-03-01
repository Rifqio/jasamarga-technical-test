alter table employee_profile
add constraint fk_employee_profile foreign key (employee_id) 
references employee(id) on delete cascade;

alter table education
add constraint fk_education foreign key (employee_id) 
references employee(id) on delete cascade;

alter table employee_family
add constraint fk_employee_family foreign key (employee_id) 
references employee(id) on delete cascade;
