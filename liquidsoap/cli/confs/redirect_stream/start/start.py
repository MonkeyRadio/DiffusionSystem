from ....method import Method
from ....argumentsValidator import ArgumentParser
from .startArgumentsValidator import StartArgumentsValidator
from .startArguments import StartArguments
from ....services.docker.dockerService import DockerService
import os

class Start(Method):

  def __init__(self) -> None:
    self.dockerService = DockerService()

  @property
  def name(self) -> str:
    return 'start'

  def call(self) -> None:
    if self.validator is None:
      raise Exception('Validator not registered')
    args = StartArguments(self.validator.validate())
    print(f'Starting redirecting from {args.input_url} to {args.output_transport_proto}://{args.output_host}:{args.output_port}{args.output_mount} with options: {args}')
    environments = args.to_env_dict()
    self.dockerService.run.run('liquidsoap-redirect-stream', f'', [], environments, [], 'liquidsoap-redirect-stream', args.additional_docker_args)

  def validate(self, arguments: ArgumentParser) -> None:
    self.validator = StartArgumentsValidator()
    return self.validator.register_arguments(arguments)
