import os

class Environment:
    def __init__(self, name: str, value: str) -> None:
        self.name = name
        self.value = value
    name: str
    value: str

class Volume:
    host: str
    container: str

class Port:
    host: str
    container: str

class DockerRun:
  def run(self, image: str, command: str, volumes: list[Volume], environment: list[Environment], ports: list[Port], name: str):
      args = {
        'volumes': ' '.join([f"-v {volume.host}:{volume.container}" for volume in volumes]),
        'environment': ' '.join([f"-e {env.name}={env.value}" for env in environment]),
        'ports': ' '.join([f"-p {port.host}:{port.container}" for port in ports]),
      }
      os.system(f"docker run -d {args['volumes']} {args['environment']} {args['ports']} --name {name} {image} {command}")

  def stop(self, containerId):
      container = self.dockerClient.containers.get(containerId)
      container.stop()

  def logs(self, containerId):
      container = self.dockerClient.containers.get(containerId)
      return container.logs()

  def remove(self, containerId):
      container = self.dockerClient.containers.get(containerId)
      container.remove()

  def exec(self, containerId, command):
      container = self.dockerClient.containers.get(containerId)
      return container.exec_run(command)

  def inspect(self, containerId):
      container = self.dockerClient.containers.get(containerId)
      return container.attrs

  def list(self):
      return self.dockerClient.containers.list(all=True)

  def prune(self):
      return self.dockerClient.containers.prune()
