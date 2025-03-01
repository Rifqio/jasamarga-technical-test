insert into employee (nik, name, is_active, start_date, end_date, created_by, updated_by)
values 
('11012', 'Budi', TRUE, '2022-12-12', '2029-12-12', 'admin', 'admin'),
('11013', 'Jarot', TRUE, '2021-09-01', '2028-09-01', 'admin', 'admin');

insert into employee_profile (employee_id, place_of_birth, date_of_birth, gender, is_married, prof_pict, created_by, updated_by)
values 
(1, 'Jakarta', '1997-05-02', 'Laki-Laki', TRUE, NULL, 'admin', 'admin'),
(2, 'Sukabumi', '1996-05-02', 'Laki-Laki', FALSE, NULL, 'admin', 'admin');

insert into education (employee_id, name, level, description, created_by, updated_by)
values 
(1, 'SMKN 7 Jakarta', 'Sma', 'Sekolah Menengah Atas', 'admin', 'admin'),
(2, 'Universitas Negeri Jakarta', 'Strata 1', 'Sarjana', 'admin', 'admin');

insert into employee_family (employee_id, name, identifier, job, place_of_birth, date_of_birth, religion, is_life, is_divorced, relation, created_by, updated_by)
values 
(1, 'Marni', '32100594109960002', 'Ibu Rumah Tangga', 'Denpasar', '1995-10-17', 'Islam', TRUE, FALSE, 'Istri', 'admin', 'admin'),
(1, 'Clara', '32100594109020004', 'Pelajar', 'Bangkalan', '2008-10-17', 'Islam', TRUE, FALSE, 'Anak', 'admin', 'admin'),
(1, 'Stephanie', '32100594109020005', 'Pelajar', 'Bangkalan', '2008-10-17', 'Islam', TRUE, FALSE, 'Anak', 'admin', 'admin');

