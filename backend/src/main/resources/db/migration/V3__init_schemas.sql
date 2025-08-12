ALTER TABLE public.orders DROP CONSTRAINT orders_status_check;
UPDATE orders
SET status = 'PENDING'
WHERE status = 'CREATED';
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'PICKED_UP'::character varying, 'IN_TRANSIT'::character varying, 'DELIVERED'::character varying, 'CANCELLED'::character varying])::text[])));