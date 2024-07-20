%include "webserver.liq"

meta = ref([])

def get_meta(_, response) =
  response.json(meta())
end

harbor.http.register(port=webserver_port, method="GET", "/meta", get_meta)

def metadata_http_handler(source)
  def set_meta(request, response) =
    meta_param = metadata.export(request.query)
  
    ret =
      if meta_param != [] then
      source.insert_metadata(meta_param)
        "OK!"
      else
        "No metadata to add!"
    end
  
    response.html("<html><body><b>#{ret}</b></body></html>")
  end
  harbor.http.register(port=webserver_port, method="PUT", "/meta", set_meta)
end
