%include "webserver.liq"

meta = ref([])

def get_meta(_, response) =
  response.json(meta())
end

harbor.http.register(
  port=8084,
  method="GET",
  "/metadata",
  get_meta,
  )

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
  
    response.json(meta_param)
  end
  harbor.http.register(
    port=8084,
    method="POST",
    "/metadata",
    set_meta,
    )
end
