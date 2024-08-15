from abc import ABC, abstractmethod
from ..methodsManager import MethodsManager

class Configuration(ABC):
  @property
  @abstractmethod
  def name(self) -> str:
    pass

  @property
  @abstractmethod
  def methods(self) -> MethodsManager:
    pass
