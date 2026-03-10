-- FUNCTION: public.dep_emp()

-- DROP FUNCTION IF EXISTS public.dep_emp();

CREATE OR REPLACE FUNCTION public.dep_emp(
	)
    RETURNS TABLE(id integer, name text, v json) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
RETURN QUERY
SELECT departments.dep_id,
departments.dep_name,
COALESCE(
json_agg(
json_build_object(
'client_id', clients.client_id,
'client_name', clients.client_name
)
) FILTER (WHERE client_id IS not null), '[]'
) as employees
FROM departments
LEFT JOIN clients ON clients.dep_id = departments.dep_id
group by departments.dep_id;
END;
$BODY$;

ALTER FUNCTION public.dep_emp()
    OWNER TO postgres;



-- PROCEDURE: public.increase_salary(integer, integer)

-- DROP PROCEDURE IF EXISTS public.increase_salary(integer, integer);

CREATE OR REPLACE PROCEDURE public.increase_salary(
	IN c_id integer,
	IN salary_amount integer)
LANGUAGE 'sql'
AS $BODY$
UPDATE clients SET client_salary = client_salary + salary_amount
WHERE client_id = c_id
$BODY$;
ALTER PROCEDURE public.increase_salary(integer, integer)
    OWNER TO postgres;


-- View: public.v_clients_departments

-- DROP VIEW public.v_clients_departments;

CREATE OR REPLACE VIEW public.v_clients_departments
 AS
 SELECT c.client_id,
    c.client_name,
    d.dep_id,
    d.dep_name,
    d.dep_location
   FROM clients c
     LEFT JOIN departments d ON c.dep_id = d.dep_id
  ORDER BY c.client_id;

ALTER TABLE public.v_clients_departments
    OWNER TO postgres;

