WITH family_counts AS (
    SELECT
        employee_id,
        relation,
        COUNT(*) AS total
    FROM public.employee_family
    GROUP BY employee_id, relation
)
SELECT
    e.id AS employee_id,
    e.nik,
    e.name,
    e.is_active,
    ep.gender,
    EXTRACT(YEAR FROM age(NOW(), ep.date_of_birth)) AS age,
    ed.name AS school_name,
    ed.level,
    COALESCE(
        STRING_AGG(fc.total || ' ' || fc.relation, ' & '), 
        '-'
    ) AS family_data
FROM
    public.employee e
    INNER JOIN public.employee_profile ep ON e.id = ep.employee_id
    INNER JOIN public.education ed ON e.id = ed.employee_id
    LEFT JOIN family_counts fc ON e.id = fc.employee_id
GROUP BY
    e.id, e.nik, e.name, e.is_active, ep.gender, ep.date_of_birth, ed.name, ed.level;
