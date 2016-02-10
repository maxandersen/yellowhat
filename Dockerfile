FROM openshift/base-centos7

# This image provides a Python 2.7 environment you can use to run your Python
# applications.

EXPOSE 8080

# ------------------------------------ Python ---------------------------------

ENV PYTHON_VERSION=2.7 \
    PATH=$HOME/.local/bin/:$PATH

LABEL io.k8s.description="Platform for building and running Python 2.7 applications" \
      io.k8s.display-name="Python 2.7" \
      io.openshift.expose-services="8080:http" \
      io.openshift.tags="builder,python,python27,rh-python27"

RUN INSTALL_PKGS="python27 python27-python-devel python27-python-setuptools python27-python-pip epel-release nss_wrapper" && \
    yum install -y centos-release-scl && \
    yum install -y --setopt=tsflags=nodocs --enablerepo=centosplus $INSTALL_PKGS && \
    rpm -V $INSTALL_PKGS && \
    yum clean all -y

# ------------------------------------ Python ---------------------------------

ENV RUBY_VERSION 2.2

LABEL io.k8s.description="Platform for building and running Ruby 2.2 applications" \
      io.k8s.display-name="Ruby 2.2" \
      io.openshift.expose-services="8080:http" \
      io.openshift.tags="builder,ruby,ruby22"

RUN INSTALL_PKGS="rh-ruby22 rh-ruby22-ruby-devel rh-ruby22-rubygem-rake v8314 rh-ruby22-rubygem-bundler nodejs010" && \
    yum install -y centos-release-scl && \
    yum install -y --setopt=tsflags=nodocs  $INSTALL_PKGS && rpm -V $INSTALL_PKGS && \
    yum clean all -y


USER 1001

ADD /scouts /scouts
RUN pip install -r /scouts/scout-bugzilla.reqs

WORKDIR /scouts

CMD python scout-bugzilla.py


