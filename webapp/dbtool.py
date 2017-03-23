#!/usr/bin/python
# -*- coding: utf-8 -*-

from sqlalchemy import create_engine, and_
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import exc as sa_exc
from webapp.model import Base, Admin, User, LiveCourse, HisCourse, MT4strategy, MT4recommend

"""
模型操作模块，负责数据存储层
"""


class DataDB:
    engine = create_engine("mysql+pymysql://root:@localhost:3306/test?charset=utf8",
                           encoding="utf-8", echo=True)
    DBSession = sessionmaker(bind=engine, )
    Base.metadata.create_all(bind=engine, )

    def __init__(self):
        pass

    def __call__(self, **kwargs):
        pass

    def get_admin(self, obj):
        ses = self.takeSes()
        try:
            ad = ses.query(Admin).filter(
                and_(Admin.name == obj['username'],
                     Admin.password == obj['userpwd'])).one()

            ret = ad.to_dict()
            ses.close()
            return ret
        except sa_exc.NoResultFound:
            ses.close()
            return {}

    def nav_info(self):
        ses = self.takeSes()
        try:
            alls = ses.query(User).all()
            a = self.listtodict(alls)
            lives = ses.query(LiveCourse).all()
            hiss = ses.query(HisCourse).all()
            money = 0.0
            for x in a:
                money += float(x['money'])
            ret = {
                'users': len(alls),
                'lives': len(lives),
                'hiss': len(hiss),
                'sum_money': money
            }
            ses.commit()
            ses.close()
            return ret
        except:
            ses.rollback()
            ses.close()
            return {}

    #获取数据库表字段(list集合)
    #用法：self.listtodict(集合)
    def listtodict(self, ret):
        des = []
        for result in ret:
            des.append(result.to_dict())

        return des

    #获取数据库表字段(list二维集合)
    #用法：self.list2todict(二维集合)
    def list2todict(self, ret):
        des = []
        for result in ret:
            if isinstance(result, tuple):
                tmpret = {}
                for tmp in result:
                    tmpret.update(tmp.to_dict())
                des.append(tmpret)
            else:
                pass
        return des

    #获取session
    def takeSes(self):
        session = DataDB.DBSession()
        return session

    def dict_to_str(self, data):
        ret = ''
        for k in data:
            ret += k + '=' +data[k] + ','
        return ret.rstrip(',')

    def getUser(self, uid):
        ses = self.takeSes()
        try:
            user = ses.query(User).filter(User.id == uid).one()
            ret = user.to_dict()
            ses.close()
            return ret

        except sa_exc.NoResultFound:
            ses.close()
            return {}

    def addUser(self, info):
        ses = self.takeSes()
        new_user = User()
        new_user.insert_before(info)
        # new_user = User(name=info['name'] + '_abc', password=info['password'])
        # ses.add(new_user)
        try:
            ses.add(new_user)
            ses.commit()
            # result = ses.query(User).filter(User.id == 1).all()
            #
            # if len(result) == 0:
            #     raise BaseException
            # else:
            #     ret = new_user.to_dict()
            #
            #     ses.commit()
            #     ses.close()
            #     return ret
            # 此处需将关闭连接放到finally里面去做  否则获取不到id
            # ses.close()
            return new_user.id
        except:
            return False
        finally:
            ses.close()

    def changeadmin(self, obj):
        ses = self.takeSes()
        try:
            ad = ses.query(Admin).filter(Admin.name == obj['name']).one()
            ad.password = obj['password']
            ret = ad.to_dict()

            ses.commit()
            ses.close()
            return ret
        except sa_exc.NoResultFound:
            ses.rollback()
            ses.close()
            return {}

    def search(self, pdict):
        ses = self.takeSes()
        try:
            query = ses.query(User).filter(User.name.like('%' + pdict['name'] + '%'))
            ad = query.limit(10).offset(int(pdict['cur']) * 10).all()
            alls = query.all()
            if len(ad) == 0:
                raise BaseException
            else:
                allsize = len(alls)
                ret = {
                    'total': allsize,
                    'page': round(allsize / 10),
                    'cur': int(pdict['cur']),
                    'data': self.listtodict(ad),
                    'persize': 10
                }
                ses.commit()
                ses.close()
                return ret

        except:
            ses.rollback()
            ses.close()
            return {}

    def allRecord(self, page, entity):
        tmppage = int(page)
        if tmppage > 0:
            tmppage -= 1

        ses = self.takeSes()
        try:
            rets = ses.query(entity).limit(10).offset(tmppage * 10).all()
            alls = ses.query(entity).all()
            if len(rets) == 0:
                raise BaseException
            else:
                allsize = len(alls)
                ret = {
                    'total': allsize,
                    'page': round(allsize / 10),
                    'cur': page,
                    'data': self.listtodict(rets),
                    'persize': 10
                }
                ses.commit()
                ses.close()
                return ret

        except Exception as e:
            print(e)
            ses.rollback()
            ses.close()
            return {}

    def allRecordMT4(self, page):
        tmppage = int(page)
        if tmppage > 0:
            tmppage -= 1

        ses = self.takeSes()
        try:
            query = ses.query(User, MT4strategy).filter(User.id == MT4strategy.uid)
            subquery = ses.query(MT4recommend.mt4id)

            rets = query.filter(MT4strategy.mt4id.notin_(subquery)) \
                .limit(10).offset(tmppage * 10).all()

            alls = query.filter(MT4strategy.mt4id.notin_(subquery)).all()

            if len(rets) == 0:
                raise BaseException
            else:
                allsize = len(alls)
                ret = {
                    'total': allsize,
                    'page': round(allsize / 10),
                    'cur': page,
                    'data': self.list2todict(rets),
                    'persize': 10
                }
                ses.commit()
                ses.close()
                return ret

        except:
            ses.rollback()
            ses.close()
            return {}

    def getMt4Strategy(self, uid):
        ses = self.takeSes()
        try:
            mt4stra = ses.query(MT4strategy).filter(MT4strategy.uid == uid).all()
            ret = self.listtodict(mt4stra)
            ses.close()
            return ret

        except sa_exc.NoResultFound:
            ses.close()
            return {}

    def addMT4recommend(self, obj):
        ses = self.takeSes()
        new_mt4 = MT4recommend()
        new_mt4.mt4id = obj['mt4id']
        new_mt4.uid = obj['uid']
        new_mt4.uname = obj['uname']
        try:
            # 添加到session:
            ses.add(new_mt4)
            ret = new_mt4.to_dict()
            ses.commit()
            ses.close()
            return ret

        except:
            ses.rollback()
            ses.close()
            return {}

    def allRecordMT4Recommend(self, page):
        tmppage = int(page)
        if tmppage > 0:
            tmppage -= 1

        ses = self.takeSes()
        try:
            query = ses.query(MT4recommend).filter(MT4recommend.id != -1)

            rets = query.limit(10).offset(tmppage * 10).all()

            alls = query.all()

            if len(rets) == 0:
                raise BaseException
            else:
                allsize = len(alls)
                ret = {
                    'total': allsize,
                    'page': round(allsize / 10),
                    'cur': page,
                    'data': self.listtodict(rets),
                    'persize': 10
                }
                ses.commit()
                ses.close()
                return ret

        except:
            ses.rollback()
            ses.close()
            return {}

    def test(self, appid, appsecret):
        #return 'name:', name, 'age:', age, 'other:', kw
        # return 'name:', name, 'gender:', gender, 'age:', age, 'city:', city
        pass