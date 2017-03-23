#!/usr/bin/python
# -*- coding: utf-8 -*-
#  __author__ = 'master_zy'

from wechat_sdk import WechatConf, WechatBasic
from wechat_sdk.exceptions import NeedParamError



class WxApplication:
    AppID = "wxec1632d9ec8a5d95"
    AppSecret = "8b6bb7f5dad80ce0aa639e6db173b406"
    weConf = WechatConf(token='master_zy', appid=AppID, appsecret=AppSecret, encrypt_mode='safe', encoding_aes_key=None)
    wechat = WechatBasic(conf=weConf)

    def __init__(self):
        pass

    def __call__(self, **kwargs):
        pass

    #登陆授权验证
    def check_signature(self):
        aa = ''
        return aa

    def user_info(self):
        try:
            # user = self.wechat.get_user_info(OPENID)
            token = self.wechat.grant_token()
            print(token)
        except Exception as e:
            print(e)
            resp = str(e)
        return resp