from abc import ABC, abstractmethod
from argparse import ArgumentParser

class ArgumentsValidator(ABC):
  @abstractmethod
  def validate(self) -> ArgumentParser:
    pass

  @abstractmethod
  def register_arguments(self, parser: ArgumentParser) -> None:
    pass
