"""merge migration heads

Revision ID: c450c971c272
Revises: 06124bf01cc0, 5ba60afbebad
Create Date: 2026-06-06 20:47:29.980456

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c450c971c272'
down_revision: Union[str, Sequence[str], None] = ('06124bf01cc0', '5ba60afbebad')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
