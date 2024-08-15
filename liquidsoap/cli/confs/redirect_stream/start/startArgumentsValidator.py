from ....argumentsValidator import ArgumentsValidator, ArgumentParser
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
      '--output_host',
      type=str,
      help='Output icecast host to redirect',
      required=True,
    )
    parser.add_argument(
      '--output_port',
      type=int,
      help='Output icecast port to redirect',
      required=True,
    )
    parser.add_argument(
      '--output_user',
      type=str,
      help='Output icecast user',
      default='source',
    )
    parser.add_argument(
      '--output_pw',
      type=str,
      help='Output icecast password to redirect',
      required=True,
    )
    parser.add_argument(
      '--output_mount',
      type=str,
      help='Output icecast mountPoint to redirect',
      required=True,
    )
    parser.add_argument(
      '--output_transport_proto',
      type=str,
      help='Output icecast protocol to redirect (http or https)',
      choices=['http', 'https'],
      default='http',
    )
    parser.add_argument(
      '--output_br',
      type=int,
      help='Output bitrate',
      default=128,
      choices=[32, 64, 128, 192, 256, 320],
    )
    parser.add_argument(
      '--output_sr',
      type=int,
      help='Output sample rate',
      default=44100,
      choices=[44100, 48000],
    )
    self.parser = parser

  def validate(self) -> ArgumentParser:
    return self.parser.parse_args()
