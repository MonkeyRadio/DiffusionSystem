import importlib
from .confs.configuration import Configuration

class ConfsManager:

  def validate(self):
    self.method_validate()
    return True
  
  def has_configuration(self, configuration_name: str) -> bool:
    try:
      conf = importlib.import_module(
        name=f".confs.{configuration_name}.__main__",
        package="cli",
        )
      if not isinstance(conf.conf, Configuration):
        return False
      return True
    except (ImportError, AttributeError) as e:
      return False
  
  def get_configuration(self, configuration_name: str) -> Configuration:
    try:
      return importlib.import_module(
        name=f".confs.{configuration_name}.__main__",
        package="cli",
        ).conf
    except ImportError:
      raise Exception('Configuration not found')
