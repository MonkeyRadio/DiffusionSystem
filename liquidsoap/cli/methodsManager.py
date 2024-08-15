from .method import Method

class MethodsManager:
  def __init__(self):
    self.methods = []

  def addMethod(self, method: Method) -> None:
    self.methods.append(method)

  def hasMethod(self, method_name: str) -> bool:
    for method in self.methods:
      if method.name == method_name:
        return True
    return False

  def getMethod(self, method_name: str) -> Method:
    for method in self.methods:
      if method.name == method_name:
        return method
    return None
