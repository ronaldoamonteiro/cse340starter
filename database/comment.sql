CREATE TABLE IF NOT EXISTS public.comment (
	comment_id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	comment_description character varying NOT NULL,
	comment_created_at TIMESTAMP NOT NULL,
	comment_updated_at TIMESTAMP NOT NULL,
	account_id integer NOT NULL,
	inv_id integer NOT NULL,
	CONSTRAINT comment_pkey PRIMARY KEY(comment_id),
	FOREIGN KEY (account_id) REFERENCES public.account(account_id),
	FOREIGN KEY (inv_id) REFERENCES public.inventory(inv_id),
	UNIQUE (account_id, inv_id)
);