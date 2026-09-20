"""add view_count to bio_profiles

Revision ID: 5bc4dfdf987e
Revises: bd4fbf069d2c
Create Date: 2026-09-20 23:52:40.729481

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5bc4dfdf987e'
down_revision: Union[str, None] = 'bd4fbf069d2c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('bio_profiles', sa.Column('view_count', sa.Integer(), nullable=False, server_default='0'))


def downgrade() -> None:
    op.drop_column('bio_profiles', 'view_count')
