%include "outputs.liq"
%include "icecast_creds.liq"
%include "blank_rescue.liq"

log.level := 2
init.allow_root := true

# Sources
natio = input.http(ice_output_url ^ "/natio")

stud0 = input.http(ice_output_url ^ "/stud0")

stud1 = input.http(ice_output_url ^ "/stud1")

stud2 = input.http(ice_output_url ^ "/stud2")

stud3 = input.http(ice_output_url ^ "/stud3")

stud4 = input.http(ice_output_url ^ "/stud4")

radioMixed = add([natio, stud0, stud1, stud2, stud3, stud4])

radioMixed = mksafe(radioMixed)

#Blank detection and rescue disk

radio = mksafe(blank_rescue(radioMixed, "/shared/rescue/rescue.txt"))

# Sound Processing MIXER

radio = normalize(gain_max = 10., gain_min = -5., target = -20., threshold = -40.0, window = 0.5, up = 5., down = 0.1, radio)

hls_output(radio, "monkeyradio")

ice_output(radio)
