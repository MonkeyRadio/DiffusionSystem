from abc import ABC, abstractmethod
from .argumentsValidator import ArgumentsValidator

class Method(ABC):
  @property
  @abstractmethod
  def name(self) -> str:
    pass

  @abstractmethod
  def call(self, arguments: ArgumentsValidator) -> None:
    pass

  @abstractmethod
  def validate(self, arguments: ArgumentsValidator) -> None:
    pass
