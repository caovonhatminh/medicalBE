PGDMP         ,        
        {            medical     12.12 (Debian 12.12-1.pgdg110+1) #   14.6 (Ubuntu 14.6-0ubuntu0.22.04.1)      �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16384    medical    DATABASE     [   CREATE DATABASE medical WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';
    DROP DATABASE medical;
                postgres    false                        3079    16468    unaccent 	   EXTENSION     <   CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;
    DROP EXTENSION unaccent;
                   false            �           0    0    EXTENSION unaccent    COMMENT     P   COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';
                        false    2            �            1255    16456    tsv_trigger_medicalrecord()    FUNCTION       CREATE FUNCTION public.tsv_trigger_medicalrecord() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN NEW."tsv" =
	setweight(to_tsvector(coalesce(unaccent(NEW."hospitalName"))), 'A') ||
	setweight(to_tsvector(coalesce(unaccent(NEW."medicalName"))), 'A');
RETURN NEW;
END $$;
 2   DROP FUNCTION public.tsv_trigger_medicalrecord();
       public          postgres    false            �            1255    16458    tsv_trigger_medicalresult()    FUNCTION     �   CREATE FUNCTION public.tsv_trigger_medicalresult() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN NEW."tsv" =
	setweight(to_tsvector(coalesce(unaccent(NEW."finalResult"))), 'A');
RETURN NEW;
END $$;
 2   DROP FUNCTION public.tsv_trigger_medicalresult();
       public          postgres    false            �            1255    16460    tsv_trigger_medicalresultitem()    FUNCTION       CREATE FUNCTION public.tsv_trigger_medicalresultitem() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN NEW."tsv" =
	setweight(to_tsvector(coalesce(unaccent(NEW."name"))), 'A') ||
	setweight(to_tsvector(coalesce(unaccent(NEW."result"))), 'A');
RETURN NEW;
END $$;
 6   DROP FUNCTION public.tsv_trigger_medicalresultitem();
       public          postgres    false            �            1255    16462    tsv_trigger_medicine()    FUNCTION     �   CREATE FUNCTION public.tsv_trigger_medicine() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN NEW."tsv" =
	setweight(to_tsvector(coalesce(unaccent(NEW."name"))), 'A');
RETURN NEW;
END $$;
 -   DROP FUNCTION public.tsv_trigger_medicine();
       public          postgres    false            �            1259    16409    medicalRecord    TABLE       CREATE TABLE public."medicalRecord" (
    _id uuid NOT NULL,
    "hospitalName" text,
    "medicalName" text,
    "createAt" date,
    "updateAt" date,
    status text,
    "startDate" date,
    "fullName" text,
    phone text,
    address text,
    birthday text,
    tsv tsvector
);
 #   DROP TABLE public."medicalRecord";
       public         heap    postgres    false            �            1259    16417    medicalResult    TABLE     �   CREATE TABLE public."medicalResult" (
    _id uuid NOT NULL,
    "medicalRecord" uuid,
    date date,
    "finalResult" text,
    "medicineImage" text,
    appointment date,
    status text,
    doctor text,
    phone text,
    tsv tsvector
);
 #   DROP TABLE public."medicalResult";
       public         heap    postgres    false            �            1259    16430    medicalResultItem    TABLE     �   CREATE TABLE public."medicalResultItem" (
    _id uuid NOT NULL,
    "medicalResult" uuid,
    name text,
    result text,
    image text,
    tsv tsvector
);
 '   DROP TABLE public."medicalResultItem";
       public         heap    postgres    false            �            1259    16443    medicine    TABLE     �   CREATE TABLE public.medicine (
    _id uuid NOT NULL,
    "medicalResult" uuid,
    name text,
    quantity text,
    "isAfter" boolean,
    morning text,
    afternoon text,
    night text,
    tsv tsvector
);
    DROP TABLE public.medicine;
       public         heap    postgres    false            �            1259    16401    users    TABLE     �   CREATE TABLE public.users (
    _id uuid NOT NULL,
    username text,
    password text,
    "fullName" text,
    avatar text,
    phone text,
    address text,
    birthday date,
    role text
);
    DROP TABLE public.users;
       public         heap    postgres    false            �          0    16409    medicalRecord 
   TABLE DATA           �   COPY public."medicalRecord" (_id, "hospitalName", "medicalName", "createAt", "updateAt", status, "startDate", "fullName", phone, address, birthday, tsv) FROM stdin;
    public          postgres    false    204   +       �          0    16417    medicalResult 
   TABLE DATA           �   COPY public."medicalResult" (_id, "medicalRecord", date, "finalResult", "medicineImage", appointment, status, doctor, phone, tsv) FROM stdin;
    public          postgres    false    205   �-       �          0    16430    medicalResultItem 
   TABLE DATA           ]   COPY public."medicalResultItem" (_id, "medicalResult", name, result, image, tsv) FROM stdin;
    public          postgres    false    206   �0       �          0    16443    medicine 
   TABLE DATA           s   COPY public.medicine (_id, "medicalResult", name, quantity, "isAfter", morning, afternoon, night, tsv) FROM stdin;
    public          postgres    false    207   �1       �          0    16401    users 
   TABLE DATA           l   COPY public.users (_id, username, password, "fullName", avatar, phone, address, birthday, role) FROM stdin;
    public          postgres    false    203   �2       ,           2606    16416     medicalRecord medicalRecord_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public."medicalRecord"
    ADD CONSTRAINT "medicalRecord_pkey" PRIMARY KEY (_id);
 N   ALTER TABLE ONLY public."medicalRecord" DROP CONSTRAINT "medicalRecord_pkey";
       public            postgres    false    204            0           2606    16437 (   medicalResultItem medicalResultItem_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public."medicalResultItem"
    ADD CONSTRAINT "medicalResultItem_pkey" PRIMARY KEY (_id);
 V   ALTER TABLE ONLY public."medicalResultItem" DROP CONSTRAINT "medicalResultItem_pkey";
       public            postgres    false    206            .           2606    16424     medicalResult medicalResult_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public."medicalResult"
    ADD CONSTRAINT "medicalResult_pkey" PRIMARY KEY (_id);
 N   ALTER TABLE ONLY public."medicalResult" DROP CONSTRAINT "medicalResult_pkey";
       public            postgres    false    205            2           2606    16450    medicine medicine_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.medicine
    ADD CONSTRAINT medicine_pkey PRIMARY KEY (_id);
 @   ALTER TABLE ONLY public.medicine DROP CONSTRAINT medicine_pkey;
       public            postgres    false    207            *           2606    16408    users users_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    203            6           2620    16457 '   medicalRecord medicalrecord_tsv_trigger    TRIGGER     �   CREATE TRIGGER medicalrecord_tsv_trigger BEFORE INSERT OR UPDATE OF "hospitalName", "medicalName" ON public."medicalRecord" FOR EACH ROW EXECUTE FUNCTION public.tsv_trigger_medicalrecord();
 B   DROP TRIGGER medicalrecord_tsv_trigger ON public."medicalRecord";
       public          postgres    false    204    208    204    204            7           2620    16459 '   medicalResult medicalresult_tsv_trigger    TRIGGER     �   CREATE TRIGGER medicalresult_tsv_trigger BEFORE INSERT OR UPDATE OF "finalResult" ON public."medicalResult" FOR EACH ROW EXECUTE FUNCTION public.tsv_trigger_medicalresult();
 B   DROP TRIGGER medicalresult_tsv_trigger ON public."medicalResult";
       public          postgres    false    205    209    205            8           2620    16461 /   medicalResultItem medicalresultitem_tsv_trigger    TRIGGER     �   CREATE TRIGGER medicalresultitem_tsv_trigger BEFORE INSERT OR UPDATE OF name, result ON public."medicalResultItem" FOR EACH ROW EXECUTE FUNCTION public.tsv_trigger_medicalresultitem();
 J   DROP TRIGGER medicalresultitem_tsv_trigger ON public."medicalResultItem";
       public          postgres    false    206    206    206    210            9           2620    16463    medicine medicine_tsv_trigger    TRIGGER     �   CREATE TRIGGER medicine_tsv_trigger BEFORE INSERT OR UPDATE OF name ON public.medicine FOR EACH ROW EXECUTE FUNCTION public.tsv_trigger_medicine();
 6   DROP TRIGGER medicine_tsv_trigger ON public.medicine;
       public          postgres    false    211    207    207            4           2606    16438 6   medicalResultItem medicalResultItem_medicalReuslt_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."medicalResultItem"
    ADD CONSTRAINT "medicalResultItem_medicalReuslt_fkey" FOREIGN KEY ("medicalResult") REFERENCES public."medicalResult"(_id);
 d   ALTER TABLE ONLY public."medicalResultItem" DROP CONSTRAINT "medicalResultItem_medicalReuslt_fkey";
       public          postgres    false    2862    206    205            3           2606    16425 .   medicalResult medicalResult_medicalRecord_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."medicalResult"
    ADD CONSTRAINT "medicalResult_medicalRecord_fkey" FOREIGN KEY ("medicalRecord") REFERENCES public."medicalRecord"(_id);
 \   ALTER TABLE ONLY public."medicalResult" DROP CONSTRAINT "medicalResult_medicalRecord_fkey";
       public          postgres    false    2860    204    205            5           2606    16451 $   medicine medicine_medicalResult_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.medicine
    ADD CONSTRAINT "medicine_medicalResult_fkey" FOREIGN KEY ("medicalResult") REFERENCES public."medicalResult"(_id);
 P   ALTER TABLE ONLY public.medicine DROP CONSTRAINT "medicine_medicalResult_fkey";
       public          postgres    false    207    205    2862            �   �  x�Ŕ�n�@��ݧ��s��;DC(�V�f.��
iA"AJMA�D(�(�H���ț0�B@HI!�e[�o����\������U� �aJu�œG�������*n�,��������c���m���ŗ���e1V�Bx}q�����p������-Kw�����V(� �o��rKk�
������@.�P��P��)]�bwV���q�R����Q3���ц�Z*�j��&�8k|B/~*z|tEK�VOO6�B��A�:��:n������"u�~9�V���v�]�*eg8��I���N�q��2�!��mnV�4V�3ض ��Lb���p��j�{�]w�v��G�ȼ����̼3�\�U�I����kF��T.����cd����W����;�{h�M^
�����-D�3QT�0a�z�'n��fj3 ������L5�vv��B�:H�yg"{�5����U��qh?C�Ij�=4Ƥ��@J΀rni4���2Z){���-��X��-��GfЈi�`Rj�6�v-�/�T�F��ܮ־�^�fjv<6�ZH�}�:��%�XJ���uK��4� ���gh��4�q)�bOA�d��q)4�7HK�먧�,.� �K���/���]nⲝ�\�C��v�N�s���-�Co�޺O��r�B*2       �     x���?�\E�㷧p�QY������'�����F"���D���S"bR[܃�Po{g��4���7������p��T�N��*���]�b_�h��s�@1tA��A����# �A,Ǜo�O��7��_߾����~��8n���+��FQ��V`��fݼ ��jLu?&Ra�55�P��U���`�"��rи�C6�(��P,<��k�F-�6�j�����,��E(j�2-�+��t�f�������S����$^��[�A��0�{NS��S����:,Tq{��F�e����7��Ѯ9���c�_Gދ�&K�*/��,U�6=�pm(]�a�B鑐ѝJ5T��������>Q�Ы��@1�lQ����O��EZ��w��1]m���:�'ð��v�lu�Qw����3�Hg����ki�����	�<y K>��~����0f�v�>v�t�M�st�d�i��5iep�zi��Z���zAz�Y-"e�L�y���,j���Ɓ����3�Y����{�X��fO���|�n3M�;kR'A�a�}g��Ay�P<�D��9����sվd\C��ǫ��b�9��z.���m;�S�:�l5^ٺ
>�R�w�Y
f+�es����y�y���|��cZ�%�#�N�M7Şٽ�ҿb��p�����hfH#qN)8���I.�C��D"$��	2�8J�X�iW�y��kl�<G'��f�Q��漌�� /�R��.�<x؋��L�gO�J��=�:�����Kjt̠�R��<��Y���}������@��      �   �   x�%�MJD1�u�)f�V��4����x ah�fDax��8�ŋ��"$~�ڌ71@,�Q�S�bC:*:��'f��rI ��K٨�����Q7,�����T�4C0�!^����q�����/��XC�l#甓�0h`�@j��I���f4ɞ�&�4ݾ��s���P[��U�TC��r,�P�P0<�F��������z�}���c������'�����m��$Q�      �   �   x��ͻ�0�ZZ���>L�2���!v��w��Ш�5,@�1�� �Iu�M&M��K��� 飀�@}����tv&zg���N�ܺ��a0��z�X��c�NY&�~C.����1��;.
¶@�mQ�&<ֿ�~�9� .E�      �     x�]�MO�0 ����9������'2h&�K���@��:	|z��	�����Qsc��b2�D[ c�
�BH��&�Ū�`op��'w����94�e+�~q��N���v���$����L�w��t���殟ѐW\WJ' YaQɥ�m�ql��/D��r�Ξt�K�2.�������tiʬ_�\�����_�%q����o]|(��J
����0J���TZKT[��O�D՞zW#ҮO�Ѭ���d��4��m�H����Υbײ�?��p����{k�     