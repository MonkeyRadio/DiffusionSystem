%include "vars.liq"

log.level := 2
init.allow_root := true

in = input.http(input_url)

safe_out = mksafe(in)

transport_ssl = http.transport.ssl()

if output_transport_proto == "https" then
  output.icecast(%mp3(bitrate=output_br, samplerate=output_sr),
    host = output_host,
    port = output_port,
    user = output_user,
    password = output_pw,
    mount = output_mount,
    transport = transport_ssl,
    safe_out)
else
  output.icecast(%mp3(bitrate=output_br, samplerate=output_sr),
    host = output_host,
    port = output_port,
    user = output_user,
    password = output_pw,
    mount = output_mount,
    safe_out)
end
