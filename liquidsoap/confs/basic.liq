%include "outputs.liq"
%include "icecast_creds.liq"
%include "blank_rescue.liq"
%include "inputs.liq"
%include "metadata.liq"

log.level := 2
init.allow_root := true
settings.harbor.bind_addrs := ["0.0.0.0"]

harbor.http.static(port=8081, path="/", "/shared/certs/#{domain}/")

# Sources

stud0 = input_harbor("stud0")

stud1 = input_harbor("stud1")

stud2 = input_harbor("stud2")

stud3 = input_harbor("stud3")

stud4 = input_harbor("stud4")

studPool = add([stud0, stud1, stud2, stud3, stud4])

studPool = mksafe(studPool)

studio = buffer(fallible=true, studPool)

radio = blank_rescue(studio, "/shared/rescue/rescue.txt")

radio = mksafe(radio)

# Sound Processing MIXER

# radio = normalize(gain_max = 10., gain_min = -5., target = -20., threshold = -40.0, window = 0.5, up = 5., down = 0.1, radio)
radio = normalize(gain_max = 20.0, gain_min = -11.0, target = -10., threshold = -40.0, window = 0.1, up = 2., down = 0.1, radio)
radio = ladspa.fastlookaheadlimiter(limit=-5.0, release_time=0.08, radio)

# Metadata
radio = insert_metadata(radio)
radio.on_metadata(fun (m) -> meta := m)
metadata_http_handler(radio)

# Outputs
hls_output(radio, radio_id, program_name)

ice_output(radio, radio_id, program_name)
