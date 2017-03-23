#!/usr/bin/python
# -*- coding: utf-8 -*-
import logging
import logging.config
import json
import urllib.request
import urllib.response
import urllib.parse

from flask import request
from flask import Flask, url_for, redirect, abort, render_template
from webapp import dbtool
from webapp import wxapp
from webapp import model


app = Flask(__name__)

# log
# logging.config.fileConfig("logger.conf")
# logger = logging.getLogger("example02")
DAO = dbtool.DataDB()
WX = wxapp.WxApplication()
# 测试


logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# db


@app.route("/cms/", methods=['GET'])
def login_html():
    return app.send_static_file('login.html')


@app.route("/cms/main", methods=['GET'])
def cms_html():
    return app.send_static_file('cms.html')


@app.route("/cms/login", methods=['POST'])
def act_login():
    para = request.get_data().decode()
    pdict = json.loads(para)
    return json.dumps(DAO.get_admin(pdict))


@app.route("/cms/admin", methods=['POST'])
def act_admin_info():
    para = request.get_data().decode()
    pdict = json.loads(para)
    return json.dumps(DAO.get_admin(pdict))


@app.route("/cms/adminchange", methods=['POST'])
def act_admin_change():
    para = request.get_data().decode()
    pdict = json.loads(para)
    return json.dumps(DAO.changeadmin(pdict))


@app.route("/cms/navinfo", methods=['GET'])
def act_nav_info():
    return json.dumps(DAO.nav_info())


@app.route("/cms/user/add", methods=['POST'])
def act_user_add():
    para = request.get_data().decode()
    pdict = json.loads(para)
    return json.dumps(DAO.addUser(pdict))


@app.route("/cms/user/get/<uid>", methods=['GET'])
def act_user_get(uid):
    try:
        return json.dumps(DAO.getUser(uid))
    finally:
        logger.warning("warn1")


@app.route("/cms/mt4strategy/get/<uid>", methods=['GET'])
def act_mt4strategy_get(uid):
    try:
        obj = DAO.getMt4Strategy(uid)
        mt4ids = ''
        for tmp in obj:
            mt4ids = tmp['mt4id']

        paradata = {'mt4idlist': mt4ids}

        if paradata['mt4idlist']:
            ret = http_get(paradata)
        else:
            ret = {}

        return json.dumps(ret)
    finally:
        logger.warning("warn1")


@app.route("/cms/mt4recommend/all/<page>", methods=['GET'])
def act_mt4recommend_get_all(page):
    try:
        obj = DAO.allRecordMT4Recommend(page)
        if getattr(obj, 'data', None):
            mt4ids = ''
            for tmp in obj['data']:
                mt4ids = tmp['mt4id']
                mt4ids += ','
            mt4ids = mt4ids[:-1]
            paradata = {'mt4idlist': mt4ids}

            if getattr(paradata, 'mt4idlist', None):
                ret = http_get(paradata)
            else:
                ret = {}

            obj['data'] = ret['data']

        return json.dumps(obj)
    finally:
        logger.warning("warn1")


@app.route("/cms/mt4strategy/save", methods=['POST'])
def act_mt4recommend_save():
    para = request.get_data().decode()
    pdict = json.loads(para)
    obj = DAO.addMT4recommend(pdict)
    return json.dumps(obj)


# search service


@app.route("/cms/search", methods=['POST'])
def act_user_search():
    para = request.get_data().decode()
    ddict = json.loads(para)
    pdict = json.loads(para)
    tmppage = int(pdict['cur'])
    if tmppage > 0:
        tmppage -= 1
    pdict['cur'] = tmppage
    obj = DAO.search(pdict)
    obj['cur'] = ddict['cur']
    return json.dumps(obj)


# all record & pageable
# live & his & user entity


@app.route("/cms/live/all/<page>", methods=['GET'])
def act_live_get_all(page):
    return json.dumps(DAO.allRecord(page, model.LiveCourse))


@app.route("/cms/his/all/<page>", methods=['GET'])
def act_his_get_all(page):
    return json.dumps(DAO.allRecord(page, model.HisCourse))


@app.route("/cms/user/all/<page>", methods=['GET'])
def act_user_get_all(page):
    return json.dumps(DAO.allRecord(page, model.User))


@app.route("/cms/mt4strategy/all/<page>", methods=['GET'])
def act_mt4strategy_get_all(page):
    return json.dumps(DAO.allRecordMT4(page))


def http_get(para):
    para = json.dumps(para, separators=(',', ':'))
    para = '''action=MT4listInfo&json=''' + para
    print(para)
    para = 'http://118.178.95.73/Bonanza/Mt4Interface.ashx?' + para

    req = urllib.request.Request(method='GET',
                                 url=para)
    resp = urllib.request.urlopen(req)
    ret = resp.read().decode()
    ret = json.loads(ret)
    print(ret)
    return ret


if __name__ == "__main__":
    app.run(host='127.0.0.1', port=3000, debug=True)
