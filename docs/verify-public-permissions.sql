-- בדיקות בתפקיד anon; רשומות הבדיקה מבוטלות בתת-טרנזקציה.
-- אין פעולת TRUNCATE בפועל; נבדקות הרשאות בלבד. רצפי מזהים יכולים להתקדם.
do $audit$
declare
  passed integer := 0;
  inserted integer;
begin
  begin
    set local role anon;
    insert into public.reviews(name,rating,content) values ('__permissions_audit_20261027',4,'Temporary rollback-only permission check');
    get diagnostics inserted = row_count;
    if inserted <> 1 then raise exception 'Review insert failed'; end if;
    passed := passed + 1;
    insert into public.feature_requests(name,feature_text) values ('__permissions_audit_20261027','Temporary rollback-only permission check');
    get diagnostics inserted = row_count;
    if inserted <> 1 then raise exception 'Feature insert failed'; end if;
    passed := passed + 1;
    if exists(select 1 from public.reviews where status <> 'approved' or name='__permissions_audit_20261027') then raise exception 'Unapproved review visible'; end if;
    passed := passed + 1;
    begin
      insert into public.reviews(name,rating,content,status) values ('__permissions_audit_20261027',5,'Forbidden','approved');
      raise exception 'Review status forgery allowed';
    exception when insufficient_privilege then passed := passed + 1; end;
    begin
      insert into public.feature_requests(name,feature_text,status) values ('__permissions_audit_20261027','Forbidden','approved');
      raise exception 'Feature status forgery allowed';
    exception when insufficient_privilege then passed := passed + 1; end;
    begin
      insert into public.reviews(name,rating,content,created_at) values ('__permissions_audit_20261027',5,'Forbidden',now());
      raise exception 'Review timestamp forgery allowed';
    exception when insufficient_privilege then passed := passed + 1; end;
    begin
      insert into public.feature_requests(name,feature_text,created_at) values ('__permissions_audit_20261027','Forbidden',now());
      raise exception 'Feature timestamp forgery allowed';
    exception when insufficient_privilege then passed := passed + 1; end;
    begin
      perform 1 from public.feature_requests limit 1;
      raise exception 'Private feature read allowed';
    exception when insufficient_privilege then passed := passed + 1; end;
    begin
      update public.reviews set status='approved' where false;
      raise exception 'Review update privilege allowed';
    exception when insufficient_privilege then passed := passed + 1; end;
    begin
      delete from public.reviews where false;
      raise exception 'Review delete privilege allowed';
    exception when insufficient_privilege then passed := passed + 1; end;
    begin
      update public.feature_requests set status='approved' where false;
      raise exception 'Feature update privilege allowed';
    exception when insufficient_privilege then passed := passed + 1; end;
    begin
      delete from public.feature_requests where false;
      raise exception 'Feature delete privilege allowed';
    exception when insufficient_privilege then passed := passed + 1; end;
    begin
      insert into public.reviews(name,rating,content) values ('__permissions_audit_20261027',0,'Forbidden rating');
      raise exception 'Invalid rating allowed';
    exception when insufficient_privilege or check_violation then passed := passed + 1; end;
    reset role;
    if (select count(*) from public.reviews where name='__permissions_audit_20261027' and status='pending') <> 1 or
       (select count(*) from public.feature_requests where name='__permissions_audit_20261027' and status='pending') <> 1 then
      raise exception 'Default pending status missing';
    end if;
    passed := passed + 1;
    if exists (
      select 1 from (values ('anon'),('authenticated')) roles(role_name)
      cross join (values ('public.reviews'),('public.feature_requests')) tables(table_name)
      cross join (values ('UPDATE'),('DELETE'),('TRUNCATE'),('REFERENCES'),('TRIGGER'),('MAINTAIN')) privileges(privilege_name)
      where has_table_privilege(roles.role_name,tables.table_name,privileges.privilege_name)
    ) then raise exception 'Excess table permissions remain'; end if;
    passed := passed + 1;
    raise exception using errcode='ZX001',message='Rollback audit fixtures only';
  exception when sqlstate 'ZX001' then null;
  end;
  if passed <> 15 then raise exception 'Expected 15 checks, got %',passed; end if;
  if exists(select 1 from public.reviews where name='__permissions_audit_20261027') or
     exists(select 1 from public.feature_requests where name='__permissions_audit_20261027') then
    raise exception 'Audit fixtures were not rolled back';
  end if;
end $audit$;
select json_build_object('checks_passed',16,'fixtures_remaining',0,'reviews_count',(select count(*) from public.reviews),'feature_requests_count',(select count(*) from public.feature_requests)) as verification;
