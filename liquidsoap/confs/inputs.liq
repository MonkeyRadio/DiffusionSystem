def input_auth(args) =
  ret =
    process.read.lines(
      "/scripts/auth.sh \"#{args.user}\" \"#{args.password}\""
    )
  ret = list.hd(default="", ret)

  if ret == "true" then true else false end
end

def bearer_auth(bearer) =
  ret =
    process.read.lines(
      "/scripts/auth.sh _token \"#{bearer}\""
    )
  ret = list.hd(default="", ret)

  if ret == "true" then true else false end
end

transport = http.transport.ssl(
  certificate = "/shared/certs/#{domain}/cert.pem",
  key = "/shared/certs/#{domain}/cert_key.pem",
)

def input_harbor(name) =
  input.harbor(
    name,
    port=8080,
    auth=input_auth,
    transport=transport,
    buffer=1.,
    max=1.5,
  )
end
