FROM centos

# This image provides a Python 2.7 environment you can use to run your Python
# applications.

EXPOSE 8080

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

ADD . /yellowhat

WORKDIR /yellowhat

RUN bundle install

CMD python scout-bugzilla.py -s https://bugs.eclipse.org -q status_whiteboard=RHT


