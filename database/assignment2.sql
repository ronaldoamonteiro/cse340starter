-- 1
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES (
  'Tony',
  'Stark',
  'tony@starkent.com',
  'Iam1ronM@n'
);

-- 2
UPDATE public.account SET account_type = 'Admin' WHERE account_id = '1';
-- 3
DELETE FROM public.account WHERE account_id = '1';
-- 4
UPDATE public.inventory
SET inv_description = replace(inv_description, 'the small interiors', 'a huge interior') 
WHERE inv_make = 'GM';

-- 5
SELECT inv_make, inv_model, classification_name
FROM public.inventory
INNER JOIN public.classification ON classification_name = 'Sport';

-- 6
UPDATE public.inventory
SET 
  inv_image = replace(inv_image, '/images', '/images/vehicles'),
  inv_thumbnail = replace(inv_thumbnail, '/images', '/images/vehicles');