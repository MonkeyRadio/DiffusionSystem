from ...methodsManager import MethodsManager
from .start.start import Start
from ..configuration import Configuration

class RedirectStream(Configuration):
  def __init__(self):
    self.methodsManager = MethodsManager()
    self.methodsManager.addMethod(Start())

  @property
  def name(self) -> str:
    return 'redirect_stream'

  @property
  def methods(self) -> MethodsManager:
    return self.methodsManager

conf = RedirectStream()
