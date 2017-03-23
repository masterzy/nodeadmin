from sqlalchemy import Column, Integer, Float, String, DateTime, Numeric
from sqlalchemy import ForeignKey
from sqlalchemy.ext.declarative import declarative_base
import datetime
import time

"""
实体表对象，定义模型与表的映射关系
增加转化json对象处理
"""


def convert_datetime(value):
    if value:
        return value.strftime("%Y-%m-%d %H:%M:%S")
    else:
        return ""


def convert_str2datetime(value):
    if value:
        value = 'time' + value
        t = time.strptime(value, "time%Y-%m-%d %H:%M:%S")
        d = datetime.datetime(*t[:6])
        return d
    else:
        return ""


def to_dict(self):
    ret = {}
    for col in self.__table__.columns:
        if isinstance(col.type, DateTime):
            value = convert_datetime(getattr(self, col.name))
        elif isinstance(col.type, Numeric):
            value = float(getattr(self, col.name, 0.0))
        else:
            value = getattr(self, col.name)
        ret[col.name] = value
    return ret


def insert_before(self, info):
    for col in self.__table__.columns:
        if col.name in info:
            if isinstance(col.type, DateTime):
                setattr(self, col.name, convert_str2datetime(info[col.name]))
            else:
                setattr(self, col.name, info[col.name])


# db model base
# add to_dict parse json
Base = declarative_base()

Base.to_dict = to_dict
Base.insert_before = insert_before


class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    account = Column(String(200))
    nickname = Column(String(200))
    password = Column(String(200))
    photo = Column(String(200))
    mail = Column(String(200))
    tel = Column(String(200))
    createtime = Column(DateTime)
    updatetime = Column(DateTime)


class Admin(Base):
    __tablename__ = 'admin'
    id = Column(Integer, primary_key=True)
    name = Column(String(200))
    password = Column(String(200))
