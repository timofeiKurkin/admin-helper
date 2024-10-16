from sqlmodel import SQLModel, create_engine

from app.core.config import settings

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


# def init_db(session: Session) -> None:
#     super_user = session.exec(select(UserBase).where())
