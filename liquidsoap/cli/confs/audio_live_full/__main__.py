from ...methodsManager import MethodsManager
from .start import Start
from ..configuration import Configuration

class AudioLiveFull(Configuration):
  def __init__(self):
    self.methodsManager = MethodsManager()
    self.methodsManager.addMethod(Start())

  @property
  def name(self) -> str:
    return 'audio_live_full'

  @property
  def methods(self) -> MethodsManager:
    return self.methodsManager

conf = AudioLiveFull()
