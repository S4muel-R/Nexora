"""INC-006: la sesión pasa a cookie HttpOnly; se elimina la tabla de tokens de DRF que quedaba en bases existentes."""

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [("accounts", "0001_initial")]

    operations = [
        migrations.RunSQL("DROP TABLE IF EXISTS authtoken_token", reverse_sql=migrations.RunSQL.noop),
    ]
