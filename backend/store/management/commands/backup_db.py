"""
store/management/commands/backup_db.py
Automated database backup command.

Performs a zero-downtime, transactionally safe snapshot of the SQLite database
using SQLite's online backup API, compresses it with gzip, creates a SHA-256
integrity checksum, and enforces a retention policy.

Usage:
    python manage.py backup_db
    python manage.py backup_db --keep 14
    python manage.py backup_db --output-dir /custom/backup/path
"""

import os
import sqlite3
import gzip
import shutil
import hashlib
from datetime import datetime
from django.core.management.base import BaseCommand
from django.conf import settings


class Command(BaseCommand):
    help = "Creates a compressed, transaction-safe database backup with SHA-256 checksum and retention policy."

    def add_arguments(self, parser):
        parser.add_argument(
            "--keep",
            type=int,
            default=7,
            help="Number of latest backup archives to retain (default: 7).",
        )
        parser.add_argument(
            "--output-dir",
            type=str,
            default=None,
            help="Custom directory path to store backup files.",
        )

    def handle(self, *args, **options):
        keep_count = options["keep"]
        db_conf = settings.DATABASES.get("default", {})

        if db_conf.get("ENGINE") != "django.db.backends.sqlite3":
            self.stdout.write(
                self.style.WARNING(
                    f"backup_db currently implements optimized snapshotting for SQLite. Current engine: {db_conf.get('ENGINE')}"
                )
            )
            return

        db_path = str(db_conf.get("NAME"))
        if not os.path.exists(db_path):
            self.stdout.write(self.style.ERROR(f"Database file not found at: {db_path}"))
            return

        # Backup storage folder
        backup_dir = options["output_dir"] or os.path.join(settings.BASE_DIR, "backups")
        os.makedirs(backup_dir, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        temp_db_name = f"aw_db_{timestamp}.tmp.db"
        temp_db_path = os.path.join(backup_dir, temp_db_name)
        archive_name = f"aw_backup_{timestamp}.sqlite3.gz"
        archive_path = os.path.join(backup_dir, archive_name)
        checksum_path = os.path.join(backup_dir, f"{archive_name}.sha256")

        self.stdout.write(f"Initiating online transactional snapshot of: {db_path}...")

        # 1. Use SQLite online backup API for safe, non-blocking snapshot
        src_conn = sqlite3.connect(db_path)
        dest_conn = sqlite3.connect(temp_db_path)
        with dest_conn:
            src_conn.backup(dest_conn)
        dest_conn.close()
        src_conn.close()

        # 2. Compress the snapshot with gzip
        self.stdout.write("Compressing database snapshot with gzip...")
        with open(temp_db_path, "rb") as f_in:
            with gzip.open(archive_path, "wb", compresslevel=9) as f_out:
                shutil.copyfileobj(f_in, f_out)

        # Remove temporary uncompressed copy
        if os.path.exists(temp_db_path):
            os.remove(temp_db_path)

        # 3. Calculate SHA-256 checksum for tamper evidence & data integrity
        sha256 = hashlib.sha256()
        with open(archive_path, "rb") as f:
            while chunk := f.read(65536):
                sha256.update(chunk)
        digest = sha256.hexdigest()

        with open(checksum_path, "w", encoding="utf-8") as f:
            f.write(f"{digest}  {archive_name}\n")

        size_kb = os.path.getsize(archive_path) / 1024
        self.stdout.write(
            self.style.SUCCESS(
                f"[OK] Database backup successful!\n"
                f"  Archive:  {archive_path} ({size_kb:.1f} KB)\n"
                f"  SHA-256:  {digest}\n"
                f"  Checksum: {checksum_path}"
            )
        )

        # 4. Enforce retention policy
        all_backups = sorted(
            [f for f in os.listdir(backup_dir) if f.startswith("aw_backup_") and f.endswith(".sqlite3.gz")]
        )
        if len(all_backups) > keep_count:
            to_delete = all_backups[:-keep_count]
            for old_archive in to_delete:
                old_path = os.path.join(backup_dir, old_archive)
                old_sha = os.path.join(backup_dir, f"{old_archive}.sha256")
                if os.path.exists(old_path):
                    os.remove(old_path)
                if os.path.exists(old_sha):
                    os.remove(old_sha)
                self.stdout.write(self.style.NOTICE(f"  Purged expired backup: {old_archive}"))
