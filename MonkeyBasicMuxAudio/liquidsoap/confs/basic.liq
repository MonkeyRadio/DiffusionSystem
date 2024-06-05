%include "outputs.liq"


set("init.allow_root", true)

set("frame.audio.samplerate", 48000)


# MONKEY Mixing and Processing

# Sources
natio = input.http("https://audio.monkeyradio.fr/diffusion/ice/monkey_mp3_mid")

radioS = add([natio])

radio = mksafe(radioS)

hls_output(radio, "monkeyradio")
