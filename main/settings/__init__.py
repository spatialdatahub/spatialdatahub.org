# currently working in 
# ~/Dev/pcu_adm/webgis/main/settings/

from .base import *

try:
   from .local import *
except:
   pass

try:
    from .production import *
except:
   pass

