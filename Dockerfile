FROM centos

# This image provides a Python 2.7 environment you can use to run your Python
# applications.

EXPOSE 4567

ENV PYTHON_VERSION=2.7 \
    PATH=$HOME/.local/bin/:$PATH \
    RUBY_VERSION=2.2

USER root

RUN yum install -y epel-release

RUN yum install -y centos-release-scl
RUN yum install -y --setopt=tsflags=nodocs --enablerepo=centosplus python27 ruby python27-python-setuptools python-pip 

RUN yum clean all -y

RUN gem install bundler

RUN pip install python-bugzilla

RUN groupadd -r yellow -g 1000 && useradd -u 1000 -r -g yellow -m -d /yellowhat -s /sbin/nologin -c "Yellow user" yellow && \
    chmod 755 /yellowhat

ADD . /yellowhat

WORKDIR /yellowhat
RUN chown -R yellow:yellow .
RUN chmod -R 0777 /yellowhat

USER 1000

RUN bundle install
RUN chmod -R 0777 .gem

CMD ruby server.rb
