from .startArgumentsValidator import ArgumentParser
from ....services.docker.dockerRun import Environment

class StartArguments:
  def __init__(self, argumentParser: ArgumentParser):
    self.parser = argumentParser

  @property
  def input_url(self) -> str:
    return self.parser.input_url

  @property
  def output_host(self) -> str:
    return self.parser.output_host
  
  @property
  def output_port(self) -> int:
    return self.parser.output_port
  
  @property
  def output_user(self) -> str:
    return self.parser.output_user
  
  @property
  def output_pw(self) -> str:
    return self.parser.output_pw
  
  @property
  def output_mount(self) -> str:
    return self.parser.output_mount
  
  @property
  def output_transport_proto(self) -> str:
    return self.parser.output_transport_proto
  
  @property
  def output_br(self) -> int:
    return self.parser.output_br
  
  @property
  def output_sr(self) -> int:
    return self.parser.output_sr

  @property
  def additional_docker_args(self) -> str:
    return self.parser.additional_docker_args
  
  def to_env_dict(self) -> list[Environment]:
    return [
      Environment('INPUT_URL', self.input_url),
      Environment('OUTPUT_HOST', self.output_host),
      Environment('OUTPUT_PORT', str(self.output_port)),
      Environment('OUTPUT_USER', self.output_user),
      Environment('OUTPUT_PW', self.output_pw),
      Environment('OUTPUT_MOUNT', self.output_mount),
      Environment('OUTPUT_TRANSPORT_PROTO', self.output_transport_proto),
      Environment('OUTPUT_BR', str(self.output_br)),
      Environment('OUTPUT_SR', str(self.output_sr))
    ]
  
  def __str__(self) -> str:
    return f'input_url: {self.input_url}, output_host: {self.output_host}, output_port: {self.output_port}, output_user: {self.output_user}, output_pw: {self.output_pw}, output_mount: {self.output_mount}, output_transport_proto: {self.output_transport_proto}, output_br: {self.output_br}, output_sr: {self.output_sr}'
