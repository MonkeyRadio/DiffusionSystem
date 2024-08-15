from .dockerRun import DockerRun

class DockerService:
  def __init__(self) -> None:
    self.dockerRun = DockerRun()

  @property
  def run(self):
    return DockerRun()
