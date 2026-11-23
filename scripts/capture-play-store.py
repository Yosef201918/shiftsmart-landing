"""צילום מקומי עם נתוני הדגמה זמניים וגיבוי שנשאר מחוץ לנכסי השיווק."""
import argparse, datetime, hashlib, json, os, pathlib, sqlite3, subprocess, time, xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parent.parent
SESSION = os.environ.get('PLAY_CAPTURE_SESSION', 'play-183-light')
if SESSION not in ('play-183-light', 'play-183-dark'): raise RuntimeError('סשן צילום לא מוכר')
PRIVATE = ROOT / 'output' / ('play-store-private' if SESSION == 'play-183-light' else 'play-store-private-dark')
DEST = ROOT / 'assets' / 'app-captures' / SESSION
THEME = 'dark' if SESSION == 'play-183-dark' else 'light'
PACKAGE = 'com.yosefgabaydev.shiftsmart'
SERIAL = 'emulator-5554'

def adb(*args, data=None):
    return subprocess.run(['adb', '-s', SERIAL, *args], input=data, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True).stdout

def stop():
    adb('shell', 'am', 'force-stop', PACKAGE)

def start():
    adb('shell', 'am', 'start', '-n', PACKAGE + '/.MainActivity')

def ms(year, month, day, hour, minute=0):
    # שעון ישראל ביום הצילום: UTC+2. אין שינוי בשעון המכשיר.
    return int(datetime.datetime(year, month, day, hour, minute, tzinfo=datetime.timezone(datetime.timedelta(hours=2))).timestamp()*1000)

def seed(lang, active):
    if not (PRIVATE / 'original.tar').exists():
        raise RuntimeError('נדרש גיבוי לפני שינוי נתונים')
    stop()
    db = PRIVATE / 'demo.sqlite'
    if db.exists():
        db.unlink()
    con = sqlite3.connect(db)
    con.execute('CREATE TABLE catalystLocalStorage (key TEXT PRIMARY KEY, value TEXT NOT NULL)')
    with sqlite3.connect(PRIVATE / 'original.sqlite') as original_con:
        version = original_con.execute('PRAGMA user_version').fetchone()[0]
    con.execute(f'PRAGMA user_version={int(version)}')
    names = ['מלצרות – קפה גליל', 'שמירה – מרכז הדר'] if lang == 'he' else ['Waiter – Galil Café', 'Security – Hadar Center']
    jobs = [dict(id='demo-cafe', name=names[0], hourlyRate=45, travelExpense=22, breakMinutes=0, weekendRate=False, holidayRate=False, isDefault=True), dict(id='demo-security', name=names[1], hourlyRate=42, travelExpense=15, breakMinutes=0, weekendRate=False, holidayRate=False)]
    shifts=[]
    # כל המשמרות הסתיימו בעבר; אין אירוע בחירות או תעריף זמני.
    for month, days in [(9,[2,4,7,9,11,14,16,18,21,23,25]),(10,[1,4,5,7,8,11,12,14,15,18,19,21,22,25,26,28,29])]:
        for i, day in enumerate(days):
            j=jobs[i%2]; begin=ms(2026,month,day,8 if i%2 == 0 else 16,0)
            shifts.append(dict(id=f'demo-{month}-{day}',startTime=begin,endTime=begin+int((7+((i%3)*.25))*3600000),jobId=j['id'],jobName=j['name'],hourlyRate=j['hourlyRate'],travelExpense=j['travelExpense'],breakMinutes=0,weekendRate=False,holidayRate=False,holidayOverride='auto',tip=0,tag='morning' if i%2==0 else 'evening'))
    # דוגמת נובמבר אחת שהסתיימה לפני תחילת המשמרת הפעילה.
    j=jobs[0]; shifts.append(dict(id='demo-nov-1',startTime=ms(2026,11,1,6),endTime=ms(2026,11,1,9),jobId=j['id'],jobName=j['name'],hourlyRate=45,travelExpense=22,breakMinutes=0,weekendRate=False,holidayRate=False,tip=0,tag='morning'))
    vals={
        'jobs': jobs, 'selected_job':'demo-cafe', 'shifts':shifts, 'scheduled_shifts':[],
        'monthly_target':7500,'monthly_target_purpose':'','monthly_target_emoji':'',
        'developer_mode':False,'custom_shift_tags':[], 'calendar_sync_enabled':False,
        'biometric_enabled':True,'has_seen_onboarding':True,'last_seen_version':'1.8.3',
        'has_requested_review':True,'last_backup_reminder_at':int(time.time()*1000),
        'last_backup_at':int(time.time()*1000),'shifts_since_backup':0,
        'app_preferences':{'hideAppAmounts':False,'vibrationEnabled':True,'soundsEnabled':True,'hasSeenWidgetPromo':True,'widgetPromoDismissedForever':True,'exactAlarmHintShown':True},
        'deductions_breakdown':{},'time_off_quotas':{},'time_off_log':[],
        'active_shift':dict(id='demo-active',startTime=int(time.time()*1000)-int(2.25*3600000),jobId=j['id'],jobName=j['name'],hourlyRate=45,travelExpense=22,breakMinutes=0,weekendRate=False,holidayRate=False,location=None,tag='morning') if active else None
    }
    if (PRIVATE/'demo-plan.json').exists():
        plans=json.loads((PRIVATE/'demo-plan.json').read_text(encoding='utf8'))
        for plan in plans: plan['jobName']=names[0]
        vals['scheduled_shifts']=plans
    for key,value in vals.items():
        con.execute('INSERT INTO catalystLocalStorage VALUES (?,?)',('@shift_manager/'+key,json.dumps(value,ensure_ascii=False)))
    con.execute('INSERT INTO catalystLocalStorage VALUES (?,?)',('@shift_manager/locale',lang))
    con.execute('INSERT INTO catalystLocalStorage VALUES (?,?)',('@shift_manager/theme',THEME))
    con.commit();con.close()
    adb('shell','run-as',PACKAGE,'rm','-f','databases/RKStorage-journal','databases/RKStorage-wal','databases/RKStorage-shm')
    adb('exec-in','run-as',PACKAGE,'tee','databases/RKStorage',data=db.read_bytes())
    start()
    print('נטענו נתוני דמו זמניים בלבד; שפה:',lang,'משמרת פעילה:',active)

def state():
    adb('shell','uiautomator','dump','/sdcard/play-capture.xml')
    xml=adb('shell','cat','/sdcard/play-capture.xml')
    nodes=ET.fromstring(xml).iter('node')
    print('\n'.join(f"{n.attrib.get('text','')} | {n.attrib.get('content-desc','')} | {n.attrib.get('bounds','')}" for n in nodes if n.attrib.get('text') or n.attrib.get('content-desc')))

parser=argparse.ArgumentParser()
parser.add_argument('action',choices=['backup','seed','restart','saveplan','state','tap','swipe','snap','restore'])
parser.add_argument('args',nargs='*')
ns=parser.parse_args()
PRIVATE.mkdir(parents=True,exist_ok=True)
if ns.action=='backup':
    if (PRIVATE/'original.tar').exists(): raise RuntimeError('גיבוי קיים; לא דורסים')
    stop()
    data=adb('exec-out','run-as',PACKAGE,'tar','-cf','-','databases','shared_prefs')
    (PRIVATE/'original.tar').write_bytes(data)
    original=adb('exec-out','run-as',PACKAGE,'cat','databases/RKStorage')
    (PRIVATE/'original.sqlite').write_bytes(original)
    (PRIVATE/'backup.json').write_text(json.dumps({'sha256':hashlib.sha256(data).hexdigest(),'databaseSha256':hashlib.sha256(original).hexdigest(),'device':SERIAL}),encoding='utf8')
    print('נשמר גיבוי מקומי פרטי, ללא הצגת תוכנו. האפליקציה עצורה.')
elif ns.action=='seed': seed(ns.args[0],len(ns.args)>1 and ns.args[1]=='active')
elif ns.action=='restart':
    stop();start()
elif ns.action=='saveplan':
    stop()
    target=PRIVATE/'current-demo.sqlite'
    target.write_bytes(adb('exec-out','run-as',PACKAGE,'cat','databases/RKStorage'))
    with sqlite3.connect(target) as con:
        value=con.execute('SELECT value FROM catalystLocalStorage WHERE key=?',('@shift_manager/scheduled_shifts',)).fetchone()
    (PRIVATE/'demo-plan.json').write_text(value[0] if value else '[]',encoding='utf8')
    print('נשמרו נתוני התכנון הפיקטיביים להמשך הצילום בלבד')
elif ns.action=='state': state()
elif ns.action=='tap':
    adb('shell','input','tap',*ns.args);time.sleep(.8)
elif ns.action=='swipe':
    adb('shell','input','swipe',*ns.args);time.sleep(.8)
elif ns.action=='snap':
    dest=DEST/ns.args[0]/(ns.args[1]+'.png');dest.parent.mkdir(parents=True,exist_ok=True)
    data=adb('exec-out','screencap','-p','-d','4619827259835644672');
    if not data.startswith(b'\x89PNG'): raise RuntimeError('צילום אינו PNG')
    dest.write_bytes(data);print(dest)
elif ns.action=='restore':
    stop()
    adb('shell','run-as',PACKAGE,'rm','-f','databases/RKStorage-journal','databases/RKStorage-wal','databases/RKStorage-shm')
    adb('exec-in','run-as',PACKAGE,'tar','-xf','-',data=(PRIVATE/'original.tar').read_bytes())
    current=adb('exec-out','run-as',PACKAGE,'cat','databases/RKStorage')
    expected=(PRIVATE/'original.sqlite').read_bytes()
    if current!=expected: raise RuntimeError('אימות שחזור מסד נכשל; האפליקציה נשארת עצורה')
    print('מסד הנתונים המקורי שוחזר וזהה בית־לבית. ההעדפות שוחזרו מהגיבוי.')
    start()
