from fabric.api import *

import os
import shutil
import time
import glob

env.shell = "/bin/sh -c"
env.command_prefixes = [ 'export PATH=$HOME/.virtualenvs/hyde/bin:$PATH',
                         'export VIRTUAL_ENV=$HOME/.virtualenvs/hyde' ]

def virtualenv():
    return local('source ../env/bin/activate')

def _hyde(args):
    return local('hyde %s' % args)

def regen():
    """Regenerate dev content"""
    local('rm -rf deploy')
    #gen()
    _hyde('gen -r')

def gen():
    """Generate dev content"""
    _hyde('gen')

def serve():
    """Serve dev content"""
    _hyde('serve')

def _minify(args):
    for root,dirs, files in os.walk(args):
        for f in files:
            fpath = os.path.join(root, f)
            _, ext = os.path.splitext(f)
            if ext == '.html' or ext == '.js' or ext == '.css':
                local('minify %s %s' % (fpath, fpath) );


def build():
    """Build production content"""
    #local("git checkout master")
    local("rm -rf deploy")
    conf = "site-production.yaml"
    #media = yaml.load(file(conf))['media_url']
    _hyde('gen -c %s' % conf)
    _minify('deploy')

def push():
    """Push production content to ace"""
    local("git push origin")
    local("rsync -avz deploy/ 5a5468a88aa74b8198b0bf1d12ea661f@blog-kayw.rhcloud.com:~/app-root/repo/diy")
    local("rsync -avz deploy/nginx.conf 5a5468a88aa74b8198b0bf1d12ea661f@blog-kayw.rhcloud.com:~/app-root/data/conf/nginx.conf.template")
