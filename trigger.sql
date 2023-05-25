CREATE OR REPLACE FUNCTION tsv_trigger_medicalRecord()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW."tsv" =
	setweight(to_tsvector(coalesce(unaccent(NEW."hospitalName"))), 'A') ||
	setweight(to_tsvector(coalesce(unaccent(NEW."medicalName"))), 'A');
RETURN NEW;
END $$;

CREATE TRIGGER medicalRecord_tsv_trigger BEFORE INSERT OR UPDATE
OF "hospitalName", "medicalName" ON public."medicalRecord" FOR EACH ROW
EXECUTE PROCEDURE tsv_trigger_medicalRecord();

-- ===========================================

CREATE OR REPLACE FUNCTION tsv_trigger_medicalResult()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW."tsv" =
	setweight(to_tsvector(coalesce(unaccent(NEW."finalResult"))), 'A');
RETURN NEW;
END $$;

CREATE TRIGGER medicalResult_tsv_trigger BEFORE INSERT OR UPDATE
OF "finalResult" ON public."medicalResult" FOR EACH ROW
EXECUTE PROCEDURE tsv_trigger_medicalResult();


-- ===========================================

CREATE OR REPLACE FUNCTION tsv_trigger_medicalResultItem()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW."tsv" =
	setweight(to_tsvector(coalesce(unaccent(NEW."name"))), 'A') ||
	setweight(to_tsvector(coalesce(unaccent(NEW."result"))), 'A');
RETURN NEW;
END $$;

CREATE TRIGGER medicalResultItem_tsv_trigger BEFORE INSERT OR UPDATE
OF "name", "result" ON public."medicalResultItem" FOR EACH ROW
EXECUTE PROCEDURE tsv_trigger_medicalResultItem();


-- ===========================================

CREATE OR REPLACE FUNCTION tsv_trigger_medicine()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW."tsv" =
	setweight(to_tsvector(coalesce(unaccent(NEW."name"))), 'A');
RETURN NEW;
END $$;

CREATE TRIGGER medicine_tsv_trigger BEFORE INSERT OR UPDATE
OF "name" ON public."medicine" FOR EACH ROW
EXECUTE PROCEDURE tsv_trigger_medicine();


