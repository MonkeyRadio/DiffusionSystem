from ...method import Method
from ...argumentsValidator import ArgumentsValidator, ArgumentParser
import argparse

class StartArgumentsValidator(ArgumentsValidator):
  def register_arguments(self, parser: argparse.ArgumentParser) -> None:
    parser.add_argument(
      '--input_url',
      type=str,
      help='Input URL to redirect',
      required=True,
    )
    parser.add_argument(
      '--output_url',
      type=str,
      help='Output URL to redirect',
      required=True,
    )
    parser.add_argument(
      '--output_format',
      type=str,
      help='Output format',
      default='mp3',
    )
    self.parser = parser

  def validate(self) -> ArgumentParser:
    return self.parser.parse_args()

class Start(Method):
  @property
  def name(self) -> str:
    return 'start'

  def call(self) -> None:
    if self.validator is None:
      raise Exception('Validator not registered')
    args = self.validator.validate()
    print(f'Starting redirecting from {args.input_url} to {args.output_url} with format {args.output_format}')

  def validate(self, arguments: ArgumentParser) -> None:
    self.validator = StartArgumentsValidator()
    return self.validator.register_arguments(arguments)
