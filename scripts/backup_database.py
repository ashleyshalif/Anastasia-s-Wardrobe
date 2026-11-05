import shutil, os, sqlite3, datetime

db_path = os.path.abspath('backend/db.sqlite3')
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute('PRAGMA integrity_check;')
    res = cur.fetchone()
    print('SQLite integrity:', res[0])
    
    cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [r[0] for r in cur.fetchall()]
    print('Total tables:', len(tables))
    
    cur.execute('SELECT COUNT(*) FROM store_product;')
    print('Total products:', cur.fetchone()[0])
    cur.execute('SELECT COUNT(*) FROM store_productimage;')
    print('Total product images:', cur.fetchone()[0])
    cur.execute('SELECT COUNT(*) FROM auth_user;')
    print('Total users:', cur.fetchone()[0])
    conn.close()
    
    os.makedirs('backend/backups', exist_ok=True)
    now_str = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_file = f'backend/backups/db_snapshot_{now_str}.sqlite3'
    shutil.copy2(db_path, backup_file)
    shutil.copy2(db_path, 'backend/backups/db_snapshot_latest.sqlite3')
    print(f'Database backed up successfully to: {backup_file}')
    print('Permanent fallback saved: backend/backups/db_snapshot_latest.sqlite3')

