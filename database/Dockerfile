FROM dbeaver/cloudbeaver:latest
RUN groupadd cloudbeaver
RUN useradd -ms /bin/bash -g cloudbeaver cloudbeaver
RUN chown -R cloudbeaver ./
USER cloudbeaver