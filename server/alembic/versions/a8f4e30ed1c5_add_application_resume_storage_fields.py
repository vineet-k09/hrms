"""add application resume storage fields

Revision ID: a8f4e30ed1c5
Revises: c450c971c272
Create Date: 2026-06-06 21:01:44.886643

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a8f4e30ed1c5'
down_revision: Union[str, Sequence[str], None] = 'c450c971c272'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        'applications',
        sa.Column('resume_url', sa.String(), nullable=True)
    )
    op.add_column(
        'applications',
        sa.Column('resume_key', sa.String(), nullable=True)
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('applications', 'resume_key')
    op.drop_column('applications', 'resume_url')
