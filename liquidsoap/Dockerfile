FROM savonet/liquidsoap:v2.2.5
USER root
RUN apt update -y
RUN apt install ladspa-sdk amb-plugins blepvco rubberband-ladspa swh-plugins curl jq -y
COPY confs /etc/liquidsoap
COPY scripts /scripts
COPY entrypoint.sh /entrypoint.sh
EXPOSE 7000
ENTRYPOINT ["/entrypoint.sh"]
