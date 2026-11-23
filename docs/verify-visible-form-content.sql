WITH samples(label, value, expected) AS (VALUES
('null', NULL::text, false),('empty','',false),('spaces','   ',false),
('newlines',chr(9)||chr(10),false),('nbsp',chr(160),false),
('rtl_only',chr(8207),false),('zero_width',chr(8203)||chr(8288),false),
('mixed_invisible',chr(160)||chr(8207)||chr(65279),false),
('hebrew','תודה רבה',true),('english','Great app',true),
('emoji','👍',true),('hebrew_with_direction','יוסף'||chr(8207),true))
SELECT label, expected, (value IS NOT NULL AND char_length(regexp_replace(value, U&'[\0001-\0020\007f-\00a0\00ad\034f\061c\1680\180e\2000-\200f\2028-\202f\205f\2060-\206f\3000\feff]', '', 'g')) > 0) AS actual,
((value IS NOT NULL AND char_length(regexp_replace(value, U&'[\0001-\0020\007f-\00a0\00ad\034f\061c\1680\180e\2000-\200f\2028-\202f\205f\2060-\206f\3000\feff]', '', 'g')) > 0) = expected) AS passed FROM samples;
