import argparse
from cli.confsManager import ConfsManager

print('Liquidsoap service manager', end='\n\n')

manager = ConfsManager()

parser = argparse.ArgumentParser(
  add_help=True,
  prog='liquidsoap-service',
  description='Liquidsoap service manager',
  
  )
parser.add_argument(
  'configuration_name',
  type=str,
  help='Liquidsoap configuration to use',
  )
parser.add_argument(
  'method',
  type=str,
  help='Method to call in the configuration',
  )

args, unknown = parser.parse_known_args()

if not manager.has_configuration(args.configuration_name):
  parser.error('Configuration not found')

configuration = manager.get_configuration(args.configuration_name)

if not configuration.methods.hasMethod(args.method):
  parser.error('Method not found in this configuration')

method = configuration.methods.getMethod(args.method)

print(f"Calling method {method.name} in configuration {configuration.name}", end='\n\n---------\n\n')

method.validate(parser)

method.call()
